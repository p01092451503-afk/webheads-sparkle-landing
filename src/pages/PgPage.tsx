import { CreditCard, Globe, ShieldCheck, Zap, BarChart3, Settings, RefreshCw, Lock, Headphones } from "lucide-react";
import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";
import SEO from "@/components/SEO";
import PgHeroVisual from "@/components/visuals/PgHeroVisual";

const testimonials = [
  { name: "장현석", role: "개발 팀장", org: "S 이러닝 기업", content: "토스페이먼츠 연동을 일주일 만에 완료했고, 정기결제 자동화까지 한 번에 세팅되어 운영 부담이 크게 줄었습니다." },
  { name: "문서영", role: "재무 담당", org: "T 평생교육원", content: "정산 리포트가 자동으로 생성되니 매월 세금계산서 발행과 부가세 신고가 한결 수월해졌습니다. 수수료 분석도 유용합니다." },
  { name: "신동욱", role: "사업부장", org: "U 글로벌 교육기관", content: "Stripe 연동으로 해외 수강생 결제가 가능해지면서 글로벌 매출이 2배 이상 성장했습니다. 다국통화 지원이 핵심이었습니다." },
];

const features = [
  { icon: CreditCard, title: "토스페이먼츠(Toss Payments) 연동", desc: "토스페이먼츠 REST API v2를 통해 신용카드, 계좌이체, 가상계좌, 휴대폰 결제, 토스페이, 네이버페이, 카카오페이 등 국내 주요 결제 수단을 일원화된 인터페이스로 연동합니다. 결제 위젯(SDK) 방식으로 빠른 화면 구현이 가능하며 PCI-DSS 인증 보안 환경을 기본 제공합니다.", tags: ["REST API v2", "결제 위젯", "PCI-DSS", "간편결제"] },
  { icon: ShieldCheck, title: "KG이니시스(KG Inicis) 연동", desc: "국내 1위 PG사인 KG이니시스와의 연동으로 신용카드(ISP/안심클릭), 실시간 계좌이체, 무통장 입금, 에스크로, 정기결제(빌링) 등 전 결제 수단을 지원합니다. 할부 개월 수 제어, 부분 취소, 즉시할인 쿠폰 연동 등 고급 결제 기능도 함께 제공합니다.", tags: ["신용카드", "빌링/정기결제", "에스크로", "부분 취소"] },
  { icon: Zap, title: "모빌리언스(Mobilians) 연동", desc: "국내 대표 휴대폰 결제 PG인 모빌리언스를 통해 통신사 소액결제(SKT·KT·LGU+)를 연동합니다. 월 결제 한도 관리, 미성년자 결제 제한, 통신사 빌링 정기결제를 지원하며 이러닝 수강권 소액 결제에 최적화되어 있습니다.", tags: ["휴대폰 소액결제", "통신사 빌링", "SKT/KT/LGU+", "정기결제"] },
  { icon: Settings, title: "결제선생 연동", desc: "교육기관 특화 PG 솔루션인 결제선생을 연동하여 수강료 분납, 학부모 대리결제, 교육비 영수증 발급, 학원비 자동이체 등 교육 업계에 특화된 결제 시나리오를 구현합니다.", tags: ["교육기관 특화", "분납 결제", "대리결제", "수강 연동"] },
  { icon: Globe, title: "해외 결제 (글로벌 PG) 연동", desc: "Stripe, PayPal, Adyen 등 글로벌 PG와 연동하여 USD, EUR, JPY, CNY 등 다국통화 결제를 지원합니다. Visa, Mastercard, Amex, JCB, UnionPay 등 해외 발급 카드와 Apple Pay, Google Pay, WeChat Pay, Alipay 등 글로벌 간편결제 수단을 통합 지원합니다.", tags: ["Stripe", "PayPal", "다국통화", "해외 카드"] },
  { icon: RefreshCw, title: "정기결제(구독) 자동화", desc: "수강권 월정액, 연간 구독, 콘텐츠 이용권 등 정기결제 상품을 LMS 회원 계정과 연동하여 자동 과금합니다. 결제 실패 시 재시도 정책(Retry Logic) 설정, 카드 만료 사전 안내, 구독 갱신·취소 셀프서비스 페이지를 제공합니다.", tags: ["자동 과금", "구독 관리", "Retry Logic", "셀프서비스"] },
  { icon: BarChart3, title: "결제 통계 및 정산 리포트", desc: "일별·월별·과정별 결제 현황, 매출 추이, 환불율, PG사별 수수료 분석을 실시간 대시보드로 제공합니다. 세금계산서 자동 발행, 부가세 신고 자료 내보내기, 다중 PG사 정산 데이터 통합 조회를 지원합니다.", tags: ["실시간 대시보드", "정산 리포트", "세금계산서", "수수료 분석"] },
  { icon: Lock, title: "보안 및 개인정보 보호", desc: "카드 정보를 서버에 저장하지 않는 토큰화(Tokenization) 방식을 적용하며, TLS 1.3 암호화 전송, 금융감독원 인증 PG사와의 연동으로 안전한 결제 환경을 구축합니다. ISMS-P 인증 기준에 부합하는 개인정보 처리 방침을 준수합니다.", tags: ["토큰화", "TLS 1.3", "ISMS-P", "금감원 인증"] },
  { icon: Headphones, title: "결제 오류 모니터링 및 CS 지원", desc: "실시간 결제 성공·실패 모니터링, 이상 거래 탐지(FDS) 알림을 제공하며, 결제 오류 발생 시 학습자에게 자동 안내 메시지를 발송합니다. 환불 처리, 결제 취소, 영수증 재발송 등 CS 업무를 관리자 페이지에서 직접 처리할 수 있습니다.", tags: ["FDS", "실시간 모니터링", "자동 CS", "환불 관리"] },
];

const pgPartners = [
  { name: "토스페이먼츠", category: "국내 PG", desc: "신용카드·간편결제 통합" },
  { name: "KG이니시스", category: "국내 PG", desc: "국내 1위 결제 인프라" },
  { name: "모빌리언스", category: "휴대폰 결제", desc: "통신사 소액결제 전문" },
  { name: "결제선생", category: "교육 특화 PG", desc: "교육기관 분납·자동이체" },
  { name: "Stripe", category: "글로벌 PG", desc: "글로벌 140개국 결제" },
  { name: "PayPal", category: "글로벌 PG", desc: "해외 구매자 신뢰 결제" },
  { name: "Adyen", category: "글로벌 PG", desc: "엔터프라이즈 글로벌 결제" },
  { name: "WeChat Pay / Alipay", category: "중화권 결제", desc: "중국 사용자 결제 지원" },
];

const paymentMethods = [
  "신용카드 (국내 전 카드사)", "체크카드", "실시간 계좌이체", "가상계좌 (무통장 입금)",
  "휴대폰 소액결제", "카카오페이", "네이버페이", "토스페이",
  "Apple Pay", "Google Pay", "해외 Visa / Mastercard", "Amex / JCB / UnionPay",
  "WeChat Pay", "Alipay", "PayPal", "에스크로 결제",
];

const stats = [
  { value: "8+", label: "연동 PG사", sub: "국내외 주요 PG사" },
  { value: "16+", label: "결제 수단", sub: "다양한 결제 방법 지원" },
  { value: "140+", label: "지원 통화국", sub: "글로벌 결제 가능" },
  { value: "99.9%", label: "결제 안정성", sub: "안정적인 결제 처리" },
];

export default function PgPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="PG 결제 연동"
        description="토스페이먼츠, KG이니시스, 모빌리언스, 결제선생, 해외 PG까지 이러닝 플랫폼에 최적화된 결제 연동 서비스. 정기결제, 분납, 에스크로 지원."
        keywords="PG 결제, 이러닝 결제, 토스페이먼츠, KG이니시스, 온라인 결제 연동, 정기결제, 학원 결제"
        path="/pg"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "웹헤즈 PG 결제 연동",
          "provider": { "@type": "Organization", "name": "웹헤즈" },
          "description": "이러닝 플랫폼 PG 결제 연동. 토스페이먼츠, KG이니시스, 해외 PG 지원.",
          "areaServed": "KR",
          "serviceType": "PG 결제 연동",
          "url": "https://webheads-sparkle-landing.lovable.app/pg"
        }}
      />
      {/* Hero */}
      <section
        className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden"
        style={{ background: "linear-gradient(160deg, hsl(210, 50%, 92%) 0%, hsl(214, 60%, 88%) 40%, hsl(220, 50%, 85%) 100%)" }}
      >
        <div className="absolute pointer-events-none" style={{ width: "120%", height: "120%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse 60% 50% at 65% 45%, hsla(152, 80%, 60%, 0.18) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none" style={{ width: "80%", height: "80%", bottom: "-10%", left: "-5%", background: "radial-gradient(ellipse 50% 60% at 30% 70%, hsla(152, 60%, 60%, 0.1) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center" style={{ opacity: 0.85 }}>
          <div className="relative w-full h-full max-w-[900px] mx-auto hidden lg:flex items-center justify-center" style={{ transform: "translateX(40%)" }}>
            <PgHeroVisual />
          </div>
        </div>
        <div className="container mx-auto px-6 py-24 relative z-10 lg:pl-[10%]">
          <div className="max-w-xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "hsla(0, 0%, 100%, 0.85)", backdropFilter: "blur(8px)", color: "hsl(152, 70%, 30%)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>PG</span>
            <h1 className="text-4xl lg:text-[3.2rem] font-black leading-tight mb-5 tracking-tight" style={{ color: "hsl(220, 60%, 8%)" }}>
              국내외 다양한 PG사와의<br />
              <span style={{ color: "hsl(152, 80%, 38%)" }}>완벽한 결제 연동</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "hsl(220, 20%, 40%)", textShadow: "0 1px 2px hsla(0, 0%, 100%, 0.6)" }}>토스페이먼츠, KG이니시스, 모빌리언스, 결제선생부터 Stripe·PayPal 해외 결제까지. 이러닝 플랫폼에 필요한 모든 결제 수단을 단일 API로 통합 연동합니다.</p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-85" style={{ background: "hsl(220, 60%, 8%)", color: "#fff" }}>도입 상담 신청</a>
              <a href="#partners" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border" style={{ borderColor: "hsl(214, 20%, 85%)", color: "hsl(220, 60%, 8%)", background: "hsla(0, 0%, 100%, 0.8)", backdropFilter: "blur(8px)" }}>연동 PG사 보기</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <span className="block font-black leading-none mb-2 text-4xl md:text-5xl text-foreground tracking-tight">{s.value}</span>
                <span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span>
                <span className="block text-xs text-muted-foreground">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 bg-secondary border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-10">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">지원 결제 수단</p>
            <h2 className="font-black text-foreground leading-tight text-3xl lg:text-4xl tracking-tight">국내 + 해외<br />결제 수단 통합 지원</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {paymentMethods.map((method) => (
              <span key={method} className="px-4 py-2 rounded-full border border-border bg-background text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors">
                {method}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">주요 기능</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">이러닝 비즈니스에<br />최적화된 결제 인프라</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {f.tags.map((tag) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PG Partners */}
      <section id="partners" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">연동 PG사</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">국내외 주요<br />PG사 연동</h2>
            <p className="text-muted-foreground mt-4 text-base">고객사의 비즈니스 모델과 타겟 시장에 맞는 최적의 PG사를 선택하여 연동합니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pgPartners.map((p, i) => (
              <div key={p.name} className="rounded-2xl p-6 bg-background border border-border hover:border-primary/30 hover:shadow-sm transition-all flex flex-col gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-foreground text-primary-foreground font-bold text-xs">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mb-1">{p.category}</span>
                  <h4 className="font-bold text-foreground text-sm tracking-tight">{p.name}</h4>
                  <p className="text-muted-foreground text-xs mt-0.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialSection testimonials={testimonials} />
      <ContactSection />
    </div>
  );
}
