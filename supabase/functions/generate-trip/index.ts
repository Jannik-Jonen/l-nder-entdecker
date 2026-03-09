import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { preferences } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const {
      duration, startMonth, budget, travelStyle, interests, climate,
      specificPlaces, avoidRegions, companions, continents, pace, specialNeeds,
    } = preferences || {};

    const systemPrompt = `Du bist ein weltklasse Reiseberater und Routenplaner mit 20 Jahren Erfahrung. Du erstellst extrem detaillierte, realistische und inspirierende Weltreise-Routen.

WICHTIG: Antworte ausschließlich mit einem validen JSON-Objekt (kein Markdown, kein Text drumherum).

Das JSON muss folgendes Format haben:
{
  "routeName": "Kreativer, inspirierender Name für die Reise",
  "description": "Ausführliche Beschreibung der Reise (3-5 Sätze). Erkläre warum diese Route perfekt zu den Vorlieben passt.",
  "totalBudget": 15000,
  "currency": "EUR",
  "stops": [
    {
      "destination_name": "Bangkok, Thailand",
      "destination_code": "TH",
      "coords_lat": 13.7563,
      "coords_lon": 100.5018,
      "start_date": "2026-09-01",
      "end_date": "2026-09-14",
      "daily_budget": 35,
      "currency": "EUR",
      "transport_to_next": "flight",
      "notes": "Extrem ausführliche Tipps – mindestens 6-8 Sätze. Beschreibe die besten Viertel zum Übernachten, lokale Geheimtipps, beste Straßenessen-Stände, Transport vor Ort (BTS, Tuk-Tuk Preise), kulturelle Dos & Don'ts, und einen Vorschlag für einen typischen Tag. Nenne auch Preisbeispiele (z.B. Pad Thai 1.50€, Hostel-Bett 8€/Nacht).",
      "highlights": ["Großer Palast & Wat Pho", "Chatuchak Wochenendmarkt", "Chinatown Street Food Tour", "Rooftop Bars in Silom", "Floating Market Damnoen Saduak"],
      "accommodation_tip": "Backpacker: NapPark Hostel ab 8€/Nacht (Khao San). Mid-Range: Ibis Styles Sukhumvit ab 30€. Luxus: Mandarin Oriental ab 250€/Nacht.",
      "local_transport": "BTS Skytrain: 0.50-1.50€ pro Fahrt. Grab (wie Uber) günstiger als Taxis. Tuk-Tuk: immer vorher Preis verhandeln.",
      "best_food": "Pad Thai bei Thip Samai (ab 1.50€), Mango Sticky Rice überall (1€), Jay Fai für Michelin-Star Street Food (25€).",
      "visa_info": "Deutsche: 30 Tage visumfrei. Verlängerung um 30 Tage möglich (60€ Gebühr)."
    }
  ]
}

REGELN:
- Erstelle ${pace === 'slow' ? '6-10' : pace === 'fast' ? '12-20' : '8-15'} Stops je nach Reisedauer und Tempo
- Berücksichtige realistische Reisezeiten und die beste Route (nicht kreuz und quer fliegen!)
- Passe das Tagesbudget REALISTISCH an Reisestil UND Land an (Thailand ≠ Norwegen)
- transport_to_next: "flight", "train", "bus", "boat", oder "car" – wähle das REALISTISCHSTE Transportmittel
- Nutze EXAKTE Koordinaten für jeden Ort
- Datumsangaben im Format YYYY-MM-DD
- Die notes MÜSSEN extrem ausführlich und nützlich sein (min 6-8 Sätze) mit konkreten Tipps, Preisen, Geheimtipps
- Berücksichtige Jahreszeiten (KEINE Regenzeit, KEIN Monsun im geplanten Zeitraum!)
- destination_code = ISO 3166-1 Alpha-2 Ländercode
- highlights: 3-5 konkrete Sehenswürdigkeiten/Aktivitäten pro Stop
- accommodation_tip: 2-3 konkrete Unterkünfte mit Preisspanne nach Reisestil
- local_transport: Wie man vor Ort am besten rumkommt mit Preisen
- best_food: 2-3 kulinarische Must-Haves mit Preisen
- visa_info: Visa-Infos für deutsche Staatsangehörige
- Die Route muss geographisch SINN MACHEN (effiziente Reihenfolge, keine unnötigen Umwege)
- Plane realistische Zeiträume: Metropolen 3-5 Tage, Regionen 5-14 Tage, je nach Tempo`;

    const userPrompt = `Plane eine epische Weltreise mit folgenden Präferenzen:

📅 ZEITRAUM:
- Dauer: ${duration || 'flexibel'}
- Startmonat: ${startMonth || 'flexibel'}

💰 BUDGET & STIL:
- Reisestil: ${travelStyle || 'gemischt'}
- Gesamtbudget: ${budget ? budget + '€' : 'Empfehlung basierend auf Reisestil und Dauer'}

👥 REISEGRUPPE: ${companions || 'Solo'}

🎯 INTERESSEN: ${interests?.length ? interests.join(', ') : 'vielfältig'}

🌡️ KLIMA: ${climate || 'egal'}

🌍 KONTINENTE: ${continents?.length ? continents.join(', ') : 'alle möglich'}

🚶 REISETEMPO: ${pace || 'ausgewogen'} (${
      pace === 'slow' ? 'wenige Orte, dafür tief eintauchen' :
      pace === 'fast' ? 'viele Orte, kurze Aufenthalte' :
      'ausgewogene Balance'
    })

${specificPlaces ? `✨ MUSS UNBEDINGT HIN:\n${specificPlaces}` : ''}
${avoidRegions ? `🚫 VERMEIDEN:\n${avoidRegions}` : ''}
${specialNeeds ? `♿ BESONDERE ANFORDERUNGEN:\n${specialNeeds}` : ''}

Erstelle eine optimale, geographisch sinnvolle Route. Jeder Stop braucht EXTREM detaillierte Tipps mit konkreten Preisen, Geheimtipps und praktischen Infos. Die Route soll inspirierend und gleichzeitig realistisch umsetzbar sein.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Zu viele Anfragen. Bitte versuche es in einer Minute erneut." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "KI-Credits aufgebraucht." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "KI-Fehler" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";
    
    let tripData;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      tripData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Konnte die KI-Antwort nicht verarbeiten. Bitte erneut versuchen." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(tripData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-trip error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unbekannter Fehler" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
