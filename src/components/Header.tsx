import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Server, Shield, Puzzle, Monitor, Wrench, Smartphone, Lock, Film, Bot, MessageSquare, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const servicePaths = ["/lms", "/hosting", "/maintenance", "/chatbot", "/app-dev", "/drm", "/channel", "/pg", "/content"];

// Icons per service index (0=LMS, 1=Hosting, ...)
const serviceIcons = [Monitor, Server, Wrench, Bot, Smartphone, Lock, MessageSquare, CreditCard, Film];

// Group icons
const groupIcons = [Server, Shield, Puzzle];

const serviceGroups = [
  { indices: [1, 2, 4] },       // 개발 & 인프라
  { indices: [5, 8] },          // 콘텐츠 & 보안
  { indices: [3, 6, 7] },       // 연동 서비스
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const location = useLocation();
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const serviceLabels = t("header.services", { returnObjects: true }) as string[];
  const serviceDescriptions = t("header.serviceDescriptions", { returnObjects: true }) as string[];
  const groupLabels = t("header.groups", { returnObjects: true }) as string[];

  const services = serviceLabels.map((label, i) => ({
    label,
    description: serviceDescriptions[i],
    path: servicePaths[i],
    Icon: serviceIcons[i],
  }));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isServiceActive = servicePaths.slice(1).includes(location.pathname);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200/60" : "bg-white/90 backdrop-blur-md border-b border-gray-200/40"}`}>
      <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
        <div className="flex items-center gap-4 h-[56px]">
          <Link to="/lms" className="shrink-0 tracking-tight text-[hsl(230,25%,15%)]" style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 800, fontSize: "1.625rem" }}>
            {t("header.logo")}
          </Link>

          <nav className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center gap-0.5">
              {/* LMS - Main product */}
              <Link
                to="/lms"
                className="whitespace-nowrap px-3.5 py-1.5 rounded-lg text-[0.96rem] font-medium transition-all duration-200 text-white bg-gradient-to-r from-[hsl(250,50%,50%)] to-[hsl(230,60%,45%)] shadow-sm"
              >
                {services[0].label}
              </Link>

              <span className="w-[1.5px] h-5 bg-gray-300 mx-2 rounded-full" />

              {/* Services Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-1 whitespace-nowrap px-3.5 py-1.5 rounded-lg text-[0.96rem] font-medium transition-all duration-200 ${
                    isServiceActive
                      ? "text-[hsl(230,25%,15%)] bg-gray-200"
                      : "text-gray-500 hover:text-[hsl(230,25%,15%)] hover:bg-gray-200"
                  }`}
                >
                  {t("header.allServices")}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[560px] rounded-2xl bg-white border border-gray-200/80 shadow-2xl p-6 z-50">
                    <div className="grid grid-cols-3 gap-6">
                      {serviceGroups.map((group, gi) => {
                        const GroupIcon = groupIcons[gi];
                        return (
                          <div key={gi}>
                            <div className="flex items-center gap-1.5 mb-3 px-1">
                              <GroupIcon className="w-3.5 h-3.5 text-gray-400" />
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {groupLabels[gi + 1]}
                              </p>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              {group.indices.map((idx) => {
                                const s = services[idx];
                                const isActive = location.pathname === s.path;
                                const isHovered = hoveredService === idx;
                                const ServiceIcon = s.Icon;
                                return (
                                  <Link
                                    key={s.path}
                                    to={s.path}
                                    onMouseEnter={() => setHoveredService(idx)}
                                    onMouseLeave={() => setHoveredService(null)}
                                    className={`group/item px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                      isActive
                                        ? "text-[hsl(230,25%,15%)] bg-[hsl(230,90%,96%)]"
                                        : "text-gray-600 hover:text-[hsl(230,25%,15%)] hover:bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <ServiceIcon className={`w-4 h-4 shrink-0 transition-colors duration-200 ${isActive ? "text-[hsl(250,50%,50%)]" : "text-gray-400 group-hover/item:text-[hsl(250,50%,55%)]"}`} />
                                      <span>{s.label}</span>
                                    </div>
                                    <div
                                      className={`overflow-hidden transition-all duration-200 ease-out ${isHovered || isActive ? "max-h-6 opacity-100 mt-1" : "max-h-0 opacity-0 mt-0"}`}
                                    >
                                      <p className="text-[11px] text-gray-400 pl-6 leading-tight">{s.description}</p>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-1">
            <LanguageSwitcher />
          </div>
          <a href="#contact" className="hidden lg:inline-flex shrink-0 px-5 py-2 rounded-full text-sm font-bold bg-[hsl(230,25%,15%)] text-white hover:bg-[hsl(230,25%,20%)] transition-all duration-200 hover:shadow-md whitespace-nowrap">
            {t("header.cta")}
          </a>
          <button className="lg:hidden ml-auto p-2 text-gray-500 hover:text-gray-800 transition-colors" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[hsl(230,25%,12%)] border-t border-white/10 shadow-md">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
            {/* LMS */}
            <Link to="/lms" className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/lms" ? "text-white bg-white/15" : "text-white/60 hover:text-white hover:bg-white/10"}`}>
              <Monitor className="w-4 h-4" />
              {services[0].label}
            </Link>

            {/* Grouped services */}
            {serviceGroups.map((group, gi) => {
              const GroupIcon = groupIcons[gi];
              return (
                <div key={gi} className="mt-2">
                  <div className="flex items-center gap-1.5 mb-1 px-3">
                    <GroupIcon className="w-3 h-3 text-white/25" />
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                      {groupLabels[gi + 1]}
                    </p>
                  </div>
                  {group.indices.map((idx) => {
                    const s = services[idx];
                    const isActive = location.pathname === s.path;
                    const ServiceIcon = s.Icon;
                    return (
                      <Link key={s.path} to={s.path} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "text-white bg-white/15" : "text-white/60 hover:text-white hover:bg-white/10"}`}>
                        <ServiceIcon className="w-4 h-4" />
                        {s.label}
                      </Link>
                    );
                  })}
                </div>
              );
            })}

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
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
