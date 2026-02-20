import heroApp from "@/assets/hero-app-toss.png";
import ContactSection from "@/components/ContactSection";
import LmsBanner from "@/components/LmsBanner";
import SEO from "@/components/SEO";
import { Smartphone, Tablet, RefreshCw, Bell, Lock, BarChart3, Wifi, Settings2, ShieldCheck, Globe, Zap, Code2 } from "lucide-react";

const lmsFeatures = [
  { icon: Tablet, title: "웹헤즈 LMS 완벽 연동", desc: "웹헤즈 이러닝 솔루션과 REST API·WebSocket으로 실시간 양방향 연동합니다. 수강 현황, 학습 이력, 성적, 출석 데이터를 밀리초 단위로 동기화하여 웹과 앱 간 완전히 일관된 학습 경험을 제공합니다.", tags: ["REST API", "WebSocket", "실시간 동기화"] },
  { icon: Bell, title: "학습 독려 PUSH 알림", desc: "FCM·APNs를 통해 학습 독려, 과제 마감, 라이브 강의 시작 알림을 학습자별 최적 시점에 자동 발송합니다. 미접속 학습자 재참여 유도 시나리오도 설정할 수 있습니다.", tags: ["FCM", "APNs", "개인화 알림"] },
  { icon: Lock, title: "모바일 DRM 영상 보안", desc: "Widevine(Android)·FairPlay(iOS) DRM으로 스트리밍 영상의 불법 녹화·캡처를 원천 차단합니다. 웹헤즈 DRM 솔루션과 동일한 보안 체계를 앱에서도 그대로 유지합니다.", tags: ["Widevine", "FairPlay", "AES-128"] },
  { icon: Wifi, title: "오프라인 학습 지원", desc: "네트워크가 불안정한 환경에서도 강의 콘텐츠를 로컬 캐싱하여 끊김 없는 학습을 지원합니다. 오프라인 학습 데이터는 네트워크 복구 시 LMS에 자동 동기화됩니다.", tags: ["로컬 캐싱", "오프라인 모드", "자동 동기화"] },
  { icon: BarChart3, title: "학습 분석 & 진도 관리", desc: "학습 시간, 진도율, 퀴즈 정답률, 강의 완료율 등 30개 이상의 지표를 앱 내 대시보드로 시각화합니다. 관리자는 전체 학습자 현황을 앱에서도 실시간으로 파악할 수 있습니다.", tags: ["30+ 지표", "실시간 차트", "관리자 대시보드"] },
  { icon: ShieldCheck, title: "보안 & SSO 연동", desc: "OAuth 2.0·SAML 2.0 기반 SSO로 웹헤즈 LMS 계정 하나로 앱에도 즉시 로그인합니다. 기기 등록 인증, 루팅/탈옥 감지, 스크린샷 차단 등 다층 보안 정책을 적용합니다.", tags: ["OAuth 2.0", "SAML SSO", "루팅 감지"] },
];

const otherApps = [
  { icon: Globe, title: "커머스 & 마켓플레이스", desc: "상품 등록·결제·배송 추적·리뷰까지 풀스택 커머스 앱을 구축합니다. PG 연동과 정산 자동화까지 원스톱으로 제공합니다.", tags: ["PG 결제", "정산 자동화", "리뷰"] },
  { icon: Zap, title: "예약 & 스케줄 관리", desc: "강의실·회의실·의료 예약, 강사 스케줄 등 다양한 예약 관리 앱을 개발합니다. 카카오 알림톡·SMS 연동으로 예약 확인 자동화까지 지원합니다.", tags: ["예약 시스템", "알림 자동화", "캘린더"] },
  { icon: Smartphone, title: "사내 업무 & 그룹웨어", desc: "근태 관리, 전자결재, 사내 공지, 업무 협업 등 조직에 맞는 사내 앱을 맞춤 제작합니다. HR·ERP 시스템과의 연동도 지원합니다.", tags: ["근태 관리", "전자결재", "ERP 연동"] },
  { icon: Code2, title: "커뮤니티 & 소셜 플랫폼", desc: "피드, 채팅, 팔로우, 알림 등 SNS형 커뮤니티 기능부터 소규모 전문 커뮤니티 앱까지 기획부터 출시까지 지원합니다.", tags: ["피드", "실시간 채팅", "알림"] },
];

const stats = [
  { value: "iOS+AOS", label: "동시 개발", sub: "단일 팀으로 처리" },
  { value: "90%+", label: "네이티브 성능", sub: "크로스플랫폼 대비" },
  { value: "완벽", label: "LMS 연동", sub: "웹헤즈 솔루션 기반" },
  { value: "4주", label: "평균 개발 기간", sub: "MVP 기준" },
];

export default function AppDevPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="어플리케이션 개발"
        description="웹헤즈 LMS와 완벽 연동되는 iOS·Android 앱 개발. Swift, Kotlin 네이티브 및 React Native, Flutter 크로스플랫폼 개발로 모바일 학습 환경을 구축합니다."
        keywords="이러닝 앱 개발, LMS 앱 개발, iOS 앱, Android 앱, React Native, Flutter, 모바일 학습 앱"
        path="/app-dev"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "웹헤즈 앱 개발",
          "provider": { "@type": "Organization", "name": "웹헤즈" },
          "description": "LMS 완벽 연동 iOS·Android 앱 개발 서비스",
          "areaServed": "KR",
          "serviceType": "모바일 앱 개발",
          "url": "https://webheads-sparkle-landing.lovable.app/app-dev"
        }}
      />
      {/* Hero */}
      <section
        className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden"
        style={{ background: "hsl(210, 50%, 90%)" }}
      >
        <div className="absolute right-0 top-0 h-full w-[55%] pointer-events-none select-none hidden lg:block">
          <img src={heroApp} alt="" fetchPriority="high" className="absolute left-[5%] top-1/2 -translate-y-1/2 w-[60%] object-contain" style={{ mixBlendMode: "multiply", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 55%, transparent 85%)", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 55%, transparent 85%)" }} />
        </div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "#fff", color: "hsl(245, 70%, 45%)", boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}>어플리케이션</span>
            <h1 className="text-4xl lg:text-[3.2rem] font-black leading-tight mb-5 tracking-tight" style={{ color: "hsl(220, 60%, 8%)" }}>
              LMS 완벽 연동부터<br />
              <span style={{ color: "hsl(245, 80%, 55%)" }}>다양한 목적의 앱 개발</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "hsl(220, 20%, 45%)" }}>웹헤즈 이러닝 솔루션과 완벽하게 연동되는 학습 앱은 물론, 커머스·예약·사내 업무 등 목적에 맞는 다양한 모바일 앱을 개발합니다.</p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-85" style={{ background: "hsl(220, 60%, 8%)", color: "#fff" }}>개발 상담 신청</a>
              <a href="#other" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border" style={{ borderColor: "hsl(214, 20%, 85%)", color: "hsl(220, 60%, 8%)", background: "#fff" }}>다양한 앱 보기</a>
            </div>
            <div className="mt-4">
              <LmsBanner />
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

      {/* LMS 연동 앱 */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">LMS 연동 앱</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">웹헤즈 이러닝 솔루션과<br />완벽하게 연동됩니다</h2>
            <p className="text-muted-foreground mt-4 text-base">웹헤즈 LMS를 사용 중이라면 별도 구축 없이 앱에서도 동일한 학습 환경을 즉시 제공할 수 있습니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lmsFeatures.map((f) => (
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

      {/* 다양한 앱 개발 */}
      <section id="other" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">다양한 앱 개발</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">이러닝 외에도<br />다양한 앱을 만들 수 있습니다</h2>
            <p className="text-muted-foreground mt-4 text-base">커머스, 예약, 사내 업무, 커뮤니티 등 목적에 맞는 맞춤형 앱을 iOS·Android 동시에 개발합니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {otherApps.map((a) => (
              <div key={a.title} className="rounded-2xl p-8 bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10 shrink-0">
                    <a.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg tracking-tight">{a.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{a.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {a.tags.map((tag) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dev Stack */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-12">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">개발 기술</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">검증된 기술 스택으로<br />안정적으로 개발합니다</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Smartphone, title: "iOS / Android 네이티브", desc: "Swift(iOS), Kotlin(Android)으로 각 플랫폼 가이드라인을 완벽히 준수하는 네이티브 앱을 개발합니다. 기기 고유 기능과 최고의 성능을 구현합니다.", tags: ["Swift", "Kotlin", "네이티브 UI"] },
              { icon: RefreshCw, title: "하이브리드 / 크로스플랫폼", desc: "React Native·Flutter로 단일 코드베이스에서 iOS·Android를 동시에 개발합니다. 개발 비용과 유지보수 부담을 대폭 절감하면서도 90% 이상의 네이티브 성능을 유지합니다.", tags: ["React Native", "Flutter", "비용 절감"] },
              { icon: Settings2, title: "앱스토어 배포 & 유지관리", desc: "App Store·Google Play 심사 대응부터 배포까지 전 과정을 대행합니다. CI/CD 자동화로 업데이트를 빠르게 반영하고 안정적인 운영을 지속합니다.", tags: ["App Store", "Google Play", "CI/CD"] },
            ].map((f) => (
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

      <ContactSection />
    </div>
  );
}

