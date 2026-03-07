import React, { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

export function HelpTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative inline-flex" ref={ref}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 text-muted-foreground bg-[hsl(220,14%,93%)] border border-[hsl(220,13%,91%)] hover:opacity-80 transition-all"
      >?</button>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-[220px] rounded-xl p-3 text-[11px] leading-relaxed shadow-lg animate-in fade-in zoom-in-95 duration-150 bg-white border border-[hsl(220,13%,91%)] text-foreground">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 rotate-45 bg-white border-r border-b border-[hsl(220,13%,91%)]" />
        </div>
      )}
    </div>
  );
}

export function MetricCard({ icon, label, value, color, sub, tooltip, className }: {
  icon: React.ReactNode; label: string; value: number | string; color: string; sub?: string; tooltip?: string; className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-[hsl(220,13%,91%)] px-4 py-3 flex items-center gap-3 ${className || "bg-white"}`}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}12`, color }}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="text-[20px] font-bold tracking-[-0.04em] text-foreground leading-none tabular-nums">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
        </div>
        {sub && <p className="text-[11px] text-muted-foreground/50 mt-0.5">{sub}</p>}
      </div>
      {tooltip && <HelpTooltip text={tooltip} />}
    </div>
  );
}

export function ChartCard({ title, icon, children, maxItems = 10, className }: { title: string; icon: React.ReactNode; children: React.ReactNode; maxItems?: number; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const childArray = React.Children.toArray(children);
  const hasMore = childArray.length > maxItems;
  const visibleChildren = expanded ? childArray : childArray.slice(0, maxItems);
  return (
    <div className={`rounded-2xl border border-[hsl(220,13%,91%)] p-4 ${className || "bg-white"}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-muted-foreground">{icon}</span>
        <h4 className="text-[13px] font-semibold text-foreground flex-1">{title}</h4>
      </div>
      <div className="flex flex-col gap-2.5">{visibleChildren}</div>
      {hasMore && (
        <button onClick={() => setExpanded(!expanded)}
          className="w-full mt-3 pt-3 flex items-center justify-center gap-1 text-[12px] font-medium text-[hsl(221,83%,53%)] border-t border-[hsl(220,13%,95%)] hover:opacity-70 transition-all"
        >
          {expanded ? "접기" : `더보기 (+${childArray.length - maxItems})`}
        </button>
      )}
    </div>
  );
}

export function SectionGroup({ title, children, number }: { title: string; children: React.ReactNode; number?: number }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <button className="flex items-center gap-2 w-full text-left px-1" onClick={() => setCollapsed(!collapsed)}>
        {number !== undefined && (
          <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[12px] font-bold shrink-0 bg-[hsl(221,83%,53%,0.08)] text-[hsl(221,83%,53%)]">{number}</span>
        )}
        <h3 className="text-[15px] font-bold text-foreground tracking-[-0.02em] flex-1">{title}</h3>
        <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200" style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }} />
      </button>
      {!collapsed && children}
    </div>
  );
}

export function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)]">
      <button className="flex items-center gap-2 w-full text-left p-5" onClick={() => setCollapsed(!collapsed)} style={{ paddingBottom: collapsed ? undefined : "0" }}>
        <span className="text-muted-foreground">{icon}</span>
        <h4 className="text-[13px] font-semibold text-foreground flex-1">{title}</h4>
        <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200" style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }} />
      </button>
      {!collapsed && <div className="px-5 pb-5 pt-4">{children}</div>}
    </div>
  );
}

export function BarRow({ rank, label, value, max, color, suffix }: { rank: number; label: string; value: number; max: number; color: string; suffix?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] w-5 text-center text-muted-foreground/40 font-semibold tabular-nums">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] font-medium text-foreground truncate">{label}</span>
          <span className="text-[12px] font-semibold text-foreground shrink-0 ml-2 tabular-nums">{value}{suffix || ""}</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden bg-[hsl(220,14%,95%)]">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    </div>
  );
}

export function Empty({ msg }: { msg?: string } = {}) {
  return <p className="text-[12px] text-muted-foreground/40 text-center py-6 font-medium">{msg || "데이터가 없습니다"}</p>;
}

export function formatDuration(seconds: number): string {
  if (seconds < 1) return "0초";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}분 ${s}초`;
  return `${s}초`;
}

export function DwellRow({ rank, label, avgSeconds, count, max }: { rank: number; label: string; avgSeconds: number; count: number; max: number }) {
  const pct = max > 0 ? (avgSeconds / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] w-5 text-center text-muted-foreground/40 font-semibold tabular-nums">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] font-medium text-foreground truncate">{label}</span>
          <span className="text-[12px] font-semibold text-foreground shrink-0 ml-2 tabular-nums">{formatDuration(avgSeconds)}</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden bg-[hsl(199,89%,48%,0.08)]">
          <div className="h-full rounded-full transition-all duration-500 bg-[hsl(199,89%,48%)]" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] text-muted-foreground/40 mt-0.5 font-medium">{count}회 방문</span>
      </div>
    </div>
  );
}
