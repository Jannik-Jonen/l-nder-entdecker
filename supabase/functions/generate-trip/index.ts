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

    const { duration, startMonth, budget, travelStyle, interests, climate, specificPlaces, avoidRegions, companions } = preferences || {};

    const systemPrompt = `Du bist ein erfahrener Weltreise-Planer. Erstelle basierend auf den Präferenzen eine detaillierte Weltreise-Route.

WICHTIG: Antworte ausschließlich mit einem validen JSON-Objekt (kein Markdown, kein Text drumherum).

Das JSON muss folgendes Format haben:
{
  "routeName": "Kreativer Name für die Reise",
  "description": "Kurze Beschreibung der Reise (2-3 Sätze)",
  "totalBudget": 15000,
  "currency": "EUR",
  "stops": [
    {
      "destination_name": "Bangkok",
      "destination_code": "TH",
      "coords_lat": 13.7563,
      "coords_lon": 100.5018,
      "start_date": "2026-09-01",
      "end_date": "2026-09-14",
      "daily_budget": 35,
      "currency": "EUR",
      "transport_to_next": "flight",
      "notes": "Detaillierte Tipps: Was man sehen sollte, beste Viertel, Essen, Transport vor Ort. Min. 3-4 Sätze.",
      "highlights": ["Großer Palast", "Chatuchak Markt", "Khao San Road"],
      "accommodation_tip": "Hostels ab 8€/Nacht in Khao San, Boutique-Hotels ab 25€ in Silom"
    }
  ]
}

Regeln:
- Erstelle 6-15 Stops je nach Reisedauer
- Berücksichtige realistische Reisezeiten und Transportmittel zwischen Stops
- Passe das Tagesbudget an den Reisestil und das Land an
- transport_to_next: "flight", "train", "bus", "boat", oder "car"
- Nutze echte Koordinaten für jeden Ort
- Datumsangaben im Format YYYY-MM-DD
- Die notes sollen ausführlich und hilfreich sein mit konkreten Tipps
- Berücksichtige Jahreszeiten und Klima am Zielort
- destination_code ist der ISO 3166-1 Alpha-2 Ländercode`;

    const userPrompt = `Plane eine Weltreise mit folgenden Präferenzen:

- Dauer: ${duration || 'flexibel'}
- Startmonat: ${startMonth || 'flexibel'}
- Budget: ${budget || 'mittel'} (Gesamtbudget in EUR)
- Reisestil: ${travelStyle || 'gemischt'}
- Interessen: ${interests?.join(', ') || 'vielfältig'}
- Bevorzugtes Klima: ${climate || 'egal'}
- Reisebegleitung: ${companions || '1 Person'}
${specificPlaces ? `- Muss unbedingt hin: ${specificPlaces}` : ''}
${avoidRegions ? `- Möchte vermeiden: ${avoidRegions}` : ''}

Erstelle eine optimale Route mit realistischen Zeiträumen, Budget pro Tag und ausführlichen Tipps für jeden Stop.`;

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
    
    // Parse JSON from response (handle markdown code blocks)
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
