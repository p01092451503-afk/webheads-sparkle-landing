import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

const servicePaths = ["/lms", "/hosting", "/maintenance", "/chatbot", "/app-dev", "/drm", "/channel", "/pg", "/content"];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const services = (t("header.services", { returnObjects: true }) as string[]).map((label, i) => ({
    label,
    path: servicePaths[i],
  }));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
        <div className="flex items-center gap-6 h-[64px]">
          <Link to="/lms" className="shrink-0 tracking-tight text-white lg:static absolute left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-auto" style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 800, fontSize: "1.75rem" }}>
            {t("header.logo")}
          </Link>
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center gap-1">
              {services.map((s, idx) => {
                const isActive = location.pathname === s.path;
                const isLms = s.path === "/lms";
                return (
                  <span key={s.path} className="flex items-center">
                    <Link
                      to={s.path}
                      className={`whitespace-nowrap px-5 py-2 rounded-lg text-[0.96rem] font-semibold transition-all duration-200 ${
                        isLms
                          ? isActive
                            ? "text-white bg-white/15"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                          : isActive
                          ? "text-white bg-white/15"
                          : "text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {s.label}
                    </Link>
                    {idx === 0 && <span className="w-[1px] h-5 bg-white/20 mx-2" />}
                  </span>
                );
              })}
            </div>
          </nav>
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <a href="#contact" className="hidden lg:inline-flex shrink-0 px-6 py-2.5 rounded-full text-[0.88rem] font-bold bg-white text-[hsl(230,25%,12%)] hover:bg-white/90 transition-all duration-200 hover:shadow-md whitespace-nowrap">
            {t("header.cta")}
          </a>
          <button className="lg:hidden ml-auto p-2 text-white/70 hover:text-white transition-colors" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden bg-[hsl(230,25%,12%)] border-t border-white/10 shadow-md">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
            {services.map((s) => {
              const isActive = location.pathname === s.path;
              return (
                <Link key={s.path} to={s.path} className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "text-white bg-white/15" : "text-white/60 hover:text-white hover:bg-white/10"}`}>
                  {s.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            <a href="#contact" className="mt-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-[hsl(230,25%,12%)] text-center">
              {t("header.cta")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
