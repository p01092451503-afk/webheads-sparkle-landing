import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Calculator, Users, MonitorPlay, HardDrive, ArrowRight, Sparkles, Info, BarChart3, GraduationCap, Server, Globe, ShieldCheck } from "lucide-react";
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

const PLANS: Omit<PlanRecommendation, "isMatch" | "totalMonthly" | "overageCdn" | "overageStorage">[] = [
  { name: "Starter", monthly: 300000, cdnIncluded: 0, storageIncluded: 0, cdnOverage: 0, storageOverage: 0, solutionType: "임대형 (YouTube/Vimeo 연동)" },
  { name: "Basic", monthly: 500000, cdnIncluded: 500, storageIncluded: 100, cdnOverage: 500, storageOverage: 1000, solutionType: "임대형 · CDN 포함" },
  { name: "Plus", monthly: 700000, cdnIncluded: 1500, storageIncluded: 200, cdnOverage: 400, storageOverage: 800, solutionType: "임대형 · SaaS | 단독서버" },
  { name: "Premium", monthly: 1000000, cdnIncluded: 2000, storageIncluded: 250, cdnOverage: 300, storageOverage: 500, solutionType: "임대형 · SaaS | 단독서버" },
];

function estimateUsage(learners: number, videoHours: number, completionRate: number) {
  const rate = completionRate / 100;
  const cdnGB = Math.round(learners * 2.5 * rate);
  const storageGB = Math.round(videoHours * 3);
  return { cdnGB, storageGB };
}

export default function CostSimulator() {
  const { t } = useTranslation();
  const [learners, setLearners] = useState(200);
  const [videoHours, setVideoHours] = useState(30);
  const [completionRate, setCompletionRate] = useState(70);
  const [needsCdn, setNeedsCdn] = useState(true);
  const [needsSecurePlayer, setNeedsSecurePlayer] = useState(false);
  const SECURE_PLAYER_COST = 300000;

  const { cdnGB, storageGB } = useMemo(() => estimateUsage(learners, videoHours, completionRate), [learners, videoHours, completionRate]);

  const recommendations = useMemo<PlanRecommendation[]>(() => {
    return PLANS.map((plan) => {
      if (plan.name === "Starter") {
        return { ...plan, isMatch: !needsCdn, totalMonthly: plan.monthly, overageCdn: 0, overageStorage: 0 };
      }
      if (!needsCdn) {
        return { ...plan, isMatch: false, totalMonthly: 0, overageCdn: 0, overageStorage: 0 };
      }
      const overCdn = Math.max(0, cdnGB - plan.cdnIncluded);
      const overStorage = Math.max(0, storageGB - plan.storageIncluded);
      const overageCdn = overCdn * plan.cdnOverage;
      const overageStorage = overStorage * plan.storageOverage;
      const totalMonthly = plan.monthly + overageCdn + overageStorage;
      return { ...plan, isMatch: true, totalMonthly, overageCdn, overageStorage };
    }).filter((p) => p.isMatch);
  }, [cdnGB, storageGB, needsCdn]);

  const bestPlan = useMemo(() => {
    const viable = recommendations.filter((p) => p.name !== "Starter");
    if (!needsCdn) return recommendations.find((p) => p.name === "Starter") || viable[0];
    const sorted = [...viable].sort((a, b) => a.totalMonthly - b.totalMonthly);
    if (sorted[0] && (sorted[0].overageCdn + sorted[0].overageStorage) > sorted[0].monthly * 0.5) {
      return sorted[1] || sorted[0];
    }
    return sorted[0];
  }, [recommendations, needsCdn]);

  const formatPrice = (n: number) => n.toLocaleString("ko-KR");

  return (
    <section id="cost-simulator" className="py-16 md:py-28 bg-background">
      <div className="container mx-auto px-5 md:px-6 max-w-5xl">
        <div className="mb-10 md:mb-14 text-center">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3 md:mb-4" style={{ color: "hsl(var(--lms-primary))" }}>
            COST SIMULATOR
          </p>
          <h2 className="font-bold text-foreground leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight">
            우리 회사 규모에 적당한 요금제는?
          </h2>
          <p className="text-muted-foreground mt-3 md:mt-4 text-sm md:text-base max-w-xl mx-auto">
            월 수강생 수와 영상 콘텐츠 규모를 입력하면, 예상 비용과 최적 플랜을 즉시 확인할 수 있어요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          {/* ── Left: Inputs ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="rounded-2xl border border-border p-6 bg-secondary/30">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5" style={{ color: "hsl(var(--lms-primary))" }} />
                <h3 className="font-bold text-foreground text-base">규모 입력</h3>
              </div>

              {/* Learners slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">월 활성 수강생</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent><p className="text-xs">매월 실제로 강의를 수강하는 학습자 수</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={learners}
                      onChange={(e) => {
                        const v = Math.min(5000, Math.max(10, Number(e.target.value) || 10));
                        setLearners(v);
                      }}
                      className="w-16 text-right text-lg font-bold tabular-nums bg-transparent border-b border-border focus:border-primary outline-none"
                      style={{ color: "hsl(var(--lms-primary))" }}
                      min={10}
                      max={5000}
                    />
                    <span className="text-lg font-bold" style={{ color: "hsl(var(--lms-primary))" }}>명</span>
                  </div>
                </div>
                <Slider
                  value={[learners]}
                  onValueChange={([v]) => setLearners(v)}
                  min={10}
                  max={5000}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                  <span>10명</span>
                  <span>5,000명</span>
                </div>
              </div>

              {/* Video hours slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <MonitorPlay className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">등록 영상</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent><p className="text-xs">LMS에 등록된 전체 영상의 총 시간</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={videoHours}
                      onChange={(e) => {
                        const v = Math.min(500, Math.max(1, Number(e.target.value) || 1));
                        setVideoHours(v);
                      }}
                      className="w-16 text-right text-lg font-bold tabular-nums bg-transparent border-b border-border focus:border-primary outline-none"
                      style={{ color: "hsl(var(--lms-primary))" }}
                      min={1}
                      max={500}
                    />
                    <span className="text-lg font-bold" style={{ color: "hsl(var(--lms-primary))" }}>시간</span>
                  </div>
                </div>
                <Slider
                  value={[videoHours]}
                  onValueChange={([v]) => setVideoHours(v)}
                  min={1}
                  max={500}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                  <span>1시간</span>
                  <span>500시간</span>
                </div>
              </div>

              {/* Completion rate slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">평균 완강률</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent><p className="text-xs max-w-[200px]">수강생이 전체 콘텐츠 중 평균적으로 시청하는 비율. 완강률이 높을수록 CDN 전송량이 증가합니다.</p></TooltipContent>
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
                  <span className="text-sm font-medium text-foreground">CDN 영상 호스팅 필요</span>
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
                {needsCdn
                  ? "동영상 강의를 빠르고 끊김 없이 재생하기 위한 전용 영상 서버입니다. 수강생이 많을수록 필요합니다."
                  : "YouTube·Vimeo 등 외부 플랫폼에 영상을 올리고 LMS에 링크만 연동하는 방식입니다. 별도 서버 비용이 없어 경제적입니다."}
              </p>

              {/* Estimated usage */}
              {needsCdn && (
              <div className="mt-4 rounded-xl p-3.5 bg-muted/50 text-xs text-muted-foreground space-y-1.5">
                <p className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" style={{ color: "hsl(var(--lms-primary))" }} /> 예상 월 전송량: <span className="font-semibold text-foreground">{cdnGB.toLocaleString()}GB</span></p>
                <p className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5" style={{ color: "hsl(var(--lms-primary))" }} /> 예상 저장공간: <span className="font-semibold text-foreground">{storageGB.toLocaleString()}GB</span></p>
                <p className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" style={{ color: "hsl(var(--lms-primary))" }} /> 적용 완강률: <span className="font-semibold text-foreground">{completionRate}%</span></p>
              </div>
              )}

              {/* Dedicated server recommendation */}
              {learners >= 500 && (
                <div className="mt-4 rounded-xl p-4 border bg-background" style={{ borderColor: "hsl(var(--lms-primary) / 0.25)" }}>
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--lms-primary) / 0.1)" }}>
                      <Server className="w-3.5 h-3.5" style={{ color: "hsl(var(--lms-primary))" }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground mb-1">단독서버를 권장합니다</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        월 활성 수강생 <span className="font-semibold text-foreground">{learners.toLocaleString()}명</span> 규모에서는 영상 CDN 외에도 웹 트래픽(페이지 로딩·API 호출·퀴즈·출결 등)이 상당합니다. 안정적인 서비스를 위해 공용서버 대신 <span className="font-semibold text-foreground">단독서버 구성</span>을 권장드립니다.
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3 h-3" style={{ color: "hsl(var(--lms-primary))" }} />
                          예상 웹 트래픽: 월 <span className="font-bold" style={{ color: "hsl(var(--lms-primary))" }}>{Math.round(learners * 0.8).toLocaleString()}GB</span> 이상
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Server className="w-3 h-3" style={{ color: "hsl(var(--lms-primary))" }} />
                          단독서버 추가 비용: <span className="font-bold" style={{ color: "hsl(var(--lms-primary))" }}>월 250,000원</span>
                        </span>
                      </div>
                    </div>
                  </div>
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
                    <span className="text-xs font-bold text-white/80 tracking-wider uppercase">추천 플랜</span>
                  </div>
                  <div className="flex items-end gap-3 mb-2">
                    <h3 className="font-extrabold text-white text-3xl tracking-tight">{bestPlan.name}</h3>
                    <span className="text-white/60 text-sm mb-1">{bestPlan.solutionType}</span>
                  </div>
                  <div className="flex items-end gap-1 mb-4">
                    <span className="font-extrabold text-white text-4xl tabular-nums">{formatPrice(bestPlan.totalMonthly)}</span>
                    <span className="text-white/70 text-base mb-1">원/월</span>
                  </div>
                  {(bestPlan.overageCdn > 0 || bestPlan.overageStorage > 0) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {bestPlan.overageCdn > 0 && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/90">
                          CDN 초과분 +{formatPrice(bestPlan.overageCdn)}원
                        </span>
                      )}
                      {bestPlan.overageStorage > 0 && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/90">
                          저장공간 초과분 +{formatPrice(bestPlan.overageStorage)}원
                        </span>
                      )}
                    </div>
                  )}
                  <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-white transition-all hover:scale-[1.02]" style={{ color: "hsl(var(--lms-primary))" }}>
                    이 플랜으로 상담 신청
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* All plans comparison */}
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="px-5 py-3.5 bg-muted/50 border-b border-border">
                <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">전체 플랜 비교</span>
              </div>
              <div className="divide-y divide-border">
                {recommendations.map((plan) => (
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
                      <p className="text-sm font-bold text-foreground tabular-nums">{formatPrice(plan.totalMonthly)}원</p>
                      {plan.totalMonthly > plan.monthly && (
                        <p className="text-[10px] text-muted-foreground">기본 {formatPrice(plan.monthly)} + 초과 {formatPrice(plan.totalMonthly - plan.monthly)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
              * 예상 비용은 참고용이며, 실제 비용은 사용 패턴에 따라 달라질 수 있습니다. VAT 별도.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
