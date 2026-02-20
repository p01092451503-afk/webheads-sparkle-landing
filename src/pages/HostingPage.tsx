import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
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
  { name: "Basic", price: "문의", desc: "소규모 기관 · 스타트업", features: ["CDN 포함", "SSD 스토리지 50GB", "월 트래픽 500GB", "이메일 지원"] },
  { name: "Standard", price: "문의", desc: "중소기업 · 교육기관", features: ["CDN + AWS", "SSD 스토리지 200GB", "월 트래픽 2TB", "전화 + 이메일 지원", "이중화 구성"], highlight: true },
  { name: "Enterprise", price: "문의", desc: "대기업 · 대규모 플랫폼", features: ["CDN + AWS + IDC", "스토리지 무제한", "트래픽 무제한", "전담 기술 지원", "SLA 99.9% 보장", "보안 감사 지원"] },
];

export default function HostingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="hero-section min-h-[60vh] flex items-center pt-20">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 부가서비스 전체보기
          </Link>
          <div className="max-w-2xl">
            <span className="feature-badge mb-5">이러닝 호스팅</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-5 leading-tight">
              이러닝에 최적화된<br />
              <span className="text-primary">클라우드 호스팅</span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-xl">
              CDN, AWS, IDC를 모두 지원하는 이러닝 전문 호스팅 서비스로
              학습자에게 끊김 없는 학습 환경을 제공하세요.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="btn-primary px-7 py-3.5 rounded-xl font-semibold">
                무료 상담 신청
              </a>
              <a href="#plans" className="px-7 py-3.5 rounded-xl font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                요금제 보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">주요 기능</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">이러닝 호스팅 핵심 기능</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="service-card p-7 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{f.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {f.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
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
      <section id="plans" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">요금제</span>
            <h2 className="text-3xl font-bold mt-4 mb-3">맞춤형 요금제 선택</h2>
            <p className="text-muted-foreground">규모와 예산에 맞는 최적의 플랜을 제안드립니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-7 border ${plan.highlight
                  ? "bg-navy-900 border-primary shadow-primary"
                  : "bg-card border-border"
                }`}
              >
                {plan.highlight && (
                  <div className="feature-badge mb-4 text-xs">추천</div>
                )}
                <h3 className={`text-2xl font-black mb-1 ${plan.highlight ? "text-white" : ""}`}>{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlight ? "text-white/50" : "text-muted-foreground"}`}>{plan.desc}</p>
                <div className={`text-3xl font-bold mb-6 ${plan.highlight ? "text-brand-cyan" : "text-primary"}`}>{plan.price}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? "text-white/80" : "text-muted-foreground"}`}>
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-brand-cyan" : "text-primary"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm ${plan.highlight
                    ? "btn-primary"
                    : "border border-primary text-primary hover:bg-primary/5 transition-colors"
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
