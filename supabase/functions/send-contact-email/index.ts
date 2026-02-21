import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContactFormData {
  company: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  inquiryType?: "consultation" | "demo";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    const { company, name, phone, email, service, message, inquiryType = "consultation" } = formData;
    const isDemo = inquiryType === "demo";
    const typeLabel = isDemo ? "데모 신청" : "무료 상담";

    // Basic validation
    if (!company || !name || !phone) {
      return new Response(
        JSON.stringify({ error: "필수 항목이 누락되었습니다." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY가 설정되지 않았습니다.");
    }

    const htmlBody = `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f7fb; margin: 0; padding: 24px;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
    <div style="background: #0d1f4e; padding: 28px 32px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">
        ${isDemo ? "🖥️" : "📩"} 웹헤즈 ${typeLabel}
      </h1>
      <p style="color: rgba(255,255,255,0.6); margin: 6px 0 0; font-size: 13px;">새로운 ${typeLabel} 문의가 접수되었습니다.</p>
    </div>
    <div style="padding: 28px 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f8; width: 100px;">
            <span style="font-size: 12px; font-weight: 700; color: #6b7ea8; text-transform: uppercase; letter-spacing: 0.5px;">회사명</span>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f8;">
            <span style="font-size: 15px; font-weight: 600; color: #0d1f4e;">${company}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f8;">
            <span style="font-size: 12px; font-weight: 700; color: #6b7ea8; text-transform: uppercase; letter-spacing: 0.5px;">담당자명</span>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f8;">
            <span style="font-size: 15px; font-weight: 600; color: #0d1f4e;">${name}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f8;">
            <span style="font-size: 12px; font-weight: 700; color: #6b7ea8; text-transform: uppercase; letter-spacing: 0.5px;">연락처</span>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f8;">
            <span style="font-size: 15px; font-weight: 600; color: #0d1f4e;">${phone}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f8;">
            <span style="font-size: 12px; font-weight: 700; color: #6b7ea8; text-transform: uppercase; letter-spacing: 0.5px;">이메일</span>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f8;">
            <span style="font-size: 15px; font-weight: 600; color: #0d1f4e;">${email || "미입력"}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f8;">
            <span style="font-size: 12px; font-weight: 700; color: #6b7ea8; text-transform: uppercase; letter-spacing: 0.5px;">관심 서비스</span>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f8;">
            <span style="font-size: 15px; font-weight: 600; color: #0d1f4e;">${service || "미선택"}</span>
          </td>
        </tr>
      </table>
      ${message ? `
      <div style="margin-top: 20px; background: #f4f7fb; border-radius: 12px; padding: 16px 20px;">
        <p style="font-size: 12px; font-weight: 700; color: #6b7ea8; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px;">문의 내용</p>
        <p style="font-size: 14px; color: #0d1f4e; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
      </div>
      ` : ""}
    </div>
    <div style="background: #f4f7fb; padding: 16px 32px; text-align: center;">
      <p style="font-size: 12px; color: #6b7ea8; margin: 0;">웹헤즈 (Webheads) · 34bus@webheads.co.kr</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "웹헤즈 상담 <noreply@webheads.co.kr>",
        to: ["34bus@webheads.co.kr"],
        subject: `[웹헤즈 ${typeLabel}] ${company} · ${name} 님의 ${typeLabel}`,
        html: htmlBody,
        reply_to: email || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "이메일 발송에 실패했습니다.");
    }

    console.log("Email sent successfully:", data.id);

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
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
