import { Link, useLocation, useNavigate } from "react-router-dom";
import { CreditCard, Send, BookOpen, FileText, Calculator } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FloatingNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

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

  const glassBase = "backdrop-blur-xl bg-background/40 border border-white/20 text-foreground shadow-[0_4px_16px_rgba(0,0,0,0.12)] ring-1 ring-black/5";

  const mobileButtons = [
    ...(!isServiceRequest && location.pathname !== "/pricing"
      ? [{ to: "/pricing", icon: CreditCard, label: t("floatingNav.pricing"), className: glassBase }]
      : []),
    ...(!isServiceRequest && location.pathname !== "/sms-kakao"
      ? [{ to: "/sms-kakao", icon: Send, label: t("floatingNav.smsKakao"), className: glassBase }]
      : []),
    
    ...(location.pathname !== "/overview"
      ? [{ to: "/overview", icon: FileText, label: t("floatingNav.overview"), className: glassBase }]
      : []),
    ...(location.pathname !== "/blog"
      ? [{ to: "/blog", icon: BookOpen, label: t("floatingNav.insights"), className: glassBase }]
      : []),
  ];

  return (
    <div data-floating-nav>
      {/* Desktop — vertically centered */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2">
        <button onClick={handleCostSimulator} className={`group relative w-10 h-10 rounded-full ${glassBase} flex items-center justify-center hover:bg-background/90 transition-all`} aria-label={t("floatingNav.costSimulator")}>
          <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">{t("floatingNav.costSimulator")}</span>
          <Calculator className="w-5 h-5" />
        </button>
        {!isServiceRequest && location.pathname !== "/pricing" && (
          <Link to="/pricing" className={`group relative w-10 h-10 rounded-full ${glassBase} flex items-center justify-center hover:bg-background/90 transition-all`} aria-label={t("floatingNav.pricing")}>
            <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">{t("floatingNav.pricing")}</span>
            <CreditCard className="w-5 h-5" />
          </Link>
        )}
        {!isServiceRequest && location.pathname !== "/sms-kakao" && (
          <Link to="/sms-kakao" className={`group relative w-10 h-10 rounded-full ${glassBase} flex items-center justify-center hover:bg-background/90 transition-all`} aria-label={t("floatingNav.smsKakao")}>
            <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">{t("floatingNav.smsKakao")}</span>
            <Send className="w-5 h-5" />
          </Link>
        )}
        {location.pathname !== "/overview" && (
          <Link to="/overview" className={`group relative w-10 h-10 rounded-full ${glassBase} flex items-center justify-center hover:bg-background/90 transition-all`} aria-label={t("floatingNav.overview")}>
            <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">{t("floatingNav.overview")}</span>
            <FileText className="w-5 h-5" />
          </Link>
        )}
        {location.pathname !== "/blog" && (
          <Link to="/blog" className={`group relative w-10 h-10 rounded-full ${glassBase} flex items-center justify-center hover:bg-background/90 transition-all`} aria-label={t("floatingNav.insights")}>
            <span className="absolute right-full mr-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">{t("floatingNav.insights")}</span>
            <BookOpen className="w-5 h-5" />
          </Link>
        )}
      </div>

      {/* Mobile — action buttons, bottom right above scroll buttons */}
      <div className="fixed right-3 bottom-[230px] z-50 md:hidden flex flex-col items-center gap-2">
        <button
          onClick={handleCostSimulator}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-background text-primary font-semibold text-xs shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all"
          aria-label={t("floatingNav.costSimulator")}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{t("floatingNav.costSimulator")}</span>
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
    </div>
  );
}
