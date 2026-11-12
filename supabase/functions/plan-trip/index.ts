import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { generateChatCompletion, GatewayError } from 'npm:@lovable.dev/ai-gateway';
import { z } from 'npm:zod@3';

const Body = z.object({ prompt: z.string().trim().min(5).max(2000) });
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

const ITEM_TYPES = ['accommodation', 'transport', 'activity', 'sight', 'food', 'note'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const auth = req.headers.get('Authorization') ?? '';
    const url = Deno.env.get('SUPABASE_URL')!;
    const userClient = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } });
    const { data: u } = await userClient.auth.getUser(auth.replace('Bearer ', ''));
    if (!u?.user) return json({ error: 'Bitte melde dich an.' }, 401);

    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return json({ error: 'Bitte beschreibe deine Reise etwas genauer.' }, 400);
    const { prompt } = parsed.data;

    const { data: offers } = await userClient
      .from('provider_offers')
      .select('id, offer_type, title, location, country, price_from, currency, price_unit, providers(name)')
      .eq('status', 'approved')
      .limit(60);
    const offerList = (offers ?? []).map((o: any) =>
      `- id=${o.id} | ${o.offer_type} | ${o.title} | ${o.location ?? ''} ${o.country ?? ''} | ab ${o.price_from ?? '?'} ${o.currency} ${o.price_unit ?? ''}`).join('\n');
    const today = new Date().toISOString().slice(0, 10);

    const system = `Du bist ein erfahrener, nachhaltigkeitsbewusster Reiseplaner. Heute ist ${today}.
Erstelle aus dem Wunsch des Nutzers eine KOMPLETTE Reise. Antworte NUR mit JSON:
{"name": string, "description": string (2-4 Sätze), "start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD", "travelers": number, "total_budget": number, "currency": "EUR",
 "items": [{"day_number": number (1..N, null für ungeplant), "item_type": one of ${ITEM_TYPES.join('|')}, "title": string, "description": string (1-3 Sätze mit konkreten Tipps), "location": string, "start_time": "HH:MM" | null, "cost_planned": number | null (gesamt für alle Reisenden, EUR), "offer_id": string | null}]}
Regeln: Pro Tag 3-6 Einträge (Sehenswürdigkeiten, Aktivitäten, Essen). An- und Abreise als transport, bevorzugt Bahn/Bus wenn sinnvoll. Für jeden Ortswechsel eine accommodation am Ankunftstag. Realistische Kosten. Wenn kein Datum genannt ist, beginne in ca. 6 Wochen. Max 21 Tage.
Wenn ein passendes Plattform-Angebot existiert, nutze es und setze offer_id exakt. Plattform-Angebote:\n${offerList || '(keine)'}`;

    const res = await generateChatCompletion({
      model: 'openai/gpt-6-astra',
      messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });
    const content = (res as any).choices?.[0]?.message?.content ?? '';
    const plan = JSON.parse(String(content).replace(/^```json|```$/g, '').trim());

    const validOffers = new Set((offers ?? []).map((o: any) => o.id));
    const { data: route, error: rErr } = await userClient.from('trip_routes').insert({
      user_id: u.user.id, trip_type: 'trip', name: String(plan.name || 'Meine Reise').slice(0, 120),
      description: plan.description ?? null, start_date: plan.start_date || null, end_date: plan.end_date || null,
      travelers: Number(plan.travelers) || 1, total_budget: Number(plan.total_budget) || null,
      budget_currency: 'EUR', original_prompt: prompt,
    }).select('id').single();
    if (rErr) throw rErr;

    const items = (Array.isArray(plan.items) ? plan.items : []).slice(0, 150).map((it: any, i: number) => ({
      route_id: route.id,
      day_number: Number.isInteger(it.day_number) ? it.day_number : null,
      item_type: ITEM_TYPES.includes(it.item_type) ? it.item_type : 'activity',
      title: String(it.title || 'Eintrag').slice(0, 200),
      description: it.description ?? null, location: it.location ?? null,
      start_time: it.start_time ?? null,
      cost_planned: typeof it.cost_planned === 'number' ? it.cost_planned : null,
      offer_id: validOffers.has(it.offer_id) ? it.offer_id : null,
      booking_status: 'planned', sort_order: i,
    }));
    if (items.length) {
      const { error: iErr } = await userClient.from('trip_items').insert(items);
      if (iErr) throw iErr;
    }
    return json({ id: route.id });
  } catch (e) {
    console.error(e);
    if (e instanceof GatewayError) {
      const status = e.httpStatus === 429 ? 429 : e.httpStatus === 402 ? 402 : 500;
      return json({ error: status === 429 ? 'Gerade viele Anfragen – bitte gleich nochmal versuchen.' : status === 402 ? 'KI-Guthaben aufgebraucht.' : 'Die KI konnte gerade keine Reise erstellen.' }, status);
    }
    return json({ error: 'Die Reise konnte nicht erstellt werden.' }, 500);
  }
});
