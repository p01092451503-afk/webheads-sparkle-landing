import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check, ArrowRight } from "lucide-react";
import ContactSection from "@/components/ContactSection";

interface SpecRow {
  label: string;
  values: string[];
  sub?: string[];
}

const TIERS = ["Starter", "Basic", "Plus", "Premium"] as const;

const PRICES = ["300,000원", "500,000원", "700,000원", "1,000,000원"];
const PRICE_SUB = ["/월(VAT 별도)", "/월(VAT 별도)", "/월(VAT 별도)", "/월(VAT 별도)"];

const MAIN_SPECS: SpecRow[] = [
  {
    label: "월 전송량",
    values: ["CDN 미사용", "500GB", "1,500GB", "2,000GB"],
    sub: ["YouTube/Vimeo 연동", "30분 강의 약 1,700명 수강", "30분 강의 약 5,100명 수강", "30분 강의 약 6,800명 수강"],
  },
  {
    label: "저장 공간",
    values: ["—", "100GB", "200GB", "250GB"],
    sub: ["", "일반화질 30분 강의 약 332강", "일반화질 30분 강의 약 664강", "일반화질 30분 강의 약 830강"],
  },
];

const ADDITIONAL_SPECS: SpecRow[] = [
  { label: "회원 수", values: ["무제한", "무제한", "무제한", "무제한"] },
  { label: "트랜스코딩", values: ["—", "20GB", "20GB", "20GB"] },
  { label: "담당자", values: ["LMS 전문 담당자 배정", "LMS 전문 담당자 배정", "LMS 전문 담당자 배정", "LMS 전문 담당자 배정"] },
  { label: "지원", values: ["정기 업데이트", "정기 업데이트", "정기 업데이트", "정기 업데이트, 보안 리포트"] },
  { label: "관리자 계정", values: ["무제한", "무제한", "무제한", "무제한"] },
];

const SPECIAL_FEATURES = [
  "라이브(ZOOM)",
  "SMS/카카오 알림톡 발송 API 연동",
  "검색엔진 최적화",
  "디자인 템플릿 제공",
  "AI 학습 독려 기능",
  "관리자 대시보드",
  "정기 업데이트",
  "수료증 템플릿",
  "모바일 웹 서비스",
  "소셜 로그인(구글, 카카오, 네이버, 페이스북)",
];

const INFRA_SPECS: SpecRow[] = [
  { label: "개발 도메인", values: ["1개 제공", "1개 제공", "1개 제공", "1개 제공"] },
  {
    label: "보안 서비스",
    values: [
      "기본 보안, SSL",
      "기본 보안, WAF & Shield, FireWall 등",
      "기본 보안, WAF & Shield, FireWall 등",
      "별도 문의",
    ],
  },
  { label: "통계 페이지", values: ["✓", "✓", "✓", "✓"] },
];

const OVERAGE_SPECS: { label: string; unit: string; values: string[] }[] = [
  { label: "전송량", unit: "1GB당", values: ["—", "500원", "400원", "300원"] },
  { label: "저장공간", unit: "1GB당", values: ["—", "1,000원", "800원", "500원"] },
  { label: "트랜스코딩", unit: "1GB당", values: ["—", "2,200원", "2,000원", "2,000원"] },
  { label: "보안 플레이어", unit: "월", values: ["—", "300,000원", "300,000원", "300,000원"] },
];

export default function PricingPage() {
  const { t } = useTranslation();
  const plans = t("lms.plans", { returnObjects: true }) as any[];

  return (
    <>
      <Helmet>
        <title>요금제 — 웹헤즈 LMS</title>
        <meta name="description" content="웹헤즈 LMS 요금제를 비교하고 기관에 맞는 플랜을 선택하세요. Starter부터 Premium까지 다양한 옵션을 제공합니다." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden text-primary-foreground" style={{ background: "linear-gradient(135deg, hsl(220 30% 18%), hsl(225 35% 24%), hsl(220 25% 20%))" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/8" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            다양한 옵션과<br />합리적인 요금제를 제공합니다
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/70">
            합리적인 가격으로 부담없이 시작하세요
          </p>
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
          >
            문의하기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Pricing Cards — same design as LMS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {plans.map((plan: any) => (
              <div key={plan.name} className={`relative rounded-3xl flex flex-col gap-0 transition-all duration-200 overflow-hidden ${plan.highlight ? "bg-background border-2 shadow-xl scale-[1.02]" : "bg-background border border-border hover:border-muted-foreground/30 hover:shadow-md"}`} style={plan.highlight ? { borderColor: "hsl(var(--lms-primary))" } : undefined}>
                {plan.badge && <div className="text-sm font-bold text-center py-2.5 tracking-wide text-white" style={{ background: "hsl(var(--lms-primary))" }}>{plan.badge}</div>}
                <div className="p-8 flex flex-col gap-5 flex-1">
                  <div>
                    <h3 className={`font-bold text-3xl tracking-tight ${plan.highlight ? "" : "text-foreground"}`} style={plan.highlight ? { color: "hsl(var(--lms-primary))" } : undefined}>{plan.name}</h3>
                    {plan.solutionType && <p className="text-xs font-medium text-muted-foreground mt-1.5 tracking-wide min-h-[32px]">{plan.solutionType}</p>}
                    <div className={`h-px mt-4 ${plan.highlight ? "opacity-20" : "bg-border"}`} style={plan.highlight ? { background: "hsl(var(--lms-primary))" } : undefined} />
                  </div>
                  <div>
                    <div className="flex items-end gap-1">
                      <span className={`font-bold leading-none tracking-tight text-4xl ${plan.highlight ? "" : "text-foreground"}`} style={plan.highlight ? { color: "hsl(var(--lms-primary))" } : undefined}>{plan.price}</span>
                      {plan.unit && <span className="text-base font-semibold text-muted-foreground mb-1">{plan.unit}</span>}
                    </div>
                    {plan.priceNote && <p className="text-sm text-muted-foreground mt-1.5">{plan.priceNote}</p>}
                  </div>
                  <ul className="flex flex-col gap-3.5 flex-1">
                    {plan.features.map((f: any) => (
                      <li key={f.main} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5 text-sm" style={{ color: "hsl(var(--lms-primary))" }}>✓</span>
                        <div>
                          <p className="text-base font-medium text-foreground leading-tight">{f.main}</p>
                          {f.sub && <p className="text-sm text-muted-foreground mt-0.5">{f.sub}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-xl p-4 mt-2 bg-foreground">
                    <p className="text-sm text-background/60 leading-relaxed text-center">{plan.recommend}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center rounded-2xl border border-border bg-background/50 p-8">
            <p className="text-foreground font-semibold text-lg mb-2">{t("lms.plansCustom.title")}</p>
            <p className="text-muted-foreground text-sm mb-6">{t("lms.plansCustom.desc")}</p>
            <a href="#contact" className="inline-flex px-8 py-3.5 rounded-2xl font-bold text-sm text-white transition-colors hover:opacity-90" style={{ background: "hsl(var(--lms-primary))" }}>{t("lms.plansCustom.cta")}</a>
          </div>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-2xl lg:text-3xl font-black text-foreground text-center mb-12 tracking-tight">
            요금제 상세 비교
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full min-w-[700px] text-sm">
              {/* Header */}
              <thead>
                <tr className="border-b border-border bg-foreground text-primary-foreground">
                  <th className="text-left px-5 py-4 font-bold w-[180px]">항목</th>
                  {TIERS.map((tier, i) => (
                    <th key={tier} className={`text-center px-4 py-4 font-bold ${i === 2 ? "bg-primary/20" : ""}`}>
                      {tier}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <TableSection title="월 이용료" />
                <tr className="border-b border-border">
                  <td className="px-5 py-4 font-semibold text-foreground">월 금액</td>
                  {PRICES.map((p, i) => (
                    <td key={i} className={`text-center px-4 py-4 font-bold text-foreground ${i === 2 ? "bg-primary/5" : ""}`}>
                      {p}
                      {PRICE_SUB[i] && <span className="block text-xs font-normal text-muted-foreground">{PRICE_SUB[i]}</span>}
                    </td>
                  ))}
                </tr>

                {/* Main Specs */}
                <TableSection title="기본 사양" />
                {MAIN_SPECS.map((spec) => (
                  <tr key={spec.label} className="border-b border-border">
                    <td className="px-5 py-4 font-semibold text-foreground">{spec.label}</td>
                    {spec.values.map((v, i) => (
                      <td key={i} className={`text-center px-4 py-4 ${i === 2 ? "bg-primary/5" : ""}`}>
                        <span className="font-semibold text-foreground">{v}</span>
                        {spec.sub?.[i] && (
                          <span className="block text-xs text-muted-foreground mt-0.5">{spec.sub[i]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Recommended */}
                <tr className="border-b border-border">
                  <td className="px-5 py-4 font-semibold text-foreground">추천 대상</td>
                  {(plans as any[]).map((plan: any, i: number) => (
                    <td key={i} className={`text-center px-4 py-4 text-sm text-muted-foreground leading-relaxed ${i === 2 ? "bg-primary/5" : ""}`}>
                      {plan.recommend}
                    </td>
                  ))}
                </tr>

                {/* Additional */}
                <TableSection title="추가 제공" />
                {ADDITIONAL_SPECS.map((spec) => (
                  <tr key={spec.label} className="border-b border-border">
                    <td className="px-5 py-4 font-semibold text-foreground">{spec.label}</td>
                    {spec.values.map((v, i) => (
                      <td key={i} className={`text-center px-4 py-3 text-sm text-foreground ${i === 2 ? "bg-primary/5" : ""}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Special Features */}
                <TableSection title="특별 제공" />
                {SPECIAL_FEATURES.map((feat) => (
                  <tr key={feat} className="border-b border-border">
                    <td className="px-5 py-3 font-semibold text-foreground">{feat}</td>
                    {TIERS.map((_, i) => (
                      <td key={i} className={`text-center px-4 py-3 ${i === 2 ? "bg-primary/5" : ""}`}>
                        <Check className="w-4 h-4 text-primary mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Infra */}
                <TableSection title="인프라 · 보안" />
                {INFRA_SPECS.map((spec) => (
                  <tr key={spec.label} className="border-b border-border">
                    <td className="px-5 py-4 font-semibold text-foreground">{spec.label}</td>
                    {spec.values.map((v, i) => (
                      <td key={i} className={`text-center px-4 py-3 text-sm text-foreground ${i === 2 ? "bg-primary/5" : ""}`}>
                        {v === "✓" ? <Check className="w-4 h-4 text-primary mx-auto" /> : v}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Overage */}
                <TableSection title="초과 사용 요금" />
                {OVERAGE_SPECS.map((spec) => (
                  <tr key={spec.label} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-4 font-semibold text-foreground">
                      {spec.label}
                      <span className="block text-xs font-normal text-muted-foreground">({spec.unit})</span>
                    </td>
                    {spec.values.map((v, i) => (
                      <td key={i} className={`text-center px-4 py-3 text-sm font-medium text-foreground ${i === 2 ? "bg-primary/5" : ""}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-2xl lg:text-3xl font-black text-foreground tracking-tight">
            맞춤 견적이 필요하신가요?
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            기관의 규모와 요구사항에 맞는 최적의 요금제를 안내해드립니다.
          </p>
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
          >
            맞춤 견적 요청
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <ContactSection />
    </>
  );
}

function TableSection({ title }: { title: string }) {
  return (
    <tr style={{ background: "hsl(220 40% 94%)" }}>
      <td colSpan={5} className="px-5 py-3.5 text-sm font-bold tracking-wide text-primary text-center">
        {title}
      </td>
    </tr>
  );
}
