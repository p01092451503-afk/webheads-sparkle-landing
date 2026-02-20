import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ChevronDown } from "lucide-react";

const services = [
  { label: "이러닝 호스팅", path: "/hosting", desc: "CDN / AWS / IDC" },
  { label: "AI 챗봇 개발", path: "/chatbot", desc: "맞춤형 AI 챗봇" },
  { label: "APP 개발", path: "/app-dev", desc: "iOS / Android / 하이브리드" },
  { label: "콘텐츠 개발", path: "/content", desc: "이러닝 콘텐츠 제작" },
  { label: "DRM 솔루션", path: "/drm", desc: "카테노이드 / 존플레이어" },
  { label: "채널톡 / SMS", path: "/channel", desc: "고객 커뮤니케이션" },
  { label: "PG 결제 연동", path: "/pg", desc: "토스 / 이니시스 / 해외결제" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, [location]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-900 shadow-lg"
          : "bg-navy-900/95 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center select-none"
            style={{
              fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
              fontWeight: 800,
              fontSize: "1.35rem",
              letterSpacing: "-0.04em",
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            웹헤즈
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServicesOpen((prev) => !prev)}
                className="px-8 py-3 text-white hover:text-brand-cyan text-lg font-semibold transition-colors flex items-center gap-2"
              >
                부가서비스 <ChevronDown className={`w-5 h-5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 w-72 bg-navy-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-scale-in" style={{ zIndex: 100 }}>
                  {services.map((s) => (
                    <Link
                      key={s.path}
                      to={s.path}
                      onClick={() => setServicesOpen(false)}
                      className="flex items-start gap-3 px-5 py-4 hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0"
                    >
                      <div>
                        <div className="text-white font-semibold group-hover:text-brand-cyan transition-colors">{s.label}</div>
                        <div className="text-white/40 text-xs mt-0.5">{s.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 text-base font-semibold flex items-center gap-1.5"
            onClick={() => setIsOpen(!isOpen)}
          >
            부가서비스 {isOpen ? <X className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-navy-800 border-t border-white/10 animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-1">
            <div className="px-3 py-1.5 text-xs text-white/30 font-semibold tracking-wider uppercase">부가서비스</div>
            {services.map((s) => (
              <Link
                key={s.path}
                to={s.path}
                className="block px-3 py-2.5 text-white/70 hover:text-white text-sm rounded-lg hover:bg-white/5"
              >
                {s.label}
                <span className="text-white/30 text-xs ml-2">{s.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

