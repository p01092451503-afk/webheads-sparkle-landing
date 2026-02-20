import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ChevronDown } from "lucide-react";
import logoWebheads from "@/assets/logo-webheads.png";

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, [location]);

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
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logoWebheads} alt="WEBHEADS" className="h-8 w-auto" />
            <span className="font-bold text-lg text-white tracking-wide">WEBHEADS</span>
          </Link>

          {/* Desktop Navigation - 부가서비스 드롭다운만 중앙 표시 */}
          <nav className="hidden lg:flex items-center">
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <button className="px-8 py-3 text-white hover:text-brand-cyan text-lg font-semibold transition-colors flex items-center gap-2">
                부가서비스 <ChevronDown className={`w-5 h-5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-72 bg-navy-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-scale-in">
                  {services.map((s) => (
                    <Link
                      key={s.path}
                      to={s.path}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
                    >
                      <div>
                        <div className="text-white text-sm font-medium group-hover:text-brand-cyan transition-colors">{s.label}</div>
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
            className="lg:hidden text-white p-2 text-lg font-semibold flex items-center gap-2"
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
