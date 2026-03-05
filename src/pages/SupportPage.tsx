import { Mail, MonitorSmartphone, Phone, Headset, Clock, ChevronRight, MessageCircle } from "lucide-react";
import SEO from "@/components/SEO";

export default function SupportPage() {
  return (
    <>
      <SEO
        title="고객센터 | WEBHEADS"
        description="웹헤즈 고객센터 — SMS 충전 및 카테노이드 원격지원을 요청하세요."
        path="/support"
      />
      <div className="min-h-screen" style={{ background: "hsl(220, 14%, 96%)" }}>
        <div className="container mx-auto px-5 max-w-[680px] pt-28 pb-20">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[26px] font-bold text-foreground tracking-[-0.04em] leading-tight">
              고객센터
            </h1>
            <p className="text-[14px] text-muted-foreground mt-1.5" style={{ letterSpacing: "-0.01em" }}>
              필요한 서비스를 선택해 주세요
            </p>
          </div>

          {/* Main Action Cards — side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {/* SMS 충전 */}
            <a
              href="https://help.webheads.co.kr/login.php"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all hover:shadow-md active:scale-[0.99]"
              style={{ border: "1px solid hsl(220, 13%, 91%)" }}
            >
              <div
                className="w-14 h-14 rounded-[16px] flex items-center justify-center"
                style={{ background: "hsl(221, 83%, 53%, 0.08)", color: "hsl(221, 83%, 53%)" }}
              >
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[17px] font-bold text-foreground" style={{ letterSpacing: "-0.02em" }}>
                  SMS 충전
                </p>
                <p className="text-[13px] text-muted-foreground mt-1">
                  문자 발송 건수를 충전하고<br />현황을 확인합니다
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold mt-1" style={{ color: "hsl(221, 83%, 53%)" }}>
                충전하기 <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </a>

            {/* 원격지원 */}
            <a
              href="https://help.webheads.co.kr/kolluscrm.php"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all hover:shadow-md active:scale-[0.99]"
              style={{ border: "1px solid hsl(220, 13%, 91%)" }}
            >
              <div
                className="w-14 h-14 rounded-[16px] flex items-center justify-center"
                style={{ background: "hsl(152, 57%, 42%, 0.08)", color: "hsl(152, 57%, 42%)" }}
              >
                <MonitorSmartphone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[17px] font-bold text-foreground" style={{ letterSpacing: "-0.02em" }}>
                  원격지원 요청
                </p>
                <p className="text-[13px] text-muted-foreground mt-1">
                  카테노이드 원격지원으로<br />빠르게 문제를 해결합니다
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold mt-1" style={{ color: "hsl(152, 57%, 42%)" }}>
                요청하기 <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </a>
          </div>

          {/* Secondary Section — subtle, compact list style */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(220, 20%, 99%), hsl(220, 14%, 96%))", border: "1px solid hsl(220, 13%, 91%)" }}>
            {/* Phone */}
            <a
              href="tel:02-540-4337"
              className="flex items-center gap-4 px-5 py-4 group transition-colors hover:bg-white/60"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-muted-foreground/[0.06]">
                <Phone className="w-[17px] h-[17px] text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-foreground tracking-[-0.02em]">
                  02-540-4337
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5">평일 09:00 – 18:00</p>
              </div>
              <span className="text-[12px] font-medium text-muted-foreground/60 shrink-0">전화 상담</span>
            </a>

            <div className="mx-5 h-px bg-border/60" />

            {/* Online Inquiry */}
            <a
              href="/#contact"
              className="flex items-center gap-4 px-5 py-4 group transition-colors hover:bg-white/60"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "hsl(37, 90%, 51%, 0.08)" }}>
                <MessageCircle className="w-[17px] h-[17px]" style={{ color: "hsl(37, 90%, 51%)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-foreground tracking-[-0.02em]">
                  온라인 문의
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5">도입 상담 및 견적을 요청합니다</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0 group-hover:text-muted-foreground/60 transition-colors" />
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
