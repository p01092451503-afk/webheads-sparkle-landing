import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ExternalLink } from "lucide-react";

const services = [
  { label: "이러닝 호스팅", path: "/hosting", desc: "CDN / AWS / IDC" },
  { label: "AI 챗봇 개발", path: "/chatbot", desc: "맞춤형 AI 챗봇" },
  { label: "APP 개발", path: "/app-dev", desc: "iOS / Android / 하이브리드" },
  { label: "콘텐츠 개발", path: "/content", desc: "이러닝 콘텐츠 제작" },
  { label: "DRM 솔루션", path: "/drm", desc: "카테노이드 / 존플레이어" },
  { label: "채널톡 / SMS", path: "/channel", desc: "고객 커뮤니케이션" },
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
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-tight">WEBHEADS</span>
              <span className="block text-[10px] text-brand-cyan font-medium tracking-widest -mt-0.5">LMS & 이러닝 솔루션</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <a
              href="https://www.webheads.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-white/70 hover:text-white text-sm font-medium transition-colors flex items-center gap-1"
            >
              LMS 소개 <ExternalLink className="w-3 h-3" />
            </a>

            {/* Services Dropdown */}
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <button className="px-4 py-2 text-white/70 hover:text-white text-sm font-medium transition-colors flex items-center gap-1">
                부가서비스 <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-navy-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-scale-in">
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

            <Link to="/#contact" className="px-4 py-2 text-white/70 hover:text-white text-sm font-medium transition-colors">
              도입 문의
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:0212345678"
              className="text-white/60 text-sm hover:text-white transition-colors"
            >
              02-XXXX-XXXX
            </a>
            <Link
              to="/#contact"
              className="btn-primary px-5 py-2.5 text-sm rounded-lg"
            >
              무료 상담 신청
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-navy-800 border-t border-white/10 animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-1">
            <a
              href="https://www.webheads.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 text-white/70 hover:text-white text-sm rounded-lg hover:bg-white/5"
            >
              LMS 소개 <ExternalLink className="w-3 h-3" />
            </a>
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
            <div className="pt-3 pb-2">
              <Link
                to="/#contact"
                className="btn-primary block text-center px-5 py-3 text-sm rounded-lg"
              >
                무료 상담 신청
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
