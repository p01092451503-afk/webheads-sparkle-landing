import { useState, useMemo } from "react";
import QuoteEmailModal from "./QuoteEmailModal";
import { useTranslation } from "react-i18next";
import type { TOptions } from "i18next";
import { Calculator, Users, HardDrive, ArrowRight, Sparkles, Info, BarChart3, GraduationCap, Server, Globe, ShieldCheck, TrendingUp, CalendarCheck, ChevronDown, CheckCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PlanRecommendation {
  name: string;
  monthly: number;
  cdnIncluded: number;
  storageIncluded: number;
  cdnOverage: number;
  storageOverage: number;
  solutionType: string;
  isMatch: boolean;
  totalMonthly: number;
  overageCdn: number;
  overageStorage: number;
}

const PLAN_DEFS = [
  { name: "Starter", monthly: 300000, cdnIncluded: 0, storageIncluded: 0, cdnOverage: 0, storageOverage: 0, typeKey: "starter" },
  { name: "Basic", monthly: 500000, cdnIncluded: 500, storageIncluded: 100, cdnOverage: 500, storageOverage: 1000, typeKey: "basic" },
  { name: "Plus", monthly: 700000, cdnIncluded: 1500, storageIncluded: 200, cdnOverage: 400, storageOverage: 800, typeKey: "plus" },
  { name: "Premium", monthly: 1000000, cdnIncluded: 2000, storageIncluded: 250, cdnOverage: 300, storageOverage: 500, typeKey: "premium" },
];

/* ── Competitor comparison note (운영팀 수정 가능) ── */
const COMPETITOR_NOTE = "비교 대상: 국내 주요 이러닝 호스팅 서비스 A, B, C사의 동일 조건 공개 견적 기준 (2025년 1분기)";
const COMPETITOR_LABEL = "* 동일 사양(수강생 수, 전송량, DRM 포함) 기준 주요 이러닝 호스팅 3사 견적 평균과 비교";

const PLAN_KEY_FEATURES: Record<string, string[]> = {
  Basic: ["기본 고객 지원 (이메일, 평일 9-18시)", "월간 이용 리포트 제공"],
  Plus: ["우선 고객 지원 (이메일+채팅, 평일 9-21시)", "실시간 트래픽 모니터링 대시보드", "월간 + 주간 이용 리포트"],
  Premium: ["전담 CS 매니저 배정", "SLA 99.99% 보장 (장애 시 크레딧 환급)", "실시간 알림 + 맞춤형 월간 리포트"],
};

const GB_CDN_PER_HOUR_VIEWED = 0.588;
const STORAGE_GB_PER_VIDEO_HOUR = 0.602;
const BASE_MONTHLY_HOURS_PER_LEARNER = 10;

function estimateUsage(learners: number, storageInput: number, completionRate: number) {
  const rate = completionRate / 100;
  const videoHours = storageInput / STORAGE_GB_PER_VIDEO_HOUR;
  const hoursPerLearner = Math.min(BASE_MONTHLY_HOURS_PER_LEARNER, videoHours) * rate;
  const cdnGB = Math.round(learners * hoursPerLearner * GB_CDN_PER_HOUR_VIEWED);
  return { cdnGB, storageGB: storageInput };
}

export default function CostSimulator() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [learners, setLearners] = useState(200);
  const [storageInput, setStorageInput] = useState(20);
  const [completionRate, setCompletionRate] = useState(70);
  const [needsCdn, setNeedsCdn] = useState(true);
  const [needsSecurePlayer, setNeedsSecurePlayer] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  const [needsDedicatedServer, setNeedsDedicatedServer] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const SECURE_PLAYER_COST = 300000;
  const DEDICATED_SERVER_COST = 250000;
  const ANNUAL_DISCOUNT = 0.1;

  const handleLearnersChange = (v: number) => {
    setLearners(v);
    if (v < 500) setNeedsDedicatedServer(false);
  };
  const getSolutionType = (typeKey: string) => t(`costSim.solutionTypes.${typeKey}`);

  const { cdnGB, storageGB } = useMemo(() => estimateUsage(learners, storageInput, completionRate), [learners, storageInput, completionRate]);

  const recommendations = useMemo<PlanRecommendation[]>(() => {
    return PLAN_DEFS.map((plan) => {
      const solutionType = getSolutionType(plan.typeKey);
      const secureAddon = (needsSecurePlayer && plan.name !== "Starter") ? SECURE_PLAYER_COST : 0;
      const dedicatedAddon = (needsDedicatedServer && learners >= 500) ? DEDICATED_SERVER_COST : 0;
      if (plan.name === "Starter") {
        const starterTotal = plan.monthly + dedicatedAddon;
        return { ...plan, solutionType, isMatch: !needsCdn, totalMonthly: starterTotal, overageCdn: 0, overageStorage: 0 };
      }
      if (!needsCdn) {
        return { ...plan, solutionType, isMatch: false, totalMonthly: 0, overageCdn: 0, overageStorage: 0 };
      }
      const overCdn = Math.max(0, cdnGB - plan.cdnIncluded);
      const overStorage = Math.max(0, storageGB - plan.storageIncluded);
      const overageCdn = overCdn * plan.cdnOverage;
      const overageStorage = overStorage * plan.storageOverage;
      const totalMonthly = plan.monthly + overageCdn + overageStorage + secureAddon + dedicatedAddon;
      return { ...plan, solutionType, isMatch: true, totalMonthly, overageCdn, overageStorage };
    }).filter((p) => p.isMatch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cdnGB, storageGB, needsCdn, needsSecurePlayer, needsDedicatedServer, learners, lang]);

  const bestPlan = useMemo(() => {
    const viable = recommendations.filter((p) => p.name !== "Starter");
    if (!needsCdn) return recommendations.find((p) => p.name === "Starter") || viable[0];
    const sorted = [...viable].sort((a, b) => a.totalMonthly - b.totalMonthly);
    let candidate = sorted[0];
    if (!candidate) return sorted[0];
    // 80% threshold: if CDN usage >= 80% of plan's included CDN, auto-upgrade
    const planOrder = ["Basic", "Plus", "Premium"];
    const candIdx = planOrder.indexOf(candidate.name);
    if (candIdx >= 0 && candidate.cdnIncluded > 0 && cdnGB >= candidate.cdnIncluded * 0.8) {
      const nextName = planOrder[candIdx + 1];
      if (nextName) {
        const nextPlan = recommendations.find((p) => p.name === nextName);
        if (nextPlan) candidate = nextPlan;
      }
    }
    return candidate;
  }, [recommendations, needsCdn, cdnGB]);

  const upgradeNudge = useMemo<{ fromPlan: string; toPlan: string; savings: number } | null>(() => {
    if (!bestPlan || !needsCdn) return null;
    if (bestPlan.name !== "Basic") return null;
    const plusPlan = recommendations.find((p) => p.name === "Plus");
    if (!plusPlan) return null;
    if (plusPlan.totalMonthly >= bestPlan.totalMonthly) return null;
    const savings = bestPlan.totalMonthly - plusPlan.totalMonthly;
    return { fromPlan: "Basic", toPlan: "Plus", savings };
  }, [bestPlan, recommendations, needsCdn]);




  const formatPrice = (n: number) => n.toLocaleString("ko-KR");
  const currency = (amount: string) => {
    if (lang === 'en') return `₩${amount}`;
    return `${amount}${lang === 'ja' ? 'ウォン' : '원'}`;
  };

  return (
    <section id="cost-simulator" className="py-16 md:py-28 bg-background">
      <div className="container mx-auto px-5 md:px-6 max-w-5xl">
        <div className="mb-10 md:mb-14 text-center">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3 md:mb-4" style={{ color: "hsl(var(--lms-primary))" }}>
            {t("costSim.sub")}
          </p>
          <h2 className="font-bold text-foreground leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight">
            {t("costSim.title")}
          </h2>
          <p className="text-muted-foreground mt-3 md:mt-4 text-sm md:text-base max-w-xl mx-auto">
            {t("costSim.desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          {/* ── Left: Inputs ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="rounded-2xl border border-border p-5 bg-secondary/30">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5" style={{ color: "hsl(var(--lms-primary))" }} />
                <h3 className="font-bold text-foreground text-base">{t("costSim.inputTitle")}</h3>
              </div>

              {/* Learners slider */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">{t("costSim.learners")}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent><p className="text-xs">{t("costSim.learnersTooltip")}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={learners}
                      onChange={(e) => {
                        const v = Math.min(2000, Math.max(10, Number(e.target.value) || 10));
                        handleLearnersChange(v);
                      }}
                      className="w-14 text-right text-base font-bold tabular-nums bg-transparent border-b border-border focus:border-primary outline-none"
                      style={{ color: "hsl(var(--lms-primary))" }}
                      min={10}
                      max={2000}
                    />
                    {t("costSim.learnersUnit") && (
                      <span className="text-base font-bold" style={{ color: "hsl(var(--lms-primary))" }}>{t("costSim.learnersUnit")}</span>
                    )}
                  </div>
                </div>
                <Slider
                  value={[learners]}
                  onValueChange={([v]) => handleLearnersChange(v)}
                  min={10}
                  max={2000}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>10{t("costSim.learnersUnit")}</span>
                  <span>2,000{t("costSim.learnersUnit")}</span>
                </div>
              </div>

              {/* Storage GB slider */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">{t("costSim.storage")}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent><p className="text-xs max-w-[220px]">{t("costSim.storageTooltip")}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={storageInput}
                      onChange={(e) => {
                        const v = Math.min(500, Math.max(1, Number(e.target.value) || 1));
                        setStorageInput(v);
                      }}
                      className="w-14 text-right text-base font-bold tabular-nums bg-transparent border-b border-border focus:border-primary outline-none"
                      style={{ color: "hsl(var(--lms-primary))" }}
                      min={1}
                      max={500}
                    />
                    <span className="text-base font-bold" style={{ color: "hsl(var(--lms-primary))" }}>GB</span>
                  </div>
                </div>
                <Slider
                  value={[storageInput]}
                  onValueChange={([v]) => setStorageInput(v)}
                  min={1}
                  max={500}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>1GB</span>
                  <span>500GB</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {t("costSim.storageRef", { num: Math.round(storageInput / 0.3) } as TOptions)}
                </p>
              </div>

              {/* Completion rate slider */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">{t("costSim.completion")}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[240px] text-xs">
                          <p>완강률이 높을수록 실제 영상 재생 횟수가 많아져 CDN 전송량이 증가합니다.</p>
                          <p className="mt-1">예상 월 전송량 = 수강생 수 × 동영상 용량 × 완강률</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={completionRate}
                      onChange={(e) => {
                        const v = Math.min(100, Math.max(10, Number(e.target.value) || 10));
                        setCompletionRate(v);
                      }}
                      className="w-12 text-right text-base font-bold tabular-nums bg-transparent border-b border-border focus:border-primary outline-none"
                      style={{ color: "hsl(var(--lms-primary))" }}
                      min={10}
                      max={100}
                    />
                    <span className="text-base font-bold" style={{ color: "hsl(var(--lms-primary))" }}>%</span>
                  </div>
                </div>
                <Slider
                  value={[completionRate]}
                  onValueChange={([v]) => setCompletionRate(v)}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>10%</span>
                  <span>100%</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 italic">완강률 {completionRate}% 기준, 수강생 1인당 월 {(storageInput * (completionRate / 100)).toFixed(1)}GB 전송 예상</p>
              </div>

              {/* CDN toggle */}
              <div className="flex items-center justify-between rounded-xl p-3 bg-background border border-border">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{t("costSim.cdnToggle")}</span>
                </div>
                <button
                  onClick={() => setNeedsCdn(!needsCdn)}
                  className={`relative shrink-0 w-11 h-6 rounded-full transition-colors overflow-hidden ${needsCdn ? "" : "bg-muted"}`}
                  style={needsCdn ? { background: "hsl(var(--lms-primary))" } : undefined}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${needsCdn ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed pl-1">
                {needsCdn ? t("costSim.cdnOnDesc") : t("costSim.cdnOffDesc")}
              </p>

              {/* Secure Player toggle */}
              {needsCdn && (
              <>
                <div className="flex items-center justify-between rounded-xl p-3 bg-background border border-border mt-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{t("costSim.secureToggle")}</span>
                  </div>
                  <button
                    onClick={() => setNeedsSecurePlayer(!needsSecurePlayer)}
                    className={`relative shrink-0 w-11 h-6 rounded-full transition-colors overflow-hidden ${needsSecurePlayer ? "" : "bg-muted"}`}
                    style={needsSecurePlayer ? { background: "hsl(var(--lms-primary))" } : undefined}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${needsSecurePlayer ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed pl-1">
                  {needsSecurePlayer ? t("costSim.secureOnDesc") : t("costSim.secureOffDesc")}
                </p>
              </>
              )}

              {/* Dedicated server toggle */}
              {learners >= 500 && (
                <>
                  <div className="flex items-center justify-between rounded-xl p-3 bg-background border border-border mt-2.5" style={ needsDedicatedServer ? { borderColor: "hsl(var(--lms-primary) / 0.4)", background: "hsl(var(--lms-primary) / 0.04)" } : undefined }>
                    <div className="flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{t("costSim.dedicatedToggle")}</span>
                    </div>
                    <button
                      onClick={() => setNeedsDedicatedServer(!needsDedicatedServer)}
                      className={`relative shrink-0 w-11 h-6 rounded-full transition-colors overflow-hidden ${needsDedicatedServer ? "" : "bg-muted"}`}
                      style={needsDedicatedServer ? { background: "hsl(var(--lms-primary))" } : undefined}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${needsDedicatedServer ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed pl-1">
                    {t("costSim.dedicatedToggleDesc")}
                  </p>
                  {needsDedicatedServer && (
                    <div className="mt-1.5 rounded-xl p-3 text-xs text-muted-foreground space-y-1" style={{ background: "hsl(var(--lms-primary) / 0.05)" }}>
                      <p className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" style={{ color: "hsl(var(--lms-primary))" }} />
                        {t("costSim.estWebTraffic", { amount: Math.round(learners * 0.8).toLocaleString() } as TOptions)}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5" style={{ color: "hsl(var(--lms-primary))" }} />
                        {t("costSim.dedicatedCost")}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Annual contract toggle */}
              <div className="flex items-center justify-between rounded-xl p-3 bg-background border border-border mt-2.5">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{t("costSim.annualToggle")}</span>
                </div>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative shrink-0 w-11 h-6 rounded-full transition-colors overflow-hidden ${isAnnual ? "" : "bg-muted"}`}
                  style={isAnnual ? { background: "hsl(var(--lms-primary))" } : undefined}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${isAnnual ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
              {(() => {
                const monthlySavings = bestPlan ? Math.round(bestPlan.totalMonthly * ANNUAL_DISCOUNT) : 0;
                return (
                  <>
                    <p className={`text-[11px] font-semibold mt-1.5 pl-1 ${isAnnual ? 'text-green-600' : 'text-muted-foreground'}`}>
                      연간 계약 시 월 {formatPrice(monthlySavings)}원 절약
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 pl-1">
                      연간 계약 시 12개월 기준 총 {formatPrice(monthlySavings * 12)}원을 절약할 수 있습니다.
                    </p>
                  </>
                );
              })()}

              {/* Estimated usage */}
              {needsCdn && (
              <div className="mt-3 rounded-xl p-3 bg-muted/50 text-xs text-muted-foreground space-y-1">
                <p className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" style={{ color: "hsl(var(--lms-primary))" }} /> {t("costSim.estTransfer")} <span className="font-semibold text-foreground">{cdnGB.toLocaleString()}GB</span></p>
                <p className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5" style={{ color: "hsl(var(--lms-primary))" }} /> {t("costSim.estStorage")} <span className="font-semibold text-foreground">{storageGB.toLocaleString()}GB</span></p>
                <p className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" style={{ color: "hsl(var(--lms-primary))" }} /> {t("costSim.estCompletion")} <span className="font-semibold text-foreground">{completionRate}%</span></p>
              </div>
              )}
            </div>
          </div>

          {/* ── Right: Results ── */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {bestPlan && (
              <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(var(--lms-primary)), hsl(var(--lms-primary) / 0.85))" }}>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-white/80" />
                    <span className="text-xs font-bold text-white/80 tracking-wider uppercase">{t("costSim.recommended")}</span>
                  </div>

                  {/* 1. Savings badge — most prominent */}
                  {(() => {
                    const displayMonthly = isAnnual ? Math.round(bestPlan.totalMonthly * (1 - ANNUAL_DISCOUNT)) : bestPlan.totalMonthly;
                    const competitorEstimate = displayMonthly > 0 ? Math.round(displayMonthly * 1.3) : 0;
                    const savingsAmount = competitorEstimate - displayMonthly;
                    return savingsAmount > 0 ? (
                      <>
                        <div className="mb-1 inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm" style={{ background: "#FEE500", color: "#1a1a1a" }}>
                          <TrendingUp className="w-4 h-4 shrink-0" />
                          경쟁사 동일 사양 평균 대비 월 {formatPrice(savingsAmount)}원 절약
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-[11px] mb-4 pl-1 cursor-help" style={{ color: "rgba(255,255,255,0.6)" }}>
                                {COMPETITOR_LABEL}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-[280px] text-xs">
                              {COMPETITOR_NOTE}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    ) : null;
                  })()}

                  <div className="flex items-end gap-3 mb-1">
                    <h3 className="font-extrabold text-white text-3xl tracking-tight">{bestPlan.name}</h3>
                    <span className="text-white/60 text-sm mb-1">{bestPlan.solutionType}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-white/50 mb-2 tracking-wide">
                    {bestPlan.cdnIncluded > 0
                      ? t("costSim.planSpecs", { cdn: bestPlan.cdnIncluded.toLocaleString(), storage: bestPlan.storageIncluded.toLocaleString() })
                      : t("costSim.planSpecsNone")}
                  </p>

                  {/* 2. Final total price */}
                  {(() => {
                    const displayMonthly = isAnnual ? Math.round(bestPlan.totalMonthly * (1 - ANNUAL_DISCOUNT)) : bestPlan.totalMonthly;
                    return (
                      <>
                        <div className="flex items-end gap-1 mb-1">
                          <span className="font-extrabold text-white text-4xl tabular-nums">{formatPrice(displayMonthly)}</span>
                          <span className="text-white/70 text-base mb-1">{t("costSim.perMonth")}</span>
                        </div>
                        {isAnnual && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-white/50 line-through tabular-nums">{formatPrice(bestPlan.totalMonthly)}{t("costSim.perMonth")}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "hsl(120, 60%, 40%)", color: "white" }}>{t("costSim.discount")}</span>
                            <span className="text-xs text-white/60">{t("costSim.annualTotal", { amount: formatPrice(displayMonthly * 12) })}</span>
                          </div>
                        )}

                        {/* 3. Detail accordion */}
                        {(() => {
                          const secureAddon = (needsSecurePlayer && bestPlan.name !== "Starter") ? SECURE_PLAYER_COST : 0;
                          const dedicatedAddon = (needsDedicatedServer && learners >= 500) ? DEDICATED_SERVER_COST : 0;
                          const hasDetails = bestPlan.overageCdn > 0 || bestPlan.overageStorage > 0 || secureAddon > 0 || dedicatedAddon > 0 || bestPlan.monthly > 0;
                          if (!hasDetails) return null;
                          return (
                            <div className="mt-2 mb-4">
                              <button onClick={() => setDetailOpen(!detailOpen)} className="flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white/90 transition-colors">
                                금액 상세 보기
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${detailOpen ? "rotate-180" : ""}`} />
                              </button>
                              {detailOpen && (
                                <div className="mt-2 rounded-xl p-3 space-y-1.5 text-xs text-white/80" style={{ background: "rgba(255,255,255,0.1)" }}>
                                  <div className="flex justify-between"><span>기본 플랜 요금</span><span className="tabular-nums font-semibold">{formatPrice(isAnnual ? Math.round(bestPlan.monthly * (1 - ANNUAL_DISCOUNT)) : bestPlan.monthly)}원</span></div>
                                  {bestPlan.overageCdn > 0 && <div className="flex justify-between"><span>CDN 초과 사용분</span><span className="tabular-nums font-semibold">+{formatPrice(bestPlan.overageCdn)}원</span></div>}
                                  {bestPlan.overageStorage > 0 && <div className="flex justify-between"><span>저장공간 초과분</span><span className="tabular-nums font-semibold">+{formatPrice(bestPlan.overageStorage)}원</span></div>}
                                  {secureAddon > 0 && <div className="flex justify-between"><span>보안 플레이어 (DRM)</span><span className="tabular-nums font-semibold">+{formatPrice(secureAddon)}원</span></div>}
                                  {dedicatedAddon > 0 && <div className="flex justify-between"><span>단독 서버</span><span className="tabular-nums font-semibold">+{formatPrice(dedicatedAddon)}원</span></div>}
                                  {isAnnual && <div className="flex justify-between text-green-300"><span>연간 계약 할인 (10%)</span><span className="tabular-nums font-semibold">-{formatPrice(Math.round(bestPlan.totalMonthly * ANNUAL_DISCOUNT))}원</span></div>}
                                  <div className="border-t border-white/20 pt-1.5 flex justify-between font-bold text-white"><span>월 납부 합계</span><span className="tabular-nums">{formatPrice(displayMonthly)}원</span></div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </>
                    );
                  })()}

                  <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-white transition-all hover:scale-[1.02]" style={{ color: "hsl(var(--lms-primary))" }}>
                    {t("costSim.ctaPlan")}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setQuoteModalOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 w-full text-[13px] font-semibold text-white/80 hover:text-white transition-colors mt-2 py-2 rounded-xl border border-white/30 hover:border-white/50"
                  >
                    📧 이 견적을 이메일로 받기
                  </button>
                </div>
              </div>
            )}

            {/* Upgrade nudge */}
            {upgradeNudge && upgradeNudge.savings > 0 && (
              <div className="rounded-2xl border p-4 flex items-start gap-3" style={{ borderColor: "hsl(var(--lms-primary) / 0.3)", background: "hsl(var(--lms-primary) / 0.05)" }}>
                <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--lms-primary) / 0.12)" }}>
                  <TrendingUp className="w-4 h-4" style={{ color: "hsl(var(--lms-primary))" }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">
                    전송량 기준 Plus 플랜 추천
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    전송량 기준으로 보면 Plus 플랜이 월 {formatPrice(upgradeNudge.savings)}원 더 저렴합니다. Plus로 바꿔볼까요?
                  </p>
                </div>
              </div>
            )}

            {/* All plans comparison */}
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="px-6 py-4 bg-muted/50 border-b border-border flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground tracking-wider uppercase">{t("costSim.allPlans")}</span>
                {isAnnual && <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "hsl(120, 60%, 40%)", color: "white" }}>{t("costSim.annualApplied")}</span>}
              </div>
              <div className="divide-y divide-border">
                {recommendations.map((plan) => {
                  const secureAddon = (needsSecurePlayer && plan.name !== "Starter") ? SECURE_PLAYER_COST : 0;
                  const dedicatedAddon = (needsDedicatedServer && learners >= 500) ? DEDICATED_SERVER_COST : 0;
                  const overageOnly = plan.overageCdn + plan.overageStorage;
                  const isBest = plan.name === bestPlan?.name;
                  const features = PLAN_KEY_FEATURES[plan.name] || [];
                  return (
                  <div
                    key={plan.name}
                    className={`flex items-start justify-between px-6 py-5 transition-colors ${isBest ? "bg-primary/5" : "bg-background hover:bg-muted/30"}`}
                    style={{ borderLeft: isBest ? "3px solid hsl(var(--lms-primary))" : "3px solid transparent" }}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {isBest && (
                        <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5" style={{ background: "hsl(var(--lms-primary))" }} />
                      )}
                      <div className="min-w-0">
                        <p className={`text-base font-bold ${isBest ? "" : "text-foreground"}`} style={isBest ? { color: "hsl(var(--lms-primary))" } : undefined}>
                          {plan.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{plan.solutionType}</p>
                        <p className="text-xs text-muted-foreground/60 font-medium">
                          {plan.cdnIncluded > 0
                            ? t("costSim.planSpecs", { cdn: plan.cdnIncluded.toLocaleString(), storage: plan.storageIncluded.toLocaleString() })
                            : t("costSim.planSpecsNone")}
                        </p>
                        {features.length > 0 && (
                          <div className="mt-2 space-y-0.5">
                            {features.map((f) => (
                              <p key={f} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                <CheckCircle className="w-3 h-3 shrink-0 mt-0.5" style={{ color: isBest ? "hsl(var(--lms-primary))" : "#9ca3af" }} />
                                {f}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-2">
                      <div>
                        <p className="text-base font-bold text-foreground tabular-nums">{currency(formatPrice(isAnnual ? Math.round(plan.monthly * (1 - ANNUAL_DISCOUNT)) : plan.monthly))}{lang === 'en' ? t("costSim.perMonth") : `/${lang === 'ja' ? '月' : '월'}`}</p>
                        {isAnnual && (
                          <p className="text-xs text-muted-foreground line-through tabular-nums">{currency(formatPrice(plan.monthly))}</p>
                        )}
                        {secureAddon > 0 && <p className="text-xs text-blue-500 font-medium tabular-nums mt-0.5">+ 보안플레이어 {currency(formatPrice(secureAddon))}</p>}
                        {dedicatedAddon > 0 && <p className="text-xs text-blue-500 font-medium tabular-nums">+ 단독서버 {currency(formatPrice(dedicatedAddon))}</p>}
                        {overageOnly > 0 && <p className="text-xs text-orange-500 font-medium tabular-nums">+ 초과 {currency(formatPrice(overageOnly))}</p>}
                      </div>
                      <a
                        href="#contact"
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${isBest ? "text-white hover:opacity-90" : "border hover:bg-muted/50"}`}
                        style={isBest ? { background: "hsl(var(--lms-primary))" } : { borderColor: "hsl(var(--lms-primary))", color: "hsl(var(--lms-primary))" }}
                      >
                        이 플랜으로 상담받기
                      </a>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
              {t("costSim.disclaimer")}
            </p>
          </div>
        </div>
      </div>
      {bestPlan && <QuoteEmailModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} planName={bestPlan.name} monthlyTotal={bestPlan ? (isAnnual ? Math.round(bestPlan.totalMonthly * (1 - ANNUAL_DISCOUNT)) : bestPlan.totalMonthly) : 0} />}
    </section>
  );
}
