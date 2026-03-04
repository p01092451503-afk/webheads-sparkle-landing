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
    <div className="rounded-3xl bg-card border border-border p-6 md:p-10 overflow-x-auto [&::-webkit-scrollbar]:hidden">
      <h4 className="text-lg md:text-2xl font-extrabold text-foreground mb-8 text-center tracking-tight">{d.title}</h4>

      {/* Desktop flow - horizontal */}
      <div className="hidden md:flex items-center justify-center gap-4 px-2 flex-wrap lg:flex-nowrap">
        <NodeBox icon={MessageSquare} label={d.user} sub={d.userSub} />
        <Arrow />
        <NodeBox icon={Monitor} label={d.channel} sub={d.channelSub} />
        <Arrow />
        <NodeBox icon={Server} label={d.orchestrator} sub={d.orchestratorSub} highlight />
        <Arrow />
        <div className="flex flex-col gap-3">
          <NodeBox icon={Database} label={d.rag} sub={d.ragSub} />
          <NodeBox icon={Brain} label={d.llm} sub={d.llmSub} highlight />
        </div>
        <Arrow />
        <NodeBox icon={MessageSquare} label={d.response} sub={d.responseSub} />
      </div>

      {/* Mobile flow - vertical */}
      <div className="flex md:hidden flex-col items-center gap-4">
        <NodeBox icon={MessageSquare} label={d.user} sub={d.userSub} />
        <Arrow direction="down" />
        <NodeBox icon={Monitor} label={d.channel} sub={d.channelSub} />
        <Arrow direction="down" />
        <NodeBox icon={Server} label={d.orchestrator} sub={d.orchestratorSub} highlight />
        <Arrow direction="down" />
        <div className="flex gap-3 w-full justify-center">
          <NodeBox icon={Database} label={d.rag} sub={d.ragSub} />
          <NodeBox icon={Brain} label={d.llm} sub={d.llmSub} highlight />
        </div>
        <Arrow direction="down" />
        <NodeBox icon={MessageSquare} label={d.response} sub={d.responseSub} />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-8 pt-5 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20 border border-primary/30" />
          <span className="text-sm md:text-base text-muted-foreground font-medium">{d.legendCore}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-card border border-border" />
          <span className="text-sm md:text-base text-muted-foreground font-medium">{d.legendModule}</span>
        </div>
      </div>
    </div>
  );
}
