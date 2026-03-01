import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ServiceRequestData {
  request_type: "sms_recharge" | "remote_support";
  company: string;
  name: string;
  phone: string;
  email?: string;
  amount?: string;
  reason?: string;
  preferred_datetime?: string;
  session_id?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ServiceRequestData = await req.json();
    const { request_type, company, name, phone, email, amount, reason, preferred_datetime, session_id } = body;

    if (!request_type || !company || !name || !phone) {
      return new Response(
        JSON.stringify({ error: "필수 항목이 누락되었습니다." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { error: dbError } = await supabaseAdmin.from("service_requests").insert({
      request_type,
      company,
      name,
      phone,
      email: email || null,
      amount: amount || null,
      reason: reason || null,
      preferred_datetime: preferred_datetime || null,
      session_id: session_id || null,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      throw new Error("요청 저장에 실패했습니다.");
    }

    console.log(`New service request saved: ${request_type} / ${company} / ${name}`);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "서버 오류가 발생했습니다." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
