import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";
import SEO, { BASE_URL } from "@/components/SEO";
import HeroPatternBg from "@/components/visuals/HeroPatternBg";
import ServiceMidCTA from "@/components/shared/ServiceMidCTA";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import ServiceProcess from "@/components/shared/ServiceProcess";
import ServiceBeforeAfter from "@/components/shared/ServiceBeforeAfter";
import ServiceCaseStudy from "@/components/shared/ServiceCaseStudy";
import ServiceComparison from "@/components/shared/ServiceComparison";
import { Smartphone, Tablet, RefreshCw, Bell, Lock, BarChart3, Wifi, Settings2, ShieldCheck, Globe, Zap, Code2, Search, Palette, Link2, CheckCircle, Rocket } from "lucide-react";
import { useTranslation } from "react-i18next";

const lmsFeatureIcons = [Tablet, Bell, Lock, Wifi, BarChart3, ShieldCheck];
const otherAppIcons = [Globe, Zap, Smartphone, Code2];
const devStackIcons = [Smartphone, RefreshCw, Settings2];
const processIcons = [Search, Palette, Code2, CheckCircle, Rocket];

export default function AppDevPage() {
  const { t } = useTranslation();

  const lmsFeatures = (t("appdev.lmsFeatures", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: lmsFeatureIcons[i] || Tablet }));
  const otherApps = (t("appdev.otherApps", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: otherAppIcons[i] || Globe }));
  const devStack = (t("appdev.devStack", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: devStackIcons[i] || Smartphone }));
  const processSteps = (t("appdev.processSteps", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: processIcons[i] || Search }));
  const stats = t("appdev.stats", { returnObjects: true }) as any[];
  const plans = t("appdev.plans", { returnObjects: true }) as any[];
  const faqs = t("appdev.faqs", { returnObjects: true }) as any[];
  const testimonials = t("appdev.testimonials", { returnObjects: true }) as any[];
  const beforeAfter = t("appdev.beforeAfter", { returnObjects: true }) as any[];
  const caseStudies = t("appdev.caseStudies", { returnObjects: true }) as any[];
  const comparisonHeaders = t("appdev.comparisonHeaders", { returnObjects: true }) as string[];
  const comparisonRows = t("appdev.comparisonRows", { returnObjects: true }) as any[];

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t("appdev.seo.title")} description={t("appdev.seo.description")} keywords={t("appdev.seo.keywords")} path="/app-dev" jsonLd={{ "@context": "https://schema.org", "@type": "Service", "name": `${t("appdev.seo.title")} - Webheads`, "provider": { "@type": "Organization", "name": "Webheads (웹헤즈)" }, "description": t("appdev.seo.description"), "areaServed": "KR", "serviceType": t("appdev.seo.title"), "url": `${BASE_URL}/app-dev` }} faqJsonLd={faqs} />

      {/* Hero */}
      <section className="relative flex items-center justify-center pt-28 pb-20 overflow-hidden">
        <HeroPatternBg theme="teal-cyan" />
        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", color: "white" }}>{t("appdev.hero.badge")}</span>
          <h1 className="text-4xl lg:text-[3.2rem] font-bold leading-[1.15] mb-5 tracking-tight text-white" style={{ wordBreak: "keep-all" }}>{t("appdev.hero.title")}<br /><span style={{ opacity: 0.95 }}>{t("appdev.hero.titleHighlight")}</span></h1>
          <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.75)" }}>{t("appdev.hero.desc")}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <a href="#contact" className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02]" style={{ background: "white", color: "hsl(190, 70%, 38%)" }}>{t("appdev.hero.cta1")}</a>
            <a href="#other" className="px-5 py-2.5 rounded-xl font-bold text-sm transition-colors border border-white/30 text-white hover:bg-white/10">{t("appdev.hero.cta2")}</a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-[4.8rem] bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {stats.map((s: any) => (<div key={s.label} className="flex flex-col items-center justify-center py-6 px-4 text-center"><span className="block font-bold leading-none mb-2 text-4xl md:text-5xl text-foreground tracking-tight">{s.value}</span><span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span><span className="block text-xs text-muted-foreground">{s.sub}</span></div>))}
          </div>
        </div>
      </section>

      {/* LMS Features */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("appdev.lmsFeaturesSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("appdev.lmsFeaturesSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("appdev.lmsFeaturesSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lmsFeatures.map((f: any) => (<div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm"><f.icon className="w-5 h-5 text-primary" /></div><h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3><p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p><div className="flex flex-wrap gap-1.5 mt-1">{f.tags.map((tag: string) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}</div></div>))}
          </div>
        </div>
      </section>

      <ServiceBeforeAfter items={beforeAfter} subheading={t("appdev.beforeAfterSection.sub")} heading={t("appdev.beforeAfterSection.heading")} description={t("appdev.beforeAfterSection.desc")} />
      <ServiceMidCTA heading={t("appdev.midCTA.heading")} description={t("appdev.midCTA.description")} ctaText={t("appdev.midCTA.ctaText")} />

      {/* Other Apps */}
      <section id="other" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("appdev.otherAppsSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("appdev.otherAppsSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("appdev.otherAppsSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {otherApps.map((a: any) => (<div key={a.title} className="rounded-2xl p-8 bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 flex flex-col gap-4"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10 shrink-0"><a.icon className="w-6 h-6 text-primary" /></div><h3 className="font-bold text-foreground text-lg tracking-tight">{a.title}</h3></div><p className="text-muted-foreground text-sm leading-relaxed">{a.desc}</p><div className="flex flex-wrap gap-1.5">{a.tags.map((tag: string) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}</div></div>))}
          </div>
        </div>
      </section>

      {/* Dev Stack */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-12">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("appdev.devStackSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("appdev.devStackSection.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {devStack.map((f: any) => (<div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm"><f.icon className="w-5 h-5 text-primary" /></div><h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3><p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p><div className="flex flex-wrap gap-1.5 mt-1">{f.tags.map((tag: string) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}</div></div>))}
          </div>
        </div>
      </section>

      <ServiceProcess steps={processSteps} subheading={t("appdev.processSection.sub")} heading={t("appdev.processSection.heading")} description={t("appdev.processSection.desc")} />
      <ServiceComparison headers={comparisonHeaders} rows={comparisonRows} subheading={t("appdev.comparisonSection.sub")} heading={t("appdev.comparisonSection.heading")} description={t("appdev.comparisonSection.desc")} />

      {/* Plans */}
      <section id="plans" className="py-28" style={{ background: "var(--plans-bg)" }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("appdev.plansSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("appdev.plansSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("appdev.plansSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {plans.map((plan: any) => (<div key={plan.name} className={`relative rounded-3xl flex flex-col gap-0 transition-all duration-200 overflow-hidden ${plan.highlight ? "bg-background border-2 border-primary shadow-xl scale-[1.02]" : "bg-background border border-border hover:border-muted-foreground/30 hover:shadow-md"}`}>{plan.badge && <div className="bg-primary text-primary-foreground text-sm font-bold text-center py-2.5 tracking-wide">{plan.badge}</div>}<div className="p-8 flex flex-col gap-5 flex-1"><div><h3 className={`font-bold text-3xl tracking-tight ${plan.highlight ? "text-primary" : "text-foreground"}`}>{plan.name}</h3><div className={`h-px mt-4 ${plan.highlight ? "bg-primary/20" : "bg-border"}`} /></div><div><div className="flex items-end gap-1"><span className={`font-bold leading-none tracking-tight text-4xl ${plan.highlight ? "text-primary" : "text-foreground"}`}>{plan.price}</span>{plan.unit && <span className="text-base font-semibold text-muted-foreground mb-1">{plan.unit}</span>}</div>{plan.priceNote && <p className="text-sm text-muted-foreground mt-1.5">{plan.priceNote}</p>}</div><ul className="flex flex-col gap-3.5 flex-1">{plan.features.map((f: any) => (<li key={f.main} className="flex items-start gap-2.5"><span className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5 text-sm text-primary">✓</span><p className="text-base font-medium text-foreground leading-tight">{f.main}</p></li>))}</ul><div className="rounded-xl p-4 mt-2 bg-foreground"><p className="text-sm text-background/60 leading-relaxed text-center">{plan.recommend}</p></div></div></div>))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 rounded-xl border border-border bg-muted px-6 py-4">
            <p className="text-foreground font-semibold text-sm">{t("appdev.plansCustom.title")} <span className="font-normal text-muted-foreground">{t("appdev.plansCustom.desc")}</span></p>
            <a href="#contact" className="shrink-0 inline-flex px-5 py-2.5 rounded-2xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">{t("appdev.plansCustom.cta")}</a>
          </div>
        </div>
      </section>

      <ServiceCaseStudy cases={caseStudies} subheading={t("appdev.caseStudySection.sub")} heading={t("appdev.caseStudySection.heading")} description={t("appdev.caseStudySection.desc")} />
      <TestimonialSection testimonials={testimonials} />
      <ServiceFAQ faqs={faqs} serviceName={t("appdev.seo.title")} />
      <ContactSection />
    </div>
  );
}
