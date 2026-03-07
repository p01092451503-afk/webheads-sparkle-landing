import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRIMARY_MODEL = "google/gemini-3-flash-preview";
const FALLBACK_MODEL = "google/gemini-2.5-flash";

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

    if (i < models.length - 1 && (response.status === 429 || response.status >= 500)) {
      console.warn(`[AI] ${model} failed with ${response.status}, waiting 1s before fallback...`);
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    if (response.status === 402) {
      throw { status: 402, message: "크레딧이 부족합니다." };
    }
    if (response.status === 429) {
      throw { status: 429, message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." };
    }
    const t = await response.text();
    console.error("AI gateway error:", response.status, t);
    throw { status: 500, message: "AI 게이트웨이 오류" };
  }
  throw { status: 500, message: "All AI models failed" };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inquiry, ai_basic_analysis, pro_analysis, company_info } = await req.json();
    const companyName = company_info?.name || "WEBHEADS";
    const companyAddress = company_info?.address || "서울시 마포구 월드컵로114, 3층";
    const companyPhone = company_info?.phone || "02-540-4337";
    const companyWebsite = company_info?.website || "www.webheads.co.kr";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `당신은 Webheads(웹헤즈)의 **전문 제안서 작성 AI**입니다.
고객 문의 원문, AI 기초 분석 결과, AI 영업 전략 리포트를 종합하여 고객에게 발송할 수 있는 **공식 제안서**를 작성합니다.

## 핵심 원칙
- **절대로** 불가능하다고 직접 표현하지 마세요. 제한사항이 있을 경우, "대안으로 ~를 제공합니다" 또는 "~방식으로 동일한 효과를 달성할 수 있습니다"와 같이 **긍정적 대안 제시** 방식으로 작성하세요.
- 전문적이고 신뢰감 있는 톤으로 작성하되, 과도한 기술 용어보다는 고객이 이해하기 쉬운 표현을 사용하세요.
- 구체적인 수치와 근거를 포함하세요.
- WEBHEADS의 강점과 차별점을 자연스럽게 녹여내세요.

## 제안서 구조 (반드시 이 JSON 구조로 응답)
{
  "title": "제안서 제목 (예: '[고객사명] 온라인 교육 플랫폼 구축 제안서')",
  "summary": "2~3문장의 제안 요약",
  "sections": [
    {
      "heading": "섹션 제목",
      "content": "섹션 내용 (마크다운 형식, 줄바꿈 포함)"
    }
  ]
}

## 필수 섹션 (아래 순서대로 작성):
1. **고객 현황 분석**: 고객의 산업, 규모, 핵심 과제를 정리
2. **제안 솔루션 개요**: WEBHEADS LMS가 고객의 요구를 어떻게 충족하는지 전체 그림
3. **핵심 기능 상세**: 고객 요구사항별 기능 매핑 (요구사항 → 제공 기능 → 기대 효과). 제한되는 기능은 대안을 제시
4. **차별화 포인트**: 경쟁사 대비 WEBHEADS만의 강점 (기술력, 운영 경험, 고객지원 등)
5. **도입 비용 안내**: 비용 시나리오를 표 형태로 정리 (월 이용료, 초기 구축비, 커스터마이징 비용)
6. **구축 일정 제안**: 단계별 일정 (기획 → 구축 → 테스트 → 오픈) 제안
7. **기대 효과**: 도입 후 예상되는 정량적/정성적 효과

**중요**: WEBHEADS 소개 섹션은 포함하지 마세요. 회사 정보는 제안서 하단에 별도로 표시됩니다.

## Webheads 회사 정보 (프롬프트 참조용, 제안서 본문에 회사 소개 섹션으로 넣지 마세요):
- 2009년 설립, 16년+ e러닝 전문 기업
- 16년간 300+ 기업/기관 LMS 구축·운영 경험
- 24/7 기술지원, 전담 매니저 배정
- 글로벌 CDN 기반 안정적 서비스 제공
- 주요 고객: 대기업, 공공기관, 금융기관, 교육기관 등

## Webheads 제품 정보:
- 기본 제공: 순차학습, 객관식 Quiz, 수료증 발급, 관리자 대시보드, 모바일 반응형, 한/영 다국어, 글로벌 CDN(Plus 이상), 소셜 로그인, Zoom 연동, SMS/카카오 알림톡, AI 학습 독려, SEO 최적화, 디자인 템플릿
- 커스터마이징 가능: STEP 잠금/해제 로직, 시나리오 Quiz, 대리점별 권한, 그룹 리포트, DRM, 추가 언어, 외부 시스템 연동
- 플랜: Starter(월 30만원), Basic(월 50만원), Plus(월 70만원, 추천), Premium(월 100만원)

**중요**: content 필드에서 표가 필요한 경우 마크다운 테이블 문법을 사용하세요.
**중요**: 모든 내용은 한국어로 작성하세요.`;

    const userMessage = `## 고객 문의 원문:
- 회사: ${inquiry.company}
- 담당자: ${inquiry.name}
- 연락처: ${inquiry.phone}
- 이메일: ${inquiry.email || "미제공"}
- 관심 서비스: ${inquiry.service || "미지정"}
- 문의 유형: ${inquiry.inquiry_type === "demo" ? "데모 요청" : "상담 요청"}
- 문의 내용: ${inquiry.message || "별도 메시지 없음"}

## AI 기초 분석 결과:
${ai_basic_analysis || "분석 결과 없음"}

## AI 영업 전략 리포트:
${pro_analysis ? JSON.stringify(pro_analysis, null, 2) : "분석 결과 없음"}

위 정보를 종합하여, 고객에게 발송할 수 있는 전문 제안서를 JSON 형식으로 작성해주세요.`;

    let data: any;
    try {
      const result = await callAIWithFallback(
        LOVABLE_API_KEY,
        {
          max_tokens: 3000,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        },
        inquiry?.id,
      );
      data = result.data;
    } catch (e: any) {
      if (e?.status) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: e.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw e;
    }

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: "AI 응답이 비어있습니다" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse JSON from response
    let proposal;
    try {
      const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      proposal = JSON.parse(cleaned);
    } catch {
      return new Response(JSON.stringify({ error: "AI 응답 파싱 실패", raw: content }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ proposal }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-proposal error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
