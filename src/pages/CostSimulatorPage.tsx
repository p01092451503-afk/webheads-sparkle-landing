import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import HeroPatternBg from "@/components/visuals/HeroPatternBg";
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

/* ── Plan data (shared with CostSimulator) ── */
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

/* ── Plan feature comparison data ── */
const PLAN_FEATURES: { feature: string; basic: string; plus: string; premium: string; type?: "check" | "text" | "highlight" }[] = [
  { feature: "기본 전송량", basic: "500GB/월", plus: "1,500GB/월", premium: "2,000GB/월" },
  { feature: "저장공간", basic: "100GB", plus: "200GB", premium: "250GB" },
  { feature: "서버 형태", basic: "임대형", plus: "임대형 · SaaS · 단독서버", premium: "임대형 · SaaS · 단독서버" },
  { feature: "AI 챗봇 포함", basic: "✓", plus: "✓", premium: "✓", type: "check" },
  { feature: "모바일 앱 (iOS/Android)", basic: "—", plus: "✓", premium: "✓", type: "check" },
  { feature: "DRM 보안 플레이어", basic: "옵션", plus: "옵션", premium: "기본 포함", type: "highlight" },
  { feature: "전담 매니저 배정", basic: "—", plus: "✓", premium: "✓ 24/7", type: "check" },
  { feature: "PG(결제) 연동", basic: "✓", plus: "✓", premium: "✓", type: "check" },
  { feature: "채널톡 / SMS 통합", basic: "옵션", plus: "✓", premium: "✓", type: "check" },
  { feature: "SLA 가동률 보장", basic: "99.5%", plus: "99.9%", premium: "99.99%" },
];

const COMPARISON_DATA = [
  { feature: "CDN 전송 단가(GB당)", webheads: "300~500원", competitor: "700~1,200원" },
  { feature: "보안 플레이어(DRM)", webheads: "옵션 선택 가능", competitor: "필수 유료 포함" },
  { feature: "초기 세팅비", webheads: "이벤트 무료", competitor: "50~200만 원" },
  { feature: "24시간 모니터링", webheads: "✓ 기본 제공", competitor: "유료 또는 미제공" },
  { feature: "숨은 비용", webheads: "없음", competitor: "트래픽 초과, 유지보수비 등" },
  { feature: "고객 유지율", webheads: "92.6%", competitor: "업계 평균 60~70%" },
];

const SUCCESS_CASES = [
  { scale: "50~200명", industry: "전문직 교육원", org: "A 법률교육원", plan: "Basic", result: "월 수강료 수익 350만 원 달성, 운영비 40% 절감" },
  { scale: "200~500명", industry: "기업 사내교육", org: "B 제조그룹", plan: "Plus", result: "교육 완료율 78% → 94%로 향상, 연간 교육비 2,400만 원 절감" },
  { scale: "500명 이상", industry: "공공기관", org: "C 공공교육센터", plan: "Premium", result: "동시접속 3,000명 안정 운영, 기존 대비 운영비 55% 절감" },
];

export default function CostSimulatorPage() {
  const [learners, setLearners] = useState(200);
  const [storageInput, setStorageInput] = useState(20);
  const [completionRate, setCompletionRate] = useState(70);
  const [needsCdn, setNeedsCdn] = useState(true);
  const [needsSecurePlayer, setNeedsSecurePlayer] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [needsDedicatedServer, setNeedsDedicatedServer] = useState(false);
  const [showAnnualBonus, setShowAnnualBonus] = useState(false);
  const [formData, setFormData] = useState({ company: "", contact: "", email: "" });

  const handleLearnersChange = (v: number) => { setLearners(v); if (v < 500) setNeedsDedicatedServer(false); };

  const { cdnGB, storageGB } = useMemo(() => estimateUsage(learners, storageInput, completionRate), [learners, storageInput, completionRate]);

  const recommendations = useMemo<PlanRecommendation[]>(() =>
    PLAN_DEFS.map((plan) => {
      const solutionType = plan.typeKey === "starter" ? "임대형 · CDN 없음" : plan.typeKey === "basic" ? "임대형 · CDN 포함" : plan.typeKey === "plus" ? "임대형 · SaaS | 단독서버" : "구축형 · PRO";
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
  [cdnGB, storageGB, needsCdn, needsSecurePlayer, needsDedicatedServer, learners]);

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
    return { fromPlan: bestPlan.name, toPlan: nextName, diff, benefit: `데이터 전송량이 ${cdnMultiple.toFixed(0)}배 늘어납니다` };
  }, [bestPlan, recommendations, needsCdn]);

  // Annual bonus popup
  useEffect(() => {
    if (isAnnual) { setShowAnnualBonus(true); const t = setTimeout(() => setShowAnnualBonus(false), 5000); return () => clearTimeout(t); }
    else setShowAnnualBonus(false);
  }, [isAnnual]);

  const formatPrice = (n: number) => n.toLocaleString("ko-KR");
  const displayMonthly = bestPlan ? (isAnnual ? Math.round(bestPlan.totalMonthly * (1 - ANNUAL_DISCOUNT)) : bestPlan.totalMonthly) : 0;

  // Matched success case
  const matchedCase = SUCCESS_CASES.find(c => {
    if (learners < 200) return c.scale === "50~200명";
    if (learners < 500) return c.scale === "200~500명";
    return c.scale === "500명 이상";
  });

  const competitorEstimate = displayMonthly > 0 ? Math.round(displayMonthly * 1.3) : 0;
  const savingsAmount = competitorEstimate - displayMonthly;

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Pretendard Variable', 'Noto Sans KR', sans-serif" }}>
      <SEO
        title="LMS 요금 계산기 — 10초 만에 견적 확인"
        description="월 수강생 수와 동영상 용량을 입력하면 최적의 LMS 요금제와 예상 비용을 즉시 확인할 수 있습니다. 16년 경험의 웹헤즈가 제안하는 거품 뺀 진짜 견적."
        keywords="LMS 요금, LMS 비용, LMS 가격 비교, 이러닝 플랫폼 요금, 온라인 교육 비용, LMS 견적"
        path="/cost-simulator"
        breadcrumb={[{ name: "LMS 요금 계산기", url: `${BASE_URL}/cost-simulator` }]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "웹헤즈 LMS 요금 계산기",
          "applicationCategory": "BusinessApplication",
          "description": "LMS 요금을 실시간으로 시뮬레이션하고 최적의 플랜을 찾아보세요.",
          "provider": { "@type": "Organization", "name": "WEBHEADS (웹헤즈)" },
          "url": `${BASE_URL}/cost-simulator`
        }}
      />

      {/* ═══ HERO ═══ */}
      <section className="relative flex items-center justify-center pt-28 pb-28 md:pt-44 md:pb-44 overflow-hidden">
        <HeroPatternBg theme="blue-purple" />
        <LmsHeroOverlay />
        <div className="container mx-auto px-5 md:px-6 max-w-4xl relative z-10 text-center flex flex-col items-center">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold tracking-wide mb-6 md:mb-8 animate-bounce" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", color: "#5D45FF", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <Zap className="w-4 h-4" style={{ color: "#FF6B00" }} />
            3월 한정: 연간 계약 시 2개월 무료 + 초기 세팅비 0원
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-[4.2rem] font-extrabold leading-[1.15] mb-5 md:mb-7 tracking-tight text-white" style={{ wordBreak: "keep-all", textShadow: "0 4px 30px rgba(0,0,0,0.2)" }}>
            추측하지 마세요.
            <br />
            <span className="bg-clip-text" style={{ opacity: 0.95 }}>
              데이터로 설계하는 가장 효율적인 LMS 예산.
            </span>
          </h1>
          <p className="text-sm md:text-lg leading-[1.8] mb-8 md:mb-10 max-w-2xl" style={{ color: "rgba(255,255,255,0.8)" }}>
            국내 최저 수준의 CDN 단가와 16년 운영 노하우를 결합했습니다.<br className="hidden sm:block" />
            숨은 비용 없는 정직한 견적을 10초 만에 확인하세요.
          </p>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>이미 <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 700 }}>300+</span> 기업이 이 시뮬레이터로 최적의 플랜을 찾았습니다.</p>
          <div className="flex gap-3 md:gap-4 flex-wrap justify-center">
            <a href="#simulator" className="group px-7 py-3.5 rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.03] flex items-center gap-2" style={{ background: "#FF6B00", color: "white", boxShadow: "0 8px 30px rgba(255,107,0,0.3)" }}>
              지금 견적 확인하기
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#lead-capture" className="px-7 py-3.5 rounded-xl font-bold text-base transition-colors border border-white/30 text-white hover:bg-white/10" style={{ backdropFilter: "blur(8px)" }}>
              무료 제안서 받기
            </a>
          </div>

          {/* Trust stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-14 mt-10 md:mt-14">
            {["16년 LMS 전문", "300+ 고객사", "92.6% 유지율", "숨은 비용 0원"].map((label) => (
              <span key={label} className="text-sm md:text-base font-semibold text-white/60">{label}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SIMULATOR ═══ */}
      <section id="simulator" className="py-16 md:py-24" style={{ background: "#F8F9FD" }}>
        <div className="container mx-auto px-5 md:px-6 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "#5D45FF" }}>COST SIMULATOR</p>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight" style={{ wordBreak: "keep-all" }}>
              우리 회사 규모에 적당한 요금제는?
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
              월 수강생 수와 동영상 용량, 평균 완강률을 입력하면, 예상 비용과 최적 플랜을 즉시 확인할 수 있어요.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
            {/* ── Left: Inputs ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="rounded-2xl border border-border p-5 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Calculator className="w-5 h-5" style={{ color: "#5D45FF" }} />
                  <h3 className="font-bold text-foreground text-base">규모 입력</h3>
                </div>

                {/* Learners */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">월 활성 수강생</span>
                      <TooltipProvider><Tooltip><TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent><p className="text-xs">한 달 동안 1개 이상의 강의를 수강한 고유 학습자 수</p></TooltipContent></Tooltip></TooltipProvider>
                    </div>
                    <div className="flex items-center gap-1">
                      <input type="number" value={learners} onChange={(e) => handleLearnersChange(Math.min(2000, Math.max(10, Number(e.target.value) || 10)))} className="w-14 text-right text-base font-bold tabular-nums bg-transparent border-b border-border focus:border-primary outline-none" style={{ color: "#5D45FF" }} min={10} max={2000} />
                      <span className="text-base font-bold" style={{ color: "#5D45FF" }}>명</span>
                    </div>
                  </div>
                  <Slider value={[learners]} onValueChange={([v]) => handleLearnersChange(v)} min={10} max={2000} step={10} className="w-full" />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>10명</span><span>2,000명</span></div>
                </div>

                {/* Storage */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">동영상 용량</span>
                      <TooltipProvider><Tooltip><TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent><p className="text-xs max-w-[220px]">업로드할 동영상 파일의 총 용량</p></TooltipContent></Tooltip></TooltipProvider>
                    </div>
                    <div className="flex items-center gap-1">
                      <input type="number" value={storageInput} onChange={(e) => setStorageInput(Math.min(500, Math.max(1, Number(e.target.value) || 1)))} className="w-14 text-right text-base font-bold tabular-nums bg-transparent border-b border-border focus:border-primary outline-none" style={{ color: "#5D45FF" }} min={1} max={500} />
                      <span className="text-base font-bold" style={{ color: "#5D45FF" }}>GB</span>
                    </div>
                  </div>
                  <Slider value={[storageInput]} onValueChange={([v]) => setStorageInput(v)} min={1} max={500} step={1} className="w-full" />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>1GB</span><span>500GB</span></div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">참고: 일반화질(SD) 30분 강의 약 {Math.round(storageInput / 0.3)}개 분량</p>
                </div>

                {/* Completion */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">평균 완강률</span>
                      <TooltipProvider><Tooltip><TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent><p className="text-xs">수강생들의 평균 강의 완료 비율</p></TooltipContent></Tooltip></TooltipProvider>
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
                {renderToggle("CDN 영상 호스팅 필요", <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />, needsCdn, () => setNeedsCdn(!needsCdn))}
                <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">{needsCdn ? "동영상 강의를 빠르고 끊김 없이 재생하기 위한 전용 영상 서버입니다." : "CDN 없이 자체 서버에서 영상을 제공합니다."}</p>

                {needsCdn && (
                  <>
                    {renderToggle("보안 플레이어 (DRM)", <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />, needsSecurePlayer, () => setNeedsSecurePlayer(!needsSecurePlayer))}
                    <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">{needsSecurePlayer ? "영상 다운로드 방지 및 불법 복제 차단이 활성화됩니다." : "영상 다운로드 방지 및 불법 복제 차단이 필요한 경우 활성화하세요."}</p>
                  </>
                )}

                {learners >= 500 && (
                  <>
                    {renderToggle("단독 서버 구성", <Server className="w-3.5 h-3.5 text-muted-foreground" />, needsDedicatedServer, () => setNeedsDedicatedServer(!needsDedicatedServer))}
                    <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">500명 이상 대규모 트래픽에 최적화된 전용 서버를 구성합니다.</p>
                  </>
                )}

                {renderToggle("연간 계약 (10% 할인)", <CalendarCheck className="w-3.5 h-3.5 text-muted-foreground" />, isAnnual, () => setIsAnnual(!isAnnual))}
                <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">{isAnnual ? "연간 계약이 적용되어 월별 대비 10% 할인됩니다." : "연간 계약을 선택하면 월별 대비 10% 할인된 금액으로 이용할 수 있습니다."}</p>

                {/* Estimated usage */}
                {needsCdn && (
                  <div className="mt-3 rounded-xl p-3 text-xs text-muted-foreground space-y-1" style={{ background: "#f0eeff" }}>
                    <p className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" style={{ color: "#5D45FF" }} /> 예상 월 전송량: <span className="font-semibold text-foreground">{cdnGB.toLocaleString()}GB</span></p>
                    <p className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5" style={{ color: "#5D45FF" }} /> 예상 저장공간: <span className="font-semibold text-foreground">{storageGB.toLocaleString()}GB</span></p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Results ── */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {bestPlan && (
                <div className="rounded-2xl p-6 relative overflow-hidden shadow-xl" style={{ background: "hsl(255, 75%, 58%)" }}>
                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 rounded-2xl" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-white/80" />
                      <span className="text-xs font-bold text-white/80 tracking-wider uppercase">추천 플랜</span>
                    </div>
                    <div className="flex items-end gap-3 mb-1">
                      <h3 className="font-extrabold text-white text-3xl tracking-tight">{bestPlan.name}</h3>
                      <span className="text-white/60 text-sm mb-1">{bestPlan.solutionType}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-white/50 mb-2 tracking-wide">
                      {bestPlan.cdnIncluded > 0 ? `기본 전송량 ${bestPlan.cdnIncluded.toLocaleString()}GB · 저장공간 ${bestPlan.storageIncluded}GB` : "CDN 별도"}
                    </p>

                    <div className="flex items-end gap-1 mb-1">
                      <span className="font-extrabold text-white text-4xl tabular-nums"><AnimatedPrice value={displayMonthly} /></span>
                      <span className="text-white/70 text-base mb-1">원/월</span>
                    </div>

                    {isAnnual && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-white/50 line-through tabular-nums">{formatPrice(bestPlan.totalMonthly)}원/월</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "#00C896", color: "white" }}>10% 할인</span>
                      </div>
                    )}

                    {/* Savings label */}
                    {savingsAmount > 0 && (
                      <div className="flex items-center gap-2 mt-3 mb-4 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                        <TrendingUp className="w-5 h-5 shrink-0" style={{ color: "#4ade80" }} />
                        <span className="text-base font-extrabold" style={{ color: "#4ade80" }}>타사 대비 월 약 {formatPrice(savingsAmount)}원 절감 효과</span>
                      </div>
                    )}

                    {/* Overage tags */}
                    {(bestPlan.overageCdn > 0 || bestPlan.overageStorage > 0 || needsSecurePlayer || (needsDedicatedServer && learners >= 500)) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {bestPlan.overageCdn > 0 && <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/90">CDN 초과분 +{formatPrice(bestPlan.overageCdn)}원</span>}
                        {bestPlan.overageStorage > 0 && <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/90">저장 초과분 +{formatPrice(bestPlan.overageStorage)}원</span>}
                        {needsSecurePlayer && bestPlan.name !== "Starter" && <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/90">보안 플레이어 +{formatPrice(SECURE_PLAYER_COST)}원</span>}
                        {needsDedicatedServer && learners >= 500 && <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/90">단독 서버 +{formatPrice(DEDICATED_SERVER_COST)}원</span>}
                      </div>
                    )}

                    <a href="#lead-capture" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] shadow-lg" style={{ background: "#FF6B00", color: "white" }}>
                      지금 이 견적으로 무료 컨설팅 신청하기 <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}

              {/* Annual bonus popup */}
              {showAnnualBonus && (
                <div className="rounded-2xl border-2 p-4 relative animate-in slide-in-from-top-2 duration-300" style={{ borderColor: "#00C896", background: "linear-gradient(135deg, #f0fdf9, #ecfdf5)" }}>
                  <button onClick={() => setShowAnnualBonus(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#00C896" }}>
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm mb-1">🎉 연간 계약 특별 혜택</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">연간 결제 시 <span className="font-bold" style={{ color: "#00C896" }}>2개월 추가 연장</span> 또는 <span className="font-bold" style={{ color: "#00C896" }}>교육용 태블릿 증정</span> 혜택을 선택하실 수 있습니다. (3월 한정)</p>
                    </div>
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
                    <p className="text-sm font-bold text-foreground mb-1">{upgradeNudge.toPlan} 플랜이 더 경제적입니다</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      지금 <span className="font-bold" style={{ color: "#5D45FF" }}>{formatPrice(upgradeNudge.diff)}원만 추가</span>하면 {upgradeNudge.benefit}. {upgradeNudge.toPlan} 플랜을 고려해 보세요.
                    </p>
                  </div>
                </div>
              )}

              {/* All plans comparison */}
              <div className="rounded-2xl border border-border overflow-hidden bg-white shadow-sm">
                <div className="px-5 py-3.5 bg-muted/50 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">전체 플랜 비교</span>
                  {isAnnual && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#00C896" }}>연간 할인 적용됨</span>}
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
                            <p className="text-[10px] text-muted-foreground/60">{plan.cdnIncluded > 0 ? `기본 전송량 ${plan.cdnIncluded.toLocaleString()}GB · 저장공간 ${plan.storageIncluded}GB` : "CDN 별도"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground tabular-nums">{formatPrice(discounted)}원/월</p>
                          {isAnnual && <p className="text-[10px] text-muted-foreground line-through tabular-nums">{formatPrice(plan.totalMonthly)}원</p>}
                          {!isAnnual && plan.totalMonthly > plan.monthly && <p className="text-[10px] text-muted-foreground">기본 {formatPrice(plan.monthly)} + 초과 {formatPrice(plan.totalMonthly - plan.monthly)}</p>}
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2 text-center" style={{ wordBreak: "keep-all" }}>플랜별 핵심 기능 비교</h2>
          <p className="text-sm text-muted-foreground text-center mb-10">가격 차이가 왜 발생하는지, 기능적으로 확인해보세요.</p>

          <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#1e1b4b" }}>
                    <th className="text-left px-5 py-4 font-semibold text-white/60 text-xs w-[30%]">기능 / 항목</th>
                    {(["Basic", "Plus", "Premium"] as const).map(p => {
                      const isRecommended = bestPlan?.name === p;
                      return (
                        <th key={p} className="text-center px-5 py-4 text-sm font-bold" style={isRecommended ? { background: "#5D45FF", color: "white" } : { color: "white" }}>
                          {p}
                          {isRecommended && <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: "#FEE500", color: "#1e1b4b" }}>추천</span>}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {PLAN_FEATURES.map(({ feature, basic, plus, premium, type }) => {
                    const values = { Basic: basic, Plus: plus, Premium: premium };
                    return (
                      <tr key={feature} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-4 font-medium text-foreground text-[13px]">{feature}</td>
                        {(["Basic", "Plus", "Premium"] as const).map(p => {
                          const val = values[p];
                          const isRec = bestPlan?.name === p;
                          const isCheck = val === "✓" || val.startsWith("✓");
                          const isHighlight = type === "highlight" && val === "기본 포함";
                          return (
                            <td key={p} className="px-5 py-4 text-center text-[13px]" style={isRec ? { background: "rgba(93,69,255,0.03)" } : undefined}>
                              {isCheck ? (
                                <span className="inline-flex items-center justify-center gap-1 font-semibold" style={{ color: "#00C896" }}>
                                  <CheckCircle className="w-4 h-4" />
                                  {val !== "✓" && <span>{val.replace("✓ ", "")}</span>}
                                </span>
                              ) : val === "—" ? (
                                <span className="text-muted-foreground">—</span>
                              ) : isHighlight ? (
                                <span className="font-bold" style={{ color: "#00C896" }}>{val}</span>
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
                    <td className="px-5 py-6 font-semibold text-muted-foreground text-[13px]">월 기본 요금 (VAT 별도)</td>
                    {([
                      { name: "Basic", price: 500000, sub: "+ 초과 사용량" },
                      { name: "Plus", price: 700000, sub: "+ 초과 사용량" },
                      { name: "Premium", price: 1000000, sub: "맞춤 견적" },
                    ] as const).map(({ name, price, sub }) => {
                      const isRec = bestPlan?.name === name;
                      return (
                        <td key={name} className="px-5 py-6 text-center" style={isRec ? { background: "rgba(93,69,255,0.06)" } : undefined}>
                          <p className="font-extrabold text-xl tabular-nums tracking-tight text-foreground">{formatPrice(price)}<span className="text-sm font-bold">원</span></p>
                          <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>
                          {isRec ? (
                            <a href="#lead-capture" className="inline-flex items-center gap-1.5 mt-3 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:scale-[1.02]" style={{ background: "#5D45FF" }}>
                              이 플랜 신청 <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <a href="#lead-capture" className="inline-flex items-center gap-1.5 mt-3 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-foreground border border-border transition-all hover:bg-muted/50">
                              {name === "Premium" ? "견적 요청" : "문의하기"}
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

      {/* ═══ TRANSPARENCY ═══ */}
      <section className="py-16 md:py-20" style={{ background: "#F8F9FD" }}>
        <div className="container mx-auto px-5 md:px-6 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(0,200,150,0.1)" }}>
            <Shield className="w-4 h-4" style={{ color: "#00C896" }} />
            <span className="text-sm font-bold" style={{ color: "#00C896" }}>숨은 비용 제로 선언</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-4" style={{ wordBreak: "keep-all" }}>
            다른 곳에서 유료인 것, 웹헤즈는 다릅니다
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-10">
            LMS 도입 후 예상치 못한 추가 과금으로 고민하지 않도록, 모든 비용을 사전에 투명하게 안내합니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, title: "보안 플레이어(DRM)", desc: "타사는 필수 유료, 웹헤즈는 선택적 추가 — 불필요한 비용 없음" },
              { icon: Zap, title: "초기 세팅비 0원", desc: "이벤트 기간 중 초기 세팅비 완전 무료로 부담 없이 시작" },
              { icon: Headphones, title: "24시간 모니터링", desc: "별도 비용 없이 서버 상태를 24/7 모니터링하여 안정 운영" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl p-6 bg-white border border-border shadow-sm text-left">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(0,200,150,0.1)" }}>
                  <Icon className="w-5 h-5" style={{ color: "#00C896" }} />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPETITOR COMPARISON ═══ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-5 md:px-6 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2 text-center">웹헤즈 vs. 타사 비교</h2>
          <p className="text-sm text-muted-foreground text-center mb-10">같은 조건, 다른 결과. 핵심 항목을 비교해 보세요.</p>
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border" style={{ background: "#F8F9FD" }}>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs">비교 항목</th>
                  <th className="text-center px-5 py-3 font-bold text-xs" style={{ color: "#5D45FF" }}>웹헤즈</th>
                  <th className="text-center px-5 py-3 font-semibold text-muted-foreground text-xs">타사 평균</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COMPARISON_DATA.map(({ feature, webheads, competitor }) => (
                  <tr key={feature} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-foreground text-[13px]">{feature}</td>
                    <td className="px-5 py-3.5 text-center font-semibold text-[13px]" style={{ color: "#5D45FF" }}>
                      <div className="flex items-center justify-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" style={{ color: "#00C896" }} />
                        {webheads}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center text-muted-foreground text-[13px]">{competitor}</td>
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2 text-center">규모 맞춤형 성공 사례</h2>
          <p className="text-sm text-muted-foreground text-center mb-10">
            고객님과 비슷한 규모의 기업들은 어떤 플랜을 선택했을까요?
          </p>
          <div className="space-y-4">
            {SUCCESS_CASES.map((c, i) => (
              <div key={c.org} className={`rounded-2xl p-6 bg-white border-2 transition-all ${matchedCase === c ? "shadow-lg" : "border-border"}`} style={matchedCase === c ? { borderColor: "#5D45FF" } : undefined}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#5D45FF" }}>{c.scale}</span>
                      <span className="text-xs text-muted-foreground">{c.industry}</span>
                      {matchedCase === c && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,0,0.1)", color: "#FF6B00" }}>현재 규모와 유사</span>}
                    </div>
                    <h3 className="font-bold text-foreground text-base mb-1">{c.org}</h3>
                    <p className="text-sm text-muted-foreground">{c.result}</p>
                  </div>
                  <div className="shrink-0 text-center px-4">
                    <span className="text-xs text-muted-foreground">선택 플랜</span>
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
          <h3 className="font-bold text-white text-2xl tracking-tight mb-3">계산된 결과가 예산에 맞지 않으신가요?</h3>
          <p className="text-white/60 text-sm mb-8 max-w-xl mx-auto">전문가가 비용을 더 줄일 수 있는 최적화 컨설팅을 도와드립니다.</p>
          <a href="#lead-capture" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02]" style={{ background: "#FF6B00", color: "white" }}>
            전문가에게 견적서 PDF 받기 <FileText className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ═══ LEAD CAPTURE ═══ */}
      <section id="lead-capture" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-5 md:px-6 max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-3" style={{ wordBreak: "keep-all" }}>
              확인하신 견적서 PDF와<br />'성공 로드맵'을 보내드립니다
            </h2>
            <p className="text-sm text-muted-foreground">
              {bestPlan && <>현재 시뮬레이션 결과: <span className="font-bold" style={{ color: "#5D45FF" }}>{bestPlan.name} 플랜 · 월 {formatPrice(displayMonthly)}원</span></>}
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = "/lms#contact"; }}>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">회사명</label>
              <input type="text" value={formData.company} onChange={(e) => setFormData(p => ({ ...p, company: e.target.value }))} placeholder="(주)웹헤즈" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">담당자 연락처</label>
                <input type="tel" value={formData.contact} onChange={(e) => setFormData(p => ({ ...p, contact: e.target.value }))} placeholder="010-1234-5678" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">이메일</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="info@company.co.kr" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 transition-all" required />
              </div>
            </div>
            <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.01] shadow-lg" style={{ background: "#FF6B00" }}>
              무료 제안서 받기
            </button>
            <p className="text-[11px] text-muted-foreground text-center">제출 시 개인정보 처리방침에 동의한 것으로 간주됩니다.</p>
          </form>
        </div>
      </section>

      {/* ═══ FLOATING KAKAO BUTTON ═══ */}
      <a
        href="https://pf.kakao.com/_xjVxbxj/chat"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-xl transition-all hover:scale-105"
        style={{ background: "#FEE500", color: "#3C1E1E" }}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-bold text-sm hidden sm:inline">카카오톡 상담</span>
      </a>
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
