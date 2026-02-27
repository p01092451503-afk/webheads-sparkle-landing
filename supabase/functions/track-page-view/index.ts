import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Bot classification patterns (shared between GET pixel and POST body)
const searchBotPatterns = /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|msnbot|sogou|applebot|naverbot|seznambot|facebot|facebookexternalhit|twitterbot|linkedinbot|pinterestbot/;
const aiPatterns = /gptbot|chatgpt|openai|claude|anthropic|bytespider|ccbot|cohere|perplexity|youbot|google-extended|meta-externalagent|amazonbot|claudebot|ai2bot/;
const scraperPatterns = /semrushbot|ahrefsbot|dotbot|petalbot|megaindex|serpstatbot|dataforseo|screaming frog|sitebulb|mj12bot|blexbot|rogerbot|ia_archiver|archive\.org|exabot/;

const cloudflareRanges = [
  /^104\.(16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31)\./,
  /^172\.(64|65|66|67|68|69|70|71)\./,
  /^131\.0\.72\./,
  /^141\.101\./,
  /^108\.162\./,
  /^190\.93\./,
  /^188\.114\./,
  /^197\.234\./,
  /^198\.41\./,
  /^162\.158\./,
  /^173\.245\./,
  /^103\.(21|22|31)\./,
];

function classifyVisitor(ua: string, ip: string | null): string {
  const lowerUA = ua.toLowerCase();
  if (aiPatterns.test(lowerUA)) return "ai";
  if (searchBotPatterns.test(lowerUA)) return "search_bot";
  const isCloudflareProxy = ip ? cloudflareRanges.some(r => r.test(ip)) : false;
  if (scraperPatterns.test(lowerUA) || isCloudflareProxy) return "scraper";
  return "human";
}

function extractIP(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || null;
}

async function geoLookup(ip: string | null): Promise<{ country: string | null; city: string | null }> {
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
  return { country, city };
}

// Handle GET requests from bot pixel tracking (1x1 transparent GIF)
async function handleBotPixel(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pagePath = url.searchParams.get("p") || "/";
  const ua = req.headers.get("user-agent") || "";
  const ip = extractIP(req);
  const visitor_type = classifyVisitor(ua, ip);

  // Only track bots via pixel — humans are tracked by JS SDK
  if (visitor_type === "human") {
    // Return transparent 1x1 GIF without recording
    return new Response(TRANSPARENT_GIF, {
      headers: { ...corsHeaders, "Content-Type": "image/gif", "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  }

  const { country, city } = await geoLookup(ip);
  const referer = req.headers.get("referer") || null;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  await supabase.from("page_views").insert({
    page_path: pagePath,
    referrer: referer,
    user_agent: ua,
    device_type: "bot",
    browser: "Bot",
    os: "Bot",
    ip_address: ip,
    country,
    city,
    visitor_type,
    is_first_visit: false,
  });

  return new Response(TRANSPARENT_GIF, {
    headers: { ...corsHeaders, "Content-Type": "image/gif", "Cache-Control": "no-store, no-cache, must-revalidate" },
  });
}

// 1x1 transparent GIF (43 bytes)
const TRANSPARENT_GIF = new Uint8Array([
  0x47,0x49,0x46,0x38,0x39,0x61,0x01,0x00,0x01,0x00,
  0x80,0x00,0x00,0xff,0xff,0xff,0x00,0x00,0x00,0x21,
  0xf9,0x04,0x01,0x00,0x00,0x00,0x00,0x2c,0x00,0x00,
  0x00,0x00,0x01,0x00,0x01,0x00,0x00,0x02,0x02,0x44,
  0x01,0x00,0x3b,
]);

// Handle POST requests (existing JS SDK path)
async function handlePost(req: Request): Promise<Response> {
  const body = await req.json();
  const ip = extractIP(req);
  const { country, city } = await geoLookup(ip);

  const ua = (body.user_agent || "").toLowerCase();
  let visitor_type = classifyVisitor(body.user_agent || "", ip);

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
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // GET = bot pixel tracking, POST = JS SDK tracking
    if (req.method === "GET") {
      return await handleBotPixel(req);
    }
    return await handlePost(req);
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
