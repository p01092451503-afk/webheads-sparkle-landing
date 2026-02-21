import { Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  org: string;
  content: string;
}

interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  return (
    <section className="py-28 bg-secondary">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">고객 후기</p>
          <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">
            고객이 직접 전하는<br />생생한 후기
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-7 bg-background border border-border hover:border-primary/20 hover:shadow-sm transition-all duration-200 flex flex-col gap-4"
            >
              <Quote className="w-8 h-8 text-primary/20" />
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                "{t.content}"
              </p>
              <div className="pt-4 border-t border-border">
                <p className="font-bold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role} · {t.org}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
