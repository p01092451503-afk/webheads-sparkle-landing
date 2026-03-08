import { useTranslation } from "react-i18next";

function StatusText({ value }: { value: string }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  if (value === "O") {
    return <span className="text-sm font-medium text-primary mx-auto block text-center">{lang === "ko" ? "기본 제공" : "Included"}</span>;
  }
  if (value === "X") {
    return <span className="text-sm font-medium text-destructive/50 mx-auto block text-center">{lang === "ko" ? "불가" : "N/A"}</span>;
  }
  if (value === "△") {
    return <span className="text-sm font-medium text-muted-foreground mx-auto block text-center">{lang === "ko" ? "제한적" : "Limited"}</span>;
  }
  return <span className="text-sm font-medium text-foreground text-center block">{value}</span>;
}

interface ComparisonRow {
  label: string;
  values: string[];
}

interface ServiceComparisonProps {
  headers: string[];
  rows: ComparisonRow[];
  subheading: string;
  heading: string;
  description: string;
  bg?: string;
}

export default function ServiceComparison({ headers, rows, subheading, heading, description, bg = "bg-secondary" }: ServiceComparisonProps) {
  return (
    <section className={`py-28 ${bg}`}>
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{subheading}</p>
          <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{heading}</h2>
          <p className="text-muted-foreground mt-4 text-base">{description}</p>
        </div>
        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-fixed">
              <colgroup>
                <col className="w-[22%]" />
                <col className="w-[36%]" />
                <col className="w-[21%]" />
                <col className="w-[21%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground">{headers[0]}</th>
                  {headers.slice(1).map((h, i) => (
                    <th key={h} className={`text-center px-4 py-4 font-bold text-sm ${i === 0 ? "text-primary bg-primary/5" : "text-foreground"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.label} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/30"}`}>
                    <td className="px-6 py-3.5 font-medium text-foreground">{row.label}</td>
                    {row.values.map((v, j) => (
                      <td key={j} className={`px-4 py-3.5 text-center ${j === 0 ? "bg-primary/5" : ""}`}>
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
