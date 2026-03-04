import { useTranslation } from "react-i18next";
import { Crown, Trophy } from "lucide-react";

// Webheads-specific sub-descriptions for highlighted cells
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

// Determine winner column index for each row (0-indexed within values, not including label)
function getWinner(row: string[]): number {
  const vals = row.slice(1);
  // Webheads (last col) wins unless self-build is strictly better
  // Simple heuristic: O > △ > X, text values are contextual
  const score = (v: string) => {
    if (v === "O") return 3;
    if (v === "△") return 1;
    if (v === "X") return 0;
    // Text-based scoring
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
  // Prefer Webheads (last) if tied
  const lastIdx = scores.length - 1;
  if (scores[lastIdx] === max) return lastIdx;
  const first = scores.indexOf(max);
  return first;
}

function CellContent({
  value,
  isWinner,
  isWebheads,
  lang,
}: {
  value: string;
  isWinner: boolean;
  isWebheads: boolean;
  lang: string;
}) {
  const subMap = lang === "ko" ? WH_SUB_KO : WH_SUB_EN;
  const sub = isWebheads ? subMap[value] : undefined;

  if (value === "O") {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-1.5">
          {isWinner && <Crown className="w-4 h-4 text-amber-400" />}
          <span className="font-bold" style={{ color: "#16A34A" }}>
            ✅ {lang === "ko" ? "기본 제공" : "Included"}
          </span>
        </div>
      </div>
    );
  }
  if (value === "X") {
    return (
      <span className="text-muted-foreground/50 line-through">
        ❌ {lang === "ko" ? "불가" : "N/A"}
      </span>
    );
  }
  if (value === "△") {
    return (
      <span style={{ color: "#D97706" }}>
        △ {lang === "ko" ? "제한적" : "Limited"}
      </span>
    );
  }

  // Text values
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-1.5">
        {isWinner && <Crown className="w-4 h-4 text-amber-400" />}
        <span className={`font-semibold ${isWebheads ? "" : "text-foreground"}`} style={isWebheads ? { color: "#7C3AED" } : undefined}>
          {value}
        </span>
      </div>
      {sub && (
        <span className="text-xs" style={{ color: "#7C3AED" }}>✦ {sub}</span>
      )}
    </div>
  );
}

export default function CompetitorComparison() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const headers = t("lms.competitorTable.headers", { returnObjects: true }) as string[];
  const rows = t("lms.competitorTable.rows", { returnObjects: true }) as string[][];

  // Count wins per column
  const winCounts = [0, 0, 0]; // self-build, saas, webheads
  const winners = rows.map((row) => {
    const w = getWinner(row);
    winCounts[w]++;
    return w;
  });

  return (
    <section className="py-16 md:py-28" style={{ background: "#F8F8FC" }}>
      <div className="container mx-auto px-5 md:px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3 md:mb-4" style={{ color: "#7C3AED" }}>
            {t("lms.competitorTable.sub")}
          </p>
          <h2 className="font-bold text-foreground leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight whitespace-pre-line">
            {t("lms.competitorTable.title")}
          </h2>
          <p className="text-muted-foreground mt-3 md:mt-4 text-sm md:text-base">{t("lms.competitorTable.desc")}</p>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-border overflow-hidden bg-background" style={{ boxShadow: "0 4px 24px rgba(124,58,237,0.08)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="px-5 md:px-6 py-4 text-left font-bold text-muted-foreground bg-muted/30 w-[28%]">
                    {headers[0]}
                  </th>
                  <th className="px-4 py-4 text-center font-bold text-foreground bg-muted/30">
                    {headers[1]}
                  </th>
                  <th className="px-4 py-4 text-center font-bold text-foreground bg-muted/30">
                    {headers[2]}
                  </th>
                  {/* Webheads header — pop-out style */}
                  <th
                    className="px-4 py-4 text-center font-extrabold text-white relative"
                    style={{ background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" }}
                  >
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white whitespace-nowrap"
                      style={{ background: "#F59E0B" }}
                    >
                      ⭐ Best Choice
                    </span>
                    {headers[3]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => {
                  const winnerCol = winners[ri];
                  return (
                    <tr key={ri} className="border-t border-border">
                      {/* Label */}
                      <td className="px-5 md:px-6 py-4 font-semibold text-foreground">{row[0]}</td>
                      {/* Self-build */}
                      <td
                        className="px-4 py-4 text-center"
                        style={winnerCol !== 0 ? { color: "#9CA3AF" } : undefined}
                      >
                        <CellContent value={row[1]} isWinner={winnerCol === 0} isWebheads={false} lang={lang} />
                      </td>
                      {/* Generic SaaS */}
                      <td
                        className="px-4 py-4 text-center"
                        style={winnerCol !== 1 ? { color: "#9CA3AF" } : undefined}
                      >
                        <CellContent value={row[2]} isWinner={winnerCol === 1} isWebheads={false} lang={lang} />
                      </td>
                      {/* Webheads */}
                      <td
                        className="px-4 py-4 text-center"
                        style={{
                          background: winnerCol === 2 ? "#F3EEFF" : "#FAFAFF",
                        }}
                      >
                        <CellContent value={row[3]} isWinner={winnerCol === 2} isWebheads={true} lang={lang} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Score summary bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          {[
            { label: headers[1], count: winCounts[0], color: "#6B7280", bg: "#F3F4F6" },
            { label: headers[2], count: winCounts[1], color: "#6B7280", bg: "#F3F4F6" },
            { label: headers[3], count: winCounts[2], color: "#7C3AED", bg: "#F3EEFF" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold"
              style={{ background: item.bg, color: item.color }}
            >
              {item.count === Math.max(...winCounts) && <Trophy className="w-4 h-4 text-amber-400" />}
              <span>{item.label}</span>
              <span className="text-lg">{item.count}{lang === "ko" ? "승" : "W"}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
