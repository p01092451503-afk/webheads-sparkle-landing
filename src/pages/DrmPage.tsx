import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import heroDrm from "@/assets/hero-drm.jpg";
import ContactSection from "@/components/ContactSection";
import { ShieldCheck, Video, Camera, Fingerprint, Globe, MonitorSmartphone, CheckCircle2 } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "카테노이드 DRM", desc: "국내 대표 DRM 솔루션 카테노이드를 통해 스트리밍 콘텐츠를 암호화하여 불법 유출을 원천 차단합니다." },
  { icon: Video, title: "존플레이어 DRM", desc: "존플레이어 기반 DRM으로 HLS/DASH 스트리밍 콘텐츠를 안전하게 보호합니다." },
  { icon: Camera, title: "화면 캡처 방지", desc: "PC, 모바일 환경에서의 화면 캡처, 녹화, 스크린샷을 실시간으로 탐지하고 차단합니다." },
  { icon: Fingerprint, title: "개인 워터마크", desc: "학습자 이름, 아이디, IP 등이 포함된 개인 식별 워터마크를 영상에 삽입합니다." },
  { icon: Globe, title: "다중 플랫폼 지원", desc: "Windows, macOS, iOS, Android 등 모든 주요 플랫폼에서 일관된 DRM 보호를 제공합니다." },
  { icon: MonitorSmartphone, title: "LMS 완벽 연동", desc: "웹헤즈 LMS는 물론 타사 LMS와도 완벽하게 연동되는 DRM 솔루션을 제공합니다." },
];

const solutions = [
  {
    name: "카테노이드 DRM",
    logo: "Catenoid",
    features: ["HLS 스트리밍 암호화", "멀티 DRM (Widevine/FairPlay/PlayReady)", "모바일 앱 DRM", "오프라인 재생 보호"],
    desc: "국내 1위 이러닝 동영상 DRM 솔루션으로 가장 많은 이러닝 플랫폼에서 채택된 검증된 솔루션입니다.",
  },
  {
    name: "존플레이어 DRM",
    logo: "ZonePlayer",
    features: ["영상 스트리밍 암호화", "화면 캡처 방지", "개인 워터마킹", "사용 기기 제한"],
    desc: "강력한 화면 캡처 방지와 워터마크 기능이 특화된 DRM 솔루션으로 기업 보안 환경에 최적화되어 있습니다.",
    highlight: true,
  },
];

export default function DrmPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-section min-h-[70vh] flex items-center pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroDrm})` }}
        />
        <div className="container mx-auto px-4 py-20 relative">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 부가서비스 전체보기
          </Link>
          <div className="max-w-2xl">
            <span className="feature-badge mb-5" style={{ background: "hsl(152 80% 40% / 0.15)", color: "hsl(152 80% 60%)", borderColor: "hsl(152 80% 40% / 0.3)" }}>
              DRM 솔루션
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mt-4 mb-5 leading-tight">
              이러닝 콘텐츠를<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, hsl(152,80%,55%), hsl(192,90%,60%))" }}>
                완벽하게 보호합니다
              </span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl">
              카테노이드, 존플레이어 DRM 솔루션으로 불법 복제와 무단 배포를 원천 차단하고
              소중한 교육 콘텐츠를 안전하게 지키세요.
            </p>
            <div className="flex gap-3">
              <a href="#contact" className="btn-primary px-7 py-3.5 rounded-xl font-semibold">
                DRM 도입 문의
              </a>
              <a href="#solutions" className="px-7 py-3.5 rounded-xl font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors">
                솔루션 비교
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
            <h2 className="text-3xl font-bold mt-4">DRM 솔루션 핵심 기능</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="service-card p-7">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Compare */}
      <section id="solutions" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">솔루션 비교</span>
            <h2 className="text-3xl font-bold mt-4">공급 솔루션 안내</h2>
            <p className="text-muted-foreground mt-3">기관 환경에 맞는 최적의 DRM 솔루션을 추천해 드립니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {solutions.map((sol) => (
              <div
                key={sol.name}
                className={`rounded-2xl p-8 border ${sol.highlight
                  ? "bg-navy-900 border-primary shadow-primary"
                  : "bg-card border-border"
                }`}
              >
                {sol.highlight && <div className="feature-badge mb-3 text-xs">추천</div>}
                <div className={`text-xl font-black mb-2 ${sol.highlight ? "text-white" : ""}`}>{sol.name}</div>
                <p className={`text-sm leading-relaxed mb-5 ${sol.highlight ? "text-white/50" : "text-muted-foreground"}`}>
                  {sol.desc}
                </p>
                <ul className="space-y-2.5">
                  {sol.features.map((feat) => (
                    <li key={feat} className={`flex items-center gap-2 text-sm ${sol.highlight ? "text-white/80" : "text-muted-foreground"}`}>
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${sol.highlight ? "text-brand-cyan" : "text-emerald-500"}`} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`block text-center mt-8 py-3 rounded-xl font-semibold text-sm ${sol.highlight
                    ? "btn-primary"
                    : "border border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-colors"
                  }`}
                >
                  도입 문의
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
