import { useState, useEffect } from "react";
import { ArrowUp, PlusCircle, ScreenShare } from "lucide-react";

const floatingItems = [
  {
    label: "SMS충전",
    icon: PlusCircle,
    href: "https://webheads.co.kr/admin/sms",
    external: true,
  },
  {
    label: "원격지원",
    icon: ScreenShare,
    href: "https://webheads.co.kr/support/remote",
    external: true,
  },
];

export default function ScrollButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 400);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {/* 솔루션 소개서 */}
      <a
        href="https://webheads.co.kr/download/brochure"
        target="_blank"
        rel="noopener noreferrer"
        className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-white text-xs font-bold leading-tight text-center shadow-lg transition-transform hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)",
        }}
      >
        솔루션
        <br />
        소개서
      </a>

      {/* 하단 그룹 (SMS충전, 원격지원, TOP) */}
      <div
        className="flex flex-col items-center rounded-[28px] py-4 px-2 gap-4 shadow-lg"
        style={{ background: "rgba(15, 15, 30, 0.92)", backdropFilter: "blur(8px)" }}
      >
        {floatingItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors group"
            >
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-medium tracking-tight">{item.label}</span>
            </a>
          );
        })}

        {/* TOP */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`flex flex-col items-center gap-1 transition-all ${showTop ? "text-white/80 hover:text-white cursor-pointer" : "text-white/20 cursor-default"}`}
          disabled={!showTop}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
          <span className="text-[11px] font-medium tracking-tight">TOP</span>
        </button>
      </div>
    </div>
  );
}
