import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import HeroPatternBg from "@/components/visuals/HeroPatternBg";
import {
  GraduationCap, Server, Wrench, Bot, Smartphone, ShieldCheck,
  MessageSquare, CreditCard, Film, ArrowRight, Phone, CheckCircle2,
  Users, Clock, Award, Zap, Check, X, Triangle, ChevronRight
} from "lucide-react";

/* ── Service config ── */
const serviceCards = [
  { key: "hosting", icon: Server, accent: "hsl(200,70%,50%)", path: "/hosting" },
  { key: "maintenance", icon: Wrench, accent: "hsl(210,40%,50%)", path: "/maintenance" },
  { key: "chatbot", icon: Bot, accent: "hsl(190,70%,45%)", path: "/chatbot" },
  { key: "appdev", icon: Smartphone, accent: "hsl(165,55%,45%)", path: "/app-dev" },
  { key: "drm", icon: ShieldCheck, accent: "hsl(225,60%,55%)", path: "/drm" },
  { key: "channel", icon: MessageSquare, accent: "hsl(155,55%,45%)", path: "/channel" },
  { key: "pg", icon: CreditCard, accent: "hsl(240,55%,55%)", path: "/pg" },
  { key: "content", icon: Film, accent: "hsl(30,65%,50%)", path: "/content" },
];

/* ── Helper: comparison cell icon ── */
function CellIcon({ val }: { val: string }) {
  if (val === "O") return <Check className="w-4 h-4 text-green-600 mx-auto" />;
  if (val === "X") return <X className="w-4 h-4 text-red-400 mx-auto" />;
  if (val === "△") return <Triangle className="w-3.5 h-3.5 text-yellow-500 mx-auto" />;
  return <span className="text-xs">{val}</span>;
}

/* ── Section divider ── */
const Divider = () => (
  <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(255,75%,58%,0.2), transparent)" }} />
);

/* ── Section heading ── */
function SectionHead({ sub, title, desc, light = false }: { sub: string; title: string; desc?: string; light?: boolean }) {
  return (
    <div className="text-center mb-10">
      <p className={`text-sm font-bold tracking-[0.2em] uppercase mb-3 ${light ? "text-blue-300" : "text-[hsl(255,75%,58%)]"}`}>{sub}</p>
      <h2 className={`text-2xl lg:text-4xl font-bold tracking-tight whitespace-pre-line ${light ? "text-white" : "text-foreground"}`}>{title}</h2>
      {desc && <p className={`mt-3 text-base leading-relaxed max-w-2xl mx-auto ${light ? "text-white/60" : "text-muted-foreground"}`}>{desc}</p>}
    </div>
  );
}

export default function OverviewPage() {
  const { t } = useTranslation();

  /* ── LMS data ── */
  const lmsStats = t("lms.stats", { returnObjects: true }) as { value: string; label: string; sub: string }[];
  const lmsPlans = t("lms.plans", { returnObjects: true }) as any[];
  const compHeaders = t("lms.comparisonTable.headers", { returnObjects: true }) as string[];
  const compRows = t("lms.comparisonTable.rows", { returnObjects: true }) as string[][];
  const competitorHeaders = t("lms.competitorTable.headers", { returnObjects: true }) as string[];
  const competitorRows = t("lms.competitorTable.rows", { returnObjects: true }) as string[][];
  const aiFeatures = t("lms.aiFeatures", { returnObjects: true }) as { title: string; desc: string }[];
  const cloudFeats = (t("lms.cloudFeatures", { returnObjects: true }) as { title: string; desc: string }[]).slice(0, 6);
  const neoFeats = (t("lms.neoFeatures", { returnObjects: true }) as { title: string; desc: string }[]).slice(0, 6);

  /* ── Service data (from overview translations) ── */
  const ovServices = t("overview.services", { returnObjects: true }) as { title: string; desc: string; highlights: string[] }[];
  const ovStrengths = t("overview.strengths", { returnObjects: true }) as { title: string; desc: string }[];
  const ovStats = t("overview.stats", { returnObjects: true }) as { value: string; label: string }[];
  const whyPoints = t("overview.whyPoints", { returnObjects: true }) as string[];

  /* ── Hosting plans ── */
  const hostingPlans = t("hosting.plans", { returnObjects: true }) as any[];
  /* ── Maintenance plans ── */
  const maintenancePlans = t("maintenance.plans", { returnObjects: true }) as any[];
  /* ── Chatbot plans ── */
  const chatbotPlans = t("chatbot.plans", { returnObjects: true }) as any[];
  /* ── AppDev plans ── */
  const appdevPlans = t("appdev.plans", { returnObjects: true }) as any[];

  const statIcons = [Users, Clock, Award, Zap];

  return (
    <div className="min-h-screen" style={{ background: "hsl(252, 30%, 97%)" }} data-page="overview">
      <SEO
        title={t("overview.seo.title")}
        description={t("overview.seo.description")}
        keywords={t("overview.seo.keywords")}
        path="/overview"
      />

      {/* ═══════════════════════════════════════════════
          HERO — LMS Purple-Blue Theme
      ═══════════════════════════════════════════════ */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <HeroPatternBg theme="blue-purple" />
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] mb-6" style={{ background: "hsl(255,75%,58%,0.15)", color: "hsl(255,75%,72%)", border: "1px solid hsl(255,75%,58%,0.25)" }}>
            {t("overview.hero.badge")}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[2.8rem] leading-[1.35] tracking-tight text-white whitespace-pre-line" style={{ fontWeight: 900 }}>
            {t("overview.hero.title")}
          </h1>
          <p className="mt-5 text-sm sm:text-base leading-[1.9] max-w-2xl mx-auto text-white/60 whitespace-pre-line">
            {t("overview.hero.desc")}
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <a href="#lms" className="px-5 py-2.5 rounded-2xl text-sm font-bold transition-all text-white hover:opacity-90" style={{ background: "hsl(255,75%,58%)" }}>
              {t("overview.hero.cta1")}
            </a>
            <a href="#contact" className="px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border text-white/80 hover:text-white" style={{ borderColor: "hsl(255,75%,58%,0.4)" }}>
              {t("overview.hero.cta2")}
            </a>
          </div>
        </div>
      </section>

      {/* ── Company Stats ── */}
      <section className="py-10" style={{ background: "linear-gradient(180deg, hsl(250,35%,94%) 0%, hsl(252,30%,97%) 100%)" }}>
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ovStats.map((s, i) => {
              const Icon = statIcons[i] || Users;
              return (
                <div key={i} className="text-center py-4">
                  <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: "hsl(255,75%,58%)" }} />
                  <p className="text-2xl font-black tracking-tight text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Company Intro + Strengths ── */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "hsl(255,75%,58%)" }}>ABOUT WEBHEADS</p>
            <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-foreground mb-5">{t("overview.intro.title")}</h2>
            <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line max-w-2xl mx-auto">{t("overview.intro.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ovStrengths.map((s, i) => (
              <div key={i} className="rounded-2xl p-6 bg-white border border-border shadow-sm">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm mb-3" style={{ background: "hsl(255,75%,58%,0.1)", color: "hsl(255,75%,58%)" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-bold text-base text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════
          LMS — Core Service (Detailed)
      ═══════════════════════════════════════════════ */}
      <section id="lms" className="py-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <SectionHead sub="CORE SERVICE" title="LMS (학습 관리 시스템)" desc="클라우드형(AI), 구축형(NEO), SaaS형 — 비즈니스 목적에 맞는 최적의 LMS를 선택하세요." />

          {/* LMS Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {lmsStats.map((s, i) => (
              <div key={i} className="rounded-xl p-5 text-center" style={{ background: "linear-gradient(135deg, hsl(250,40%,12%), hsl(220,50%,16%))" }}>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-sm text-white/70 font-medium mt-1">{s.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Cloud vs NEO Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
            {/* Cloud AI */}
            <div className="rounded-2xl border border-border bg-white p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(255,75%,58%,0.12)", color: "hsl(255,75%,58%)" }}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">{t("lms.cloud.name")}</h3>
                  <p className="text-xs text-muted-foreground">{t("lms.cloud.subtitle")}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{t("lms.cloud.desc")}</p>
              <div className="grid grid-cols-2 gap-2.5">
                {cloudFeats.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "hsl(255,75%,58%)" }} />
                    <span className="text-sm text-foreground font-medium">{f.title}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* NEO */}
            <div className="rounded-2xl border border-border bg-white p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(220,90%,56%,0.12)", color: "hsl(220,90%,56%)" }}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">{t("lms.neo.name")}</h3>
                  <p className="text-xs text-muted-foreground">{t("lms.neo.subtitle")}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{t("lms.neo.desc")}</p>
              <div className="grid grid-cols-2 gap-2.5">
                {neoFeats.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "hsl(220,90%,56%)" }} />
                    <span className="text-sm text-foreground font-medium">{f.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LMS Comparison Table */}
          <div className="rounded-2xl border border-border bg-white overflow-hidden mb-10">
            <div className="p-5 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">{t("lms.comparisonTable.title")}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: "hsl(250,35%,94%)" }}>
                    {compHeaders.map((h, i) => (
                      <th key={i} className={`py-3 px-4 font-bold text-foreground ${i === 0 ? "text-left" : "text-center"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compRows.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      {row.map((cell, j) => (
                        <td key={j} className={`py-2.5 px-4 ${j === 0 ? "font-semibold text-foreground text-left" : "text-center text-muted-foreground"}`}>
                          <CellIcon val={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Features */}
          <div className="mb-10">
            <h3 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
              <Bot className="w-4 h-4" style={{ color: "hsl(255,75%,58%)" }} />
              {t("lms.aiSection.title").replace(/\n/g, " ")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {aiFeatures.map((f, i) => (
                <div key={i} className="rounded-xl p-4 bg-white border border-border">
                  <h4 className="font-bold text-xs text-foreground mb-1">{f.title}</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* LMS Pricing */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(220,45%,88%) 0%, hsl(222,40%,84%) 100%)" }}>
            <div className="p-6">
              <h3 className="font-bold text-sm text-foreground mb-1">{t("lms.plansSection.title").replace(/\n/g, " ")}</h3>
              <p className="text-xs text-muted-foreground mb-5">{t("lms.plansSection.desc")}</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {lmsPlans.map((plan: any, i: number) => (
                  <div key={i} className={`rounded-xl p-4 bg-white border ${plan.highlight ? "border-[hsl(255,75%,58%)] ring-1 ring-[hsl(255,75%,58%,0.3)]" : "border-border"} relative`}>
                    {plan.badge && (
                      <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: "hsl(255,75%,58%)" }}>{plan.badge}</span>
                    )}
                    <p className="font-bold text-xs text-foreground">{plan.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 min-h-[28px]">{plan.solutionType}</p>
                    <p className="mt-2">
                      <span className="text-lg font-black text-foreground">{plan.price}</span>
                      <span className="text-xs text-muted-foreground ml-1">{plan.unit}/월</span>
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {(plan.features as any[]).slice(0, 3).map((f: any, j: number) => (
                        <li key={j} className="flex items-start gap-1.5">
                          <Check className="w-3 h-3 mt-0.5 shrink-0 text-green-600" />
                          <span className="text-[10px] text-foreground">{f.main}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitor Comparison */}
          <div className="rounded-2xl border border-border bg-white overflow-hidden mt-8">
            <div className="p-5 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">{t("lms.competitorTable.title").replace(/\n/g, " ")}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t("lms.competitorTable.desc")}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: "hsl(250,35%,94%)" }}>
                    {competitorHeaders.map((h, i) => (
                      <th key={i} className={`py-3 px-4 font-bold ${i === 0 ? "text-left text-foreground" : i === 3 ? "text-center" : "text-center text-foreground"}`}
                        style={i === 3 ? { color: "hsl(255,75%,58%)" } : {}}
                      >{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {competitorRows.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      {row.map((cell, j) => (
                        <td key={j} className={`py-2.5 px-4 ${j === 0 ? "font-semibold text-foreground text-left" : "text-center text-muted-foreground"} ${j === 3 ? "font-semibold" : ""}`}
                          style={j === 3 ? { color: "hsl(255,75%,58%)" } : {}}
                        >
                          <CellIcon val={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════
          ADD-ON SERVICES
      ═══════════════════════════════════════════════ */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <SectionHead sub="ADD-ON SERVICES" title="부가서비스 라인업" desc="LMS를 중심으로 교육 사업에 필요한 8가지 부가서비스를 원스톱으로 제공합니다." />

          {/* Service cards with descriptions */}
          <div className="space-y-5">
            {ovServices.slice(1).map((svc, i) => {
              const card = serviceCards[i];
              if (!card) return null;
              const Icon = card.icon;

              /* Get plans for services that have them */
              let plans: any[] | null = null;
              if (card.key === "hosting") plans = hostingPlans;
              if (card.key === "maintenance") plans = maintenancePlans;
              if (card.key === "chatbot") plans = chatbotPlans;
              if (card.key === "appdev") plans = appdevPlans;

              return (
                <div key={card.key} className="rounded-2xl bg-white border border-border overflow-hidden shadow-sm">
                  <div className="p-7">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: card.accent + "1a", color: card.accent }}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-base text-foreground">{svc.title}</h3>
                          <a href={card.path} className="text-xs font-semibold flex items-center gap-0.5 shrink-0" style={{ color: card.accent }}>
                            상세보기 <ChevronRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{svc.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {svc.highlights.map((h, j) => (
                            <span key={j} className="px-2.5 py-0.5 rounded text-xs font-medium" style={{ background: card.accent + "12", color: card.accent }}>{h}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Inline pricing if available */}
                    {plans && plans.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-border">
                        <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-3">요금제</p>
                        <div className={`grid gap-2 ${plans.length === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"}`}>
                          {plans.map((plan: any, pi: number) => (
                            <div key={pi} className={`rounded-lg p-4 border ${plan.highlight ? "border-[hsl(255,75%,58%)] bg-[hsl(255,75%,58%,0.03)]" : "border-border bg-secondary/30"} relative`}>
                              {plan.badge && (
                                <span className="absolute -top-2.5 left-3 px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ background: "hsl(255,75%,58%)" }}>{plan.badge}</span>
                              )}
                              <p className="font-bold text-sm text-foreground">{plan.name}</p>
                              <p className="mt-1">
                                <span className="text-base font-black text-foreground">{plan.price}</span>
                                {plan.unit && <span className="text-xs text-muted-foreground ml-0.5">{plan.unit}</span>}
                              </p>
                              <ul className="mt-2.5 space-y-1.5">
                                {(plan.features as any[]).slice(0, 2).map((f: any, fi: number) => (
                                  <li key={fi} className="flex items-start gap-1.5">
                                    <Check className="w-3 h-3 mt-0.5 shrink-0 text-green-600" />
                                    <span className="text-xs text-muted-foreground">{f.main}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WHY WEBHEADS — Dark section
      ═══════════════════════════════════════════════ */}
      <section className="relative py-16 overflow-hidden">
        <HeroPatternBg theme="blue-purple" />
        <div className="container mx-auto px-6 max-w-3xl text-center relative z-10">
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white mb-4">{t("overview.whyTitle")}</h2>
          <p className="text-sm leading-relaxed text-white/60 whitespace-pre-line mb-8">{t("overview.whyDesc")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
            {whyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "hsl(192,80%,55%)" }} />
                <span className="text-xs text-white/80 font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA — Contact
      ═══════════════════════════════════════════════ */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h2 className="text-2xl lg:text-3xl leading-tight tracking-tight mb-4" style={{ fontWeight: 900, color: "hsl(255,75%,58%)" }}>
            {t("overview.cta.title")}
          </h2>
          <p className="text-sm text-muted-foreground mb-8 whitespace-pre-line">{t("overview.cta.desc")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/lms#contact" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all text-white hover:opacity-90" style={{ background: "hsl(255,75%,58%)" }}>
              {t("overview.cta.btn1")}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="tel:02-336-4338" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all border border-border text-foreground hover:bg-secondary">
              <Phone className="w-4 h-4" />
              {t("overview.cta.btn2")}
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">{t("overview.cta.note")}</p>
        </div>
      </section>
    </div>
  );
}
