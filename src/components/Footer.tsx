import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

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
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-bold text-xl">WEBHEADS</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              웹헤즈는 LMS(이러닝솔루션) 전문 공급사로,<br />
              이러닝 호스팅부터 AI 챗봇, APP 개발,<br />
              콘텐츠 제작까지 원스톱으로 지원합니다.
            </p>
            <div className="mt-6 space-y-2">
              <a href="tel:0212345678" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
                <Phone className="w-4 h-4 text-brand-cyan" />
                02-XXXX-XXXX
              </a>
              <a href="mailto:info@webheads.co.kr" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
                <Mail className="w-4 h-4 text-brand-cyan" />
                info@webheads.co.kr
              </a>
              <div className="flex items-start gap-2 text-white/50 text-sm">
                <MapPin className="w-4 h-4 text-brand-cyan mt-0.5 shrink-0" />
                서울특별시 OO구 OO로 OO
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
