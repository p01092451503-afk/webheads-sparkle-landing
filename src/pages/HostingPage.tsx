import heroHosting from "@/assets/hero-hosting-toss.png";
import ContactSection from "@/components/ContactSection";
import SEO from "@/components/SEO";
import { Server, Zap, Shield, BarChart3, Globe, Clock } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "글로벌 CDN 가속",
    desc: "국내외 50개 이상의 엣지 서버를 통해 사용자와 가장 가까운 노드에서 콘텐츠를 제공합니다. 영상 버퍼링 없이 HD·4K 이러닝 콘텐츠를 실시간으로 스트리밍할 수 있어 학습 이탈률을 크게 줄입니다.",
    tags: ["50+ 엣지 노드", "HD 스트리밍", "레이턴시 최소화"],
  },
  {
    icon: Server,
    title: "AWS 클라우드 호스팅",
    desc: "Amazon Web Services(EC2·S3·CloudFront·RDS)를 기반으로 학습자 수에 따라 서버 용량이 자동 조정됩니다. Multi-AZ 구성으로 가용성을 극대화하며, 온디맨드 과금으로 불필요한 인프라 비용을 절감합니다.",
    tags: ["Multi-AZ", "온디맨드 과금", "S3 스토리지"],
  },
  {
    icon: Shield,
    title: "IDC 서버 운영",
    desc: "국내 최고 수준의 Tier-3 IDC 데이터센터에서 전용 물리 서버를 운영합니다. 이중 전원·이중 통신 회선을 통해 단일 장애점(SPOF)을 제거하고, 내부망 처리로 보안 규정 준수가 필요한 금융·공공기관에 최적화된 환경을 제공합니다.",
    tags: ["Tier-3 IDC", "전용 물리 서버", "이중 회선"],
  },
  {
    icon: Clock,
    title: "24/7 실시간 모니터링",
    desc: "365일 24시간 NOC(Network Operations Center) 전담팀이 서버·네트워크·애플리케이션 상태를 모니터링합니다. 임계치 초과 알림 발생 시 평균 5분 이내 초동 조치를 시작하여 서비스 중단을 최소화합니다.",
    tags: ["NOC 전담팀", "5분 내 초동 대응", "장애 자동 알림"],
  },
  {
    icon: Zap,
    title: "자동 스케일링",
    desc: "학기 시작·시험 기간 등 트래픽이 급증하는 구간에서도 AWS Auto Scaling과 Load Balancer가 실시간으로 인스턴스를 확장합니다. 피크 트래픽 이후에는 자동 축소되어 비용 효율을 유지합니다.",
    tags: ["Auto Scaling", "Load Balancing", "비용 최적화"],
  },
  {
    icon: BarChart3,
    title: "상세 이용 통계",
    desc: "학습자 접속 현황, 트래픽 추이, 콘텐츠 재생률·완료율을 실시간 대시보드로 확인합니다. 월별·일별 통계 리포트를 자동 생성하고 담당자에게 이메일로 발송하여 운영 효율을 높입니다.",
    tags: ["실시간 대시보드", "월간 리포트", "완료율 분석"],
  },
  {
    icon: Shield,
    title: "DDoS 방어 & 보안",
    desc: "웹방화벽(WAF)과 DDoS 차단 솔루션을 기본 탑재하여 악성 트래픽을 자동 차단합니다. SSL/TLS 인증서를 무료로 제공하고, 주기적인 취약점 점검으로 학습 데이터와 개인정보를 안전하게 보호합니다.",
    tags: ["WAF 탑재", "DDoS 차단", "SSL 무료 제공"],
  },
  {
    icon: Zap,
    title: "전용 백업 & 복구",
    desc: "콘텐츠·DB·설정 파일을 매일 자동 백업하고 최대 30일치 스냅샷을 보관합니다. 장애 발생 시 원하는 시점으로 즉시 복구(Point-in-Time Recovery)가 가능하여 데이터 손실 위험을 최소화합니다.",
    tags: ["일일 자동 백업", "30일 스냅샷", "즉시 복구"],
  },
  {
    icon: Globe,
    title: "전담 기술 지원",
    desc: "초기 서버 구성부터 LMS 연동, 도메인 설정, SSL 적용까지 웹헤즈 전담 엔지니어가 직접 지원합니다. 서비스 오픈 후에도 정기 점검·운영 컨설팅을 통해 최적의 성능을 유지해 드립니다.",
    tags: ["전담 엔지니어", "LMS 연동 지원", "정기 점검"],
  },
];

const plans = [
  {
    name: "Light",
    price: "300,000",
    unit: "원",
    priceNote: "월 이용료 (VAT별도)",
    features: [
      { main: "CDN 미사용 경량 호스팅", sub: "YouTube·Vimeo 링크 임베드 방식" },
      { main: "회원수 무제한", sub: "" },
      { main: "디자인 무료 템플릿 제공", sub: "" },
      { main: "SSL 보안인증서 설치", sub: "" },
      { main: "하이브리드앱 개발", sub: "월 +30만원" },
    ],
    recommend: "소규모 창업자, 1인 강사, 영상 외부 호스팅 이용 고객에 추천드려요",
  },
  {
    name: "Basic",
    price: "500,000",
    unit: "원",
    priceNote: "월 이용료 (VAT별도)",
    features: [
      { main: "동영상 전송량 500GB /월", sub: "전송량 초과시 1GB당 500원" },
      { main: "동영상 저장공간 총 100GB", sub: "저장용량 초과시 1GB당 1,000원" },
      { main: "회원수 무제한", sub: "" },
      { main: "디자인 무료 템플릿 제공", sub: "" },
      { main: "SSL 보안인증서 설치", sub: "" },
      { main: "하이브리드앱 개발", sub: "월 +30만원" },
    ],
    recommend: "개인강사, 개인사업가, 소형 학원에 추천드려요",
  },
  {
    name: "Plus",
    price: "700,000",
    unit: "원",
    priceNote: "월 이용료 (VAT별도)",
    features: [
      { main: "동영상 전송량 1,500GB /월", sub: "전송량 초과시 1GB당 400원" },
      { main: "동영상 저장공간 총 200GB", sub: "저장용량 초과시 1GB당 800원" },
      { main: "회원수 무제한", sub: "" },
      { main: "디자인 무료 템플릿 제공", sub: "" },
      { main: "SSL 보안인증서 설치", sub: "" },
      { main: "하이브리드앱 개발", sub: "월 +30만원" },
    ],
    recommend: "중형 학원, 개인사업자, 중소기업, 협회에 추천드려요",
  },
  {
    name: "Premium",
    price: "1,000,000",
    unit: "원",
    priceNote: "월 이용료 (VAT별도)",
    features: [
      { main: "동영상 전송량 2,000GB /월", sub: "전송량 초과시 1GB당 300원" },
      { main: "동영상 저장공간 총 250GB", sub: "저장용량 초과시 1GB당 500원" },
      { main: "회원수 무제한", sub: "" },
      { main: "디자인 무료 템플릿 제공", sub: "" },
      { main: "SSL 보안인증서 설치", sub: "" },
      { main: "하이브리드앱 개발", sub: "월 +30만원" },
    ],
    recommend: "대형 학원, 중소 기업, 평생교육원, 기타 교육기관에 추천드려요",
    highlight: true,
    badge: "인기 요금제!",
  },
];


const stats = [
  { value: "99.9%", label: "서버 가동률", sub: "SLA 보장" },
  { value: "50+", label: "CDN 엣지 노드", sub: "전 세계 가속" },
  { value: "5분", label: "초동 대응 시간", sub: "NOC 전담팀" },
  { value: "24/7", label: "기술 지원", sub: "365일 무중단" },
];

export default function HostingPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="이러닝 호스팅"
        description="CDN, AWS, IDC를 모두 지원하는 이러닝 전문 호스팅 서비스. 99.9% SLA 가동률, 24/7 NOC 모니터링, 자동 스케일링으로 끊김 없는 학습 환경을 제공합니다."
        keywords="이러닝 호스팅, LMS 호스팅, CDN, AWS 호스팅, IDC 서버, 이러닝 서버, 온라인 강의 호스팅"
        path="/hosting"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "웹헤즈 이러닝 호스팅",
          "provider": { "@type": "Organization", "name": "웹헤즈" },
          "description": "CDN, AWS, IDC를 모두 지원하는 이러닝 전문 호스팅 서비스",
          "areaServed": "KR",
          "serviceType": "이러닝 호스팅",
          "url": "https://webheads-sparkle-landing.lovable.app/hosting"
        }}
      />
      {/* Hero — Toss 스타일 */}
      <section
        className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden"
        style={{ background: "hsl(210, 50%, 90%)" }}
      >
        {/* 우측 비주얼 이미지 */}
        <div
          className="absolute right-0 top-0 h-full w-[55%] pointer-events-none select-none hidden lg:block"
        >
          <img
            src={heroHosting}
            alt=""
            fetchPriority="high"
            className="absolute left-[5%] top-1/2 -translate-y-1/2 w-[60%] object-contain"
            style={{ mixBlendMode: "multiply", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 55%, transparent 85%)", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 55%, transparent 85%)" }}
          />
        </div>

        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-xl">
            <span
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{ background: "#fff", color: "hsl(214, 80%, 42%)", boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}
            >
              이러닝 호스팅
            </span>
            <h1
              className="text-4xl lg:text-[3.2rem] font-black leading-tight mb-5 tracking-tight"
              style={{ color: "hsl(220, 60%, 8%)" }}
            >
              이러닝에 최적화된
              <br />
              <span style={{ color: "hsl(214, 90%, 52%)" }}>클라우드 호스팅</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "hsl(220, 20%, 45%)" }}>
              CDN, AWS, IDC를 모두 지원하는 이러닝 전문 호스팅 서비스로
              학습자에게 끊김 없는 학습 환경을 제공하세요.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="#contact"
                className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-85"
                style={{ background: "hsl(220, 60%, 8%)", color: "#fff" }}
              >
                무료 상담 신청
              </a>
              <a
                href="#plans"
                className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border"
                style={{
                  borderColor: "hsl(214, 20%, 85%)",
                  color: "hsl(220, 60%, 8%)",
                  background: "#fff",
                }}
              >
                요금제 보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — Toss 스타일 숫자 강조 */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-8 px-4 text-center first:pl-0 last:pr-0">
                <span className="block font-black leading-none mb-2 text-5xl md:text-6xl text-foreground tracking-tight">
                  {s.value}
                </span>
                <span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span>
                <span className="block text-xs text-muted-foreground">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — Toss 스타일 큰 타이틀 + 카드 그리드 */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">주요 기능</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">
              이러닝에 최적화된<br />
              인프라를 경험하세요
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-base tracking-tight">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {f.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary"
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

      {/* Plans */}
      <section id="plans" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">요금제</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">
              규모에 맞는 플랜을<br />
              선택하세요
            </h2>
            <p className="text-muted-foreground mt-4 text-base">모든 요금은 VAT 별도입니다. 초과 사용량은 플랜별 단가로 과금됩니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
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
                  {/* Name */}
                  <div>
                    <h3 className={`font-black text-3xl tracking-tight ${plan.highlight ? "text-primary" : "text-foreground"}`}>
                      {plan.name}
                    </h3>
                    <div className={`h-px mt-4 ${plan.highlight ? "bg-primary/20" : "bg-border"}`} />
                  </div>
                  {/* Price */}
                  <div>
                    <div className="flex items-end gap-1">
                      <span className={`font-black leading-none tracking-tight text-4xl ${plan.highlight ? "text-primary" : "text-foreground"}`}>
                        {plan.price}
                      </span>
                      {plan.unit && <span className="text-base font-semibold text-muted-foreground mb-1">{plan.unit}</span>}
                    </div>
                    {plan.priceNote && <p className="text-sm text-muted-foreground mt-1.5">{plan.priceNote}</p>}
                  </div>
                  {/* Features */}
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
                  {/* Recommend box */}
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
