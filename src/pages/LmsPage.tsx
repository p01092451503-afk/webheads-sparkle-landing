import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";
import SEO from "@/components/SEO";
import ServiceMidCTA from "@/components/shared/ServiceMidCTA";
import ServiceProcess from "@/components/shared/ServiceProcess";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import LmsHeroVisual from "@/components/visuals/LmsHeroVisual";
import HeroAbstractBg from "@/components/visuals/HeroAbstractBg";
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

const featureIcons = [Cloud, Zap, Palette, Languages, ShieldCheck, Plug, RefreshCw, LineChart, MonitorSmartphone, PackageCheck];
const neoFeatureIcons = [Lock, Link2, Wrench, Headphones, HardDrive, Paintbrush, Server, KeyRound, Award];
const saasFeatureIcons = [Rocket, CreditCard, RefreshCw, Layers, Database, Plug, HardDriveDownload, Settings];
const aiFeatureIcons = [Brain, Subtitles, MessageSquare, FileCheck, Search];
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
        path="/lms"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": `${t("lms.seo.title")} - Webheads`,
          "provider": { "@type": "Organization", "name": "Webheads (웹헤즈)" },
          "description": t("lms.seo.description"),
          "applicationCategory": "LMS",
          "url": "https://service.webheads.co.kr/lms"
        }}
        faqJsonLd={faqs}
      />

      {/* Hero — LMS Premium Gradient */}
      <section
        className="relative flex items-center pt-20 pb-6 overflow-hidden"
        style={{ background: "var(--lms-hero-bg)" }}
      >
        <HeroAbstractBg variant="lms" />
        {/* Ambient gradient orbs */}
        <div className="absolute pointer-events-none" style={{ width: "120%", height: "120%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse 60% 50% at 65% 45%, hsl(255, 75%, 60%, 0.18) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none" style={{ width: "80%", height: "80%", bottom: "-10%", right: "-5%", background: "radial-gradient(ellipse 50% 60% at 70% 60%, hsl(220, 90%, 56%, 0.12) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none" style={{ width: "60%", height: "60%", top: "20%", left: "5%", background: "radial-gradient(ellipse 40% 40% at 30% 50%, hsl(192, 80%, 50%, 0.08) 0%, transparent 70%)" }} />

        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center" style={{ opacity: 0.85 }}>
          <div className="relative w-full h-full max-w-[765px] mx-auto hidden lg:flex items-center justify-center" style={{ transform: "translateX(40%) translateY(8%)" }}><LmsHeroVisual /></div>
        </div>
        <div className="container mx-auto px-6 py-14 relative z-10 lg:pl-[10%]">
          <div className="max-w-2xl">
            <span
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{ background: "var(--lms-badge-bg)", backdropFilter: "blur(8px)", color: `hsl(var(--lms-badge-text))`, boxShadow: "0 2px 12px hsl(255, 75%, 58%, 0.15)" }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t("lms.hero.badge")}
            </span>
            <h1
              className="text-4xl lg:text-[3.4rem] font-bold leading-[1.1] mb-5 tracking-tight"
              style={{ color: "hsl(var(--foreground))", wordBreak: "keep-all" }}
            >
              {t("lms.hero.title")}
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--lms-gradient)" }}
              >
                {t("lms.hero.titleHighlight")}
              </span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md text-muted-foreground">
              {t("lms.hero.desc")}
            </p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="#contact"
                className="group px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:scale-[1.02] text-white flex items-center gap-2"
                style={{ background: "var(--lms-gradient)", boxShadow: "var(--lms-shadow)" }}
              >
                {t("lms.hero.cta1")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="#solutions" className="px-5 py-2.5 rounded-2xl font-bold text-sm transition-colors border border-border text-foreground bg-background/80 backdrop-blur-sm">
                {t("lms.hero.cta2")}
              </a>
              <button
                onClick={() => setEcosystemOpen(true)}
                className="group px-5 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 hover:scale-[1.02] text-white relative overflow-hidden animate-[shimmer_3s_ease-in-out_infinite]"
                style={{
                  background: "linear-gradient(135deg, hsl(245, 65%, 55%), hsl(215, 80%, 50%))",
                  boxShadow: "0 4px 24px -4px hsl(245, 60%, 50%, 0.5), 0 0 0 2px hsl(245, 60%, 70%, 0.25)",
                }}
              >
                <span className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                  <span
                    className="absolute inset-0 -translate-x-full animate-[shine_3s_ease-in-out_infinite]"
                    style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)" }}
                  />
                </span>
                <BookOpen className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{t("lms.hero.ctaEcosystem")}</span>
              </button>
            </div>
            <LmsEcosystemDialog open={ecosystemOpen} onOpenChange={setEcosystemOpen} />
            <WhyWebheadsDialog open={whyOpen} onOpenChange={setWhyOpen} />
          </div>
        </div>
      </section>

      {/* Stats — with gradient accent line */}
      <section className="py-24 relative">
        
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-bold text-foreground text-3xl lg:text-4xl tracking-tight">{t("lms.statsTitle")}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {stats.map((s: any) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <span
                  className="block font-bold leading-none mb-2 text-4xl md:text-5xl tracking-tight bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--lms-gradient)" }}
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

      {/* Device Friendly */}
      <section className="py-28" style={{ background: "var(--lms-section-alt)" }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p
              className="text-sm font-semibold tracking-widest uppercase mb-4"
              style={{ color: `hsl(var(--lms-primary))` }}
            >
              {t("lms.deviceSection.sub")}
            </p>
            <h2 className="font-bold leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line text-foreground">{t("lms.deviceSection.title")}</h2>
            <p className="mt-4 text-base text-muted-foreground">{t("lms.deviceSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Monitor, label: "PC" },
              { icon: Tablet, label: "Tablet" },
              { icon: Smartphone, label: "Mobile" }
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="rounded-2xl p-7 flex flex-col items-center gap-4 text-center transition-all duration-200 hover:scale-[1.02] bg-background"
                style={{ border: `1px solid hsl(var(--lms-card-border))` }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "var(--lms-gradient-subtle)" }}
                >
                  <Icon className="w-7 h-7" style={{ color: `hsl(var(--lms-primary))` }} />
                </div>
                <h3 className="font-bold text-lg text-foreground">{label}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(`lms.deviceSection.${label.toLowerCase()}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cloud (AI) vs On-premise (NEO) Comparison */}
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
                style={{ background: "linear-gradient(135deg, hsl(245, 58%, 55%), hsl(195, 80%, 50%))" }}
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
                style={{ background: "linear-gradient(135deg, hsl(170, 55%, 38%), hsl(195, 80%, 50%))" }}
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

          {/* KDT Government-funded */}
          <div
            className="mt-6 rounded-3xl p-8 bg-background hover:shadow-lg transition-all duration-200 relative overflow-hidden"
            style={{ border: `1px solid hsl(var(--lms-card-border))` }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: "linear-gradient(90deg, hsl(145, 60%, 38%), hsl(160, 70%, 45%))" }} />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(145, 70%, 93%)" }}>
                <GraduationCap className="w-5 h-5" style={{ color: "hsl(145, 60%, 38%)" }} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-xl tracking-tight">{t("lms.kdt.name")}</h3>
                <p className="text-xs text-muted-foreground">{t("lms.kdt.subtitle")}</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{t("lms.kdt.desc")}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {kdtFeatures.map((f: any) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-secondary shrink-0 mt-0.5">
                    <f.icon className="w-4 h-4" style={{ color: "hsl(145, 60%, 38%)" }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{f.title}</h4>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="#contact"
              className="block text-center mt-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-150 text-white hover:opacity-90"
              style={{ background: "linear-gradient(135deg, hsl(145, 60%, 38%), hsl(160, 70%, 45%))" }}
            >
              {t("lms.kdt.cta")}
            </a>
          </div>
        </div>
      </section>

      {/* All-in-One Management */}
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

      <ServiceMidCTA heading={t("lms.midCTA.heading")} description={t("lms.midCTA.description")} ctaText={t("lms.midCTA.ctaText")} />

      {/* AI Features */}
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

      {/* Plans */}
      <section id="plans" className="py-28" style={{ background: "var(--lms-section-alt)" }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: `hsl(var(--lms-primary))` }}>{t("lms.plansSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("lms.plansSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("lms.plansSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {(t("lms.plans", { returnObjects: true }) as any[]).map((plan: any) => (
              <div key={plan.name} className={`relative rounded-3xl flex flex-col gap-0 transition-all duration-200 overflow-hidden ${plan.highlight ? "bg-background shadow-xl scale-[1.02]" : "bg-background border border-border hover:border-muted-foreground/30 hover:shadow-md"}`} style={plan.highlight ? { border: `2px solid hsl(var(--lms-primary))` } : undefined}>
                {plan.badge && (
                  <div className="text-sm font-bold text-center py-2.5 tracking-wide text-white" style={{ background: "var(--lms-gradient)" }}>
                    {plan.badge}
                  </div>
                )}
                <div className="p-8 flex flex-col gap-5 flex-1">
                  <div>
                    <h3 className={`font-bold text-3xl tracking-tight ${plan.highlight ? "" : "text-foreground"}`} style={plan.highlight ? { color: `hsl(var(--lms-primary))` } : undefined}>{plan.name}</h3>
                    {plan.solutionType && (
                      <p className="text-xs font-medium text-muted-foreground mt-1.5 tracking-wide">{plan.solutionType}</p>
                    )}
                    <div className={`h-px mt-4 ${plan.highlight ? "" : "bg-border"}`} style={plan.highlight ? { background: `hsl(var(--lms-primary) / 0.2)` } : undefined} />
                  </div>
                  <div>
                    <div className="flex items-end gap-1">
                      <span className={`font-bold leading-none tracking-tight text-4xl ${plan.highlight ? "" : "text-foreground"}`} style={plan.highlight ? { color: `hsl(var(--lms-primary))` } : undefined}>{plan.price}</span>
                      {plan.unit && <span className="text-base font-semibold text-muted-foreground mb-1">{plan.unit}</span>}
                    </div>
                    {plan.priceNote && <p className="text-sm text-muted-foreground mt-1.5">{plan.priceNote}</p>}
                  </div>
                  <ul className="flex flex-col gap-3.5 flex-1">
                    {plan.features.map((f: any) => (
                      <li key={f.main} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5 text-sm" style={{ color: `hsl(var(--lms-primary))` }}>✓</span>
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
          <div className="mt-12 text-center rounded-2xl border bg-background/50 p-8" style={{ borderColor: `hsl(var(--lms-card-border))` }}>
            <p className="text-foreground font-semibold text-lg mb-2">{t("lms.plansCustom.title")}</p>
            <p className="text-muted-foreground text-sm mb-6">{t("lms.plansCustom.desc")}</p>
            <a
              href="#contact"
              className="inline-flex px-8 py-3.5 rounded-2xl font-bold text-sm text-white hover:opacity-90 transition-all"
              style={{ background: "var(--lms-gradient)", boxShadow: "var(--lms-shadow)" }}
            >
              {t("lms.plansCustom.cta")}
            </a>
          </div>
        </div>
      </section>

      {/* Process */}
      <ServiceProcess
        steps={processSteps}
        heading={t("lms.processSection.heading")}
        subheading={t("lms.processSection.sub")}
        description={t("lms.processSection.desc")}
      />

      <ServiceFAQ faqs={faqs} serviceName={t("lms.seo.title")} />
      <TestimonialSection testimonials={testimonials} />
      <ContactSection showDemo />
    </div>
  );
}
