import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, TrendingUp, Shield, Clock, Headphones, Zap, Award, Server, ShieldCheck, HardDrive, Users, GraduationCap, Globe, Star, ArrowRight, FileText } from "lucide-react";

interface SimulationData {
  planName: string;
  solutionType: string;
  monthlyPrice: number;
  basePrice: number;
  cdnIncluded: number;
  storageIncluded: number;
  overageCdn: number;
  overageStorage: number;
  learners: number;
  storageInput: number;
  completionRate: number;
  needsCdn: boolean;
  needsSecurePlayer: boolean;
  needsDedicatedServer: boolean;
  isAnnual: boolean;
  cdnGB: number;
  storageGB: number;
  savingsAmount: number;
  companyName?: string;
}

const PLAN_BASE_PRICES: Record<string, number> = {
  Starter: 300000, Basic: 500000, Plus: 700000, Premium: 1000000,
};

const SimulationProposal = forwardRef<HTMLDivElement, { data: SimulationData }>(({ data }, ref) => {
  const { t } = useTranslation();
  const fmt = (n: number) => n.toLocaleString("ko-KR");
  const today = new Date();
  const dateStr = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}.`;

  const PLAN_FEATURES: Record<string, { highlights: string[]; addons: string[]; support: string }> = {
    Starter: {
      highlights: ["자체 브랜딩 LMS 구축", "YouTube/Vimeo 영상 연동", "수강생·과정 관리 기본 기능", "모바일 반응형 지원", "PG(결제) 연동 지원"],
      addons: ["AI 챗봇 학습 도우미"],
      support: "이메일 지원 (영업일 기준 24시간 이내 응답)"
    },
    Basic: {
      highlights: ["전용 CDN 영상 호스팅 (500GB/월)", "저장공간 100GB 기본 제공", "자체 브랜딩 LMS 구축", "AI 챗봇 학습 도우미 포함", "PG(결제) 연동 지원", "수강 통계·리포트 대시보드"],
      addons: ["보안 플레이어(DRM) - 월 300,000원", "채널톡/SMS 통합 - 옵션"],
      support: "이메일·전화 지원 / SLA 99.5% 보장"
    },
    Plus: {
      highlights: ["전용 CDN 영상 호스팅 (1,500GB/월)", "저장공간 200GB 기본 제공", "모바일 앱 (iOS/Android) 제공", "AI 챗봇 학습 도우미 포함", "전담 매니저 배정", "채널톡/SMS 통합 기본 포함", "SaaS 또는 단독서버 선택 가능"],
      addons: ["보안 플레이어(DRM) - 월 300,000원", "단독서버(WEB) - 월 250,000원"],
      support: "전담 매니저 배정 / SLA 99.9% 보장"
    },
    Premium: {
      highlights: ["전용 CDN 영상 호스팅 (2,000GB/월)", "저장공간 250GB 기본 제공", "모바일 앱 (iOS/Android) 제공", "DRM 보안 플레이어 기본 포함", "24/7 전담 매니저 배정", "채널톡/SMS 통합 기본 포함", "SaaS 또는 단독서버 선택 가능", "맞춤 기능 개발 우선 지원"],
      addons: ["단독서버(WEB) - 월 250,000원", "커스텀 API 연동 - 별도 협의"],
      support: "24/7 전담 매니저 / SLA 99.99% 보장"
    }
  };

  const planInfo = PLAN_FEATURES[data.planName] || PLAN_FEATURES.Basic;

  const roadmapSteps = [
    { week: "1주차", title: "기획·설계", desc: "요구사항 분석, 사이트맵 설계, 브랜딩 시안 제작" },
    { week: "1~2주차", title: "구축·세팅", desc: "LMS 셋업, 디자인 적용, 관리자 교육" },
    { week: "2주차", title: "테스트·오픈", desc: "QA 테스트, 콘텐츠 업로드 지원, 정식 오픈" },
    { week: "오픈 후", title: "운영·최적화", desc: "24시간 모니터링, 월간 리포트, 지속 개선" },
  ];

  const planBasePrice = PLAN_BASE_PRICES[data.planName] || data.basePrice;

  const costBreakdown: { label: string; amount: number }[] = [
    { label: `${data.planName} 플랜 기본 요금`, amount: planBasePrice },
  ];

  const discount = data.isAnnual ? Math.round(planBasePrice * 0.1) : 0;

  return (
    <div ref={ref} className="bg-white text-gray-900" style={{ fontFamily: "'Pretendard Variable', 'Noto Sans KR', sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div className="px-8 pt-10 pb-6" style={{ background: "linear-gradient(135deg, #5D45FF, #7c68ff)", color: "white" }}>
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-extrabold italic tracking-tight" style={{ color: "white" }}>WEBHEADS.</span>
          <span className="text-xs opacity-60">{dateStr}</span>
        </div>
        <h1 className="text-2xl font-extrabold mb-2 tracking-tight">LMS 맞춤 견적서 & 성공 로드맵</h1>
        <p className="text-sm opacity-70">
          {data.companyName ? `${data.companyName} 귀중` : "귀사"}의 교육 환경에 최적화된 플랜을 제안드립니다.
        </p>
      </div>

      {/* Executive Summary */}
      <div className="px-8 py-6 border-b border-gray-100">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full" style={{ background: "#5D45FF" }} />
          추천 플랜 요약
        </h2>
        <div className="rounded-xl p-5" style={{ background: "#F8F7FF", border: "1px solid #E8E5FF" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#5D45FF" }}>추천</span>
              <span className="text-xl font-extrabold ml-2">{data.planName}</span>
              <span className="text-sm text-gray-500 ml-2">{data.solutionType}</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold tabular-nums" style={{ color: "#5D45FF" }}>{fmt(data.basePrice)}<span className="text-sm font-bold">원/월</span></p>
              {data.isAnnual && <p className="text-xs text-gray-400">연간 계약 10% 할인 적용 시 {fmt(Math.round(data.basePrice * 0.9))}원/월</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="rounded-lg p-3 bg-white">
              <Users className="w-4 h-4 mx-auto mb-1 text-gray-400" />
              <p className="text-xs text-gray-500">수강생</p>
              <p className="text-sm font-bold">{fmt(data.learners)}명</p>
            </div>
            <div className="rounded-lg p-3 bg-white">
              <HardDrive className="w-4 h-4 mx-auto mb-1 text-gray-400" />
              <p className="text-xs text-gray-500">저장공간</p>
              <p className="text-sm font-bold">{fmt(data.storageInput)}GB</p>
            </div>
            <div className="rounded-lg p-3 bg-white">
              <GraduationCap className="w-4 h-4 mx-auto mb-1 text-gray-400" />
              <p className="text-xs text-gray-500">완강률</p>
              <p className="text-sm font-bold">{data.completionRate}%</p>
            </div>
            <div className="rounded-lg p-3 bg-white">
              <Globe className="w-4 h-4 mx-auto mb-1 text-gray-400" />
              <p className="text-xs text-gray-500">예상 CDN</p>
              <p className="text-sm font-bold">{fmt(data.cdnGB)}GB/월</p>
            </div>
          </div>
        </div>

        {data.savingsAmount > 0 && (
          <div className="flex items-center gap-2 mt-3 px-4 py-3 rounded-xl" style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}>
            <TrendingUp className="w-5 h-5 shrink-0" style={{ color: "#059669" }} />
            <span className="text-sm font-bold" style={{ color: "#059669" }}>타사 대비 월 약 {fmt(data.savingsAmount)}원 절감 효과</span>
          </div>
        )}
      </div>

      {/* Cost Breakdown */}
      <div className="px-8 py-6 border-b border-gray-100">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full" style={{ background: "#5D45FF" }} />
          상세 비용 내역
        </h2>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs">항목</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 text-xs">금액 (월)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {costBreakdown.map((item) => (
                <tr key={item.label}>
                  <td className="px-5 py-3 text-gray-700">{item.label}</td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">{fmt(item.amount)}원</td>
                </tr>
              ))}
              {discount > 0 && (
                <tr>
                  <td className="px-5 py-3 text-green-600 font-semibold">연간 계약 할인 (10%)</td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums text-green-600">-{fmt(discount)}원</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr style={{ background: "#5D45FF" }}>
                <td className="px-5 py-4 font-bold text-white text-base">합계 (VAT 별도)</td>
                <td className="px-5 py-4 text-right font-extrabold text-white text-lg tabular-nums">{fmt(data.basePrice - discount)}원/월</td>
              </tr>
            </tfoot>
          </table>
        </div>
        {data.isAnnual && (
          <p className="text-xs text-gray-400 mt-2 text-right">연간 총액: {fmt((data.basePrice - discount) * 12)}원 (VAT 별도)</p>
        )}
      </div>

      {/* Plan Features */}
      <div className="px-8 py-6 border-b border-gray-100">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full" style={{ background: "#5D45FF" }} />
          {data.planName} 플랜 포함 기능
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {planInfo.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2 py-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#00C896" }} />
              <span className="text-sm text-gray-700">{h}</span>
            </div>
          ))}
        </div>

        {planInfo.addons.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-bold text-gray-500 mb-2">선택 가능한 부가 서비스</h3>
            <div className="space-y-1.5">
              {planInfo.addons.map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-sm text-gray-600">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 px-4 py-3 rounded-xl" style={{ background: "#F0F9FF", border: "1px solid #BAE6FD" }}>
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4" style={{ color: "#0284C7" }} />
            <span className="text-sm font-semibold" style={{ color: "#0284C7" }}>기술 지원: {planInfo.support}</span>
          </div>
        </div>
      </div>

      {/* Essential Add-on Services */}
      <div className="px-8 py-6 border-b border-gray-100">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full" style={{ background: "#FF6B00" }} />
          필수 부가 서비스 안내
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: <ShieldCheck className="w-5 h-5" style={{ color: "#5D45FF" }} />, title: "보안 플레이어 (DRM)", desc: "Widevine·FairPlay 멀티 DRM 적용. 화면 녹화·캡처 차단, 불법 복제 원천 방지", price: "월 300,000원", selected: data.needsSecurePlayer },
            { icon: <Server className="w-5 h-5" style={{ color: "#5D45FF" }} />, title: "단독 서버 (WEB)", desc: "대규모 트래픽에 최적화된 전용 서버. 동시접속 1,000명 이상 안정 운영", price: "월 250,000원", selected: data.needsDedicatedServer },
            { icon: <Globe className="w-5 h-5" style={{ color: "#5D45FF" }} />, title: "모바일 앱 (iOS/Android)", desc: "네이티브 앱으로 언제 어디서나 학습 가능. 푸시 알림·오프라인 학습 지원", price: "Plus 이상 포함" },
            { icon: <Award className="w-5 h-5" style={{ color: "#5D45FF" }} />, title: "PG 결제 연동", desc: "토스페이먼츠, KG이니시스 등 국내 PG사 연동. 수강료 자동 결제·정산", price: "기본 포함" },
          ].map((svc) => (
            <div key={svc.title} className="rounded-xl p-4 border" style={{ borderColor: svc.selected ? "#5D45FF" : "#E5E7EB", background: svc.selected ? "#F8F7FF" : "white" }}>
              <div className="flex items-center gap-2 mb-2">
                {svc.icon}
                <span className="text-sm font-bold text-gray-800">{svc.title}</span>
                {svc.selected && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "#00C896" }}>적용됨</span>}
              </div>
              <p className="text-xs text-gray-500 mb-2 leading-relaxed">{svc.desc}</p>
              <p className="text-xs font-semibold" style={{ color: "#5D45FF" }}>{svc.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Success Roadmap */}
      <div className="px-8 py-6 border-b border-gray-100">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full" style={{ color: "#00C896", background: "#00C896" }} />
          성공 로드맵 — 오픈까지 2주
        </h2>
        <div className="relative">
          <div className="absolute left-[47px] top-0 bottom-0 w-0.5" style={{ background: "#E8E5FF" }} />
          <div className="space-y-5">
            {roadmapSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 relative">
                <div className="shrink-0 w-[94px] text-right">
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "#F0EEFF", color: "#5D45FF" }}>{step.week}</span>
                </div>
                <div className="shrink-0 w-3 h-3 rounded-full mt-1 border-2 bg-white z-10" style={{ borderColor: "#5D45FF" }} />
                <div className="pb-1">
                  <p className="text-sm font-bold text-gray-800">{step.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why WEBHEADS */}
      <div className="px-8 py-6 border-b border-gray-100">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full" style={{ background: "#5D45FF" }} />
          왜 웹헤즈인가?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            { value: "16년+", label: "LMS 전문 경력" },
            { value: "300+", label: "구축 고객사" },
            { value: "92.6%", label: "고객 유지율" },
            { value: "99.9%", label: "SLA 가동률" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-4" style={{ background: "#F8F7FF" }}>
              <p className="text-lg font-extrabold" style={{ color: "#5D45FF" }}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Guarantees */}
      <div className="px-8 py-6 border-b border-gray-100">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full" style={{ background: "#00C896" }} />
          안심 보장 정책
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: <ArrowRight className="w-4 h-4" />, title: "데이터 무료 이전", desc: "기존 LMS 데이터 전체 무상 이전" },
            { icon: <Clock className="w-4 h-4" />, title: "2주 내 오픈 보장", desc: "지연 시 지연일만큼 무상 제공" },
            { icon: <Shield className="w-4 h-4" />, title: "위약금 없음", desc: "해지 수수료 일체 없음" },
            { icon: <Star className="w-4 h-4" />, title: "SLA 보장", desc: "미달 시 서비스 크레딧 제공" },
          ].map((g) => (
            <div key={g.title} className="flex items-start gap-2 p-3 rounded-lg" style={{ background: "#ECFDF5" }}>
              <div className="shrink-0 mt-0.5" style={{ color: "#059669" }}>{g.icon}</div>
              <div>
                <p className="text-xs font-bold text-gray-700">{g.title}</p>
                <p className="text-[10px] text-gray-500">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-6 text-center" style={{ background: "#F9FAFB" }}>
        <p className="text-sm font-bold text-gray-700 mb-1">(주)웹헤즈 — 16년 e러닝 전문 기업</p>
        <p className="text-xs text-gray-400">서울특별시 마포구 월드컵로114, 3층 (성산동, 효남빌딩)</p>
        <p className="text-xs text-gray-400 mt-1">
          Tel: 02-540-4337 · Email: 34bus@webheads.co.kr · <span style={{ color: "#5D45FF" }}>www.webheads.co.kr</span>
        </p>
        <p className="text-[10px] text-gray-300 mt-3">본 견적서는 시뮬레이션 결과를 기반으로 자동 생성되었으며, 실제 계약 조건은 상담 후 확정됩니다. VAT 별도.</p>
      </div>
    </div>
  );
});

SimulationProposal.displayName = "SimulationProposal";
export default SimulationProposal;
