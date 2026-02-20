import heroChannel from "@/assets/hero-channel-toss.png";
import ContactSection from "@/components/ContactSection";
import SEO from "@/components/SEO";
import { MessageCircle, Smartphone, Bell, UserCheck, BarChart3, Settings, CheckCircle2 } from "lucide-react";

const features = [
  { icon: MessageCircle, title: "채널톡 LMS 연동", desc: "채널톡(Channel.io) Open API를 활용하여 LMS 학습자 계정과 1:1 매핑, 수강 현황·진도율 등 학습 컨텍스트를 상담 화면에 실시간으로 노출합니다. 상담사가 별도 시스템 전환 없이 학습 데이터를 즉시 확인하며 신속하게 응대합니다.", tags: ["Channel.io API", "LMS 연동", "실시간 상담", "컨텍스트 공유"] },
  { icon: Smartphone, title: "SMS / LMS 대량 발송", desc: "KISA 인증 SMS 발송 게이트웨이를 통해 장문(LMS), 단문(SMS), MMS(이미지 포함) 메시지를 대량으로 발송합니다. 수신 거부 자동 처리, 발송 실패 재시도, 080 무료수신거부 번호 연동을 기본 제공합니다.", tags: ["SMS/LMS/MMS", "대량 발송", "수신거부 처리", "080 무료수신"] },
  { icon: Bell, title: "학습 독려 자동화 메시지", desc: "학습 진도율 임계값(예: 50% 미만), 잔여 수강 기간, 미접속 일수 등 다양한 조건을 설정하여 학습자에게 자동으로 독려 SMS와 채팅 메시지를 발송합니다. 조건별 메시지 템플릿 및 발송 스케줄을 별도 구성할 수 있습니다.", tags: ["조건 기반 발송", "진도율 연동", "발송 스케줄", "메시지 템플릿"] },
  { icon: UserCheck, title: "CRM 세그먼트 연동", desc: "LMS의 학습자 속성(부서, 직급, 과정, 수료 여부 등)을 기반으로 세그먼트를 동적으로 구성하고, 세그먼트별 맞춤 메시지를 발송합니다. 외부 CRM(Salesforce, HubSpot 등)과의 REST API 연동도 지원합니다.", tags: ["동적 세그먼트", "속성 기반 타겟팅", "REST API", "외부 CRM 연동"] },
  { icon: BarChart3, title: "발송 통계 및 성과 분석", desc: "메시지 발송 수, 도달율, 열람율, URL 클릭율, 수신 거부율 등 채널별 상세 통계를 대시보드로 제공합니다. 독려 메시지 발송 전후 학습 완료율 변화를 분석하여 커뮤니케이션 ROI를 측정합니다.", tags: ["발송 통계", "열람율 추적", "URL 클릭 분석", "ROI 측정"] },
  { icon: Settings, title: "이벤트 기반 자동화 시나리오", desc: "수강 신청, 첫 로그인, 중간 진도 도달, 학습 완료, 수료증 발급 등 LMS 이벤트를 트리거로 메시지 발송 시나리오를 설정합니다. 다단계 자동화 플로우(예: 3일 후 미접속 시 재발송)를 노코드 방식으로 구성합니다.", tags: ["이벤트 트리거", "다단계 플로우", "노코드 설정", "LMS Webhook"] },
  { icon: CheckCircle2, title: "카카오 알림톡 / 친구톡 발송", desc: "카카오 비즈메시지 API를 통해 알림톡(정보성)과 친구톡(광고성) 메시지를 발송합니다. SMS 대비 최대 70% 비용을 절감하며, 버튼(URL 연결, 앱 이동 등)이 포함된 리치 메시지 형식을 지원합니다.", tags: ["알림톡", "친구톡", "카카오 비즈메시지", "리치 메시지"] },
  { icon: MessageCircle, title: "개인정보 보호 및 수신 동의 관리", desc: "정보통신망법 및 개인정보보호법에 따라 수신 동의 여부를 LMS 회원가입 단계에서 수집·저장하고, 수신 거부 요청 시 즉시 발송 대상에서 제외합니다. 수신 동의 이력 및 거부 내역을 관리자 페이지에서 조회·관리합니다.", tags: ["수신 동의 관리", "개인정보보호법", "수신거부 처리", "감사 로그"] },
  { icon: Bell, title: "Push 알림 및 이메일 통합 발송", desc: "SMS·채널톡 채팅 외에도 모바일 앱 Push 알림(FCM/APNS)과 HTML 이메일을 동일한 자동화 시나리오 내에서 통합 발송합니다. 채널별 발송 우선순위와 Fallback 정책(예: Push 실패 시 SMS 발송)을 설정할 수 있습니다.", tags: ["Push 알림", "FCM/APNS", "이메일 발송", "Fallback 정책"] },
];

const useCases = [
  { title: "수강 안내 발송", desc: "신규 수강생 등록 시 자동으로 LMS 접속 URL, ID/PW 안내, 학습 일정 및 OT 영상 링크를 포함한 SMS를 즉시 발송합니다." },
  { title: "학습 독려 알림", desc: "학습 진도율이 설정 기준(예: 50%) 이하이거나 미접속 기간이 3일 이상인 학습자를 자동 식별하여 단계별 독려 메시지를 발송합니다." },
  { title: "수료 축하 메시지", desc: "과정 수료 즉시 축하 메시지와 전자 수료증 다운로드 링크를 자동 발송하며, 후속 과정 추천 및 재수강 유도 메시지를 연계 발송합니다." },
  { title: "실시간 채팅 상담", desc: "채널톡 상담 화면에서 학습자의 수강 현황, 진도율, 수료 여부를 실시간으로 확인하며 응대합니다. 운영시간 외에는 챗봇이 FAQ를 자동 응답합니다." },
  { title: "공지사항 일괄 발송", desc: "시스템 점검, 과정 일정 변경, 법정 의무 교육 안내 등 중요 공지를 전체 학습자 또는 특정 과정·부서 단위 그룹에 SMS/카카오 알림톡으로 일괄 발송합니다." },
  { title: "만족도 조사 링크 발송", desc: "과정 종료 후 설정된 시점에 자동으로 학습 만족도 조사 링크를 SMS로 발송합니다. 설문 미응답자에게 리마인더를 재발송하고 응답 데이터를 LMS 리포트와 연동합니다." },
  { title: "의무교육 대상자 관리", desc: "연간 법정 의무교육(개인정보보호, 성희롱 예방 등) 대상자를 자동 추출하고, 미이수자에게 단계별 안내 SMS를 발송합니다. 이수율 현황을 실시간 대시보드로 제공합니다." },
  { title: "이수증 만료 사전 안내", desc: "자격증, 의무교육 이수증 만료 예정일을 기준으로 30일·7일·1일 전에 자동으로 갱신 안내 SMS를 발송합니다. 만료 후 미갱신자는 자동으로 수강 신청 페이지 링크를 재발송합니다." },
  { title: "개강 전 리마인더 발송", desc: "집합 교육, 실시간 웨비나, 온라인 시험 등 특정 일시에 진행되는 이벤트 1일 전·1시간 전에 참가자 전원에게 자동으로 접속 링크와 준비사항이 담긴 알림 메시지를 발송합니다." },
];

const stats = [
  { value: "98%", label: "SMS 도달률", sub: "안정적인 메시지 전송" },
  { value: "40%↑", label: "학습 완료율 향상", sub: "독려 메시지 효과" },
  { value: "즉시", label: "LMS 연동", sub: "빠른 서비스 적용" },
];

export default function ChannelPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="채널톡/SMS"
        description="채널톡 LMS 연동, SMS/LMS 대량 발송, 학습 독려 자동화 메시지로 학습자 참여율을 높입니다. 카카오 알림톡, CRM 세그먼트 연동 지원."
        keywords="채널톡, SMS 발송, 이러닝 알림, 학습 독려, LMS 채널톡, 카카오 알림톡, 대량 문자 발송"
        path="/channel"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "웹헤즈 채널톡/SMS",
          "provider": { "@type": "Organization", "name": "웹헤즈" },
          "description": "채널톡 LMS 연동 및 SMS 대량 발송, 학습 독려 자동화 서비스",
          "areaServed": "KR",
          "serviceType": "채널톡/SMS 연동",
          "url": "https://webheads-sparkle-landing.lovable.app/channel"
        }}
      />
      {/* Hero */}
      <section
        className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden"
        style={{ background: "hsl(210, 50%, 90%)" }}
      >
        <div className="absolute right-0 top-0 h-full w-[55%] pointer-events-none select-none hidden lg:block">
          <img src={heroChannel} alt="" fetchPriority="high" className="absolute left-[5%] top-1/2 -translate-y-1/2 w-[65%] object-contain animate-float" style={{ filter: "drop-shadow(0 30px 60px rgba(30,60,140,0.20)) drop-shadow(0 8px 20px rgba(30,60,140,0.12))" }} />
        </div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "#fff", color: "hsl(40, 80%, 35%)", boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}>채널톡/SMS</span>
            <h1 className="text-4xl lg:text-[3.2rem] font-black leading-tight mb-5 tracking-tight" style={{ color: "hsl(220, 60%, 8%)" }}>
              학습자와의 소통을<br />
              <span style={{ color: "hsl(40, 90%, 42%)" }}>자동화로 효율화</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "hsl(220, 20%, 45%)" }}>채널톡과 SMS를 LMS와 연동하여 학습 독려부터 수료 안내까지 학습자와의 모든 커뮤니케이션을 자동화하세요.</p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-85" style={{ background: "hsl(220, 60%, 8%)", color: "#fff" }}>도입 상담 신청</a>
              <a href="#cases" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border" style={{ borderColor: "hsl(214, 20%, 85%)", color: "hsl(220, 60%, 8%)", background: "#fff" }}>활용 사례 보기</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-3 gap-0 divide-x divide-border">
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
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">LMS 연동 기반<br />자동화 메시지 발송</h2>
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

      {/* Use Cases */}
      <section id="usecases" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">활용 사례</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">이런 상황에<br />활용하세요</h2>
            <p className="text-muted-foreground mt-4 text-base">학습 여정의 모든 단계에서 자동화된 커뮤니케이션으로 학습자 경험을 향상시킵니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {useCases.map((uc, i) => (
              <div key={uc.title} className="flex items-start gap-4 p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-sm transition-all">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-primary-foreground font-bold text-xs bg-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm mb-1 tracking-tight">{uc.title}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{uc.desc}</p>
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
