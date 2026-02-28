import { useTranslation } from "react-i18next";
import { ClipboardList, CreditCard, BookOpen, Award, Heart, ArrowRight } from "lucide-react";

const stepIcons = [ClipboardList, CreditCard, BookOpen, Award, Heart];
const stepColors = [
  "hsl(245, 58%, 55%)",
  "hsl(215, 65%, 48%)",
  "hsl(170, 55%, 38%)",
  "hsl(35, 90%, 50%)",
  "hsl(340, 65%, 50%)",
];

export default function LearnerJourneyMap() {
  const { t } = useTranslation();
  const steps = t("lms.journeyMap.steps", { returnObjects: true }) as {
    label: string;
    desc: string;
    service: string;
  }[];

  return (
    <section className="py-28">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "hsl(var(--lms-primary))" }}>
            {t("lms.journeyMap.sub")}
          </p>
          <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">
            {t("lms.journeyMap.title")}
          </h2>
          <p className="text-muted-foreground mt-4 text-base">{t("lms.journeyMap.desc")}</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal line (desktop) */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-border" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-3">
            {steps.map((step, i) => {
              const Icon = stepIcons[i] || BookOpen;
              const color = stepColors[i];
              return (
                <div key={i} className="relative flex flex-col items-center text-center group">
                  {/* Node */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-transform group-hover:scale-110 relative z-10"
                    style={{ background: `${color}15`, border: `2px solid ${color}40` }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  {/* Arrow between nodes (mobile hidden) */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-7 -right-2 z-20">
                      <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
                    </div>
                  )}
                  <h4 className="font-bold text-foreground text-sm mb-1.5">{step.label}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3" style={{ wordBreak: "keep-all" }}>{step.desc}</p>
                  <span
                    className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: `${color}12`, color }}
                  >
                    {step.service}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: "hsl(var(--lms-primary))" }}
          >
            {t("lms.journeyMap.cta")}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
