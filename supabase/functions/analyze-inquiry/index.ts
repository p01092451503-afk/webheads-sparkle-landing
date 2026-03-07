import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getServiceContext } from "../_shared/service-catalog.ts";

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

const BASE_COMPANY_CONTEXT = `
## 웹헤즈 회사 정보
- 16년 이상 이러닝 전문 기업, 300+ 고객사, 92.6% 유지율
- 서비스: LMS, 호스팅, 유지보수, AI챗봇, 앱 개발, DRM, 채널톡/SMS, PG 결제, 콘텐츠 제작
- 솔루션: Light(임대형), PRO(구축형/On-premise)
`;

/** Convert JSON object to readable markdown when AI ignores format instructions */
function jsonToMarkdown(obj: Record<string, unknown>, depth = 0): string {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const heading = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    if (typeof value === "string") {
      lines.push(`${"###".slice(0, 3)} ${heading}\n${value}\n`);
    } else if (Array.isArray(value)) {
      lines.push(`### ${heading}`);
      for (const item of value) {
        if (typeof item === "string") {
          lines.push(`- ${item}`);
        } else if (typeof item === "object" && item !== null) {
          const parts = Object.entries(item).map(([k, v]) => `**${k}**: ${v}`).join(" / ");
          lines.push(`- ${parts}`);
        }
      }
      lines.push("");
    } else if (typeof value === "object" && value !== null) {
      lines.push(`### ${heading}`);
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        lines.push(`- **${k}**: ${typeof v === "object" ? JSON.stringify(v) : v}`);
      }
      lines.push("");
    } else {
      lines.push(`- **${heading}**: ${value}`);
    }
  }
  return lines.join("\n");
}

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

마크다운 형식으로 깔끔하게 작성하되, 각 섹션 사이에 --- 구분선을 반드시 넣고, 구체적인 숫자와 금액을 포함해주세요. 이모지는 절대 사용하지 마세요.
절대 JSON 형식으로 응답하지 마세요. 반드시 사람이 읽기 쉬운 마크다운 산문 형식으로만 작성하세요. JSON 객체, 배열, 중괄호, 대괄호 등의 코드 구조는 포함하지 마세요.`;

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

    let content = data.choices?.[0]?.message?.content || "분석 결과를 생성할 수 없습니다.";

    // If AI returned JSON despite instructions, try to convert it to readable markdown
    const trimmed = content.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("```json") || trimmed.startsWith("```{")) {
      try {
        const cleaned = trimmed.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?\s*```\s*$/i, "").trim();
        const parsed = JSON.parse(cleaned);
        content = jsonToMarkdown(parsed);
      } catch {
        // If JSON parse fails, strip code fences at least
        content = trimmed.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?\s*```\s*$/i, "").trim();
      }
    }

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
