import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import logoWebheads from "@/assets/logo-webheads.png";

const services = [
  { label: "이러닝 호스팅", path: "/hosting" },
  { label: "AI 챗봇 개발", path: "/chatbot" },
  { label: "APP 개발", path: "/app-dev" },
  { label: "콘텐츠 개발", path: "/content" },
  { label: "DRM 솔루션", path: "/drm" },
  { label: "채널톡 / SMS", path: "/channel" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white border-t border-white/10">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <img src={logoWebheads} alt="WEBHEADS" className="h-8 w-auto" />
              <span className="font-bold text-xl tracking-wide">WEBHEADS</span>
            </div>

            {/* Company Info */}
            <div className="mb-5">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Company</p>
              <div className="space-y-1.5 text-white/55 text-sm">
                <p>대표 <span className="text-white/80 font-medium">박진열</span> &nbsp;|&nbsp; 사업자등록번호 204-86-20072</p>
                <p>03971 서울특별시 마포구 월드컵로 114, 3층</p>
                <p>개인정보관리책임자 강성일 &nbsp;|&nbsp; elise75@webheads.co.kr</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mb-6">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Time</p>
              <div className="space-y-1 text-white/55 text-sm">
                <p>평일 10:00 – 18:00 <span className="text-white/35">(점심시간 12:00–13:00)</span></p>
                <p>주 5일 근무 <span className="text-white/35">(토/일/ 공휴일 휴무)</span></p>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/40 text-xs mb-1.5">신규 도입 문의</p>
                <a href="tel:023364338" className="text-white font-bold text-lg hover:text-brand-cyan transition-colors">
                  02.336.4338
                </a>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-1.5">장애 및 유지보수 문의</p>
                <a href="tel:025404337" className="text-white font-bold text-lg hover:text-brand-cyan transition-colors">
                  02.540.4337
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wider uppercase">부가서비스</h4>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.path}>
                  <Link
                    to={s.path}
                    className="text-white/50 hover:text-brand-cyan text-sm transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wider uppercase">바로가기</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.webheads.co.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-brand-cyan text-sm transition-colors flex items-center gap-1"
                >
                  웹헤즈 홈페이지 <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link to="/#contact" className="text-white/50 hover:text-brand-cyan text-sm transition-colors">
                  도입 문의
                </Link>
              </li>
              <li>
                <Link to="/#contact" className="text-white/50 hover:text-brand-cyan text-sm transition-colors">
                  무료 상담 신청
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="section-divider mt-10 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-white/30 text-xs">
          <p>© 2024 WEBHEADS Co., Ltd. All rights reserved.</p>
          <p>사업자등록번호 : XXX-XX-XXXXX | 대표 : OOO</p>
        </div>
      </div>
    </footer>
  );
}
