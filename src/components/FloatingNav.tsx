import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown, CreditCard, Send, BookOpen, FileText, Calculator } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FloatingNav() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLmsPage = location.pathname === "/lms" || location.pathname === "/";
  const isServiceRequest = location.pathname === "/service-request";

  const handleCostSimulator = () => {
    if (isLmsPage) {
      const el = document.getElementById("cost-simulator");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/lms#cost-simulator");
    }
  };

  const mobileButtons = [
    ...(!isServiceRequest && location.pathname !== "/pricing"
      ? [{ to: "/pricing", icon: CreditCard, label: t("floatingNav.pricing"), className: "bg-accent text-accent-foreground" }]
      : []),
    ...(!isServiceRequest && location.pathname !== "/sms-kakao"
      ? [{ to: "/sms-kakao", icon: Send, label: t("floatingNav.smsKakao"), className: "bg-[hsl(45,93%,55%)] text-foreground" }]
      : []),
    
    ...(location.pathname !== "/overview"
      ? [{ to: "/overview", icon: FileText, label: t("floatingNav.overview"), className: "bg-primary text-primary-foreground" }]
      : []),
    ...(location.pathname !== "/blog"
      ? [{ to: "/blog", icon: BookOpen, label: t("floatingNav.insights"), className: "bg-foreground text-background" }]
      : []),
  ];

  return (
    <div data-floating-nav>
      {/* Desktop — vertically centered */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2">
        <button onClick={handleCostSimulator} className="group relative w-10 h-10 rounded-lg bg-[hsl(var(--lms-primary))] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity" aria-label={t("floatingNav.costSimulator")}>
          <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">{t("floatingNav.costSimulator")}</span>
          <Calculator className="w-5 h-5" />
        </button>
        {!isServiceRequest && location.pathname !== "/pricing" && (
          <Link to="/pricing" className="group relative w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity" aria-label={t("floatingNav.pricing")}>
            <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">{t("floatingNav.pricing")}</span>
            <CreditCard className="w-5 h-5" />
          </Link>
        )}
        {!isServiceRequest && location.pathname !== "/sms-kakao" && (
          <Link to="/sms-kakao" className="group relative w-10 h-10 rounded-full bg-[hsl(45,93%,55%)] text-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity" aria-label={t("floatingNav.smsKakao")}>
            <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">{t("floatingNav.smsKakao")}</span>
            <Send className="w-5 h-5" />
          </Link>
        )}
        {location.pathname !== "/overview" && (
          <Link to="/overview" className="group relative w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity" aria-label={t("floatingNav.overview")}>
            <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">{t("floatingNav.overview")}</span>
            <FileText className="w-5 h-5" />
          </Link>
        )}
        {location.pathname !== "/blog" && (
          <Link to="/blog" className="group relative w-10 h-10 rounded-lg bg-foreground text-background flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity border-2 border-primary/40" aria-label={t("floatingNav.insights")}>
            <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">{t("floatingNav.insights")}</span>
            <BookOpen className="w-5 h-5" />
          </Link>
        )}
      </div>

      {/* Mobile — action buttons, bottom right above scroll buttons */}
      <div className="fixed right-3 bottom-32 z-50 md:hidden flex flex-col items-center gap-2">
        <button
          onClick={handleCostSimulator}
          className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg bg-[hsl(var(--lms-primary))] text-white"
          aria-label={t("floatingNav.costSimulator")}
        >
          <Calculator className="w-4 h-4" />
        </button>
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

      {/* Mobile scroll buttons — fixed at very bottom */}
      {visible && (
        <div className="fixed right-3 bottom-4 z-50 md:hidden flex flex-col items-center gap-1.5">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center shadow-lg hover:bg-foreground transition-colors" aria-label="Scroll to top">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })} className="w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center shadow-lg hover:bg-foreground transition-colors" aria-label="Scroll to bottom">
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Desktop scroll buttons */}
      {visible && (
        <div className="fixed right-5 bottom-6 z-50 hidden md:flex flex-col gap-2">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-10 h-10 rounded-full bg-foreground/80 text-background flex items-center justify-center shadow-lg hover:bg-foreground transition-colors" aria-label="Scroll to top">
            <ChevronUp className="w-5 h-5" />
          </button>
          <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })} className="w-10 h-10 rounded-full bg-foreground/80 text-background flex items-center justify-center shadow-lg hover:bg-foreground transition-colors" aria-label="Scroll to bottom">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
