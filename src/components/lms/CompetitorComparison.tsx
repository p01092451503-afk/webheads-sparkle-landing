import { useTranslation } from "react-i18next";

function StatusText({ value }: { value: string }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  if (value === "O") {
    return <span className="text-sm font-bold text-primary mx-auto block text-center">{lang === "ko" ? "기본 제공" : "Included"}</span>;
  }
  if (value === "X") {
    return <span className="text-sm font-bold text-destructive/50 mx-auto block text-center">{lang === "ko" ? "불가" : "N/A"}</span>;
  }
  if (value === "△") {
    return <span className="text-sm font-bold text-muted-foreground mx-auto block text-center">{lang === "ko" ? "제한적" : "Limited"}</span>;
  }
  return <span className="text-sm font-bold text-foreground text-center block">{value}</span>;
}

export default function CompetitorComparison() {
  const { t } = useTranslation();
  const headers = t("lms.competitorTable.headers", { returnObjects: true }) as string[];
  const rows = t("lms.competitorTable.rows", { returnObjects: true }) as string[][];

  return (
    <section className="py-16 md:py-28 bg-background">
      <div className="container mx-auto px-5 md:px-6 max-w-5xl">
        <div className="mb-8 md:mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">
            {t("lms.competitorTable.sub")}
          </p>
          <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">
            {t("lms.competitorTable.title")}
          </h2>
          <p className="text-muted-foreground mt-4 text-base">{t("lms.competitorTable.desc")}</p>
        </div>

        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground w-[35%]">{headers[0]}</th>
                  {headers.slice(1).map((h, i) => (
                    <th key={h} className={`text-center px-4 py-4 font-bold text-sm ${i === headers.length - 2 ? "text-primary bg-primary/5" : "text-foreground"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className={`border-b border-border last:border-0 ${ri % 2 === 0 ? "" : "bg-muted/30"}`}>
                    <td className="px-6 py-3.5 font-medium text-foreground">{row[0]}</td>
                    {row.slice(1).map((v, j) => (
                      <td key={j} className={`px-4 py-3.5 text-center ${j === row.length - 2 ? "bg-primary/5" : ""}`}>
                        <StatusText value={v} />
                      </td>
                    ))}
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
