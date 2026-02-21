import { LucideIcon } from "lucide-react";

interface Step { icon: LucideIcon; title: string; desc: string; tag: string; }
interface ServiceProcessProps { steps: Step[]; heading: string; subheading: string; description: string; }

export default function ServiceProcess({ steps, heading, subheading, description }: ServiceProcessProps) {
  return (
    <section className="py-28 bg-secondary">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{subheading}</p>
          <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{heading}</h2>
          <p className="text-muted-foreground mt-4 text-base">{description}</p>
        </div>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />
          <div className="flex flex-col gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-6 relative">
                <div className="relative z-10 w-12 h-12 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center shrink-0">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 rounded-2xl bg-background p-6 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">STEP {i + 1}</span>
                    <span className="text-xs text-muted-foreground">{step.tag}</span>
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
