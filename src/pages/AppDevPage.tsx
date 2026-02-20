import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import heroApp from "@/assets/hero-app.jpg";
import ContactSection from "@/components/ContactSection";
import { Smartphone, Tablet, RefreshCw, Bell, Lock, BarChart3, CheckCircle2 } from "lucide-react";

const features = [
  { icon: Smartphone, title: "iOS / Android 네이티브", desc: "각 플랫폼에 최적화된 네이티브 앱으로 최고의 사용자 경험을 제공합니다." },
  { icon: RefreshCw, title: "하이브리드 앱 개발", desc: "하나의 코드베이스로 iOS, Android 동시 운영하여 개발 비용과 유지보수를 최소화합니다." },
  { icon: Tablet, title: "LMS 완벽 연동", desc: "웹헤즈 LMS와 완벽하게 연동되어 수강 현황, 학습 이력, 성적을 실시간으로 동기화합니다." },
  { icon: Bell, title: "PUSH 알림 자동화", desc: "학습 독려, 공지사항, 일정 알림을 자동화하여 학습 참여율을 높입니다." },
  { icon: Lock, title: "DRM 영상 보안", desc: "모바일 환경에서도 불법 녹화 및 캡처를 원천 차단하는 보안 기능을 탑재합니다." },
  { icon: BarChart3, title: "학습 분석 대시보드", desc: "학습 시간, 진도율, 퀴즈 성과 등 상세한 학습 데이터를 모바일에서도 확인합니다." },
];

const appTypes = [
  {
    type: "기업 교육 앱",
    features: ["사내 LMS 연동", "부서별 학습 관리", "HR 시스템 연동", "오프라인 학습 지원"],
  },
  {
    type: "대학 / 교육기관 앱",
    features: ["학사 시스템 연동", "출석 관리", "과제 제출", "교수-학생 커뮤니티"],
    highlight: true,
  },
  {
    type: "이러닝 플랫폼 앱",
    features: ["콘텐츠 마켓플레이스", "결제 시스템 연동", "수강권 관리", "실시간 라이브"],
  },
];

export default function AppDevPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-section min-h-[70vh] flex items-center pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroApp})` }}
        />
        <div className="container mx-auto px-4 py-20 relative">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 부가서비스 전체보기
          </Link>
          <div className="max-w-2xl">
            <span className="feature-badge mb-5" style={{ background: "hsl(238 80% 60% / 0.15)", color: "hsl(245 80% 75%)", borderColor: "hsl(238 80% 60% / 0.3)" }}>
              APP 개발
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mt-4 mb-5 leading-tight">
              이러닝에 특화된<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, hsl(238,80%,70%), hsl(280,70%,75%))" }}>
                모바일 앱 개발
              </span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl">
              iOS, Android, 하이브리드 앱 개발까지
              이러닝에 최적화된 모바일 학습 환경을 구축하세요.
            </p>
            <div className="flex gap-3">
              <a href="#contact" className="btn-primary px-7 py-3.5 rounded-xl font-semibold">
                개발 상담 신청
              </a>
              <a href="#types" className="px-7 py-3.5 rounded-xl font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors">
                앱 유형 보기
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
            <h2 className="text-3xl font-bold mt-4">APP 개발 핵심 기능</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="service-card p-7">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Types */}
      <section id="types" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">앱 유형</span>
            <h2 className="text-3xl font-bold mt-4">기관 유형별 맞춤 앱</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {appTypes.map((a) => (
              <div
                key={a.type}
                className={`rounded-2xl p-7 border ${a.highlight
                  ? "bg-navy-900 border-primary shadow-primary"
                  : "bg-card border-border"
                }`}
              >
                {a.highlight && <div className="feature-badge mb-4 text-xs">인기</div>}
                <h3 className={`text-xl font-bold mb-5 ${a.highlight ? "text-white" : ""}`}>{a.type}</h3>
                <ul className="space-y-3">
                  {a.features.map((feat) => (
                    <li key={feat} className={`flex items-center gap-2 text-sm ${a.highlight ? "text-white/80" : "text-muted-foreground"}`}>
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${a.highlight ? "text-brand-cyan" : "text-primary"}`} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`block text-center mt-8 py-3 rounded-xl font-semibold text-sm ${a.highlight
                    ? "btn-primary"
                    : "border border-primary text-primary hover:bg-primary/5 transition-colors"
                  }`}
                >
                  개발 문의
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
