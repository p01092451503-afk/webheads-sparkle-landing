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

  // Convert symbols to readable text
  let display = value;
  if (value === "O") display = lang === "ko" ? "기본 제공" : "Included";
  else if (value === "X") display = lang === "ko" ? "불가" : "N/A";
  else if (value === "△") display = lang === "ko" ? "제한적" : "Limited";

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="font-semibold text-base text-foreground">{display}</span>
      {sub && (
        <span className="text-xs font-medium text-muted-foreground">{sub}</span>
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
        <div className="rounded-2xl bg-background shadow-sm border border-border mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 md:px-6 py-5 text-left text-sm font-semibold text-muted-foreground w-[28%]">
                    {headers[0]}
                  </th>
                  <th className="px-4 py-5 text-center text-sm font-semibold text-muted-foreground">
                    {headers[1]}
                  </th>
                  <th className="px-4 py-5 text-center text-sm font-semibold text-muted-foreground">
                    {headers[2]}
                  </th>
                  <th className="px-4 py-5 text-center text-sm font-bold text-primary-foreground bg-primary">
                    {headers[3]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                    <tr key={ri} className={ri < rows.length - 1 ? "border-b border-border/50" : ""}>
                      <td className="px-5 md:px-6 py-5 font-medium text-foreground text-base">{row[0]}</td>
                      <td className="px-4 py-5 text-center">
                        <CellContent value={row[1]} isWebheads={false} lang={lang} />
                      </td>
                      <td className="px-4 py-5 text-center">
                        <CellContent value={row[2]} isWebheads={false} lang={lang} />
                      </td>
                      <td className="px-4 py-5 text-center bg-primary/5">
                        <CellContent value={row[3]} isWebheads={true} lang={lang} />
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
