import { Bot, BrainCircuit, ShieldAlert, User } from "lucide-react";
import { SectionGroup } from "./AnalyticsShared";

interface VisitorTypeCounts {
  human: number;
  searchBot: number;
  ai: number;
  scraper: number;
  total: number;
  scraperSubs: [string, number][];
  searchBotSubs: [string, number][];
  aiBotSubs: [string, number][];
  aiBotPages: { bot: string; pages: [string, number][] }[];
  searchBotPages: { bot: string; pages: [string, number][] }[];
}

function BotDetailSection({ title, icon, color, count, subs, pages }: {
  title: string; icon: React.ReactNode; color: string; count: number;
  subs: [string, number][]; pages?: { bot: string; pages: [string, number][] }[];
}) {
  return (
    <div className="mt-3 first:mt-4 bg-white rounded-2xl border border-[hsl(220,13%,91%)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[hsl(220,13%,93%)] flex items-center gap-2">
        {icon}
        <span className="text-[13px] font-bold text-foreground">{title}</span>
        <span className="text-[11px] font-bold" style={{ color }}>{count.toLocaleString()}회</span>
      </div>
      <div className="px-4 py-3">
        {subs.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {subs.map(([name, c], i) => (
              <div key={name} className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-muted-foreground w-5 shrink-0 text-right">{i + 1}</span>
                <div className="flex-1 h-6 rounded-lg overflow-hidden relative bg-[hsl(220,14%,96%)]">
                  <div className="h-full rounded-lg" style={{ width: `${Math.max((c / subs[0][1]) * 100, 4)}%`, background: `${color}26` }} />
                  <span className="absolute left-2.5 top-0 h-full flex items-center text-[11px] font-semibold text-foreground">{name}</span>
                </div>
                <span className="text-[11px] font-bold shrink-0 w-10 text-right" style={{ color }}>{c.toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-[11px] text-muted-foreground/40 py-1">감지된 데이터 없음</p>}
      </div>
      {pages && pages.length > 0 && (
        <div className="px-4 py-3 border-t border-[hsl(220,13%,93%)]">
          <p className="text-[11px] font-semibold text-muted-foreground mb-2">{title}별 크롤링 페이지</p>
          <div className="flex flex-col gap-3">
            {pages.slice(0, 5).map(({ bot, pages: botPages }) => {
              const botTotal = botPages.reduce((s, [, c]) => s + c, 0);
              return (
                <div key={bot}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-foreground">{bot}</span>
                    <span className="text-[10px] text-muted-foreground">{botTotal}회</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {botPages.slice(0, 8).map(([path, c]) => (
                      <div key={path} className="flex items-center gap-2">
                        <div className="flex-1 h-5 rounded overflow-hidden relative bg-[hsl(220,14%,96%)]">
                          <div className="h-full rounded" style={{ width: `${Math.max((c / botPages[0][1]) * 100, 4)}%`, background: `${color}1f` }} />
                          <span className="absolute left-2 top-0 h-full flex items-center text-[10px] font-medium text-foreground">{path}</span>
                        </div>
                        <span className="text-[10px] font-bold shrink-0" style={{ color }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsVisitorTypes({ visitorTypeCounts }: { visitorTypeCounts: VisitorTypeCounts }) {
  const items = [
    { icon: <User className="w-4 h-4" />, label: "사람", value: visitorTypeCounts.human, color: "hsl(221, 83%, 53%)" },
    { icon: <Bot className="w-4 h-4" />, label: "검색엔진 봇", value: visitorTypeCounts.searchBot, color: "hsl(37, 90%, 51%)" },
    { icon: <BrainCircuit className="w-4 h-4" />, label: "AI 봇", value: visitorTypeCounts.ai, color: "hsl(262, 60%, 55%)" },
    { icon: <ShieldAlert className="w-4 h-4" />, label: "스크래퍼", value: visitorTypeCounts.scraper, color: "hsl(0, 70%, 55%)" },
  ].map((item) => ({ ...item, pct: visitorTypeCounts.total > 0 ? Math.round((item.value / visitorTypeCounts.total) * 100) : 0 }));

  return (
    <SectionGroup title="방문자 유형 분석" number={2}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item) => (
          <div key={item.label} className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${item.color}12`, color: item.color }}>{item.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[20px] font-bold tracking-[-0.04em] text-foreground tabular-nums">{item.value.toLocaleString()}</p>
                <p className="text-[12px] font-bold" style={{ color: item.color }}>{item.pct}%</p>
              </div>
              <p className="text-[12px] font-medium text-muted-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <BotDetailSection title="검색엔진 봇" icon={<Bot className="w-4 h-4 text-[hsl(37,90%,51%)]" />} color="hsl(37, 90%, 51%)"
        count={visitorTypeCounts.searchBot} subs={visitorTypeCounts.searchBotSubs} pages={visitorTypeCounts.searchBotPages} />

      <BotDetailSection title="AI 봇" icon={<BrainCircuit className="w-4 h-4 text-[hsl(262,60%,55%)]" />} color="hsl(262, 60%, 55%)"
        count={visitorTypeCounts.ai} subs={visitorTypeCounts.aiBotSubs} pages={visitorTypeCounts.aiBotPages} />

      <BotDetailSection title="스크래퍼" icon={<ShieldAlert className="w-4 h-4 text-[hsl(0,70%,55%)]" />} color="hsl(0, 70%, 55%)"
        count={visitorTypeCounts.scraper} subs={visitorTypeCounts.scraperSubs} />
    </SectionGroup>
  );
}
