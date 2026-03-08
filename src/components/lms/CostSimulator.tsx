import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { TOptions } from "i18next";
import { Calculator, Users, HardDrive, ArrowRight, Sparkles, Info, BarChart3, GraduationCap, Server, Globe, ShieldCheck, TrendingUp, CalendarCheck } from "lucide-react";
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
  const [isAnnual, setIsAnnual] = useState(false);
  const [needsDedicatedServer, setNeedsDedicatedServer] = useState(false);
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
    if (sorted[0] && (sorted[0].overageCdn + sorted[0].overageStorage) > sorted[0].monthly * 0.5) {
      return sorted[1] || sorted[0];
    }
    return sorted[0];
  }, [recommendations, needsCdn]);

  const upgradeNudge = useMemo<{ fromPlan: string; toPlan: string; savings: number } | null>(() => {
    if (!bestPlan || !needsCdn) return null;
    const planOrder = ["Basic", "Plus", "Premium"];
    const bestIdx = planOrder.indexOf(bestPlan.name);
    if (bestIdx < 0) return null;
    const overage = bestPlan.overageCdn + bestPlan.overageStorage;
    if (overage <= 0) return null;
    const nextTierName = planOrder[bestIdx + 1];
    if (!nextTierName) return null;
    const nextTier = recommendations.find((p) => p.name === nextTierName);
    if (!nextTier) return null;
    const baseDiff = nextTier.monthly - bestPlan.monthly;
    if (nextTier.totalMonthly < bestPlan.totalMonthly) {
      return { fromPlan: bestPlan.name, toPlan: nextTier.name, savings: bestPlan.totalMonthly - nextTier.totalMonthly };
    }
    if (overage >= baseDiff * 0.7) {
      return { fromPlan: bestPlan.name, toPlan: nextTier.name, savings: 0 };
    }
    return null;
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
            <div className="rounded-2xl border border-border p-6 bg-secondary/30">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5" style={{ color: "hsl(var(--lms-primary))" }} />
                <h3 className="font-bold text-foreground text-base">{t("costSim.inputTitle")}</h3>
              </div>

              {/* Learners slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-muted-foreground" />
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
                        setLearners(v);
                      }}
                      className="w-16 text-right text-lg font-bold tabular-nums bg-transparent border-b border-border focus:border-primary outline-none"
                      style={{ color: "hsl(var(--lms-primary))" }}
                      min={10}
                      max={2000}
                    />
                    {t("costSim.learnersUnit") && (
                      <span className="text-lg font-bold" style={{ color: "hsl(var(--lms-primary))" }}>{t("costSim.learnersUnit")}</span>
                    )}
                  </div>
                </div>
                <Slider
                  value={[learners]}
                  onValueChange={([v]) => setLearners(v)}
                  min={10}
                  max={2000}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                  <span>10{t("costSim.learnersUnit")}</span>
                  <span>2,000{t("costSim.learnersUnit")}</span>
                </div>
              </div>

              {/* Storage GB slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-muted-foreground" />
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
                      className="w-16 text-right text-lg font-bold tabular-nums bg-transparent border-b border-border focus:border-primary outline-none"
                      style={{ color: "hsl(var(--lms-primary))" }}
                      min={1}
                      max={500}
                    />
                    <span className="text-lg font-bold" style={{ color: "hsl(var(--lms-primary))" }}>GB</span>
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
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                  <span>1GB</span>
                  <span>500GB</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {t("costSim.storageRef", { num: Math.round(storageInput / 0.3) } as TOptions)}
                </p>
              </div>

              {/* Completion rate slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">{t("costSim.completion")}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent><p className="text-xs max-w-[200px]">{t("costSim.completionTooltip")}</p></TooltipContent>
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
                      className="w-12 text-right text-lg font-bold tabular-nums bg-transparent border-b border-border focus:border-primary outline-none"
                      style={{ color: "hsl(var(--lms-primary))" }}
                      min={10}
                      max={100}
                    />
                    <span className="text-lg font-bold" style={{ color: "hsl(var(--lms-primary))" }}>%</span>
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
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                  <span>10%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* CDN toggle */}
              <div className="flex items-center justify-between rounded-xl p-3.5 bg-background border border-border">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-muted-foreground" />
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
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed pl-1">
                {needsCdn ? t("costSim.cdnOnDesc") : t("costSim.cdnOffDesc")}
              </p>

              {/* Secure Player toggle */}
              {needsCdn && (
              <>
                <div className="flex items-center justify-between rounded-xl p-3.5 bg-background border border-border mt-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-muted-foreground" />
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
                <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed pl-1">
                  {needsSecurePlayer ? t("costSim.secureOnDesc") : t("costSim.secureOffDesc")}
                </p>
              </>
              )}

              {/* Annual contract toggle */}
              <div className="flex items-center justify-between rounded-xl p-3.5 bg-background border border-border mt-4">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-muted-foreground" />
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
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed pl-1">
                {isAnnual ? t("costSim.annualOnDesc") : t("costSim.annualOffDesc")}
              </p>

              {/* Estimated usage */}
              {needsCdn && (
              <div className="mt-4 rounded-xl p-3.5 bg-muted/50 text-xs text-muted-foreground space-y-1.5">
                <p className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" style={{ color: "hsl(var(--lms-primary))" }} /> {t("costSim.estTransfer")} <span className="font-semibold text-foreground">{cdnGB.toLocaleString()}GB</span></p>
                <p className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5" style={{ color: "hsl(var(--lms-primary))" }} /> {t("costSim.estStorage")} <span className="font-semibold text-foreground">{storageGB.toLocaleString()}GB</span></p>
                <p className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" style={{ color: "hsl(var(--lms-primary))" }} /> {t("costSim.estCompletion")} <span className="font-semibold text-foreground">{completionRate}%</span></p>
              </div>
              )}

              {/* Dedicated server recommendation */}
              {learners >= 500 && (
                <>
                  <div className="flex items-center justify-between rounded-xl p-3.5 bg-background border border-border mt-4" style={ needsDedicatedServer ? { borderColor: "hsl(var(--lms-primary) / 0.4)", background: "hsl(var(--lms-primary) / 0.04)" } : undefined }>
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-muted-foreground" />
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
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed pl-1">
                    {t("costSim.dedicatedToggleDesc")}
                  </p>
                  {needsDedicatedServer && (
                    <div className="mt-2 rounded-xl p-3.5 text-xs text-muted-foreground space-y-1.5" style={{ background: "hsl(var(--lms-primary) / 0.05)" }}>
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
                  <div className="flex items-end gap-3 mb-2">
                    <h3 className="font-extrabold text-white text-3xl tracking-tight">{bestPlan.name}</h3>
                    <span className="text-white/60 text-sm mb-1">{bestPlan.solutionType}</span>
                  </div>
                  {(() => {
                    const displayMonthly = isAnnual ? Math.round(bestPlan.totalMonthly * (1 - ANNUAL_DISCOUNT)) : bestPlan.totalMonthly;
                    return (
                      <>
                        <div className="flex items-end gap-1 mb-1">
                          <span className="font-extrabold text-white text-4xl tabular-nums">{formatPrice(displayMonthly)}</span>
                          <span className="text-white/70 text-base mb-1">{t("costSim.perMonth")}</span>
                        </div>
                        {isAnnual && (
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs text-white/50 line-through tabular-nums">{formatPrice(bestPlan.totalMonthly)}{t("costSim.perMonth")}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "hsl(120, 60%, 40%)", color: "white" }}>{t("costSim.discount")}</span>
                            <span className="text-xs text-white/60">{t("costSim.annualTotal", { amount: formatPrice(displayMonthly * 12) })}</span>
                          </div>
                        )}
                        {!isAnnual && <div className="mb-4" />}
                      </>
                    );
                  })()}


                  {(bestPlan.overageCdn > 0 || bestPlan.overageStorage > 0 || needsSecurePlayer || (needsDedicatedServer && learners >= 500)) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {bestPlan.overageCdn > 0 && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/90">
                          {t("costSim.cdnOverage", { amount: formatPrice(bestPlan.overageCdn) })}
                        </span>
                      )}
                      {bestPlan.overageStorage > 0 && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/90">
                          {t("costSim.storageOverage", { amount: formatPrice(bestPlan.overageStorage) })}
                        </span>
                      )}
                      {needsSecurePlayer && bestPlan.name !== "Starter" && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/90">
                          {t("costSim.secureAddon", { amount: formatPrice(SECURE_PLAYER_COST) })}
                        </span>
                      )}
                      {needsDedicatedServer && learners >= 500 && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/90">
                          {t("costSim.dedicatedAddon", { amount: formatPrice(DEDICATED_SERVER_COST) })}
                        </span>
                      )}
                    </div>
                  )}
                  <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-white transition-all hover:scale-[1.02]" style={{ color: "hsl(var(--lms-primary))" }}>
                    {t("costSim.ctaPlan")}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Upgrade nudge */}
            {upgradeNudge && (
              <div className="rounded-2xl border p-4 flex items-start gap-3" style={{ borderColor: "hsl(var(--lms-primary) / 0.3)", background: "hsl(var(--lms-primary) / 0.05)" }}>
                <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--lms-primary) / 0.12)" }}>
                  <TrendingUp className="w-4 h-4" style={{ color: "hsl(var(--lms-primary))" }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">
                    {t("costSim.nudgeTitle", { plan: upgradeNudge.toPlan })}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {upgradeNudge.savings > 0
                      ? t("costSim.nudgeSavings", { from: upgradeNudge.fromPlan, to: upgradeNudge.toPlan, amount: formatPrice(upgradeNudge.savings) })
                      : t("costSim.nudgeClose", { from: upgradeNudge.fromPlan, to: upgradeNudge.toPlan })
                    }
                  </p>
                </div>
              </div>
            )}

            {/* All plans comparison */}
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="px-5 py-3.5 bg-muted/50 border-b border-border flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">{t("costSim.allPlans")}</span>
                {isAnnual && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "hsl(120, 60%, 40%)", color: "white" }}>{t("costSim.annualApplied")}</span>}
              </div>
              <div className="divide-y divide-border">
                {recommendations.map((plan) => {
                  const discounted = isAnnual ? Math.round(plan.totalMonthly * (1 - ANNUAL_DISCOUNT)) : plan.totalMonthly;
                  return (
                  <div
                    key={plan.name}
                    className={`flex items-center justify-between px-5 py-4 transition-colors ${plan.name === bestPlan?.name ? "bg-primary/5" : "bg-background hover:bg-muted/30"}`}
                  >
                    <div className="flex items-center gap-3">
                      {plan.name === bestPlan?.name && (
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "hsl(var(--lms-primary))" }} />
                      )}
                      <div>
                        <p className={`text-sm font-bold ${plan.name === bestPlan?.name ? "" : "text-foreground"}`} style={plan.name === bestPlan?.name ? { color: "hsl(var(--lms-primary))" } : undefined}>
                          {plan.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{plan.solutionType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground tabular-nums">{currency(formatPrice(discounted))}{lang === 'en' ? t("costSim.perMonth") : `/${lang === 'ja' ? '月' : '월'}`}</p>
                      {isAnnual && (
                        <p className="text-[10px] text-muted-foreground line-through tabular-nums">{currency(formatPrice(plan.totalMonthly))}</p>
                      )}
                      {!isAnnual && plan.totalMonthly > plan.monthly && (
                        <p className="text-[10px] text-muted-foreground">{t("costSim.basePlusOverage", { base: formatPrice(plan.monthly), overage: formatPrice(plan.totalMonthly - plan.monthly) })}</p>
                      )}
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
    </section>
  );
}
