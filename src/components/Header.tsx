import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const services = [
  { label: "이러닝호스팅", path: "/hosting" },
  { label: "AI챗봇", path: "/chatbot" },
  { label: "어플리케이션", path: "/app-dev" },
  { label: "콘텐츠", path: "/content" },
  { label: "DRM", path: "/drm" },
  { label: "채널톡/SMS", path: "/channel" },
  { label: "PG", path: "/pg" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-border ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex items-center gap-6 h-16">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 font-black text-xl tracking-tight text-foreground"
            style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}
          >
            웹헤즈
          </Link>

          {/* Desktop: 서비스 메뉴 수평 나열 */}
          <nav className="hidden lg:flex items-center justify-center gap-1 flex-1">
            {services.map((s) => {
              const isActive = location.pathname === s.path;
              return (
                <Link
                  key={s.path}
                  to={s.path}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-base font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}
          </nav>

          {/* 무료 상담 CTA */}
          <a
            href="#contact"
            className="hidden lg:inline-flex shrink-0 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            무료 상담
          </a>

          {/* Mobile: 햄버거 */}
          <button
            className="lg:hidden ml-auto p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="메뉴 열기"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile 메뉴 */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border shadow-md">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
            {services.map((s) => {
              const isActive = location.pathname === s.path;
              return (
                <Link
                  key={s.path}
                  to={s.path}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}
            <a
              href="#contact"
              className="mt-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground text-center"
            >
              무료 상담
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
