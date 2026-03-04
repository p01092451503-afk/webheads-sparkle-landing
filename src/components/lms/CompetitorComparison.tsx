import { useTranslation } from "react-i18next";

const WH_SUB_KO: Record<string, string> = {
  "없음": "초기 비용 0원",
  "최소 3일": "직접구축 대비 100배 빠름",
  "원스톱": "PG·DRM·SMS·AI 자체 연동",
};
const WH_SUB_EN: Record<string, string> = {
  "None": "Zero upfront cost",
  "As fast as 3 days": "100x faster than self-build",
  "One-stop": "PG·DRM·SMS·AI integrated in-house",
};

function getWinner(row: string[]): number {
  const vals = row.slice(1);
  const score = (v: string): number => {
    if (v === "O") return 3;
    if (v === "△") return 1;
    if (v === "X") return 0;
    if (v === "없음" || v === "None") return 3;
    if (v === "즉시" || v === "Instant") return 3;
    if (v === "원스톱" || v === "One-stop") return 3;
    if (v === "최소 3일" || v === "As fast as 3 days") return 2;
    if (v.includes("별도") || v.includes("Custom")) return 1;
    if (v.includes("자체") || v.includes("In-house")) return 1;
    if (v.includes("제한") || v.includes("Limited")) return 1;
    if (v.includes("이메일") || v.includes("Email")) return 1;
    if (v.includes("개별") || v.includes("Separate")) return 1;
    if (v.includes("만원") || v.includes("$")) return 0;
    if (v.includes("개월") || v.includes("month") || v.includes("year")) return 0;
    return 2;
  };
  const scores = vals.map(score);
  const max = Math.max(...scores);
  const lastIdx = scores.length - 1;
  if (scores[lastIdx] === max) return lastIdx;
  return scores.indexOf(max);
}

function CellContent({
  value,
  isWebheads,
  lang,
}: {
  value: string;
  isWebheads: boolean;
  lang: string;
}) {
  const subMap = lang === "ko" ? WH_SUB_KO : WH_SUB_EN;
  const sub = isWebheads ? subMap[value] : undefined;

  if (value === "O") {
    return (
      <span className={`font-semibold ${isWebheads ? "text-primary" : "text-green-600"}`}>
        {lang === "ko" ? "기본 제공" : "Included"}
      </span>
    );
  }
  if (value === "X") {
    return (
      <span className="text-muted-foreground/40 line-through text-xs">
        {lang === "ko" ? "불가" : "N/A"}
      </span>
    );
  }
  if (value === "△") {
    return (
      <span className="text-xs text-amber-600">
        {lang === "ko" ? "제한적" : "Limited"}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`font-semibold text-sm ${isWebheads ? "text-primary" : "text-foreground"}`}>
        {value}
      </span>
      {sub && (
        <span className="text-[11px] font-medium text-primary/60">{sub}</span>
      )}
    </div>
  );
}

export default function CompetitorComparison() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const headers = t("lms.competitorTable.headers", { returnObjects: true }) as string[];
  const rows = t("lms.competitorTable.rows", { returnObjects: true }) as string[][];


  return (
    <section className="py-16 md:py-28 bg-background">
      <div className="container mx-auto px-5 md:px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-primary">
            {t("lms.competitorTable.sub")}
          </p>
          <h2 className="font-bold text-foreground leading-tight text-2xl md:text-4xl tracking-tight whitespace-pre-line">
            {t("lms.competitorTable.title")}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">{t("lms.competitorTable.desc")}</p>
        </div>

        {/* Table card */}
        <div className="rounded-2xl bg-background overflow-hidden shadow-sm border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 md:px-6 py-4 text-left text-xs font-semibold text-muted-foreground w-[28%]">
                    {headers[0]}
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground">
                    {headers[1]}
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground">
                    {headers[2]}
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-primary-foreground bg-primary relative">
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap bg-primary/80 text-primary-foreground/80">
                      Best Choice
                    </span>
                    {headers[3]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => {
                  const winnerCol = winners[ri];
                  return (
                    <tr key={ri} className={ri < rows.length - 1 ? "border-b border-border/50" : ""}>
                      <td className="px-5 md:px-6 py-3.5 font-medium text-foreground text-sm">{row[0]}</td>
                      <td className="px-4 py-3.5 text-center">
                        <CellContent value={row[1]} isWebheads={false} lang={lang} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <CellContent value={row[2]} isWebheads={false} lang={lang} />
                      </td>
                      <td className={`px-4 py-3.5 text-center ${winnerCol === 2 ? "bg-primary/5" : "bg-primary/[0.02]"}`}>
                        <CellContent value={row[3]} isWebheads={true} lang={lang} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
