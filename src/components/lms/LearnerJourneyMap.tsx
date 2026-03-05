import { useTranslation } from "react-i18next";
import { ClipboardList, CreditCard, BookOpen, Award, Heart, ArrowRight } from "lucide-react";

const stepIcons = [ClipboardList, CreditCard, BookOpen, Award, Heart];
const stepColors = [
  "hsl(245, 29%, 55%)",
  "hsl(215, 33%, 48%)",
  "hsl(170, 28%, 38%)",
  "hsl(35, 45%, 50%)",
  "hsl(340, 33%, 50%)",
];

const withAlpha = (color: string, alpha: number) =>
  color.replace("hsl(", "hsla(").replace(")", `, ${alpha})`);

export default function LearnerJourneyMap() {
  const { t } = useTranslation();
  const steps = t("lms.journeyMap.steps", { returnObjects: true }) as {
    label: string;
    desc: string;
    service: string;
  }[];

  return (
    <section className="py-16 md:py-28" style={{ background: "var(--lms-section-alt)" }}>
      <div className="container mx-auto px-5 md:px-6 max-w-5xl">
        <div className="mb-10 md:mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3 md:mb-4" style={{ color: "hsl(var(--lms-primary))" }}>
            {t("lms.journeyMap.sub")}
          </p>
          <h2 className="font-bold text-foreground leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight whitespace-pre-line">
            {t("lms.journeyMap.title")}
          </h2>
          <p className="text-muted-foreground mt-3 md:mt-4 text-sm md:text-base">{t("lms.journeyMap.desc")}</p>
        </div>

        {/* Timeline */}
        <div className="relative">



          {/* Desktop: horizontal grid */}
          <div className="hidden md:grid md:grid-cols-5 md:gap-6">
            {steps.map((step, i) => {
              const Icon = stepIcons[i] || BookOpen;
              const color = stepColors[i];
              return (
                <div key={i} className="relative flex flex-col items-center text-center group">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg relative z-10"
                    style={{ background: `hsl(0 0% 100% / 0.85)`, border: `1.5px solid ${color}40`, boxShadow: `0 2px 12px ${color}20` }}
                  >
                    <Icon className="w-7 h-7" style={{ color }} strokeWidth={1.8} />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="absolute top-7 -right-5 z-20">
                      <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                  <span className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: `${color}cc` }}>
                    Step {i + 1}
                  </span>
                  <h4 className="font-bold text-foreground text-lg leading-snug mb-2.5">{step.label}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4" style={{ wordBreak: "keep-all" }}>{step.desc}</p>
                  <span
                    className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full"
                    style={{ background: `${color}12`, color }}
                  >
                    {step.service}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile: vertical timeline */}
          <div className="md:hidden flex flex-col gap-2">
            {steps.map((step, i) => {
              const Icon = stepIcons[i] || BookOpen;
              const color = stepColors[i];
              return (
                <div key={i} className="relative flex items-start gap-4 pl-1">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center relative z-10"
                      style={{ background: `hsl(0 0% 100% / 0.85)`, border: `1.5px solid ${color}40`, boxShadow: `0 2px 12px ${color}20` }}
                    >
                      <Icon className="w-5.5 h-5.5" style={{ color }} strokeWidth={1.8} />
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px h-6 mt-1" style={{ background: `${color}30` }} />
                    )}
                  </div>
                  <div className="pt-1 pb-4 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: `${color}cc` }}>
                      Step {i + 1}
                    </span>
                    <h4 className="font-bold text-foreground text-base mt-0.5">{step.label}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1" style={{ wordBreak: "keep-all" }}>{step.desc}</p>
                    <span
                      className="inline-block text-xs font-semibold px-3 py-1 rounded-full mt-2.5"
                      style={{ background: `${color}12`, color }}
                    >
                      {step.service}
                    </span>
                  </div>
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
