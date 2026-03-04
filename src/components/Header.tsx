import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Headset } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const isLightPage = location.pathname === "/service-request" || location.pathname === "/overview" || location.pathname === "/blog";
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
  }, [location]);

  return (
    <>
      {/* Top promo banner */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] overflow-hidden bg-muted border-b border-border"
      >
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-center gap-3 py-2 relative z-10">
          <p className="text-sm sm:text-base font-bold tracking-tight text-foreground">
            막막한 교육 플랫폼 구축, 3월 내 신청 시 2개월 LMS 무료 이용권 증정! (~3/31)
          </p>
          <a
            href="#contact"
            className="shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-opacity hover:opacity-80 text-foreground"
            style={{ backgroundColor: "hsl(50, 100%, 50%)" }}
          >
            신청하기
          </a>
        </div>
      </div>
    <header className="fixed top-[44px] left-0 right-0 z-50">
      {/* Main bar */}
      <div
        className={`transition-all duration-300 ${
          effectiveScrolled
            ? "bg-white/98 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="flex items-center h-[56px]">
            {/* Logo */}
            <Link
              to="/lms"
              className={`shrink-0 tracking-tight mr-8 transition-colors duration-300 ${effectiveScrolled ? "text-[hsl(230,25%,15%)]" : "text-white"}`}
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
                        : effectiveScrolled ? "text-foreground hover:bg-gray-100" : "text-white hover:bg-white/10"
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
              <Link
                to={location.pathname === "/service-request" ? "/#contact" : "#contact"}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 hover:shadow-md whitespace-nowrap ${
                  effectiveScrolled
                    ? "bg-[hsl(230,25%,15%)] text-white hover:bg-[hsl(230,25%,20%)]"
                    : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                }`}
              >
                {t("header.cta")}
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className={`lg:hidden ml-auto p-2 transition-colors ${effectiveScrolled ? "text-gray-500 hover:text-gray-800" : "text-white/80 hover:text-white"}`}
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
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-0.5">
            {services.map((s) => {
              const isActive = location.pathname === s.path;
              return (
                <Link
                  key={s.path}
                  to={s.path}
                  className={`inline-block w-fit px-3 py-2.5 text-sm font-normal rounded-lg transition-colors ${
                    isActive
                      ? "text-[hsl(250,55%,52%)] font-medium"
                      : "text-[hsl(230,25%,15%)] hover:bg-gray-50"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <LanguageSwitcher />
            </div>
            <Link
              to={location.pathname === "/service-request" ? "/#contact" : "#contact"}
              className="mt-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[hsl(230,25%,15%)] text-white text-center"
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
