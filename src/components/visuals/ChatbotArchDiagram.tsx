import { MessageSquare, Database, Brain, Server, Monitor, ArrowRight, ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";

type NodeBoxProps = {
  icon: React.ElementType;
  label: string;
  sub?: string;
  highlight?: boolean;
};

const NodeBox = ({ icon: Icon, label, sub, highlight }: NodeBoxProps) => (
  <div
    className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border text-center min-w-[100px] transition-all duration-200 ${
      highlight
        ? "bg-primary/10 border-primary/30"
        : "bg-card border-border"
    }`}
  >
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        highlight ? "bg-primary/20" : "bg-secondary"
      }`}
    >
      <Icon className={`w-5 h-5 ${highlight ? "text-primary" : "text-muted-foreground"}`} strokeWidth={2} />
    </div>

    <span className={`text-sm font-bold leading-tight ${highlight ? "text-primary" : "text-foreground"}`}>
      {label}
    </span>

    {sub && <span className="text-xs text-muted-foreground leading-snug">{sub}</span>}
  </div>
);

const Arrow = ({ direction = "right" }: { direction?: "right" | "down" }) => (
  direction === "right"
    ? <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
    : <ArrowDown className="w-4 h-4 text-muted-foreground shrink-0" />
);

export default function ChatbotArchDiagram() {
  const { t } = useTranslation();
  const d = t("chatbot.archDiagram", { returnObjects: true }) as any;

  return (
    <div className="rounded-2xl bg-card border border-border p-6 md:p-8 overflow-x-auto">
      <h4 className="text-base font-bold text-foreground mb-6 text-center tracking-tight">{d.title}</h4>

      {/* Desktop flow - horizontal */}
      <div className="hidden md:flex items-center justify-center gap-3">
        <NodeBox icon={MessageSquare} label={d.user} sub={d.userSub} />
        <Arrow />
        <NodeBox icon={Monitor} label={d.channel} sub={d.channelSub} />
        <Arrow />
        <NodeBox icon={Server} label={d.orchestrator} sub={d.orchestratorSub} highlight />
        <Arrow />
        <div className="flex flex-col gap-2">
          <NodeBox icon={Database} label={d.rag} sub={d.ragSub} />
          <NodeBox icon={Brain} label={d.llm} sub={d.llmSub} highlight />
        </div>
        <Arrow />
        <NodeBox icon={MessageSquare} label={d.response} sub={d.responseSub} />
      </div>

      {/* Mobile flow - vertical */}
      <div className="flex md:hidden flex-col items-center gap-3">
        <NodeBox icon={MessageSquare} label={d.user} sub={d.userSub} />
        <Arrow direction="down" />
        <NodeBox icon={Monitor} label={d.channel} sub={d.channelSub} />
        <Arrow direction="down" />
        <NodeBox icon={Server} label={d.orchestrator} sub={d.orchestratorSub} highlight />
        <Arrow direction="down" />
        <div className="flex gap-3">
          <NodeBox icon={Database} label={d.rag} sub={d.ragSub} />
          <NodeBox icon={Brain} label={d.llm} sub={d.llmSub} highlight />
        </div>
        <Arrow direction="down" />
        <NodeBox icon={MessageSquare} label={d.response} sub={d.responseSub} />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary/20 border border-primary/30" />
          <span className="text-base text-muted-foreground">{d.legendCore}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-card border border-border" />
          <span className="text-xs text-muted-foreground">{d.legendModule}</span>
        </div>
      </div>
    </div>
  );
}
