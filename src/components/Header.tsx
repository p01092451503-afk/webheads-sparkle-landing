import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Mail, MonitorSmartphone, ChevronRight, MessageSquareText, ScreenShare } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const servicePaths = ["/lms", "/hosting", "/maintenance", "/chatbot", "/app-dev", "/drm", "/channel", "/pg", "/content"];

// Solid colors per service for the organic blob nav indicator
const serviceBlobColors: Record<string, string> = {
  "/lms": "hsl(250, 55%, 52%)",
  "/hosting": "hsl(250, 55%, 52%)",
  "/maintenance": "hsl(250, 55%, 52%)",
  "/chatbot": "hsl(192, 50%, 42%)",
  "/app-dev": "hsl(192, 50%, 42%)",
  "/drm": "hsl(235, 45%, 48%)",
  "/channel": "hsl(192, 50%, 42%)",
  "/pg": "hsl(235, 45%, 48%)",
  "/content": "hsl(235, 45%, 48%)",
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const supportRef = useRef<HTMLDivElement>(null);
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    try {
      const dismissed = localStorage.getItem("promo_banner_dismissed");
      if (!dismissed) return false;
      const dismissedAt = new Date(dismissed).getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      return Date.now() - dismissedAt < oneDay;
    } catch { return false; }
  });
  const [bannerReady, setBannerReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const isLightPage = location.pathname === "/service-request" || location.pathname === "/overview" || location.pathname === "/blog" || location.pathname === "/event";
  const effectiveScrolled = scrolled || isLightPage;

  const serviceLabels = t("header.services", { returnObjects: true }) as string[];

  const services = serviceLabels.map((label, i) => ({
    label,
    path: servicePaths[i],
  }));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSupportOpen(false);
  }, [location]);

  // Close support popover on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (supportRef.current && !supportRef.current.contains(e.target as Node)) {
        setSupportOpen(false);
      }
    };
    if (supportOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [supportOpen]);

  useEffect(() => {
    const timer = setTimeout(() => setBannerReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const showBanner = bannerReady && !bannerDismissed && new Date() <= new Date("2026-03-31T23:59:59+09:00");

  return (
    <>
      {/* Top promo banner */}
      {(!bannerDismissed && new Date() <= new Date("2026-03-31T23:59:59+09:00")) && (
        <div
          className={`fixed top-0 left-0 right-0 z-[60] overflow-hidden border-b border-border transition-transform duration-500 ease-out ${showBanner ? "translate-y-0" : "-translate-y-full"}`}
          style={{ backgroundColor: "hsl(250, 60%, 95%)" }}
          role="banner"
          aria-label={t("banner.text")}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1400 44" aria-hidden="true">
            {/* Bold filled circles */}
            <circle cx="80" cy="22" r="80" fill="hsl(280, 55%, 78%)" opacity="0.49" />
            <circle cx="350" cy="10" r="50" fill="hsl(260, 50%, 80%)" opacity="0.42" />
            <circle cx="600" cy="30" r="70" fill="hsl(300, 45%, 82%)" opacity="0.385" />
            <circle cx="850" cy="15" r="60" fill="hsl(270, 50%, 79%)" opacity="0.455" />
            <circle cx="1100" cy="25" r="75" fill="hsl(250, 55%, 81%)" opacity="0.42" />
            <circle cx="1300" cy="18" r="55" fill="hsl(290, 45%, 80%)" opacity="0.455" />
          </svg>
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="container mx-auto px-3 sm:px-4 max-w-7xl flex items-center justify-center gap-2 sm:gap-3 py-2 relative z-10">
            <p className="text-sm sm:text-base font-medium tracking-tight text-foreground leading-snug text-center">
              <span className="sm:hidden">{t("banner.textShort")}</span>
              <span className="hidden sm:inline">{t("banner.text")}</span>
            </p>
            <Link
              to="/event"
              className="shrink-0 rounded-full px-2.5 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold transition-opacity hover:opacity-80 text-foreground min-h-[28px] sm:min-h-[32px] flex items-center"
              style={{ backgroundColor: "hsl(50, 100%, 50%)" }}
              aria-label={t("banner.cta")}
            >
              {t("banner.cta")}
            </Link>
          </div>
          <button
            onClick={() => {
              setBannerDismissed(true);
              try { localStorage.setItem("promo_banner_dismissed", new Date().toISOString()); } catch {}
            }}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 text-foreground/60 hover:text-foreground transition-colors text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-1 rounded-md hover:bg-foreground/5 min-h-[32px] flex items-center"
            aria-label={t("banner.dismiss")}
          >
            <span className="hidden sm:inline">{t("banner.dismiss")}</span>
            <X className="w-4 h-4 sm:hidden" aria-hidden="true" />
          </button>
        </div>
      )}
    <header className={`fixed left-0 right-0 z-50 transition-[top] duration-500 ease-out ${showBanner ? "top-[44px]" : "top-0"}`}>
      {/* Main bar */}
      <div
        className={`transition-all duration-300 ${
          effectiveScrolled
            ? "bg-background/98 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="flex items-center h-[56px]">
            {/* Logo */}
            <Link
              to="/lms"
              className={`shrink-0 tracking-tight mr-8 transition-colors duration-300 ${effectiveScrolled ? "text-foreground" : "text-white"}`}
              style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 700, fontSize: "1.625rem", fontStyle: "italic" }}
            >
              {t("header.logo")}
            </Link>

            {/* Desktop Nav — all services inline */}
            <nav className="hidden lg:flex items-center justify-center gap-1 flex-1">
              {services.map((s) => {
                const isActive = location.pathname === s.path;
                return (
                  <Link
                    key={s.path}
                    to={s.path}
                    className={`
                      relative whitespace-nowrap px-3.5 py-1.5 text-[0.9rem] font-medium rounded-lg transition-colors duration-200
                      ${isActive
                        ? effectiveScrolled ? "text-foreground underline underline-offset-4 decoration-2" : "text-white underline underline-offset-4 decoration-2"
                        : effectiveScrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"
                      }
                    `}
                  >
                    {s.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-2 ml-auto">
              <LanguageSwitcher scrolled={effectiveScrolled} />
              <div className="relative" ref={supportRef}>
                <button
                  onClick={() => setSupportOpen((v) => !v)}
                  className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    effectiveScrolled
                      ? "text-foreground hover:bg-muted border border-border"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {t("header.customerSupport")}
                </button>

                {/* Support Popover */}
                {supportOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+10px)] w-[360px] bg-card rounded-2xl overflow-hidden animate-fade-in border border-border"
                    style={{
                      zIndex: 100,
                      boxShadow: "0 16px 48px -12px hsla(220, 30%, 20%, 0.15)",
                    }}
                  >
                    {/* SMS */}
                    <a
                      href="https://help.webheads.co.kr/login.php"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 px-5 py-4 transition-colors"
                      style={{ background: "transparent" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "hsl(220, 14%, 92%)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "hsl(221, 83%, 53%, 0.08)", color: "hsl(221, 83%, 53%)" }}
                      >
                        <MessageSquareText className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-foreground tracking-[-0.02em]">SMS 충전</p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">문자 발송 건수 충전 및 현황 확인</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </a>

                    {/* Divider */}
                    <div className="mx-5 h-px bg-border/60" />

                    {/* Remote Support */}
                    <a
                      href="https://help.webheads.co.kr/kolluscrm.php"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 px-5 py-4 transition-colors"
                      style={{ background: "transparent" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "hsl(220, 14%, 92%)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "hsl(152, 57%, 42%, 0.08)", color: "hsl(152, 57%, 42%)" }}
                      >
                        <ScreenShare className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-foreground tracking-[-0.02em]">원격지원 요청</p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">카테노이드 원격지원으로 빠르게 해결</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                )}
              </div>
              <Link
                to={location.pathname === "/service-request" ? "/#contact" : "#contact"}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md whitespace-nowrap ${
                  effectiveScrolled
                    ? "bg-foreground text-background hover:opacity-90"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {t("header.cta")}
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className={`lg:hidden ml-auto p-2 transition-colors ${effectiveScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white"}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>


      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border shadow-lg">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-0.5">
            {services.map((s) => {
              const isActive = location.pathname === s.path;
              return (
                <Link
                  key={s.path}
                  to={s.path}
                    className={`inline-block w-fit px-3 py-2.5 text-sm font-normal rounded-lg transition-colors ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <LanguageSwitcher />
            </div>
            <button
              onClick={() => setSupportOpen((v) => !v)}
              className="mt-2 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors w-full text-left"
            >
              {t("header.customerSupport")}
            </button>
            {supportOpen && (
              <div className="mx-1 mb-2 rounded-xl border border-border bg-accent/30 overflow-hidden">
                <a
                  href="https://help.webheads.co.kr/login.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent/60 transition-colors"
                >
                  <Mail className="w-4 h-4" style={{ color: "hsl(221, 83%, 53%)" }} />
                  <span className="text-sm font-medium text-foreground">SMS 충전</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 ml-auto" />
                </a>
                <div className="mx-4 h-px bg-border/60" />
                <a
                  href="https://help.webheads.co.kr/kolluscrm.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent/60 transition-colors"
                >
                  <MonitorSmartphone className="w-4 h-4" style={{ color: "hsl(152, 57%, 42%)" }} />
                  <span className="text-sm font-medium text-foreground">원격지원 요청</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 ml-auto" />
                </a>
              </div>
            )}
            <Link
              to={location.pathname === "/service-request" ? "/#contact" : "#contact"}
              className="mt-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-foreground text-background text-center"
            >
              {t("header.cta")}
            </Link>
          </div>
        </div>
      )}
    </header>
    </>
  );
}
