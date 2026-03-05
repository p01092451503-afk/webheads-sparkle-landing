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

          {/* Contact Section */}
          <div id="contact" className="bg-card rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid hsl(220, 13%, 91%)" }}>
            <div className="px-5 pt-5 pb-3">
              <p className="text-[13px] font-semibold text-muted-foreground tracking-[-0.01em]">문의하기</p>
            </div>

            {/* Phone */}
            <a
              href="tel:02-540-4337"
              className="flex items-center gap-4 px-5 py-4 group transition-colors hover:bg-accent/50"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "hsl(221, 83%, 53%, 0.07)", color: "hsl(221, 83%, 53%)" }}
              >
                <Phone className="w-[18px] h-[18px]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-foreground tracking-[-0.02em]">
                  전화 상담
                </p>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  02-540-4337
                  <span className="mx-1.5 text-border">·</span>
                  평일 09:00 – 18:00
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0 group-hover:text-muted-foreground/60 transition-colors" />
            </a>

            <div className="mx-5 h-px bg-border/60" />

            {/* Online Inquiry */}
            <a
              href="/#contact"
              className="flex items-center gap-4 px-5 py-4 group transition-colors hover:bg-accent/50"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "hsl(37, 90%, 51%, 0.07)", color: "hsl(37, 90%, 51%)" }}
              >
                <MessageCircle className="w-[18px] h-[18px]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-foreground tracking-[-0.02em]">
                  온라인 문의
                </p>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  도입 상담 및 견적을 요청합니다
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0 group-hover:text-muted-foreground/60 transition-colors" />
            </a>
          </div>

          {/* Trust footer */}
          <div className="mt-8 flex items-center justify-center gap-4 text-[12px] text-muted-foreground/50">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              평균 2시간 내 응답
            </span>
          </div>

        </div>
      </div>
    </>
  );
}