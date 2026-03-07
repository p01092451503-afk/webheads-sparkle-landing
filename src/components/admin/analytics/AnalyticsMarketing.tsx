import { Link2, BarChart3, MousePointerClick, GitBranch } from "lucide-react";
import { SectionGroup, ChartCard, BarRow, Empty } from "./AnalyticsShared";

interface Props {
  utmSourceCounts: [string, number][];
  utmCampaignCounts: [string, number][];
  ctaClickCounts: [string, number][];
  ctaByPage: [string, number][];
  ctaAttribution: { flow: string; total: number; converted: number }[];
}

export default function AnalyticsMarketing({ utmSourceCounts, utmCampaignCounts, ctaClickCounts, ctaByPage, ctaAttribution }: Props) {
  return (
    <SectionGroup title="마케팅 · UTM · CTA" number={7}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChartCard title="UTM 소스별 유입" icon={<Link2 className="w-4 h-4" />}>
          {utmSourceCounts.length === 0 ? <Empty msg="UTM 데이터 수집 중..." /> : utmSourceCounts.map(([n, c], i) => <BarRow key={n} rank={i+1} label={n} value={c} max={utmSourceCounts[0][1]} color="hsl(170, 70%, 40%)" />)}
        </ChartCard>
        <ChartCard title="UTM 캠페인" icon={<BarChart3 className="w-4 h-4" />}>
          {utmCampaignCounts.length === 0 ? <Empty msg="캠페인 데이터 수집 중..." /> : utmCampaignCounts.map(([n, c], i) => <BarRow key={n} rank={i+1} label={n} value={c} max={utmCampaignCounts[0][1]} color="hsl(199, 89%, 48%)" />)}
        </ChartCard>
        <ChartCard title="CTA 클릭 이벤트" icon={<MousePointerClick className="w-4 h-4" />}>
          {ctaClickCounts.length === 0 ? <Empty msg="CTA 클릭 데이터 수집 중..." /> : ctaClickCounts.map(([n, c], i) => <BarRow key={n} rank={i+1} label={n} value={c} max={ctaClickCounts[0][1]} color="hsl(340, 65%, 55%)" />)}
        </ChartCard>
        <ChartCard title="CTA 클릭 - 페이지별" icon={<MousePointerClick className="w-4 h-4" />}>
          {ctaByPage.length === 0 ? <Empty msg="CTA 클릭 데이터 수집 중..." /> : ctaByPage.map(([p, c], i) => <BarRow key={p} rank={i+1} label={p} value={c} max={ctaByPage[0][1]} color="hsl(262, 60%, 55%)" />)}
        </ChartCard>
        <ChartCard title="CTA 전환 경로" icon={<GitBranch className="w-4 h-4" />}>
          {ctaAttribution.length === 0 ? <Empty msg="CTA 전환 경로 데이터 수집 중..." /> : ctaAttribution.slice(0, 10).map((d, i) => (
            <div key={d.flow} className="flex items-center gap-2 py-1.5">
              <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold bg-[hsl(262,60%,55%,0.1)] text-[hsl(262,60%,55%)]">{i+1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-foreground truncate">{d.flow}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-muted-foreground">{d.total}회</span>
                  {d.converted > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[hsl(152,57%,42%,0.1)] text-[hsl(152,57%,42%)]">전환 {d.converted}건</span>}
                </div>
              </div>
            </div>
          ))}
        </ChartCard>
      </div>
    </SectionGroup>
  );
}
