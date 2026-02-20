import { CreditCard, Globe, ShieldCheck, Zap, BarChart3, Settings, RefreshCw, Lock, Headphones } from "lucide-react";
import heroPg from "@/assets/hero-pg.jpg";
import ContactSection from "@/components/ContactSection";

const features = [
  {
    icon: CreditCard,
    title: "토스페이먼츠(Toss Payments) 연동",
    desc: "토스페이먼츠 REST API v2를 통해 신용카드, 계좌이체, 가상계좌, 휴대폰 결제, 토스페이, 네이버페이, 카카오페이 등 국내 주요 결제 수단을 일원화된 인터페이스로 연동합니다. 결제 위젯(SDK) 방식으로 빠른 화면 구현이 가능하며 PCI-DSS 인증 보안 환경을 기본 제공합니다.",
    tags: ["REST API v2", "결제 위젯", "PCI-DSS", "간편결제"],
  },
  {
    icon: ShieldCheck,
    title: "KG이니시스(KG Inicis) 연동",
    desc: "국내 1위 PG사인 KG이니시스와의 연동으로 신용카드(ISP/안심클릭), 실시간 계좌이체, 무통장 입금, 에스크로, 정기결제(빌링) 등 전 결제 수단을 지원합니다. 할부 개월 수 제어, 부분 취소, 즉시할인 쿠폰 연동 등 고급 결제 기능도 함께 제공합니다.",
    tags: ["신용카드", "빌링/정기결제", "에스크로", "부분 취소"],
  },
  {
    icon: Zap,
    title: "모빌리언스(Mobilians) 연동",
    desc: "국내 대표 휴대폰 결제 PG인 모빌리언스를 통해 통신사 소액결제(SKT·KT·LGU+)를 연동합니다. 월 결제 한도 관리, 미성년자 결제 제한, 통신사 빌링 정기결제를 지원하며 이러닝 수강권 소액 결제에 최적화되어 있습니다.",
    tags: ["휴대폰 소액결제", "통신사 빌링", "SKT/KT/LGU+", "정기결제"],
  },
  {
    icon: Settings,
    title: "결제선생 연동",
    desc: "교육기관 특화 PG 솔루션인 결제선생을 연동하여 수강료 분납, 학부모 대리결제, 교육비 영수증 발급, 학원비 자동이체 등 교육 업계에 특화된 결제 시나리오를 구현합니다. 이러닝 플랫폼과의 완벽한 데이터 연동으로 수강 상태와 결제 상태를 일원 관리합니다.",
    tags: ["교육기관 특화", "분납 결제", "대리결제", "수강 연동"],
  },
  {
    icon: Globe,
    title: "해외 결제 (글로벌 PG) 연동",
    desc: "Stripe, PayPal, Adyen 등 글로벌 PG와 연동하여 USD, EUR, JPY, CNY 등 다국통화 결제를 지원합니다. Visa, Mastercard, Amex, JCB, UnionPay 등 해외 발급 카드와 Apple Pay, Google Pay, WeChat Pay, Alipay 등 글로벌 간편결제 수단을 통합 지원합니다.",
    tags: ["Stripe", "PayPal", "다국통화", "해외 카드"],
  },
  {
    icon: RefreshCw,
    title: "정기결제(구독) 자동화",
    desc: "수강권 월정액, 연간 구독, 콘텐츠 이용권 등 정기결제 상품을 LMS 회원 계정과 연동하여 자동 과금합니다. 결제 실패 시 재시도 정책(Retry Logic) 설정, 카드 만료 사전 안내, 구독 갱신·취소 셀프서비스 페이지를 제공합니다.",
    tags: ["자동 과금", "구독 관리", "Retry Logic", "셀프서비스"],
  },
  {
    icon: BarChart3,
    title: "결제 통계 및 정산 리포트",
    desc: "일별·월별·과정별 결제 현황, 매출 추이, 환불율, PG사별 수수료 분석을 실시간 대시보드로 제공합니다. 세금계산서 자동 발행, 부가세 신고 자료 내보내기, 다중 PG사 정산 데이터 통합 조회를 지원합니다.",
    tags: ["실시간 대시보드", "정산 리포트", "세금계산서", "수수료 분석"],
  },
  {
    icon: Lock,
    title: "보안 및 개인정보 보호",
    desc: "카드 정보를 서버에 저장하지 않는 토큰화(Tokenization) 방식을 적용하며, TLS 1.3 암호화 전송, 금융감독원 인증 PG사와의 연동으로 안전한 결제 환경을 구축합니다. ISMS-P 인증 기준에 부합하는 개인정보 처리 방침을 준수합니다.",
    tags: ["토큰화", "TLS 1.3", "ISMS-P", "금감원 인증"],
  },
  {
    icon: Headphones,
    title: "결제 오류 모니터링 및 CS 지원",
    desc: "실시간 결제 성공·실패 모니터링, 이상 거래 탐지(FDS) 알림을 제공하며, 결제 오류 발생 시 학습자에게 자동 안내 메시지를 발송합니다. 환불 처리, 결제 취소, 영수증 재발송 등 CS 업무를 관리자 페이지에서 직접 처리할 수 있습니다.",
    tags: ["FDS", "실시간 모니터링", "자동 CS", "환불 관리"],
  },
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
  "신용카드 (국내 전 카드사)",
  "체크카드",
  "실시간 계좌이체",
  "가상계좌 (무통장 입금)",
  "휴대폰 소액결제",
  "카카오페이",
  "네이버페이",
  "토스페이",
  "Apple Pay",
  "Google Pay",
  "해외 Visa / Mastercard",
  "Amex / JCB / UnionPay",
  "WeChat Pay",
  "Alipay",
  "PayPal",
  "에스크로 결제",
];

export default function PgPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-section min-h-[70vh] flex items-center pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroPg})` }}
        />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-2xl">
            <span
              className="feature-badge mb-5"
              style={{ background: "hsl(160 80% 45% / 0.15)", color: "hsl(160 80% 65%)", borderColor: "hsl(160 80% 45% / 0.3)" }}
            >
              PG 결제 연동
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mt-4 mb-5 leading-tight">
              국내외 다양한 PG사와의<br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, hsl(160,80%,60%), hsl(190,90%,60%))" }}
              >
                완벽한 결제 연동
              </span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl">
              토스페이먼츠, KG이니시스, 모빌리언스, 결제선생부터 Stripe·PayPal 해외 결제까지.
              이러닝 플랫폼에 필요한 모든 결제 수단을 단일 API로 통합 연동합니다.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="btn-primary px-7 py-3.5 rounded-xl font-semibold">
                도입 상담 신청
              </a>
              <a href="#partners" className="px-7 py-3.5 rounded-xl font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors">
                연동 PG사 보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="feature-badge mb-4">지원 결제 수단</span>
            <h2 className="text-2xl lg:text-3xl font-bold mt-4">
              국내 + 해외 <span className="text-transparent bg-clip-text bg-primary-gradient">결제 수단 통합 지원</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2.5 justify-center max-w-3xl mx-auto">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="px-3.5 py-1.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/20 bg-grid-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">주요 기능</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-4">
              PG 결제 연동 <span className="text-transparent bg-clip-text bg-primary-gradient">핵심 기능</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              단순 결제 연동을 넘어 정기결제, 해외결제, 통계·정산까지 이러닝 비즈니스에 최적화된 결제 인프라를 구축합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="service-card p-7 flex flex-col">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: "var(--primary-gradient)", boxShadow: "0 4px 16px -4px hsl(214 90% 52% / 0.35)" }}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{f.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-primary/8 text-primary font-medium border border-primary/15"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PG Partners */}
      <section id="partners" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">연동 PG사</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-4">
              국내외 주요 <span className="text-transparent bg-clip-text bg-primary-gradient">PG사 연동</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              고객사의 비즈니스 모델과 타겟 시장에 맞는 최적의 PG사를 선택하여 연동합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {pgPartners.map((p, i) => (
              <div key={p.name} className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm" style={{ background: "var(--primary-gradient)" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary/8 text-primary border border-primary/15 mb-1">{p.category}</span>
                  <h4 className="font-bold text-sm">{p.name}</h4>
                  <p className="text-muted-foreground text-xs mt-0.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Payment Highlight */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="feature-badge mb-4">🌍 해외 결제 특화</span>
              <h2 className="text-3xl lg:text-4xl font-bold mt-4">
                글로벌 이러닝 사업 확장을 위한 <span className="text-transparent bg-clip-text bg-primary-gradient">해외 결제</span>
              </h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                해외 학습자를 대상으로 서비스를 운영하거나 글로벌 시장으로 확장하는 이러닝 플랫폼을 위해
                국제 결제 인프라를 완벽하게 구축합니다.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Globe,
                  title: "140개국 통화 지원",
                  desc: "USD, EUR, JPY, CNY, GBP 등 140개국 이상의 통화로 결제를 수납하고, 원화 정산을 지원합니다. 실시간 환율 적용으로 정확한 금액을 청구합니다.",
                },
                {
                  icon: CreditCard,
                  title: "해외 카드 및 간편결제",
                  desc: "Visa, Mastercard, Amex, JCB, UnionPay 등 해외 발급 카드와 Apple Pay, Google Pay, WeChat Pay, Alipay를 지원합니다.",
                },
                {
                  icon: ShieldCheck,
                  title: "3D Secure 및 해외 보안 인증",
                  desc: "3D Secure 2.0(3DS2), PCI-DSS Level 1 컴플라이언스를 준수하여 해외 결제 사기(chargeback) 위험을 최소화합니다.",
                },
              ].map((item) => (
                <div key={item.title} className="service-card p-6">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--primary-gradient)", boxShadow: "0 4px 16px -4px hsl(214 90% 52% / 0.35)" }}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "8+", label: "연동 PG사", sub: "국내외 주요 PG사" },
              { value: "16+", label: "결제 수단", sub: "다양한 결제 방법 지원" },
              { value: "140+", label: "지원 통화국", sub: "글로벌 결제 가능" },
              { value: "99.9%", label: "결제 안정성", sub: "안정적인 결제 처리" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-black text-brand-cyan mb-2">{stat.value}</div>
                <div className="text-white font-semibold mb-1">{stat.label}</div>
                <div className="text-white/40 text-sm">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
