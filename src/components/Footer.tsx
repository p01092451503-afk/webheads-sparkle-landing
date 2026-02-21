import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";


export default function Footer() {
  return (
    <footer style={{ background: "hsl(0, 0%, 100%)", borderTop: "1px solid hsl(214, 20%, 88%)" }}>
      <div className="container mx-auto px-6 max-w-5xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12">

          {/* Brand + Company Info */}
          <div className="flex flex-col gap-6">
            <span
              style={{
                fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
                fontWeight: 800,
                fontSize: "1.25rem",
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: "hsl(220, 60%, 8%)",
              }}
            >
              웹헤즈
            </span>

            <div className="flex flex-col gap-1">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: "hsl(220, 20%, 50%)" }}
              >
                Company
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(220, 20%, 50%)" }}>
                03971 서울특별시 마포구 월드컵로 114, 3층
              </p>
              <p className="text-xs" style={{ color: "hsl(220, 20%, 50%)" }}>
                개인정보관리책임자 강성일 · elise75@webheads.co.kr
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: "hsl(220, 20%, 50%)" }}
              >
                Time
              </p>
              <p className="text-sm" style={{ color: "hsl(220, 20%, 50%)" }}>
                평일 10:00 – 18:00 (점심시간 12:00–13:00)
              </p>
              <p className="text-sm" style={{ color: "hsl(220, 20%, 50%)" }}>
                주 5일 근무 (토/일/ 공휴일 휴무)
              </p>
            </div>

            <div className="flex gap-8">
              <div>
                <p className="text-xs mb-1" style={{ color: "hsl(220, 20%, 50%)" }}>신규 도입 문의</p>
                <a
                  href="tel:0233364338"
                  className="text-lg tracking-tight transition-colors"
                  style={{ fontWeight: 900, color: "hsl(220, 60%, 8%)" }}
                >
                  02.336.4338
                </a>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "hsl(220, 20%, 50%)" }}>장애 및 유지보수 문의</p>
                <a
                  href="tel:0254044337"
                  className="text-lg tracking-tight transition-colors"
                  style={{ fontWeight: 900, color: "hsl(220, 60%, 8%)" }}
                >
                  02.540.4337
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-right">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ color: "hsl(220, 20%, 50%)" }}
            >
              바로가기
            </p>
            <ul className="flex flex-col gap-3 items-end">
              <li>
                <a
                  href="https://webheads.co.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium flex items-center gap-1.5 transition-colors"
                  style={{ color: "hsl(220, 20%, 50%)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(220, 60%, 8%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(220, 20%, 50%)")}
                >
                  웹헤즈 홈페이지 <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid hsl(214, 20%, 88%)" }}>
        <div className="container mx-auto px-6 max-w-5xl py-5 flex items-center justify-center">
          <p className="text-xs" style={{ color: "hsl(220, 20%, 50%)" }}>
            © 2010 WEBHEADS Co., Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
