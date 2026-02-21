import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-border ${scrolled ? "shadow-sm" : ""}`}>
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex items-center gap-6 h-16">
          <Link to="/lms" className="shrink-0 tracking-tight text-foreground" style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 700, fontSize: "1.625rem" }}>
            {t("header.logo")}
          </Link>
          <nav className="hidden lg:flex items-center justify-center gap-1.5 flex-1">
            {services.map((s) => {
              const isActive = location.pathname === s.path;
              return (
                <Link key={s.path} to={s.path} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                  {s.label}
                </Link>
              );
            })}
          </nav>
          <LanguageSwitcher />
          <a href="#contact" className="hidden lg:inline-flex shrink-0 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap">
            {t("header.cta")}
          </a>
          <button className="lg:hidden ml-auto p-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border shadow-md">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
            {services.map((s) => {
              const isActive = location.pathname === s.path;
              return (
                <Link key={s.path} to={s.path} className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                  {s.label}
                </Link>
              );
            })}
            <a href="#contact" className="mt-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground text-center">
              {t("header.cta")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
