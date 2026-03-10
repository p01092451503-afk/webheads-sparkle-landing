import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto as stdCrypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { encode as hexEncode } from "https://deno.land/std@0.168.0/encoding/hex.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Popbill API endpoints
const AUTH_URL = "https://auth.linkhub.co.kr";
const API_URL_TEST = "https://popbill-test.linkhub.co.kr";
const API_URL_PROD = "https://popbill.linkhub.co.kr";
const SERVICE_ID_TEST = "POPBILL_TEST";
const SERVICE_ID_PROD = "POPBILL";

// Use test environment by default, switch to prod when ready
const IS_PRODUCTION = Deno.env.get("POPBILL_IS_PRODUCTION") === "true";
const API_URL = IS_PRODUCTION ? API_URL_PROD : API_URL_TEST;
const SERVICE_ID = IS_PRODUCTION ? SERVICE_ID_PROD : SERVICE_ID_TEST;

async function hmacSha256(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = Uint8Array.from(atob(key), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function md5Hash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("MD5", data);
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}

async function getToken(linkId: string, secretKey: string, corpNum: string): Promise<string> {
  const scopes = ["member", "110"]; // 110 = 전자세금계산서
  const requestBody = JSON.stringify({
    access_id: corpNum,
    scope: scopes,
  });

  const contentMD5 = await md5Hash(requestBody);
  const date = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const uri = `/${SERVICE_ID}/Token`;

  const stringToSign = [
    "POST",
    contentMD5,
    date,
    uri,
  ].join("\n");

  const signature = await hmacSha256(secretKey, stringToSign);
  const authorization = `LINKHUB ${linkId} ${signature}`;

  const response = await fetch(`${AUTH_URL}${uri}`, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
      "X-LH-Version": "2.0",
      "X-LH-Date": date,
      "X-LH-Forwarded": "*",
    },
    body: requestBody,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Token error [${response.status}]: ${JSON.stringify(data)}`);
  }

  return data.session_token;
}

async function callPopbillAPI(
  token: string,
  method: string,
  path: string,
  body?: any
): Promise<any> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "x-pb-version": "1.0",
  };

  const options: RequestInit = { method, headers };
  if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, options);
  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { rawResponse: text };
  }

  if (!response.ok) {
    throw new Error(`Popbill API error [${response.status}]: ${JSON.stringify(data)}`);
  }

  return data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LINK_ID = Deno.env.get("POPBILL_LINK_ID");
    const SECRET_KEY = Deno.env.get("POPBILL_SECRET_KEY");
    const CORP_NUM = Deno.env.get("POPBILL_CORP_NUM");

    if (!LINK_ID || !SECRET_KEY || !CORP_NUM) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "팝빌 API 설정이 필요합니다 (POPBILL_LINK_ID, POPBILL_SECRET_KEY, POPBILL_CORP_NUM)",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Auth check
    const authHeader = req.headers.get("authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return new Response(JSON.stringify({ success: false, error: "인증 실패" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Check admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["admin", "super_admin"])
        .limit(1);
      if (!roleData || roleData.length === 0) {
        return new Response(JSON.stringify({ success: false, error: "관리자 권한이 필요합니다" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { action, ...params } = await req.json();

    // Get Popbill token
    const popbillToken = await getToken(LINK_ID, SECRET_KEY, CORP_NUM);

    switch (action) {
      case "getToken": {
        return new Response(
          JSON.stringify({ success: true, data: { token: "authenticated" } }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "issue": {
        // Issue a tax invoice
        const {
          invoiceType = 1, // 1: 매출, 2: 매입
          taxType = 1, // 1: 과세, 2: 영세율, 3: 면세
          supplierCorpNum,
          supplierCorpName,
          supplierCEOName,
          supplierAddr,
          supplierBizType,
          supplierBizClass,
          supplierEmail,
          buyerCorpNum,
          buyerCorpName,
          buyerCEOName,
          buyerAddr,
          buyerBizType,
          buyerBizClass,
          buyerEmail,
          writeDate,
          supplyAmount,
          taxAmount,
          totalAmount,
          purposeType = 2, // 1: 영수, 2: 청구
          items = [],
          memo,
          clientId,
          paymentId,
        } = params;

        const invoiceBody = {
          writeDate: writeDate || new Date().toISOString().split("T")[0].replace(/-/g, ""),
          chargeDirection: invoiceType === 1 ? "정과금" : "역과금",
          issueType: "정발행",
          taxType: taxType === 1 ? "과세" : taxType === 2 ? "영세" : "면세",
          purposeType: purposeType === 1 ? "영수" : "청구",
          supplyCostTotal: String(supplyAmount),
          taxTotal: String(taxAmount),
          totalAmount: String(totalAmount),
          invoicerCorpNum: supplierCorpNum || CORP_NUM,
          invoicerCorpName: supplierCorpName || "",
          invoicerCEOName: supplierCEOName || "",
          invoicerAddr: supplierAddr || "",
          invoicerBizType: supplierBizType || "",
          invoicerBizClass: supplierBizClass || "",
          invoicerEmail: supplierEmail || "",
          invoiceeType: "사업자",
          invoiceeCorpNum: buyerCorpNum,
          invoiceeCorpName: buyerCorpName || "",
          invoiceeCEOName: buyerCEOName || "",
          invoiceeAddr: buyerAddr || "",
          invoiceeBizType: buyerBizType || "",
          invoiceeBizClass: buyerBizClass || "",
          invoiceeEmail1: buyerEmail || "",
          remark1: memo || "",
          detailList: items.length > 0
            ? items.map((item: any, idx: number) => ({
                serialNum: idx + 1,
                itemName: item.name || "",
                purchaseDT: item.date || writeDate || "",
                supplyCost: String(item.supplyAmount || ""),
                tax: String(item.taxAmount || ""),
                remark: item.remark || "",
              }))
            : [
                {
                  serialNum: 1,
                  itemName: memo || "서비스 이용료",
                  supplyCost: String(supplyAmount),
                  tax: String(taxAmount),
                },
              ],
        };

        // Register + Issue in one call
        const result = await callPopbillAPI(
          popbillToken,
          "POST",
          `/Taxinvoice?submit=true`,
          invoiceBody
        );

        // Save log to DB
        await supabase.from("tax_invoice_logs").insert({
          payment_id: paymentId || null,
          client_id: clientId,
          invoice_num: result.invoiceNum || null,
          nts_confirm_num: result.ntsconfirmNum || null,
          supplier_corp_num: supplierCorpNum || CORP_NUM,
          buyer_corp_num: buyerCorpNum,
          buyer_corp_name: buyerCorpName,
          buyer_ceo_name: buyerCEOName,
          buyer_email: buyerEmail,
          supply_amount: supplyAmount,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          issue_date: writeDate || new Date().toISOString().split("T")[0],
          status: "issued",
          memo,
          popbill_response: result,
        });

        return new Response(
          JSON.stringify({ success: true, data: result }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "list": {
        // List tax invoices from our DB
        const { clientId, year, month } = params;
        let query = supabase
          .from("tax_invoice_logs")
          .select("*")
          .order("created_at", { ascending: false });

        if (clientId) query = query.eq("client_id", clientId);
        if (year && month) {
          const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
          const endMonth = month === 12 ? 1 : month + 1;
          const endYear = month === 12 ? year + 1 : year;
          const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;
          query = query.gte("issue_date", startDate).lt("issue_date", endDate);
        }

        const { data, error } = await query.limit(100);
        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "checkBalance": {
        // Check remaining Popbill points
        const result = await callPopbillAPI(
          popbillToken,
          "GET",
          `/Taxinvoice/${CORP_NUM}/Balance`
        );

        return new Response(
          JSON.stringify({ success: true, data: result }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ success: false, error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error: unknown) {
    console.error("Popbill error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
