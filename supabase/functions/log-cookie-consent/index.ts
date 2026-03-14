import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function extractIP(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || null;
}

async function geoLookup(ip: string | null): Promise<{ country: string | null; city: string | null }> {
  if (!ip || ip === "127.0.0.1" || ip === "::1") return { country: null, city: null };
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city&lang=ko`);
    if (res.ok) {
      const geo = await res.json();
      if (geo.status === "success") {
        const parts = [geo.regionName, geo.city].filter(Boolean);
        const city = parts.length === 2 && parts[0] === parts[1] ? parts[0] : parts.join(" ") || null;
        return { country: geo.country || null, city };
      }
    }
  } catch (e) {
    console.error("Geo lookup failed:", e);
  }
  return { country: null, city: null };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { session_id, visitor_id, essential, analytics, marketing, action, language } = body;

    const ip = extractIP(req);
    const { country, city } = await geoLookup(ip);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error } = await supabase.from("cookie_consent_logs").insert({
      session_id: session_id || null,
      visitor_id: visitor_id || null,
      essential: essential ?? true,
      analytics: analytics ?? false,
      marketing: marketing ?? false,
      action: action || "accept_all",
      language: language || null,
      ip_address: ip,
      user_agent: req.headers.get("user-agent") || null,
      country,
      city,
    });

    if (error) {
      console.error("DB insert error:", error);
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
