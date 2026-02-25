import { CreditCard, Globe, ShieldCheck, Zap, BarChart3, Settings, RefreshCw, Lock, Headphones } from "lucide-react";
import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";
import SEO from "@/components/SEO";
import PgHeroVisual from "@/components/visuals/PgHeroVisual";
import ServiceMidCTA from "@/components/shared/ServiceMidCTA";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import { useTranslation } from "react-i18next";

const featureIcons = [CreditCard, ShieldCheck, Zap, Settings, Globe, RefreshCw, BarChart3, Lock, Headphones];

export default function PgPage() {
  const { t } = useTranslation();

  const features = (t("pg.features", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: featureIcons[i] || CreditCard }));
  const pgPartners = t("pg.pgPartners", { returnObjects: true }) as any[];
  const paymentMethods = t("pg.paymentMethods", { returnObjects: true }) as string[];
  const stats = t("pg.stats", { returnObjects: true }) as any[];
  const faqs = t("pg.faqs", { returnObjects: true }) as any[];
  const testimonials = t("pg.testimonials", { returnObjects: true }) as any[];

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t("pg.seo.title")} description={t("pg.seo.description")} keywords={t("pg.seo.keywords")} path="/pg" jsonLd={{ "@context": "https://schema.org", "@type": "Service", "name": `${t("pg.seo.title")} - Webheads`, "provider": { "@type": "Organization", "name": "Webheads (웹헤즈)" }, "description": t("pg.seo.description"), "areaServed": "KR", "serviceType": t("pg.seo.title"), "url": "https://webheads-sub.lovable.app/pg" }} faqJsonLd={faqs} />

      {/* Hero */}
      <section className="relative min-h-[76vh] flex items-center pt-20 pb-14 overflow-hidden" style={{ background: "var(--pg-hero-bg)" }}>
        <div className="absolute pointer-events-none" style={{ width: "120%", height: "120%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse 60% 50% at 65% 45%, hsl(var(--accent) / 0.15) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none" style={{ width: "80%", height: "80%", bottom: "-10%", left: "-5%", background: "radial-gradient(ellipse 50% 60% at 30% 70%, hsl(var(--accent) / 0.08) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center" style={{ opacity: 0.85 }}>
          <div className="relative w-full h-full max-w-[900px] mx-auto hidden lg:flex items-center justify-center" style={{ transform: "translateX(40%)" }}><PgHeroVisual /></div>
        </div>
        <div className="container mx-auto px-6 py-24 relative z-10 lg:pl-[10%]">
          <div className="max-w-xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 bg-background/85 dark:bg-muted/90 backdrop-blur-sm text-accent shadow-sm">{t("pg.hero.badge")}</span>
            <h1 className="text-4xl lg:text-[3.2rem] font-black leading-tight mb-5 tracking-tight text-foreground">{t("pg.hero.title")}<br /><span className="text-accent">{t("pg.hero.titleHighlight")}</span></h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md text-muted-foreground">{t("pg.hero.desc")}</p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors hover:bg-primary/90 bg-primary text-primary-foreground">{t("pg.hero.cta1")}</a>
              <a href="#partners" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border border-border text-foreground bg-background/80 dark:bg-muted/80 backdrop-blur-sm">{t("pg.hero.cta2")}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {stats.map((s: any) => (<div key={s.label} className="flex flex-col items-center justify-center py-8 px-4 text-center"><span className="block font-black leading-none mb-2 text-4xl md:text-5xl text-foreground tracking-tight">{s.value}</span><span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span><span className="block text-xs text-muted-foreground">{s.sub}</span></div>))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 bg-secondary border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-10">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("pg.paymentMethodsSection.sub")}</p>
            <h2 className="font-black text-foreground leading-tight text-3xl lg:text-4xl tracking-tight whitespace-pre-line">{t("pg.paymentMethodsSection.title")}</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {paymentMethods.map((method: string) => (<span key={method} className="px-4 py-2 rounded-full border border-border bg-background text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors">{method}</span>))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("pg.featuresSection.sub")}</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("pg.featuresSection.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f: any) => (<div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm"><f.icon className="w-5 h-5 text-primary" /></div><h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3><p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p><div className="flex flex-wrap gap-1.5 mt-1">{f.tags.map((tag: string) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}</div></div>))}
          </div>
        </div>
      </section>

      <ServiceMidCTA heading={t("pg.midCTA.heading")} description={t("pg.midCTA.description")} />

      {/* PG Partners */}
      <section id="partners" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("pg.partnersSection.sub")}</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("pg.partnersSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("pg.partnersSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pgPartners.map((p: any, i: number) => (<div key={p.name} className="rounded-2xl p-6 bg-background border border-border hover:border-primary/30 hover:shadow-sm transition-all flex flex-col gap-3"><div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary text-primary-foreground font-bold text-xs">{String(i + 1).padStart(2, "0")}</div><div><span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mb-1">{p.category}</span><h4 className="font-bold text-foreground text-sm tracking-tight">{p.name}</h4><p className="text-muted-foreground text-xs mt-0.5">{p.desc}</p></div></div>))}
          </div>
        </div>
      </section>

      <ServiceFAQ faqs={faqs} serviceName={t("pg.seo.title")} />
      <TestimonialSection testimonials={testimonials} />
      <ContactSection />
    </div>
  );
}
