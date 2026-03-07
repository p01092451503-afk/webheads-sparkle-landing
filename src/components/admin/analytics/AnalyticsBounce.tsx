import { LogOut, Repeat } from "lucide-react";
import { SectionGroup, ChartCard, BarRow, Empty } from "./AnalyticsShared";

interface Props {
  bounceByPage: { path: string; rate: number; total: number; bounced: number }[];
  visitorFrequency: { freq: [string, number][]; totalVisitors: number };
}

export default function AnalyticsBounce({ bounceByPage, visitorFrequency }: Props) {
  return (
    <SectionGroup title="이탈률 · 재방문 분석" number={8}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChartCard title="페이지별 이탈률" icon={<LogOut className="w-4 h-4" />}>
          {bounceByPage.length === 0 ? <Empty msg="이탈률 데이터 수집 중..." /> : bounceByPage.slice(0, 10).map((d, i) => (
            <div key={d.path} className="flex items-center gap-2 py-1.5">
              <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold bg-[hsl(25,95%,53%,0.1)] text-[hsl(25,95%,53%)]">{i+1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] text-foreground truncate">{d.path}</p>
                  <span className="text-[13px] font-bold tabular-nums" style={{ color: d.rate > 70 ? "hsl(0, 84%, 60%)" : d.rate > 40 ? "hsl(25, 95%, 53%)" : "hsl(152, 57%, 42%)" }}>{d.rate}%</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="flex-1 h-1.5 rounded-full bg-[hsl(25,95%,53%,0.08)]">
                    <div className="h-full rounded-full transition-all" style={{ width: `${d.rate}%`, background: d.rate > 70 ? "hsl(0, 84%, 60%)" : d.rate > 40 ? "hsl(25, 95%, 53%)" : "hsl(152, 57%, 42%)" }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{d.bounced}/{d.total}세션</span>
                </div>
              </div>
            </div>
          ))}
        </ChartCard>
        <ChartCard title="방문 빈도 분포" icon={<Repeat className="w-4 h-4" />}>
          {visitorFrequency.totalVisitors === 0 ? <Empty msg="방문자 ID 데이터 수집 중..." /> : (
            <>
              <p className="text-[11px] text-muted-foreground mb-2">총 {visitorFrequency.totalVisitors}명의 고유 방문자</p>
              {visitorFrequency.freq.map(([label, count], i) => (
                <BarRow key={label} rank={i+1} label={label} value={count} max={visitorFrequency.freq[0][1]} color="hsl(199, 89%, 48%)" />
              ))}
            </>
          )}
        </ChartCard>
      </div>
    </SectionGroup>
  );
}
