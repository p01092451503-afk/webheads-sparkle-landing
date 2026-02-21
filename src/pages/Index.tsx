import { Link } from "react-router-dom";
import {
  Server, Bot, Smartphone, Film, ShieldCheck, MessageCircle, ArrowRight, CheckCircle2, CreditCard
} from "lucide-react";
import ContactSection from "@/components/ContactSection";
import { useTranslation } from "react-i18next";

const serviceIcons = [Server, Bot, Smartphone, Film, ShieldCheck, MessageCircle, CreditCard];
const servicePaths = ["/hosting", "/chatbot", "/app-dev", "/content", "/drm", "/channel", "/pg"];
const serviceColors = ["from-blue-500 to-blue-700", "from-cyan-500 to-teal-600", "from-indigo-500 to-purple-600", "from-orange-400 to-rose-500", "from-emerald-500 to-teal-600", "from-yellow-400 to-orange-500", "from-emerald-400 to-teal-600"];
const serviceBgs = ["bg-blue-50", "bg-cyan-50", "bg-indigo-50", "bg-orange-50", "bg-emerald-50", "bg-yellow-50", "bg-emerald-50"];
const serviceIconColors = ["text-blue-600", "text-cyan-600", "text-indigo-600", "text-orange-600", "text-emerald-600", "text-yellow-600", "text-emerald-600"];

export default function Index() {
  const { t } = useTranslation();

  const services = (t("index.services", { returnObjects: true }) as any[]).map((svc: any, i: number) => ({
    ...svc,
    icon: serviceIcons[i] || Server,
    path: servicePaths[i] || "/",
    color: serviceColors[i],
    bg: serviceBgs[i],
    iconColor: serviceIconColors[i],
  }));
  const stats = t("index.stats", { returnObjects: true }) as any[];
  const whyItems = t("index.whyItems", { returnObjects: true }) as any[];

  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────── */}
      <section className="hero-section min-h-[85vh] flex items-center pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="feature-badge mb-6 animate-fade-in" style={{ opacity: 0, animationDelay: "0.1s" }}>
              {t("index.heroBadge")}
            </div>
            <h1
              className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6"
              style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.2s forwards" }}
            >
              {t("index.heroTitle1")}<br />
              <span className="text-transparent bg-clip-text bg-primary-gradient">
                {t("index.heroTitle2")}
              </span>
            </h1>
            <p
              className="text-white/60 text-lg lg:text-xl leading-relaxed mb-10 max-w-xl mx-auto"
              style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.35s forwards" }}
            >
              {t("index.heroDesc")}
            </p>
            <div
              className="flex flex-col sm:flex-row gap-3 justify-center"
              style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.5s forwards" }}
            >
              <a href="#services" className="btn-primary px-8 py-4 rounded-xl text-base font-semibold">
                {t("index.heroCta1")}
              </a>
              <a href="#contact" className="px-8 py-4 rounded-xl text-base font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors">
                {t("index.heroCta2")}
              </a>
            </div>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto mt-20"
            style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.65s forwards" }}
          >
            {stats.map((s: any) => (
              <div key={s.label} className="stat-card text-center p-5 rounded-2xl">
                <div className="text-3xl font-bold text-brand-cyan">{s.value}</div>
                <div className="text-white/50 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Grid ─────────────────────────── */}
      <section id="services" className="py-24 bg-muted/30 bg-grid-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">{t("index.servicesSub")}</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-4 mb-4">
              {t("index.servicesTitle")} <span className="text-primary">{t("index.servicesTitleHighlight")}</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t("index.servicesDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc: any, i: number) => (
              <Link
                key={svc.path}
                to={svc.path}
                className="service-card p-7 group block"
                style={{ opacity: 0, animation: `fade-up 0.6s ease-out ${0.1 + i * 0.08}s forwards` }}
              >
                <div className={`w-12 h-12 rounded-xl ${svc.bg} flex items-center justify-center mb-5`}>
                  <svc.icon className={`w-6 h-6 ${svc.iconColor}`} />
                </div>
                <div className="tag-chip mb-3">{svc.subtitle}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{svc.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{svc.desc}</p>
                <ul className="space-y-2 mb-6">
                  {svc.features.map((f: string) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                  {t("index.viewMore")} <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Webheads ──────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">WHY WEBHEADS</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-4 mb-4">
              {t("index.whyTitle")} <span className="text-primary">{t("index.whyTitleHighlight")}</span>{t("index.whyTitleEnd")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {whyItems.map((item: any) => (
              <div key={item.num} className="text-center p-8 rounded-2xl border border-border bg-card">
                <div className="text-5xl font-black text-primary/10 mb-4">{item.num}</div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────── */}
      <ContactSection />
    </div>
  );
}
