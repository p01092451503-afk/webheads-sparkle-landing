import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SERVICE_CATALOG } from "../_shared/service-catalog.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRICING_CALCULATOR_CONTEXT = `## 요금제 계산기 로직 (Cost Simulator)
당신은 사용자의 질문에 따라 맞춤 요금을 직접 계산해줄 수 있습니다.

### 플랜 기본 정보
| 플랜 | 월 기본료 | CDN 포함 | 저장공간 포함 | CDN 초과(원/GB) | 저장 초과(원/GB) | 솔루션 |
|------|----------|---------|------------|---------------|----------------|--------|
| Starter | 300,000원 | 미사용(YouTube) | 미사용 | - | - | Light(임대형) |
| Basic | 500,000원 | 500GB | 100GB | 500원 | 1,000원 | Light(임대형) |
| Plus | 700,000원 | 1,500GB | 200GB | 400원 | 800원 | PRO(구축형) |
| Premium | 1,000,000원 | 2,000GB | 250GB | 300원 | 500원 | PRO(구축형) |

### 추가 옵션
- 보안 플레이어(DRM): 월 300,000원 (Starter 제외)
- 단독서버(WEB): 월 250,000원 (월 활성 수강생 500명 이상일 때만)
- 연간 계약 시 10% 할인

### 계산 방법
1. 사용자에게 수강생 수, 영상 용량(GB), 예상 완강률을 질문
2. 예상 CDN 사용량 = 수강생 × (min(10, 영상용량/0.602) × 완강률/100) × 0.588 GB
3. 각 플랜별 초과 비용 계산
4. 가장 경제적인 플랜 추천
5. 금액은 반드시 콤마 포맷으로 표시 (예: 700,000원)

### 계산 예시
수강생 200명, 영상 20GB, 완강률 70%일 때:
- 영상시간 = 20/0.602 ≈ 33.2시간
- 월 학습시간/수강생 = min(10, 33.2) × 0.7 = 7시간
- CDN 사용량 = 200 × 7 × 0.588 ≈ 823GB
- Basic: 500,000 + (823-500)×500 + 0 = 661,500원
- Plus: 700,000 + 0 + 0 = 700,000원 (1,500GB 이내)
→ Basic 추천 (661,500원)`;

const COMPANY_CONTEXT = `# WEBHEADS(웹헤즈) 회사 정보

## 기본 정보
- 회사명: 웹헤즈 (Webheads Co., Ltd.)
- 설립: 2010년 (16년 운영)
- 전문 분야: 이러닝 솔루션, LMS 구축
- 고객사: 300개 이상
- 고객 유지율: 92.6%
- 연락처: 02-336-4338 (도입 문의), 02-540-4337 (기술 지원)
- 이메일: 34bus@webheads.co.kr
- 웹사이트: https://service.webheads.co.kr

## 핵심 강점
- B2B 이러닝 전문: 기업, 교육기관, 정부기관 대상
- 원스톱 솔루션: LMS부터 콘텐츠, 결제, 앱까지 단일 파트너
- AI 기반 학습관리: 학습 분석, 맞춤 추천, 자동 튜터링
- 최소 3일 내 서비스 오픈 가능 (클라우드형)
- KDT(국민내일배움카드) 정부지원훈련 LMS 공식 지원

## 전체 서비스 라인업
${Object.values(SERVICE_CATALOG).join("\n\n")}

${PRICING_CALCULATOR_CONTEXT}

## 주요 인사이트 주제 (블로그 100+개)
- AI 튜터, RAG 기술, LMS 보안, 클라우드 아키텍처, 모바일 UX, SCORM/xAPI, 
  제로 트러스트 보안, 학습 분석, 옴니채널 알림, DRM 콘텐츠 보호,
  PG 결제 연동, 채널톡 CS 자동화, 앱 개발, 게이미피케이션 등

## 도입 문의 안내
상담/데모 요청: https://service.webheads.co.kr/lms#contact
요금제 상세: https://service.webheads.co.kr/pricing`;

function getSystemPrompt(lang: string): string {
  const langInstructions: Record<string, string> = {
    ko: "한국어로 응답하세요.",
    en: "Respond in English.",
    ja: "日本語で回答してください。",
  };
  const langInstruction = langInstructions[lang] || langInstructions.ko;

  return `당신은 WEBHEADS(웹헤즈)의 공식 AI 상담 어시스턴트입니다.
${langInstruction}

## 역할
- 웹헤즈의 모든 서비스(LMS, 호스팅, AI챗봇, 앱개발, DRM, 콘텐츠, 채널톡/SMS, PG, 유지보수)에 대해 정확하고 친절하게 안내합니다.
- 사용자가 수강생 수, 영상 용량 등을 알려주면 요금제 계산기 로직에 따라 맞춤 비용을 직접 계산해서 안내합니다.
- 블로그/인사이트 관련 질문에도 주제별로 안내할 수 있습니다.

## 응답 가이드라인
- 간결하고 핵심적으로 답변하되, 필요 시 상세 설명도 제공
- 금액은 반드시 콤마 포맷 (예: 700,000원)
- 불확실한 정보는 추측하지 말고 "상세 상담이 필요합니다"라고 안내
- 경쟁사 비하 금지
- 자연스럽게 도입 상담이나 데모 요청으로 유도
- **절대 금지 사항**:
  - 이모지(😀🎯✅ 등) 사용 금지. 단 하나도 사용하지 마세요.
  - ### 또는 ## 같은 마크다운 헤딩 문법 사용 금지
  - "---" 같은 수평선 사용 금지
  - AI가 답변한 것처럼 보이는 어투나 형식 금지 (예: "물론이죠!", "좋은 질문입니다!")
- 볼드(**텍스트**), 리스트(- 항목), 줄바꿈만 사용 가능
- 사람 상담사가 채팅으로 안내하는 것처럼 자연스럽고 간결하게 답변

## 회사 및 서비스 정보
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

    const systemPrompt = getSystemPrompt(lang || "ko");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        max_tokens: 1500,
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
