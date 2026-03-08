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

const PRICES_KO = ["300,000원", "500,000원", "700,000원", "1,000,000원"];
const PRICES_EN = ["300,000 KRW", "500,000 KRW", "700,000 KRW", "1,000,000 KRW"];
const PRICES_JA = ["300,000ウォン", "500,000ウォン", "700,000ウォン", "1,000,000ウォン"];
const PRICE_SUB_KO = ["/월(VAT 별도)", "/월(VAT 별도)", "/월(VAT 별도)", "/월(VAT 별도)"];
const PRICE_SUB_EN = ["/mo (excl. VAT)", "/mo (excl. VAT)", "/mo (excl. VAT)", "/mo (excl. VAT)"];
const PRICE_SUB_JA = ["/月（VAT別）", "/月（VAT別）", "/月（VAT別）", "/月（VAT別）"];

const MAIN_SPECS_KO: SpecRow[] = [
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

const MAIN_SPECS_EN: SpecRow[] = [
  {
    label: "Monthly Transfer",
    values: ["No CDN", "500GB", "1,500GB", "2,000GB"],
    sub: ["YouTube/Vimeo integration", "~1,700 views of 30-min lectures", "~5,100 views of 30-min lectures", "~6,800 views of 30-min lectures"],
  },
  {
    label: "Storage",
    values: ["—", "100GB", "200GB", "250GB"],
    sub: ["", "~332 SD 30-min lectures", "~664 SD 30-min lectures", "~830 SD 30-min lectures"],
  },
];

const MAIN_SPECS_JA: SpecRow[] = [
  {
    label: "月間転送量",
    values: ["CDN未使用", "500GB", "1,500GB", "2,000GB"],
    sub: ["YouTube/Vimeo連携", "30分講義 約1,700名受講", "30分講義 約5,100名受講", "30分講義 約6,800名受講"],
  },
  {
    label: "ストレージ",
    values: ["—", "100GB", "200GB", "250GB"],
    sub: ["", "標準画質30分講義 約332講", "標準画質30分講義 約664講", "標準画質30分講義 約830講"],
  },
];

const ADDITIONAL_SPECS_KO: SpecRow[] = [
  { label: "회원 수", values: ["무제한", "무제한", "무제한", "무제한"] },
  { label: "트랜스코딩", values: ["—", "20GB", "20GB", "20GB"] },
  { label: "담당자", values: ["LMS 전문 담당자 배정", "LMS 전문 담당자 배정", "LMS 전문 담당자 배정", "LMS 전문 담당자 배정"] },
  { label: "지원", values: ["정기 업데이트", "정기 업데이트", "정기 업데이트", "정기 업데이트, 보안 리포트"] },
  { label: "관리자 계정", values: ["무제한", "무제한", "무제한", "무제한"] },
];

const ADDITIONAL_SPECS_EN: SpecRow[] = [
  { label: "Members", values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"] },
  { label: "Transcoding", values: ["—", "20GB", "20GB", "20GB"] },
  { label: "Account Manager", values: ["Dedicated LMS Manager", "Dedicated LMS Manager", "Dedicated LMS Manager", "Dedicated LMS Manager"] },
  { label: "Support", values: ["Regular Updates", "Regular Updates", "Regular Updates", "Regular Updates, Security Reports"] },
  { label: "Admin Accounts", values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"] },
];

const ADDITIONAL_SPECS_JA: SpecRow[] = [
  { label: "会員数", values: ["無制限", "無制限", "無制限", "無制限"] },
  { label: "トランスコーディング", values: ["—", "20GB", "20GB", "20GB"] },
  { label: "担当者", values: ["LMS専任担当者配置", "LMS専任担当者配置", "LMS専任担当者配置", "LMS専任担当者配置"] },
  { label: "サポート", values: ["定期アップデート", "定期アップデート", "定期アップデート", "定期アップデート、セキュリティレポート"] },
  { label: "管理者アカウント", values: ["無制限", "無制限", "無制限", "無制限"] },
];

const SPECIAL_FEATURES_KO = [
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

const SPECIAL_FEATURES_EN = [
  "Live (ZOOM)",
  "SMS/KakaoTalk API Integration",
  "Search Engine Optimization",
  "Free Design Templates",
  "AI Learning Encouragement",
  "Admin Dashboard",
  "Regular Updates",
  "Certificate Templates",
  "Mobile Web Service",
  "Social Login (Google, Kakao, Naver, Facebook)",
];

const SPECIAL_FEATURES_JA = [
  "ライブ（ZOOM）",
  "SMS/カカオアラートトーク送信API連携",
  "検索エンジン最適化",
  "デザインテンプレート提供",
  "AI学習促進機能",
  "管理者ダッシュボード",
  "定期アップデート",
  "修了証テンプレート",
  "モバイルWebサービス",
  "ソーシャルログイン（Google、カカオ、Naver、Facebook）",
];

const INFRA_SPECS_KO: SpecRow[] = [
  { label: "개발 도메인", values: ["1개 제공", "1개 제공", "1개 제공", "1개 제공"] },
  {
    label: "보안 서비스",
    values: ["기본 보안, SSL", "기본 보안, WAF & Shield, FireWall 등", "기본 보안, WAF & Shield, FireWall 등", "별도 문의"],
  },
  { label: "통계 페이지", values: ["✓", "✓", "✓", "✓"] },
];

const INFRA_SPECS_EN: SpecRow[] = [
  { label: "Dev Domain", values: ["1 Included", "1 Included", "1 Included", "1 Included"] },
  {
    label: "Security",
    values: ["Basic Security, SSL", "Basic Security, WAF & Shield, Firewall, etc.", "Basic Security, WAF & Shield, Firewall, etc.", "Contact Us"],
  },
  { label: "Analytics Page", values: ["✓", "✓", "✓", "✓"] },
];

const INFRA_SPECS_JA: SpecRow[] = [
  { label: "開発ドメイン", values: ["1つ提供", "1つ提供", "1つ提供", "1つ提供"] },
  {
    label: "セキュリティ",
    values: ["基本セキュリティ、SSL", "基本セキュリティ、WAF & Shield、Firewallなど", "基本セキュリティ、WAF & Shield、Firewallなど", "別途お問い合わせ"],
  },
  { label: "統計ページ", values: ["✓", "✓", "✓", "✓"] },
];

const OVERAGE_SPECS_KO: { label: string; unit: string; values: string[] }[] = [
  { label: "전송량", unit: "1GB당", values: ["—", "500원", "400원", "300원"] },
  { label: "저장공간", unit: "1GB당", values: ["—", "1,000원", "800원", "500원"] },
  { label: "트랜스코딩", unit: "1GB당", values: ["—", "2,200원", "2,000원", "2,000원"] },
  { label: "보안 플레이어", unit: "월", values: ["—", "300,000원", "300,000원", "300,000원"] },
];

const OVERAGE_SPECS_EN: { label: string; unit: string; values: string[] }[] = [
  { label: "Transfer", unit: "per GB", values: ["—", "500 KRW", "400 KRW", "300 KRW"] },
  { label: "Storage", unit: "per GB", values: ["—", "1,000 KRW", "800 KRW", "500 KRW"] },
  { label: "Transcoding", unit: "per GB", values: ["—", "2,200 KRW", "2,000 KRW", "2,000 KRW"] },
  { label: "Secure Player", unit: "monthly", values: ["—", "300,000 KRW", "300,000 KRW", "300,000 KRW"] },
];

const OVERAGE_SPECS_JA: { label: string; unit: string; values: string[] }[] = [
  { label: "転送量", unit: "1GBあたり", values: ["—", "500ウォン", "400ウォン", "300ウォン"] },
  { label: "ストレージ", unit: "1GBあたり", values: ["—", "1,000ウォン", "800ウォン", "500ウォン"] },
  { label: "トランスコーディング", unit: "1GBあたり", values: ["—", "2,200ウォン", "2,000ウォン", "2,000ウォン"] },
  { label: "セキュアプレイヤー", unit: "月", values: ["—", "300,000ウォン", "300,000ウォン", "300,000ウォン"] },
];

export default function PricingPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : i18n.language?.startsWith("ja") ? "ja" : "ko";
  const plans = t("lms.plans", { returnObjects: true }) as any[];

  const PRICES = lang === "en" ? PRICES_EN : PRICES_KO;
  const PRICE_SUB = lang === "en" ? PRICE_SUB_EN : PRICE_SUB_KO;
  const MAIN_SPECS = lang === "en" ? MAIN_SPECS_EN : MAIN_SPECS_KO;
  const ADDITIONAL_SPECS = lang === "en" ? ADDITIONAL_SPECS_EN : ADDITIONAL_SPECS_KO;
  const SPECIAL_FEATURES = lang === "en" ? SPECIAL_FEATURES_EN : SPECIAL_FEATURES_KO;
  const INFRA_SPECS = lang === "en" ? INFRA_SPECS_EN : INFRA_SPECS_KO;
  const OVERAGE_SPECS = lang === "en" ? OVERAGE_SPECS_EN : OVERAGE_SPECS_KO;

  const sectionTitles = lang === "en"
    ? { monthly: "Monthly Fee", basic: "Base Specs", recommend: "Recommended For", additional: "Additional Features", special: "Special Features", infra: "Infrastructure & Security", overage: "Overage Charges", item: "Item" }
    : { monthly: "월 이용료", basic: "기본 사양", recommend: "추천 대상", additional: "추가 제공", special: "특별 제공", infra: "인프라 · 보안", overage: "초과 사용 요금", item: "항목" };

  const heroTitle = lang === "en"
    ? <>Flexible Plans,<br />Transparent Pricing</>
    : <>다양한 옵션과<br />합리적인 요금제를 제공합니다</>;
  const heroDesc = lang === "en"
    ? "Start at an affordable price with no hidden fees."
    : "합리적인 가격으로 부담없이 시작하세요";
  const heroCta = lang === "en" ? "Contact Us" : "문의하기";
  const detailTitle = lang === "en" ? "Detailed Plan Comparison" : "요금제 상세 비교";
  const monthlyLabel = lang === "en" ? "Monthly Fee" : "월 금액";
  const ctaTitle = lang === "en" ? "Need a custom quote?" : "맞춤 견적이 필요하신가요?";
  const ctaDesc = lang === "en"
    ? "We'll recommend the best plan based on your organization's size and requirements."
    : "기관의 규모와 요구사항에 맞는 최적의 요금제를 안내해드립니다.";
  const ctaCta = lang === "en" ? "Request Custom Quote" : "맞춤 견적 요청";
  const seoTitle = lang === "en" ? "Pricing — WEBHEADS LMS" : "요금제 — 웹헤즈 LMS";
  const seoDesc = lang === "en"
    ? "Compare WEBHEADS LMS plans and choose the right one for your organization. From Starter to Premium."
    : "웹헤즈 LMS 요금제를 비교하고 기관에 맞는 플랜을 선택하세요. Starter부터 Premium까지 다양한 옵션을 제공합니다.";

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden text-primary-foreground" style={{ background: "linear-gradient(135deg, hsl(220 30% 18%), hsl(225 35% 24%), hsl(220 25% 20%))" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/8" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {heroTitle}
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/70">
            {heroDesc}
          </p>
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
          >
            {heroCta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Pricing Cards */}
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
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 rounded-xl border border-border bg-muted px-6 py-4">
            <p className="text-foreground font-semibold text-sm">{t("lms.plansCustom.title")} <span className="font-normal text-muted-foreground">{t("lms.plansCustom.desc")}</span></p>
            <a href="#contact" className="shrink-0 inline-flex px-5 py-2.5 rounded-2xl font-bold text-xs text-white transition-colors hover:opacity-90" style={{ background: "hsl(var(--lms-primary))" }}>{t("lms.plansCustom.cta")}</a>
          </div>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-2xl lg:text-3xl font-black text-foreground text-center mb-12 tracking-tight">
            {detailTitle}
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-border bg-foreground text-primary-foreground">
                  <th className="text-left px-5 py-4 font-bold w-[180px]">{sectionTitles.item}</th>
                  {TIERS.map((tier, i) => (
                    <th key={tier} className={`text-center px-4 py-4 font-bold ${i === 2 ? "bg-primary/20" : ""}`}>
                      {tier}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <TableSection title={sectionTitles.monthly} />
                <tr className="border-b border-border">
                  <td className="px-5 py-4 font-semibold text-foreground">{monthlyLabel}</td>
                  {PRICES.map((p, i) => (
                    <td key={i} className={`text-center px-4 py-4 font-bold text-foreground ${i === 2 ? "bg-primary/5" : ""}`}>
                      {p}
                      {PRICE_SUB[i] && <span className="block text-xs font-normal text-muted-foreground">{PRICE_SUB[i]}</span>}
                    </td>
                  ))}
                </tr>

                <TableSection title={sectionTitles.basic} />
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

                <tr className="border-b border-border">
                  <td className="px-5 py-4 font-semibold text-foreground">{sectionTitles.recommend}</td>
                  {(plans as any[]).map((plan: any, i: number) => (
                    <td key={i} className={`text-center px-4 py-4 text-sm text-muted-foreground leading-relaxed ${i === 2 ? "bg-primary/5" : ""}`}>
                      {plan.recommend}
                    </td>
                  ))}
                </tr>

                <TableSection title={sectionTitles.additional} />
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

                <TableSection title={sectionTitles.special} />
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

                <TableSection title={sectionTitles.infra} />
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

                <TableSection title={sectionTitles.overage} />
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
            {ctaTitle}
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {ctaDesc}
          </p>
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
          >
            {ctaCta}
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
