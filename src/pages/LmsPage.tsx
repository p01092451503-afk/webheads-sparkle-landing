import ContactSection from "@/components/ContactSection";


import TestimonialSection from "@/components/TestimonialSection";
import SEO, { BASE_URL } from "@/components/SEO";
import ServiceMidCTA from "@/components/shared/ServiceMidCTA";
import ServiceProcess from "@/components/shared/ServiceProcess";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import HeroPatternBg from "@/components/visuals/HeroPatternBg";
import LmsHeroOverlay from "@/components/visuals/LmsHeroOverlay";
import IndustryScenarioTabs from "@/components/lms/IndustryScenarioTabs";
import LearnerJourneyMap from "@/components/lms/LearnerJourneyMap";
import RoiCalculator from "@/components/lms/RoiCalculator";
import CompetitorComparison from "@/components/lms/CompetitorComparison";
import DeviceFriendlySection from "@/components/lms/DeviceFriendlySection";
import {
  Monitor, Smartphone, Tablet, Cloud, Server, Shield, Zap, Globe, Palette,
  Languages, Lock, Link2, Wrench, Brain, Subtitles, MessageSquare,
  ClipboardCheck, PenTool, Code, Search, FileCheck, Headphones,
  DollarSign, Users, Bell, GraduationCap, UserCheck, ClipboardList, Wallet,
  ShieldCheck, Plug, RefreshCw, LineChart, MonitorSmartphone, HardDrive, Paintbrush, KeyRound, Award,
  Sparkles, ArrowRight, Rocket, CreditCard, Database, Layers, HardDriveDownload, Settings, PackageCheck,
  BookOpen
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import LmsEcosystemDialog from "@/components/LmsEcosystemDialog";
import WhyWebheadsDialog from "@/components/WhyWebheadsDialog";
import ClientMarquee from "@/components/ClientMarquee";

const featureIcons = [Cloud, Zap, Palette, Languages, ShieldCheck, Plug, RefreshCw, LineChart, MonitorSmartphone, PackageCheck];
const neoFeatureIcons = [Lock, Link2, Wrench, Headphones, HardDrive, Paintbrush, Server, KeyRound, Award];
const saasFeatureIcons = [Rocket, CreditCard, RefreshCw, Layers, Database, Plug, HardDriveDownload, Settings];
const aiFeatureIcons = [Brain, Subtitles, FileCheck, Search, GraduationCap, MessageSquare];
const allInOneIcons = [Search, Monitor, Headphones, DollarSign, Users, Bell];
const kdtFeatureIcons = [Link2, UserCheck, ClipboardList, Wallet];
const processIcons = [ClipboardCheck, PenTool, Code, FileCheck, Wrench];

export default function LmsPage() {
  const { t } = useTranslation();
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);

  const cloudFeatures = (t("lms.cloudFeatures", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: featureIcons[i] || Cloud }));
  const neoFeatures = (t("lms.neoFeatures", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: neoFeatureIcons[i] || Server }));
  const saasFeatures = (t("lms.saasFeatures", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: saasFeatureIcons[i] || Rocket }));
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
              "name": "웹헤즈 LMS",
              "applicationCategory": "EducationalApplication",
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
                "멀티 디바이스 지원 (PC, 태블릿, 모바일)",
                "AI 기반 학습 분석",
                "다국어 지원 (11개 언어)",
                "KDT 정부지원훈련 인증",
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
              "description": "이러닝 플랫폼 구축 및 운영을 위한 학습 관리 시스템",
              "brand": {
                "@type": "Brand",
                "name": "웹헤즈 (Webheads)"
              },
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "KRW",
                "offerCount": "3",
                "lowPrice": "0",
                "description": "클라우드형, 구축형, SaaS형 3가지 요금제"
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

      {/* Hero — Centered with abstract volumetric patterns */}
      <section
        className="relative flex items-center justify-center pt-28 pb-28 md:pt-44 md:pb-44 overflow-hidden"
      >
        <HeroPatternBg theme="blue-purple" />
        <LmsHeroOverlay />



        <div className="container mx-auto px-5 md:px-6 relative z-10 text-center flex flex-col items-center">
          <span
            className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase mb-6 md:mb-8"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <Sparkles className="w-4 h-4" />
            {t("lms.hero.badge")}
          </span>
          <h1
            className="text-3xl md:text-5xl lg:text-[4.2rem] font-extrabold leading-[1.15] mb-5 md:mb-7 tracking-tight text-white"
            style={{ wordBreak: "keep-all", textShadow: "0 4px 30px rgba(0,0,0,0.2)" }}
          >
            {t("lms.hero.title")}
            <br />
            <span className="bg-clip-text" style={{ opacity: 0.95 }}>
              {t("lms.hero.titleHighlight")}
            </span>
          </h1>
          <p className="text-sm md:text-lg leading-[1.8] mb-8 md:mb-10 max-w-2xl" style={{ color: "rgba(255,255,255,0.8)" }}>
            {t("lms.hero.desc")}
          </p>
          <div className="flex gap-3 md:gap-4 flex-wrap justify-center">
            <a
              href="#contact"
              className="group px-7 py-3.5 rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.03] flex items-center gap-2"
              style={{ background: "white", color: "hsl(245, 70%, 50%)", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}
            >
              {t("lms.hero.cta1")}
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#solutions" className="px-7 py-3.5 rounded-xl font-bold text-base transition-colors border border-white/30 text-white hover:bg-white/10" style={{ backdropFilter: "blur(8px)" }}>
              {t("lms.hero.cta2")}
            </a>
          </div>
          <LmsEcosystemDialog open={ecosystemOpen} onOpenChange={setEcosystemOpen} />
          <WhyWebheadsDialog open={whyOpen} onOpenChange={setWhyOpen} />
        </div>
      </section>

      {/* Stats — with gradient accent line */}
      <section className="py-14 md:py-24 relative">
        <div className="container mx-auto px-5 md:px-6 max-w-5xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-bold text-foreground text-2xl md:text-3xl lg:text-4xl tracking-tight">{t("lms.statsTitle")}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 md:divide-x divide-border">
            {stats.map((s: any, idx: number) => (
              <div key={s.label} className={`flex flex-col items-center justify-center py-5 md:py-8 px-3 md:px-4 text-center ${idx < 2 ? "border-b md:border-b-0 border-border" : ""} ${idx % 2 === 0 ? "border-r md:border-r-0 border-border" : ""}`}>
                <span
                  className="block font-bold leading-none mb-1.5 md:mb-2 text-2xl md:text-5xl tracking-tight"
                  style={{ color: "hsl(var(--lms-primary))" }}
                >
                  {s.value}
                </span>
                <span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span>
                <span className="block text-xs text-muted-foreground">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Reference Marquee */}
      <ClientMarquee />

      {/* Industry Scenario Tabs — "이 서비스가 나에게 맞는가?" */}
      <IndustryScenarioTabs />

      {/* All-in-One Management — 핵심 기능 개요 */}
      <section className="py-28">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: `hsl(var(--lms-primary))` }}>{t("lms.allInOneSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("lms.allInOneSection.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {allInOneFeatures.map((f: any, i: number) => {
              const Icon = allInOneIcons[i] || Search;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-all duration-200 flex flex-col gap-3 hover:shadow-md"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm"
                  >
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

      {/* Device Friendly — 멀티 디바이스 지원 */}
      <DeviceFriendlySection />

      {/* AI Features — 차별화 기능 */}
      <section className="py-28">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: `hsl(var(--lms-primary))` }}>{t("lms.aiSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("lms.aiSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("lms.aiSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {aiFeatures.map((f: any, i: number) => {
              const Icon = aiFeatureIcons[i] || Brain;
              return (
                <div key={f.title} className="rounded-2xl p-7 transition-all duration-200 flex flex-col gap-3 hover:shadow-md relative overflow-hidden" style={{ background: "var(--lms-gradient-subtle)", border: `1px solid hsl(var(--lms-card-border))` }}>
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

      {/* Learner Journey Map — 흰색 배경 */}
      <LearnerJourneyMap />

      {/* Solutions — 회색 배경 */}
      <section id="solutions" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: `hsl(var(--lms-primary))` }}>{t("lms.solutionsSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("lms.solutionsSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("lms.solutionsSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cloud AI */}
            <div className="rounded-3xl p-8 bg-background flex flex-col h-full transition-all duration-200 hover:-translate-y-1"
              style={{ border: "1px solid hsl(var(--border) / 0.5)", boxShadow: "0 4px 30px -8px hsl(var(--foreground) / 0.06)" }}
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "hsl(245, 60%, 95%)" }}>
                  <Cloud className="w-6 h-6" style={{ color: "hsl(245, 58%, 55%)" }} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-xl tracking-tight">{t("lms.cloud.name")}</h3>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: "hsl(245, 58%, 55%)" }}>{t("lms.cloud.subtitle")}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{t("lms.cloud.desc")}</p>
              <div className="flex flex-col gap-4 flex-1">
                {cloudFeatures.map((f: any) => (
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
              <a
                href="#contact"
                className="block text-center mt-8 py-3.5 rounded-full font-bold text-sm transition-all duration-200 text-white hover:opacity-90 hover:shadow-lg"
                style={{ background: "hsl(245, 58%, 55%)" }}
              >
                {t("lms.cloud.cta")}
              </a>
            </div>

            {/* NEO On-premise */}
            <div className="rounded-3xl p-8 bg-background flex flex-col h-full transition-all duration-200 hover:-translate-y-1"
              style={{ border: "1px solid hsl(var(--border) / 0.5)", boxShadow: "0 4px 30px -8px hsl(var(--foreground) / 0.06)" }}
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "hsl(215, 70%, 94%)" }}>
                  <Server className="w-6 h-6" style={{ color: "hsl(215, 65%, 48%)" }} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-xl tracking-tight">{t("lms.neo.name")}</h3>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: "hsl(215, 65%, 48%)" }}>{t("lms.neo.subtitle")}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{t("lms.neo.desc")}</p>
              <div className="flex flex-col gap-4 flex-1">
                {neoFeatures.map((f: any) => (
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
              <a
                href="#contact"
                className="block text-center mt-8 py-3.5 rounded-full font-bold text-sm transition-all duration-200 text-white hover:opacity-90 hover:shadow-lg"
                style={{ background: "hsl(215, 65%, 48%)" }}
              >
                {t("lms.neo.cta")}
              </a>
            </div>

            {/* SaaS */}
            <div className="rounded-3xl p-8 bg-background flex flex-col h-full transition-all duration-200 hover:-translate-y-1"
              style={{ border: "1px solid hsl(var(--border) / 0.5)", boxShadow: "0 4px 30px -8px hsl(var(--foreground) / 0.06)" }}
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "hsl(170, 55%, 93%)" }}>
                  <Sparkles className="w-6 h-6" style={{ color: "hsl(170, 55%, 38%)" }} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-xl tracking-tight">{t("lms.saas.name")}</h3>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: "hsl(170, 55%, 38%)" }}>{t("lms.saas.subtitle")}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{t("lms.saas.desc")}</p>
              <div className="flex flex-col gap-4 flex-1">
                {saasFeatures.map((f: any) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: "hsl(170, 55%, 93%)" }}>
                      <f.icon className="w-3.5 h-3.5" style={{ color: "hsl(170, 55%, 38%)" }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground leading-snug">{f.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="#contact"
                className="block text-center mt-8 py-3.5 rounded-full font-bold text-sm transition-all duration-200 text-white hover:opacity-90 hover:shadow-lg"
                style={{ background: "hsl(170, 55%, 38%)" }}
              >
                {t("lms.saas.cta")}
              </a>
            </div>
           </div>

          {/* HTML Comparison Table for AIO */}
          <div className="mt-12">
            <h3 className="font-bold text-foreground text-2xl lg:text-3xl tracking-tight mb-3">{t("lms.comparisonTable.title")}</h3>
            <p className="text-muted-foreground text-sm mb-8">{t("lms.comparisonTable.desc")}</p>
            <div className="rounded-2xl border border-border overflow-hidden bg-background">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border" style={{ background: "var(--lms-gradient-subtle)" }}>
                      {(t("lms.comparisonTable.headers", { returnObjects: true }) as string[]).map((header, i) => (
                        <th key={i} className={`px-5 py-4 text-left font-bold text-foreground whitespace-nowrap ${i === 0 ? "min-w-[120px]" : "min-w-[180px]"}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(t("lms.comparisonTable.rows", { returnObjects: true }) as string[][]).map((row, rowIdx) => (
                      <tr key={rowIdx} className={`border-b border-border last:border-0 ${rowIdx % 2 === 1 ? "bg-muted/30" : ""}`}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className={`px-5 py-3.5 ${cellIdx === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* KDT Summary */}
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 rounded-2xl border border-border p-6 bg-background">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(145, 70%, 93%)" }}>
                <GraduationCap className="w-5 h-5" style={{ color: "hsl(145, 60%, 38%)" }} />
              </div>
              <h4 className="font-bold text-foreground text-base">{t("lms.kdt.name")}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1" style={{ wordBreak: "keep-all" }}>
              {t("lms.kdt.summary")}
            </p>
            <a
              href="#contact"
              className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
              style={{ background: "hsl(145, 60%, 38%)" }}
            >
              {t("lms.kdt.ctaShort")}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ROI Calculator — 비용 정당화 */}
      <RoiCalculator />

      {/* Competitor Comparison — 왜 우리인가 */}
      <CompetitorComparison />

      {/* Mid CTA — 관심 전환 */}
      <ServiceMidCTA heading={t("lms.midCTA.heading")} description={t("lms.midCTA.description")} ctaText={t("lms.midCTA.ctaText")} />

      {/* Process */}
      <ServiceProcess
        steps={processSteps}
        heading={t("lms.processSection.heading")}
        subheading={t("lms.processSection.sub")}
        description={t("lms.processSection.desc")}
      />

      <TestimonialSection testimonials={testimonials} />
      <ServiceFAQ faqs={faqs} serviceName={t("lms.seo.title")} />
      <ContactSection showDemo />
    </div>
  );
}
