import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, GraduationCap, Briefcase, Landmark, Rocket, CheckCircle2, ArrowRight, Zap } from "lucide-react";

const tabIcons = [Building2, GraduationCap, Briefcase, Landmark, Rocket];

export default function IndustryScenarioTabs() {
  const { t } = useTranslation();
  const tabs = t("lms.industryTabs.tabs", { returnObjects: true }) as {
    label: string;
    title: string;
    desc: string;
    points: string[];
    services: string[];
    caseStudy: string;
    cta: string;
  }[];
  const [active, setActive] = useState(0);
  const current = tabs[active];

  return (
    <section className="py-28" style={{ background: "var(--lms-section-alt)" }}>
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "hsl(var(--lms-primary))" }}>
            {t("lms.industryTabs.sub")}
          </p>
          <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">
            {t("lms.industryTabs.title")}
          </h2>
          <p className="text-muted-foreground mt-4 text-base">{t("lms.industryTabs.desc")}</p>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab, i) => {
            const Icon = tabIcons[i] || Building2;
            const isActive = active === i;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border ${
                  isActive
                    ? "text-white border-transparent shadow-md"
                    : "bg-background text-foreground border-border hover:border-muted-foreground/40"
                }`}
                style={isActive ? { background: "hsl(var(--lms-primary))" } : undefined}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          key={active}
          className="rounded-2xl border border-border bg-background p-8 md:p-10 animate-fade-in"
        >
          <h3 className="font-bold text-foreground text-xl lg:text-2xl mb-3 tracking-tight">{current.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6" style={{ wordBreak: "keep-all" }}>{current.desc}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {current.points.map((point, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "hsl(var(--lms-primary))" }} />
                <span className="text-sm text-foreground leading-snug">{point}</span>
              </div>
            ))}
          </div>

          {/* Recommended service combo */}
          <div className="rounded-xl p-5 mb-6" style={{ background: "var(--lms-gradient-subtle)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" style={{ color: "hsl(var(--lms-primary))" }} />
              <span className="text-sm font-bold text-foreground">{t("lms.industryTabs.recommendedLabel")}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {current.services.map((svc, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border"
                  style={{ borderColor: "hsl(var(--lms-primary) / 0.2)", color: "hsl(var(--lms-primary))", background: "hsl(var(--lms-primary) / 0.06)" }}
                >
                  {svc}
                </span>
              ))}
            </div>
          </div>

          {/* Case study */}
          <div className="rounded-xl border border-border p-5 mb-8 bg-muted/30">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("lms.industryTabs.caseLabel")}</p>
            <p className="text-sm text-foreground leading-relaxed" style={{ wordBreak: "keep-all" }}>{current.caseStudy}</p>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: "hsl(var(--lms-primary))" }}
          >
            {current.cta}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
