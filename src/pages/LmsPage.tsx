import ContactSection from "@/components/ContactSection";
import ServiceCaseStudy from "@/components/shared/ServiceCaseStudy";


import TestimonialSection from "@/components/TestimonialSection";
import SEO, { BASE_URL } from "@/components/SEO";
import ServiceMidCTA from "@/components/shared/ServiceMidCTA";
import ServiceProcess from "@/components/shared/ServiceProcess";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import HeroPatternBg from "@/components/visuals/HeroPatternBg";
import LmsHeroOverlay from "@/components/visuals/LmsHeroOverlay";
import IndustryScenarioTabs from "@/components/lms/IndustryScenarioTabs";
import LearnerJourneyMap from "@/components/lms/LearnerJourneyMap";

import CompetitorComparison from "@/components/lms/CompetitorComparison";
import DeviceFriendlySection from "@/components/lms/DeviceFriendlySection";
import CostSimulator from "@/components/lms/CostSimulator";
import {
  Monitor, Smartphone, Tablet, Cloud, Server, Shield, Zap, Globe, Palette,
  Languages, Lock, Link2, Wrench, Brain, Subtitles, MessageSquare,
  ClipboardCheck, PenTool, Code, Search, FileCheck, Headphones,
  DollarSign, Users, Bell, GraduationCap, UserCheck, ClipboardList, Wallet,
  ShieldCheck, Plug, RefreshCw, LineChart, MonitorSmartphone, HardDrive, Paintbrush, KeyRound, Award,
  Sparkles, ArrowRight, Rocket, CreditCard, Database, Layers, HardDriveDownload, Settings, PackageCheck,
  BookOpen, Calculator
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import LmsEcosystemDialog from "@/components/LmsEcosystemDialog";
import WhyWebheadsDialog from "@/components/WhyWebheadsDialog";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import ClientMarquee from "@/components/ClientMarquee";

const lightFeatureIcons = [Zap, DollarSign, Palette, Languages, ShieldCheck, CreditCard, RefreshCw, LineChart, MonitorSmartphone, Plug, PackageCheck];
const proFeatureIcons = [Lock, Link2, Wrench, Headphones, HardDrive, Paintbrush, Server, KeyRound, CreditCard, Award];
const aiFeatureIcons = [Brain, Subtitles, FileCheck, MessageSquare];
const allInOneIcons = [Search, Monitor, Headphones, DollarSign, Users, Bell];
const kdtFeatureIcons = [Link2, UserCheck, ClipboardList, Wallet];
const processIcons = [ClipboardCheck, PenTool, Code, FileCheck, Wrench];

// ── Industry-specific Hero variants (Korean only) ──
const industryVariants: Record<string, {
  badge: string;
  title: string;
  titleHighlight: string;
  desc: string;
  cta1: string;
  highlightBadge: string | null;
}> = {
  default: {
    badge: "AI-POWERED LMS PLATFORM",
    title: "기업의 성장을\n이끄는 LMS",
    titleHighlight: "웹헤즈와 함께하세요",
    desc: "300개 이상의 기업이 선택한 이러닝 솔루션. 3일 만에 시작하는 클라우드 LMS부터 완전 맞춤형 구축까지.",
    cta1: "무료 상담 신청",
    highlightBadge: null,
  },
  university: {
    badge: "대학 · 교육기관 전용",
    title: "대학 온라인 교육의\n새로운 기준",
    titleHighlight: "평생교육원 LMS",
    desc: "KDT 정부지원훈련 공식 인증. 수강생 관리부터 수료증 발급, PG 결제까지 원스톱.",
    cta1: "대학 도입 상담",
    highlightBadge: "KDT 공식 인증",
  },
  enterprise: {
    badge: "기업 HRD · 사내교육",
    title: "사내교육 운영비\n40% 절감",
    titleHighlight: "기업교육 LMS",
    desc: "AI 학습 독려, 자동 수료 처리, 인사시스템(ERP) 연동. 대기업부터 스타트업까지.",
    cta1: "기업 도입 상담",
    highlightBadge: "평균 40% 비용 절감",
  },
  government: {
    badge: "정부기관 · 공공기관",
    title: "공공기관 인증\n이러닝 플랫폼",
    titleHighlight: "HRD 전문 LMS",
    desc: "조달청 등록 업체. 보안 인프라, 개인정보보호법 완전 준수, HRD-Net 자동 연동.",
    cta1: "공공기관 도입 상담",
    highlightBadge: "조달청 등록",
  },
};

export default function LmsPage() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const timer = setTimeout(() => {
        const el = document.getElementById(state.scrollTo!);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
      window.history.replaceState({}, "");
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const variant = useMemo(() => {
    const paramIndustry = searchParams.get("industry");
    if (paramIndustry && industryVariants[paramIndustry]) {
      try { sessionStorage.setItem("lms_industry", paramIndustry); } catch {}
      return industryVariants[paramIndustry];
    }
    try {
      const stored = sessionStorage.getItem("lms_industry");
      if (stored && industryVariants[stored]) return industryVariants[stored];
    } catch {}
    return industryVariants.default;
  }, [searchParams]);

  const isKorean = i18n.language?.startsWith("ko") ?? true;
  const useVariant = isKorean && variant !== industryVariants.default;

  const lightFeatures = (t("lms.lightFeatures", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: lightFeatureIcons[i] || Cloud }));
  const proFeatures = (t("lms.proFeatures", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: proFeatureIcons[i] || Server }));
  const aiFeatures = t("lms.aiFeatures", { returnObjects: true }) as any[];
  const allInOneFeatures = t("lms.allInOne", { returnObjects: true }) as any[];
  const kdtFeatures = (t("lms.kdtFeatures", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: kdtFeatureIcons[i] || GraduationCap }));
  const stats = t("lms.stats", { returnObjects: true }) as any[];
  const partners = t("lms.partners", { returnObjects: true }) as string[];
  const faqs = t("lms.faqs", { returnObjects: true }) as any[];
  const testimonials = t("lms.testimonials", { returnObjects: true }) as any[];
  const processSteps = (t("lms.processSteps", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: processIcons[i] || ClipboardCheck }));

  return (
    <div className="min-h-screen" style={{ background: "var(--lms-page-bg)", fontFamily: "'Noto Sans KR', 'Pretendard Variable', 'Pretendard', sans-serif" }}>
      <SEO
        title={t("lms.seo.title")}
        description={t("lms.seo.description")}
        keywords={t("lms.seo.keywords")}
        path="/"
        breadcrumb={[{ name: "LMS", url: `${BASE_URL}/` }]}
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              "@id": `${BASE_URL}/lms#software`,
              "name": "웹헤즈 LMS - 이러닝 솔루션 · 학습관리시스템",
              "alternateName": ["Webheads LMS", "웹헤즈 학습관리시스템", "AI LMS"],
              "operatingSystem": "Web, iOS, Android",
              "offers": [
                {
                  "@type": "Offer",
                  "name": "클라우드형(AI) - Starter",
                  "price": "0",
                  "priceCurrency": "KRW",
                  "description": "도입 상담 후 맞춤 견적 제공",
                  "url": `${BASE_URL}/lms`
                }
              ],
              "featureList": [
                "LMS 구축 · 학습관리시스템",
                "클라우드 LMS · 교육용 SaaS 솔루션",
                "AI 기반 학습관리 · AI LMS",
                "기업교육 LMS · 사내교육 시스템",
                "멀티 디바이스 지원 (PC, 태블릿, 모바일)",
                "비대면 교육 플랫폼",
                "다국어 지원 (11개 언어)",
                "KDT 정부지원훈련 인증 · HRD 교육시스템",
                "맞춤형 LMS 개발 · 교육플랫폼 개발",
                "B2B 교육 플랫폼",
                "24/7 고객 지원"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "300"
              },
              "provider": {
                "@id": `${BASE_URL}/#organization`
              }
            },
            {
              "@type": "Product",
              "name": "웹헤즈 LMS 구독",
              "description": "이러닝 솔루션 · 온라인 교육 플랫폼 구축 및 운영을 위한 학습관리시스템 (LMS). 클라우드 LMS, AI 기반 학습관리, 맞춤형 LMS 개발.",
              "brand": {
                "@type": "Brand",
                "name": "웹헤즈 (Webheads)"
              },
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "KRW",
                "offerCount": "2",
                "lowPrice": "0",
                "description": "웹헤즈 Light, 웹헤즈 PRO 2가지 솔루션"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "300",
                "bestRating": "5"
              }
            }
          ]
        }}
        faqJsonLd={faqs}
      />

      {/* ═══ 1. Hero ═══ */}
      <section className="relative flex items-center justify-center pt-28 pb-28 md:pt-44 md:pb-44 overflow-hidden">
        <HeroPatternBg theme="blue-purple" />
        <LmsHeroOverlay />
        <div className="container mx-auto px-5 md:px-6 relative z-10 text-center flex flex-col items-center">
          {useVariant && variant.highlightBadge && (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold mb-4" style={{ background: "hsl(45, 95%, 55%)", color: "hsl(30, 60%, 15%)" }}>
              <Award className="w-3.5 h-3.5" />
              {variant.highlightBadge}
            </span>
          )}
          <span className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase mb-6 md:mb-8" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}>
            <Sparkles className="w-4 h-4" />
            {useVariant ? variant.badge : t("lms.hero.badge")}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-[4.2rem] font-extrabold leading-[1.15] mb-5 md:mb-7 tracking-tight text-white whitespace-pre-line" style={{ wordBreak: "keep-all", textShadow: "0 4px 30px rgba(0,0,0,0.2)" }}>
            {useVariant ? variant.title : t("lms.hero.title")}
            <br />
            <span className="bg-clip-text" style={{ opacity: 0.95 }}>
              {useVariant ? variant.titleHighlight : t("lms.hero.titleHighlight")}
            </span>
          </h1>
          <p className="text-sm md:text-lg leading-[1.8] mb-8 md:mb-10 max-w-2xl" style={{ color: "rgba(255,255,255,0.8)" }}>
            {useVariant ? variant.desc : t("lms.hero.desc")}
          </p>
          <div className="flex gap-3 md:gap-4 flex-wrap justify-center">
            <a href="#contact" className="group px-7 py-3.5 rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.03] flex items-center gap-2" style={{ background: "white", color: "hsl(245, 70%, 50%)", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>
              {useVariant ? variant.cta1 : t("lms.hero.cta1")}
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#solutions" className="px-7 py-3.5 rounded-xl font-bold text-base transition-colors border border-white/30 text-white hover:bg-white/10" style={{ backdropFilter: "blur(8px)" }}>
              {t("lms.hero.cta2")}
            </a>
            <a href="#cost-simulator" className="px-7 py-3.5 rounded-xl font-bold text-base transition-all hover:scale-[1.03] flex items-center gap-2 text-white" style={{ background: "hsl(0, 55%, 50%)", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>
              <Calculator className="w-4 h-4" />
              {t("floatingNav.costSimulator")}
            </a>
          </div>
          <LmsEcosystemDialog open={ecosystemOpen} onOpenChange={setEcosystemOpen} />
          <WhyWebheadsDialog open={whyOpen} onOpenChange={setWhyOpen} />
        </div>
      </section>

      {/* ═══ 2. Stats ═══ */}
      <section className="py-12 md:py-20 relative">
        <div className="container mx-auto px-5 md:px-6 max-w-3xl lg:max-w-[55rem]">
          <div className="text-center mb-7 md:mb-10">
            <h2 className="font-bold text-foreground text-2xl md:text-3xl lg:text-4xl tracking-tight">{t("lms.statsTitle")}</h2>
          </div>
          <div className="grid grid-cols-3 gap-0 divide-x divide-border">
            {stats.map((s: any, idx: number) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-4 md:py-7 px-2 md:px-2.5 text-center">
                <span className="block font-bold leading-none mb-1.5 md:mb-2 text-2xl md:text-5xl tracking-tight" style={{ color: "hsl(var(--lms-primary))" }}>{s.value}</span>
                <span className="block text-xs md:text-sm font-semibold text-foreground mb-0.5">{s.label}</span>
                <span className="block text-[10px] md:text-xs text-muted-foreground">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. Client Marquee ═══ */}
      <ClientMarquee />

      {/* ═══ 4. Industry Scenario Tabs ═══ */}
      <IndustryScenarioTabs />


      {/* ═══ 6. All-in-One — 핵심 기능 ═══ */}
      <section className="py-16 md:py-28 bg-background">
        <div className="container mx-auto px-5 md:px-6 max-w-5xl">
          <div className="mb-10 md:mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3 md:mb-4" style={{ color: `hsl(var(--lms-primary))` }}>{t("lms.allInOneSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("lms.allInOneSection.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {allInOneFeatures.map((f: any, i: number) => {
              const Icon = allInOneIcons[i] || Search;
              return (
                <div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-all duration-200 flex flex-col gap-3 hover:shadow-md">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm">
                    <Icon className="w-5 h-5" style={{ color: `hsl(var(--lms-primary))` }} />
                  </div>
                  <h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 7. AI Features ═══ */}
      <section className="py-16 md:py-28" style={{ background: "var(--lms-section-alt)" }}>
        <div className="container mx-auto px-5 md:px-6 max-w-5xl">
          <div className="mb-10 md:mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3 md:mb-4" style={{ color: `hsl(var(--lms-primary))` }}>{t("lms.aiSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("lms.aiSection.title")}</h2>
            <p className="text-muted-foreground mt-3 md:mt-4 text-sm md:text-base">{t("lms.aiSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {aiFeatures.map((f: any, i: number) => {
              const Icon = aiFeatureIcons[i] || Brain;
              return (
                <div key={f.title} className="rounded-2xl p-6 transition-all duration-200 flex flex-col gap-3 hover:shadow-md relative overflow-hidden" style={{ background: "var(--lms-gradient-subtle)", border: `1px solid hsl(var(--lms-card-border))` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm">
                    <Icon className="w-5 h-5" style={{ color: `hsl(var(--lms-primary))` }} />
                  </div>
                  <h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 8. Device Friendly ═══ */}
      <DeviceFriendlySection />

      {/* ═══ 9. Learner Journey Map ═══ */}
      <LearnerJourneyMap />

      {/* ═══ Mid CTA #2 — 기능 확인 후 전환 유도 ═══ */}
      <ServiceMidCTA heading={t("lms.midCTA2.heading")} description={t("lms.midCTA2.description")} ctaText={t("lms.midCTA2.ctaText")} />

      {/* ═══ 10. Solutions — Light vs PRO ═══ */}
      <section id="solutions" className="py-16 md:py-28 bg-background">
        <div className="container mx-auto px-5 md:px-6 max-w-7xl">
          <div className="mb-10 md:mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3 md:mb-4" style={{ color: `hsl(var(--lms-primary))` }}>{t("lms.solutionsSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("lms.solutionsSection.title")}</h2>
            <p className="text-muted-foreground mt-3 md:mt-4 text-sm md:text-base">{t("lms.solutionsSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Webheads Light */}
            <div className="rounded-3xl p-8 bg-background flex flex-col h-full transition-all duration-200 hover:-translate-y-1" style={{ border: "1px solid hsl(var(--border) / 0.5)", boxShadow: "0 4px 30px -8px hsl(var(--foreground) / 0.06)" }}>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "hsl(245, 60%, 95%)" }}>
                  <Cloud className="w-6 h-6" style={{ color: "hsl(245, 58%, 55%)" }} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-xl tracking-tight">{t("lms.light.name")}</h3>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: "hsl(245, 58%, 55%)" }}>{t("lms.light.subtitle")}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{t("lms.light.desc")}</p>
              <div className="flex flex-col gap-4 flex-1">
                {lightFeatures.map((f: any) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: "hsl(245, 60%, 95%)" }}>
                      <f.icon className="w-3.5 h-3.5" style={{ color: "hsl(245, 58%, 55%)" }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground leading-snug">{f.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#contact" className="block text-center mt-8 py-3.5 rounded-full font-bold text-sm transition-all duration-200 text-white hover:opacity-90 hover:shadow-lg" style={{ background: "hsl(245, 58%, 55%)" }}>
                {t("lms.light.cta")}
              </a>
            </div>

            {/* Webheads PRO */}
            <div className="rounded-3xl p-8 bg-background flex flex-col h-full transition-all duration-200 hover:-translate-y-1" style={{ border: "1px solid hsl(var(--border) / 0.5)", boxShadow: "0 4px 30px -8px hsl(var(--foreground) / 0.06)" }}>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "hsl(215, 70%, 94%)" }}>
                  <Server className="w-6 h-6" style={{ color: "hsl(215, 65%, 48%)" }} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-xl tracking-tight">{t("lms.pro.name")}</h3>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: "hsl(215, 65%, 48%)" }}>{t("lms.pro.subtitle")}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{t("lms.pro.desc")}</p>
              <div className="flex flex-col gap-4 flex-1">
                {proFeatures.map((f: any) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: "hsl(215, 70%, 94%)" }}>
                      <f.icon className="w-3.5 h-3.5" style={{ color: "hsl(215, 65%, 48%)" }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground leading-snug">{f.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#contact" className="block text-center mt-8 py-3.5 rounded-full font-bold text-sm transition-all duration-200 text-white hover:opacity-90 hover:shadow-lg" style={{ background: "hsl(215, 65%, 48%)" }}>
                {t("lms.pro.cta")}
              </a>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-12">
            <h3 className="font-bold text-foreground text-xl md:text-2xl lg:text-3xl tracking-tight mb-3">{t("lms.comparisonTable.title")}</h3>
            <p className="text-muted-foreground text-xs md:text-sm mb-6 md:mb-8">{t("lms.comparisonTable.desc")}</p>
            <div className="rounded-2xl border border-border overflow-hidden bg-background">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border" style={{ background: "var(--lms-gradient-subtle)" }}>
                      {(t("lms.comparisonTable.headers", { returnObjects: true }) as string[]).map((header, i) => (
                        <th key={i} className={`px-5 py-4 text-left font-bold text-foreground whitespace-nowrap ${i === 0 ? "min-w-[120px]" : "min-w-[180px]"}`}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(t("lms.comparisonTable.rows", { returnObjects: true }) as string[][]).map((row, rowIdx) => (
                      <tr key={rowIdx} className={`border-b border-border last:border-0 ${rowIdx % 2 === 1 ? "bg-muted/30" : ""}`}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className={`px-5 py-3.5 ${cellIdx === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* KDT Summary */}
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 rounded-2xl border border-border p-5 md:p-6 bg-background">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(145, 70%, 93%)" }}>
                <GraduationCap className="w-5 h-5" style={{ color: "hsl(145, 60%, 38%)" }} />
              </div>
              <h4 className="font-bold text-foreground text-base">{t("lms.kdt.name")}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1" style={{ wordBreak: "keep-all" }}>{t("lms.kdt.summary")}</p>
            <a href="#contact" className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90" style={{ background: "hsl(145, 60%, 38%)" }}>
              {t("lms.kdt.ctaShort")}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══ 11. Competitor Comparison ═══ */}
      <CompetitorComparison />

      {/* ═══ Cost Simulator ═══ */}
      <CostSimulator />

      {/* ═══ 12. Plans — 요금제 ═══ */}
      <section id="plans" className="py-16 md:py-28" style={{ background: "linear-gradient(180deg, hsl(245, 30%, 96%) 0%, hsl(245, 20%, 93%) 100%)" }}>
        <div className="container mx-auto px-5 md:px-6 max-w-6xl">
          <div className="mb-10 md:mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3 md:mb-4" style={{ color: "hsl(var(--lms-primary))" }}>{t("lms.plansSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("lms.plansSection.title")}</h2>
            <p className="text-muted-foreground mt-3 md:mt-4 text-sm md:text-base">{t("lms.plansSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {(t("lms.plans", { returnObjects: true }) as any[]).map((plan: any) => (
              <div key={plan.name} className={`relative rounded-3xl flex flex-col gap-0 transition-all duration-200 overflow-hidden ${plan.highlight ? "bg-background border-2 shadow-xl scale-[1.02]" : "bg-background border border-border hover:border-muted-foreground/30 hover:shadow-md"}`} style={plan.highlight ? { borderColor: "hsl(var(--lms-primary))" } : undefined}>
                {plan.badge && <div className="text-sm font-bold text-center py-2.5 tracking-wide text-white" style={{ background: "hsl(var(--lms-primary))" }}>{plan.badge}</div>}
                <div className="p-8 flex flex-col gap-5 flex-1">
                  <div>
                    <h3 className={`font-bold text-3xl tracking-tight ${plan.highlight ? "" : "text-foreground"}`} style={plan.highlight ? { color: "hsl(var(--lms-primary))" } : undefined}>{plan.name}</h3>
                    {plan.solutionType && <p className="text-xs font-medium text-muted-foreground mt-1.5 tracking-wide min-h-[32px]">{plan.solutionType}</p>}
                    <div className={`h-px mt-4 ${plan.highlight ? "opacity-20" : "bg-border"}`} style={plan.highlight ? { background: "hsl(var(--lms-primary))" } : undefined} />
                  </div>
                  <div>
                    <div className="flex items-end gap-1">
                      <span className={`font-bold leading-none tracking-tight text-4xl ${plan.highlight ? "" : "text-foreground"}`} style={plan.highlight ? { color: "hsl(var(--lms-primary))" } : undefined}>{plan.price}</span>
                      {plan.unit && <span className="text-base font-semibold text-muted-foreground mb-1">{plan.unit}</span>}
                    </div>
                    {plan.priceNote && <p className="text-sm text-muted-foreground mt-1.5">{plan.priceNote}</p>}
                  </div>
                  <ul className="flex flex-col gap-3.5 flex-1">
                    {plan.features.map((f: any) => (
                      <li key={f.main} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5 text-sm" style={{ color: "hsl(var(--lms-primary))" }}>✓</span>
                        <div>
                          <p className="text-base font-medium text-foreground leading-tight">{f.main}</p>
                          {f.sub && <p className="text-sm text-muted-foreground mt-0.5">{f.sub}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-xl p-4 mt-2 bg-foreground">
                    <p className="text-sm text-background/60 leading-relaxed text-center">{plan.recommend}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 rounded-xl border border-border bg-muted px-6 py-4">
            <p className="text-foreground font-semibold text-sm">{t("lms.plansCustom.title")} <span className="font-normal text-muted-foreground">{t("lms.plansCustom.desc")}</span></p>
            <a href="#contact" className="shrink-0 inline-flex px-5 py-2.5 rounded-2xl font-bold text-xs text-white transition-colors hover:opacity-90" style={{ background: "hsl(var(--lms-primary))" }}>{t("lms.plansCustom.cta")}</a>
          </div>
        </div>
      </section>

      {/* ═══ Mid CTA #3 — 요금제 확인 후 최종 전환 ═══ */}
      <ServiceMidCTA heading={t("lms.midCTA.heading")} description={t("lms.midCTA.description")} ctaText={t("lms.midCTA.ctaText")} />

      {/* ═══ Case Studies — 도입 사례 ═══ */}
      <ServiceCaseStudy
        subheading={t("lms.caseStudy.sub")}
        heading={t("lms.caseStudy.heading")}
        description={t("lms.caseStudy.desc")}
        cases={t("lms.caseStudy.cases", { returnObjects: true }) as any[]}
      />

      {/* ═══ 13. Process ═══ */}
      <ServiceProcess
        steps={processSteps}
        heading={t("lms.processSection.heading")}
        subheading={t("lms.processSection.sub")}
        description={t("lms.processSection.desc")}
      />

      {/* ═══ 14. Testimonials ═══ */}
      <TestimonialSection testimonials={testimonials} />

      {/* ═══ 15. FAQ ═══ */}
      <ServiceFAQ faqs={faqs} serviceName={t("lms.seo.title")} />

      {/* ═══ 16. Contact ═══ */}
      <ContactSection showDemo />

      {/* <ExitIntentPopup /> */}
    </div>
  );
}
