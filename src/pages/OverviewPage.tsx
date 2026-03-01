import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import {
  GraduationCap, Server, Wrench, Bot, Smartphone, ShieldCheck,
  MessageSquare, CreditCard, Film, ArrowRight, Phone, CheckCircle2,
  Users, Clock, Award, Zap
} from "lucide-react";

const serviceCards = [
  { key: "lms", icon: GraduationCap, path: "/lms", accent: "hsl(255,75%,58%)" },
  { key: "hosting", icon: Server, path: "/hosting", accent: "hsl(200,70%,50%)" },
  { key: "maintenance", icon: Wrench, path: "/maintenance", accent: "hsl(210,40%,50%)" },
  { key: "chatbot", icon: Bot, path: "/chatbot", accent: "hsl(190,70%,45%)" },
  { key: "appdev", icon: Smartphone, path: "/app-dev", accent: "hsl(165,55%,45%)" },
  { key: "drm", icon: ShieldCheck, path: "/drm", accent: "hsl(225,60%,55%)" },
  { key: "channel", icon: MessageSquare, path: "/channel", accent: "hsl(155,55%,45%)" },
  { key: "pg", icon: CreditCard, path: "/pg", accent: "hsl(240,55%,55%)" },
  { key: "content", icon: Film, path: "/content", accent: "hsl(30,65%,50%)" },
];

const statIcons = [Users, Clock, Award, Zap];

export default function OverviewPage() {
  const { t } = useTranslation();

  const stats = t("overview.stats", { returnObjects: true }) as { value: string; label: string }[];
  const services = t("overview.services", { returnObjects: true }) as {
    title: string; desc: string; highlights: string[];
  }[];
  const strengths = t("overview.strengths", { returnObjects: true }) as {
    title: string; desc: string;
  }[];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("overview.seo.title")}
        description={t("overview.seo.description")}
        keywords={t("overview.seo.keywords")}
        path="/overview"
      />

      {/* ── Hero ── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: "var(--hero-gradient)" }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]" />
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-6 bg-primary/10 text-primary border border-primary/20">
            {t("overview.hero.badge")}
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-primary-foreground"
            style={{ fontWeight: 900 }}
          >
            {t("overview.hero.title")}
          </h1>
          <p className="mt-5 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto text-primary-foreground/70 whitespace-pre-line">
            {t("overview.hero.desc")}
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <a
              href="#services"
              className="px-5 py-2.5 rounded-2xl text-sm font-bold transition-all bg-primary-foreground text-foreground hover:opacity-90"
            >
              {t("overview.hero.cta1")}
            </a>
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              {t("overview.hero.cta2")}
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-10 bg-secondary">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => {
              const Icon = statIcons[i] || Users;
              return (
                <div key={i} className="text-center py-4">
                  <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-black tracking-tight text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Company Intro ── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            {t("overview.intro.sub")}
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground mb-5">
            {t("overview.intro.title")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {t("overview.intro.desc")}
          </p>
        </div>
      </section>

      {/* ── Strengths ── */}
      <section className="py-14 bg-secondary">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground text-center mb-8">
            {t("overview.strengthsTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strengths.map((s, i) => (
              <div key={i} className="rounded-2xl p-6 bg-background border border-border">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary font-black text-sm mb-3">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-bold text-sm text-foreground mb-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-16 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
              {t("overview.servicesSection.sub")}
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              {t("overview.servicesSection.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc, i) => {
              const card = serviceCards[i];
              if (!card) return null;
              const Icon = card.icon;
              return (
                <a
                  key={card.key}
                  href={card.path}
                  className="group rounded-2xl p-6 bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all flex flex-col gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: card.accent + "1a", color: card.accent }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed flex-1">
                    {svc.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {svc.highlights.map((h, j) => (
                      <span key={j} className="tag-chip">{h}</span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-1">
                    {t("overview.viewMore")} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Webheads (Compact) ── */}
      <section className="py-14" style={{ background: "var(--navy-gradient)" }}>
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-primary-foreground mb-4">
            {t("overview.whyTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-primary-foreground/70 whitespace-pre-line mb-8">
            {t("overview.whyDesc")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
            {(t("overview.whyPoints", { returnObjects: true }) as string[]).map((point, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                <span className="text-xs text-primary-foreground/80 font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / Contact ── */}
      <section id="contact" className="py-16 bg-background">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h2
            className="text-2xl lg:text-3xl leading-tight tracking-tight text-primary mb-4"
            style={{ fontWeight: 900 }}
          >
            {t("overview.cta.title")}
          </h2>
          <p className="text-sm text-muted-foreground mb-8 whitespace-pre-line">
            {t("overview.cta.desc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/lms#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all bg-foreground text-background hover:opacity-90"
            >
              {t("overview.cta.btn1")}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="tel:02-336-4338"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all border border-border text-foreground hover:bg-secondary"
            >
              <Phone className="w-4 h-4" />
              {t("overview.cta.btn2")}
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            {t("overview.cta.note")}
          </p>
        </div>
      </section>
    </div>
  );
}
