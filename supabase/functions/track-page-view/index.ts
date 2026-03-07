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

// Known cloud/datacenter IP ranges (likely bots with spoofed UA)
const datacenterRanges = [
  /^34\.(2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9]|1[0-4][0-9]|15[0-9]|16[0-9]|17[0-5])\./, // GCP
  /^35\.(1[5-9][0-9]|2[0-4][0-9]|25[0-5])\./, // GCP
  /^54\.(6[4-9]|[7-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\./, // AWS
  /^52\.(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.)/, // AWS
  /^13\.(5[2-9]|[6-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\./, // AWS
  /^18\.(1[6-9][0-9]|2[0-4][0-9]|25[0-5])\./, // AWS
  /^3\.(1[2-9]|2[0-9]|[3-9][0-9]|1[0-4][0-9])\./, // AWS (3.x.x.x)
  /^121\.3[6-9]\./, /^121\.4[0-9]\./, // Huawei Cloud
  /^116\.20[4-5]\./, /^116\.63\./, // Huawei Cloud
  /^124\.24[2-3]\./, // Huawei Cloud
  /^150\.10[8-9]\./, /^150\.11[0-9]\./, // Tencent Cloud
  /^43\.1(3[2-9]|[4-5][0-9])\./, // Tencent Cloud (expanded)
  /^124\.15[6-8]\./, // Tencent Cloud (HK)
  /^129\.226\./, /^43\.13[2-7]\./, // Tencent Cloud (HK additional)
  /^49\.23[2-5]\./, /^101\.3[2-9]\./, // Alibaba Cloud
  /^47\.(7[4-9]|[89][0-9]|1[0-1][0-9])\./, // Alibaba Cloud
];

// Known datacenter cities (Google, AWS, Microsoft, Huawei, Tencent, etc.)
const datacenterCities = [
  /mountain\s*view/i, /ashburn/i, /council\s*bluffs/i, /the\s*dalles/i,
  /pryor/i, /papillion/i, /boardman/i, /quincy/i, /prineville/i,
  /new\s*albany/i, /altoona/i, /maiden/i, /forest\s*city/i,
  /santa\s*clara/i, /san\s*jose/i, /reston/i, /herndon/i,
  /allston/i, /somerville/i, /des\s*moines/i, /hilliard/i,
  /columbus.*ohio/i, /dublin.*ohio/i, /sterling/i, /manassas/i, /cheyenne/i,
  /phoenix.*arizona/i, /chandler/i, /mesa.*arizona/i,
];

// Detect fake/impossible UA combinations (spoofed bots)
function hasFakeUA(ua: string): boolean {
  // Safari version 26+ doesn't exist on iOS 16
  if (/iPhone OS 16_0.*Version\/2[6-9]\./i.test(ua)) return true;
  if (/iPhone OS 16_0.*Version\/[3-9][0-9]\./i.test(ua)) return true;
  // Chrome 145+ on old iOS is suspicious
  if (/iPhone OS 1[0-5]_.*Chrome\/14[5-9]\./i.test(ua)) return true;
  return false;
}

function classifyVisitor(ua: string, ip: string | null): string {
  const lowerUA = ua.toLowerCase();
  // Headless browsers & automated tools
  if (/headlesschrome|phantomjs|puppeteer|playwright|selenium|pageburst/i.test(ua)) return "scraper_headless";
  for (const [pat, type] of aiBotMap) { if (pat.test(lowerUA)) return type; }
  for (const [pat, type] of searchBotMap) { if (pat.test(lowerUA)) return type; }
  for (const [pat, type] of scraperMap) { if (pat.test(lowerUA)) return type; }
  // Naver in-app search crawler (US-based proxies with spoofed mobile UA)
  if (/naver\(inapp;\s*search;/i.test(ua) && /naverom/i.test(ua)) return "search_bot_naver";
  // Fake/spoofed User-Agent
  if (hasFakeUA(ua)) return "scraper_fake_ua";
  const isCloudflareProxy = ip ? cloudflareRanges.some(r => r.test(ip)) : false;
  if (isCloudflareProxy) return "scraper_cf";
  // Datacenter IPs with normal UA = likely spoofed bot
  const isDatacenter = ip ? datacenterRanges.some(r => r.test(ip)) : false;
  if (isDatacenter) return "scraper_datacenter";
  // T-Mobile/carrier IPs from US with Naver inapp pattern
  if (/172\.56\./i.test(ip || "")) return "human"; // T-Mobile US is legitimate carrier
  return "human";
}

// Post-geo classification: check if geo city is a known datacenter location
function classifyWithGeo(visitorType: string, country: string | null, city: string | null): string {
  if (visitorType !== "human") return visitorType;
  if (!country || !city) return visitorType;
  // Only apply to US traffic (most major datacenter cities)
  const isUS = /united\s*states|^us$/i.test(country);
  if (!isUS) return visitorType;
  const isDatacenterCity = datacenterCities.some(r => r.test(city));
  if (isDatacenterCity) return "scraper_datacenter";
  return visitorType;
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
          // Deduplicate when regionName and city are the same (e.g. "Seoul" + "Seoul")
          if (parts.length === 2 && parts[0] === parts[1]) {
            city = parts[0];
          } else {
            city = parts.length > 0 ? parts.join(" ") : null;
          }
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
  const finalType = classifyWithGeo(visitor_type, country, city);
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
    visitor_type: finalType,
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

  // Apply geo-based datacenter city detection
  visitor_type = classifyWithGeo(visitor_type, country, city);

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
    visitor_id: body.visitor_id || null,
    visit_count: body.visit_count || 1,
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
