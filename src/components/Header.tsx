import { useState, useEffect, useRef, useCallback } from "react";
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
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [line, setLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  const serviceLabels = t("header.services", { returnObjects: true }) as string[];

  const services = serviceLabels.map((label, i) => ({
    label,
    path: servicePaths[i],
  }));

  const updateLine = useCallback(() => {
    const activeIndex = servicePaths.indexOf(location.pathname);
    if (activeIndex === -1 || activeIndex >= servicePaths.length - 1) {
      setLine(null);
      return;
    }
    const nav = navRef.current;
    const curr = linkRefs.current[activeIndex];
    const next = linkRefs.current[activeIndex + 1];
    if (!nav || !curr || !next) { setLine(null); return; }
    const navRect = nav.getBoundingClientRect();
    const currRect = curr.getBoundingClientRect();
    const nextRect = next.getBoundingClientRect();
    setLine({
      x1: currRect.right - navRect.left,
      y1: currRect.top + currRect.height / 2 - navRect.top,
      x2: nextRect.left - navRect.left,
      y2: nextRect.top + nextRect.height / 2 - navRect.top,
    });
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    // Delay to let layout settle
    const timer = setTimeout(updateLine, 50);
    window.addEventListener("resize", updateLine);
    return () => { clearTimeout(timer); window.removeEventListener("resize", updateLine); };
  }, [location, updateLine]);

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
            <nav ref={navRef} className="hidden lg:flex items-center justify-center gap-0.5 flex-1 relative">
              {line && (
                <svg className="absolute inset-0 pointer-events-none z-0" style={{ overflow: 'visible' }}>
                  <line
                    x1={line.x1} y1={line.y1}
                    x2={line.x2} y2={line.y2}
                    stroke={serviceBlobColors[location.pathname] || "hsl(250,55%,52%)"}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    opacity={0.45}
                  />
                </svg>
              )}
              {services.map((s, i) => {
                const isActive = location.pathname === s.path;
                const isLms = s.path === "/lms";
                const blobColor = serviceBlobColors[s.path];
                const showBlob = isLms || isActive;
                return (
                  <Link
                    key={s.path}
                    to={s.path}
                    ref={(el) => { linkRefs.current[i] = el; }}
                    className={`
                      relative z-10 whitespace-nowrap px-3.5 py-1.5 text-[0.9rem] font-semibold transition-all duration-200
                      ${showBlob
                        ? "text-white shadow-sm hover:scale-[1.03]" + (isLms ? " mr-3" : "")
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
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
                  className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-white"
                      : isLms
                        ? "text-[hsl(250,55%,52%)] bg-[hsl(250,55%,96%)]"
                        : "text-gray-500 hover:text-[hsl(230,25%,15%)] hover:bg-gray-50"
                  }`}
                  style={isActive ? { background: blobColor } : undefined}
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
