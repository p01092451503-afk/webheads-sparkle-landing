import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronUp, ChevronDown, MessageSquareText } from "lucide-react";

export default function FloatingNav() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isServiceRequest = location.pathname === "/service-request";

  return (
    <div className="fixed right-5 bottom-6 z-50 flex flex-col gap-2">
      {/* Service Request floating button — always visible, hidden on /service-request */}
      {!isServiceRequest && (
        <a
          href="/service-request"
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
          aria-label="SMS 충전 · 원격지원 요청"
          title="SMS 충전 · 원격지원 요청"
        >
          <MessageSquareText className="w-5 h-5" />
        </a>
      )}

      {visible && (
        <>
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
        </>
      )}
    </div>
  );
}
