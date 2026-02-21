import { Link } from "react-router-dom";
import {
  Server, Bot, Smartphone, Film, ShieldCheck, MessageCircle,
  CreditCard, Wrench, ArrowRight, CheckCircle2
} from "lucide-react";
import ContactSection from "@/components/ContactSection";
import SEO from "@/components/SEO";

const services = [
  {
    icon: Server,
    title: "이러닝 호스팅",
    desc: "CDN · AWS · IDC 기반의 안정적인 이러닝 인프라를 제공합니다.\n99.9% 가동률과 24/7 모니터링으로 끊김 없는 학습 환경을 보장합니다.",
    highlights: ["CDN 가속화", "AWS 클라우드", "IDC 서버", "24/7 모니터링"],
    path: "/hosting",
    accent: "hsl(214, 90%, 52%)",
  },
  {
    icon: Wrench,
    title: "유지보수",
    desc: "LMS 운영에 필요한 기술 지원과 장애 대응을 전담합니다.\n정기 점검부터 긴급 대응까지, 안정적인 플랫폼 운영을 돕습니다.",
    highlights: ["정기 점검", "장애 대응", "성능 최적화", "보안 업데이트"],
    path: "/maintenance",
    accent: "hsl(152, 70%, 40%)",
  },
  {
    icon: Bot,
    title: "AI 챗봇",
    desc: "LMS에 최적화된 AI 챗봇이 학습자의 질문에\n24시간 즉시 응답합니다.",
    highlights: ["맞춤형 학습 상담", "FAQ 자동 응답", "LMS 연동", "다국어 지원"],
    path: "/chatbot",
    accent: "hsl(192, 90%, 45%)",
  },
  {
    icon: Smartphone,
    title: "어플리케이션",
    desc: "이러닝에 특화된 iOS / Android 앱으로\n언제 어디서나 학습할 수 있는 환경을 구축합니다.",
    highlights: ["iOS / Android", "하이브리드 앱", "PUSH 알림", "오프라인 학습"],
    path: "/app-dev",
    accent: "hsl(262, 80%, 55%)",
  },
  {
    icon: ShieldCheck,
    title: "DRM",
    desc: "불법 복제를 원천 차단하는 DRM 솔루션으로\n소중한 이러닝 콘텐츠를 안전하게 보호합니다.",
    highlights: ["카테노이드 DRM", "존플레이어", "캡처 방지", "워터마크"],
    path: "/drm",
    accent: "hsl(160, 80%, 38%)",
  },
  {
    icon: MessageCircle,
    title: "채널톡/SMS",
    desc: "채널톡과 SMS를 LMS와 연동하여\n학습 독려부터 수료 안내까지 자동화합니다.",
    highlights: ["채널톡 연동", "SMS 대량 발송", "카카오 알림톡", "자동화 시나리오"],
    path: "/channel",
    accent: "hsl(40, 90%, 45%)",
  },
  {
    icon: CreditCard,
    title: "PG",
    desc: "토스페이먼츠, KG이니시스부터 Stripe·PayPal까지\n다양한 결제 수단을 통합 연동합니다.",
    highlights: ["토스페이먼츠", "KG이니시스", "해외 결제", "정기결제"],
    path: "/pg",
    accent: "hsl(170, 75%, 38%)",
  },
  {
    icon: Film,
    title: "콘텐츠",
    desc: "기획부터 개발, 검수까지\n고품질 이러닝 콘텐츠를 원스톱으로 제작합니다.",
    highlights: ["동영상 강의", "인터랙티브 콘텐츠", "3D 애니메이션", "SCORM"],
    path: "/content",
    accent: "hsl(350, 80%, 55%)",
  },
];

const stats = [
  { value: "500+", label: "고객사" },
  { value: "15년+", label: "운영 경험" },
  { value: "99.9%", label: "서버 가동률" },
  { value: "24/7", label: "기술 지원" },
];

const whyUs = [
  {
    num: "01",
    title: "15년 이상의 이러닝 전문 경험",
    desc: "국내 수백 개 기업의 LMS 구축 및 운영 노하우를 보유하고 있습니다.",
  },
  {
    num: "02",
    title: "원스톱 통합 서비스",
    desc: "LMS부터 부가서비스까지 단일 공급사에서 해결하여 운영 효율을 극대화합니다.",
  },
  {
    num: "03",
    title: "전담 기술 지원팀 운영",
    desc: "24/7 모니터링과 전담 기술지원팀이 항상 안정적인 운영을 보장합니다.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="웹헤즈 부가서비스"
        description="이러닝의 모든 것을 웹헤즈와 함께. 호스팅, AI 챗봇, 앱 개발, DRM, PG, 콘텐츠 제작까지 이러닝 사업에 필요한 모든 부가서비스를 한 곳에서 제공합니다."
        keywords="이러닝, LMS, 웹헤즈, 호스팅, AI챗봇, 앱개발, DRM, PG결제, 콘텐츠 제작, 유지보수"
        path="/"
      />

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-16 overflow-hidden" style={{ background: "hsl(0, 0%, 100%)" }}>
        {/* Subtle gradient orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, hsl(214, 90%, 95%) 0%, transparent 70%)" }} />

        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-6 text-primary"
            style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.1s forwards" }}
          >
            웹헤즈 부가서비스
          </p>
          <h1
            className="text-[2.8rem] md:text-[3.8rem] lg:text-[4.5rem] font-black leading-[1.15] tracking-tight text-foreground mb-6"
            style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.2s forwards" }}
          >
            이러닝의 모든 것을<br />
            <span className="text-primary">한 곳에서</span>
          </h1>
          <p
            className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-10"
            style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.35s forwards" }}
          >
            호스팅부터 AI 챗봇, 앱 개발, DRM, 결제 연동까지.<br className="hidden md:block" />
            이러닝 사업에 필요한 모든 서비스를 제공합니다.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            style={{ opacity: 0, animation: "fade-up 0.7s ease-out 0.5s forwards" }}
          >
            <a
              href="#services"
              className="px-8 py-4 rounded-2xl text-base font-bold transition-all hover:opacity-90"
              style={{ background: "hsl(220, 60%, 8%)", color: "#fff" }}
            >
              서비스 둘러보기
            </a>
            <a
              href="#contact"
              className="px-8 py-4 rounded-2xl text-base font-bold border transition-colors hover:bg-secondary"
              style={{ borderColor: "hsl(214, 20%, 85%)", color: "hsl(220, 60%, 8%)" }}
            >
              무료 상담 신청
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 border-b border-border bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center py-6 px-4 text-center">
                <span className="block font-black text-4xl md:text-5xl text-foreground tracking-tight leading-none mb-2">{s.value}</span>
                <span className="block text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">SERVICES</p>
            <h2 className="font-black text-foreground text-4xl lg:text-5xl tracking-tight leading-tight">
              이러닝에 필요한<br />모든 서비스
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {services.map((svc, i) => (
              <Link
                key={svc.path}
                to={svc.path}
                className="group relative rounded-3xl p-8 md:p-10 transition-all duration-300 border border-border hover:border-transparent hover:shadow-lg"
                style={{
                  background: "hsl(0, 0%, 100%)",
                }}
              >
                {/* Accent bar on hover */}
                <div
                  className="absolute left-0 top-6 bottom-6 w-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: svc.accent }}
                />

                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${svc.accent}15` }}
                  >
                    <svc.icon className="w-7 h-7" style={{ color: svc.accent }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed whitespace-pre-line">
                      {svc.desc}
                    </p>
                  </div>

                  {/* Tags + Arrow */}
                  <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                    <div className="flex flex-wrap gap-1.5">
                      {svc.highlights.map((h) => (
                        <span
                          key={h}
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: `${svc.accent}12`, color: svc.accent }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                      자세히 보기 <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Webheads ── */}
      <section className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">WHY WEBHEADS</p>
            <h2 className="font-black text-foreground text-4xl lg:text-5xl tracking-tight leading-tight">
              왜 웹헤즈를<br />선택해야 할까요?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyUs.map((item) => (
              <div key={item.num} className="rounded-3xl bg-background p-8 border border-border text-center">
                <span className="block text-5xl font-black text-primary/10 mb-4">{item.num}</span>
                <h3 className="text-lg font-bold text-foreground mb-3 tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <ContactSection />
    </div>
  );
}
