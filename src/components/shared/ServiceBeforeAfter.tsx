import { ArrowRight } from "lucide-react";

interface BeforeAfterItem {
  label: string;
  before: string;
  after: string;
}

interface ServiceBeforeAfterProps {
  items: BeforeAfterItem[];
  subheading: string;
  heading: string;
  description: string;
}

export default function ServiceBeforeAfter({ items, subheading, heading, description }: ServiceBeforeAfterProps) {
  return (
    <section className="py-28 bg-secondary">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{subheading}</p>
          <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{heading}</h2>
          <p className="text-muted-foreground mt-4 text-base">{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item) => (
            <div key={item.label} className="rounded-2xl bg-background border border-border p-6 flex flex-col gap-4">
              <span className="text-sm font-bold text-foreground tracking-tight">{item.label}</span>
              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-xl bg-destructive/8 border border-destructive/20 px-4 py-3">
                  <p className="text-sm font-medium text-destructive line-through decoration-destructive/40">{item.before}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 rounded-xl bg-primary/8 border border-primary/20 px-4 py-3">
                  <p className="text-sm font-bold text-primary">{item.after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
