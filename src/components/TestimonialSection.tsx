import { Quote, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Testimonial {
  name: string; role: string; org: string; content: string; rating?: number; date?: string; period?: string;
}

interface TestimonialSectionProps { testimonials: Testimonial[]; }

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  const { t } = useTranslation();
  return (
    <section className="py-28 bg-secondary">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("testimonial.sub")}</p>
          <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("testimonial.title")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((tm, i) => (
            <div key={i} className="rounded-2xl p-7 bg-background border border-border hover:border-primary/20 hover:shadow-sm transition-all duration-200 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Quote className="w-8 h-8 text-primary/20" />
                {tm.rating && (
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className={`w-3.5 h-3.5 ${idx < tm.rating! ? "text-amber-400 fill-amber-400" : "text-border"}`} />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">"{tm.content}"</p>
              <div className="pt-4 border-t border-border flex items-end justify-between gap-2">
                <div>
                  <p className="font-bold text-foreground text-sm">{tm.name}</p>
                  <p className="text-xs text-muted-foreground">{tm.role} · {tm.org}</p>
                </div>
                {(tm.date || tm.period) && (
                  <div className="text-right shrink-0">
                    {tm.period && <p className="text-[11px] text-muted-foreground/60">{tm.period}</p>}
                    {tm.date && <p className="text-[11px] text-muted-foreground/60">{tm.date}</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
