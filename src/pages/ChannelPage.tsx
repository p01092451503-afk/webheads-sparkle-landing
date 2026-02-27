import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";
import SEO from "@/components/SEO";
import ChannelHeroVisual from "@/components/visuals/ChannelHeroVisual";
import HeroAbstractBg from "@/components/visuals/HeroAbstractBg";
import ServiceMidCTA from "@/components/shared/ServiceMidCTA";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import ServiceProcess from "@/components/shared/ServiceProcess";
import { MessageCircle, Smartphone, Bell, UserCheck, BarChart3, Settings, CheckCircle2, Search, Link, Zap, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";

const featureIcons = [MessageCircle, Smartphone, Bell, UserCheck, BarChart3, Settings, CheckCircle2, MessageCircle, Bell];
const processIcons = [Search, Link, Zap, Activity];

export default function ChannelPage() {
  const { t } = useTranslation();

  const features = (t("channel.features", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: featureIcons[i] || MessageCircle }));
  const useCases = t("channel.useCases", { returnObjects: true }) as any[];
  const stats = t("channel.stats", { returnObjects: true }) as any[];
  const faqs = t("channel.faqs", { returnObjects: true }) as any[];
  const testimonials = t("channel.testimonials", { returnObjects: true }) as any[];
  const processSteps = (t("channel.processSteps", { returnObjects: true }) as any[]).map((step: any, i: number) => ({ ...step, icon: processIcons[i] || Search }));

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t("channel.seo.title")} description={t("channel.seo.description")} keywords={t("channel.seo.keywords")} path="/channel" jsonLd={{ "@context": "https://schema.org", "@type": "Service", "name": `${t("channel.seo.title")} - Webheads`, "provider": { "@type": "Organization", "name": "Webheads (웹헤즈)" }, "description": t("channel.seo.description"), "areaServed": "KR", "serviceType": t("channel.seo.title"), "url": "https://service.webheads.co.kr/channel" }} faqJsonLd={faqs} />

      {/* Hero */}
      <section className="relative min-h-[76vh] flex items-center pt-20 pb-14 overflow-hidden" style={{ background: "var(--channel-hero-bg)" }}>
        <HeroAbstractBg variant="channel" />
        <div className="absolute pointer-events-none" style={{ width: "120%", height: "120%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse 60% 50% at 65% 45%, hsl(155, 70%, 45%, 0.18) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none" style={{ width: "80%", height: "80%", bottom: "-10%", left: "-5%", background: "radial-gradient(ellipse 50% 60% at 30% 70%, hsl(165, 60%, 50%, 0.1) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center" style={{ opacity: 0.85 }}>
          <div className="relative w-full h-full max-w-[900px] mx-auto hidden lg:flex items-center justify-center" style={{ transform: "translateX(40%)" }}><ChannelHeroVisual /></div>
        </div>
        <div className="container mx-auto px-6 py-24 relative z-10 lg:pl-[10%]">
          <div className="max-w-xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 bg-background/85 dark:bg-muted/90 backdrop-blur-sm text-primary shadow-sm">{t("channel.hero.badge")}</span>
            <h1 className="text-4xl lg:text-[3.2rem] font-bold leading-tight mb-5 tracking-tight text-foreground">{t("channel.hero.title")}<br /><span className="text-primary">{t("channel.hero.titleHighlight")}</span></h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md text-muted-foreground">{t("channel.hero.desc")}</p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors hover:bg-primary/90 bg-primary text-primary-foreground">{t("channel.hero.cta1")}</a>
              <a href="#cases" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border border-border text-foreground bg-background/80 dark:bg-muted/80 backdrop-blur-sm">{t("channel.hero.cta2")}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-3 gap-0 divide-x divide-border">
            {stats.map((s: any) => (<div key={s.label} className="flex flex-col items-center justify-center py-8 px-4 text-center"><span className="block font-bold leading-none mb-2 text-4xl md:text-5xl text-foreground tracking-tight">{s.value}</span><span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span><span className="block text-xs text-muted-foreground">{s.sub}</span></div>))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("channel.featuresSection.sub")}</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("channel.featuresSection.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f: any) => (<div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm"><f.icon className="w-5 h-5 text-primary" /></div><h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3><p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p><div className="flex flex-wrap gap-1.5 mt-1">{f.tags.map((tag: string) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}</div></div>))}
          </div>
        </div>
      </section>

      <ServiceMidCTA heading={t("channel.midCTA.heading")} description={t("channel.midCTA.description")} />

      {/* Use Cases */}
      <section id="usecases" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("channel.useCasesSection.sub")}</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("channel.useCasesSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("channel.useCasesSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {useCases.map((uc: any, i: number) => (<div key={uc.title} className="flex items-start gap-4 p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-sm transition-all"><div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-primary-foreground font-bold text-xs bg-primary">{String(i + 1).padStart(2, "0")}</div><div><h4 className="font-bold text-foreground text-sm mb-1 tracking-tight">{uc.title}</h4><p className="text-muted-foreground text-xs leading-relaxed">{uc.desc}</p></div></div>))}
          </div>
        </div>
      </section>

      {/* Process */}
      <ServiceProcess
        steps={processSteps}
        heading={t("channel.processSection.title")}
        subheading={t("channel.processSection.sub")}
        description={t("channel.processSection.desc")}
      />

      {/* Custom Quote CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="rounded-3xl border border-border bg-secondary p-10 text-center">
            <h3 className="font-black text-2xl text-foreground mb-3">{t("channel.plansCustom.title")}</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">{t("channel.plansCustom.desc")}</p>
            <a href="#contact" className="inline-flex px-8 py-3.5 rounded-2xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">{t("channel.plansCustom.cta")}</a>
          </div>
        </div>
      </section>

      <ServiceFAQ faqs={faqs} serviceName={t("channel.seo.title")} />
      <TestimonialSection testimonials={testimonials} />
      <ContactSection />
    </div>
  );
}