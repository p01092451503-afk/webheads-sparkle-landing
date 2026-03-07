import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SEO from "@/components/SEO";
import HeroPatternBg from "@/components/visuals/HeroPatternBg";
import LazySection from "@/components/shared/LazySection";
import {
  Server, Wrench, Bot, Smartphone, ShieldCheck,
  MessageSquare, CreditCard, Film, ArrowRight, Phone, CheckCircle2,
  Users, Clock, Award, Zap, Check, X, Triangle, ChevronRight, Rocket,
  Download, Loader2
} from "lucide-react";

/* ── Service config ── */
const serviceCards = [
  { key: "hosting", icon: Server, accent: "hsl(200,70%,50%)", path: "/hosting" },
  { key: "maintenance", icon: Wrench, accent: "hsl(210,40%,50%)", path: "/maintenance" },
  { key: "chatbot", icon: Bot, accent: "hsl(190,70%,45%)", path: "/chatbot" },
  { key: "appdev", icon: Smartphone, accent: "hsl(165,55%,45%)", path: "/app" },
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

/* ══════════════════════════════════════════
   DEFERRED: LMS Detail Section
   ══════════════════════════════════════════ */
function LmsDetailSection() {
  const { t } = useTranslation();
  
  const lmsPlans = t("lms.plans", { returnObjects: true }) as any[];
  const compHeaders = t("lms.comparisonTable.headers", { returnObjects: true }) as string[];
  const compRows = t("lms.comparisonTable.rows", { returnObjects: true }) as string[][];
  const competitorHeaders = t("lms.competitorTable.headers", { returnObjects: true }) as string[];
  const competitorRows = t("lms.competitorTable.rows", { returnObjects: true }) as string[][];
  const aiFeatures = t("lms.aiFeatures", { returnObjects: true }) as { title: string; desc: string }[];
  const lightFeats = (t("lms.lightFeatures", { returnObjects: true }) as { title: string; desc: string }[]).slice(0, 6);
  const proFeats = (t("lms.proFeatures", { returnObjects: true }) as { title: string; desc: string }[]).slice(0, 6);

  return (
    <>
    {/* LMS Header + Light vs PRO */}
    <section id="lms" className="pt-16 pb-4" data-pdf-section>
      <div className="container mx-auto px-6 max-w-5xl">
        <SectionHead sub="CORE SERVICE" title="LMS (학습 관리 시스템)" desc="웹헤즈 Light(임대형)와 웹헤즈 PRO(구축형) — 비즈니스 목적에 맞는 최적의 LMS를 선택하세요." />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[
            { name: "light", icon: Zap, color: "hsl(255,75%,58%)", feats: lightFeats },
            { name: "pro", icon: ShieldCheck, color: "hsl(220,90%,56%)", feats: proFeats },
          ].map(({ name, icon: Icon, color, feats }) => (
            <div key={name} className="rounded-2xl border border-border bg-white p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: color + "1e", color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">{t(`lms.${name}.name`)}</h3>
                  <p className="text-xs text-muted-foreground">{t(`lms.${name}.subtitle`)}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{t(`lms.${name}.desc`)}</p>
              <div className="grid grid-cols-2 gap-2.5">
                {feats.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color }} />
                    <span className="text-sm text-foreground font-medium">{f.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* LMS Comparison Table */}
    <section className="py-4" data-pdf-section>
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="rounded-2xl border border-border bg-white overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-base text-foreground">{t("lms.comparisonTable.title")}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "hsl(250,35%,94%)" }}>
                  {compHeaders.map((h, i) => (
                    <th key={i} className={`py-3.5 px-5 font-bold text-foreground ${i === 0 ? "text-left" : "text-center"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compRows.map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    {row.map((cell, j) => (
                      <td key={j} className={`py-3 px-5 ${j === 0 ? "font-semibold text-foreground text-left" : "text-center text-muted-foreground"}`}>
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

    {/* AI Features */}
    <section className="py-4" data-pdf-section>
      <div className="container mx-auto px-6 max-w-5xl">
        <h3 className="font-bold text-base text-foreground mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5" style={{ color: "hsl(255,75%,58%)" }} />
          {t("lms.aiSection.title").replace(/\n/g, " ")}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {aiFeatures.map((f, i) => (
            <div key={i} className="rounded-xl p-5 bg-white border border-border">
              <h4 className="font-bold text-sm text-foreground mb-1.5">{f.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* LMS Pricing */}
    <section className="py-4" data-pdf-section>
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(220,45%,88%) 0%, hsl(222,40%,84%) 100%)" }}>
          <div className="p-7">
            <h3 className="font-bold text-base text-foreground mb-1">{t("lms.plansSection.title").replace(/\n/g, " ")}</h3>
            <p className="text-sm text-muted-foreground mb-5">{t("lms.plansSection.desc")}</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {lmsPlans.map((plan: any, i: number) => (
                <div key={i} className={`rounded-xl p-5 bg-white border ${plan.highlight ? "border-[hsl(255,75%,58%)] ring-1 ring-[hsl(255,75%,58%,0.3)]" : "border-border"} relative`}>
                  {plan.badge && (
                    <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: "hsl(255,75%,58%)" }}>{plan.badge}</span>
                  )}
                  <p className="font-bold text-sm text-foreground">{plan.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 min-h-[32px]">{plan.solutionType}</p>
                  <p className="mt-2">
                    <span className="text-xl font-black text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">{plan.unit}/월</span>
                  </p>
                  <ul className="mt-3 space-y-2">
                    {(plan.features as any[]).slice(0, 3).map((f: any, j: number) => (
                      <li key={j} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-green-600" />
                        <span className="text-xs text-foreground">{f.main}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Competitor Comparison */}
    <section className="pt-4 pb-16" data-pdf-section>
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="rounded-2xl border border-border bg-white overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-base text-foreground">{t("lms.competitorTable.title").replace(/\n/g, " ")}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t("lms.competitorTable.desc")}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "hsl(250,35%,94%)" }}>
                  {competitorHeaders.map((h, i) => (
                    <th key={i} className={`py-3.5 px-5 font-bold ${i === 0 ? "text-left text-foreground" : i === 3 ? "text-center" : "text-center text-foreground"}`}
                      style={i === 3 ? { color: "hsl(255,75%,58%)" } : {}}
                    >{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {competitorRows.map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    {row.map((cell, j) => (
                      <td key={j} className={`py-3 px-5 ${j === 0 ? "font-semibold text-foreground text-left" : "text-center text-muted-foreground"} ${j === 3 ? "font-semibold" : ""}`}
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
    </>
  );
}

/* ══════════════════════════════════════════
   DEFERRED: Add-on Services Section
   ══════════════════════════════════════════ */
function AddOnServicesSection() {
  const { t } = useTranslation();
  const ovServices = t("overview.services", { returnObjects: true }) as { title: string; desc: string; highlights: string[] }[];
  const hostingPlans = t("hosting.plans", { returnObjects: true }) as any[];
  const maintenancePlans = t("maintenance.plans", { returnObjects: true }) as any[];
  const chatbotPlans = t("chatbot.plans", { returnObjects: true }) as any[];
  const appdevPlans = t("appdev.plans", { returnObjects: true }) as any[];

  const plansMap: Record<string, any[]> = { hosting: hostingPlans, maintenance: maintenancePlans, chatbot: chatbotPlans, appdev: appdevPlans };

  return (
    <>
    {/* Add-on header */}
    <section id="services" className="pt-16 pb-2" data-pdf-section>
      <div className="container mx-auto px-6 max-w-5xl">
        <SectionHead sub="ADD-ON SERVICES" title="부가서비스 라인업" desc="LMS를 중심으로 교육 사업에 필요한 8가지 부가서비스를 원스톱으로 제공합니다. 각 서비스 페이지에서 상세한 기능·요금·도입 가이드를 확인하세요." />
      </div>
    </section>

    {/* Individual service cards */}
    {ovServices.slice(1).map((svc, i) => {
      const card = serviceCards[i];
      if (!card) return null;
      const Icon = card.icon;
      const plans = plansMap[card.key] || null;

      return (
        <section key={card.key} className="py-2" data-pdf-section>
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="rounded-2xl bg-white border border-border overflow-hidden shadow-sm">
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
          </div>
        </section>
      );
    })}
    </>
  );
}

/* ══════════════════════════════════════════
   Client Reference Grid (for Overview PDF)
   ══════════════════════════════════════════ */
function ClientMarqueeGrid() {
  const { t } = useTranslation();
  const clients = t("lms.clients", { returnObjects: true }) as string[];

  return (
    <div className="flex flex-wrap justify-center gap-x-1 gap-y-3">
      {clients.map((name, i) => (
        <span
          key={i}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border bg-white text-muted-foreground"
        >
          {name}
        </span>
      ))}
    </div>
  );
}

export default function OverviewPage() {
  const { t } = useTranslation();
  const [pdfLoading, setPdfLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const ovStrengths = t("overview.strengths", { returnObjects: true }) as { title: string; desc: string }[];
  const ovStats = t("overview.stats", { returnObjects: true }) as { value: string; label: string }[];
  const whyPoints = t("overview.whyPoints", { returnObjects: true }) as string[];

  const statIcons = [Users, Clock, Award, Zap];

  const handleDownloadPdf = useCallback(async () => {
    if (!contentRef.current || pdfLoading) return;
    setPdfLoading(true);

    try {
      // Force all lazy sections to render by scrolling through them
      const pageEl = contentRef.current;
      const totalH = pageEl.scrollHeight;
      for (let y = 0; y < totalH; y += 300) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 800));

      // Collect all pdf sections
      const sections = Array.from(
        pageEl.querySelectorAll("[data-pdf-section]")
      ) as HTMLElement[];

      if (sections.length === 0) {
        console.error("No PDF sections found");
        setPdfLoading(false);
        return;
      }

      const A4_W = 210;
      const A4_H = 297;
      const MARGIN = 10;
      const CONTENT_W = A4_W - MARGIN * 2;
      const GAP = 3;

      const pdf = new jsPDF("p", "mm", "a4");
      let currentY = MARGIN;

      for (const section of sections) {
        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          windowWidth: 1280,
        });

        const scale = 2;
        const widthPx = canvas.width / scale;
        const heightPx = canvas.height / scale;
        const scaleFactor = CONTENT_W / widthPx;
        const heightMM = heightPx * scaleFactor;

        // If section doesn't fit, add new page
        const remaining = A4_H - MARGIN - currentY;
        if (heightMM > remaining && currentY > MARGIN) {
          pdf.addPage();
          currentY = MARGIN;
        }

        // If a single section is taller than one page, split it across pages
        if (heightMM > A4_H - MARGIN * 2) {
          const imgData = canvas.toDataURL("image/png");
          const pageContentH = A4_H - MARGIN * 2;
          const totalPages = Math.ceil(heightMM / pageContentH);

          for (let p = 0; p < totalPages; p++) {
            if (p > 0 || currentY > MARGIN) {
              if (p > 0) pdf.addPage();
              currentY = MARGIN;
            }
            pdf.addImage(imgData, "PNG", MARGIN, currentY - p * pageContentH, CONTENT_W, heightMM);
            // Clip by simply moving to next page
          }
          currentY = MARGIN + (heightMM % (A4_H - MARGIN * 2));
          if (currentY < MARGIN + 5) currentY = MARGIN;
        } else {
          const imgData = canvas.toDataURL("image/png");
          pdf.addImage(imgData, "PNG", MARGIN, currentY, CONTENT_W, heightMM);
          currentY += heightMM + GAP;
        }
      }

      pdf.save("WEBHEADS_서비스소개서.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setPdfLoading(false);
    }
  }, [pdfLoading]);

  return (
    <div ref={contentRef} className="min-h-screen" style={{ background: "hsl(252, 30%, 97%)" }} data-page="overview">
      <SEO
        title={t("overview.seo.title")}
        description={t("overview.seo.description")}
        keywords={t("overview.seo.keywords")}
        path="/overview"
      />

      {/* ── HERO ── */}
      <section data-pdf-section className="relative pt-36 pb-24 overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(210,40%,96%) 0%, hsl(220,30%,92%) 40%, hsl(210,35%,88%) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 30%, hsl(210,60%,92%,0.6), transparent)" }} />
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] mb-6" style={{ background: "hsl(220,50%,30%,0.08)", color: "hsl(220,50%,35%)", border: "1px solid hsl(220,40%,50%,0.15)" }}>
            {t("overview.hero.badge")}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[2.8rem] tracking-tight whitespace-pre-line" style={{ fontWeight: 900, color: "hsl(220,40%,16%)", lineHeight: 1.2 }}>
            {t("overview.hero.title")}
          </h1>
          <p className="mt-5 text-sm sm:text-base leading-[1.9] max-w-2xl mx-auto whitespace-pre-line" style={{ color: "hsl(220,20%,45%)" }}>
            {t("overview.hero.desc")}
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <a href="#lms" className="px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90" style={{ background: "hsl(220,40%,18%)", color: "hsl(0,0%,100%)" }}>
              {t("overview.hero.cta1")}
            </a>
            <a href="#contact" className="px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:bg-[hsl(220,30%,92%)]" style={{ background: "hsl(0,0%,100%)", color: "hsl(220,40%,18%)", border: "1px solid hsl(220,30%,80%)" }}>
              {t("overview.hero.cta2")}
            </a>
          </div>
        </div>
      </section>

      {/* ── Company Stats ── */}
      <section data-pdf-section className="py-10" style={{ background: "linear-gradient(180deg, hsl(250,35%,94%) 0%, hsl(252,30%,97%) 100%)" }}>
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
      <section data-pdf-section className="py-16">
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

      {/* ── LMS Section (deferred) ── */}
      <LazySection fallbackHeight="800px">
        <LmsDetailSection />
      </LazySection>

      <Divider />

      {/* ── Add-on Services (deferred) ── */}
      <LazySection fallbackHeight="600px">
        <AddOnServicesSection />
      </LazySection>

      {/* ── Client References ── */}
      <LazySection fallbackHeight="200px">
        <section data-pdf-section className="py-16" style={{ background: "hsl(252, 30%, 97%)" }}>
          <div className="container mx-auto px-6 max-w-5xl">
            <SectionHead sub="CLIENT REFERENCES" title="대표 구축사례" desc="300개 이상의 기업·기관이 웹헤즈 LMS를 도입하여 운영하고 있습니다." />
            <ClientMarqueeGrid />
          </div>
        </section>
      </LazySection>

      {/* ── Why Webheads ── */}
      <LazySection fallbackHeight="400px">
        <section data-pdf-section className="relative py-20 overflow-hidden">
          <HeroPatternBg theme="blue-purple" />
          <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-5">{t("overview.whyTitle")}</h2>
            <p className="text-base leading-relaxed text-white/70 whitespace-pre-line mb-10">{t("overview.whyDesc")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto text-left" style={{ paddingLeft: "9%" }}>
              {whyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "hsl(192,80%,55%)" }} />
                  <span className="text-base text-white/90 font-medium">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* ── CTA — Contact ── */}
      <section data-pdf-section id="contact" className="py-16">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h2 className="text-2xl lg:text-3xl leading-tight tracking-tight mb-4" style={{ fontWeight: 900, color: "hsl(255,75%,58%)" }}>
            {t("overview.cta.title")}
          </h2>
          <p className="text-sm text-muted-foreground mb-8 whitespace-pre-line">{t("overview.cta.desc")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/lms#contact" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all text-white hover:opacity-90" style={{ background: "hsl(255,75%,58%)" }}>
              {t("overview.cta.btn1")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:02-336-4338" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all border border-border text-foreground hover:bg-secondary">
              <Phone className="w-4 h-4" />
              {t("overview.cta.btn2")}
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">{t("overview.cta.note")}</p>
        </div>
      </section>

      {/* Floating PDF Download Button */}
      <button
        onClick={handleDownloadPdf}
        disabled={pdfLoading}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-wait print:hidden"
        style={{
          background: "hsl(var(--foreground))",
          color: "hsl(var(--background))",
          boxShadow: "0 8px 30px -6px hsl(0 0% 0% / 0.3)",
        }}
      >
        {pdfLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            PDF 생성 중...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            PDF 다운로드
          </>
        )}
      </button>
    </div>
  );
}
