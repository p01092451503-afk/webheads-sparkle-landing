import { LogOut, Route, MonitorSmartphone, Languages } from "lucide-react";
import { SectionGroup, ChartCard, BarRow, Empty } from "./AnalyticsShared";

interface Props {
  exitPages: [string, number][];
  pageFlows: [string, number][];
  resolutionCounts: [string, number][];
  languageCounts: [string, number][];
}

export default function AnalyticsExit({ exitPages, pageFlows, resolutionCounts, languageCounts }: Props) {
  return (
    <SectionGroup title="이탈 · 환경 분석" number={6}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChartCard title="이탈 페이지" icon={<LogOut className="w-4 h-4" />}>
          {exitPages.length === 0 ? <Empty msg="이탈 데이터 수집 중..." /> : exitPages.map(([p, c], i) => <BarRow key={p} rank={i+1} label={p} value={c} max={exitPages[0][1]} color="hsl(0, 84%, 60%)" />)}
        </ChartCard>
        <ChartCard title="페이지 이동 경로" icon={<Route className="w-4 h-4" />}>
          {pageFlows.length === 0 ? <Empty msg="이동 경로 데이터 수집 중..." /> : pageFlows.map(([f, c], i) => <BarRow key={f} rank={i+1} label={f} value={c} max={pageFlows[0][1]} color="hsl(262, 60%, 55%)" />)}
        </ChartCard>
        <ChartCard title="화면 해상도" icon={<MonitorSmartphone className="w-4 h-4" />}>
          {resolutionCounts.length === 0 ? <Empty /> : resolutionCounts.map(([r, c], i) => <BarRow key={r} rank={i+1} label={r} value={c} max={resolutionCounts[0][1]} color="hsl(199, 89%, 48%)" />)}
        </ChartCard>
        <ChartCard title="브라우저 언어" icon={<Languages className="w-4 h-4" />}>
          {languageCounts.length === 0 ? <Empty /> : languageCounts.map(([l, c], i) => <BarRow key={l} rank={i+1} label={l} value={c} max={languageCounts[0][1]} color="hsl(170, 70%, 40%)" />)}
        </ChartCard>
      </div>
    </SectionGroup>
  );
}
