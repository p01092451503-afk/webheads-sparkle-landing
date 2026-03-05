import { Mail, MonitorSmartphone, Phone, ChevronRight, MessageCircle, Clock, Search } from "lucide-react";
import SEO from "@/components/SEO";

const quickLinks = [
  { label: "SMS 충전", href: "#services" },
  { label: "원격지원", href: "#services" },
  { label: "전화 상담", href: "#contact" },
  { label: "온라인 문의", href: "/#contact" },
];

export default function SupportPage() {
  return (
    <>
      <SEO
        title="고객센터 | WEBHEADS"
        description="웹헤즈 고객센터 — SMS 충전 및 카테노이드 원격지원을 요청하세요."
        path="/support"
      />
      <div className="min-h-screen bg-background">

        {/* Hero Banner */}
        <div
          className="pt-24 pb-16 sm:pt-28 sm:pb-20 text-center"
          style={{
            background: "linear-gradient(135deg, hsl(221, 83%, 53%) 0%, hsl(221, 70%, 62%) 100%)",
          }}
        >
          <div className="container mx-auto px-5 max-w-[720px]">
            <h1 className="text-[28px] sm:text-[34px] font-bold text-white tracking-[-0.04em] leading-tight">
              WEBHEADS 고객센터
            </h1>
            <p className="text-[14px] sm:text-[15px] text-white/75 mt-2.5 leading-relaxed">
              궁금한 점이 있으시면 아래 서비스를 이용해 주세요
            </p>

            {/* Quick Links — pill tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors"
                  style={{
                    background: "hsla(0, 0%, 100%, 0.18)",
                    color: "white",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-5 max-w-[720px] -mt-6 pb-20 relative z-10">

          {/* Service Cards */}
          <div id="services" className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {/* SMS 충전 */}
            <a
              href="https://help.webheads.co.kr/login.php"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card rounded-2xl p-6 flex flex-col gap-4 transition-all hover:shadow-lg active:scale-[0.99] shadow-sm"
              style={{ border: "1px solid hsl(220, 13%, 91%)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "hsl(221, 83%, 53%, 0.08)", color: "hsl(221, 83%, 53%)" }}
              >
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[16px] font-bold text-foreground tracking-[-0.02em]">
                  SMS 충전
                </p>
                <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
                  문자 발송 건수를 충전하고 현황을 확인합니다
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold mt-auto" style={{ color: "hsl(221, 83%, 53%)" }}>
                충전하기 <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </a>

            {/* 원격지원 */}
            <a
              href="https://help.webheads.co.kr/kolluscrm.php"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card rounded-2xl p-6 flex flex-col gap-4 transition-all hover:shadow-lg active:scale-[0.99] shadow-sm"
              style={{ border: "1px solid hsl(220, 13%, 91%)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "hsl(152, 57%, 42%, 0.08)", color: "hsl(152, 57%, 42%)" }}
              >
                <MonitorSmartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[16px] font-bold text-foreground tracking-[-0.02em]">
                  원격지원 요청
                </p>
                <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
                  카테노이드 원격지원으로 빠르게 문제를 해결합니다
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold mt-auto" style={{ color: "hsl(152, 57%, 42%)" }}>
                요청하기 <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </a>
          </div>

          {/* Contact Section — distinct dark theme */}
          <div
            id="contact"
            className="rounded-2xl overflow-hidden"
            style={{
              background: "hsl(220, 20%, 16%)",
            }}
          >
            <div className="px-6 pt-6 pb-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "hsl(221, 83%, 68%)" }}>
                Contact
              </p>
              <p className="text-[20px] font-bold text-white tracking-[-0.03em] mt-1">
                다른 방법으로 문의하기
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
              {/* Phone */}
              <a
                href="tel:02-540-4337"
                className="group flex flex-col gap-3 rounded-xl p-5 transition-colors"
                style={{ background: "hsl(220, 18%, 21%)" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(221, 83%, 53%, 0.15)", color: "hsl(221, 83%, 68%)" }}
                >
                  <Phone className="w-[18px] h-[18px]" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-white tracking-[-0.02em]">전화 상담</p>
                  <p className="text-[20px] font-bold text-white tracking-[-0.03em] tabular-nums mt-1">
                    02-540-4337
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-auto">
                  <Clock className="w-3.5 h-3.5" style={{ color: "hsl(220, 10%, 50%)" }} />
                  <span className="text-[12px]" style={{ color: "hsl(220, 10%, 50%)" }}>평일 09:00 – 18:00</span>
                </div>
              </a>

              {/* Online Inquiry */}
              <a
                href="/#contact"
                className="group flex flex-col gap-3 rounded-xl p-5 transition-colors"
                style={{ background: "hsl(220, 18%, 21%)" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(37, 90%, 51%, 0.12)", color: "hsl(37, 80%, 58%)" }}
                >
                  <MessageCircle className="w-[18px] h-[18px]" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-white tracking-[-0.02em]">온라인 문의</p>
                  <p className="text-[13px] mt-1 leading-relaxed" style={{ color: "hsl(220, 10%, 60%)" }}>
                    도입 상담 및 견적을 요청합니다
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-auto text-[13px] font-semibold" style={{ color: "hsl(37, 80%, 58%)" }}>
                  문의하기 <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            </div>

            {/* Trust badge inside dark section */}
            <div className="px-6 pb-5 pt-1 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(152, 57%, 50%)" }} />
              <span className="text-[12px]" style={{ color: "hsl(220, 10%, 45%)" }}>평균 2시간 내 응답</span>
            </div>
          </div>
            </span>
          </div>

        </div>
      </div>
    </>
  );
}