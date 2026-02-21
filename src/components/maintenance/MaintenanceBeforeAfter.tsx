import { TrendingDown, TrendingUp } from "lucide-react";

const comparisons = [
  { label: "월 평균 장애 횟수", before: "4.2회", after: "0.3회", improved: true, icon: TrendingDown },
  { label: "장애 복구 시간", before: "평균 2시간", after: "평균 15분", improved: true, icon: TrendingDown },
  { label: "페이지 응답 속도", before: "3.8초", after: "0.9초", improved: true, icon: TrendingDown },
  { label: "서비스 가동률", before: "97.2%", after: "99.95%", improved: true, icon: TrendingUp },
];

export default function MaintenanceBeforeAfter() {
  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">도입 효과</p>
          <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">
            유지보수 도입 전 vs 후
          </h2>
          <p className="text-muted-foreground mt-4 text-base">
            실제 고객사 평균 데이터 기반 (2024년 기준)
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {comparisons.map((c) => (
            <div key={c.label} className="rounded-2xl border border-border bg-secondary/50 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <c.icon className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground text-sm">{c.label}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 text-center rounded-xl bg-destructive/10 py-4 px-3">
                  <p className="text-xs text-muted-foreground mb-1">도입 전</p>
                  <p className="font-black text-2xl text-destructive/80">{c.before}</p>
                </div>
                <span className="text-muted-foreground font-bold text-lg">→</span>
                <div className="flex-1 text-center rounded-xl bg-primary/10 py-4 px-3">
                  <p className="text-xs text-muted-foreground mb-1">도입 후</p>
                  <p className="font-black text-2xl text-primary">{c.after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
