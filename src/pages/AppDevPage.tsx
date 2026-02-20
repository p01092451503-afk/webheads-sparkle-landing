import heroApp from "@/assets/hero-app-toss.png";
import ContactSection from "@/components/ContactSection";
import { Smartphone, Tablet, RefreshCw, Bell, Lock, BarChart3, Wifi, Settings2, ShieldCheck } from "lucide-react";

const features = [
  { icon: Smartphone, title: "iOS / Android 네이티브 개발", desc: "Swift(iOS), Kotlin(Android)을 활용한 완전 네이티브 앱으로 각 플랫폼 UX 가이드라인을 철저히 준수합니다. 기기 고유 기능(카메라, 생체인증, ARKit 등)을 최대한 활용하여 최고의 성능을 구현합니다.", tags: ["Swift", "Kotlin", "네이티브 UI", "생체인증"] },
  { icon: RefreshCw, title: "하이브리드 / 크로스플랫폼 개발", desc: "React Native, Flutter를 활용해 단일 코드베이스로 iOS·Android를 동시 개발합니다. 네이티브 대비 90% 이상의 성능을 유지하면서 개발 비용과 유지보수 부담을 대폭 절감합니다.", tags: ["React Native", "Flutter", "크로스플랫폼", "비용 절감"] },
  { icon: Tablet, title: "LMS 완벽 API 연동", desc: "웹헤즈 LMS REST API와 WebSocket 기반으로 실시간 양방향 연동합니다. 수강 현황, 학습 이력, 성적, 출석 데이터를 밀리초 단위로 동기화하여 일관된 학습 경험을 보장합니다.", tags: ["REST API", "WebSocket", "실시간 동기화", "양방향 연동"] },
  { icon: Bell, title: "PUSH 알림 자동화 & 개인화", desc: "FCM(Firebase Cloud Messaging), APNs를 활용한 고도화된 PUSH 알림 시스템을 구축합니다. 학습자별 행동 패턴을 분석하여 학습 독려, 과제 마감, 라이브 강의 시작 알림을 최적 시점에 발송합니다.", tags: ["FCM", "APNs", "개인화 알림", "행동 분석"] },
  { icon: Lock, title: "모바일 DRM 영상 보안", desc: "Widevine(Android), FairPlay(iOS) DRM을 적용하여 스트리밍 영상의 불법 녹화, 캡처, 다운로드를 원천 차단합니다. AES-128 암호화와 토큰 기반 접근 제어로 콘텐츠 자산을 완벽히 보호합니다.", tags: ["Widevine", "FairPlay", "AES-128", "토큰 인증"] },
  { icon: BarChart3, title: "학습 분석 대시보드", desc: "학습 시간, 진도율, 퀴즈 정답률, 강의 완료율 등 30개 이상의 학습 지표를 실시간 차트로 시각화합니다. AI 기반 학습 패턴 분석으로 개인별 맞춤 학습 경로를 추천합니다.", tags: ["30+ 지표", "실시간 차트", "AI 추천", "학습 분석"] },
  { icon: Wifi, title: "오프라인 학습 지원", desc: "네트워크가 불안정한 환경에서도 끊김 없는 학습이 가능하도록 강의 콘텐츠의 선택적 로컬 캐싱을 지원합니다. 오프라인 학습 데이터는 네트워크 복구 시 자동으로 LMS에 동기화됩니다.", tags: ["로컬 캐싱", "오프라인 모드", "자동 동기화", "SQLite"] },
  { icon: ShieldCheck, title: "보안 & 접근 제어", desc: "OAuth 2.0, SAML 2.0 기반 SSO(Single Sign-On)를 지원하며, 기기 등록 인증, 루팅/탈옥 감지, 스크린샷 차단 등 다층 보안 정책을 적용합니다. 기업 MDM 솔루션과의 연동도 지원합니다.", tags: ["OAuth 2.0", "SAML SSO", "MDM 연동", "루팅 감지"] },
  { icon: Settings2, title: "앱스토어 배포 & 유지관리", desc: "Apple App Store, Google Play Store 심사 대응부터 배포까지 전 과정을 대행합니다. CI/CD 파이프라인 구축으로 업데이트를 자동화하고, 충돌 로그·ANR 분석을 통한 지속적인 안정성 개선을 제공합니다.", tags: ["App Store", "Google Play", "CI/CD", "크래시 분석"] },
];

const appTypes = [
  { type: "기업 교육 앱", desc: "임직원 역량 강화와 사내 교육 효율화에 최적화된 앱", features: ["사내 LMS 완전 연동", "부서·직급별 학습 관리", "HR·ERP 시스템 연동", "오프라인 학습 지원", "사내 커뮤니티 & 게시판", "수료증 자동 발급"] },
  { type: "대학 / 교육기관 앱", desc: "학사 행정과 비대면 학습을 통합하는 캠퍼스 앱", features: ["학사 시스템(ZEUS 등) 연동", "출석 QR 체크인 관리", "과제 제출 & 피드백", "교수-학생 커뮤니티", "강의계획서 & 공지사항", "성적 조회 & 이의신청"], highlight: true },
  { type: "이러닝 플랫폼 앱", desc: "콘텐츠 판매부터 수강까지 올인원 학습 플랫폼", features: ["콘텐츠 마켓플레이스", "PG 결제 & 수강권 관리", "실시간 라이브 강의", "강사 수익 정산 시스템", "리뷰 & 평점 시스템", "멤버십 구독 관리"] },
];

const stats = [
  { value: "iOS+AOS", label: "동시 개발", sub: "단일 팀으로 처리" },
  { value: "90%+", label: "네이티브 성능", sub: "크로스플랫폼 대비" },
  { value: "30+", label: "학습 지표 분석", sub: "AI 기반 인사이트" },
  { value: "4주", label: "평균 개발 기간", sub: "MVP 기준" },
];

export default function AppDevPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section
        className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden"
        style={{ background: "hsl(210, 50%, 90%)" }}
      >
        <div
          className="absolute right-0 top-0 h-full w-[55%] pointer-events-none select-none hidden lg:block"
        >
          <img src={heroApp} alt="" fetchPriority="high" className="absolute left-[5%] top-1/2 -translate-y-1/2 w-[60%] object-contain" style={{ mixBlendMode: "multiply", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 55%, transparent 85%)", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 55%, transparent 85%)" }} />
        </div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "#fff", color: "hsl(245, 70%, 45%)", boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}>APP 개발</span>
            <h1 className="text-4xl lg:text-[3.2rem] font-black leading-tight mb-5 tracking-tight" style={{ color: "hsl(220, 60%, 8%)" }}>
              이러닝에 특화된<br />
              <span style={{ color: "hsl(245, 80%, 55%)" }}>모바일 앱 개발</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "hsl(220, 20%, 45%)" }}>iOS, Android, 하이브리드 앱 개발까지 이러닝에 최적화된 모바일 학습 환경을 구축하세요.</p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-85" style={{ background: "hsl(220, 60%, 8%)", color: "#fff" }}>개발 상담 신청</a>
              <a href="#types" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border" style={{ borderColor: "hsl(214, 20%, 85%)", color: "hsl(220, 60%, 8%)", background: "#fff" }}>앱 유형 보기</a>
            </div>
          </div>
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

      {/* Features */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">주요 기능</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">이러닝에 특화된<br />앱 개발 역량</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {f.tags.map((tag) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Types */}
      <section id="types" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">앱 유형</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">기관 유형별<br />맞춤 앱</h2>
            <p className="text-muted-foreground mt-4 text-base">모든 개발은 별도 문의를 통해 최적 견적을 제공드립니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {appTypes.map((a) => (
              <div key={a.type} className={`relative rounded-3xl p-8 flex flex-col gap-5 transition-all duration-200 ${a.highlight ? "bg-foreground text-primary-foreground shadow-2xl scale-[1.02]" : "bg-background border border-border hover:border-muted-foreground/30 hover:shadow-md"}`}>
                {a.highlight && <span className="absolute top-6 right-6 text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white/80">인기</span>}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${a.highlight ? "text-white/40" : "text-muted-foreground"}`}>{a.desc}</p>
                  <h3 className={`font-black leading-none text-3xl tracking-tight ${a.highlight ? "text-white" : "text-foreground"}`}>{a.type}</h3>
                </div>
                <div className={`h-px ${a.highlight ? "bg-white/10" : "bg-border"}`} />
                <ul className="flex flex-col gap-3 flex-1">
                  {a.features.map((feat) => (
                    <li key={feat} className={`flex items-center gap-2.5 text-sm ${a.highlight ? "text-white/70" : "text-muted-foreground"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.highlight ? "bg-white/50" : "bg-primary"}`} />{feat}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={`block text-center py-3.5 rounded-2xl font-bold text-sm transition-all duration-150 ${a.highlight ? "bg-background text-foreground hover:bg-secondary" : "bg-foreground text-primary-foreground hover:opacity-85"}`}>개발 문의</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
