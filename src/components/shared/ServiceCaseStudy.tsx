interface CaseMetric {
  label: string;
  value: string;
}

interface CaseItem {
  org: string;
  industry: string;
  challenge: string;
  result: string;
  metrics: CaseMetric[];
}

interface ServiceCaseStudyProps {
  cases: CaseItem[];
  subheading: string;
  heading: string;
  description: string;
  bg?: string;
}

export default function ServiceCaseStudy({ cases, subheading, heading, description, bg = "bg-background" }: ServiceCaseStudyProps) {
  return (
    <section className={`py-28 ${bg}`}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{subheading}</p>
          <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{heading}</h2>
          <p className="text-muted-foreground mt-4 text-base">{description}</p>
        </div>
        <div className={`grid grid-cols-1 ${cases.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-5`}>
          {cases.map((c) => (
            <div key={c.org} className="rounded-3xl border border-border bg-secondary/50 overflow-hidden flex flex-col">
              <div className="px-7 pt-7 pb-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">{c.industry}</span>
                  <span className="font-bold text-foreground text-lg tracking-tight">{c.org}</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Challenge</p>
                    <p className="text-sm text-foreground leading-relaxed">{c.challenge}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Result</p>
                    <p className="text-sm text-foreground leading-relaxed font-medium">{c.result}</p>
                  </div>
                </div>
              </div>
              <div className="mt-auto border-t border-border bg-background px-7 py-5 grid grid-cols-3 gap-4">
                {c.metrics.map((m) => (
                  <div key={m.label} className="text-center">
                    <span className="block font-bold text-xl text-primary tracking-tight">{m.value}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
