import { CheckCircle2 } from "lucide-react";
import heroApp from "@/assets/hero-app.jpg";
import ContactSection from "@/components/ContactSection";
import { Smartphone, Tablet, RefreshCw, Bell, Lock, BarChart3, Wifi, Settings2, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "iOS / Android 네이티브 개발",
    desc: "Swift(iOS), Kotlin(Android)을 활용한 완전 네이티브 앱으로 각 플랫폼 UX 가이드라인을 철저히 준수합니다. 기기 고유 기능(카메라, 생체인증, ARKit 등)을 최대한 활용하여 최고의 성능을 구현합니다.",
    tags: ["Swift", "Kotlin", "네이티브 UI", "생체인증"],
  },
  {
    icon: RefreshCw,
    title: "하이브리드 / 크로스플랫폼 개발",
    desc: "React Native, Flutter를 활용해 단일 코드베이스로 iOS·Android를 동시 개발합니다. 네이티브 대비 90% 이상의 성능을 유지하면서 개발 비용과 유지보수 부담을 대폭 절감합니다.",
    tags: ["React Native", "Flutter", "크로스플랫폼", "비용 절감"],
  },
  {
    icon: Tablet,
    title: "LMS 완벽 API 연동",
    desc: "웹헤즈 LMS REST API와 WebSocket 기반으로 실시간 양방향 연동합니다. 수강 현황, 학습 이력, 성적, 출석 데이터를 밀리초 단위로 동기화하여 일관된 학습 경험을 보장합니다.",
    tags: ["REST API", "WebSocket", "실시간 동기화", "양방향 연동"],
  },
  {
    icon: Bell,
    title: "PUSH 알림 자동화 & 개인화",
    desc: "FCM(Firebase Cloud Messaging), APNs를 활용한 고도화된 PUSH 알림 시스템을 구축합니다. 학습자별 행동 패턴을 분석하여 학습 독려, 과제 마감, 라이브 강의 시작 알림을 최적 시점에 발송합니다.",
    tags: ["FCM", "APNs", "개인화 알림", "행동 분석"],
  },
  {
    icon: Lock,
    title: "모바일 DRM 영상 보안",
    desc: "Widevine(Android), FairPlay(iOS) DRM을 적용하여 스트리밍 영상의 불법 녹화, 캡처, 다운로드를 원천 차단합니다. AES-128 암호화와 토큰 기반 접근 제어로 콘텐츠 자산을 완벽히 보호합니다.",
    tags: ["Widevine", "FairPlay", "AES-128", "토큰 인증"],
  },
  {
    icon: BarChart3,
    title: "학습 분석 대시보드",
    desc: "학습 시간, 진도율, 퀴즈 정답률, 강의 완료율 등 30개 이상의 학습 지표를 실시간 차트로 시각화합니다. AI 기반 학습 패턴 분석으로 개인별 맞춤 학습 경로를 추천합니다.",
    tags: ["30+ 지표", "실시간 차트", "AI 추천", "학습 분석"],
  },
  {
    icon: Wifi,
    title: "오프라인 학습 지원",
    desc: "네트워크가 불안정한 환경에서도 끊김 없는 학습이 가능하도록 강의 콘텐츠의 선택적 로컬 캐싱을 지원합니다. 오프라인 학습 데이터는 네트워크 복구 시 자동으로 LMS에 동기화됩니다.",
    tags: ["로컬 캐싱", "오프라인 모드", "자동 동기화", "SQLite"],
  },
  {
    icon: ShieldCheck,
    title: "보안 & 접근 제어",
    desc: "OAuth 2.0, SAML 2.0 기반 SSO(Single Sign-On)를 지원하며, 기기 등록 인증, 루팅/탈옥 감지, 스크린샷 차단 등 다층 보안 정책을 적용합니다. 기업 MDM 솔루션과의 연동도 지원합니다.",
    tags: ["OAuth 2.0", "SAML SSO", "MDM 연동", "루팅 감지"],
  },
  {
    icon: Settings2,
    title: "앱스토어 배포 & 유지관리",
    desc: "Apple App Store, Google Play Store 심사 대응부터 배포까지 전 과정을 대행합니다. CI/CD 파이프라인 구축으로 업데이트를 자동화하고, 충돌 로그·ANR 분석을 통한 지속적인 안정성 개선을 제공합니다.",
    tags: ["App Store", "Google Play", "CI/CD", "크래시 분석"],
  },
];

const appTypes = [
  {
    type: "기업 교육 앱",
    desc: "임직원 역량 강화와 사내 교육 효율화에 최적화된 앱",
    features: [
      "사내 LMS 완전 연동",
      "부서·직급별 학습 관리",
      "HR·ERP 시스템 연동",
      "오프라인 학습 지원",
      "사내 커뮤니티 & 게시판",
      "수료증 자동 발급",
    ],
  },
  {
    type: "대학 / 교육기관 앱",
    desc: "학사 행정과 비대면 학습을 통합하는 캠퍼스 앱",
    features: [
      "학사 시스템(ZEUS 등) 연동",
      "출석 QR 체크인 관리",
      "과제 제출 & 피드백",
      "교수-학생 커뮤니티",
      "강의계획서 & 공지사항",
      "성적 조회 & 이의신청",
    ],
    highlight: true,
  },
  {
    type: "이러닝 플랫폼 앱",
    desc: "콘텐츠 판매부터 수강까지 올인원 학습 플랫폼",
    features: [
      "콘텐츠 마켓플레이스",
      "PG 결제 & 수강권 관리",
      "실시간 라이브 강의",
      "강사 수익 정산 시스템",
      "리뷰 & 평점 시스템",
      "멤버십 구독 관리",
    ],
  },
];

export default function AppDevPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-section min-h-[70vh] flex items-center pt-20">
        <img
          src={heroApp}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />
        <div className="container mx-auto px-4 py-20 relative">
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
      <section className="py-24 bg-muted/20 bg-grid-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">주요 기능</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-4">
              APP 개발 <span className="text-transparent bg-clip-text bg-primary-gradient">핵심 기능</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              네이티브·크로스플랫폼 개발부터 LMS 완전 연동, DRM 보안까지 이러닝 전문 앱을 구현합니다.
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
                <div className="flex flex-wrap gap-2 mt-auto">
                  {f.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-primary/8 text-primary font-medium border border-primary/15">
                      {tag}
                    </span>
                  ))}
                </div>
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
            <h2 className="text-3xl lg:text-4xl font-bold mt-4">
              기관 유형별 <span className="text-transparent bg-clip-text bg-primary-gradient">맞춤 앱</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {appTypes.map((a) => (
              <div
                key={a.type}
                className={`rounded-2xl p-7 border flex flex-col ${a.highlight
                  ? "bg-navy-900 border-primary shadow-primary"
                  : "bg-card border-border hover:border-primary/30 transition-colors"
                }`}
              >
                {a.highlight && <div className="feature-badge mb-4 text-xs inline-block w-fit">인기</div>}
                <h3 className={`text-xl font-bold mb-1 ${a.highlight ? "text-white" : ""}`}>{a.type}</h3>
                <p className={`text-sm mb-5 ${a.highlight ? "text-white/50" : "text-muted-foreground"}`}>{a.desc}</p>
                <ul className="space-y-3 flex-1">
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

      {/* Stats */}
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "iOS+AOS", label: "동시 개발", sub: "단일 팀으로 처리" },
              { value: "90%+", label: "네이티브 성능", sub: "크로스플랫폼 대비" },
              { value: "30+", label: "학습 지표 분석", sub: "AI 기반 인사이트" },
              { value: "4주", label: "평균 개발 기간", sub: "MVP 기준" },
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
