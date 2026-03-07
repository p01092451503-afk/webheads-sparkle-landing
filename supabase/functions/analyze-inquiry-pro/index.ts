import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRIMARY_MODEL = "google/gemini-3-flash-preview";
const FALLBACK_MODEL = "google/gemini-2.5-flash";
const AI_TIMEOUT_MS = 120000;

async function callAIWithFallback(
  apiKey: string,
  body: Record<string, unknown>,
  inquiryId?: string,
  signal?: AbortSignal,
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
      signal,
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

/* ── Default values for partial save ── */
const DEFAULTS = {
  customer_profile: {
    industry: "분석 중",
    scale: "미확인",
    content_type: "mixed",
    security_sensitivity: "medium",
    urgency: "medium",
    decision_maker_level: "unknown",
  },
  feature_mapping: [],
  cost_scenarios: {
    scenario_a: { label: "진입형", monthly: 0, initial: 0, coverage_pct: 0, description: "재분석 필요" },
    scenario_b: { label: "전략 추천형", monthly: 0, initial: 0, coverage_pct: 0, description: "재분석 필요" },
    scenario_c: { label: "프리미엄형", monthly: 0, initial: 0, coverage_pct: 0, description: "재분석 필요" },
  },
  risk_flags: [],
  strategic_score: {
    revenue_potential: 0,
    purchase_intent: 0,
    build_complexity: 0,
    reference_value: 0,
    urgency_score: 0,
    total: 0,
    priority: "MEDIUM",
  },
  recommended_plan: "Basic",
  response_email_draft: "",
  meeting_agenda: [],
};

/* ── JSON cleaning: strip code fences, trim ── */
function cleanJsonResponse(raw: string): string {
  // Remove ```json ... ``` or ``` ... ``` fences
  let cleaned = raw.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?\s*```\s*$/i, "").trim();
  // If still wrapped in fences (multiple), do a greedy extract
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/i);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }
  return cleaned;
}

/* ── Merge parsed (possibly partial) data with defaults ── */
function mergeWithDefaults(parsed: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(DEFAULTS)) {
    const defaultVal = (DEFAULTS as any)[key];
    const parsedVal = parsed[key];

    if (parsedVal === undefined || parsedVal === null) {
      result[key] = defaultVal;
    } else if (typeof defaultVal === "object" && !Array.isArray(defaultVal) && typeof parsedVal === "object" && !Array.isArray(parsedVal)) {
      // Deep merge one level for objects like customer_profile, cost_scenarios, strategic_score
      result[key] = { ...defaultVal, ...(parsedVal as Record<string, unknown>) };
    } else {
      result[key] = parsedVal;
    }
  }
  return result;
}

async function upsertAnalysisRow(row: Record<string, unknown>) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing");
    return;
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/inquiry_analyses?on_conflict=inquiry_id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("DB upsert error:", res.status, errText);
    return;
  }

  await res.text();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  let inquiryId: string | null = null;

  try {
    const { inquiry, ai_basic_analysis } = await req.json();
    inquiryId = inquiry?.id ?? null;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `당신은 Webheads(웹헤즈)의 **영업 전략 전문 AI 어드바이저**입니다.
아래 제공되는 고객 문의 원문과 AI 기초 분석 결과를 **종합**하여, 실질적인 영업 전략 리포트를 작성합니다.
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요.

## 분석 방향 (핵심 포커스: 영업 전략)
1. **고객 프로파일**: 기초 분석을 기반으로, 의사결정 구조·예산 규모·도입 타이밍·경쟁사 전환 가능성을 파악
2. **기능 매핑**: 고객이 명시적/암시적으로 원하는 기능을 Webheads 제품 기준으로 매핑하되, **영업 포인트(차별화 강조점)**를 함께 제시
3. **비용 시나리오**: 단순 가격표가 아닌, 고객의 예산 심리와 의사결정 단계를 고려한 전략적 제안 (앵커링, 단계별 도입 등)
4. **리스크 & 영업 액션**: 딜 성사를 방해할 수 있는 요인과 이를 극복하기 위한 **구체적 영업 액션 아이템**
5. **전략적 가치 스코어**: 이 고객이 Webheads에 가져다줄 전략적 가치를 다면 평가
6. **대응 이메일**: 영업 관점에서 신뢰 구축과 다음 미팅 유도에 초점을 맞춘 이메일 초안
7. **미팅 어젠다**: 첫 미팅에서 다뤄야 할 핵심 안건을 영업 전략 관점에서 우선순위화

## Webheads 제품 정보:
- 기본 제공: 순차학습, 객관식 Quiz, 수료증 발급, 관리자 대시보드, 모바일 반응형, 한/영 다국어, 글로벌 CDN (Plus 이상), 소셜 로그인, Zoom 연동, SMS/카카오 알림톡 연동, AI 학습 독려, 검색엔진 최적화, 디자인 템플릿
- 커스터마이징 필요: STEP 잠금/해제 로직(500~800만원), 시나리오 Quiz(500~1000만원), 대리점별 권한 세분화(300~600만원), 대리점 그룹 리포트(400~700만원), DRM(월 30만원), 추가 언어 지원(별도 견적), 외부 시스템 연동 ERP/CRM(별도 견적)
- 불가/제한: Native 앱 개발 불가(웹뷰 앱 가능), 복잡한 상호작용형 Quiz 직접 지원 불가
- 플랜: Starter(월 30만원), Basic(월 50만원), Plus(월 70만원, 추천), Premium(월 100만원)
- 초과 사용 요금: 전송량 Basic 500원/GB, Plus 400원/GB, Premium 300원/GB; 저장공간 Basic 1000원/GB, Plus 800원/GB, Premium 500원/GB

## 응답 JSON 구조:
{
  "customer_profile": {
    "industry": "string",
    "scale": "string (국가 수, 사용자 수, 조직 규모 등)",
    "content_type": "video_heavy | document_heavy | mixed",
    "security_sensitivity": "high | medium | low",
    "urgency": "high | medium | low",
    "decision_maker_level": "c_level | mid_level | unknown"
  },
  "feature_mapping": [
    {
      "requirement": "string (고객 요구사항)",
      "bucket": "available | custom | limited",
      "implementation": "string (구현 방안)",
      "cost_note": "string (비용 관련 메모)"
    }
  ],
  "cost_scenarios": {
    "scenario_a": {
      "label": "진입형",
      "monthly": number,
      "initial": number,
      "coverage_pct": number,
      "description": "string (영업 전략적 포지셔닝 설명)"
    },
    "scenario_b": {
      "label": "전략 추천형",
      "monthly": number,
      "initial": number,
      "coverage_pct": number,
      "description": "string (왜 이 시나리오를 추천하는지 영업 논리)"
    },
    "scenario_c": {
      "label": "프리미엄형",
      "monthly": number,
      "initial": number,
      "coverage_pct": number,
      "description": "string (앵커링 효과 및 향후 업셀 전략)"
    }
  },
  "risk_flags": [
    {
      "severity": "high | medium | low",
      "message": "string (딜 성사를 위협하는 요인)",
      "action": "string (이를 극복하기 위한 구체적 영업 액션)"
    }
  ],
  "strategic_score": {
    "revenue_potential": number (0~20, 예상 매출 규모 및 반복 수익 가능성),
    "purchase_intent": number (0~20, 구매 의사 및 도입 확정 수준),
    "build_complexity": number (0~20, 구축 난이도가 낮을수록 높은 점수. 쉬우면 18~20, 어려우면 2~5),
    "reference_value": number (0~20, 레퍼런스/포트폴리오 가치),
    "urgency_score": number (0~20, 도입 시급성),
    "total": number (위 5개 항목의 합산, 0~100),
    "priority": "HIGH | MEDIUM | LOW"
  },
  "recommended_plan": "Starter | Basic | Plus | Premium",
  "response_email_draft": "string (아래 이메일 작성 가이드라인을 엄격히 준수한 한국어 비즈니스 이메일)",
  "meeting_agenda": ["string (영업 전략 관점 우선순위 어젠다)"]
}

## 대응 이메일 작성 가이드라인 (response_email_draft):
- **톤**: 격식 있는 비즈니스 서신체. "~드립니다", "~말씀드립니다" 등 경어체를 일관 사용
- **구조**: ① 인사 및 문의 감사 (1~2줄) → ② 고객 니즈에 대한 공감 및 핵심 요약 (2~3줄) → ③ WEBHEADS가 제공할 수 있는 가치 언급 (구체적 기능명 1~2개, 과잉 나열 금지) → ④ 미팅/통화 일정 제안 (구체적 시간대 2~3개 예시) → ⑤ 맺음 인사
- **발신자**: "WEBHEADS(웹헤즈) [이름]" 형식. 직함은 "담당 매니저"로 통일
- **절대 금지**: "제안서를 준비하였습니다/첨부합니다/드립니다" 등 제안서 준비·전달 관련 문구, 가격·플랜명 직접 언급, 과도한 자기 홍보, 이모지 사용
- **권장**: 고객사명과 담당자명을 자연스럽게 포함, 문의 내용 중 핵심 키워드를 1~2개 인용하여 맞춤형 느낌 부여, 미팅 유도가 이메일의 최종 목표임을 명확히
- **분량**: 250~400자 내외. 간결하되 성의 있는 길이 유지
- **줄바꿈**: 문단 구분을 위해 \\n\\n을 사용하여 가독성 확보
- risk_flags의 action은 "~하세요" 형태의 구체적 영업 액션 (예: "첫 미팅에서 무료 PoC를 제안하세요")
- meeting_agenda는 영업 성공률을 높이기 위한 전략적 순서로 배치
- priority는 total 기준으로만 산정: HIGH(70~100), MEDIUM(40~69), LOW(0~39)
- AI 기초 분석이 제공된 경우, 기초 분석의 인사이트를 적극 활용하되 더 깊은 영업 전략적 관점을 추가
- 반드시 유효한 JSON만 출력하세요`;

    let userMessage = `다음 고객 문의를 영업 전략 관점에서 종합 분석해주세요:

## 고객 문의 원문
회사명: ${inquiry.company}
담당자: ${inquiry.name}
연락처: ${inquiry.phone}
이메일: ${inquiry.email || "없음"}
관심 서비스: ${inquiry.service || "미지정"}
문의 유형: ${inquiry.inquiry_type === "demo" ? "데모 요청" : "상담 요청"}

문의 내용:
${(inquiry.message || "(내용 없음)").slice(0, 6000)}`;

    if (ai_basic_analysis) {
      userMessage += `

## AI 기초 분석 결과 (1차 분석)
${typeof ai_basic_analysis === 'string' ? ai_basic_analysis.slice(0, 4000) : JSON.stringify(ai_basic_analysis).slice(0, 4000)}

위 기초 분석을 참고하여, 더 깊은 영업 전략적 관점에서 종합 리포트를 작성해주세요.`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort("AI request timeout"), AI_TIMEOUT_MS);

    let data: any;
    try {
      const result = await callAIWithFallback(
        LOVABLE_API_KEY,
        {
          temperature: 0.2,
          max_tokens: 2500,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        },
        inquiryId ?? undefined,
        controller.signal,
      );
      data = result.data;
    } catch (e: any) {
      clearTimeout(timeoutId);
      if (e?.status) {
        if (inquiryId && e.status >= 500) {
          await upsertAnalysisRow({ inquiry_id: inquiryId, analysis_status: "failed", error_message: e.message });
        }
        return new Response(JSON.stringify({ error: e.message }), {
          status: e.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw e;
    }

    clearTimeout(timeoutId);

    const rawContent = data.choices?.[0]?.message?.content || "";

    // Clean JSON: strip code fences, trim
    const cleanedContent = cleanJsonResponse(rawContent);

    let parsed: Record<string, unknown>;
    let isPartial = false;

    try {
      parsed = JSON.parse(cleanedContent);
    } catch {
      // JSON parse failed — attempt partial save with defaults
      console.error("Failed to parse AI response as JSON. Raw (first 500 chars):", rawContent.slice(0, 500));
      isPartial = true;
      parsed = {};
    }

    // Merge with defaults to fill any missing fields
    const merged = mergeWithDefaults(parsed);

    // Determine if any key field was missing from parsed → mark as partial
    const criticalKeys = ["customer_profile", "cost_scenarios", "strategic_score"];
    if (!isPartial) {
      for (const key of criticalKeys) {
        if (parsed[key] === undefined || parsed[key] === null) {
          isPartial = true;
          break;
        }
      }
    }

    const analysisStatus = isPartial ? "partial" : "completed";
    const errorMessage = isPartial ? `일부 분석 항목이 불완전합니다. AI 원본 응답(앞 500자): ${rawContent.slice(0, 500)}` : null;

    if (inquiryId) {
      await upsertAnalysisRow({
        inquiry_id: inquiryId,
        customer_profile: merged.customer_profile,
        feature_mapping: merged.feature_mapping,
        cost_scenarios: merged.cost_scenarios,
        risk_flags: merged.risk_flags,
        strategic_score: merged.strategic_score,
        recommended_plan: merged.recommended_plan,
        response_email_draft: merged.response_email_draft,
        meeting_agenda: merged.meeting_agenda,
        analysis_status: analysisStatus,
        error_message: errorMessage,
      });
    }

    return new Response(JSON.stringify({ analysis: merged, status: analysisStatus }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Error:", e);

    if (inquiryId) {
      await upsertAnalysisRow({ inquiry_id: inquiryId, analysis_status: "failed", error_message: message });
    }

    if (message.includes("timeout") || message.includes("aborted")) {
      return new Response(JSON.stringify({ error: "분석 시간이 초과되었습니다. 다시 시도해주세요." }), {
        status: 504,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
