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
        <div className="container mx-auto px-5 max-w-[520px] pt-28 pb-20">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[26px] font-bold text-foreground tracking-[-0.04em] leading-tight">
              고객센터
            </h1>
            <p className="text-[14px] text-muted-foreground mt-1.5" style={{ letterSpacing: "-0.01em" }}>
              필요한 서비스를 선택해 주세요
            </p>
          </div>

          {/* Main Action Cards */}
          <div className="flex flex-col gap-3 mb-4">
            {/* SMS 충전 */}
            <a
              href="https://help.webheads.co.kr/login.php"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-md active:scale-[0.99]"
              style={{ border: "1px solid hsl(220, 13%, 91%)" }}
            >
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
                style={{ background: "hsl(221, 83%, 53%, 0.08)", color: "hsl(221, 83%, 53%)" }}
              >
                <Mail className="w-[22px] h-[22px]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-foreground" style={{ letterSpacing: "-0.02em" }}>
                  SMS 충전
                </p>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  문자 발송 건수를 충전하고 현황을 확인합니다
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground transition-colors" />
            </a>

            {/* 원격지원 */}
            <a
              href="https://help.webheads.co.kr/kolluscrm.php"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-md active:scale-[0.99]"
              style={{ border: "1px solid hsl(220, 13%, 91%)" }}
            >
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
                style={{ background: "hsl(152, 57%, 42%, 0.08)", color: "hsl(152, 57%, 42%)" }}
              >
                <MonitorSmartphone className="w-[22px] h-[22px]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-foreground" style={{ letterSpacing: "-0.02em" }}>
                  원격지원 요청
                </p>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  카테노이드 원격지원으로 빠르게 문제를 해결합니다
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground transition-colors" />
            </a>
          </div>

          {/* Phone Section */}
          <div
            className="bg-white rounded-2xl p-5 mb-4"
            style={{ border: "1px solid hsl(220, 13%, 91%)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-[13px] font-semibold text-foreground" style={{ letterSpacing: "-0.01em" }}>전화 상담</span>
            </div>
            <a
              href="tel:02-540-4337"
              className="flex items-center justify-between group"
            >
              <div>
                <p className="text-[22px] font-bold text-foreground tracking-[-0.04em] tabular-nums leading-none">
                  02-540-4337
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground/50" />
                  <span className="text-[12px] text-muted-foreground">평일 09:00 – 18:00</span>
                </div>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                style={{ background: "hsl(221, 83%, 53%, 0.08)", color: "hsl(221, 83%, 53%)" }}
              >
                <Phone className="w-[18px] h-[18px]" />
              </div>
            </a>
          </div>

          {/* Inquiry CTA */}
          <a
            href="/#contact"
            className="flex items-center gap-4 bg-white rounded-2xl p-5 transition-all hover:shadow-md active:scale-[0.99] group"
            style={{ border: "1px solid hsl(220, 13%, 91%)" }}
          >
            <div
              className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
              style={{ background: "hsl(37, 90%, 51%, 0.08)", color: "hsl(37, 90%, 51%)" }}
            >
              <MessageCircle className="w-[22px] h-[22px]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-foreground" style={{ letterSpacing: "-0.02em" }}>
                온라인 문의
              </p>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                도입 상담 및 견적을 요청합니다
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground transition-colors" />
          </a>

        </div>
      </div>
    </>
  );
}
