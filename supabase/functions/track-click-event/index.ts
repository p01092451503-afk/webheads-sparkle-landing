import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || null;
    const userAgent = req.headers.get("user-agent") || null;

    // Classify visitor type from user-agent
    let visitorType = "human";
    if (userAgent) {
      const ua = userAgent.toLowerCase();
      const aiPat = /gptbot|chatgpt|openai|claude|anthropic|bytespider|ccbot|cohere|perplexity|youbot|google-extended|meta-externalagent|amazonbot|claudebot|ai2bot/i;
      const searchPat = /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|msnbot|sogou|applebot|naverbot|seznambot|facebot|facebookexternalhit|twitterbot|linkedinbot|pinterestbot/i;
      const scraperPat = /semrushbot|ahrefsbot|dotbot|petalbot|megaindex|serpstatbot|dataforseo|screaming frog|sitebulb|mj12bot|blexbot|rogerbot|ia_archiver|archive\.org|exabot|bot|spider|crawl/i;
      if (aiPat.test(ua)) visitorType = "ai";
      else if (searchPat.test(ua)) visitorType = "search_bot";
      else if (scraperPat.test(ua)) visitorType = "scraper";
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase.from("click_events").insert({
      session_id: body.session_id || null,
      page_path: body.page_path,
      element_type: body.element_type,
      element_text: body.element_text || null,
      element_id: body.element_id || null,
      ip_address: ip,
      device_type: body.device_type || null,
      browser: body.browser || null,
      user_agent: userAgent,
      visitor_type: visitorType,
    });

    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
