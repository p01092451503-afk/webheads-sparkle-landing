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
      <SEO title={t("pg.seo.title")} description={t("pg.seo.description")} keywords={t("pg.seo.keywords")} path="/pg" breadcrumb={[{ name: t("pg.seo.title"), url: `${BASE_URL}/pg` }]} jsonLd={{ "@context": "https://schema.org", "@type": "Service", "name": `${t("pg.seo.title")} - Webheads`, "provider": { "@type": "Organization", "name": "Webheads (웹헤즈)" }, "description": t("pg.seo.description"), "areaServed": "KR", "serviceType": t("pg.seo.title"), "url": `${BASE_URL}/pg`, "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "300", "bestRating": "5", "worstRating": "1" } }} faqJsonLd={faqs} />

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

      {/* Stats - W */}
      <section className="py-[4.8rem] bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {stats.map((s: any) => (<div key={s.label} className="flex flex-col items-center justify-center py-6 px-4 text-center"><span className="block font-bold leading-none mb-2 text-4xl md:text-5xl text-foreground tracking-tight">{s.value}</span><span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span><span className="block text-xs text-muted-foreground">{s.sub}</span></div>))}
          </div>
        </div>
      </section>

      {/* Features - G */}
      <section className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("pg.featuresSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("pg.featuresSection.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f: any) => (<div key={f.title} className="rounded-2xl p-7 bg-background hover:bg-muted transition-colors duration-200 flex flex-col gap-3 border border-border hover:shadow-md"><div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary shadow-sm"><f.icon className="w-5 h-5 text-primary" /></div><h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3><p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p><div className="flex flex-wrap gap-1.5 mt-1">{f.tags.map((tag: string) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}</div></div>))}
          </div>
        </div>
      </section>

      {/* Payment Methods - W */}
      <section className="py-20 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-10">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("pg.paymentMethodsSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-3xl lg:text-4xl tracking-tight whitespace-pre-line">{t("pg.paymentMethodsSection.title")}</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {paymentMethods.map((method: string) => (<span key={method} className="px-4 py-2 rounded-full border border-border bg-secondary text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors">{method}</span>))}
          </div>
        </div>
      </section>

      {/* MidCTA - Blue */}
      <ServiceMidCTA heading={t("pg.midCTA.heading")} description={t("pg.midCTA.description")} />

      {/* Domestic PG Providers - G */}
      <section className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("pg.domesticPgSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("pg.domesticPgSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("pg.domesticPgSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(t("pg.domesticPgProviders", { returnObjects: true }) as any[]).map((provider: any) => (
              <div key={provider.name} className="rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
                <div className="p-7 flex flex-col gap-4 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-foreground text-lg tracking-tight">{provider.name}</h3>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">{provider.badge}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed" style={{ wordBreak: "keep-all" }}>{provider.desc}</p>
                  <ul className="flex flex-col gap-2 mt-1">
                    {provider.strengths.map((s: string) => (
                      <li key={s} className="flex items-center gap-2 text-sm">
                        <span className="text-primary font-bold shrink-0">✓</span>
                        <span className="text-foreground">{s}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-4 border-t border-border/60">
                    <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">{t("pg.bestForLabel")}:</span> {provider.bestFor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PG Partners - W */}
      <section id="partners" className="py-28 bg-background">
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

      {/* PG Selection Guide - G */}
      <section className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("pg.pgGuideSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("pg.pgGuideSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("pg.pgGuideSection.desc")}</p>
          </div>

          {/* Considerations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {(t("pg.pgConsiderations", { returnObjects: true }) as any[]).map((item: any, i: number) => (
              <div key={item.title} className="rounded-2xl p-7 bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-primary-foreground font-bold text-xs">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-bold text-foreground text-base tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed w-full overflow-hidden" style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Required Documents */}
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 bg-muted border-b border-border">
              <h3 className="font-bold text-foreground text-base">{t("pg.pgDocsSection.title")}</h3>
              <p className="text-muted-foreground text-xs mt-1">{t("pg.pgDocsSection.desc")}</p>
            </div>
            <div className="divide-y divide-border">
              {(t("pg.pgRequiredDocs", { returnObjects: true }) as any[]).map((doc: any, i: number) => (
                <div key={doc.doc} className="flex gap-4 px-6 py-5 hover:bg-muted/30 transition-colors">
                  <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center bg-primary/10 text-primary font-bold text-xs mt-0.5">{i + 1}</div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{doc.doc}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-1" style={{ wordBreak: "keep-all" }}>{doc.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 rounded-xl border border-border bg-background px-6 py-4">
            <p className="text-foreground font-semibold text-sm text-center sm:text-left" style={{ wordBreak: "keep-all" }}>{t("pg.pgGuideDocsCTA")}</p>
            <a href="#contact" className="shrink-0 inline-flex px-5 py-2.5 rounded-2xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">{t("pg.hero.cta1")}</a>
          </div>
        </div>
      </section>

      {/* Process - W */}
      <ServiceProcess bg="bg-background" 
        steps={processSteps}
        heading={t("pg.processSection.title")}
        subheading={t("pg.processSection.sub")}
        description={t("pg.processSection.desc")}
      />

      {/* Testimonials - G */}
      <TestimonialSection bg="bg-secondary" testimonials={testimonials} />

      {/* FAQ - W */}
      <ServiceFAQ bg="bg-background" faqs={faqs} serviceName={t("pg.seo.title")} />

      {/* Contact - W */}
      <ContactSection />
    </div>
  );
}
