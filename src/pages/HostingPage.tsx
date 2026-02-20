import heroHosting from "@/assets/hero-hosting.jpg";
import ContactSection from "@/components/ContactSection";
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
    name: "Basic",
    desc: "소규모 기관 · 스타트업",
    features: ["CDN 포함", "SSD 스토리지 50GB", "월 트래픽 500GB", "이메일 지원"],
  },
  {
    name: "Standard",
    desc: "중소기업 · 교육기관",
    features: ["CDN + AWS", "SSD 스토리지 200GB", "월 트래픽 2TB", "전화 + 이메일 지원", "이중화 구성"],
    highlight: true,
  },
  {
    name: "Enterprise",
    desc: "대기업 · 대규모 플랫폼",
    features: ["CDN + AWS + IDC", "스토리지 무제한", "트래픽 무제한", "전담 기술 지원", "SLA 99.9% 보장", "보안 감사 지원"],
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
      {/* Hero — 기존 유지 */}
      <section className="hero-section min-h-[70vh] flex items-center pt-20">
        <img
          src={heroHosting}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-2xl">
            <span className="feature-badge mb-5">이러닝 호스팅</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mt-4 mb-5 leading-tight">
              이러닝에 최적화된<br />
              <span className="text-transparent bg-clip-text bg-primary-gradient">클라우드 호스팅</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl">
              CDN, AWS, IDC를 모두 지원하는 이러닝 전문 호스팅 서비스로
              학습자에게 끊김 없는 학습 환경을 제공하세요.
            </p>
            <div className="flex gap-3">
              <a href="#contact" className="btn-primary px-7 py-3.5 rounded-xl font-semibold">
                무료 상담 신청
              </a>
              <a href="#plans" className="px-7 py-3.5 rounded-xl font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors">
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

      {/* Plans — Toss 스타일 플랜 카드 */}
      <section id="plans" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">요금제</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">
              규모에 맞는 플랜을<br />
              선택하세요
            </h2>
            <p className="text-muted-foreground mt-4 text-base">모든 플랜은 별도 문의를 통해 최적 견적을 제공드립니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-8 flex flex-col gap-5 transition-all duration-200 ${
                  plan.highlight
                    ? "bg-foreground text-primary-foreground shadow-2xl scale-[1.02]"
                    : "bg-background border border-border hover:border-muted-foreground/30 hover:shadow-md"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute top-6 right-6 text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white/80">
                    추천
                  </span>
                )}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${plan.highlight ? "text-white/40" : "text-muted-foreground"}`}>
                    {plan.desc}
                  </p>
                  <h3 className={`font-black leading-none text-4xl tracking-tight ${plan.highlight ? "text-white" : "text-foreground"}`}>
                    {plan.name}
                  </h3>
                </div>
                <div className={`h-px ${plan.highlight ? "bg-white/10" : "bg-border"}`} />
                <ul className="flex flex-col gap-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.highlight ? "text-white/70" : "text-muted-foreground"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${plan.highlight ? "bg-white/50" : "bg-primary"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`block text-center py-3.5 rounded-2xl font-bold text-sm transition-all duration-150 ${
                    plan.highlight
                      ? "bg-background text-foreground hover:bg-secondary"
                      : "bg-foreground text-primary-foreground hover:opacity-85"
                  }`}
                >
                  견적 문의
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
