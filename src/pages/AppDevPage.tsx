import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";
import SEO from "@/components/SEO";
import AppDevHeroVisual from "@/components/visuals/AppDevHeroVisual";
import HeroAbstractBg from "@/components/visuals/HeroAbstractBg";
import ServiceMidCTA from "@/components/shared/ServiceMidCTA";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import { Smartphone, Tablet, RefreshCw, Bell, Lock, BarChart3, Wifi, Settings2, ShieldCheck, Globe, Zap, Code2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const lmsFeatureIcons = [Tablet, Bell, Lock, Wifi, BarChart3, ShieldCheck];
const otherAppIcons = [Globe, Zap, Smartphone, Code2];
const devStackIcons = [Smartphone, RefreshCw, Settings2];

export default function AppDevPage() {
  const { t } = useTranslation();

  const lmsFeatures = (t("appdev.lmsFeatures", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: lmsFeatureIcons[i] || Tablet }));
  const otherApps = (t("appdev.otherApps", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: otherAppIcons[i] || Globe }));
  const devStack = (t("appdev.devStack", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: devStackIcons[i] || Smartphone }));
  const stats = t("appdev.stats", { returnObjects: true }) as any[];
  const plans = t("appdev.plans", { returnObjects: true }) as any[];
  const faqs = t("appdev.faqs", { returnObjects: true }) as any[];
  const testimonials = t("appdev.testimonials", { returnObjects: true }) as any[];

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t("appdev.seo.title")} description={t("appdev.seo.description")} keywords={t("appdev.seo.keywords")} path="/app-dev" jsonLd={{ "@context": "https://schema.org", "@type": "Service", "name": `${t("appdev.seo.title")} - Webheads`, "provider": { "@type": "Organization", "name": "Webheads (웹헤즈)" }, "description": t("appdev.seo.description"), "areaServed": "KR", "serviceType": t("appdev.seo.title"), "url": "https://service.webheads.co.kr/app-dev" }} faqJsonLd={faqs} />

      {/* Hero */}
      <section className="relative min-h-[76vh] flex items-center pt-20 pb-14 overflow-hidden" style={{ background: "var(--appdev-hero-bg)" }}>
        <HeroAbstractBg variant="appdev" />
        <div className="absolute pointer-events-none" style={{ width: "120%", height: "120%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse 60% 50% at 65% 45%, hsl(170, 70%, 45%, 0.18) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none" style={{ width: "80%", height: "80%", bottom: "-10%", left: "-5%", background: "radial-gradient(ellipse 50% 60% at 30% 70%, hsl(165, 60%, 50%, 0.1) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center" style={{ opacity: 0.85 }}>
          <div className="relative w-full h-full max-w-[900px] mx-auto hidden lg:flex items-center justify-center" style={{ transform: "translateX(40%)" }}><AppDevHeroVisual /></div>
        </div>
        <div className="container mx-auto px-6 py-24 relative z-10 lg:pl-[10%]">
          <div className="max-w-xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 bg-background/85 dark:bg-muted/90 backdrop-blur-sm text-primary shadow-sm">{t("appdev.hero.badge")}</span>
            <h1 className="text-4xl lg:text-[3.2rem] font-bold leading-tight mb-5 tracking-tight text-foreground">{t("appdev.hero.title")}<br /><span className="text-primary">{t("appdev.hero.titleHighlight")}</span></h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md text-muted-foreground">{t("appdev.hero.desc")}</p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-85 bg-foreground text-background">{t("appdev.hero.cta1")}</a>
              <a href="#other" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border border-border text-foreground bg-background/80 dark:bg-muted/80 backdrop-blur-sm">{t("appdev.hero.cta2")}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {stats.map((s: any) => (<div key={s.label} className="flex flex-col items-center justify-center py-8 px-4 text-center"><span className="block font-bold leading-none mb-2 text-4xl md:text-5xl text-foreground tracking-tight">{s.value}</span><span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span><span className="block text-xs text-muted-foreground">{s.sub}</span></div>))}
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

      {/* Plans */}
      <section id="plans" className="py-28" style={{ background: "var(--plans-bg)" }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("appdev.plansSection.sub")}</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("appdev.plansSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("appdev.plansSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {plans.map((plan: any) => (<div key={plan.name} className={`relative rounded-3xl flex flex-col gap-0 transition-all duration-200 overflow-hidden ${plan.highlight ? "bg-background border-2 border-primary shadow-xl scale-[1.02]" : "bg-background border border-border hover:border-muted-foreground/30 hover:shadow-md"}`}>{plan.badge && <div className="bg-primary text-primary-foreground text-sm font-bold text-center py-2.5 tracking-wide">{plan.badge}</div>}<div className="p-8 flex flex-col gap-5 flex-1"><div><h3 className={`font-black text-3xl tracking-tight ${plan.highlight ? "text-primary" : "text-foreground"}`}>{plan.name}</h3><div className={`h-px mt-4 ${plan.highlight ? "bg-primary/20" : "bg-border"}`} /></div><div><div className="flex items-end gap-1"><span className={`font-black leading-none tracking-tight text-4xl ${plan.highlight ? "text-primary" : "text-foreground"}`}>{plan.price}</span>{plan.unit && <span className="text-base font-semibold text-muted-foreground mb-1">{plan.unit}</span>}</div>{plan.priceNote && <p className="text-sm text-muted-foreground mt-1.5">{plan.priceNote}</p>}</div><ul className="flex flex-col gap-3.5 flex-1">{plan.features.map((f: any) => (<li key={f.main} className="flex items-start gap-2.5"><span className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5 text-sm text-primary">✓</span><p className="text-base font-medium text-foreground leading-tight">{f.main}</p></li>))}</ul><div className="rounded-xl p-4 mt-2 bg-foreground"><p className="text-sm text-background/60 leading-relaxed text-center">{plan.recommend}</p></div></div></div>))}
          </div>
          <div className="mt-12 text-center rounded-2xl border border-border bg-background/50 p-8">
            <p className="text-foreground font-semibold text-lg mb-2">{t("appdev.plansCustom.title")}</p>
            <p className="text-muted-foreground text-sm mb-6">{t("appdev.plansCustom.desc")}</p>
            <a href="#contact" className="inline-flex px-8 py-3.5 rounded-2xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">{t("appdev.plansCustom.cta")}</a>
          </div>
        </div>
      </section>

      <ServiceFAQ faqs={faqs} serviceName={t("appdev.seo.title")} />
      <TestimonialSection testimonials={testimonials} />
      <ContactSection />
    </div>
  );
}
