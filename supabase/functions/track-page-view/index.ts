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

    // Extract IP from headers
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || null;

    // Geo lookup via free API
    let country: string | null = null;
    let city: string | null = null;
    if (ip && ip !== "127.0.0.1" && ip !== "::1") {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city&lang=ko`);
        if (geoRes.ok) {
          const geo = await geoRes.json();
          if (geo.status === "success") {
            country = geo.country || null;
            const parts = [geo.regionName, geo.city].filter(Boolean);
            city = parts.length > 0 ? parts.join(" ") : null;
          }
        }
      } catch (geoErr) {
        console.error("Geo lookup failed:", geoErr);
      }
    }

    // Classify visitor type: human | search_bot | scraper | ai
    const ua = (body.user_agent || "").toLowerCase();
    let visitor_type = "human";

    // Search engine crawlers (beneficial bots for SEO)
    const searchBotPatterns = /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|msnbot|sogou|applebot|naverbot|seznambot|facebot|facebookexternalhit|twitterbot|linkedinbot|pinterestbot/;
    // AI crawlers
    const aiPatterns = /gptbot|chatgpt|openai|claude|anthropic|bytespider|ccbot|cohere|perplexity|youbot|google-extended|meta-externalagent|amazonbot|claudebot|ai2bot/;
    // SEO/scraper tools & generic crawlers
    const scraperPatterns = /semrushbot|ahrefsbot|dotbot|petalbot|megaindex|serpstatbot|dataforseo|screaming frog|sitebulb|mj12bot|blexbot|rogerbot|ia_archiver|archive\.org|exabot/;
    // Cloudflare proxy IP ranges commonly used by scrapers/bots
    const isCloudflareProxy = ip ? /^104\.28\./.test(ip) : false;

    if (aiPatterns.test(ua)) visitor_type = "ai";
    else if (searchBotPatterns.test(ua)) visitor_type = "search_bot";
    else if (scraperPatterns.test(ua) || isCloudflareProxy) visitor_type = "scraper";

    // Detect repeated same-UA access from same IP (likely scraper) — check recent 10min window
    if (visitor_type === "human" && ip && body.user_agent) {
      try {
        const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        const checkSupabase = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );
        const { count } = await checkSupabase
          .from("page_views")
          .select("*", { count: "exact", head: true })
          .eq("ip_address", ip)
          .eq("user_agent", body.user_agent)
          .gte("created_at", tenMinAgo);
        if (count && count >= 5) visitor_type = "scraper";
      } catch (e) {
        console.error("Repeat UA check failed:", e);
      }
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase.from("page_views").insert({
      page_path: body.page_path,
      referrer: body.referrer || null,
      user_agent: body.user_agent || null,
      device_type: body.device_type || null,
      browser: body.browser || null,
      os: body.os || null,
      screen_width: body.screen_width || null,
      screen_height: body.screen_height || null,
      language: body.language || null,
      session_id: body.session_id || null,
      ip_address: ip,
      country,
      city,
      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      utm_term: body.utm_term || null,
      utm_content: body.utm_content || null,
      is_first_visit: body.is_first_visit || false,
      visitor_type,
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
