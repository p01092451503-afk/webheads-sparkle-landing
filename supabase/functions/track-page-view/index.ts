import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Granular bot classification — returns "category_subcategory" format
const aiBotMap: [RegExp, string][] = [
  [/gptbot|chatgpt|openai/i, "ai_openai"],
  [/claude|anthropic|claudebot/i, "ai_anthropic"],
  [/bytespider/i, "ai_bytedance"],
  [/ccbot/i, "ai_commoncrawl"],
  [/cohere/i, "ai_cohere"],
  [/perplexity/i, "ai_perplexity"],
  [/youbot/i, "ai_you"],
  [/google-extended/i, "ai_google"],
  [/meta-externalagent/i, "ai_meta"],
  [/amazonbot/i, "ai_amazon"],
  [/ai2bot/i, "ai_ai2"],
];

const searchBotMap: [RegExp, string][] = [
  [/googlebot/i, "search_bot_google"],
  [/bingbot/i, "search_bot_bing"],
  [/yandex/i, "search_bot_yandex"],
  [/baiduspider/i, "search_bot_baidu"],
  [/duckduckbot/i, "search_bot_duckduckgo"],
  [/slurp/i, "search_bot_yahoo"],
  [/naverbot|yeti\//i, "search_bot_naver"],
  [/applebot/i, "search_bot_apple"],
  [/sogou/i, "search_bot_sogou"],
  [/facebot|facebookexternalhit/i, "search_bot_facebook"],
  [/twitterbot/i, "search_bot_twitter"],
  [/linkedinbot/i, "search_bot_linkedin"],
  [/pinterestbot/i, "search_bot_pinterest"],
  [/seznambot/i, "search_bot_seznam"],
  [/msnbot/i, "search_bot_msn"],
];

const scraperMap: [RegExp, string][] = [
  [/semrushbot/i, "scraper_seo_semrush"],
  [/ahrefsbot/i, "scraper_seo_ahrefs"],
  [/dotbot/i, "scraper_seo_moz"],
  [/serpstatbot/i, "scraper_seo_serpstat"],
  [/dataforseo/i, "scraper_seo_dataforseo"],
  [/screaming frog/i, "scraper_seo_screamingfrog"],
  [/sitebulb/i, "scraper_seo_sitebulb"],
  [/mj12bot/i, "scraper_seo_majestic"],
  [/megaindex/i, "scraper_seo_megaindex"],
  [/ia_archiver|archive\.org/i, "scraper_archive"],
  [/petalbot/i, "scraper_other_petalbot"],
  [/blexbot/i, "scraper_other_blexbot"],
  [/rogerbot/i, "scraper_other_rogerbot"],
  [/exabot/i, "scraper_other_exabot"],
];

const cloudflareRanges = [
  /^104\.(16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31)\./,
  /^172\.(64|65|66|67|68|69|70|71)\./,
  /^131\.0\.72\./, /^141\.101\./, /^108\.162\./, /^190\.93\./,
  /^188\.114\./, /^197\.234\./, /^198\.41\./, /^162\.158\./,
  /^173\.245\./, /^103\.(21|22|31)\./,
];

function classifyVisitor(ua: string, ip: string | null): string {
  const lowerUA = ua.toLowerCase();
  // Headless browsers & automated tools
  if (/headlesschrome|phantomjs|puppeteer|playwright|selenium|pageburst/i.test(ua)) return "scraper_headless";
  for (const [pat, type] of aiBotMap) { if (pat.test(lowerUA)) return type; }
  for (const [pat, type] of searchBotMap) { if (pat.test(lowerUA)) return type; }
  for (const [pat, type] of scraperMap) { if (pat.test(lowerUA)) return type; }
  const isCloudflareProxy = ip ? cloudflareRanges.some(r => r.test(ip)) : false;
  if (isCloudflareProxy) return "scraper_cf";
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

// 1x1 transparent GIF (43 bytes)
const TRANSPARENT_GIF = new Uint8Array([
  0x47,0x49,0x46,0x38,0x39,0x61,0x01,0x00,0x01,0x00,
  0x80,0x00,0x00,0xff,0xff,0xff,0x00,0x00,0x00,0x21,
  0xf9,0x04,0x01,0x00,0x00,0x00,0x00,0x2c,0x00,0x00,
  0x00,0x00,0x01,0x00,0x01,0x00,0x00,0x02,0x02,0x44,
  0x01,0x00,0x3b,
]);

async function handleBotPixel(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pagePath = url.searchParams.get("p") || "/";
  const ua = req.headers.get("user-agent") || "";
  const ip = extractIP(req);
  const visitor_type = classifyVisitor(ua, ip);

  if (visitor_type === "human") {
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

async function handlePost(req: Request): Promise<Response> {
  const body = await req.json();
  const ip = extractIP(req);
  const { country, city } = await geoLookup(ip);

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
      if (count && count >= 5) visitor_type = "scraper_repeated";
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
