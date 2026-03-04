import { Link } from "react-router-dom";
import { Check, Gift, Shield, Settings, Clock, ArrowRight, CalendarDays, MessageSquare, FileCheck, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import HeroPatternBg from "@/components/visuals/HeroPatternBg";

const benefitIcons = [Gift, Shield, Settings];
const benefitAccents = [
  { accent: "hsl(340, 55%, 50%)", accentBg: "hsl(340, 60%, 94%)" },
  { accent: "hsl(280, 45%, 50%)", accentBg: "hsl(280, 50%, 94%)" },
  { accent: "hsl(320, 50%, 48%)", accentBg: "hsl(320, 55%, 94%)" },
];

export default function EventPage() {
  const { t } = useTranslation();

  const benefits = (t("event.benefits.items", { returnObjects: true }) as any[]);
  const conditions = (t("event.conditions.items", { returnObjects: true }) as string[]);
  const steps = (t("event.steps.items", { returnObjects: true }) as any[]);
  const faqs = (t("event.faqs.items", { returnObjects: true }) as any[]);

  return (
    <>
      <SEO
        title={t("event.seo.title")}
        description={t("event.seo.description")}
      />

      {/* Hero */}
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
        <HeroPatternBg theme="rose-spring" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 text-sm font-bold backdrop-blur-sm" style={{ background: "hsl(340, 70%, 85%)", color: "hsl(340, 55%, 25%)" }}>
            <Clock className="w-4 h-4" />
            {t("event.hero.deadline")}
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-6" style={{ color: "hsl(340, 35%, 18%)" }}>
            {t("event.hero.title1")}<br />
            <span style={{ color: "hsl(340, 55%, 42%)" }}>{t("event.hero.titleHighlight")}</span> {t("event.hero.title2")}
          </h1>
          <p className="text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "hsl(340, 15%, 40%)" }}>
            {t("event.hero.desc")}<br />
            {t("event.hero.descPrefix")}<strong style={{ color: "hsl(340, 40%, 25%)" }}>{t("event.hero.descValue")}</strong>{t("event.hero.descSuffix")}
          </p>
          <Link
            to="/lms#contact"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-lg transition-all text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, hsl(340, 55%, 48%) 0%, hsl(320, 50%, 45%) 100%)" }}
          >
            {t("event.hero.cta")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <p className="text-sm font-bold tracking-widest uppercase text-center mb-3" style={{ color: "hsl(340, 50%, 55%)" }}>
            {t("event.benefits.label")}
          </p>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground text-center mb-4">
            {t("event.benefits.title")}
          </h2>
          <p className="text-muted-foreground text-center mb-12 text-lg">
            {t("event.benefits.desc")}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((b: any, i: number) => {
              const Icon = benefitIcons[i] || Gift;
              const colors = benefitAccents[i] || benefitAccents[0];
              return (
                <div
                  key={b.title}
                  className="group relative rounded-2xl border border-border bg-card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: colors.accent }} />
                  <div className="absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-bold" style={{ background: colors.accentBg, color: colors.accent }}>
                    {b.value}
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: colors.accentBg }}>
                    <Icon className="w-6 h-6" style={{ color: colors.accent }} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Conditions — compact inline */}
      <section className="py-6 border-y border-border">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center text-sm text-muted-foreground">
            <span className="font-semibold text-foreground mr-1">{t("event.conditions.label")}</span>
            {conditions.map((item: string) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(340, 50%, 50%)" }} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <div className="container mx-auto px-6 max-w-5xl">
          <p className="text-sm font-bold tracking-widest uppercase text-center mb-3" style={{ color: "hsl(340, 50%, 55%)" }}>
            {t("event.steps.label")}
          </p>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground text-center mb-14">
            {t("event.steps.title")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px" style={{ background: "linear-gradient(90deg, hsl(340, 50%, 80%), hsl(280, 40%, 80%))" }} />
            {steps.map((s: any, i: number) => (
              <div key={s.step} className="text-center relative">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-black text-lg relative z-10 shadow-md"
                  style={{ background: `hsl(${340 - i * 20}, ${50 + i * 3}%, ${48 + i * 2}%)` }}
                >
                  {s.step}
                </div>
                <h3 className="font-bold text-foreground mb-1.5">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <p className="text-sm font-bold tracking-widest uppercase text-center mb-3" style={{ color: "hsl(340, 50%, 55%)" }}>
            {t("event.faqs.label")}
          </p>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground text-center mb-10">
            {t("event.faqs.title")}
          </h2>
          <div className="space-y-3">
            {faqs.map((f: any) => (
              <div key={f.q} className="bg-muted/60 rounded-xl p-6 hover:bg-muted transition-colors">
                <h3 className="font-bold text-foreground mb-2 flex items-start gap-2">
                  <span className="shrink-0 text-sm font-black mt-0.5" style={{ color: "hsl(340, 50%, 50%)" }}>Q.</span>
                  {f.q}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed pl-6">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(340, 50%, 92%) 0%, hsl(320, 45%, 90%) 50%, hsl(280, 40%, 93%) 100%)" }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full blur-[100px] opacity-30" style={{ background: "hsl(340, 60%, 85%)" }} />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full blur-[80px] opacity-20" style={{ background: "hsl(280, 50%, 88%)" }} />
        </div>
        <div className="container mx-auto px-6 max-w-3xl text-center relative z-10">
          <CalendarDays className="w-10 h-10 mx-auto mb-4" style={{ color: "hsl(340, 50%, 45%)" }} />
          <h2 className="text-2xl lg:text-3xl font-black mb-4" style={{ color: "hsl(340, 40%, 20%)" }}>
            {t("event.cta.title")}
          </h2>
          <p className="mb-8" style={{ color: "hsl(340, 20%, 40%)" }}>
            {t("event.cta.desc")}
          </p>
          <Link
            to="/lms#contact"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-lg transition-all text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, hsl(340, 55%, 48%) 0%, hsl(320, 50%, 45%) 100%)" }}
          >
            {t("event.cta.button")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
