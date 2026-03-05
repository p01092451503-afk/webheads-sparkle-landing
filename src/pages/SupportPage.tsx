import { Mail, MonitorSmartphone, ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";

export default function SupportPage() {
  return (
    <>
      <SEO
        title="고객지원 | WEBHEADS"
        description="웹헤즈 고객지원 — SMS 충전 및 카테노이드 원격지원을 요청하세요."
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
              WEBHEADS 고객지원
            </h1>
            <p className="text-[14px] sm:text-[15px] text-white/75 mt-2.5 leading-relaxed">
              필요한 서비스를 선택해 주세요
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-5 max-w-[720px] -mt-6 pb-20 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        </div>
      </div>
    </>
  );
}