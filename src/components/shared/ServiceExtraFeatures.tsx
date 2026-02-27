import { LucideIcon } from "lucide-react";

interface Feature { icon: LucideIcon; title: string; desc: string; tags: string[]; }
interface ServiceExtraFeaturesProps { features: Feature[]; subheading: string; heading: string; description: string; }

export default function ServiceExtraFeatures({ features, subheading, heading, description }: ServiceExtraFeaturesProps) {
  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{subheading}</p>
          <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{heading}</h2>
          <p className="text-muted-foreground mt-4 text-base">{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {f.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
