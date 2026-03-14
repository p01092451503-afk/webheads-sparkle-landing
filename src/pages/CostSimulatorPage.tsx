import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import HeroPatternBg from "@/components/visuals/HeroPatternBg";
import HeroPromoBanner from "@/components/shared/HeroPromoBanner";
import LmsHeroOverlay from "@/components/visuals/LmsHeroOverlay";
import LazySection from "@/components/shared/LazySection";
import {
  Calculator, Users, HardDrive, ArrowRight, Sparkles, Info, BarChart3,
  GraduationCap, Server, ShieldCheck, TrendingUp, CalendarCheck,
  CheckCircle, Shield, Clock, Headphones, MessageCircle, FileText,
  Zap, Award, Building2, Star, ChevronDown
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import SEO, { BASE_URL } from "@/components/SEO";

/* ── Competitor comparison note (운영팀 수정 가능) ── */
const COMPETITOR_NOTE = "비교 대상: 국내 주요 이러닝 호스팅 서비스 A, B, C사의 동일 조건 공개 견적 기준 (2025년 1분기)";
const COMPETITOR_LABEL = "* 동일 사양(수강생 수, 전송량, DRM 포함) 기준 주요 이러닝 호스팅 3사 견적 평균과 비교";

const PLAN_KEY_FEATURES: Record<string, string[]> = {
  Basic: ["기본 고객 지원 (이메일, 평일 9-18시)", "월간 이용 리포트 제공"],
  Plus: ["우선 고객 지원 (이메일+채팅, 평일 9-21시)", "실시간 트래픽 모니터링 대시보드", "월간 + 주간 이용 리포트"],
  Premium: ["전담 CS 매니저 배정", "SLA 99.99% 보장 (장애 시 크레딧 환급)", "실시간 알림 + 맞춤형 월간 리포트"],
};

/* ── Plan data ── */
interface PlanRecommendation {
  name: string; monthly: number; cdnIncluded: number; storageIncluded: number;
  cdnOverage: number; storageOverage: number; solutionType: string;
  isMatch: boolean; totalMonthly: number; overageCdn: number; overageStorage: number;
}

const PLAN_DEFS = [
  { name: "Starter", monthly: 300000, cdnIncluded: 0, storageIncluded: 0, cdnOverage: 0, storageOverage: 0, typeKey: "starter" },
  { name: "Basic", monthly: 500000, cdnIncluded: 500, storageIncluded: 100, cdnOverage: 500, storageOverage: 1000, typeKey: "basic" },
  { name: "Plus", monthly: 700000, cdnIncluded: 1500, storageIncluded: 200, cdnOverage: 400, storageOverage: 800, typeKey: "plus" },
  { name: "Premium", monthly: 1000000, cdnIncluded: 2000, storageIncluded: 250, cdnOverage: 300, storageOverage: 500, typeKey: "premium" },
];

const GB_CDN_PER_HOUR_VIEWED = 0.588;
const STORAGE_GB_PER_VIDEO_HOUR = 0.602;
const BASE_MONTHLY_HOURS_PER_LEARNER = 10;
const SECURE_PLAYER_COST = 300000;
const DEDICATED_SERVER_COST = 250000;
const ANNUAL_DISCOUNT = 0.1;

function estimateUsage(learners: number, storageInput: number, completionRate: number) {
  const rate = completionRate / 100;
  const videoHours = storageInput / STORAGE_GB_PER_VIDEO_HOUR;
  const hoursPerLearner = Math.min(BASE_MONTHLY_HOURS_PER_LEARNER, videoHours) * rate;
  const cdnGB = Math.round(learners * hoursPerLearner * GB_CDN_PER_HOUR_VIEWED);
  return { cdnGB, storageGB: storageInput };
}

/* ── Animated counter ── */
function AnimatedPrice({ value, duration = 600 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    prevRef.current = value;
    if (from === to) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);
  return <>{display.toLocaleString("ko-KR")}</>;
}

export default function CostSimulatorPage() {
  const { t } = useTranslation();
  const [learners, setLearners] = useState(200);
  const [storageInput, setStorageInput] = useState(20);
  const [completionRate, setCompletionRate] = useState(70);
  const [needsCdn, setNeedsCdn] = useState(true);
  const [needsSecurePlayer, setNeedsSecurePlayer] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  const [needsDedicatedServer, setNeedsDedicatedServer] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  
  const [formData, setFormData] = useState({ company: "", contact: "", email: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { toast: showToast } = useToast();

  const handleLearnersChange = (v: number) => { setLearners(v); if (v < 500) setNeedsDedicatedServer(false); };

  const { cdnGB, storageGB } = useMemo(() => estimateUsage(learners, storageInput, completionRate), [learners, storageInput, completionRate]);

  const solutionTypes = t("lms.solutionTypes", { returnObjects: true }) as Record<string, string>;

  const recommendations = useMemo<PlanRecommendation[]>(() =>
    PLAN_DEFS.map((plan) => {
      const solutionType = solutionTypes[plan.typeKey] || plan.typeKey;
      const secureAddon = (needsSecurePlayer && plan.name !== "Starter") ? SECURE_PLAYER_COST : 0;
      const dedicatedAddon = (needsDedicatedServer && learners >= 500) ? DEDICATED_SERVER_COST : 0;
      if (plan.name === "Starter") return { ...plan, solutionType, isMatch: !needsCdn, totalMonthly: plan.monthly + dedicatedAddon, overageCdn: 0, overageStorage: 0 };
      if (!needsCdn) return { ...plan, solutionType, isMatch: false, totalMonthly: 0, overageCdn: 0, overageStorage: 0 };
      const overCdn = Math.max(0, cdnGB - plan.cdnIncluded);
      const overStorage = Math.max(0, storageGB - plan.storageIncluded);
      const overageCdn = overCdn * plan.cdnOverage;
      const overageStorage = overStorage * plan.storageOverage;
      return { ...plan, solutionType, isMatch: true, totalMonthly: plan.monthly + overageCdn + overageStorage + secureAddon + dedicatedAddon, overageCdn, overageStorage };
    }).filter((p) => p.isMatch),
  [cdnGB, storageGB, needsCdn, needsSecurePlayer, needsDedicatedServer, learners, solutionTypes]);

  const bestPlan = useMemo(() => {
    const viable = recommendations.filter((p) => p.name !== "Starter");
    if (!needsCdn) return recommendations.find((p) => p.name === "Starter") || viable[0];
    // Sort by total cost
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
    // Only show nudge when bestPlan is Basic and Plus is cheaper
    if (bestPlan.name !== "Basic") return null;
    const plusPlan = recommendations.find((p) => p.name === "Plus");
    if (!plusPlan) return null;
    if (plusPlan.totalMonthly >= bestPlan.totalMonthly) return null;
    const savings = bestPlan.totalMonthly - plusPlan.totalMonthly;
    return { fromPlan: "Basic", toPlan: "Plus", savings };
  }, [bestPlan, recommendations, needsCdn]);

  const formatPrice = (n: number) => n.toLocaleString("ko-KR");
  const displayMonthly = bestPlan ? (isAnnual ? Math.round(bestPlan.totalMonthly * (1 - ANNUAL_DISCOUNT)) : bestPlan.totalMonthly) : 0;

  const cases = t("costSim.cases.items", { returnObjects: true }) as any[];
  const matchedCase = cases.find((c: any) => {
    if (learners < 200) return c.scale === cases[0]?.scale;
    if (learners < 500) return c.scale === cases[1]?.scale;
    return c.scale === cases[2]?.scale;
  });

  const competitorEstimate = displayMonthly > 0 ? Math.round(displayMonthly * 1.3) : 0;
  const savingsAmount = competitorEstimate - displayMonthly;

  const simulationData = useMemo(() => bestPlan ? {
    planName: bestPlan.name,
    solutionType: bestPlan.solutionType,
    monthlyPrice: displayMonthly,
    basePrice: bestPlan.monthly,
    cdnIncluded: bestPlan.cdnIncluded,
    storageIncluded: bestPlan.storageIncluded,
    overageCdn: bestPlan.overageCdn,
    overageStorage: bestPlan.overageStorage,
    learners, storageInput, completionRate,
    needsCdn, needsSecurePlayer, needsDedicatedServer, isAnnual,
    cdnGB, storageGB: storageInput,
    savingsAmount,
    companyName: formData.company || undefined,
  } : null, [bestPlan, displayMonthly, learners, storageInput, completionRate, needsCdn, needsSecurePlayer, needsDedicatedServer, isAnnual, cdnGB, savingsAmount, formData.company]);


  const featureItems = t("costSim.features.items", { returnObjects: true }) as any[];
  const comparisonItems = t("costSim.comparison.items", { returnObjects: true }) as any[];
  const guaranteeItems = t("costSim.guarantees.items", { returnObjects: true }) as any[];
  const heroStats = t("costSim.hero.stats", { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Pretendard Variable', 'Noto Sans KR', sans-serif" }}>
      <SEO
        title={t("costSim.seo.title")}
        description={t("costSim.seo.description")}
        keywords={t("costSim.seo.keywords")}
        path="/cost-simulator"
        breadcrumb={[{ name: t("costSim.seo.breadcrumb"), url: `${BASE_URL}/cost-simulator` }]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": t("costSim.seo.appName"),
          "applicationCategory": "BusinessApplication",
          "description": t("costSim.seo.appDesc"),
          "provider": { "@type": "Organization", "name": "WEBHEADS (웹헤즈)" },
          "url": `${BASE_URL}/cost-simulator`
        }}
      />

      {/* ═══ HERO ═══ */}
      <section className="relative flex items-center justify-center pt-28 pb-16 md:pt-44 md:pb-28 overflow-hidden">
        <HeroPatternBg theme="teal-cyan" />
        <LmsHeroOverlay />
        <div className="container mx-auto px-5 md:px-6 max-w-4xl relative z-10 text-center flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl lg:text-[4.2rem] font-extrabold leading-[1.15] mb-5 md:mb-7 tracking-tight text-white" style={{ wordBreak: "keep-all", textShadow: "0 4px 30px rgba(0,0,0,0.2)" }}>
            {t("costSim.hero.title1")}
            <br />
            <span className="bg-clip-text" style={{ opacity: 0.95 }}>
              {t("costSim.hero.title2")}
            </span>
          </h1>
          <p className="text-sm md:text-lg leading-[1.8] mb-8 md:mb-10 max-w-2xl" style={{ color: "rgba(255,255,255,0.8)" }}>
            {t("costSim.hero.desc1")}<br className="hidden sm:block" />
            {t("costSim.hero.desc2")}
          </p>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.5)" }} dangerouslySetInnerHTML={{ __html: t("costSim.hero.trustNote") }} />
          <div className="flex gap-3 md:gap-4 flex-wrap justify-center">
            <a href="#simulator" className="group px-7 py-3.5 rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.03] flex items-center gap-2" style={{ background: "#FF6B00", color: "white", boxShadow: "0 8px 30px rgba(255,107,0,0.3)" }}>
              {t("costSim.hero.cta1")}
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#lead-capture" className="px-7 py-3.5 rounded-xl font-bold text-base transition-colors border border-white/30 text-white hover:bg-white/10" style={{ backdropFilter: "blur(8px)" }}>
              {t("costSim.hero.cta2")}
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-14 mt-10 md:mt-14">
            {heroStats.map((label: string) => (
              <span key={label} className="text-base md:text-lg font-semibold text-white/60">{label}</span>
            ))}
          </div>
        </div>
      </section>

      <HeroPromoBanner />

      {/* ═══ SIMULATOR ═══ */}
      <section id="simulator" className="py-16 md:py-24" style={{ background: "#F8F9FD" }}>
        <div className="container mx-auto px-5 md:px-6 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "#5D45FF" }}>{t("costSim.sim.label")}</p>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight" style={{ wordBreak: "keep-all" }}>
              {t("costSim.sim.title")}
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
              {t("costSim.sim.desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
            {/* ── Left: Inputs ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="rounded-2xl border border-border p-5 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Calculator className="w-5 h-5" style={{ color: "#5D45FF" }} />
                  <h3 className="font-bold text-foreground text-base">{t("costSim.sim.scaleTitle")}</h3>
                </div>

                {/* Learners */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">{t("costSim.sim.learners")}</span>
                      <Tooltip><TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent><p className="text-xs">{t("costSim.sim.learnersTooltip")}</p></TooltipContent></Tooltip>
                    </div>
                    <div className="flex items-center gap-1">
                      <input type="number" value={learners} onChange={(e) => handleLearnersChange(Math.min(2000, Math.max(10, Number(e.target.value) || 10)))} className="w-14 text-right text-base font-bold tabular-nums bg-transparent border-b border-border focus:border-primary outline-none" style={{ color: "#5D45FF" }} min={10} max={2000} />
                      <span className="text-base font-bold" style={{ color: "#5D45FF" }}>{t("costSim.sim.learnersUnit")}</span>
                    </div>
                  </div>
                  <Slider value={[learners]} onValueChange={([v]) => handleLearnersChange(v)} min={10} max={2000} step={10} className="w-full" />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>10</span><span>2,000</span></div>
                </div>

                {/* Storage */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">{t("costSim.sim.storage")}</span>
                      <Tooltip><TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent><p className="text-xs max-w-[220px]">{t("costSim.sim.storageTooltip")}</p></TooltipContent></Tooltip>
                    </div>
                    <div className="flex items-center gap-1">
                      <input type="number" value={storageInput} onChange={(e) => setStorageInput(Math.min(500, Math.max(1, Number(e.target.value) || 1)))} className="w-14 text-right text-base font-bold tabular-nums bg-transparent border-b border-border focus:border-primary outline-none" style={{ color: "#5D45FF" }} min={1} max={500} />
                      <span className="text-base font-bold" style={{ color: "#5D45FF" }}>GB</span>
                    </div>
                  </div>
                  <Slider value={[storageInput]} onValueChange={([v]) => setStorageInput(v)} min={1} max={500} step={1} className="w-full" />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>1GB</span><span>500GB</span></div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t("costSim.sim.storageRef", { count: Math.round(storageInput / 0.3) })}</p>
                </div>

                {/* Completion */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">{t("costSim.sim.completion")}</span>
                      <Tooltip>
                        <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[240px] text-xs">
                          <p>완강률이 높을수록 실제 영상 재생 횟수가 많아져 CDN 전송량이 증가합니다.</p>
                          <p className="mt-1">예상 월 전송량 = 수강생 수 × 동영상 용량 × 완강률</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-1">
                      <input type="number" value={completionRate} onChange={(e) => setCompletionRate(Math.min(100, Math.max(10, Number(e.target.value) || 10)))} className="w-12 text-right text-base font-bold tabular-nums bg-transparent border-b border-border focus:border-primary outline-none" style={{ color: "#5D45FF" }} min={10} max={100} />
                      <span className="text-base font-bold" style={{ color: "#5D45FF" }}>%</span>
                    </div>
                  </div>
                  <Slider value={[completionRate]} onValueChange={([v]) => setCompletionRate(v)} min={10} max={100} step={5} className="w-full" />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>10%</span><span>100%</span></div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 italic">완강률 {completionRate}% 기준, 수강생 1인당 월 {(storageInput * (completionRate / 100)).toFixed(1)}GB 전송 예상</p>
                </div>

                {/* Toggles */}
                {renderToggle(t("costSim.sim.cdn"), <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />, needsCdn, () => setNeedsCdn(!needsCdn))}
                <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">{needsCdn ? t("costSim.sim.cdnOn") : t("costSim.sim.cdnOff")}</p>

                {needsCdn && (
                  <>
                    {renderToggle(t("costSim.sim.drm"), <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />, needsSecurePlayer, () => setNeedsSecurePlayer(!needsSecurePlayer))}
                    <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">{needsSecurePlayer ? t("costSim.sim.drmOn") : t("costSim.sim.drmOff")}</p>
                  </>
                )}

                {learners >= 500 && (
                  <>
                    {renderToggle(t("costSim.sim.server"), <Server className="w-3.5 h-3.5 text-muted-foreground" />, needsDedicatedServer, () => setNeedsDedicatedServer(!needsDedicatedServer))}
                    <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">{t("costSim.sim.serverDesc")}</p>
                  </>
                )}

                {renderToggle(t("costSim.sim.annual"), <CalendarCheck className="w-3.5 h-3.5 text-muted-foreground" />, isAnnual, () => setIsAnnual(!isAnnual))}
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
                  <div className="mt-3 rounded-xl p-3 text-xs text-muted-foreground space-y-1" style={{ background: "#f0eeff" }}>
                    <p className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" style={{ color: "#5D45FF" }} /> {t("costSim.sim.estTransfer")}: <span className="font-semibold text-foreground">{cdnGB.toLocaleString()}GB</span></p>
                    <p className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5" style={{ color: "#5D45FF" }} /> {t("costSim.sim.estStorage")}: <span className="font-semibold text-foreground">{storageGB.toLocaleString()}GB</span></p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Results ── */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {bestPlan && (
                <div className="rounded-2xl p-6 relative overflow-hidden shadow-xl" style={{ background: "hsl(255, 75%, 58%)" }}>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-white/80" />
                      <span className="text-xs font-bold text-white/80 tracking-wider uppercase">{t("costSim.result.recommended")}</span>
                    </div>

                    {/* 1. Savings badge — most prominent */}
                    {savingsAmount > 0 && (
                      <>
                        <div className="mb-1 inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm" style={{ background: "#FEE500", color: "#1a1a1a" }}>
                          <TrendingUp className="w-4 h-4 shrink-0" />
                          경쟁사 동일 사양 평균 대비 월 {formatPrice(savingsAmount)}원 절약
                        </div>
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
                      </>
                    )}

                    <div className="flex items-end gap-3 mb-1">
                      <h3 className="font-extrabold text-white text-3xl tracking-tight">{bestPlan.name}</h3>
                      <span className="text-white/60 text-sm mb-1">{bestPlan.solutionType}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-white/50 mb-2 tracking-wide">
                      {bestPlan.cdnIncluded > 0 ? t("costSim.result.cdnInfo", { cdn: bestPlan.cdnIncluded.toLocaleString(), storage: bestPlan.storageIncluded }) : t("costSim.result.cdnNone")}
                    </p>

                    {/* 2. Final total price */}
                    <div className="flex items-end gap-1 mb-1">
                      <span className="font-extrabold text-white text-4xl tabular-nums"><AnimatedPrice value={displayMonthly} /></span>
                      <span className="text-white/70 text-base mb-1">{t("costSim.result.perMonth")}</span>
                    </div>

                    {isAnnual && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-white/50 line-through tabular-nums">{formatPrice(bestPlan.totalMonthly)}{t("costSim.result.perMonth")}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "#00C896", color: "white" }}>{t("costSim.result.discount")}</span>
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

                    <a href="#lead-capture" className="inline-flex items-center justify-center gap-1 w-full text-[13px] font-semibold text-white/60 hover:text-white/90 transition-colors mt-1">
                      {t("costSim.result.ctaConsult")} <ArrowRight className="w-3.5 h-3.5" />
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


              {/* Upgrade nudge — only when Basic and Plus is cheaper */}
              {upgradeNudge && upgradeNudge.savings > 0 && (
                <div className="rounded-2xl border p-4 flex items-start gap-3" style={{ borderColor: "rgba(93,69,255,0.3)", background: "rgba(93,69,255,0.04)" }}>
                  <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(93,69,255,0.12)" }}>
                    <TrendingUp className="w-4 h-4" style={{ color: "#5D45FF" }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground mb-1">전송량 기준 Plus 플랜 추천</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      전송량 기준으로 보면 Plus 플랜이 월 {formatPrice(upgradeNudge.savings)}원 더 저렴합니다. Plus로 바꿔볼까요?
                    </p>
                  </div>
                </div>
              )}

              {/* All plans comparison */}
              <div className="rounded-2xl border border-border overflow-hidden bg-white shadow-sm">
                <div className="px-6 py-4 bg-muted/50 border-b border-border flex items-center justify-between">
                  <span className="text-sm font-bold text-muted-foreground tracking-wider uppercase">{t("costSim.result.allPlans")}</span>
                  {isAnnual && <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#00C896" }}>{t("costSim.result.annualApplied")}</span>}
                </div>
                <div className="divide-y divide-border">
                  {recommendations.map((plan) => {
                    const secureAddon = (needsSecurePlayer && plan.name !== "Starter") ? SECURE_PLAYER_COST : 0;
                    const dedicatedAddon = (needsDedicatedServer && learners >= 500) ? DEDICATED_SERVER_COST : 0;
                    const overageOnly = plan.overageCdn + plan.overageStorage;
                    const addonsTotal = secureAddon + dedicatedAddon + overageOnly;
                    const isBest = plan.name === bestPlan?.name;
                    const features = PLAN_KEY_FEATURES[plan.name] || [];
                    return (
                      <div key={plan.name} className={`flex items-start justify-between px-6 py-5 transition-colors ${isBest ? "" : "hover:bg-muted/30"}`} style={{ background: isBest ? "rgba(93,69,255,0.05)" : undefined, borderLeft: isBest ? "3px solid #5D45FF" : "3px solid transparent" }}>
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {isBest && <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5" style={{ background: "#5D45FF" }} />}
                          <div className="min-w-0">
                            <p className="text-base font-bold" style={isBest ? { color: "#5D45FF" } : undefined}>{plan.name}</p>
                            <p className="text-sm text-muted-foreground">{plan.solutionType}</p>
                            <p className="text-xs text-muted-foreground/60">{plan.cdnIncluded > 0 ? t("costSim.result.cdnInfo", { cdn: plan.cdnIncluded.toLocaleString(), storage: plan.storageIncluded }) : t("costSim.result.cdnNone")}</p>
                            {features.length > 0 && (
                              <div className="mt-2 space-y-0.5">
                                {features.map((f) => (
                                  <p key={f} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                    <CheckCircle className="w-3 h-3 shrink-0 mt-0.5" style={{ color: isBest ? "#5D45FF" : "#9ca3af" }} />
                                    {f}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end gap-2">
                          <div>
                            <p className="text-base font-bold text-foreground tabular-nums">{formatPrice(isAnnual ? Math.round(plan.monthly * (1 - ANNUAL_DISCOUNT)) : plan.monthly)}{t("costSim.result.perMonth")}</p>
                            {isAnnual && <p className="text-xs text-muted-foreground line-through tabular-nums">{formatPrice(plan.monthly)}</p>}
                            {secureAddon > 0 && <p className="text-xs text-blue-500 font-medium tabular-nums mt-0.5">+ 보안플레이어 {formatPrice(secureAddon)}</p>}
                            {dedicatedAddon > 0 && <p className="text-xs text-blue-500 font-medium tabular-nums">+ 단독서버 {formatPrice(dedicatedAddon)}</p>}
                            {overageOnly > 0 && <p className="text-xs text-orange-500 font-medium tabular-nums">+ 초과 {formatPrice(overageOnly)}</p>}
                          </div>
                          <a
                            href="#lead-capture"
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${isBest ? "text-white hover:opacity-90" : "border hover:bg-muted/50"}`}
                            style={isBest ? { background: "#5D45FF" } : { borderColor: "#5D45FF", color: "#5D45FF" }}
                          >
                            이 플랜으로 상담받기
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LazySection>
      {/* ═══ PLAN FEATURE COMPARISON ═══ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-5 md:px-6 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2 text-center" style={{ wordBreak: "keep-all" }}>{t("costSim.features.title")}</h2>
          <p className="text-sm text-muted-foreground text-center mb-10">{t("costSim.features.desc")}</p>

          <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#1e1b4b" }}>
                    <th className="text-left px-5 py-4 font-bold text-white text-sm w-[30%]">{t("costSim.features.header")}</th>
                    {(["Basic", "Plus", "Premium"] as const).map(p => {
                      const isRecommended = bestPlan?.name === p;
                      return (
                        <th key={p} className="text-center px-5 py-4 text-base font-bold" style={isRecommended ? { background: "#5D45FF", color: "white" } : { color: "white" }}>
                          {p}
                          {isRecommended && <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: "#FEE500", color: "#1e1b4b" }}>{t("costSim.features.rec")}</span>}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {featureItems.map((item: any) => {
                    const values = { Basic: item.basic, Plus: item.plus, Premium: item.premium };
                    return (
                      <tr key={item.feature} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-4 font-medium text-foreground text-[13px]">{item.feature}</td>
                        {(["Basic", "Plus", "Premium"] as const).map(p => {
                          const val = values[p];
                          const isRec = bestPlan?.name === p;
                          const isCheck = val === "✓" || val.startsWith("✓");
                          return (
                            <td key={p} className="px-5 py-4 text-center text-[13px]" style={isRec ? { background: "rgba(93,69,255,0.03)" } : undefined}>
                              {isCheck ? (
                                <span className="inline-flex items-center justify-center gap-1 font-semibold" style={{ color: "#00C896" }}>
                                  <CheckCircle className="w-4 h-4" />
                                  {val !== "✓" && <span>{val.replace("✓ ", "")}</span>}
                                </span>
                              ) : val === "—" ? (
                                <span className="text-muted-foreground">—</span>
                              ) : (
                                <span className={isRec ? "font-semibold" : "text-muted-foreground"}>{val}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  {/* Price row */}
                  <tr style={{ background: "#F8F9FD" }}>
                    <td className="px-5 py-6 font-semibold text-muted-foreground text-[13px]">{t("costSim.features.priceLabel")}</td>
                    {([
                      { name: "Basic", price: 500000, sub: t("costSim.features.priceSub") },
                      { name: "Plus", price: 700000, sub: t("costSim.features.priceSub") },
                      { name: "Premium", price: 1000000, sub: t("costSim.features.customQuote") },
                    ] as const).map(({ name, price, sub }) => {
                      const isRec = bestPlan?.name === name;
                      return (
                        <td key={name} className="px-5 py-6 text-center" style={isRec ? { background: "rgba(93,69,255,0.06)" } : undefined}>
                          <p className="font-extrabold text-lg md:text-xl tabular-nums tracking-tight text-foreground">{formatPrice(price)}<span className="text-xs md:text-sm font-bold">{t("costSim.features.priceUnit")}</span></p>
                          <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>
                          {isRec ? (
                            <a href="#lead-capture" className="inline-flex items-center gap-1 mt-3 px-3 py-2 md:px-5 md:py-2.5 rounded-xl text-[11px] md:text-[13px] font-semibold text-white transition-all hover:scale-[1.02] whitespace-nowrap" style={{ background: "#5D45FF" }}>
                              {t("costSim.features.apply")} <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            </a>
                          ) : (
                            <a href="#lead-capture" className="inline-flex items-center gap-1 mt-3 px-3 py-2 md:px-5 md:py-2.5 rounded-xl text-[11px] md:text-[13px] font-semibold text-foreground border border-border transition-all hover:bg-muted/50 whitespace-nowrap">
                              {name === "Premium" ? t("costSim.features.quoteRequest") : t("costSim.features.inquire")}
                            </a>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      </LazySection>

      <LazySection>
      {/* ═══ COMPETITOR COMPARISON ═══ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-5 md:px-6 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2 text-center">{t("costSim.comparison.title")}</h2>
          <p className="text-sm text-muted-foreground text-center mb-10">{t("costSim.comparison.desc")}</p>
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-border" style={{ background: "#F8F9FD" }}>
                  <th className="text-left px-5 py-4 font-semibold text-muted-foreground text-sm">{t("costSim.comparison.headerItem")}</th>
                  <th className="text-center px-5 py-4 font-bold text-sm" style={{ color: "#5D45FF" }}>{t("costSim.comparison.headerUs")}</th>
                  <th className="text-center px-5 py-4 font-semibold text-muted-foreground text-sm">{t("costSim.comparison.headerOther")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisonItems.map((item: any) => (
                  <tr key={item.feature} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-foreground text-[15px]">{item.feature}</td>
                    <td className="px-5 py-4 text-center font-semibold text-[15px]" style={{ color: "#5D45FF" }}>
                      <div className="flex items-center justify-center gap-1.5">
                        <CheckCircle className="w-4 h-4" style={{ color: "#00C896" }} />
                        {item.us}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center text-muted-foreground text-[15px]">{item.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      </LazySection>

      <LazySection>
      {/* ═══ SUCCESS CASES ═══ */}
      <section className="py-16 md:py-20" style={{ background: "#F8F9FD" }}>
        <div className="container mx-auto px-5 md:px-6 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2 text-center">{t("costSim.cases.title")}</h2>
          <p className="text-sm text-muted-foreground text-center mb-10">{t("costSim.cases.desc")}</p>
          <div className="space-y-4">
            {cases.map((c: any) => (
              <div key={c.org} className={`rounded-2xl p-6 bg-white border-2 transition-all ${matchedCase === c ? "shadow-lg" : "border-border"}`} style={matchedCase === c ? { borderColor: "#5D45FF" } : undefined}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#5D45FF" }}>{c.scale}</span>
                      <span className="text-xs text-muted-foreground">{c.industry}</span>
                      {matchedCase === c && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,0,0.1)", color: "#FF6B00" }}>{t("costSim.cases.similarLabel")}</span>}
                    </div>
                    <h3 className="font-bold text-foreground text-base mb-1">{c.org}</h3>
                    <p className="text-sm text-muted-foreground">{c.result}</p>
                  </div>
                  <div className="shrink-0 text-center px-4">
                    <span className="text-xs text-muted-foreground">{t("costSim.cases.planLabel")}</span>
                    <p className="text-xl font-extrabold tracking-tight" style={{ color: "#5D45FF" }}>{c.plan}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      </LazySection>

      
      <section className="py-14" style={{ background: "linear-gradient(135deg, #5D45FF, #7c68ff)" }}>
        <div className="container mx-auto px-5 max-w-4xl text-center">
          <h3 className="font-bold text-white text-2xl tracking-tight mb-3">{t("costSim.midCta.title")}</h3>
          <p className="text-white/60 text-sm mb-8 max-w-xl mx-auto">{t("costSim.midCta.desc")}</p>
          <a href="#lead-capture" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02]" style={{ background: "#FF6B00", color: "white" }}>
            {t("costSim.midCta.cta")} <FileText className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ═══ RISK-FREE GUARANTEES ═══ */}
      <section className="py-16 md:py-20" style={{ background: "#F8F9FD" }}>
        <div className="container mx-auto px-5 md:px-6 max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#5D45FF" }}>{t("costSim.guarantees.label")}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight" style={{ wordBreak: "keep-all" }}>
              {t("costSim.guarantees.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guaranteeItems.map((item: any, i: number) => {
              const icons = [
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="hsl(255, 75%, 95%)" /><path d="M10 16h12M18 12l4 4-4 4" stroke="hsl(255, 75%, 58%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 10v12M24 10v12" stroke="hsl(255, 75%, 58%)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" /></svg>,
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="hsl(255, 75%, 95%)" /><circle cx="16" cy="16" r="7" stroke="hsl(255, 75%, 58%)" strokeWidth="2" /><path d="M16 12v4l3 2" stroke="hsl(255, 75%, 58%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="hsl(0, 80%, 95%)" /><circle cx="16" cy="16" r="7" stroke="hsl(0, 70%, 55%)" strokeWidth="2" /><path d="M12.5 12.5l7 7M19.5 12.5l-7 7" stroke="hsl(0, 70%, 55%)" strokeWidth="2" strokeLinecap="round" /></svg>,
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="hsl(255, 75%, 95%)" /><path d="M16 8l6 3v6c0 4-3 6.5-6 8-3-1.5-6-4-6-8v-6l6-3z" stroke="hsl(255, 75%, 58%)" strokeWidth="2" strokeLinejoin="round" /><path d="M13 16l2 2 4-4" stroke="hsl(255, 75%, 58%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
              ];
              return (
                <div key={item.title} className="rounded-2xl p-6 bg-white border border-border shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="flex justify-center mb-4">{icons[i]}</div>
                  <h3 className="font-bold text-foreground text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ LEAD CAPTURE ═══ */}
      <section id="lead-capture" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-5 md:px-6 max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-3 whitespace-pre-line" style={{ wordBreak: "keep-all" }}>
              {t("costSim.lead.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {bestPlan && <>{t("costSim.lead.currentPlan")} <span className="font-bold" style={{ color: "#5D45FF" }}>{bestPlan.name} 플랜 · 월 {formatPrice(bestPlan.monthly)}원{needsSecurePlayer && bestPlan.name !== "Starter" && bestPlan.name !== "Premium" ? ` + 보안플레이어 ${formatPrice(SECURE_PLAYER_COST)}원` : ""}</span></>}
            </p>
          </div>

          {formSubmitted ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: "#00C896" }} />
              <h3 className="text-xl font-bold text-foreground mb-2">{t("costSim.lead.successTitle")}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t("costSim.lead.successDesc")}</p>
              <div className="rounded-xl p-5 text-left" style={{ background: "#F8F7FF", border: "1px solid #E8E5FF" }}>
                <p className="text-base font-semibold text-foreground mb-3">제안서 요약</p>
                {bestPlan && (
                  <div className="text-sm text-muted-foreground space-y-1.5">
                    <p>추천 플랜: <span className="font-bold" style={{ color: "#5D45FF" }}>{bestPlan.name}</span> — 월 {formatPrice(bestPlan.monthly)}원{needsSecurePlayer && bestPlan.name !== "Starter" && bestPlan.name !== "Premium" ? ` + 보안플레이어 ${formatPrice(SECURE_PLAYER_COST)}원` : ""}</p>
                    <p>기본 전송량 {bestPlan.cdnIncluded > 0 ? `${formatPrice(bestPlan.cdnIncluded)}GB/월` : "—"} · 저장공간 {bestPlan.storageIncluded > 0 ? `${bestPlan.storageIncluded}GB` : "—"}</p>
                    <p>수강생 {learners.toLocaleString()}명 · 저장공간 {storageInput}GB · 완강률 {completionRate}%</p>
                    <p className="pt-2 font-medium text-foreground">기본 포함 서비스</p>
                    <p>✓ 회원수 무제한 · 디자인 무료 템플릿 · SSL 보안인증서</p>
                    {(bestPlan.name === "Plus" || bestPlan.name === "Premium") && <p>✓ 모바일 앱 (iOS/Android)</p>}
                    {bestPlan.name === "Premium" && <p>✓ DRM 보안 플레이어</p>}
                    {needsSecurePlayer && bestPlan.name !== "Premium" && bestPlan.name !== "Starter" && (
                      <p className="text-amber-600">⚡ DRM 보안 플레이어 (선택 · 월 300,000원)</p>
                    )}
                    {!needsSecurePlayer && bestPlan.name !== "Premium" && bestPlan.name !== "Starter" && (
                      <p className="text-muted-foreground/60">DRM 보안 플레이어 (선택 · 월 300,000원)</p>
                    )}
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-4">
                  담당자가 맞춤 제안서를 검토 후 입력하신 이메일로 발송해드립니다.
                </p>
              </div>
            </div>
          ) : (
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            if (formLoading) return;
            setFormLoading(true);
            try {
              const simulationSummary = bestPlan
                ? `[Cost Simulator Proposal] Plan: ${bestPlan.name} / Monthly: ${formatPrice(displayMonthly)} / Learners: ${learners} / Storage: ${storageInput}GB / Completion: ${completionRate}% / DRM: ${needsSecurePlayer ? "Y" : "N"} / Dedicated: ${needsDedicatedServer ? "Y" : "N"} / Annual: ${isAnnual ? "Y" : "N"}`
                : "[Cost Simulator Proposal]";
              
              const { error: fnError } = await supabase.functions.invoke("send-contact-email", {
                body: {
                  company: formData.company,
                  name: formData.company,
                  phone: formData.contact,
                  email: formData.email,
                  service: "LMS Pricing",
                  message: simulationSummary,
                  inquiryType: "proposal_request",
                  marketingAgreed: false,
                  session_id: sessionStorage.getItem("_sid") || undefined,
                  proposal_data: simulationData,
                },
              });
              if (fnError) throw new Error(fnError.message);
              setFormSubmitted(true);
              showToast({ title: t("costSim.lead.toastSuccess"), description: t("costSim.lead.toastSuccessDesc") });
            } catch (err: any) {
              showToast({ title: t("costSim.lead.toastError"), description: err.message || t("costSim.lead.toastErrorDesc"), variant: "destructive" });
            } finally {
              setFormLoading(false);
            }
          }}>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">{t("costSim.lead.company")}</label>
              <input type="text" value={formData.company} onChange={(e) => setFormData(p => ({ ...p, company: e.target.value }))} placeholder={t("costSim.lead.companyPh")} className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{t("costSim.lead.contact")}</label>
                <input type="tel" value={formData.contact} onChange={(e) => setFormData(p => ({ ...p, contact: e.target.value }))} placeholder={t("costSim.lead.contactPh")} className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{t("costSim.lead.email")}</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} placeholder={t("costSim.lead.emailPh")} className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 transition-all" required />
              </div>
            </div>
            <button type="submit" disabled={formLoading} className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.01] shadow-lg disabled:opacity-60" style={{ background: "#FF6B00" }}>
              {formLoading ? t("costSim.lead.submitting") : t("costSim.lead.submit")}
            </button>
            <p className="text-[11px] text-muted-foreground text-center">{t("costSim.lead.consent")}</p>
          </form>
          )}
        </div>
      </section>

      
    </div>
  );
}

/* ── Toggle helper ── */
function renderToggle(label: string, icon: React.ReactNode, checked: boolean, toggle: () => void) {
  return (
    <div className="flex items-center justify-between rounded-xl p-3 bg-white border border-border mt-2.5" style={checked ? { borderColor: "rgba(93,69,255,0.3)", background: "rgba(93,69,255,0.03)" } : undefined}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <button onClick={toggle} className={`relative shrink-0 w-11 h-6 rounded-full transition-colors overflow-hidden ${checked ? "" : "bg-muted"}`} style={checked ? { background: "#5D45FF" } : undefined}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}
