import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";
import HeroPatternBg from "@/components/visuals/HeroPatternBg";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import ServiceProcess from "@/components/shared/ServiceProcess";
import ServiceExtraFeatures from "@/components/shared/ServiceExtraFeatures";
import ServiceMidCTA from "@/components/shared/ServiceMidCTA";
import SEO, { BASE_URL } from "@/components/SEO";
import {
  Clock, Shield, PhoneCall, RefreshCw, BarChart3,
  AlertTriangle, Settings, HeadphonesIcon,
  FileSearch, Monitor, FileText,
  Code2, Paintbrush, LayoutDashboard, MonitorSmartphone, Puzzle, Layers,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const featureIcons = [Clock, RefreshCw, Shield, BarChart3, Settings, PhoneCall, AlertTriangle, HeadphonesIcon];
const processIcons = [FileSearch, Settings, Monitor, AlertTriangle, FileText];
const devFeatureIcons = [Code2, Paintbrush, LayoutDashboard, MonitorSmartphone, Puzzle, Layers];

export default function MaintenancePage() {
  const { t } = useTranslation();

  const features = (t("maintenance.features", { returnObjects: true }) as any[]).map((item, index) => ({
    ...item,
    icon: featureIcons[index] || Clock
  }));

  const processSteps = (t("maintenance.processSteps", { returnObjects: true }) as any[]).map((item, index) => ({
    ...item,
    icon: processIcons[index] || FileSearch
  }));

  const devFeatures = (t("maintenance.devFeatures", { returnObjects: true }) as any[]).map((item, index) => ({
    ...item,
    icon: devFeatureIcons[index] || Code2
  }));

  const plans = t("maintenance.plans", { returnObjects: true }) as any[];
  const stats = t("maintenance.stats", { returnObjects: true }) as any[];
  const faqs = t("maintenance.faqs", { returnObjects: true }) as any[];
  const testimonials = t("maintenance.testimonials", { returnObjects: true }) as any[];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("maintenance.seo.title")}
        description={t("maintenance.seo.description")}
        keywords={t("maintenance.seo.keywords")}
        path="/maintenance"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": `${t("maintenance.seo.title")} - Webheads`,
          "provider": { "@type": "Organization", "name": "Webheads (웹헤즈)" },
          "description": t("maintenance.seo.description"),
          "areaServed": "KR",
          "serviceType": t("maintenance.seo.title"),
          "url": `${BASE_URL}/maintenance`
        }}
        faqJsonLd={faqs}
      />

      <section className="relative flex items-center justify-center pt-28 pb-20 overflow-hidden">
        <HeroPatternBg theme="slate-orange" />
        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", color: "white" }}>{t("maintenance.hero.badge")}</span>
          <h1 className="text-4xl lg:text-[3.2rem] font-bold leading-[1.15] mb-5 tracking-tight text-white" style={{ wordBreak: "keep-all" }}>{t("maintenance.hero.title")}<br /><span style={{ opacity: 0.95 }}>{t("maintenance.hero.titleHighlight")}</span></h1>
          <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.75)" }}>{t("maintenance.hero.desc")}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <a href="#contact" className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02]" style={{ background: "white", color: "hsl(245, 70%, 50%)" }}>{t("maintenance.hero.cta1")}</a>
            <a href="#plans" className="px-5 py-2.5 rounded-xl font-bold text-sm transition-colors border border-white/30 text-white hover:bg-white/10">{t("maintenance.hero.cta2")}</a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-[4.8rem] bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {stats.map((s: any) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-6 px-4 text-center">
                <span className="block font-bold leading-none mb-2 text-4xl md:text-5xl text-foreground tracking-tight">{s.value}</span>
                <span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span>
                <span className="block text-xs text-muted-foreground">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 주요 서비스 */}
      <section className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("maintenance.featuresSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">
              {t("maintenance.featuresSection.title")}
            </h2>
            <p className="text-muted-foreground mt-4 text-base">
              {t("maintenance.featuresSection.desc")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f: any) => (
              <div key={f.title} className="rounded-2xl p-7 bg-background hover:bg-muted transition-colors duration-200 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary shadow-sm">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {f.tags.map((tag: string) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceMidCTA heading={t("maintenance.midCTA.heading")} description={t("maintenance.midCTA.description")} />
      <ServiceExtraFeatures features={devFeatures} subheading={t("maintenance.extraSection.sub")} heading={t("maintenance.extraSection.heading")} description={t("maintenance.extraSection.desc")} />
      <ServiceProcess steps={processSteps} subheading={t("maintenance.processSection.sub")} heading={t("maintenance.processSection.heading")} description={t("maintenance.processSection.desc")} />

      {/* Plans */}
      <section id="plans" className="py-28" style={{ background: "var(--plans-bg)" }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("maintenance.plansSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">
              {t("maintenance.plansSection.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan: any) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl flex flex-col gap-0 transition-all duration-200 overflow-hidden ${
                  plan.highlight
                    ? "bg-background border-2 border-primary shadow-xl scale-[1.02]"
                    : "bg-background border border-border hover:border-muted-foreground/30 hover:shadow-md"
                }`}
              >
                {plan.badge && (
                  <div className="bg-primary text-primary-foreground text-sm font-bold text-center py-2.5 tracking-wide">{plan.badge}</div>
                )}
                <div className="p-8 flex flex-col gap-5 flex-1">
                  <div>
                    <h3 className={`font-bold text-3xl tracking-tight ${plan.highlight ? "text-primary" : "text-foreground"}`}>{plan.name}</h3>
                    <div className={`h-px mt-4 ${plan.highlight ? "bg-primary/20" : "bg-border"}`} />
                  </div>
                  <div>
                    <div className="flex items-end gap-1">
                      <span className={`font-bold leading-none tracking-tight text-4xl ${plan.highlight ? "text-primary" : "text-foreground"}`}>{plan.price}</span>
                      {plan.unit && <span className="text-base font-semibold text-muted-foreground mb-1">{plan.unit}</span>}
                    </div>
                    {plan.priceNote && <p className="text-sm text-muted-foreground mt-1.5">{plan.priceNote}</p>}
                  </div>
                  <ul className="flex flex-col gap-3.5 flex-1">
                    {plan.features.map((f: any) => (
                      <li key={f.main} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5 text-sm text-primary">✓</span>
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
          {/* 맞춤 견적 CTA */}
          <div className="mt-12 text-center rounded-2xl border border-border bg-secondary/50 p-8">
            <p className="text-foreground font-semibold text-lg mb-2">{t("maintenance.plansCustom.title")}</p>
            <p className="text-muted-foreground text-sm mb-6">{t("maintenance.plansCustom.desc")}</p>
            <a href="#contact" className="inline-flex px-8 py-3.5 rounded-2xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              {t("maintenance.plansCustom.cta")}
            </a>
          </div>
        </div>
      </section>

      <ServiceFAQ faqs={faqs} serviceName="유지보수 서비스" />
      <TestimonialSection testimonials={testimonials} />
      <ContactSection />
    </div>
  );
}