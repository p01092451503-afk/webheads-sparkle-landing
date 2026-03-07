import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Default admin email - will be overridden by DB settings
const DEFAULT_ADMIN_EMAIL = "34bus@webheads.co.kr";

interface ContactFormData {
  company: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  inquiryType?: "consultation" | "demo";
  session_id?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    const { company, name, phone, email, service, message, inquiryType = "consultation", session_id } = formData;

    if (!company || !name || !phone) {
      return new Response(
        JSON.stringify({ error: "필수 항목이 누락되었습니다." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { error: dbError } = await supabaseAdmin.from("contact_inquiries").insert({
      company,
      name,
      phone,
      email: email || null,
      service: service || null,
      message: message || null,
      inquiry_type: inquiryType,
      session_id: session_id || null,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      throw new Error("문의 저장에 실패했습니다.");
    }

    console.log(`New inquiry saved: ${company} / ${name}`);

    // Fetch notification settings and auto-response templates from DB
    const { data: settingsRows } = await supabaseAdmin
      .from("admin_settings")
      .select("key, value")
      .in("key", ["notifications", "auto_response_templates"]);
    
    const settingsMap: Record<string, any> = {};
    (settingsRows || []).forEach((r: any) => { settingsMap[r.key] = r.value; });

    const notifSettings = settingsMap.notifications || { email_on_new_inquiry: true, notification_email: DEFAULT_ADMIN_EMAIL };
    const shouldSendEmail = notifSettings.email_on_new_inquiry !== false;
    const adminEmail = notifSettings.notification_email || DEFAULT_ADMIN_EMAIL;

    const autoResponseSettings = settingsMap.auto_response_templates || { enabled: false, templates: {} };

    // Send email notification to admin
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey && shouldSendEmail) {
      try {
        const typeLabel = inquiryType === "demo" ? "데모 요청" : "상담 문의";
        const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

        const emailHtml = `
          <div style="font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
            <div style="background: #1a1a2e; border-radius: 12px; padding: 24px 28px; margin-bottom: 24px;">
              <h1 style="color: #ffffff; font-size: 20px; margin: 0 0 4px;">📬 새로운 ${typeLabel}이 접수되었습니다</h1>
              <p style="color: #a0a0b8; font-size: 13px; margin: 0;">${now}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 8px; color: #888; width: 90px;">유형</td>
                <td style="padding: 12px 8px; font-weight: 600;">${typeLabel}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 8px; color: #888;">회사명</td>
                <td style="padding: 12px 8px; font-weight: 600;">${company}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 8px; color: #888;">이름</td>
                <td style="padding: 12px 8px; font-weight: 600;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 8px; color: #888;">연락처</td>
                <td style="padding: 12px 8px; font-weight: 600;">${phone}</td>
              </tr>
              ${email ? `<tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 8px; color: #888;">이메일</td>
                <td style="padding: 12px 8px;">${email}</td>
              </tr>` : ""}
              ${service ? `<tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 8px; color: #888;">서비스</td>
                <td style="padding: 12px 8px;">${service}</td>
              </tr>` : ""}
              ${message ? `<tr>
                <td style="padding: 12px 8px; color: #888; vertical-align: top;">메시지</td>
                <td style="padding: 12px 8px; white-space: pre-wrap;">${message}</td>
              </tr>` : ""}
            </table>
            <div style="margin-top: 24px; padding: 16px; background: #f8f9fa; border-radius: 8px; text-align: center;">
              <a href="https://webheads-service.lovable.app/admin" style="display: inline-block; padding: 10px 24px; background: #1a1a2e; color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">관리자 대시보드에서 확인 →</a>
            </div>
            <p style="color: #aaa; font-size: 11px; text-align: center; margin-top: 20px;">이 메일은 WEBHEADS 서비스 사이트에서 자동 발송되었습니다.</p>
          </div>
        `;

        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "WEBHEADS <onboarding@resend.dev>",
            to: [adminEmail],
            subject: `[웹헤즈] 새 ${typeLabel}: ${company} - ${name}`,
            html: emailHtml,
          }),
        });

        if (!emailRes.ok) {
          const errBody = await emailRes.text();
          console.error(`Email send failed [${emailRes.status}]: ${errBody}`);
        } else {
          console.log(`Notification email sent to ${adminEmail}`);
        }
      } catch (emailErr) {
        console.error("Email notification error:", emailErr);
      }
    }

    // Send auto-response email to customer
    if (resendApiKey && email && autoResponseSettings.enabled) {
      try {
        const templateKey = inquiryType === "demo" ? "demo" : "consultation";
        const template = autoResponseSettings.templates?.[templateKey];
        if (template && template.subject && template.body) {
          const replaceVars = (text: string) =>
            text
              .replace(/\{\{name\}\}/g, name)
              .replace(/\{\{company\}\}/g, company)
              .replace(/\{\{message\}\}/g, message || "(내용 없음)")
              .replace(/\{\{service\}\}/g, service || "(미선택)");

          const subject = replaceVars(template.subject);
          const bodyText = replaceVars(template.body);
          const bodyHtml = `
            <div style="font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
              <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); border-radius: 12px; padding: 24px 28px; margin-bottom: 24px;">
                <h1 style="color: #ffffff; font-size: 18px; margin: 0;">WEBHEADS</h1>
              </div>
              <div style="font-size: 14px; line-height: 1.8; color: #333; white-space: pre-wrap;">${bodyText}</div>
              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
              <p style="color: #aaa; font-size: 11px; text-align: center;">본 메일은 자동 발송된 확인 메일입니다.</p>
            </div>
          `;

          const autoRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "WEBHEADS <onboarding@resend.dev>",
              to: [email],
              subject,
              html: bodyHtml,
            }),
          });

          if (!autoRes.ok) {
            console.error(`Auto-response failed [${autoRes.status}]: ${await autoRes.text()}`);
          } else {
            console.log(`Auto-response sent to ${email}`);
          }
        }
      } catch (autoErr) {
        console.error("Auto-response error:", autoErr);
      }
    }

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
