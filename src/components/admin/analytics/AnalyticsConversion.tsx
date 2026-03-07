import { TrendingUp, Grid3X3 } from "lucide-react";
import { SectionGroup, SectionCard } from "./AnalyticsShared";

interface Props {
  funnelData: { label: string; count: number }[];
  hourlyData: { grid: number[][]; dayNames: string[] };
  maxHourly: number;
  dateRange: number;
}

export default function AnalyticsConversion({ funnelData, hourlyData, maxHourly, dateRange }: Props) {
  return (
    <SectionGroup title="전환 · 트래픽 패턴" number={5}>
      <SectionCard title="전환 퍼널" icon={<TrendingUp className="w-4 h-4" />}>
        <div className="flex flex-col gap-3">
          {funnelData.map((step, i) => {
            const pct = funnelData[0].count > 0 ? (step.count / funnelData[0].count) * 100 : 0;
            const dropOff = i > 0 && funnelData[i-1].count > 0 ? ((1 - step.count / funnelData[i-1].count) * 100).toFixed(1) : null;
            return (
              <div key={step.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold bg-[hsl(221,83%,53%,0.1)] text-[hsl(221,83%,53%)]">{i+1}</span>
                    <span className="text-[13px] font-medium text-foreground">{step.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-foreground tabular-nums">{step.count.toLocaleString()}</span>
                    {dropOff && <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md text-[hsl(0,84%,60%)] bg-[hsl(0,84%,60%,0.06)]">-{dropOff}%</span>}
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-[hsl(221,83%,53%,0.06)]">
                  <div className="h-full rounded-full transition-all duration-500 bg-[hsl(221,83%,53%)]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
      <SectionCard title="시간대별 트래픽 히트맵" icon={<Grid3X3 className="w-4 h-4" />}>
        {dateRange < 7 ? (
          <div className="flex items-center justify-center py-8 text-[13px] text-muted-foreground">
            7일 이상 선택 시 히트맵이 표시됩니다
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="flex mb-1 ml-8">
                {Array.from({ length: 24 }, (_, h) => (
                  <span key={h} className="flex-1 text-center text-[9px] font-medium text-muted-foreground/40">{h}</span>
                ))}
              </div>
              {hourlyData.dayNames.map((day, dayIdx) => (
                <div key={day} className="flex items-center gap-1 mb-1">
                  <span className="w-7 text-[11px] font-medium text-muted-foreground text-right shrink-0">{day}</span>
                  <div className="flex flex-1 gap-0.5">
                    {hourlyData.grid[dayIdx].map((count, hour) => {
                      const intensity = maxHourly > 0 ? count / maxHourly : 0;
                      return (
                        <div key={hour} className="flex-1 rounded-sm transition-all"
                          style={{ height: "20px", background: count === 0 ? "hsl(220, 14%, 95%)" : `hsl(221 83% 53% / ${0.12 + intensity * 0.88})` }}
                          title={`${day} ${hour}시: ${count}건`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-end gap-2 mt-3">
                <span className="text-[10px] text-muted-foreground/40">적음</span>
                <div className="flex gap-0.5">
                  {[0.12, 0.3, 0.5, 0.7, 1].map((op, i) => (
                    <div key={i} className="w-4 h-3 rounded-sm" style={{ background: `hsl(221 83% 53% / ${op})` }} />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground/40">많음</span>
              </div>
            </div>
          </div>
        )}
      </SectionCard>
    </SectionGroup>
  );
}
