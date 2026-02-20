import heroDrm from "@/assets/hero-drm-toss.png";
import ContactSection from "@/components/ContactSection";
import SEO from "@/components/SEO";
import { ShieldCheck, Video, Camera, Fingerprint, Globe, MonitorSmartphone, Lock, KeyRound, BarChart3 } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "카테노이드 DRM", desc: "국내 1위 이러닝 DRM 솔루션 카테노이드를 통해 HLS/DASH 스트리밍 콘텐츠를 AES-128 암호화로 보호합니다. Widevine, FairPlay, PlayReady 멀티 DRM을 지원하여 모든 브라우저·기기에서 일관된 보호를 제공합니다.", tags: ["AES-128", "Widevine", "FairPlay", "PlayReady"] },
  { icon: Video, title: "존플레이어 DRM", desc: "존플레이어 기반 DRM으로 HLS/DASH 스트리밍 콘텐츠를 세그먼트 단위로 암호화합니다. 강력한 화면 캡처 방지와 개인 워터마크 기능이 특화되어 기업·공공기관 보안 환경에 최적화된 솔루션입니다.", tags: ["HLS/DASH", "세그먼트 암호화", "캡처 방지", "기업 특화"] },
  { icon: Camera, title: "화면 캡처 & 녹화 방지", desc: "Windows, macOS, iOS, Android 전 플랫폼에서 OBS, 캡처 툴, 스크린 레코더를 실시간으로 탐지하고 즉시 재생을 중단합니다. 외부 캡처 장치(HDMI 캡처 카드) 연결 시에도 영상 출력을 자동 차단합니다.", tags: ["OBS 차단", "실시간 탐지", "HDMI 차단", "전 플랫폼"] },
  { icon: Fingerprint, title: "개인 식별 워터마크", desc: "학습자의 이름, 아이디, IP 주소, 수강 일시 등 고유 식별 정보를 비가시적(Invisible) 또는 가시적(Visible) 워터마크로 영상에 실시간 삽입합니다. 유출 영상 발견 시 유출자를 정확히 추적·식별할 수 있습니다.", tags: ["비가시 워터마크", "실시간 삽입", "유출자 추적", "IP 기록"] },
  { icon: Globe, title: "멀티플랫폼 & 멀티브라우저 지원", desc: "Windows, macOS, Linux, iOS, Android 전 OS와 Chrome, Firefox, Safari, Edge 주요 브라우저에서 플러그인 없이 동작합니다. 웹 표준 기반 EME(Encrypted Media Extensions)를 활용하여 설치 없이 DRM이 적용됩니다.", tags: ["EME 표준", "플러그인 불필요", "전 OS 지원", "전 브라우저"] },
  { icon: MonitorSmartphone, title: "LMS 완벽 API 연동", desc: "웹헤즈 LMS는 물론 타사 LMS(Moodle, Blackboard 등)와도 REST API로 완벽 연동됩니다. 수강 권한, 기기 제한, 재생 만료일 등 접근 정책을 LMS에서 실시간으로 제어하고 위반 로그를 자동 수집합니다.", tags: ["REST API", "Moodle 연동", "권한 제어", "위반 로그"] },
  { icon: KeyRound, title: "기기 등록 & 동시 접속 제한", desc: "학습자 계정당 사용 가능한 기기 수를 설정하고, 초과 기기에서의 재생을 자동 차단합니다. 동시 스트리밍 세션 수를 제한하여 계정 공유와 불법 유통을 원천적으로 방지합니다.", tags: ["기기 등록 제한", "동시 접속 차단", "계정 공유 방지", "세션 관리"] },
  { icon: Lock, title: "오프라인 재생 보호", desc: "오프라인 학습을 위한 콘텐츠 다운로드 시 로컬 디바이스에서도 DRM 암호화가 유지됩니다. 재생 만료일, 재생 횟수 제한을 설정하고, 기기 교체 시 라이선스를 자동 만료시켜 유출을 방지합니다.", tags: ["오프라인 DRM", "재생 만료", "횟수 제한", "라이선스 관리"] },
  { icon: BarChart3, title: "보안 위협 탐지 & 모니터링", desc: "비정상 재생 패턴, 반복 라이선스 오류, 해외 IP 접속 등 보안 위협을 실시간으로 탐지합니다. 관리자 대시보드에서 재생 로그, 차단 이력, 위협 현황을 한눈에 파악하고 즉각 대응할 수 있습니다.", tags: ["실시간 탐지", "이상 패턴 감지", "관리자 대시보드", "차단 이력"] },
];

const solutions = [
  { name: "카테노이드 DRM", logo: "Catenoid", desc: "국내 1위 이러닝 동영상 DRM 솔루션으로 가장 많은 이러닝 플랫폼에서 채택된 검증된 솔루션입니다. 대규모 트래픽에도 안정적인 CDN 기반 스트리밍 인프라를 함께 제공합니다.", features: ["HLS/DASH 스트리밍 암호화", "멀티 DRM (Widevine/FairPlay/PlayReady)", "모바일 앱 SDK 지원", "오프라인 재생 보호", "CDN 연계 스트리밍", "상세 재생 통계 제공"] },
  { name: "존플레이어 DRM", logo: "ZonePlayer", desc: "강력한 화면 캡처 방지와 워터마크 기능이 특화된 DRM 솔루션으로 기업·공공기관 보안 환경에 최적화되어 있습니다. 플러그인 없이 웹 표준만으로 구동되어 사용자 편의성이 높습니다.", features: ["영상 스트리밍 암호화", "실시간 화면 캡처 방지", "비가시 개인 워터마킹", "기기·동시 접속 제한", "플러그인 불필요 (EME)", "보안 위협 관리자 알림"], highlight: true },
];

const stats = [
  { value: "100%", label: "불법 캡처 차단", sub: "전 플랫폼 대응" },
  { value: "멀티", label: "DRM 표준 지원", sub: "Widevine·FairPlay·PlayReady" },
  { value: "EME", label: "웹 표준 적용", sub: "플러그인 불필요" },
  { value: "즉시", label: "유출자 추적", sub: "워터마크 기반" },
];

export default function DrmPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="DRM 솔루션"
        description="Widevine, FairPlay, PlayReady 멀티 DRM으로 이러닝 동영상을 완벽하게 보호합니다. 화면 캡처 방지, 개인 식별 워터마크, 카테노이드·존플레이어 DRM 연동."
        keywords="DRM, 이러닝 DRM, 동영상 보안, Widevine, FairPlay, 카테노이드, 존플레이어, 화면 캡처 방지"
        path="/drm"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "웹헤즈 DRM 솔루션",
          "provider": { "@type": "Organization", "name": "웹헤즈" },
          "description": "이러닝 동영상 DRM 보안 솔루션. 카테노이드·존플레이어 연동, 화면 캡처 방지.",
          "areaServed": "KR",
          "serviceType": "DRM 보안",
          "url": "https://webheads-sparkle-landing.lovable.app/drm"
        }}
      />
      {/* Hero */}
      <section
        className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden"
        style={{ background: "hsl(210, 50%, 90%)" }}
      >
        <div className="absolute right-0 top-0 h-full w-[55%] pointer-events-none select-none hidden lg:block">
          <img src={heroDrm} alt="" fetchPriority="high" className="absolute left-[5%] top-1/2 -translate-y-1/2 w-[65%] object-contain animate-float" style={{ filter: "drop-shadow(0 30px 60px rgba(30,60,140,0.20)) drop-shadow(0 8px 20px rgba(30,60,140,0.12))" }} />
        </div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "#fff", color: "hsl(152, 70%, 30%)", boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}>DRM</span>
            <h1 className="text-4xl lg:text-[3.2rem] font-black leading-tight mb-5 tracking-tight" style={{ color: "hsl(220, 60%, 8%)" }}>
              이러닝 콘텐츠를<br />
              <span style={{ color: "hsl(152, 80%, 38%)" }}>완벽하게 보호합니다</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "hsl(220, 20%, 45%)" }}>카테노이드, 존플레이어 DRM 솔루션으로 불법 복제와 무단 배포를 원천 차단하고 소중한 교육 콘텐츠를 안전하게 지키세요.</p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-85" style={{ background: "hsl(220, 60%, 8%)", color: "#fff" }}>DRM 도입 문의</a>
              <a href="#solutions" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border" style={{ borderColor: "hsl(214, 20%, 85%)", color: "hsl(220, 60%, 8%)", background: "#fff" }}>솔루션 비교</a>
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
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">콘텐츠 보안의<br />모든 것을 제공합니다</h2>
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

      {/* Solutions */}
      <section id="solutions" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">솔루션 비교</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">공급 솔루션 안내</h2>
            <p className="text-muted-foreground mt-4 text-base">기관 환경에 맞는 최적의 DRM 솔루션을 추천해 드립니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
            {solutions.map((sol) => (
              <div key={sol.name} className={`relative rounded-3xl p-8 flex flex-col gap-5 transition-all duration-200 ${sol.highlight ? "bg-foreground text-primary-foreground shadow-2xl scale-[1.02]" : "bg-background border border-border hover:border-muted-foreground/30 hover:shadow-md"}`}>
                {sol.highlight && <span className="absolute top-6 right-6 text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white/80">추천</span>}
                <div>
                  <h3 className={`font-black leading-none text-3xl tracking-tight ${sol.highlight ? "text-white" : "text-foreground"}`}>{sol.name}</h3>
                  <p className={`text-sm mt-2 leading-relaxed ${sol.highlight ? "text-white/50" : "text-muted-foreground"}`}>{sol.desc}</p>
                </div>
                <div className={`h-px ${sol.highlight ? "bg-white/10" : "bg-border"}`} />
                <ul className="flex flex-col gap-3 flex-1">
                  {sol.features.map((feat) => (
                    <li key={feat} className={`flex items-center gap-2.5 text-sm ${sol.highlight ? "text-white/70" : "text-muted-foreground"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sol.highlight ? "bg-white/50" : "bg-primary"}`} />{feat}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={`block text-center py-3.5 rounded-2xl font-bold text-sm transition-all duration-150 ${sol.highlight ? "bg-background text-foreground hover:bg-secondary" : "bg-foreground text-primary-foreground hover:opacity-85"}`}>도입 문의</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
