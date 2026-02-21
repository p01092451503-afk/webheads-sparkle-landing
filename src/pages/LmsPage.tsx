import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";
import SEO from "@/components/SEO";
import ServiceMidCTA from "@/components/shared/ServiceMidCTA";
import ServiceProcess from "@/components/shared/ServiceProcess";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import LmsHeroVisual from "@/components/visuals/LmsHeroVisual";
import {
  Monitor, Smartphone, Tablet, Cloud, Server, Shield, Zap, Globe, Palette,
  Languages, Lock, Link2, Wrench, BarChart3, Brain, Subtitles, MessageSquare,
  ClipboardCheck, PenTool, Code, Search, FileCheck, Headphones,
  DollarSign, Users, Bell
} from "lucide-react";
import { useTranslation } from "react-i18next";

const featureIcons = [Cloud, Zap, Palette, Languages, Lock, Link2, Wrench, BarChart3, Brain];
const aiFeatureIcons = [Brain, Subtitles, MessageSquare];
const allInOneIcons = [Search, Monitor, Headphones, DollarSign, Users, Bell];
const processIcons = [ClipboardCheck, PenTool, Code, FileCheck, Wrench];

export default function LmsPage() {
  const { t } = useTranslation();

  const cloudFeatures = (t("lms.cloudFeatures", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: featureIcons[i] || Cloud }));
  const neoFeatures = (t("lms.neoFeatures", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: featureIcons[i] || Server }));
  const aiFeatures = t("lms.aiFeatures", { returnObjects: true }) as any[];
  const allInOneFeatures = t("lms.allInOne", { returnObjects: true }) as any[];
  const stats = t("lms.stats", { returnObjects: true }) as any[];
  const partners = t("lms.partners", { returnObjects: true }) as string[];
  const faqs = t("lms.faqs", { returnObjects: true }) as any[];
  const testimonials = t("lms.testimonials", { returnObjects: true }) as any[];
  const processSteps = (t("lms.processSteps", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: processIcons[i] || ClipboardCheck }));

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("lms.seo.title")}
        description={t("lms.seo.description")}
        keywords={t("lms.seo.keywords")}
        path="/lms"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "웹헤즈 LMS",
          "provider": { "@type": "Organization", "name": "웹헤즈" },
          "description": t("lms.seo.description"),
          "applicationCategory": "LMS",
          "url": "https://webheads-sparkle-landing.lovable.app/lms"
        }}
      />

      {/* Hero */}
      <section
        className="relative min-h-[76vh] flex items-center pt-20 pb-14 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, hsl(240, 60%, 95%) 0%, hsl(250, 50%, 90%) 40%, hsl(260, 50%, 88%) 100%)"
        }}
      >
        <div className="absolute pointer-events-none" style={{ width: "120%", height: "120%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse 60% 50% at 65% 45%, hsla(260, 80%, 70%, 0.15) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none" style={{ width: "80%", height: "80%", bottom: "-10%", right: "-5%", background: "radial-gradient(ellipse 50% 60% at 70% 60%, hsla(200, 80%, 60%, 0.1) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center" style={{ opacity: 0.85 }}>
          <div className="relative w-full h-full max-w-[900px] mx-auto hidden lg:flex items-center justify-center" style={{ transform: "translateX(40%)" }}><LmsHeroVisual /></div>
        </div>
        <div className="container mx-auto px-6 py-24 relative z-10 lg:pl-[10%]">
          <div className="max-w-xl">
            <span
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{ background: "hsla(0, 0%, 100%, 0.85)", backdropFilter: "blur(8px)", color: "hsl(260, 70%, 40%)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            >
              {t("lms.hero.badge")}
            </span>
            <h1
              className="text-4xl lg:text-[3.2rem] font-black leading-tight mb-5 tracking-tight"
              style={{ color: "hsl(220, 60%, 8%)" }}
            >
              {t("lms.hero.title")}
              <br />
              <span style={{ color: "hsl(260, 80%, 55%)" }}>{t("lms.hero.titleHighlight")}</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "hsl(220, 20%, 40%)", textShadow: "0 1px 2px hsla(0, 0%, 100%, 0.6)" }}>
              {t("lms.hero.desc")}
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-85" style={{ background: "hsl(220, 60%, 8%)", color: "#fff" }}>
                {t("lms.hero.cta1")}
              </a>
              <a href="#solutions" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border" style={{ borderColor: "hsl(214, 20%, 85%)", color: "hsl(220, 60%, 8%)", background: "hsla(0, 0%, 100%, 0.8)", backdropFilter: "blur(8px)" }}>
                {t("lms.hero.cta2")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-black text-foreground text-3xl lg:text-4xl tracking-tight">{t("lms.statsTitle")}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {stats.map((s: any) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <span className="block font-black leading-none mb-2 text-4xl md:text-5xl text-foreground tracking-tight">{s.value}</span>
                <span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span>
                <span className="block text-xs text-muted-foreground">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-6 text-center">{t("lms.partnersTitle")}</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {partners.map((name: string) => (
              <span key={name} className="text-sm font-medium text-muted-foreground px-4 py-2 rounded-full bg-background border border-border">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Device Friendly */}
      <section className="py-28" style={{ background: "linear-gradient(180deg, hsl(220, 40%, 96%) 0%, hsl(222, 35%, 92%) 100%)" }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-primary">{t("lms.deviceSection.sub")}</p>
            <h2 className="font-black leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line text-foreground">{t("lms.deviceSection.title")}</h2>
            <p className="mt-4 text-base text-muted-foreground">{t("lms.deviceSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Monitor, label: "PC" },
              { icon: Tablet, label: "Tablet" },
              { icon: Smartphone, label: "Mobile" }
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-2xl p-7 flex flex-col items-center gap-4 text-center transition-all duration-200 hover:scale-[1.02] bg-background" style={{ border: "1px solid hsl(214, 20%, 88%)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "hsl(214, 90%, 52%, 0.08)" }}>
                  <Icon className="w-7 h-7 text-primary" />
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
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("lms.solutionsSection.sub")}</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("lms.solutionsSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("lms.solutionsSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cloud AI */}
            <div className="rounded-3xl p-8 bg-background border border-border hover:border-muted-foreground/30 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(260, 80%, 95%)" }}>
                  <Cloud className="w-5 h-5" style={{ color: "hsl(260, 80%, 55%)" }} />
                </div>
                <div>
                  <h3 className="font-black text-foreground text-xl tracking-tight">{t("lms.cloud.name")}</h3>
                  <p className="text-xs text-muted-foreground">{t("lms.cloud.subtitle")}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{t("lms.cloud.desc")}</p>
              <div className="flex flex-col gap-3">
                {cloudFeatures.map((f: any) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-secondary shrink-0 mt-0.5">
                      <f.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{f.title}</h4>
                      <p className="text-xs text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#contact" className="block text-center mt-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-150 bg-foreground text-primary-foreground hover:opacity-85">
                {t("lms.cloud.cta")}
              </a>
            </div>
            {/* NEO On-premise */}
            <div className="rounded-3xl p-8 bg-background border border-border hover:border-muted-foreground/30 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(220, 80%, 95%)" }}>
                  <Server className="w-5 h-5" style={{ color: "hsl(220, 70%, 45%)" }} />
                </div>
                <div>
                  <h3 className="font-black text-foreground text-xl tracking-tight">{t("lms.neo.name")}</h3>
                  <p className="text-xs text-muted-foreground">{t("lms.neo.subtitle")}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{t("lms.neo.desc")}</p>
              <div className="flex flex-col gap-3">
                {neoFeatures.map((f: any) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-secondary shrink-0 mt-0.5">
                      <f.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{f.title}</h4>
                      <p className="text-xs text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#contact" className="block text-center mt-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-150 bg-foreground text-primary-foreground hover:opacity-85">
                {t("lms.neo.cta")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* All-in-One Management */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("lms.allInOneSection.sub")}</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("lms.allInOneSection.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {allInOneFeatures.map((f: any, i: number) => {
              const Icon = allInOneIcons[i] || Search;
              return (
                <div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm">
                    <Icon className="w-5 h-5 text-primary" />
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
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("lms.aiSection.sub")}</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("lms.aiSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("lms.aiSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {aiFeatures.map((f: any, i: number) => {
              const Icon = aiFeatureIcons[i] || Brain;
              return (
                <div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p>
                </div>
              );
            })}
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
      <ContactSection />
    </div>
  );
}
