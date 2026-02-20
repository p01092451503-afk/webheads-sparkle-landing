import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import heroHosting from "@/assets/hero-hosting.jpg";
import ContactSection from "@/components/ContactSection";
import { Server, Zap, Shield, BarChart3, Globe, Clock } from "lucide-react";

const features = [
  { icon: Globe, title: "글로벌 CDN 가속", desc: "전 세계 CDN 네트워크를 통해 어디서든 빠르고 안정적인 콘텐츠 전송이 가능합니다." },
  { icon: Server, title: "AWS 클라우드 호스팅", desc: "Amazon Web Services 기반의 확장 가능한 클라우드 인프라로 트래픽 급증에도 유연하게 대응합니다." },
  { icon: Shield, title: "IDC 서버 운영", desc: "국내 최고 수준의 IDC 데이터센터에서 안정적인 물리 서버를 운영합니다." },
  { icon: Clock, title: "24/7 실시간 모니터링", desc: "365일 중단 없는 모니터링으로 장애 발생 시 즉각 대응합니다." },
  { icon: Zap, title: "자동 스케일링", desc: "학기 시작 등 트래픽 폭증 구간에서도 자동으로 서버 리소스를 확장합니다." },
  { icon: BarChart3, title: "상세 이용 통계", desc: "학습자 접속 현황, 트래픽, 콘텐츠 재생률을 실시간 대시보드로 확인합니다." },
];

const plans = [
  { name: "Basic", price: "문의", desc: "소규모 기관 · 스타트업", features: ["CDN 포함", "SSD 스토리지 50GB", "월 트래픽 500GB", "이메일 지원"] },
  { name: "Standard", price: "문의", desc: "중소기업 · 교육기관", features: ["CDN + AWS", "SSD 스토리지 200GB", "월 트래픽 2TB", "전화 + 이메일 지원", "이중화 구성"], highlight: true },
  { name: "Enterprise", price: "문의", desc: "대기업 · 대규모 플랫폼", features: ["CDN + AWS + IDC", "스토리지 무제한", "트래픽 무제한", "전담 기술 지원", "SLA 99.9% 보장", "보안 감사 지원"] },
];

export default function HostingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-section min-h-[70vh] flex items-center pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroHosting})` }}
        />
        <div className="container mx-auto px-4 py-20 relative">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 부가서비스 전체보기
          </Link>
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

      {/* Features */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">주요 기능</span>
            <h2 className="text-3xl font-bold mt-4">이러닝 호스팅 핵심 기능</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="service-card p-7">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
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
