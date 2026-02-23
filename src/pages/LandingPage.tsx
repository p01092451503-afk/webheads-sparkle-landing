import { Link } from "react-router-dom";
import {
  Server, Bot, Smartphone, Film, ShieldCheck, MessageCircle,
  CreditCard, Wrench, ArrowRight, CheckCircle2
} from "lucide-react";
import ContactSection from "@/components/ContactSection";
import SEO from "@/components/SEO";
import { useTranslation } from "react-i18next";

const serviceIcons = [Server, Wrench, Bot, Smartphone, ShieldCheck, MessageCircle, CreditCard, Film];
const servicePaths = ["/hosting", "/maintenance", "/chatbot", "/app-dev", "/drm", "/channel", "/pg", "/content"];
const serviceAccents = ["hsl(214, 90%, 52%)", "hsl(152, 70%, 40%)", "hsl(192, 90%, 45%)", "hsl(262, 80%, 55%)", "hsl(160, 80%, 38%)", "hsl(40, 90%, 45%)", "hsl(170, 75%, 38%)", "hsl(350, 80%, 55%)"];

export default function LandingPage() {
  const { t } = useTranslation();

  const services = (t("landing.services", { returnObjects: true }) as any[]).map((svc: any, i: number) => ({
    ...svc,
    icon: serviceIcons[i] || Server,
    path: servicePaths[i] || "/",
    accent: serviceAccents[i],
  }));
  const stats = t("landing.stats", { returnObjects: true }) as any[];
  const whyUs = t("landing.whyUs", { returnObjects: true }) as any[];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("landing.seo.title")}
        description={t("landing.seo.description")}
        keywords={t("landing.seo.keywords")}
        path="/"
      />

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-16 overflow-hidden bg-background">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <p className="text-sm font-semibold tracking-widest uppercase mb-6 text-primary" style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.1s forwards" }}>{t("landing.hero.sub")}</p>
          <h1 className="text-[2.8rem] md:text-[3.8rem] lg:text-[4.5rem] font-black leading-[1.15] tracking-tight text-foreground mb-6" style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.2s forwards" }}>
            {t("landing.hero.title1")}<br /><span className="text-primary">{t("landing.hero.title2")}</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-10 whitespace-pre-line" style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.35s forwards" }}>{t("landing.hero.desc")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center" style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.5s forwards" }}>
            <a href="#services" className="px-8 py-4 rounded-2xl text-base font-bold transition-all hover:opacity-90 bg-foreground text-background">{t("landing.hero.cta1")}</a>
            <a href="#contact" className="px-8 py-4 rounded-2xl text-base font-bold border transition-colors hover:bg-secondary border-border text-foreground">{t("landing.hero.cta2")}</a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 border-b border-border bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {stats.map((s: any) => (
              <div key={s.label} className="flex flex-col items-center py-6 px-4 text-center">
                <span className="block font-black text-4xl md:text-5xl text-foreground tracking-tight leading-none mb-2">{s.value}</span>
                <span className="block text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("landing.servicesSub")}</p>
            <h2 className="font-black text-foreground text-4xl lg:text-5xl tracking-tight leading-tight whitespace-pre-line">{t("landing.servicesTitle")}</h2>
          </div>

          <div className="flex flex-col gap-6">
            {services.map((svc: any) => (
              <Link
                key={svc.path}
                to={svc.path}
                className="group relative rounded-3xl p-8 md:p-10 transition-all duration-300 border border-border hover:border-transparent hover:shadow-lg bg-card"
              >
                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: svc.accent }} />
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: `${svc.accent}15` }}>
                    <svc.icon className="w-7 h-7" style={{ color: svc.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">{svc.title}</h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed whitespace-pre-line">{svc.desc}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                    <div className="flex flex-wrap gap-1.5">
                      {svc.highlights.map((h: string) => (
                        <span key={h} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${svc.accent}12`, color: svc.accent }}>{h}</span>
                      ))}
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                      {t("landing.viewMore")} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Webheads ── */}
      <section className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("landing.whyUsSub")}</p>
            <h2 className="font-black text-foreground text-4xl lg:text-5xl tracking-tight leading-tight whitespace-pre-line">{t("landing.whyUsTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyUs.map((item: any) => (
              <div key={item.num} className="rounded-3xl bg-background p-8 border border-border text-center">
                <span className="block text-5xl font-black text-primary/10 mb-4">{item.num}</span>
                <h3 className="text-lg font-bold text-foreground mb-3 tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <ContactSection />
    </div>
  );
}
