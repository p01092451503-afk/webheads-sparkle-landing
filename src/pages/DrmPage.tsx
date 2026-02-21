import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";
import SEO from "@/components/SEO";
import DrmHeroVisual from "@/components/visuals/DrmHeroVisual";
import ServiceMidCTA from "@/components/shared/ServiceMidCTA";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import { ShieldCheck, Video, Camera, Fingerprint, Globe, MonitorSmartphone, Lock, KeyRound, BarChart3 } from "lucide-react";

const testimonials = [
  { name: "임현우", role: "콘텐츠 보안 담당", org: "G 온라인교육기업", rating: 5, date: "2024.08", period: "이용 6년차", content: "DRM 걸기 전에는 유출 영상이 계속 나돌았는데, 적용하고 나서는 진짜 하나도 안 나와요. 워터마크로 누가 유출했는지 바로 특정도 되고요." },
  { name: "조은비", role: "운영 디렉터", org: "H 사이버대학교", rating: 3, date: "2024.11", period: "이용 2년차", content: "학습자분들이 예전에는 플러그인 설치하라고 하면 불만이 많았는데, 지금은 그냥 브라우저에서 바로 재생돼서 민원이 거의 없어졌어요." },
  { name: "서준호", role: "보안 팀장", org: "I 금융연수원", rating: 4, date: "2025.01", period: "이용 4년차", content: "금융권이라 보안 감사가 까다로운데, DRM 적용 현황 자료를 대시보드에서 바로 뽑을 수 있어서 감사 대응이 한결 수월해졌습니다." },
];

const features = [
  { icon: ShieldCheck, title: "카테노이드 DRM", desc: "국내 1위 이러닝 DRM 솔루션 카테노이드를 통해 HLS/DASH 스트리밍 콘텐츠를 AES-128 암호화로 보호합니다. Widevine, FairPlay, PlayReady 멀티 DRM을 지원합니다.", tags: ["AES-128", "Widevine", "FairPlay", "PlayReady"] },
  { icon: Video, title: "존플레이어 DRM", desc: "존플레이어 기반 DRM으로 HLS/DASH 스트리밍 콘텐츠를 세그먼트 단위로 암호화합니다. 강력한 화면 캡처 방지와 개인 워터마크 기능이 특화되어 있습니다.", tags: ["HLS/DASH", "세그먼트 암호화", "캡처 방지", "기업 특화"] },
  { icon: Camera, title: "화면 캡처 & 녹화 방지", desc: "Windows, macOS, iOS, Android 전 플랫폼에서 OBS, 캡처 툴, 스크린 레코더를 실시간으로 탐지하고 즉시 재생을 중단합니다.", tags: ["OBS 차단", "실시간 탐지", "HDMI 차단", "전 플랫폼"] },
  { icon: Fingerprint, title: "개인 식별 워터마크", desc: "학습자의 이름, 아이디, IP 주소, 수강 일시 등 고유 식별 정보를 비가시적 또는 가시적 워터마크로 영상에 실시간 삽입합니다.", tags: ["비가시 워터마크", "실시간 삽입", "유출자 추적", "IP 기록"] },
  { icon: Globe, title: "멀티플랫폼 & 멀티브라우저 지원", desc: "Windows, macOS, Linux, iOS, Android 전 OS와 Chrome, Firefox, Safari, Edge에서 플러그인 없이 동작합니다.", tags: ["EME 표준", "플러그인 불필요", "전 OS 지원", "전 브라우저"] },
  { icon: MonitorSmartphone, title: "LMS 완벽 API 연동", desc: "웹헤즈 LMS는 물론 타사 LMS와도 REST API로 완벽 연동됩니다. 수강 권한, 기기 제한, 재생 만료일 등 접근 정책을 실시간 제어합니다.", tags: ["REST API", "Moodle 연동", "권한 제어", "위반 로그"] },
  { icon: KeyRound, title: "기기 등록 & 동시 접속 제한", desc: "학습자 계정당 사용 가능한 기기 수를 설정하고, 초과 기기에서의 재생을 자동 차단합니다.", tags: ["기기 등록 제한", "동시 접속 차단", "계정 공유 방지", "세션 관리"] },
  { icon: Lock, title: "오프라인 재생 보호", desc: "오프라인 학습을 위한 콘텐츠 다운로드 시 로컬 디바이스에서도 DRM 암호화가 유지됩니다.", tags: ["오프라인 DRM", "재생 만료", "횟수 제한", "라이선스 관리"] },
  { icon: BarChart3, title: "보안 위협 탐지 & 모니터링", desc: "비정상 재생 패턴, 반복 라이선스 오류, 해외 IP 접속 등 보안 위협을 실시간으로 탐지합니다.", tags: ["실시간 탐지", "이상 패턴 감지", "관리자 대시보드", "차단 이력"] },
];

const solutions = [
  { name: "카테노이드 DRM", logo: "Catenoid", desc: "콜러스(Kollus) 플레이어 기반 5단계 콘텐츠 보안 체계로 이러닝 업계 압도적 점유율을 보유한 국내 대표 DRM 솔루션입니다.", features: ["5단계 보안 (OTU 인증·중복재생 차단·Multi-DRM·Kollus DRM·녹화툴 차단)", "오디오 & 비디오 워터마킹 (국내 최초)", "전용 플레이어 + HTML5 + 모바일 SDK", "오프라인 Download & Play 지원", "AI 배속 재생 (Android/iOS)", "플레이어 스킨 커스터마이징 API"] },
  { name: "존플레이어 DRM", logo: "ZonePlayer", desc: "Pre-Packaging 및 실시간 암호화 방식을 모두 제공하며, EBS 등 대형 서비스에 적용되어 안정성을 검증받은 DRM 솔루션입니다.", features: ["실시간 암호화 & 사용자별 개별 암호화", "보안 서버 경유 암호화 전송 (원본 보호)", "녹화툴 탐지 & 패킷캡처 차단 (zone@GUARD)", "동시 접속 방지 & 기기 제한", "가상 드라이브 기반 (Linux/Windows 서버)", "다운로드 모니터링 & 운영 화면 제공"] },
];

const stats = [
  { value: "100%", label: "불법 캡처 차단", sub: "전 플랫폼 대응" },
  { value: "멀티", label: "DRM 표준 지원", sub: "Widevine·FairPlay·PlayReady" },
  { value: "EME", label: "웹 표준 적용", sub: "플러그인 불필요" },
  { value: "즉시", label: "유출자 추적", sub: "워터마크 기반" },
];

const faqs = [
  { q: "DRM을 적용하면 학습자가 별도 프로그램을 설치해야 하나요?", a: "아닙니다. EME(Encrypted Media Extensions) 웹 표준 기반으로 동작하므로 별도 플러그인이나 프로그램 설치 없이 브라우저에서 바로 재생됩니다." },
  { q: "카테노이드와 존플레이어 중 어떤 솔루션이 적합한가요?", a: "대규모 트래픽과 CDN 연계가 중요하다면 카테노이드, 화면 캡처 방지와 워터마크가 중요하다면 존플레이어를 추천합니다. 상담 시 기관 환경에 맞는 솔루션을 안내드립니다." },
  { q: "기존 LMS에 DRM을 추가 적용할 수 있나요?", a: "네, REST API 기반으로 웹헤즈 LMS는 물론 타사 LMS(Moodle, Blackboard 등)에도 연동 가능합니다. 기존 콘텐츠에 DRM을 일괄 적용하는 마이그레이션도 지원합니다." },
  { q: "모바일 앱에서도 DRM이 동작하나요?", a: "네, iOS(FairPlay)와 Android(Widevine) 전용 SDK를 제공하며, 모바일 앱에서도 동일한 수준의 콘텐츠 보호가 적용됩니다." },
  { q: "DRM 적용 후 영상 재생 속도에 영향이 있나요?", a: "체감할 수 없는 수준입니다. 하드웨어 가속 복호화를 사용하므로 일반 재생과 동일한 품질과 속도를 유지합니다." },
];

export default function DrmPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="DRM 솔루션" description="Widevine, FairPlay, PlayReady 멀티 DRM으로 이러닝 동영상을 완벽하게 보호합니다." keywords="DRM, 이러닝 DRM, 동영상 보안, Widevine, FairPlay, 카테노이드, 존플레이어" path="/drm" jsonLd={{ "@context": "https://schema.org", "@type": "Service", "name": "웹헤즈 DRM 솔루션", "provider": { "@type": "Organization", "name": "웹헤즈" }, "description": "이러닝 동영상 DRM 보안 솔루션", "areaServed": "KR", "serviceType": "DRM 보안", "url": "https://webheads-sparkle-landing.lovable.app/drm" }} />

      {/* Hero */}
      <section className="relative min-h-[76vh] flex items-center pt-20 pb-14 overflow-hidden" style={{ background: "linear-gradient(160deg, hsl(210, 50%, 92%) 0%, hsl(214, 60%, 88%) 40%, hsl(220, 50%, 85%) 100%)" }}>
        <div className="absolute pointer-events-none" style={{ width: "120%", height: "120%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse 60% 50% at 65% 45%, hsla(152, 80%, 60%, 0.18) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none" style={{ width: "80%", height: "80%", bottom: "-10%", left: "-5%", background: "radial-gradient(ellipse 50% 60% at 30% 70%, hsla(152, 60%, 60%, 0.1) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center" style={{ opacity: 0.85 }}>
          <div className="relative w-full h-full max-w-[900px] mx-auto hidden lg:flex items-center justify-center" style={{ transform: "translateX(40%)" }}><DrmHeroVisual /></div>
        </div>
        <div className="container mx-auto px-6 py-24 relative z-10 lg:pl-[10%]">
          <div className="max-w-xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "hsla(0, 0%, 100%, 0.85)", backdropFilter: "blur(8px)", color: "hsl(152, 70%, 30%)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>DRM</span>
            <h1 className="text-4xl lg:text-[3.2rem] font-black leading-tight mb-5 tracking-tight" style={{ color: "hsl(220, 60%, 8%)" }}>이러닝 콘텐츠를<br /><span style={{ color: "hsl(152, 80%, 38%)" }}>완벽하게 보호합니다</span></h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "hsl(220, 20%, 40%)", textShadow: "0 1px 2px hsla(0, 0%, 100%, 0.6)" }}>카테노이드, 존플레이어 DRM 솔루션으로 불법 복제와 무단 배포를 원천 차단하고 소중한 교육 콘텐츠를 안전하게 지키세요.</p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-85" style={{ background: "hsl(220, 60%, 8%)", color: "#fff" }}>DRM 도입 문의</a>
              <a href="#solutions" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border" style={{ borderColor: "hsl(214, 20%, 85%)", color: "hsl(220, 60%, 8%)", background: "hsla(0, 0%, 100%, 0.8)", backdropFilter: "blur(8px)" }}>솔루션 비교</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {stats.map((s) => (<div key={s.label} className="flex flex-col items-center justify-center py-8 px-4 text-center"><span className="block font-black leading-none mb-2 text-4xl md:text-5xl text-foreground tracking-tight">{s.value}</span><span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span><span className="block text-xs text-muted-foreground">{s.sub}</span></div>))}
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
            {features.map((f) => (<div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm"><f.icon className="w-5 h-5 text-primary" /></div><h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3><p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p><div className="flex flex-wrap gap-1.5 mt-1">{f.tags.map((tag) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}</div></div>))}
          </div>
        </div>
      </section>

      <ServiceMidCTA heading="우리 콘텐츠에 맞는 DRM 솔루션이 궁금하신가요?" description="기관 환경을 분석하고, 최적의 DRM 솔루션을 무료로 제안드립니다." ctaText="DRM 도입 문의하기" />

      {/* Solutions */}
      <section id="solutions" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">솔루션 비교</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">공급 솔루션 안내</h2>
            <p className="text-muted-foreground mt-4 text-base">기관 환경에 맞는 최적의 DRM 솔루션을 추천해 드립니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
            {solutions.map((sol) => (<div key={sol.name} className="relative rounded-3xl p-8 flex flex-col gap-5 transition-all duration-200 bg-background border border-border hover:border-muted-foreground/30 hover:shadow-md"><div><h3 className="font-black leading-none text-3xl tracking-tight text-foreground">{sol.name}</h3><p className="text-sm mt-2 leading-relaxed text-muted-foreground">{sol.desc}</p></div><div className="h-px bg-border" /><ul className="flex flex-col gap-3 flex-1">{sol.features.map((feat) => (<li key={feat} className="flex items-center gap-2.5 text-sm text-muted-foreground"><span className="w-1.5 h-1.5 rounded-full shrink-0 bg-primary" />{feat}</li>))}</ul><a href="#contact" className="block text-center py-3.5 rounded-2xl font-bold text-sm transition-all duration-150 bg-foreground text-primary-foreground hover:opacity-85">도입 문의</a></div>))}
          </div>
        </div>
      </section>

      <ServiceFAQ faqs={faqs} serviceName="DRM 솔루션" />
      <TestimonialSection testimonials={testimonials} />
      <ContactSection />
    </div>
  );
}
