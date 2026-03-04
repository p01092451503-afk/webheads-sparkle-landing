import ChatbotArchDiagram from "@/components/visuals/ChatbotArchDiagram";
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
import { Bot, Brain, MessageSquare, BarChart3, Link2, Globe, Zap, ShieldCheck, RefreshCw, Users, Search, FileSearch, Code2, Rocket, Cpu, Server, Gauge, Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const OpenAILogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
  </svg>
);

const AnthropicLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.257 0h3.603L16.743 20.48h-3.603L6.57 3.52zM0 20.48h3.603L10.173 3.52H6.57L0 20.48z" />
  </svg>
);

const modelLogos: Record<string, React.FC<{ className?: string }>> = {
  "GPT-4o": OpenAILogo,
  "GPT-4o mini": OpenAILogo,
  "Claude 3.5 Sonnet": AnthropicLogo,
};

const featureIcons = [Brain, MessageSquare, Zap, Globe, Link2, BarChart3, ShieldCheck, RefreshCw, Users];
const processIcons = [Search, FileSearch, Code2, Rocket];

export default function ChatbotPage() {
  const { t } = useTranslation();

  const features = (t("chatbot.features", { returnObjects: true }) as any[]).map((item: any, index: number) => ({ ...item, icon: featureIcons[index] || Brain }));
  const stats = t("chatbot.stats", { returnObjects: true }) as any[];
  const processSteps = (t("chatbot.processSteps", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: processIcons[i] || Search }));
  const plans = t("chatbot.plans", { returnObjects: true }) as any[];
  const faqs = t("chatbot.faqs", { returnObjects: true }) as any[];
  const testimonials = t("chatbot.testimonials", { returnObjects: true }) as any[];
  const techSpecs = t("chatbot.techSpecs", { returnObjects: true }) as any;
  const techSpecsSection = t("chatbot.techSpecsSection", { returnObjects: true }) as any;
  const beforeAfter = t("chatbot.beforeAfter", { returnObjects: true }) as any[];
  const caseStudies = t("chatbot.caseStudies", { returnObjects: true }) as any[];
  const comparisonHeaders = t("chatbot.comparisonHeaders", { returnObjects: true }) as string[];
  const comparisonRows = t("chatbot.comparisonRows", { returnObjects: true }) as any[];

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t("chatbot.seo.title")} description={t("chatbot.seo.description")} keywords={t("chatbot.seo.keywords")} path="/chatbot" breadcrumb={[{ name: t("chatbot.seo.title"), url: `${BASE_URL}/chatbot` }]} jsonLd={{ "@context": "https://schema.org", "@type": "Service", "name": `${t("chatbot.seo.title")} - Webheads`, "provider": { "@type": "Organization", "name": "Webheads (웹헤즈)" }, "description": t("chatbot.seo.description"), "areaServed": "KR", "serviceType": t("chatbot.seo.title"), "url": `${BASE_URL}/chatbot`, "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "300", "bestRating": "5", "worstRating": "1" } }} faqJsonLd={faqs} />

      {/* Hero */}
      <section className="relative flex items-center justify-center pt-28 pb-20 overflow-hidden">
        <HeroPatternBg theme="teal-cyan" />
        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", color: "white" }}>{t("chatbot.hero.badge")}</span>
          <h1 className="text-4xl lg:text-[3.2rem] font-bold leading-[1.15] mb-5 tracking-tight text-white" style={{ wordBreak: "keep-all" }}>{t("chatbot.hero.title")}<br /><span style={{ opacity: 0.95 }}>{t("chatbot.hero.titleHighlight")}</span></h1>
          <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.75)" }}>{t("chatbot.hero.desc")}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <a href="#contact" className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02]" style={{ background: "white", color: "hsl(190, 70%, 38%)" }}>{t("chatbot.hero.cta1")}</a>
            <a href="#process" className="px-5 py-2.5 rounded-xl font-bold text-sm transition-colors border border-white/30 text-white hover:bg-white/10">{t("chatbot.hero.cta2")}</a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-[4.8rem] bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-3 gap-0 divide-x divide-border">
            {stats.map((s: any) => (<div key={s.label} className="flex flex-col items-center justify-center py-6 px-4 text-center"><span className="block font-bold leading-none mb-2 text-5xl md:text-6xl text-foreground tracking-tight">{s.value}</span><span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span><span className="block text-xs text-muted-foreground">{s.sub}</span></div>))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("chatbot.featuresSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("chatbot.featuresSection.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f: any) => (<div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm"><f.icon className="w-5 h-5 text-primary" /></div><h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3><p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p><div className="flex flex-wrap gap-1.5 mt-1">{f.tags.map((tag: string) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}</div></div>))}
          </div>
        </div>
      </section>

      {/* Tech Specs */}
      <section className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{techSpecsSection.sub}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{techSpecsSection.title}</h2>
            <p className="text-muted-foreground mt-4 text-base">{techSpecsSection.desc}</p>
          </div>
          <div className="mb-12">
            <h3 className="font-bold text-foreground text-xl mb-6 flex items-center gap-2"><Cpu className="w-5 h-5 text-primary" />{techSpecs.llmModels.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {techSpecs.llmModels.items.map((model: any) => {
                const LogoComponent = modelLogos[model.name];
                return (
                  <div key={model.name} className="rounded-2xl p-6 bg-background border border-border hover:border-primary/30 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-secondary">
                          {LogoComponent ? <LogoComponent className="w-5 h-5 text-foreground" /> : <Settings2 className="w-5 h-5 text-primary" />}
                        </div>
                        <div>
                          <span className="font-bold text-foreground text-lg">{model.name}</span>
                          <span className="text-muted-foreground text-sm ml-2">by {model.provider}</span>
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full font-semibold bg-primary/10 text-primary">{model.badge}</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{model.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mb-12">
            <h3 className="font-bold text-foreground text-xl mb-6 flex items-center gap-2"><Server className="w-5 h-5 text-primary" />{techSpecs.architecture.title}</h3>
            <div className="rounded-2xl bg-background border border-border overflow-hidden divide-y divide-border">
              {techSpecs.architecture.items.map((item: any) => (<div key={item.label} className="flex flex-col sm:flex-row gap-2 sm:gap-6 px-6 py-4"><span className="font-semibold text-foreground text-sm whitespace-nowrap min-w-[140px]">{item.label}</span><span className="text-muted-foreground text-sm leading-relaxed">{item.value}</span></div>))}
            </div>
            <div className="mt-8">
              <ChatbotArchDiagram />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-foreground text-xl mb-6 flex items-center gap-2"><Gauge className="w-5 h-5 text-primary" />{techSpecs.performance.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {techSpecs.performance.items.map((item: any) => (<div key={item.metric} className="rounded-2xl p-6 bg-background border border-border text-center"><span className="block font-bold text-3xl text-primary mb-1">{item.value}</span><span className="block font-semibold text-foreground text-sm mb-0.5">{item.metric}</span><span className="block text-xs text-muted-foreground">{item.desc}</span></div>))}
            </div>
          </div>
        </div>
      </section>

      <ServiceBeforeAfter items={beforeAfter} subheading={t("chatbot.beforeAfterSection.sub")} heading={t("chatbot.beforeAfterSection.heading")} description={t("chatbot.beforeAfterSection.desc")} />
      <ServiceMidCTA heading={t("chatbot.midCTA.heading")} description={t("chatbot.midCTA.description")} ctaText={t("chatbot.midCTA.ctaText")} />
      <ServiceProcess steps={processSteps} subheading={t("chatbot.processSection.sub")} heading={t("chatbot.processSection.heading")} description={t("chatbot.processSection.desc")} />
      <ServiceComparison headers={comparisonHeaders} rows={comparisonRows} subheading={t("chatbot.comparisonSection.sub")} heading={t("chatbot.comparisonSection.heading")} description={t("chatbot.comparisonSection.desc")} />

      {/* Plans */}
      <section id="plans" className="py-28" style={{ background: "var(--plans-bg)" }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("chatbot.plansSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("chatbot.plansSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("chatbot.plansSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {plans.map((plan: any) => (<div key={plan.name} className={`relative rounded-3xl flex flex-col gap-0 transition-all duration-200 overflow-hidden ${plan.highlight ? "bg-background border-2 border-primary shadow-xl scale-[1.02]" : "bg-background border border-border hover:border-muted-foreground/30 hover:shadow-md"}`}>{plan.badge && <div className="bg-primary text-primary-foreground text-sm font-bold text-center py-2.5 tracking-wide">{plan.badge}</div>}<div className="p-8 flex flex-col gap-5 flex-1"><div><h3 className={`font-bold text-3xl tracking-tight ${plan.highlight ? "text-primary" : "text-foreground"}`}>{plan.name}</h3><div className={`h-px mt-4 ${plan.highlight ? "bg-primary/20" : "bg-border"}`} /></div><div><div className="flex items-end gap-1"><span className={`font-bold leading-none tracking-tight text-4xl ${plan.highlight ? "text-primary" : "text-foreground"}`}>{plan.price}</span>{plan.unit && <span className="text-base font-semibold text-muted-foreground mb-1">{plan.unit}</span>}</div>{plan.priceNote && <p className="text-sm text-muted-foreground mt-1.5">{plan.priceNote}</p>}</div><ul className="flex flex-col gap-3.5 flex-1">{plan.features.map((f: any) => (<li key={f.main} className="flex items-start gap-2.5"><span className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5 text-sm text-primary">✓</span><p className="text-base font-medium text-foreground leading-tight">{f.main}</p></li>))}</ul><div className="rounded-xl p-4 mt-2 bg-foreground"><p className="text-sm text-background/60 leading-relaxed text-center">{plan.recommend}</p></div></div></div>))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 rounded-xl border border-border bg-muted px-6 py-4">
            <p className="text-foreground font-semibold text-sm">{t("chatbot.plansCustom.title")} <span className="font-normal text-muted-foreground">{t("chatbot.plansCustom.desc")}</span></p>
            <a href="#contact" className="shrink-0 inline-flex px-5 py-2.5 rounded-2xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">{t("chatbot.plansCustom.cta")}</a>
          </div>
        </div>
      </section>

      <ServiceCaseStudy cases={caseStudies} subheading={t("chatbot.caseStudySection.sub")} heading={t("chatbot.caseStudySection.heading")} description={t("chatbot.caseStudySection.desc")} />
      <TestimonialSection testimonials={testimonials} />
      <ServiceFAQ faqs={faqs} serviceName={t("chatbot.seo.title")} />
      <ContactSection />
    </div>
  );
}
