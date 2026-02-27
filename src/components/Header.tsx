import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
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
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main bar */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/98 backdrop-blur-xl shadow-sm"
            : "bg-white"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="flex items-center h-[56px]">
            {/* Logo */}
            <Link
              to="/lms"
              className="shrink-0 tracking-tight text-[hsl(230,25%,15%)] mr-8"
              style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 800, fontSize: "1.625rem" }}
            >
              {t("header.logo")}
            </Link>

            {/* Desktop Nav — all services inline */}
            <nav className="hidden lg:flex items-center justify-center gap-0.5 flex-1">
              {services.map((s) => {
                const isActive = location.pathname === s.path;
                const isLms = s.path === "/lms";
                const blobColor = serviceBlobColors[s.path];
                const showBlob = isActive || (isLms && location.pathname === "/lms");
                return (
                  <Link
                    key={s.path}
                    to={s.path}
                    className={`
                      relative whitespace-nowrap px-3.5 py-1.5 text-[0.9rem] font-semibold transition-all duration-200
                      ${showBlob
                        ? "text-white shadow-sm hover:scale-[1.03]" + (isLms ? " mr-3" : "")
                        : "text-gray-500 hover:text-[hsl(230,25%,15%)] hover:bg-gray-50 rounded-lg"
                      }
                    `}
                    style={showBlob ? {
                      background: blobColor,
                      borderRadius: "30% 70% 70% 30% / 60% 40% 60% 40%",
                    } : undefined}
                  >
                    {s.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-2 ml-auto">
              <LanguageSwitcher />
              <a
                href="#contact"
                className="shrink-0 px-5 py-2 rounded-full text-sm font-bold bg-[hsl(230,25%,15%)] text-white hover:bg-[hsl(230,25%,20%)] transition-all duration-200 hover:shadow-md whitespace-nowrap"
              >
                {t("header.cta")}
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden ml-auto p-2 text-gray-500 hover:text-gray-800 transition-colors"
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
              const isLms = s.path === "/lms";
              const blobColor = serviceBlobColors[s.path];
              return (
                <Link
                  key={s.path}
                  to={s.path}
                  className={`px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive || isLms
                      ? "text-white shadow-sm"
                      : "text-gray-500 hover:text-[hsl(230,25%,15%)] hover:bg-gray-50 rounded-lg"
                  }`}
                  style={(isActive || isLms) ? {
                    background: blobColor,
                    borderRadius: "30% 70% 70% 30% / 60% 40% 60% 40%",
                  } : undefined}
                >
                  {s.label}
                </Link>
              );
            })}

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <LanguageSwitcher />
            </div>
            <a
              href="#contact"
              className="mt-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[hsl(230,25%,15%)] text-white text-center"
            >
              {t("header.cta")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
