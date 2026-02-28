import { CreditCard, Globe, ShieldCheck, Zap, BarChart3, Settings, RefreshCw, Lock, Headphones, Search, FileCheck, Code, Activity } from "lucide-react";
import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";
import SEO, { BASE_URL } from "@/components/SEO";
import HeroPatternBg from "@/components/visuals/HeroPatternBg";
import ServiceMidCTA from "@/components/shared/ServiceMidCTA";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import ServiceProcess from "@/components/shared/ServiceProcess";
import { useTranslation } from "react-i18next";

const featureIcons = [CreditCard, ShieldCheck, Zap, Settings, Globe, RefreshCw, BarChart3, Lock, Headphones];
const processIcons = [Search, FileCheck, Code, Activity];

export default function PgPage() {
  const { t } = useTranslation();

  const features = (t("pg.features", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: featureIcons[i] || CreditCard }));
  const pgPartners = t("pg.pgPartners", { returnObjects: true }) as any[];
  const paymentMethods = t("pg.paymentMethods", { returnObjects: true }) as string[];
  const stats = t("pg.stats", { returnObjects: true }) as any[];
  const faqs = t("pg.faqs", { returnObjects: true }) as any[];
  const testimonials = t("pg.testimonials", { returnObjects: true }) as any[];
  const processSteps = (t("pg.processSteps", { returnObjects: true }) as any[]).map((step: any, i: number) => ({ ...step, icon: processIcons[i] || Search }));

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t("pg.seo.title")} description={t("pg.seo.description")} keywords={t("pg.seo.keywords")} path="/pg" jsonLd={{ "@context": "https://schema.org", "@type": "Service", "name": `${t("pg.seo.title")} - Webheads`, "provider": { "@type": "Organization", "name": "Webheads (웹헤즈)" }, "description": t("pg.seo.description"), "areaServed": "KR", "serviceType": t("pg.seo.title"), "url": `${BASE_URL}/pg` }} faqJsonLd={faqs} />

      {/* Hero */}
      <section className="relative flex items-center justify-center pt-28 pb-20 overflow-hidden">
        <HeroPatternBg theme="indigo-deep" />
        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", color: "white" }}>{t("pg.hero.badge")}</span>
          <h1 className="text-4xl lg:text-[3.2rem] font-bold leading-[1.15] mb-5 tracking-tight text-white" style={{ wordBreak: "keep-all" }}>{t("pg.hero.title")}<br /><span style={{ opacity: 0.95 }}>{t("pg.hero.titleHighlight")}</span></h1>
          <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.75)" }}>{t("pg.hero.desc")}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <a href="#contact" className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02]" style={{ background: "white", color: "hsl(235, 65%, 45%)" }}>{t("pg.hero.cta1")}</a>
            <a href="#partners" className="px-5 py-2.5 rounded-xl font-bold text-sm transition-colors border border-white/30 text-white hover:bg-white/10">{t("pg.hero.cta2")}</a>
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

      {/* Payment Methods */}
      <section className="py-20 bg-secondary border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-10">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("pg.paymentMethodsSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-3xl lg:text-4xl tracking-tight whitespace-pre-line">{t("pg.paymentMethodsSection.title")}</h2>
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
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("pg.featuresSection.title")}</h2>
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
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("pg.partnersSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("pg.partnersSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pgPartners.map((p: any, i: number) => (<div key={p.name} className="rounded-2xl p-6 bg-background border border-border hover:border-primary/30 hover:shadow-sm transition-all flex flex-col gap-3"><div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary text-primary-foreground font-bold text-xs">{String(i + 1).padStart(2, "0")}</div><div><span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mb-1">{p.category}</span><h4 className="font-bold text-foreground text-sm tracking-tight">{p.name}</h4><p className="text-muted-foreground text-xs mt-0.5">{p.desc}</p></div></div>))}
          </div>
        </div>
      </section>

      {/* Process */}
      <ServiceProcess
        steps={processSteps}
        heading={t("pg.processSection.title")}
        subheading={t("pg.processSection.sub")}
        description={t("pg.processSection.desc")}
      />


      <ServiceFAQ faqs={faqs} serviceName={t("pg.seo.title")} />
      <TestimonialSection testimonials={testimonials} />
      <ContactSection />
    </div>
  );
}
