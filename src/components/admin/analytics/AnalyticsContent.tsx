import { ScrollText, Clock } from "lucide-react";
import { SectionGroup, ChartCard, BarRow, DwellRow, Empty } from "./AnalyticsShared";

interface Props {
  scrollDepthStats: { path: string; avg: number; count: number }[];
  pageDwellTimes: { path: string; avg: number; count: number }[];
}

export default function AnalyticsContent({ scrollDepthStats, pageDwellTimes }: Props) {
  return (
    <SectionGroup title="콘텐츠 소비 분석" number={9}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChartCard title="페이지별 스크롤 깊이" icon={<ScrollText className="w-4 h-4" />}>
          {scrollDepthStats.length === 0 ? <Empty msg="스크롤 데이터 수집 중..." /> : scrollDepthStats.map((d, i) => <BarRow key={d.path} rank={i+1} label={d.path} value={d.avg} max={100} color="hsl(37, 90%, 51%)" suffix="%" />)}
        </ChartCard>
        <ChartCard title="페이지별 평균 체류시간" icon={<Clock className="w-4 h-4" />}>
          {pageDwellTimes.length === 0 ? <Empty msg="체류시간 데이터 수집 중..." /> : pageDwellTimes.map((d, i) => <DwellRow key={d.path} rank={i+1} label={d.path} avgSeconds={d.avg} count={d.count} max={pageDwellTimes[0].avg} />)}
        </ChartCard>
      </div>
    </SectionGroup>
  );
}
