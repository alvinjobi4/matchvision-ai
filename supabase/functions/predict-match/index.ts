import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const { homeTeam, awayTeam, homeSquad, awaySquad, homeStats, awayStats } = await req.json();

    const systemPrompt = `You are MatchVision AI, an expert football match prediction engine. You analyze team data, squad information, and statistics to make detailed match predictions.

IMPORTANT: You MUST respond with ONLY valid JSON, no markdown, no code blocks, no extra text. Just the raw JSON object.

Your response must be a JSON object with this exact structure:
{
  "predictedScore": { "home": number, "away": number },
  "winProbability": { "home": number, "draw": number, "away": number },
  "confidence": number (0-100),
  "stats": {
    "possession": { "home": number, "away": number },
    "passes": { "home": number, "away": number },
    "shots": { "home": number, "away": number },
    "shotsOnTarget": { "home": number, "away": number },
    "corners": { "home": number, "away": number },
    "fouls": { "home": number, "away": number }
  },
  "predictedLineup": {
    "home": {
      "formation": "string like 4-3-3",
      "starting": [{ "name": "string", "position": "string", "number": number }],
      "substitutes": [{ "name": "string", "position": "string", "number": number }]
    },
    "away": {
      "formation": "string like 4-3-3",
      "starting": [{ "name": "string", "position": "string", "number": number }],
      "substitutes": [{ "name": "string", "position": "string", "number": number }]
    }
  },
  "bestPerformers": {
    "home": [{ "name": "string", "position": "string", "predictedRating": number, "reason": "string" }],
    "away": [{ "name": "string", "position": "string", "predictedRating": number, "reason": "string" }]
  },
  "matchAnalysis": "string - brief analysis of the match"
}

Rules:
- Use ONLY players from the provided squads
- Starting lineup must have exactly 11 players
- Substitutes should be 5-7 players
- Best performers should be top 3 from each team
- Win probabilities must sum to 100
- Possession must sum to 100
- Be realistic with predictions based on team strength`;

    const userPrompt = `Predict the match between ${homeTeam.name} (Home) vs ${awayTeam.name} (Away).

Home Team Squad: ${JSON.stringify(homeSquad?.map((p: any) => ({ name: p.name, position: p.position, number: p.number, age: p.age })) || [])}

Away Team Squad: ${JSON.stringify(awaySquad?.map((p: any) => ({ name: p.name, position: p.position, number: p.number, age: p.age })) || [])}

Home Team Recent Stats: ${JSON.stringify(homeStats || {})}
Away Team Recent Stats: ${JSON.stringify(awayStats || {})}

Provide your prediction as a JSON object.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || "";
    
    // Strip markdown code blocks if present
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const prediction = JSON.parse(content);

    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("predict-match error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
