import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronDown, ChevronUp, Zap, Copy, Mail, Check, RefreshCw, AlertTriangle, Target, Lock, Shield } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface Props {
  inquiry: any;
  proposalFrozen?: boolean;
  isSuperAdmin?: boolean;
}

interface ProAnalysis {
  customer_profile: {
    industry: string;
    scale: string;
    content_type: string;
    security_sensitivity: string;
    urgency: string;
    decision_maker_level: string;
  };
  feature_mapping: {
    requirement: string;
    bucket: "available" | "custom" | "limited";
    implementation: string;
    cost_note: string;
  }[];
  cost_scenarios: {
    scenario_a: CostScenario;
    scenario_b: CostScenario;
    scenario_c: CostScenario;
  };
  risk_flags: {
    severity: "high" | "medium" | "low";
    message: string;
    action: string;
  }[];
  strategic_score: {
    revenue_potential: number;
    purchase_intent: number;
    build_complexity: number;
    reference_value: number;
    urgency_score: number;
    total: number;
    priority: "HIGH" | "MEDIUM" | "LOW";
  };
  recommended_plan: string;
  response_email_draft: string;
  meeting_agenda: string[];
}

interface CostScenario {
  label: string;
  monthly: number;
  initial: number;
  coverage_pct: number;
  description: string;
}

type AnalysisState = "idle" | "loading" | "done" | "error";

const RETRYABLE_FUNCTION_ERRORS = [
  "Failed to send a request to the Edge Function",
  "Failed to fetch",
  "Gateway Timeout",
  "504",
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function buildInquiryPayload(inquiry: any) {
  return {
    id: inquiry.id,
    company: inquiry.company,
    name: inquiry.name,
    phone: inquiry.phone,
    email: inquiry.email,
    service: inquiry.service,
    inquiry_type: inquiry.inquiry_type,
    message: inquiry.message,
    created_at: inquiry.created_at,
    updated_at: inquiry.updated_at,
    status: inquiry.status,
    session_id: inquiry.session_id,
    ai_analysis: inquiry.ai_analysis,
  };
}

export default function InquiryProAnalysis({ inquiry, proposalFrozen, isSuperAdmin }: Props) {
  const [state, setState] = useState<AnalysisState>("idle");
  const [analysis, setAnalysis] = useState<ProAnalysis | null>(null);
  const [error, setError] = useState("");
  const [isPartial, setIsPartial] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [emailCopied, setEmailCopied] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [freezing, setFreezing] = useState(false);
  const [progressStep, setProgressStep] = useState<"requesting" | "analyzing" | "retrying" | "saving" | "done">("requesting");
  const [retryCount, setRetryCount] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load existing analysis on mount
  useEffect(() => {
    loadExisting();
  }, [inquiry.id]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startTimer = () => {
    setElapsedSec(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
  };
  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const loadExisting = async () => {
    const { data } = await supabase
      .from("inquiry_analyses" as any)
      .select("*")
      .eq("inquiry_id", inquiry.id)
      .single();
    if (data && ((data as any).analysis_status === "completed" || (data as any).analysis_status === "partial")) {
      setAnalysis({
        customer_profile: (data as any).customer_profile,
        feature_mapping: (data as any).feature_mapping,
        cost_scenarios: (data as any).cost_scenarios,
        risk_flags: (data as any).risk_flags,
        strategic_score: (data as any).strategic_score,
        recommended_plan: (data as any).recommended_plan,
        response_email_draft: (data as any).response_email_draft,
        meeting_agenda: (data as any).meeting_agenda,
      });
      setIsFrozen(!!(data as any).is_frozen);
      setIsPartial((data as any).analysis_status === "partial");
      setState("done");
    }
  };

  const freezeAnalysis = async () => {
    setFreezing(true);
    try {
      await supabase
        .from("inquiry_analyses" as any)
        .update({ is_frozen: true } as any)
        .eq("inquiry_id", inquiry.id);
      setIsFrozen(true);
    } finally {
      setFreezing(false);
    }
  };

  const invokeProAnalysis = async (payload: any) => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (attempt > 0) {
        setRetryCount(attempt);
        setProgressStep("retrying");
      } else {
        setProgressStep("requesting");
      }

      const { data, error: fnError } = await supabase.functions.invoke("analyze-inquiry-pro", {
        body: { inquiry: payload, ai_basic_analysis: payload.ai_analysis || null },
      });

      if (!fnError && !data?.error) {
        setProgressStep("saving");
        return data;
      }

      const message = data?.error || fnError?.message || "Pro 분석 요청에 실패했습니다.";
      lastError = new Error(message);

      const isRetryable = RETRYABLE_FUNCTION_ERRORS.some((keyword) => message.includes(keyword));
      if (!isRetryable || attempt === 2) {
        throw lastError;
      }

      await wait(1200 * (attempt + 1));
    }

    throw lastError || new Error("Pro 분석 요청에 실패했습니다.");
  };

  const runAnalysis = async () => {
    setState("loading");
    setError("");
    setRetryCount(0);
    setProgressStep("requesting");
    startTimer();
    try {
      const payload = buildInquiryPayload(inquiry);
      setProgressStep("analyzing");
      const data = await invokeProAnalysis(payload);
      setProgressStep("done");
      setAnalysis(data.analysis);
      setIsPartial(data.status === "partial");
      setState("done");
    } catch (e: any) {
      setError(e.message || "Pro 분석 중 오류가 발생했습니다.");
      setState("error");
    } finally {
      stopTimer();
    }
  };

  const copyEmail = useCallback(() => {
    if (!analysis?.response_email_draft) return;
    navigator.clipboard.writeText(analysis.response_email_draft);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  }, [analysis]);

  const gmailLink = useCallback(() => {
    if (!analysis?.response_email_draft || !inquiry.email) return "#";
    return `mailto:${inquiry.email}?subject=${encodeURIComponent(`[웹헤즈] ${inquiry.company}님 문의에 대한 답변`)}&body=${encodeURIComponent(analysis.response_email_draft)}`;
  }, [analysis, inquiry]);

  // IDLE state
  if (state === "idle") {
    return (
      <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
        <button
          onClick={runAnalysis}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all active:scale-[0.97] hover:opacity-90"
          style={{ background: "linear-gradient(135deg, hsl(37, 90%, 51%), hsl(15, 90%, 55%))" }}
        >
          <Zap className="w-4 h-4" /> AI 영업 전략 리포트
        </button>
      </div>
    );
  }

  // LOADING state
  if (state === "loading") {
    const steps = [
      { key: "requesting", label: "AI 요청 전송 중", desc: "Edge Function에 분석 요청을 보내고 있습니다" },
      { key: "analyzing", label: "AI 분석 중", desc: "고객 프로파일, 비용 시나리오, 리스크를 분석하고 있습니다" },
      { key: "retrying", label: `재시도 중 (${retryCount}/2)`, desc: "네트워크 오류로 재시도합니다. 잠시만 기다려주세요" },
      { key: "saving", label: "결과 저장 중", desc: "분석 결과를 데이터베이스에 저장하고 있습니다" },
    ];
    const activeIdx = steps.findIndex((s) => s.key === progressStep);

    return (
      <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
        <div className="rounded-xl border border-[hsl(37,60%,85%)] bg-[hsl(37,60%,97%)] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[hsl(37,90%,51%)]" />
              <p className="text-[12px] font-bold text-[hsl(37,90%,41%)]">Pro 분석 진행 중</p>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground tabular-nums">{elapsedSec}초</span>
          </div>
          <div className="space-y-2">
            {steps.map((step, i) => {
              const isCurrent = i === activeIdx;
              const isDone = i < activeIdx;
              const isRetryHidden = step.key === "retrying" && progressStep !== "retrying" && activeIdx < 2;
              if (isRetryHidden) return null;
              return (
                <div key={step.key} className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <div className="w-4 h-4 rounded-full bg-[hsl(152,57%,42%)] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-[hsl(37,90%,51%)] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[hsl(37,90%,51%)] animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-[hsl(220,13%,85%)]" />
                    )}
                  </div>
                  <div>
                    <p className={`text-[11px] font-semibold ${isCurrent ? "text-[hsl(37,90%,41%)]" : isDone ? "text-[hsl(152,57%,42%)]" : "text-muted-foreground/50"}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-[9px] text-muted-foreground mt-0.5">{step.desc}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ERROR state
  if (state === "error") {
    return (
      <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-[hsl(0,84%,90%)] bg-[hsl(0,84%,97%)]">
          <p className="text-[11px] text-[hsl(0,84%,50%)]">{error}</p>
          <button onClick={runAnalysis} className="text-[10px] font-semibold text-[hsl(221,83%,53%)] hover:underline">재시도</button>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const priorityColor: Record<"HIGH" | "MEDIUM" | "LOW", { bg: string; text: string }> = {
    HIGH: { bg: "hsl(0, 84%, 60%)", text: "white" },
    MEDIUM: { bg: "hsl(37, 90%, 51%)", text: "white" },
    LOW: { bg: "hsl(220, 9%, 75%)", text: "white" },
  };

  const clampScore = (value: unknown) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return 0;
    return Math.max(0, Math.min(20, Math.round(num)));
  };

  const scoreItems = [
    { key: "revenue_potential", label: "수익 잠재력", score: clampScore(analysis.strategic_score.revenue_potential) },
    { key: "purchase_intent", label: "구매 의향", score: clampScore(analysis.strategic_score.purchase_intent) },
    { key: "build_complexity", label: "구축 용이성", score: clampScore(analysis.strategic_score.build_complexity) },
    { key: "reference_value", label: "레퍼런스 가치", score: clampScore(analysis.strategic_score.reference_value) },
    { key: "urgency_score", label: "긴급도", score: clampScore(analysis.strategic_score.urgency_score) },
  ].map((item) => ({ ...item, percent: (item.score / 20) * 100 }));

  const recalculatedTotal = scoreItems.reduce((sum, item) => sum + item.score, 0);
  const recalculatedPriority: "HIGH" | "MEDIUM" | "LOW" =
    recalculatedTotal >= 70 ? "HIGH" : recalculatedTotal >= 40 ? "MEDIUM" : "LOW";
  const pc = priorityColor[recalculatedPriority];

  const bucketConfig = {
    available: { label: "기본 제공", color: "hsl(152, 57%, 42%)", bg: "hsl(152, 57%, 42%, 0.08)" },
    custom: { label: "커스터마이징", color: "hsl(37, 90%, 51%)", bg: "hsl(37, 90%, 51%, 0.08)" },
    limited: { label: "제한/불가", color: "hsl(0, 84%, 60%)", bg: "hsl(0, 84%, 60%, 0.08)" },
  };

  const severityConfig = {
    high: { color: "hsl(0, 84%, 60%)", bg: "hsl(0, 84%, 60%, 0.08)", label: "높음" },
    medium: { color: "hsl(37, 90%, 51%)", bg: "hsl(37, 90%, 51%, 0.08)", label: "보통" },
    low: { color: "hsl(220, 9%, 60%)", bg: "hsl(220, 9%, 60%, 0.08)", label: "낮음" },
  };

  return (
    <div className="mt-5 pt-4 border-t border-[hsl(220,13%,91%)]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 flex-1 text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white" style={{ background: isFrozen ? "linear-gradient(135deg, hsl(220, 60%, 45%), hsl(220, 70%, 55%))" : "linear-gradient(135deg, hsl(37, 90%, 51%), hsl(15, 90%, 55%))" }}>
            {isFrozen ? <Shield className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />} AI 영업 전략 리포트
          </span>
          {isFrozen && (
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold text-white bg-[hsl(220,60%,50%)] flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> 확정
            </span>
          )}
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: pc.bg, color: pc.text }}>
            {recalculatedPriority}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(152,57%,42%,0.1)] text-[hsl(152,57%,42%)] font-semibold">
            {analysis.recommended_plan}
          </span>
          <div className="flex-1" />
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
        {!isFrozen && !proposalFrozen && (
          <>
            <button
              onClick={freezeAnalysis}
              disabled={freezing}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-white bg-[hsl(220,60%,50%)] hover:bg-[hsl(220,60%,45%)] transition-colors disabled:opacity-50"
            >
              {freezing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lock className="w-3 h-3" />} 확정
            </button>
            <button
              onClick={runAnalysis}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-[hsl(37,90%,41%)] bg-[hsl(37,90%,51%,0.08)] hover:bg-[hsl(37,90%,51%,0.14)] transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> 재분석
            </button>
          </>
        )}
        {isFrozen && isSuperAdmin && (
          <button
            onClick={runAnalysis}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-white bg-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,50%)] transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> 강제 재분석
          </button>
        )}
      </div>

      {expanded && (
        <>
        {isPartial && (
          <div className="flex items-center gap-2 px-4 py-2.5 mb-3 rounded-xl border border-[hsl(45,93%,70%)] bg-[hsl(45,93%,95%)]">
            <AlertTriangle className="w-4 h-4 text-[hsl(37,90%,41%)] shrink-0" />
            <p className="text-[11px] font-medium text-[hsl(37,90%,31%)]">일부 분석 항목이 불완전합니다. 재분석을 권장합니다.</p>
            {!isFrozen && (
              <button onClick={runAnalysis} className="ml-auto text-[10px] font-semibold text-[hsl(221,83%,53%)] hover:underline shrink-0">재분석</button>
            )}
          </div>
        )}
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="w-full justify-start bg-[hsl(220,14%,96%)] rounded-xl p-1 gap-0.5 h-auto flex-wrap">
            <TabsTrigger value="summary" className="text-[11px] px-3 py-1.5 rounded-lg data-[state=active]:bg-white">분석 요약</TabsTrigger>
            <TabsTrigger value="features" className="text-[11px] px-3 py-1.5 rounded-lg data-[state=active]:bg-white">기능 매핑</TabsTrigger>
            <TabsTrigger value="cost" className="text-[11px] px-3 py-1.5 rounded-lg data-[state=active]:bg-white">비용 시나리오</TabsTrigger>
            <TabsTrigger value="risks" className="text-[11px] px-3 py-1.5 rounded-lg data-[state=active]:bg-white">리스크 & 액션</TabsTrigger>
            <TabsTrigger value="email" className="text-[11px] px-3 py-1.5 rounded-lg data-[state=active]:bg-white">대응 이메일</TabsTrigger>
          </TabsList>

          {/* Tab 1: Summary */}
          <TabsContent value="summary" className="mt-3 space-y-3">
            {/* Customer Profile */}
            <div className="bg-white rounded-xl border border-[hsl(220,13%,91%)] p-4">
              <p className="text-[11px] font-bold text-muted-foreground mb-3 tracking-wide">고객 프로파일</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <ProfileBadge label="업종" value={analysis.customer_profile.industry} />
                <ProfileBadge label="규모" value={analysis.customer_profile.scale} />
                <ProfileBadge label="콘텐츠 유형" value={contentTypeLabel(analysis.customer_profile.content_type)} />
                <ProfileBadge label="보안 민감도" value={levelLabel(analysis.customer_profile.security_sensitivity)} level={analysis.customer_profile.security_sensitivity} />
                <ProfileBadge label="긴급도" value={levelLabel(analysis.customer_profile.urgency)} level={analysis.customer_profile.urgency} />
                <ProfileBadge label="의사결정자" value={decisionLabel(analysis.customer_profile.decision_maker_level)} />
              </div>
            </div>

            {/* Strategic Score */}
            <div className="bg-white rounded-xl border border-[hsl(220,13%,91%)] p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-muted-foreground tracking-wide">전략적 가치 스코어</p>
                <div className="flex items-center gap-2">
                  <span className="text-[18px] font-black text-foreground">{recalculatedTotal}</span>
                  <span className="text-[10px] text-muted-foreground">/100</span>
                </div>
              </div>
              <div className="space-y-2.5">
                {scoreItems.map((item) => (
                  <div key={item.key} className="flex items-center gap-3">
                    <span className="text-[11px] text-muted-foreground w-[80px] shrink-0">{item.label}</span>
                    <div className="flex-1">
                      <Progress value={item.percent} className="h-2" />
                    </div>
                    <span className="text-[11px] font-semibold text-foreground w-[32px] text-right">{item.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Feature Mapping */}
          <TabsContent value="features" className="mt-3">
            <div className="bg-white rounded-xl border border-[hsl(220,13%,91%)] overflow-hidden">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left font-bold text-foreground px-3 py-2.5 border-b border-[hsl(220,13%,91%)]">요구사항</th>
                    <th className="text-left font-bold text-foreground px-3 py-2.5 border-b border-[hsl(220,13%,91%)] w-[80px]">분류</th>
                    <th className="text-left font-bold text-foreground px-3 py-2.5 border-b border-[hsl(220,13%,91%)]">구현 방안</th>
                    <th className="text-left font-bold text-foreground px-3 py-2.5 border-b border-[hsl(220,13%,91%)] w-[100px]">비용</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.feature_mapping.map((feat, i) => {
                    const bc = bucketConfig[feat.bucket] || bucketConfig.limited;
                    return (
                      <tr key={i} className={`${i % 2 === 1 ? "bg-muted/30" : ""} border-b border-[hsl(220,13%,91%)] last:border-b-0`}>
                        <td className="px-3 py-2.5 text-foreground font-medium">{feat.requirement}</td>
                        <td className="px-3 py-2.5">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: bc.color, background: bc.bg }}>
                            {bc.label}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-foreground/70">{feat.implementation}</td>
                        <td className="px-3 py-2.5 text-foreground/70 text-[11px]">{feat.cost_note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Tab 3: Cost Scenarios */}
          <TabsContent value="cost" className="mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(["scenario_a", "scenario_b", "scenario_c"] as const).map((key) => {
                const scenario = analysis.cost_scenarios[key];
                const isRecommended = key === "scenario_b";
                return (
                  <div
                    key={key}
                    className="rounded-xl p-4 border"
                    style={{
                      borderColor: isRecommended ? "hsl(37, 90%, 51%)" : "hsl(220, 13%, 91%)",
                      background: isRecommended ? "hsl(37, 90%, 51%, 0.04)" : "white",
                      boxShadow: isRecommended ? "0 0 0 2px hsl(37, 90%, 51%, 0.12)" : "none",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[13px] font-bold text-foreground">{scenario.label}</span>
                      {isRecommended && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white bg-[hsl(37,90%,51%)]">추천</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground">월 비용</p>
                        <p className="text-[16px] font-black text-foreground">{Number(scenario.monthly).toLocaleString()}<span className="text-[11px] font-normal text-muted-foreground">원</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">초기 비용</p>
                        <p className="text-[14px] font-bold text-foreground">{Number(scenario.initial).toLocaleString()}<span className="text-[11px] font-normal text-muted-foreground">원</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1">요구사항 커버리지</p>
                        <div className="flex items-center gap-2">
                          <Progress value={scenario.coverage_pct} className="h-2 flex-1" />
                          <span className="text-[11px] font-semibold">{scenario.coverage_pct}%</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">{scenario.description}</p>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Tab 4: Risks & Actions */}
          <TabsContent value="risks" className="mt-3 space-y-3">
            {/* Risk Flags */}
            <div className="bg-white rounded-xl border border-[hsl(220,13%,91%)] p-4">
              <p className="text-[11px] font-bold text-muted-foreground mb-3 tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> 리스크 플래그
              </p>
              <div className="space-y-2">
                {analysis.risk_flags.map((risk, i) => {
                  const sc = severityConfig[risk.severity] || severityConfig.low;
                  return (
                    <div key={i} className="flex gap-3 p-3 rounded-lg" style={{ background: sc.bg }}>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 h-fit" style={{ color: sc.color, background: `${sc.color}20` }}>
                        {sc.label}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-foreground font-medium">{risk.message}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">→ {risk.action}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Meeting Agenda */}
            <div className="bg-white rounded-xl border border-[hsl(220,13%,91%)] p-4">
              <p className="text-[11px] font-bold text-muted-foreground mb-3 tracking-wide flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> 미팅 어젠다
              </p>
              <div className="space-y-1.5">
                {analysis.meeting_agenda.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-md bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-[12px] text-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Tab 5: Email Draft */}
          <TabsContent value="email" className="mt-3">
            <div className="bg-white rounded-xl border border-[hsl(220,13%,91%)] p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-muted-foreground tracking-wide">대응 이메일 초안</p>
                <div className="flex gap-2">
                  <button
                    onClick={copyEmail}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-foreground bg-muted hover:bg-muted/80 transition-colors"
                  >
                    {emailCopied ? <Check className="w-3 h-3 text-[hsl(152,57%,42%)]" /> : <Copy className="w-3 h-3" />}
                    {emailCopied ? "복사됨" : "복사"}
                  </button>
                  {inquiry.email && (
                    <a
                      href={gmailLink()}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-white bg-[hsl(221,83%,53%)] hover:opacity-90 transition-opacity"
                    >
                      <Mail className="w-3 h-3" /> 메일 보내기
                    </a>
                  )}
                </div>
              </div>
              <div className="bg-[hsl(220,14%,97%)] rounded-lg p-4 text-[12px] leading-[1.8] text-foreground whitespace-pre-wrap border border-[hsl(220,13%,93%)]">
                {analysis.response_email_draft}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </>
      )}
    </div>
  );
}

function ProfileBadge({ label, value, level }: { label: string; value: string; level?: string }) {
  const levelColors: Record<string, string> = {
    high: "hsl(0, 84%, 60%)",
    medium: "hsl(37, 90%, 51%)",
    low: "hsl(152, 57%, 42%)",
  };
  return (
    <div className="bg-[hsl(220,14%,97%)] rounded-lg px-3 py-2">
      <p className="text-[9px] font-medium text-muted-foreground mb-0.5">{label}</p>
      <p className="text-[12px] font-semibold text-foreground" style={level ? { color: levelColors[level] || undefined } : undefined}>
        {value}
      </p>
    </div>
  );
}

function contentTypeLabel(type: string) {
  const map: Record<string, string> = { video_heavy: "영상 중심", document_heavy: "문서 중심", mixed: "혼합" };
  return map[type] || type;
}
function levelLabel(level: string) {
  const map: Record<string, string> = { high: "높음", medium: "보통", low: "낮음" };
  return map[level] || level;
}
function decisionLabel(level: string) {
  const map: Record<string, string> = { c_level: "C레벨", mid_level: "중간 관리자", unknown: "미확인" };
  return map[level] || level;
}
