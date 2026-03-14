import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import HeroPatternBg from "@/components/visuals/HeroPatternBg";
import HeroPromoBanner from "@/components/shared/HeroPromoBanner";
import LmsHeroOverlay from "@/components/visuals/LmsHeroOverlay";
import {
  Calculator, Users, HardDrive, ArrowRight, Sparkles, Info, BarChart3,
  GraduationCap, Server, Globe, ShieldCheck, TrendingUp, CalendarCheck,
  CheckCircle, X, Shield, Clock, Headphones, MessageCircle, FileText,
  Zap, Award, Building2, Star
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SEO, { BASE_URL } from "@/components/SEO";

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
  const [isAnnual, setIsAnnual] = useState(false);
  const [needsDedicatedServer, setNeedsDedicatedServer] = useState(false);
  
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
    const sorted = [...viable].sort((a, b) => a.totalMonthly - b.totalMonthly);
    if (sorted[0] && (sorted[0].overageCdn + sorted[0].overageStorage) > sorted[0].monthly * 0.5) return sorted[1] || sorted[0];
    return sorted[0];
  }, [recommendations, needsCdn]);

  const upgradeNudge = useMemo<{ fromPlan: string; toPlan: string; diff: number; benefit: string } | null>(() => {
    if (!bestPlan || !needsCdn) return null;
    const planOrder = ["Basic", "Plus", "Premium"];
    const idx = planOrder.indexOf(bestPlan.name);
    if (idx < 0) return null;
    const overage = bestPlan.overageCdn + bestPlan.overageStorage;
    if (overage <= 0) return null;
    const nextName = planOrder[idx + 1];
    if (!nextName) return null;
    const next = recommendations.find((p) => p.name === nextName);
    if (!next) return null;
    const diff = next.monthly - bestPlan.monthly;
    const cdnMultiple = next.cdnIncluded / Math.max(bestPlan.cdnIncluded, 1);
    return { fromPlan: bestPlan.name, toPlan: nextName, diff, benefit: t("costSim.result.upgradeBenefit", { multiple: cdnMultiple.toFixed(0) }) };
  }, [bestPlan, recommendations, needsCdn, t]);

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
                      <TooltipProvider><Tooltip><TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent><p className="text-xs">{t("costSim.sim.learnersTooltip")}</p></TooltipContent></Tooltip></TooltipProvider>
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
                      <TooltipProvider><Tooltip><TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent><p className="text-xs max-w-[220px]">{t("costSim.sim.storageTooltip")}</p></TooltipContent></Tooltip></TooltipProvider>
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
                      <TooltipProvider><Tooltip><TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent><p className="text-xs">{t("costSim.sim.completionTooltip")}</p></TooltipContent></Tooltip></TooltipProvider>
                    </div>
                    <div className="flex items-center gap-1">
                      <input type="number" value={completionRate} onChange={(e) => setCompletionRate(Math.min(100, Math.max(10, Number(e.target.value) || 10)))} className="w-12 text-right text-base font-bold tabular-nums bg-transparent border-b border-border focus:border-primary outline-none" style={{ color: "#5D45FF" }} min={10} max={100} />
                      <span className="text-base font-bold" style={{ color: "#5D45FF" }}>%</span>
                    </div>
                  </div>
                  <Slider value={[completionRate]} onValueChange={([v]) => setCompletionRate(v)} min={10} max={100} step={5} className="w-full" />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>10%</span><span>100%</span></div>
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
                <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">{isAnnual ? t("costSim.sim.annualOn") : t("costSim.sim.annualOff")}</p>

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
                    <div className="flex items-end gap-3 mb-1">
                      <h3 className="font-extrabold text-white text-3xl tracking-tight">{bestPlan.name}</h3>
                      <span className="text-white/60 text-sm mb-1">{bestPlan.solutionType}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-white/50 mb-2 tracking-wide">
                      {bestPlan.cdnIncluded > 0 ? t("costSim.result.cdnInfo", { cdn: bestPlan.cdnIncluded.toLocaleString(), storage: bestPlan.storageIncluded }) : t("costSim.result.cdnNone")}
                    </p>

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

                    {(bestPlan.overageCdn > 0 || bestPlan.overageStorage > 0 || needsSecurePlayer || (needsDedicatedServer && learners >= 500)) && (
                      <div className="flex flex-wrap gap-2 mt-3 mb-3">
                        {bestPlan.overageCdn > 0 && <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/90">{t("costSim.result.cdnOverage", { amount: formatPrice(bestPlan.overageCdn) })}</span>}
                        {bestPlan.overageStorage > 0 && <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/90">{t("costSim.result.storageOverage", { amount: formatPrice(bestPlan.overageStorage) })}</span>}
                        {needsSecurePlayer && bestPlan.name !== "Starter" && <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/90">{t("costSim.result.securePlayer", { amount: formatPrice(SECURE_PLAYER_COST) })}</span>}
                        {needsDedicatedServer && learners >= 500 && <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/90">{t("costSim.result.dedicatedServer", { amount: formatPrice(DEDICATED_SERVER_COST) })}</span>}
                      </div>
                    )}

                    {savingsAmount > 0 && (
                      <div className="flex items-center gap-2 mb-4 w-full px-5 py-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                        <TrendingUp className="w-5 h-5 shrink-0" style={{ color: "#4ade80" }} />
                        <span className="text-base font-extrabold" style={{ color: "#4ade80" }}>{t("costSim.result.savings", { amount: formatPrice(savingsAmount) })}</span>
                      </div>
                    )}

                    <a href="#lead-capture" className="inline-flex items-center justify-center gap-1 w-full text-[13px] font-semibold text-white/60 hover:text-white/90 transition-colors mt-1">
                      {t("costSim.result.ctaConsult")} <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}


              {/* Upgrade nudge */}
              {upgradeNudge && (
                <div className="rounded-2xl border p-4 flex items-start gap-3" style={{ borderColor: "rgba(93,69,255,0.3)", background: "rgba(93,69,255,0.04)" }}>
                  <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(93,69,255,0.12)" }}>
                    <TrendingUp className="w-4 h-4" style={{ color: "#5D45FF" }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground mb-1">{t("costSim.result.upgradeTitle", { plan: upgradeNudge.toPlan })}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: t("costSim.result.upgradeDesc", { amount: formatPrice(upgradeNudge.diff), benefit: upgradeNudge.benefit, plan: upgradeNudge.toPlan }) }} />
                  </div>
                </div>
              )}

              {/* All plans comparison */}
              <div className="rounded-2xl border border-border overflow-hidden bg-white shadow-sm">
                <div className="px-5 py-3.5 bg-muted/50 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">{t("costSim.result.allPlans")}</span>
                  {isAnnual && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#00C896" }}>{t("costSim.result.annualApplied")}</span>}
                </div>
                <div className="divide-y divide-border">
                  {recommendations.map((plan) => {
                    const discounted = isAnnual ? Math.round(plan.totalMonthly * (1 - ANNUAL_DISCOUNT)) : plan.totalMonthly;
                    return (
                      <div key={plan.name} className={`flex items-center justify-between px-5 py-4 transition-colors ${plan.name === bestPlan?.name ? "" : "hover:bg-muted/30"}`} style={plan.name === bestPlan?.name ? { background: "rgba(93,69,255,0.05)" } : undefined}>
                        <div className="flex items-center gap-3">
                          {plan.name === bestPlan?.name && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#5D45FF" }} />}
                          <div>
                            <p className="text-sm font-bold" style={plan.name === bestPlan?.name ? { color: "#5D45FF" } : undefined}>{plan.name}</p>
                            <p className="text-xs text-muted-foreground">{plan.solutionType}</p>
                            <p className="text-[10px] text-muted-foreground/60">{plan.cdnIncluded > 0 ? t("costSim.result.cdnInfo", { cdn: plan.cdnIncluded.toLocaleString(), storage: plan.storageIncluded }) : t("costSim.result.cdnNone")}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground tabular-nums">{formatPrice(discounted)}{t("costSim.result.perMonth")}</p>
                          {isAnnual && <p className="text-[10px] text-muted-foreground line-through tabular-nums">{formatPrice(plan.totalMonthly)}</p>}
                          {!isAnnual && plan.totalMonthly > plan.monthly && <p className="text-[10px] text-muted-foreground">{t("costSim.result.base")} {formatPrice(plan.monthly)} + {t("costSim.result.overage")} {formatPrice(plan.totalMonthly - plan.monthly)}</p>}
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

      {/* ═══ MID CTA ═══ */}
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
              {bestPlan && <>{t("costSim.lead.currentPlan")} <span className="font-bold" style={{ color: "#5D45FF" }}>{t("costSim.lead.planSummary", { plan: bestPlan.name, price: formatPrice(displayMonthly) })}</span></>}
            </p>
          </div>

          {formSubmitted ? (
            <div className="text-center py-10">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: "#00C896" }} />
              <h3 className="text-xl font-bold text-foreground mb-2">{t("costSim.lead.successTitle")}</h3>
              <p className="text-sm text-muted-foreground">{t("costSim.lead.successDesc")}</p>
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
