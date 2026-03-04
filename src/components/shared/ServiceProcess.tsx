import { LucideIcon } from "lucide-react";

interface Step { icon: LucideIcon; title: string; desc: string; tag: string; }
interface ServiceProcessProps { steps: Step[]; heading: string; subheading: string; description: string; bg?: string; }

const stepColors = [
  { bg: "hsl(215, 80%, 95%)", text: "hsl(215, 70%, 48%)", badge: "hsl(215, 75%, 50%)" },
  { bg: "hsl(260, 70%, 95%)", text: "hsl(260, 60%, 50%)", badge: "hsl(260, 65%, 52%)" },
  { bg: "hsl(170, 60%, 93%)", text: "hsl(170, 55%, 38%)", badge: "hsl(170, 60%, 40%)" },
  { bg: "hsl(35, 80%, 93%)",  text: "hsl(35, 70%, 42%)",  badge: "hsl(35, 75%, 45%)" },
  { bg: "hsl(340, 60%, 94%)", text: "hsl(340, 50%, 48%)", badge: "hsl(340, 55%, 50%)" },
];

export default function ServiceProcess({ steps, heading, subheading, description, bg = "bg-secondary" }: ServiceProcessProps) {
  return (
    <section className={`py-16 md:py-28 ${bg}`}>
      <div className="container mx-auto px-5 md:px-6 max-w-5xl">
        <div className="mb-10 md:mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3 md:mb-4">{subheading}</p>
          <h2 className="font-bold text-foreground leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{heading}</h2>
          <p className="text-muted-foreground mt-3 md:mt-4 text-sm md:text-base">{description}</p>
        </div>

        <div className="relative">
          {/* Connecting line - desktop */}
          <div className="absolute left-[27px] top-6 bottom-6 w-[2px] hidden md:block"
            style={{ background: "linear-gradient(to bottom, hsl(215, 70%, 85%), hsl(260, 60%, 85%), hsl(170, 50%, 80%), hsl(35, 70%, 85%))" }}
          />
          {/* Connecting line - mobile */}
          <div className="absolute left-[21px] top-4 bottom-4 w-[2px] md:hidden"
            style={{ background: "linear-gradient(to bottom, hsl(215, 70%, 85%), hsl(260, 60%, 85%), hsl(170, 50%, 80%), hsl(35, 70%, 85%))" }}
          />

          <div className="flex flex-col gap-4 md:gap-5">
            {steps.map((step, i) => {
              const color = stepColors[i % stepColors.length];
              return (
                <div key={i} className="flex items-start gap-4 md:gap-6 relative group">
                  {/* Icon circle */}
                  <div
                    className="relative z-10 w-11 h-11 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110"
                    style={{ background: color.bg, border: `1.5px solid ${color.text}22` }}
                  >
                    <step.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: color.text }} />
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 rounded-2xl bg-background p-5 md:p-7 border border-border/60 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] group-hover:border-border"
                  >
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span
                        className="text-[11px] md:text-xs font-bold px-2.5 py-1 rounded-full text-white tracking-wide"
                        style={{ background: color.badge }}
                      >
                        STEP {i + 1}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">{step.tag}</span>
                    </div>
                    <h3 className="font-bold text-foreground text-base md:text-lg mb-1.5">{step.title}</h3>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed" style={{ wordBreak: "keep-all" }}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
