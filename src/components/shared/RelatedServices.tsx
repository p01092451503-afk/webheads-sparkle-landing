import { ArrowRight } from "lucide-react";

interface RelatedServicesProps {
  items: { title: string; desc: string; path: string; emoji: string }[];
}

export default function RelatedServices({ items }: RelatedServicesProps) {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-10">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">Related Services</p>
          <h2 className="font-bold text-foreground text-2xl lg:text-3xl tracking-tight">함께 사용하면 좋은 서비스</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="group rounded-2xl p-6 bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all flex flex-col gap-3"
            >
              <span className="text-2xl">{item.emoji}</span>
              <h3 className="font-bold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed flex-1">{item.desc}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-1">
                자세히 보기 <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
