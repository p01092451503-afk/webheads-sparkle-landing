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
  const now = new Date();
  const todayStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
  const langMap: Record<string, string> = {
    ko: "한국어로 응답.",
    en: "Respond in English.",
    ja: "日本語で回答。",
  };
  const footerMap: Record<string, string> = {
    ko: "\n\n더 궁금한 사항은 02-540-4337로 전화주세요.",
    en: "\n\nFor further inquiries, please call 02-540-4337.",
    ja: "\n\nご不明な点は02-540-4337までお電話ください。",
  };
  const footer = footerMap[lang] || footerMap.ko;
  return `웹헤즈 공식 상담 어시스턴트. 오늘 날짜: ${todayStr}. ${langMap[lang] || langMap.ko}
역할: 서비스안내, 요금계산, 상담유도. 금액은 콤마포맷(700,000원).
금지: 이모지, 마크다운헤딩(###), 수평선(---), AI어투("물론이죠!"). 볼드/리스트/줄바꿈만 사용. 자연스러운 상담사 어투.
중요: 제공된 컨텍스트에 없는 고객사명, 기업명, 기관명, 도입 사례를 절대 언급하지 마세요. 구체적 고객사를 묻는 질문에는 "보안 및 계약상의 이유로 구체적인 고객사명을 공개하기 어렵습니다. 300개 이상의 기관이 웹헤즈 LMS를 사용하고 있습니다."라고 안내하세요.
범위제한(절대 규칙): 웹헤즈(WEBHEADS)의 서비스, 사업, 요금, 기술, 이러닝/LMS 관련 질문에만 답변하세요. 날씨, 날짜, 시간, 시사, 일반 상식, 코딩, 번역, 개인 상담, 수학, 잡담 등 웹헤즈 사업과 무관한 모든 질문에는 반드시 "저는 웹헤즈 서비스 전문 상담 챗봇입니다. 웹헤즈 서비스에 대해 궁금한 점을 질문해주세요!" 라고만 답변하세요. 관련 없는 요청에는 어떤 정보도 제공하지 마세요.
필수: 모든 답변의 마지막 줄에 반드시 "${footer.trim()}" 문구를 추가하세요. 예외 없이 항상 포함합니다.
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
