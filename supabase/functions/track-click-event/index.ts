import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const aiBotMap: [RegExp, string][] = [
  [/gptbot|chatgpt|openai/i, "ai_openai"], [/claude|anthropic|claudebot/i, "ai_anthropic"],
  [/bytespider/i, "ai_bytedance"], [/ccbot/i, "ai_commoncrawl"],
  [/cohere/i, "ai_cohere"], [/perplexity/i, "ai_perplexity"],
  [/youbot/i, "ai_you"], [/google-extended/i, "ai_google"],
  [/meta-externalagent/i, "ai_meta"], [/amazonbot/i, "ai_amazon"], [/ai2bot/i, "ai_ai2"],
];
const searchBotMap: [RegExp, string][] = [
  [/googlebot/i, "search_bot_google"], [/bingbot/i, "search_bot_bing"],
  [/yandex/i, "search_bot_yandex"], [/baiduspider/i, "search_bot_baidu"],
  [/duckduckbot/i, "search_bot_duckduckgo"], [/slurp/i, "search_bot_yahoo"],
  [/naverbot/i, "search_bot_naver"], [/applebot/i, "search_bot_apple"],
  [/sogou/i, "search_bot_sogou"], [/facebot|facebookexternalhit/i, "search_bot_facebook"],
  [/twitterbot/i, "search_bot_twitter"], [/linkedinbot/i, "search_bot_linkedin"],
  [/pinterestbot/i, "search_bot_pinterest"],
];
const scraperMap: [RegExp, string][] = [
  [/semrushbot/i, "scraper_seo_semrush"], [/ahrefsbot/i, "scraper_seo_ahrefs"],
  [/dotbot/i, "scraper_seo_moz"], [/serpstatbot/i, "scraper_seo_serpstat"],
  [/dataforseo/i, "scraper_seo_dataforseo"], [/screaming frog/i, "scraper_seo_screamingfrog"],
  [/mj12bot/i, "scraper_seo_majestic"], [/megaindex/i, "scraper_seo_megaindex"],
  [/ia_archiver|archive\.org/i, "scraper_archive"],
  [/petalbot/i, "scraper_other_petalbot"], [/blexbot/i, "scraper_other_blexbot"],
];

function classifyVisitor(ua: string): string {
  const lower = ua.toLowerCase();
  for (const [pat, type] of aiBotMap) { if (pat.test(lower)) return type; }
  for (const [pat, type] of searchBotMap) { if (pat.test(lower)) return type; }
  for (const [pat, type] of scraperMap) { if (pat.test(lower)) return type; }
  if (/bot|spider|crawl/i.test(lower)) return "scraper_unknown";
  return "human";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || null;
    const userAgent = req.headers.get("user-agent") || null;
    const visitorType = userAgent ? classifyVisitor(userAgent) : "human";

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
