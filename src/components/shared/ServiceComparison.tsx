import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";

function StatusIcon({ value }: { value: string }) {
  if (value === "O") return <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />;
  if (value === "X") return <XCircle className="w-5 h-5 text-destructive/50 mx-auto" />;
  if (value === "△") return <MinusCircle className="w-5 h-5 text-muted-foreground mx-auto" />;
  return <span className="text-sm text-foreground text-center block">{value}</span>;
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
}

export default function ServiceComparison({ headers, rows, subheading, heading, description }: ServiceComparisonProps) {
  return (
    <section className="py-28 bg-secondary">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{subheading}</p>
          <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{heading}</h2>
          <p className="text-muted-foreground mt-4 text-base">{description}</p>
        </div>
        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground w-[35%]">{headers[0]}</th>
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
                        <StatusIcon value={v} />
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
