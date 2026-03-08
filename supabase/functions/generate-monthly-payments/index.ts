import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Get all active recurring fees
    const { data: fees, error: feesError } = await supabase
      .from("client_recurring_fees")
      .select("*")
      .eq("is_active", true);

    if (feesError) throw feesError;
    if (!fees || fees.length === 0) {
      return new Response(JSON.stringify({ message: "No recurring fees found", created: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let created = 0;
    for (const fee of fees) {
      // For annual billing, only generate in the contract renewal month
      if (fee.billing_cycle === "annual") {
        if (!fee.contract_start_date) continue;
        const startDate = new Date(fee.contract_start_date);
        const contractMonth = startDate.getMonth() + 1;
        if (month !== contractMonth) continue;
      }

      // Check if payment already exists for this client/type/month
      const { data: existing } = await supabase
        .from("payments")
        .select("id")
        .eq("client_id", fee.client_id)
        .eq("payment_type", fee.payment_type)
        .eq("year", year)
        .eq("month", month)
        .maybeSingle();

      if (!existing) {
        const { error: insertError } = await supabase.from("payments").insert({
          client_id: fee.client_id,
          payment_type: fee.payment_type,
          amount: fee.amount,
          year,
          month,
          is_unpaid: true,
          is_recurring: true,
          invoice_status: "none",
          memo: fee.billing_cycle === "annual" ? "연간 계약" : null,
        });
        if (!insertError) created++;
      }
    }

    return new Response(JSON.stringify({ message: `Generated ${created} payments for ${year}-${month}`, created }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
