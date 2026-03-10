import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SERVICE_CATALOG } from "../_shared/service-catalog.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRICING_CONTEXT = `## 요금 계산
| 플랜 | 월료 | CDN포함 | 저장포함 | CDN초과(/GB) | 저장초과(/GB) |
|------|------|---------|---------|-------------|-------------|
| Starter | 300,000원 | YouTube | - | - | - |
| Basic | 500,000원 | 500GB | 100GB | 500원 | 1,000원 |
| Plus | 700,000원 | 1,500GB | 200GB | 400원 | 800원 |
| Premium | 1,000,000원 | 2,000GB | 250GB | 300원 | 500원 |

추가: DRM 월300,000원, 단독서버 월250,000원(500명+), 연간계약 10%할인
계산: CDN사용량 = 수강생 × min(10, 영상GB/0.602) × 완강률/100 × 0.588 GB`;

const COMPANY_CONTEXT = `웹헤즈(WEBHEADS) - 2010년 설립, B2B 이러닝/LMS 전문, 300+고객사, 유지율92.6%
연락: 02-336-4338, 34bus@webheads.co.kr, https://service.webheads.co.kr
서비스: LMS, 호스팅, AI챗봇, 앱개발, DRM, 콘텐츠제작, 채널톡/SMS, PG결제, 유지보수
강점: 원스톱솔루션, 최소3일오픈, KDT지원, AI학습분석
${Object.values(SERVICE_CATALOG).join("\n\n")}
${PRICING_CONTEXT}
상담: https://service.webheads.co.kr/lms#contact | 요금: https://service.webheads.co.kr/pricing`;

function getSystemPrompt(lang: string): string {
  const langMap: Record<string, string> = {
    ko: "한국어로 응답.",
    en: "Respond in English.",
    ja: "日本語で回答。",
  };
  return `웹헤즈 공식 상담 어시스턴트. ${langMap[lang] || langMap.ko}
역할: 서비스안내, 요금계산, 상담유도. 금액은 콤마포맷(700,000원).
금지: 이모지, 마크다운헤딩(###), 수평선(---), AI어투("물론이죠!"). 볼드/리스트/줄바꿈만 사용. 자연스러운 상담사 어투.
${COMPANY_CONTEXT}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, lang } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Keep only the last 6 messages to reduce token usage
    const trimmedMessages = messages.slice(-6);

    const systemPrompt = getSystemPrompt(lang || "ko");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          ...trimmedMessages,
        ],
        stream: true,
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI 크레딧이 부족합니다." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI 응답 오류가 발생했습니다." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chatbot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
