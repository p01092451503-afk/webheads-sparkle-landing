import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";
import SEO from "@/components/SEO";
import DrmHeroVisual from "@/components/visuals/DrmHeroVisual";
import HeroAbstractBg from "@/components/visuals/HeroAbstractBg";
import ServiceMidCTA from "@/components/shared/ServiceMidCTA";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import ServiceProcess from "@/components/shared/ServiceProcess";
import { ShieldCheck, Video, Camera, Fingerprint, Globe, MonitorSmartphone, Lock, KeyRound, BarChart3, Search, FileCheck, Settings, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";

const featureIcons = [ShieldCheck, Video, Camera, Fingerprint, Globe, MonitorSmartphone, KeyRound, Lock, BarChart3];
const processIcons = [Search, FileCheck, Settings, Activity];

export default function DrmPage() {
  const { t } = useTranslation();

  const features = (t("drm.features", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: featureIcons[i] || ShieldCheck }));
  const solutions = t("drm.solutions", { returnObjects: true }) as any[];
  const stats = t("drm.stats", { returnObjects: true }) as any[];
  const faqs = t("drm.faqs", { returnObjects: true }) as any[];
  const testimonials = t("drm.testimonials", { returnObjects: true }) as any[];
  const processSteps = (t("drm.processSteps", { returnObjects: true }) as any[]).map((step: any, i: number) => ({ ...step, icon: processIcons[i] || Search }));

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t("drm.seo.title")} description={t("drm.seo.description")} keywords={t("drm.seo.keywords")} path="/drm" jsonLd={{ "@context": "https://schema.org", "@type": "Service", "name": `${t("drm.seo.title")} - Webheads`, "provider": { "@type": "Organization", "name": "Webheads (웹헤즈)" }, "description": t("drm.seo.description"), "areaServed": "KR", "serviceType": t("drm.seo.title"), "url": "https://service.webheads.co.kr/drm" }} faqJsonLd={faqs} />

      {/* Hero */}
      <section className="relative flex items-center pt-20 pb-6 overflow-hidden" style={{ background: "var(--drm-hero-bg)" }}>
        <HeroAbstractBg variant="drm" />
        <div className="absolute pointer-events-none" style={{ width: "120%", height: "120%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse 60% 50% at 65% 45%, hsl(225, 75%, 55%, 0.18) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none" style={{ width: "80%", height: "80%", bottom: "-10%", left: "-5%", background: "radial-gradient(ellipse 50% 60% at 30% 70%, hsl(230, 65%, 50%, 0.1) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center" style={{ opacity: 0.85 }}>
          <div className="relative w-full h-full max-w-[765px] mx-auto hidden lg:flex items-center justify-center" style={{ transform: "translateX(40%) translateY(8%)" }}><DrmHeroVisual /></div>
        </div>
        <div className="container mx-auto px-6 py-14 relative z-10 lg:pl-[10%]">
          <div className="max-w-xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 bg-background/85 dark:bg-muted/90 backdrop-blur-sm text-accent shadow-sm">{t("drm.hero.badge")}</span>
            <h1 className="text-4xl lg:text-[3.2rem] font-bold leading-tight mb-5 tracking-tight text-foreground">{t("drm.hero.title")}<br /><span style={{ color: "hsl(220, 85%, 45%)" }}>{t("drm.hero.titleHighlight")}</span></h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md text-muted-foreground">{t("drm.hero.desc")}</p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="px-5 py-2.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-85 bg-foreground text-background">{t("drm.hero.cta1")}</a>
              <a href="#solutions" className="px-5 py-2.5 rounded-2xl font-bold text-sm transition-colors border border-border text-foreground bg-background/80 dark:bg-muted/80 backdrop-blur-sm">{t("drm.hero.cta2")}</a>
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

      {/* Features */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("drm.featuresSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("drm.featuresSection.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f: any) => (<div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm"><f.icon className="w-5 h-5 text-primary" /></div><h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3><p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p><div className="flex flex-wrap gap-1.5 mt-1">{f.tags.map((tag: string) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}</div></div>))}
          </div>
        </div>
      </section>

      <ServiceMidCTA heading={t("drm.midCTA.heading")} description={t("drm.midCTA.description")} ctaText={t("drm.midCTA.ctaText")} />

      {/* Solutions */}
      <section id="solutions" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("drm.solutionsSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">{t("drm.solutionsSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("drm.solutionsSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
            {solutions.map((sol: any) => (<div key={sol.name} className="relative rounded-3xl p-8 flex flex-col gap-5 transition-all duration-200 bg-background border border-border hover:border-muted-foreground/30 hover:shadow-md"><div><h3 className="font-bold leading-none text-3xl tracking-tight text-foreground">{sol.name}</h3><p className="text-sm mt-2 leading-relaxed text-muted-foreground">{sol.desc}</p></div><div className="h-px bg-border" /><ul className="flex flex-col gap-3 flex-1">{sol.features.map((feat: string) => (<li key={feat} className="flex items-center gap-2.5 text-sm text-muted-foreground"><span className="w-1.5 h-1.5 rounded-full shrink-0 bg-primary" />{feat}</li>))}</ul><a href="#contact" className="block text-center py-3.5 rounded-2xl font-bold text-sm transition-all duration-150 bg-primary text-primary-foreground hover:bg-primary/90">{sol.ctaText}</a></div>))}
          </div>
        </div>
      </section>

      {/* Process */}
      <ServiceProcess
        steps={processSteps}
        heading={t("drm.processSection.title")}
        subheading={t("drm.processSection.sub")}
        description={t("drm.processSection.desc")}
      />

      {/* Custom Quote CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="rounded-3xl border border-border bg-secondary p-10 text-center">
            <h3 className="font-bold text-2xl text-foreground mb-3">{t("drm.plansCustom.title")}</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">{t("drm.plansCustom.desc")}</p>
            <a href="#contact" className="inline-flex px-8 py-3.5 rounded-2xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">{t("drm.plansCustom.cta")}</a>
          </div>
        </div>
      </section>

      <ServiceFAQ faqs={faqs} serviceName={t("drm.seo.title")} />
      <TestimonialSection testimonials={testimonials} />
      <ContactSection />
    </div>
  );
}
