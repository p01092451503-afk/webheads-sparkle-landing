import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronUp, ChevronDown, MessageSquareText, CircleDollarSign, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FloatingNav() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isServiceRequest = location.pathname === "/service-request";

  return (
    <>
      {/* Action buttons — vertically centered */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {!isServiceRequest && location.pathname !== "/pricing" && (
          <Link
            to="/pricing"
            className="group relative w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            aria-label="요금제"
          >
            <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">요금제</span>
            <CircleDollarSign className="w-5 h-5" />
          </Link>
        )}

        {!isServiceRequest && location.pathname !== "/sms-kakao" && (
          <Link
            to="/sms-kakao"
            className="group relative w-10 h-10 rounded-full bg-[hsl(45,93%,55%)] text-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            aria-label="SMS · 카카오"
          >
            <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">SMS · 카카오</span>
            <Send className="w-5 h-5" />
          </Link>
        )}

        {!isServiceRequest && (
          <Link
            to="/service-request"
            className="group relative w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            aria-label="고객지원"
          >
            <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">고객지원</span>
            <MessageSquareText className="w-5 h-5" />
          </Link>
        )}
      </div>

      {/* Scroll buttons — bottom right */}
      {visible && (
        <div className="fixed right-5 bottom-6 z-50 flex flex-col gap-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-10 h-10 rounded-full bg-foreground/80 text-background flex items-center justify-center shadow-lg hover:bg-foreground transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
            className="w-10 h-10 rounded-full bg-foreground/80 text-background flex items-center justify-center shadow-lg hover:bg-foreground transition-colors"
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}
