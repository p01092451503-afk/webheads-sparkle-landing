import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOGO_URL = "https://webheads-service.lovable.app/images/webheads-logo.png";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, company, name, planName, monthlyPrice, pdfBase64 } = await req.json();

    if (!to || !pdfBase64) {
      return new Response(
        JSON.stringify({ error: "이메일 주소와 PDF 데이터가 필요합니다." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const fmt = (n: number) => n?.toLocaleString("ko-KR") || "0";

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; margin: 0; padding: 0; background: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white;">
    <div style="background: linear-gradient(135deg, #5D45FF, #7c68ff); padding: 32px 24px; text-align: center;">
      <img src="${LOGO_URL}" alt="WEBHEADS" style="height: 28px; filter: brightness(0) invert(1); margin-bottom: 16px;" />
      <h1 style="color: white; font-size: 22px; font-weight: 800; margin: 0;">맞춤 LMS 제안서</h1>
    </div>
    <div style="padding: 32px 24px;">
      <p style="font-size: 15px; color: #333; line-height: 1.8;">
        안녕하세요, <strong>${company || ""}</strong> ${name || ""}님.<br/>
        웹헤즈입니다.
      </p>
      <p style="font-size: 14px; color: #555; line-height: 1.8;">
        요청하신 LMS 맞춤 견적서를 첨부 파일로 보내드립니다.
      </p>
      <div style="background: #F8F7FF; border: 1px solid #E8E5FF; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
        <p style="font-size: 13px; color: #666; margin: 0 0 8px;">추천 플랜</p>
        <p style="font-size: 24px; font-weight: 800; color: #5D45FF; margin: 0;">${planName}</p>
        <p style="font-size: 18px; font-weight: 700; color: #333; margin: 8px 0 0;">월 ${fmt(monthlyPrice)}원</p>
      </div>
      <p style="font-size: 14px; color: #555; line-height: 1.8;">
        자세한 내용은 첨부된 PDF 파일을 참고해 주시기 바랍니다.<br/>
        추가 문의사항이 있으시면 언제든지 연락 주세요.
      </p>
      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 13px; color: #999; margin: 0;">(주)웹헤즈 — 16년 e러닝 전문 기업</p>
        <p style="font-size: 12px; color: #bbb; margin: 4px 0 0;">Tel: 02-6925-0063 · Email: 34bus@webheads.co.kr</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    const filename = `웹헤즈_LMS_견적서_${planName}_${new Date().toISOString().slice(0, 10)}.pdf`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "WEBHEADS <noreply@webheads.co.kr>",
        to: [to],
        subject: `[웹헤즈] ${company || ""} 맞춤 LMS 제안서`,
        html: htmlBody,
        attachments: [{
          filename,
          content: pdfBase64,
          content_type: "application/pdf",
        }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend error:", errText);
      throw new Error(`이메일 발송 실패: ${res.status}`);
    }

    console.log(`Proposal email sent to ${to} for ${company}`);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("send-proposal-email error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
