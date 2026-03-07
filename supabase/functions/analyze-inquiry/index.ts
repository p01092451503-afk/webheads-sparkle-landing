import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRIMARY_MODEL = "google/gemini-2.0-flash-001";
const FALLBACK_MODEL = "anthropic/claude-3-haiku";

async function callAIWithFallback(
  apiKey: string,
  body: Record<string, unknown>,
  inquiryId?: string,
): Promise<{ data: any; usedModel: string }> {
  const models = [PRIMARY_MODEL, FALLBACK_MODEL];
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...body, model }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`[AI] model_used: ${model}, inquiry_id: ${inquiryId ?? "unknown"}`);
      return { data, usedModel: model };
    }

    // Only fallback on 429 or 5xx
    if (i < models.length - 1 && (response.status === 429 || response.status >= 500)) {
      console.warn(`[AI] ${model} failed with ${response.status}, waiting 1s before fallback...`);
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    // Non-retriable error or last model — throw
    if (response.status === 402) {
      throw { status: 402, message: "AI credits exhausted." };
    }
    if (response.status === 429) {
      throw { status: 429, message: "Rate limit exceeded. Please try again later." };
    }
    const t = await response.text();
    console.error("AI gateway error:", response.status, t);
    throw { status: 500, message: `AI analysis failed (${response.status})` };
  }
  throw { status: 500, message: "All AI models failed" };
}

const PRICING_CONTEXT = `
## 웹헤즈 LMS 요금제 정보

### 플랜별 월 이용료 (VAT 별도)
- Starter: 300,000원/월 - YouTube/Vimeo 연동, CDN 미사용, 저장공간 없음
- Basic: 500,000원/월 - CDN 500GB 전송량, 100GB 저장공간, 트랜스코딩 20GB
- Plus: 700,000원/월 - CDN 1,500GB 전송량, 200GB 저장공간, 트랜스코딩 20GB (가장 인기)
- Premium: 1,000,000원/월 - CDN 2,000GB 전송량, 250GB 저장공간, 트랜스코딩 20GB, 보안 리포트 포함

### 공통 제공 사항 (모든 플랜)
- 회원 수 무제한
- 관리자 계정 무제한
- LMS 전문 담당자 배정
- 정기 업데이트
- 개발 도메인 1개
- 통계 페이지
- 라이브(ZOOM) 연동
- SMS/카카오 알림톡 발송 API 연동
- 검색엔진 최적화
- 디자인 템플릿 제공
- AI 학습 독려 기능
- 관리자 대시보드
- 수료증 템플릿
- 모바일 웹 서비스
- 소셜 로그인(구글, 카카오, 네이버, 페이스북)

### 초과 사용 요금
- 전송량: Basic 500원/GB, Plus 400원/GB, Premium 300원/GB
- 저장공간: Basic 1,000원/GB, Plus 800원/GB, Premium 500원/GB
- 트랜스코딩: Basic 2,200원/GB, Plus/Premium 2,000원/GB
- 보안 플레이어(DRM): 월 300,000원 추가

### 보안
- Starter: 기본 보안, SSL
- Basic/Plus: 기본 보안, WAF & Shield, FireWall 등
- Premium: 별도 문의 (맞춤 보안)

### 커스터마이징
- 기본 UI/UX 커스터마이징은 모든 플랜에서 가능
- 고급 기능 커스터마이징은 별도 견적
- 외부 시스템 연동(ERP, CRM 등)은 별도 개발비 발생
- 다국어 지원은 기본 제공 (한/영)
- 추가 언어는 별도 견적

### 웹헤즈 LMS 핵심 기능
- 학습 관리 시스템 (강의 등록, 수강생 관리, 진도 추적)
- 퀴즈/시험 시스템
- 수료증 발급
- 실시간 화상 강의 (ZOOM 연동)
- 모바일 반응형
- AI 기능 (학습 독려, 요약 등)
- DRM 보안 플레이어 (옵션)
- 다국어 지원
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inquiry } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `당신은 웹헤즈(WEBHEADS)의 LMS 솔루션 전문 컨설턴트입니다. 고객 문의를 분석하여 최적의 제안 전략을 수립합니다.

${PRICING_CONTEXT}

## 분석 지침
고객 문의를 아래 구조로 분석해주세요. 각 섹션은 ### 제목과 --- 구분선으로 명확히 분리하고, 항목별로 줄바꿈을 충분히 넣어 읽기 쉽게 작성하세요. 이모지는 사용하지 마세요.

### 1. 요구사항 분석
고객이 요청한 기능/요구사항을 항목별로 간결하게 정리합니다. 각 항목은 불릿(-)으로 나열합니다.

---

### 2. 기본 제공 가능 기능
웹헤즈 LMS에서 기본 제공 또는 기존 기능으로 충족 가능한 항목을 나열합니다.

---

### 3. 커스터마이징 필요 기능
기본에 없지만 커스터마이징으로 구현 가능한 항목입니다. 각 항목에 대략적인 추가 비용을 괄호로 표기합니다.

---

### 4. 불가능 또는 제한 기능
현재 솔루션으로 구현이 어렵거나 제한적인 항목과 대안을 제시합니다.

---

### 5. 추천 요금제 및 예상 비용
- **추천 플랜**: 플랜명과 추천 이유
- **월 기본료**: 금액
- **예상 추가 비용**: 커스터마이징, 추가 용량 등 항목별 비용
- **총 예상 월 비용**: 최소~최대 범위

---

### 6. 제안 전략 요약
영업 시 강조할 포인트, 경쟁 우위, 주의사항을 간결하게 정리합니다.

마크다운 형식으로 깔끔하게 작성하되, 각 섹션 사이에 --- 구분선을 반드시 넣고, 구체적인 숫자와 금액을 포함해주세요. 이모지는 절대 사용하지 마세요.`;

    const userMessage = `다음 고객 문의를 분석해주세요:

회사명: ${inquiry.company}
담당자: ${inquiry.name}
연락처: ${inquiry.phone}
이메일: ${inquiry.email || "없음"}
관심 서비스: ${inquiry.service || "미지정"}
문의 유형: ${inquiry.inquiry_type === "demo" ? "데모 요청" : "상담 요청"}

문의 내용:
${inquiry.message || "(내용 없음)"}`;

    const { data } = await callAIWithFallback(
      LOVABLE_API_KEY,
      {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      },
      inquiry?.id,
    );

    const content = data.choices?.[0]?.message?.content || "분석 결과를 생성할 수 없습니다.";

    return new Response(JSON.stringify({ analysis: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("Error:", e);
    const status = e?.status || 500;
    const message = e?.message || (e instanceof Error ? e.message : "Unknown error");
    return new Response(JSON.stringify({ error: message }), {
      status, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
