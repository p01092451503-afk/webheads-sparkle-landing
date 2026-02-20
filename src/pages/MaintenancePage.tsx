import heroMaintenance from "@/assets/hero-maintenance-toss.png";
import ContactSection from "@/components/ContactSection";
import LmsBanner from "@/components/LmsBanner";
import SEO from "@/components/SEO";
import {
  Wrench, Clock, Shield, PhoneCall, RefreshCw, BarChart3,
  Zap, AlertTriangle, Settings, CheckCircle, HeadphonesIcon,
  Paintbrush, Code2, LayoutDashboard, Puzzle, MonitorSmartphone, Layers,
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "24/7 장애 대응",
    desc: "서비스 장애 발생 시 24시간 365일 즉각 대응합니다. NOC 전담팀이 모니터링하며 장애 감지 후 평균 5분 이내 초동 조치를 시작합니다.",
    tags: ["24/7 모니터링", "5분 내 초동", "NOC 전담팀"],
  },
  {
    icon: RefreshCw,
    title: "정기 업데이트 & 패치",
    desc: "LMS 기능 업데이트, 보안 패치, OS·라이브러리 버전 관리를 정기적으로 수행합니다. 변경 이력을 문서화하여 투명하게 공유합니다.",
    tags: ["보안 패치", "버전 관리", "변경 이력 관리"],
  },
  {
    icon: Shield,
    title: "보안 취약점 점검",
    desc: "주기적인 취약점 스캔과 침투 테스트를 통해 학습자 데이터와 개인정보를 보호합니다. OWASP Top 10 기준에 따른 보안 점검을 수행합니다.",
    tags: ["취약점 스캔", "OWASP 기준", "개인정보 보호"],
  },
  {
    icon: BarChart3,
    title: "성능 최적화",
    desc: "데이터베이스 쿼리 튜닝, 캐시 최적화, 서버 리소스 분석을 통해 LMS 응답 속도를 지속적으로 개선합니다. 월간 성능 리포트를 제공합니다.",
    tags: ["DB 튜닝", "캐시 최적화", "월간 리포트"],
  },
  {
    icon: Settings,
    title: "기능 개선 & 커스터마이징",
    desc: "운영 중 필요한 소규모 기능 추가, UI 수정, 관리자 설정 변경 등을 신속하게 처리합니다. 요청 후 평균 1~3 영업일 내 반영합니다.",
    tags: ["기능 추가", "UI 수정", "빠른 처리"],
  },
  {
    icon: PhoneCall,
    title: "전담 기술 지원",
    desc: "계약 고객 전용 기술 지원 채널을 통해 전담 엔지니어에게 직접 문의할 수 있습니다. 이메일·카카오톡·전화 다채널 지원을 제공합니다.",
    tags: ["전담 엔지니어", "다채널 지원", "계약 고객 전용"],
  },
  {
    icon: AlertTriangle,
    title: "장애 원인 분석 & 보고",
    desc: "장애 복구 후 RCA(Root Cause Analysis) 보고서를 작성하여 재발 방지 대책을 수립합니다. 투명한 사후 보고로 신뢰를 유지합니다.",
    tags: ["RCA 보고서", "재발 방지", "투명한 소통"],
  },
  {
    icon: HeadphonesIcon,
    title: "사용자 문의 처리 대행",
    desc: "학습자·관리자의 시스템 관련 문의를 1차로 접수·분류하고 기술 이슈는 직접 처리, 운영 이슈는 담당자에게 전달합니다.",
    tags: ["1차 접수 대행", "이슈 분류", "빠른 에스컬레이션"],
  },
];

const devFeatures = [
  {
    icon: Code2,
    title: "신규 기능 개발",
    desc: "기존 LMS에 없는 기능을 새롭게 개발하여 추가합니다. 출석 관리, 퀴즈 엔진, 수강권 시스템, 결제 연동 등 다양한 기능을 맞춤 개발합니다.",
    tags: ["맞춤 기능 개발", "API 연동", "LMS 확장"],
  },
  {
    icon: Paintbrush,
    title: "UI/UX 디자인 개선",
    desc: "노후화된 화면을 최신 트렌드에 맞게 리뉴얼합니다. 학습자 경험을 중심으로 직관적인 화면 구조와 세련된 시각 디자인을 적용합니다.",
    tags: ["화면 리뉴얼", "UX 개선", "반응형 디자인"],
  },
  {
    icon: LayoutDashboard,
    title: "관리자 화면 고도화",
    desc: "관리자가 필요로 하는 통계 대시보드, 대량 회원 관리, 콘텐츠 일괄 처리 등 운영 효율을 높이는 관리 기능을 추가로 개발합니다.",
    tags: ["대시보드", "대량 처리", "운영 자동화"],
  },
  {
    icon: MonitorSmartphone,
    title: "모바일 최적화",
    desc: "PC 중심으로 개발된 LMS를 모바일·태블릿 환경에서도 완벽하게 동작하도록 반응형으로 개선합니다. 터치 UX와 앱과 동일한 경험을 제공합니다.",
    tags: ["반응형 웹", "모바일 UX", "크로스 디바이스"],
  },
  {
    icon: Puzzle,
    title: "외부 서비스 연동",
    desc: "카카오톡 알림톡, PG 결제, HR·ERP 시스템, SSO, 외부 API 등 다양한 서드파티 서비스와 LMS를 연동하여 업무 흐름을 자동화합니다.",
    tags: ["카카오 알림톡", "PG 결제", "SSO 연동"],
  },
  {
    icon: Layers,
    title: "기존 콘텐츠 마이그레이션",
    desc: "타사 LMS나 구형 시스템에서 웹헤즈 LMS로 학습 데이터, 회원 정보, 동영상 콘텐츠를 안전하게 이전합니다. 데이터 손실 없이 무중단 전환을 지원합니다.",
    tags: ["데이터 이전", "무중단 전환", "콘텐츠 마이그레이션"],
  },
];

const plans = [
  {
    name: "Basic",
    price: "300,000",
    unit: "원",
    priceNote: "월 이용료 (VAT별도)",
    features: [
      { main: "월 2회 정기 점검", sub: "" },
      { main: "장애 대응 (영업시간 내)", sub: "평일 09:00–18:00" },
      { main: "보안 패치 적용", sub: "" },
      { main: "월간 현황 리포트", sub: "" },
      { main: "이메일 기술 지원", sub: "" },
    ],
    recommend: "소규모 이러닝 서비스, 개인 강사, 소형 학원에 추천드려요",
  },
  {
    name: "Standard",
    price: "600,000",
    unit: "원",
    priceNote: "월 이용료 (VAT별도)",
    highlight: true,
    badge: "가장 많이 선택!",
    features: [
      { main: "월 4회 정기 점검", sub: "" },
      { main: "장애 대응 24/7", sub: "공휴일 포함 연중무휴" },
      { main: "보안 패치 & 성능 최적화", sub: "" },
      { main: "월간 성능·보안 리포트", sub: "" },
      { main: "이메일·카카오톡 기술 지원", sub: "" },
      { main: "소규모 기능 개선", sub: "월 2건 이내" },
    ],
    recommend: "중형 이러닝 플랫폼, 중소기업, 협회, 평생교육원에 추천드려요",
  },
  {
    name: "Premium",
    price: "1,200,000",
    unit: "원",
    priceNote: "월 이용료 (VAT별도)",
    features: [
      { main: "월 8회 정기 점검", sub: "" },
      { main: "장애 대응 24/7 전담팀", sub: "SLA 99.9% 보장" },
      { main: "보안·성능·DB 종합 최적화", sub: "" },
      { main: "주간 + 월간 종합 리포트", sub: "" },
      { main: "전화·이메일·카카오 전담 채널", sub: "" },
      { main: "기능 개선 무제한", sub: "우선 처리" },
      { main: "연간 보안 감사", sub: "1회 포함" },
    ],
    recommend: "대형 교육기관, 공공기관, 금융·엔터프라이즈 고객에 추천드려요",
  },
];

const stats = [
  { value: "5분", label: "평균 초동 대응", sub: "장애 감지 후" },
  { value: "99.9%", label: "SLA 가동률", sub: "Premium 기준" },
  { value: "30일", label: "백업 보관 기간", sub: "스냅샷 보관" },
  { value: "24/7", label: "모니터링", sub: "365일 무중단" },
];

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="유지보수"
        description="LMS 및 웹헤즈 솔루션 전문 유지보수 서비스. 24/7 장애 대응, 보안 패치, 성능 최적화, 기능 개선까지 전담 엔지니어가 책임지고 관리합니다."
        keywords="이러닝 유지보수, LMS 유지보수, 서버 유지보수, 24/7 장애 대응, 이러닝 운영 관리"
        path="/maintenance"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "웹헤즈 유지보수",
          "provider": { "@type": "Organization", "name": "웹헤즈" },
          "description": "LMS 및 이러닝 솔루션 전문 유지보수. 24/7 장애 대응, 보안 패치, 성능 최적화.",
          "areaServed": "KR",
          "serviceType": "IT 유지보수",
          "url": "https://webheads-sparkle-landing.lovable.app/maintenance"
        }}
      />
      {/* Hero */}
      <section
        className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden"
        style={{ background: "hsl(210, 50%, 90%)" }}
      >
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-xl">
            <span
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{ background: "#fff", color: "hsl(220, 60%, 35%)", boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}
            >
              유지보수
            </span>
            <h1
              className="text-4xl lg:text-[3.2rem] font-black leading-tight mb-5 tracking-tight"
              style={{ color: "hsl(220, 60%, 8%)" }}
            >
              안정적인 운영을 위한<br />
              <span style={{ color: "hsl(220, 80%, 50%)" }}>전문 유지보수 서비스</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "hsl(220, 20%, 45%)" }}>
              LMS를 포함한 웹헤즈 모든 솔루션의 장애 대응, 보안 패치, 성능 최적화, 기능 개선을 전담 엔지니어가 책임지고 관리합니다.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="#contact"
                className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-85"
                style={{ background: "hsl(220, 60%, 8%)", color: "#fff" }}
              >
                유지보수 상담 신청
              </a>
              <a
                href="#plans"
                className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border"
                style={{ borderColor: "hsl(214, 20%, 85%)", color: "hsl(220, 60%, 8%)", background: "#fff" }}
              >
                요금제 보기
              </a>
            </div>
            <div className="mt-4">
              <LmsBanner />
            </div>
          </div>
        </div>

        {/* 우측 오브제 이미지 */}
        <div className="absolute right-0 top-0 h-full w-[55%] pointer-events-none select-none hidden lg:block">
          <img
            src={heroMaintenance}
            alt=""
            fetchPriority="high"
            className="absolute left-[5%] top-1/2 -translate-y-1/2 w-[60%] object-contain"
            style={{ mixBlendMode: "multiply", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 55%, transparent 85%)", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 55%, transparent 85%)" }}
          />
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

      {/* 주요 서비스 */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">주요 서비스</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">
              운영의 모든 것을<br />
              책임지고 관리합니다
            </h2>
            <p className="text-muted-foreground mt-4 text-base">
              장애 대응부터 성능 최적화, 보안 관리까지 이러닝 플랫폼 운영에 필요한 모든 유지보수를 제공합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {f.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">요금제</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">
              규모에 맞는 플랜을<br />
              선택하세요
            </h2>
            <p className="text-muted-foreground mt-4 text-base">모든 요금은 VAT 별도입니다. 커스텀 견적은 문의 주세요.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl flex flex-col gap-0 transition-all duration-200 overflow-hidden ${
                  plan.highlight
                    ? "bg-background border-2 border-primary shadow-xl scale-[1.02]"
                    : "bg-background border border-border hover:border-muted-foreground/30 hover:shadow-md"
                }`}
              >
                {plan.badge && (
                  <div className="bg-primary text-primary-foreground text-sm font-bold text-center py-2.5 tracking-wide">
                    {plan.badge}
                  </div>
                )}
                <div className="p-8 flex flex-col gap-5 flex-1">
                  <div>
                    <h3 className={`font-black text-3xl tracking-tight ${plan.highlight ? "text-primary" : "text-foreground"}`}>
                      {plan.name}
                    </h3>
                    <div className={`h-px mt-4 ${plan.highlight ? "bg-primary/20" : "bg-border"}`} />
                  </div>
                  <div>
                    <div className="flex items-end gap-1">
                      <span className={`font-black leading-none tracking-tight text-4xl ${plan.highlight ? "text-primary" : "text-foreground"}`}>
                        {plan.price}
                      </span>
                      {plan.unit && <span className="text-base font-semibold text-muted-foreground mb-1">{plan.unit}</span>}
                    </div>
                    {plan.priceNote && <p className="text-sm text-muted-foreground mt-1.5">{plan.priceNote}</p>}
                  </div>
                  <ul className="flex flex-col gap-3.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f.main} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5 text-sm text-primary">✓</span>
                        <div>
                          <p className="text-base font-medium text-foreground leading-tight">{f.main}</p>
                          {f.sub && <p className="text-sm text-muted-foreground mt-0.5">{f.sub}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-xl p-4 mt-2" style={{ background: "hsl(220, 60%, 12%)" }}>
                    <p className="text-sm text-white/60 leading-relaxed text-center">{plan.recommend}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
