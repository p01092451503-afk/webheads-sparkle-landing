import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    const systemPrompt = `당신은 Webheads LMS(웹헤즈)의 영업 지원 AI입니다.
고객 문의를 분석하여 반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요.

Webheads 제품 정보:
- 기본 제공: 순차학습, 객관식 Quiz, 수료증 발급, 관리자 대시보드, 모바일 반응형, 한/영 다국어, 글로벌 CDN (Plus 이상), 소셜 로그인, Zoom 연동, SMS/카카오 알림톡 연동, AI 학습 독려, 검색엔진 최적화, 디자인 템플릿
- 커스터마이징 필요: STEP 잠금/해제 로직(500~800만원), 시나리오 Quiz(500~1000만원), 대리점별 권한 세분화(300~600만원), 대리점 그룹 리포트(400~700만원), DRM(월 30만원), 추가 언어 지원(별도 견적), 외부 시스템 연동 ERP/CRM(별도 견적)
- 불가/제한: Native 앱 개발 불가(웹뷰 앱 가능), 복잡한 상호작용형 Quiz 직접 지원 불가
- 플랜: Starter(월 30만원), Basic(월 50만원), Plus(월 70만원, 추천), Premium(월 100만원)
- 초과 사용 요금: 전송량 Basic 500원/GB, Plus 400원/GB, Premium 300원/GB; 저장공간 Basic 1000원/GB, Plus 800원/GB, Premium 500원/GB

응답 JSON 구조:
{
  "customer_profile": {
    "industry": "string",
    "scale": "string (국가 수, 사용자 수 등)",
    "content_type": "video_heavy | document_heavy | mixed",
    "security_sensitivity": "high | medium | low",
    "urgency": "high | medium | low",
    "decision_maker_level": "c_level | mid_level | unknown"
  },
  "feature_mapping": [
    {
      "requirement": "string (고객 요구사항)",
      "bucket": "available | custom | limited",
      "implementation": "string",
      "cost_note": "string"
    }
  ],
  "cost_scenarios": {
    "scenario_a": {
      "label": "기본형",
      "monthly": number,
      "initial": number,
      "coverage_pct": number,
      "description": "string"
    },
    "scenario_b": {
      "label": "권장형",
      "monthly": number,
      "initial": number,
      "coverage_pct": number,
      "description": "string"
    },
    "scenario_c": {
      "label": "풀패키지",
      "monthly": number,
      "initial": number,
      "coverage_pct": number,
      "description": "string"
    }
  },
  "risk_flags": [
    {
      "severity": "high | medium | low",
      "message": "string",
      "action": "string (담당자 액션 아이템)"
    }
  ],
  "strategic_score": {
    "revenue_potential": number,
    "purchase_intent": number,
    "build_complexity": number,
    "reference_value": number,
    "urgency_score": number,
    "total": number,
    "priority": "HIGH | MEDIUM | LOW"
  },
  "recommended_plan": "Starter | Basic | Plus | Premium",
  "response_email_draft": "string (고객사명과 요구사항을 반영한 한국어 대응 이메일 초안)",
  "meeting_agenda": ["string"]
}

분석 시 주의사항:
- strategic_score의 각 항목은 0~100 사이 정수
- total은 5개 항목의 가중 평균 (revenue_potential 30%, purchase_intent 25%, reference_value 20%, urgency_score 15%, build_complexity 10%(역수))
- coverage_pct는 고객 요구사항 중 해당 시나리오로 충족 가능한 비율 (0~100)
- cost_scenarios의 금액은 만원 단위 정수 (예: 70 = 70만원)
- response_email_draft는 존칭을 사용한 정중한 비즈니스 이메일
- 반드시 유효한 JSON만 출력하세요`;

    const userMessage = `다음 고객 문의를 분석해주세요:

회사명: ${inquiry.company}
담당자: ${inquiry.name}
연락처: ${inquiry.phone}
이메일: ${inquiry.email || "없음"}
관심 서비스: ${inquiry.service || "미지정"}
문의 유형: ${inquiry.inquiry_type === "demo" ? "데모 요청" : "상담 요청"}

문의 내용:
${inquiry.message || "(내용 없음)"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";

    // Strip markdown code fences if present
    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response as JSON:", content);
      return new Response(JSON.stringify({ error: "AI 응답을 JSON으로 파싱할 수 없습니다.", raw: content }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save to inquiry_analyses table
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/inquiry_analyses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        inquiry_id: inquiry.id,
        customer_profile: parsed.customer_profile,
        feature_mapping: parsed.feature_mapping,
        cost_scenarios: parsed.cost_scenarios,
        risk_flags: parsed.risk_flags,
        strategic_score: parsed.strategic_score,
        recommended_plan: parsed.recommended_plan,
        response_email_draft: parsed.response_email_draft,
        meeting_agenda: parsed.meeting_agenda,
        analysis_status: "completed",
        error_message: null,
      }),
    });

    if (!upsertRes.ok) {
      const errText = await upsertRes.text();
      console.error("DB upsert error:", upsertRes.status, errText);
    } else {
      await upsertRes.text();
    }

    return new Response(JSON.stringify({ analysis: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
