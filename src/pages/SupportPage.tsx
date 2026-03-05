import { Mail, MonitorSmartphone, Phone, Headset } from "lucide-react";
import SEO from "@/components/SEO";

export default function SupportPage() {
  return (
    <>
      <SEO
        title="고객센터 | WEBHEADS"
        description="웹헤즈 고객센터 — SMS 충전 및 카테노이드 원격지원을 요청하세요."
        path="/support"
      />
      <div className="min-h-screen bg-background pt-28 pb-20">
        <div className="container mx-auto px-5 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
              <Headset className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
              고객센터
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              SMS 충전 또는 원격지원이 필요하신가요? 아래 버튼을 눌러 바로 요청하세요.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {/* SMS 충전 */}
            <a
              href="https://help.webheads.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-background p-8 hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-primary/10 group-hover:bg-primary/15 transition-colors">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-bold text-foreground mb-1.5">SMS 충전</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  문자 발송 건수를 충전하고<br />발송 현황을 확인합니다.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-1">
                충전하기 <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </span>
            </a>

            {/* 원격지원 */}
            <a
              href="https://help.webheads.co.kr/kolluscrm.php"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-background p-8 hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-accent group-hover:bg-accent/80 transition-colors">
                <MonitorSmartphone className="w-7 h-7 text-accent-foreground" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-bold text-foreground mb-1.5">원격지원 요청</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  카테노이드 원격지원을 통해<br />빠르게 문제를 해결합니다.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-1">
                요청하기 <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </span>
            </a>
          </div>

          {/* Phone CTA */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">전화 상담을 원하시나요?</p>
            <a
              href="tel:02-540-4337"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-muted text-foreground font-semibold text-sm hover:bg-muted-foreground/10 transition-colors"
            >
              <Phone className="w-4 h-4" />
              02-540-4337
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
