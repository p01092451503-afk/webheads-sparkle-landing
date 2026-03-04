import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronUp, ChevronDown, MessageSquareText, CreditCard, Send, BookOpen } from "lucide-react";
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

  const mobileButtons = [
    ...(!isServiceRequest && location.pathname !== "/pricing"
      ? [{ to: "/pricing", icon: CreditCard, label: t("floatingNav.pricing"), className: "bg-accent text-accent-foreground" }]
      : []),
    ...(!isServiceRequest && location.pathname !== "/sms-kakao"
      ? [{ to: "/sms-kakao", icon: Send, label: t("floatingNav.smsKakao"), className: "bg-[hsl(45,93%,55%)] text-foreground" }]
      : []),
    ...(!isServiceRequest
      ? [{ to: "/service-request", icon: MessageSquareText, label: t("floatingNav.support"), className: "bg-primary text-primary-foreground" }]
      : []),
    ...(location.pathname !== "/blog"
      ? [{ to: "/blog", icon: BookOpen, label: "인사이트", className: "bg-foreground text-background" }]
      : []),
  ];

  return (
    <>
      {/* Desktop — vertically centered */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2">
        {!isServiceRequest && location.pathname !== "/pricing" && (
          <Link
            to="/pricing"
            className="group relative w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            aria-label={t("floatingNav.pricing")}
          >
            <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">{t("floatingNav.pricing")}</span>
            <CreditCard className="w-5 h-5" />
          </Link>
        )}

        {!isServiceRequest && location.pathname !== "/sms-kakao" && (
          <Link
            to="/sms-kakao"
            className="group relative w-10 h-10 rounded-full bg-[hsl(45,93%,55%)] text-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            aria-label={t("floatingNav.smsKakao")}
          >
            <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">{t("floatingNav.smsKakao")}</span>
            <Send className="w-5 h-5" />
          </Link>
        )}

        {!isServiceRequest && (
          <Link
            to="/service-request"
            className="group relative w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            aria-label={t("floatingNav.support")}
          >
            <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">{t("floatingNav.support")}</span>
            <MessageSquareText className="w-5 h-5" />
          </Link>
        )}

        {location.pathname !== "/blog" && (
          <Link
            to="/blog"
            className="group relative w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity border-2 border-primary/40"
            aria-label="LMS 인사이트"
          >
            <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">LMS 인사이트</span>
            <BookOpen className="w-5 h-5" />
          </Link>
        )}
      </div>

      {/* Mobile — vertical stack, bottom right */}
      <div className="fixed right-3 bottom-4 z-50 md:hidden flex flex-col items-center gap-2">
        {mobileButtons.map((btn) => (
          <Link
            key={btn.to}
            to={btn.to}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg ${btn.className}`}
            aria-label={btn.label}
          >
            <btn.icon className="w-4 h-4" />
          </Link>
        ))}
      </div>

      {/* Mobile scroll buttons — separate group below */}
      {visible && (
        <div className="fixed right-3 bottom-4 z-40 md:hidden flex flex-col items-center gap-1.5">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center shadow-lg hover:bg-foreground transition-colors"
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
              className="w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center shadow-lg hover:bg-foreground transition-colors"
              aria-label="Scroll to bottom"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Desktop scroll buttons */}
      {visible && (
        <div className="fixed right-5 bottom-6 z-50 hidden md:flex flex-col gap-2">
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
