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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/85 backdrop-blur-2xl shadow-xl border-b border-border/40" : "bg-background/70 backdrop-blur-lg border-b border-transparent"}`}>
      <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
        <div className="flex items-center gap-4 h-[56px]">
          <Link to="/lms" className="shrink-0 tracking-tight text-foreground" style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 800, fontSize: "1.625rem" }}>
            {t("header.logo")}
          </Link>
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center gap-0 bg-muted/50 dark:bg-muted/30 rounded-full px-1.5 py-1 border border-border/30">
              {services.map((s, idx) => {
                const isActive = location.pathname === s.path;
                const isLms = s.path === "/lms";
                return (
                  <span key={s.path} className="flex items-center">
                    <Link
                      to={s.path}
                      className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                        isLms
                          ? "text-white shadow-md hover:shadow-lg hover:brightness-110"
                          : isActive
                          ? "text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                      }`}
                      style={
                        isLms
                          ? { background: isActive ? "hsl(255, 75%, 52%)" : "hsl(255, 65%, 58%)" }
                          : isActive
                          ? { background: "hsl(214, 50%, 58%)" }
                          : undefined
                      }
                    >
                      {s.label}
                    </Link>
                    {idx === 0 && <span className="w-[1.5px] h-5 bg-foreground/25 mx-2.5" />}
                  </span>
                );
              })}
            </div>
          </nav>
          <div className="hidden lg:flex items-center gap-1">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <a href="#contact" className="hidden lg:inline-flex shrink-0 px-5 py-2 rounded-full text-sm font-bold bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 hover:shadow-md whitespace-nowrap">
            {t("header.cta")}
          </a>
          <button className="lg:hidden ml-auto p-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border shadow-md">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
            {services.map((s) => {
              const isActive = location.pathname === s.path;
              const isLms = s.path === "/lms";
              return (
                <Link key={s.path} to={s.path} className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isLms ? (isActive ? "text-white shadow-md" : "text-white") : isActive ? "text-white" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`} style={isLms ? { background: isActive ? "hsl(255, 75%, 55%)" : "hsl(255, 65%, 58%)" } : isActive ? { background: "hsl(214, 45%, 65%)" } : undefined}>
                  {s.label}
                </Link>
              );
            })}
            <a href="#contact" className="mt-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-foreground text-background text-center">
              {t("header.cta")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
