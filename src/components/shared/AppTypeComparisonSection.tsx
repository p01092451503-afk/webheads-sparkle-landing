import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Smartphone, Layers, Globe, ThumbsUp, ThumbsDown, Target } from "lucide-react";

const typeIcons = [Smartphone, Layers, Globe];
const badgeColors = [
  { bg: "hsl(250, 55%, 52%)", text: "white" },
  { bg: "hsl(192, 50%, 42%)", text: "white" },
  { bg: "hsl(35, 75%, 45%)", text: "white" },
];

export default function AppTypeComparisonSection() {
  const { t } = useTranslation();
  const data = t("appdev.appTypeComparison", { returnObjects: true }) as any;
  const [activeIdx, setActiveIdx] = useState(0);

  const types = data.types as any[];
  const table = data.comparisonTable;
  const activeType = types[activeIdx];
  const ActiveIcon = typeIcons[activeIdx];

  return (
    <section className="py-16 md:py-28 bg-background">
      <div className="container mx-auto px-5 md:px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3 md:mb-4">{data.sub}</p>
          <h2 className="font-bold text-foreground leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{data.title}</h2>
          <p className="text-muted-foreground mt-3 md:mt-4 text-sm md:text-base">{data.desc}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {types.map((type: any, i: number) => {
            const Icon = typeIcons[i];
            return (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  activeIdx === i
                    ? "bg-foreground text-background shadow-lg"
                    : "bg-secondary text-foreground border border-border hover:border-muted-foreground/40"
                }`}
              >
                {type.name}
              </button>
            );
          })}
        </div>

        {/* Active Type Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          {/* Definition & Dev Method */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <div className="rounded-2xl bg-secondary border border-border p-6 md:p-7 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${badgeColors[activeIdx].bg}15` }}>
                  <ActiveIcon className="w-5 h-5" style={{ color: badgeColors[activeIdx].bg }} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg tracking-tight">{activeType.name}</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: badgeColors[activeIdx].bg }}>{activeType.badge}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed" style={{ wordBreak: "keep-all" }}>{activeType.definition}</p>
              <div className="pt-3 border-t border-border/60">
                <p className="text-xs font-semibold text-foreground mb-1.5">개발 방법</p>
                <p className="text-muted-foreground text-xs leading-relaxed" style={{ wordBreak: "keep-all" }}>{activeType.devMethod}</p>
              </div>
            </div>

            {/* Best For */}
            <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <p className="text-sm font-bold text-foreground">추천 프로젝트</p>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed" style={{ wordBreak: "keep-all" }}>{activeType.bestFor}</p>
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="rounded-2xl bg-secondary border border-border p-6 md:p-7">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="w-4 h-4 text-primary" />
                <h4 className="font-bold text-foreground text-sm">장점</h4>
              </div>
              <ul className="flex flex-col gap-2.5">
                {activeType.pros.map((pro: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="text-primary mt-0.5 shrink-0 font-bold">✓</span>
                    <span className="text-foreground" style={{ wordBreak: "keep-all" }}>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-secondary border border-border p-6 md:p-7">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsDown className="w-4 h-4" style={{ color: "hsl(0, 60%, 50%)" }} />
                <h4 className="font-bold text-foreground text-sm">단점</h4>
              </div>
              <ul className="flex flex-col gap-2.5">
                {activeType.cons.map((con: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="shrink-0 mt-0.5 font-bold" style={{ color: "hsl(0, 60%, 50%)" }}>✕</span>
                    <span className="text-muted-foreground" style={{ wordBreak: "keep-all" }}>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 bg-muted border-b border-border">
            <h3 className="font-bold text-foreground text-base">{table.title}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  {table.headers.map((h: string, i: number) => (
                    <th
                      key={i}
                      className={`px-4 md:px-5 py-3 text-left text-base font-bold text-foreground ${
                        i === 0 ? "w-[26%] border-r border-border" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row: any, ri: number) => (
                  <tr key={ri} className={ri % 2 === 1 ? "bg-muted/30" : ""}>
                    <td className="px-4 md:px-5 py-3 font-medium text-foreground border-r border-border">{row.label}</td>
                    {row.values.map((val: string, vi: number) => (
                      <td
                        key={vi}
                        className={`px-4 md:px-5 py-3 text-sm font-bold ${vi === 0 ? "bg-primary/5 text-primary" : "text-foreground"}`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 rounded-xl border border-border bg-muted px-6 py-4">
          <p className="text-foreground font-semibold text-sm text-center sm:text-left">{data.recommendation}</p>
          <a href="#contact" className="shrink-0 inline-flex px-5 py-2.5 rounded-2xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">{data.recommendationCta}</a>
        </div>
      </div>
    </section>
  );
}
