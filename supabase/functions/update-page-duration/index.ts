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
    const { session_id, page_path, duration_seconds, scroll_depth } = await req.json();

    if (!session_id || !page_path || typeof duration_seconds !== "number") {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find the most recent matching page view and update duration + scroll depth
    const { data: rows } = await supabase
      .from("page_views")
      .select("id")
      .eq("session_id", session_id)
      .eq("page_path", page_path)
      .is("duration_seconds", null)
      .order("created_at", { ascending: false })
      .limit(1);

    if (rows && rows.length > 0) {
      // Cap at 30 minutes to filter out idle tabs
      const capped = Math.min(Math.round(duration_seconds), 1800);
      const updateData: Record<string, any> = { duration_seconds: capped };
      if (typeof scroll_depth === "number" && scroll_depth > 0) {
        updateData.scroll_depth = Math.min(scroll_depth, 100);
      }
      await supabase
        .from("page_views")
        .update(updateData)
        .eq("id", rows[0].id);
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
