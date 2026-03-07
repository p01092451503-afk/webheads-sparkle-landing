import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Play, Check, AlertTriangle, RefreshCw, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type StepKey = "basic" | "pro" | "proposal";
type StepStatus = "idle" | "running" | "done" | "error";

interface StepState {
  status: StepStatus;
  error?: string;
}

interface Props {
  inquiry: any;
  onComplete?: () => void;
  onStepDone?: (step: StepKey) => void;
}

const STEP_DELAY_MS = 1500;

const STEPS: { key: StepKey; label: string; desc: string }[] = [
  { key: "basic", label: "1차 AI 분석", desc: "기초 분석 (요금제 매칭)" },
  { key: "pro", label: "2차 전략 리포트", desc: "영업 전략 종합 분석" },
  { key: "proposal", label: "제안서 생성", desc: "맞춤 제안서 작성" },
];

export default function AutoAnalysisPipeline({ inquiry, onComplete, onStepDone }: Props) {
  const [enabled, setEnabled] = useState(false);
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<Record<StepKey, StepState>>({
    basic: { status: "idle" },
    pro: { status: "idle" },
    proposal: { status: "idle" },
  });
  const abortRef = useRef(false);

  const updateStep = useCallback((key: StepKey, state: Partial<StepState>) => {
    setSteps(prev => ({ ...prev, [key]: { ...prev[key], ...state } }));
  }, []);

  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runBasic = useCallback(async () => {
    updateStep("basic", { status: "running", error: undefined });
    const { data, error } = await supabase.functions.invoke("analyze-inquiry", {
      body: { inquiry },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);

    const updatePayload: any = { ai_analysis: data.analysis };
    if (data.analysis_v2) updatePayload.ai_analysis_v2 = data.analysis_v2;
    await supabase.from("contact_inquiries").update(updatePayload).eq("id", inquiry.id);

    updateStep("basic", { status: "done" });
    return data;
  }, [inquiry, updateStep]);

  const runPro = useCallback(async (basicData: any) => {
    updateStep("pro", { status: "running", error: undefined });
    const payload = {
      id: inquiry.id, company: inquiry.company, name: inquiry.name,
      phone: inquiry.phone, email: inquiry.email, service: inquiry.service,
      inquiry_type: inquiry.inquiry_type, message: inquiry.message,
      created_at: inquiry.created_at, updated_at: inquiry.updated_at,
      status: inquiry.status, session_id: inquiry.session_id,
      ai_analysis: basicData?.analysis || inquiry.ai_analysis,
      ai_analysis_v2: basicData?.analysis_v2 || inquiry.ai_analysis_v2,
    };
    const { data, error } = await supabase.functions.invoke("analyze-inquiry-pro", {
      body: { inquiry: payload, ai_basic_analysis: payload.ai_analysis_v2 || payload.ai_analysis || null },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);

    updateStep("pro", { status: "done" });
    return data;
  }, [inquiry, updateStep]);

  const runProposal = useCallback(async (basicData: any, proData: any) => {
    updateStep("proposal", { status: "running", error: undefined });

    let companyInfo = { name: "WEBHEADS", address: "서울시 마포구 월드컵로114, 3층", phone: "02-540-4337", website: "www.webheads.co.kr" };
    const { data: settingsData } = await supabase.from("admin_settings").select("value").eq("key", "company_info").maybeSingle();
    if (settingsData?.value) companyInfo = settingsData.value as any;

    const proAnalysis = proData?.analysis || null;
    let proAnalysisPayload = null;
    if (proAnalysis) {
      proAnalysisPayload = {
        customer_profile: proAnalysis.customer_profile,
        feature_mapping: proAnalysis.feature_mapping,
        cost_scenarios: proAnalysis.cost_scenarios,
        risk_flags: proAnalysis.risk_flags,
        strategic_score: proAnalysis.strategic_score,
        recommended_plan: proAnalysis.recommended_plan,
        meeting_agenda: proAnalysis.meeting_agenda,
      };
    }

    const { data, error } = await supabase.functions.invoke("generate-proposal", {
      body: {
        inquiry,
        ai_basic_analysis: basicData?.analysis_v2 || basicData?.analysis || inquiry.ai_analysis_v2 || inquiry.ai_analysis || null,
        pro_analysis: proAnalysisPayload,
        company_info: companyInfo,
      },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);

    updateStep("proposal", { status: "done" });
    return data;
  }, [inquiry, updateStep]);

  const runPipeline = useCallback(async (startFrom: StepKey = "basic") => {
    setRunning(true);
    abortRef.current = false;

    const stepOrder: StepKey[] = ["basic", "pro", "proposal"];
    const startIdx = stepOrder.indexOf(startFrom);
    let basicData: any = null;
    let proData: any = null;

    // Reset steps from startFrom onwards
    for (let i = startIdx; i < stepOrder.length; i++) {
      updateStep(stepOrder[i], { status: "idle", error: undefined });
    }

    try {
      for (let i = startIdx; i < stepOrder.length; i++) {
        if (abortRef.current) break;

        const step = stepOrder[i];

        if (i > startIdx) {
          await wait(STEP_DELAY_MS);
        }

        if (step === "basic") {
          basicData = await runBasic();
          onStepDone?.("basic");
        } else if (step === "pro") {
          proData = await runPro(basicData);
          onStepDone?.("pro");
        } else if (step === "proposal") {
          await runProposal(basicData, proData);
          onStepDone?.("proposal");
        }
      }
      onComplete?.();
    } catch (e: any) {
      const currentStep = stepOrder.find(s => steps[s]?.status === "running") ||
        stepOrder[startIdx];
      // Find which step was running
      for (const s of stepOrder) {
        setSteps(prev => {
          if (prev[s].status === "running") {
            return { ...prev, [s]: { status: "error", error: e.message || "오류 발생" } };
          }
          return prev;
        });
      }
    } finally {
      setRunning(false);
    }
  }, [runBasic, runPro, runProposal, updateStep, onComplete, onStepDone, steps]);

  const hasAnyResult = inquiry.ai_analysis || inquiry.ai_analysis_v2;

  // Determine which step to start from for "resume"
  const getResumeStep = (): StepKey | null => {
    const order: StepKey[] = ["basic", "pro", "proposal"];
    for (const s of order) {
      if (steps[s].status === "error") return s;
    }
    return null;
  };

  if (!enabled) {
    return (
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-primary" />
            <div>
              <p className="text-[12px] font-semibold text-foreground">연속 분석 실행</p>
              <p className="text-[10px] text-muted-foreground">1차 → 2차 → 제안서를 자동으로 연속 실행합니다</p>
            </div>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
      </div>
    );
  }

  const resumeStep = getResumeStep();

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="rounded-xl border border-primary/20 bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-primary" />
            <p className="text-[12px] font-bold text-foreground">연속 분석</p>
          </div>
          <div className="flex items-center gap-2">
            {!running && (
              <Switch checked={enabled} onCheckedChange={(v) => { setEnabled(v); if (!v) { setSteps({ basic: { status: "idle" }, pro: { status: "idle" }, proposal: { status: "idle" } }); } }} />
            )}
            {!running && steps.basic.status === "idle" && (
              <button
                onClick={() => runPipeline("basic")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity active:scale-[0.97]"
              >
                <Play className="w-3 h-3" /> 시작
              </button>
            )}
            {!running && resumeStep && (
              <button
                onClick={() => runPipeline(resumeStep)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 dark:text-amber-300 dark:bg-amber-900/30 transition-colors active:scale-[0.97]"
              >
                <RefreshCw className="w-3 h-3" /> 여기서부터 재실행
              </button>
            )}
          </div>
        </div>

        {/* Steps */}
        <div className="px-4 py-3 space-y-2.5">
          {STEPS.map((step, i) => {
            const s = steps[step.key];
            return (
              <div key={step.key} className="flex items-center gap-3">
                {/* Icon */}
                <div className="shrink-0">
                  {s.status === "done" ? (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  ) : s.status === "running" ? (
                    <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                      <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                    </div>
                  ) : s.status === "error" ? (
                    <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                      <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-border" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-semibold ${s.status === "done" ? "text-green-600 dark:text-green-400" : s.status === "running" ? "text-primary" : s.status === "error" ? "text-destructive" : "text-muted-foreground"}`}>
                    {step.label}
                    {s.status === "running" && <span className="text-[10px] font-normal ml-1.5">진행중...</span>}
                  </p>
                  {s.status === "error" && s.error && (
                    <p className="text-[10px] text-destructive mt-0.5 truncate">{s.error}</p>
                  )}
                  {s.status === "idle" && (
                    <p className="text-[10px] text-muted-foreground">{step.desc}</p>
                  )}
                </div>

                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden" />
                )}
              </div>
            );
          })}
        </div>

        {/* All done */}
        {steps.basic.status === "done" && steps.pro.status === "done" && steps.proposal.status === "done" && (
          <div className="px-4 py-2.5 border-t border-border bg-green-50 dark:bg-green-900/10">
            <p className="text-[11px] font-semibold text-green-700 dark:text-green-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> 전체 분석 완료 — 페이지를 새로고침하면 결과를 확인할 수 있습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
