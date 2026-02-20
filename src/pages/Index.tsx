import { Link } from "react-router-dom";
import {
  Server, Bot, Smartphone, Film, ShieldCheck, MessageCircle, ArrowRight, CheckCircle2
} from "lucide-react";
import ContactSection from "@/components/ContactSection";

const services = [
  {
    icon: Server,
    title: "이러닝 호스팅",
    subtitle: "CDN / AWS / IDC",
    desc: "이러닝에 최적화된 클라우드 인프라로 끊김없는 학습 환경을 제공합니다.",
    features: ["CDN 가속화", "AWS 클라우드", "IDC 서버 운영", "24/7 모니터링"],
    path: "/hosting",
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Bot,
    title: "AI 챗봇 개발",
    subtitle: "맞춤형 AI 상담봇",
    desc: "LMS에 최적화된 AI 챗봇으로 학습자의 질문에 24시간 즉시 응답합니다.",
    features: ["맞춤형 학습 상담", "FAQ 자동 응답", "LMS 연동", "다국어 지원"],
    path: "/chatbot",
    color: "from-cyan-500 to-teal-600",
    bg: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    icon: Smartphone,
    title: "APP 개발",
    subtitle: "iOS / Android / 하이브리드",
    desc: "이러닝에 특화된 모바일 앱으로 언제 어디서나 학습이 가능한 환경을 구축합니다.",
    features: ["iOS / Android 앱", "하이브리드 앱", "LMS 연동", "PUSH 알림"],
    path: "/app-dev",
    color: "from-indigo-500 to-purple-600",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    icon: Film,
    title: "콘텐츠 개발",
    subtitle: "이러닝 콘텐츠 제작",
    desc: "기획부터 개발, 검수까지 고품질 이러닝 콘텐츠를 원스톱으로 제작합니다.",
    features: ["동영상 강의 제작", "인터랙티브 콘텐츠", "3D 애니메이션", "SCORM 패키징"],
    path: "/content",
    color: "from-orange-400 to-rose-500",
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: ShieldCheck,
    title: "DRM 솔루션",
    subtitle: "카테노이드 / 존플레이어",
    desc: "불법 복제를 원천 차단하는 DRM 솔루션으로 소중한 이러닝 콘텐츠를 보호합니다.",
    features: ["카테노이드 DRM", "존플레이어 DRM", "불법 캡처 방지", "워터마크"],
    path: "/drm",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: MessageCircle,
    title: "채널톡 / SMS",
    subtitle: "고객 커뮤니케이션 플랫폼",
    desc: "채널톡과 SMS를 통해 학습자와의 소통을 강화하고 운영 효율을 높입니다.",
    features: ["채널톡 연동", "SMS 발송", "자동화 메시지", "CRM 연동"],
    path: "/channel",
    color: "from-yellow-400 to-orange-500",
    bg: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
];

const stats = [
  { value: "500+", label: "고객사" },
  { value: "15년+", label: "운영 경험" },
  { value: "99.9%", label: "서버 가동률" },
  { value: "24/7", label: "기술 지원" },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────── */}
      <section className="hero-section min-h-[85vh] flex items-center pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="feature-badge mb-6 animate-fade-in" style={{ opacity: 0, animationDelay: "0.1s" }}>
              웹헤즈 부가서비스 포털
            </div>
            <h1
              className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6"
              style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.2s forwards" }}
            >
              이러닝의 모든 것을<br />
              <span className="text-transparent bg-clip-text bg-primary-gradient">
                웹헤즈와 함께
              </span>
            </h1>
            <p
              className="text-white/60 text-lg lg:text-xl leading-relaxed mb-10 max-w-xl mx-auto"
              style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.35s forwards" }}
            >
              LMS 솔루션부터 호스팅, AI 챗봇, APP 개발, 콘텐츠 제작, DRM, 채널톡/SMS까지
              이러닝 사업에 필요한 모든 서비스를 한 곳에서 제공합니다.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-3 justify-center"
              style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.5s forwards" }}
            >
              <a href="#services" className="btn-primary px-8 py-4 rounded-xl text-base font-semibold">
                서비스 둘러보기
              </a>
              <a href="#contact" className="px-8 py-4 rounded-xl text-base font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors">
                무료 상담 신청
              </a>
            </div>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto mt-20"
            style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.65s forwards" }}
          >
            {stats.map((s) => (
              <div key={s.label} className="stat-card text-center p-5 rounded-2xl">
                <div className="text-3xl font-bold text-brand-cyan">{s.value}</div>
                <div className="text-white/50 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Grid ─────────────────────────── */}
      <section id="services" className="py-24 bg-muted/30 bg-grid-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">SERVICES</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-4 mb-4">
              웹헤즈 <span className="text-primary">부가서비스</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              이러닝 플랫폼 운영에 필요한 모든 기술 서비스를 웹헤즈 하나로 해결하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <Link
                key={svc.path}
                to={svc.path}
                className="service-card p-7 group block"
                style={{ opacity: 0, animation: `fade-up 0.6s ease-out ${0.1 + i * 0.08}s forwards` }}
              >
                <div className={`w-12 h-12 rounded-xl ${svc.bg} flex items-center justify-center mb-5`}>
                  <svc.icon className={`w-6 h-6 ${svc.iconColor}`} />
                </div>
                <div className="tag-chip mb-3">{svc.subtitle}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{svc.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{svc.desc}</p>
                <ul className="space-y-2 mb-6">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                  자세히 보기 <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Webheads ──────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">WHY WEBHEADS</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-4 mb-4">
              왜 <span className="text-primary">웹헤즈</span>를 선택해야 할까요?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: "15년 이상의 이러닝 경험", desc: "국내 수백 개 기업의 LMS 구축 및 운영 노하우를 보유하고 있습니다.", num: "01" },
              { title: "원스톱 통합 서비스", desc: "LMS부터 부가서비스까지 단일 공급사에서 해결하여 운영 효율을 극대화합니다.", num: "02" },
              { title: "전담 기술 지원팀 운영", desc: "24/7 모니터링과 전담 기술지원팀이 항상 안정적인 운영을 보장합니다.", num: "03" },
            ].map((item) => (
              <div key={item.num} className="text-center p-8 rounded-2xl border border-border bg-card">
                <div className="text-5xl font-black text-primary/10 mb-4">{item.num}</div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────── */}
      <ContactSection />
    </div>
  );
}
