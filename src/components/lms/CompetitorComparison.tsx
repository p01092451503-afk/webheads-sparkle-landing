import { useTranslation } from "react-i18next";
import { CheckCircle2, XCircle, MinusCircle, ArrowRight } from "lucide-react";

function StatusIcon({ value }: { value: string }) {
  if (value === "O") return <CheckCircle2 className="w-5 h-5" style={{ color: "hsl(145, 60%, 38%)" }} />;
  if (value === "X") return <XCircle className="w-5 h-5 text-muted-foreground/40" />;
  if (value === "△") return <MinusCircle className="w-5 h-5" style={{ color: "hsl(35, 90%, 50%)" }} />;
  return <span className="text-sm text-muted-foreground">{value}</span>;
}

export default function CompetitorComparison() {
  const { t } = useTranslation();
  const headers = t("lms.competitorTable.headers", { returnObjects: true }) as string[];
  const rows = t("lms.competitorTable.rows", { returnObjects: true }) as string[][];

  return (
    <section className="py-28">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "hsl(var(--lms-primary))" }}>
            {t("lms.competitorTable.sub")}
          </p>
          <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">
            {t("lms.competitorTable.title")}
          </h2>
          <p className="text-muted-foreground mt-4 text-base">{t("lms.competitorTable.desc")}</p>
        </div>

        <div className="rounded-2xl border border-border overflow-hidden bg-background">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border" style={{ background: "var(--lms-gradient-subtle)" }}>
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      className={`px-6 py-4 text-left font-bold whitespace-nowrap ${
                        i === headers.length - 1 ? "text-white" : "text-foreground"
                      }`}
                      style={i === headers.length - 1 ? { background: "hsl(var(--lms-primary))", borderRadius: i === headers.length - 1 ? "0" : undefined } : undefined}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className={`border-b border-border last:border-0 ${ri % 2 === 1 ? "bg-muted/30" : ""}`}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`px-6 py-4 ${ci === 0 ? "font-semibold text-foreground" : ""} ${
                          ci === row.length - 1 ? "font-semibold" : "text-muted-foreground"
                        }`}
                        style={ci === row.length - 1 ? { color: "hsl(var(--lms-primary))" } : undefined}
                      >
                        {["O", "X", "△"].includes(cell) ? <StatusIcon value={cell} /> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: "hsl(var(--lms-primary))" }}
          >
            {t("lms.competitorTable.cta")}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
