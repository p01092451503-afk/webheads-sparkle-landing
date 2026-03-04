import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquareText, Bell, ArrowRight, Info, MonitorSmartphone } from "lucide-react";
import ContactSection from "@/components/ContactSection";
import SEO, { BASE_URL } from "@/components/SEO";
import { useTranslation } from "react-i18next";

type TabType = "sms" | "kakao";

const SMS_TABLE = {
  counts: ["500건", "1,000건", "5,000건", "10,000건", "50,000건", "100,000건"],
  perUnit: ["25원", "23원", "20원", "19원", "17원", "15원"],
  total: ["12,500원", "23,000원", "100,000원", "190,000원", "850,000원", "1,500,000원"],
};

const SMS_TABLE_EN = {
  counts: ["500", "1,000", "5,000", "10,000", "50,000", "100,000"],
  perUnit: ["25 KRW", "23 KRW", "20 KRW", "19 KRW", "17 KRW", "15 KRW"],
  total: ["12,500 KRW", "23,000 KRW", "100,000 KRW", "190,000 KRW", "850,000 KRW", "1,500,000 KRW"],
};

const KAKAO_TABLE = {
  counts: ["1,000건", "3,000건", "5,000건", "10,000건", "50,000건"],
  perUnit: ["12원", "11원", "10원", "9원", "8원"],
  total: ["12,000원", "33,000원", "50,000원", "90,000원", "400,000원"],
};

const KAKAO_TABLE_EN = {
  counts: ["1,000", "3,000", "5,000", "10,000", "50,000"],
  perUnit: ["12 KRW", "11 KRW", "10 KRW", "9 KRW", "8 KRW"],
  total: ["12,000 KRW", "33,000 KRW", "50,000 KRW", "90,000 KRW", "400,000 KRW"],
};

export default function SmsKakaoPage() {
  const [tab, setTab] = useState<TabType>("sms");
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "ko";

  return (
    <>
      <SEO
        title={t("smsKakao.seo.title")}
        description={t("smsKakao.seo.description")}
        keywords={t("smsKakao.seo.keywords")}
        path="/sms-kakao"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `${t("smsKakao.seo.title")} - Webheads`,
          provider: { "@type": "Organization", name: "Webheads (웹헤즈)" },
          description: t("smsKakao.seo.description"),
          areaServed: "KR",
          serviceType: t("smsKakao.seo.title"),
          url: `${BASE_URL}/sms-kakao`,
        }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden text-primary-foreground" style={{ background: "linear-gradient(135deg, hsl(220 30% 18%), hsl(225 35% 24%), hsl(220 25% 20%))" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/8" />
        <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {t("smsKakao.hero.title")}
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/70">
            {t("smsKakao.hero.desc")}
          </p>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex rounded-xl p-1 gap-1 bg-muted max-w-md mx-auto mb-14">
            <button
              onClick={() => setTab("sms")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                tab === "sms"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquareText className="w-4 h-4" />
              {t("smsKakao.tabs.sms")}
            </button>
            <button
              onClick={() => setTab("kakao")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                tab === "kakao"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bell className="w-4 h-4" />
              {t("smsKakao.tabs.kakao")}
            </button>
          </div>

          {tab === "sms" ? <SmsContent lang={lang} /> : <KakaoContent lang={lang} />}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-2xl lg:text-3xl font-black text-foreground tracking-tight">
            {t("smsKakao.cta.title")}
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {t("smsKakao.cta.desc")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <a
              href="https://help.webheads.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
              <MessageSquareText className="w-4 h-4" />
              {t("smsKakao.cta.button")}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}

function SmsContent({ lang }: { lang: string }) {
  const { t } = useTranslation();
  const table = lang === "en" ? SMS_TABLE_EN : SMS_TABLE;

  return (
    <div className="flex flex-col gap-12">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">
          {t("smsKakao.sms.title")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {t("smsKakao.sms.desc")}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-black text-foreground tracking-tight mb-5">
          {t("smsKakao.sms.tableTitle")}
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="bg-foreground text-primary-foreground">
                <th colSpan={7} className="text-center px-5 py-3.5 font-bold text-base">
                  {t("smsKakao.sms.tableHeader")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border bg-muted/40">
                <td className="px-5 py-3.5 font-bold text-foreground w-[140px]">{t("smsKakao.sms.rowCount")}</td>
                {table.counts.map((c) => (
                  <td key={c} className="text-center px-3 py-3.5 font-semibold text-foreground">{c}</td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="px-5 py-3.5 font-bold text-foreground">{t("smsKakao.sms.rowPerUnit")}</td>
                {table.perUnit.map((p, i) => (
                  <td key={i} className="text-center px-3 py-3.5 text-foreground">{p}</td>
                ))}
              </tr>
              <tr className="border-b border-border bg-muted/40">
                <td className="px-5 py-3.5 font-bold text-foreground">
                  {t("smsKakao.sms.rowTotal")}
                  <span className="block text-xs font-normal text-muted-foreground">{t("smsKakao.sms.vatNote")}</span>
                </td>
                {table.total.map((tt, i) => (
                  <td key={i} className="text-center px-3 py-3.5 font-semibold text-primary">{tt}</td>
                ))}
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-foreground">{t("smsKakao.sms.rowPoints")}</td>
                <td colSpan={3} className="text-center px-3 py-3.5 text-foreground">
                  <span className="font-semibold">SMS</span> {t("smsKakao.sms.pointSms")}
                </td>
                <td colSpan={3} className="text-center px-3 py-3.5 text-foreground">
                  <span className="font-semibold">LMS</span> {t("smsKakao.sms.pointLms")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">SMS</span>
          <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: t("smsKakao.sms.smsInfo") }} />
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold mb-3">LMS</span>
          <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: t("smsKakao.sms.lmsInfo") }} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted/30 p-6 lg:p-8">
        <div className="flex items-start gap-3 mb-4">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <h3 className="text-lg font-black text-foreground tracking-tight">
            {t("smsKakao.sms.preRegTitle")}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {t("smsKakao.sms.preRegDesc")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="rounded-xl bg-card border border-border p-5">
            <h4 className="text-sm font-bold text-foreground mb-2">{t("smsKakao.sms.preRegWhat")}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("smsKakao.sms.preRegWhatDesc")}</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-5">
            <h4 className="text-sm font-bold text-foreground mb-2">{t("smsKakao.sms.preRegHow")}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("smsKakao.sms.preRegHowDesc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function KakaoContent({ lang }: { lang: string }) {
  const { t } = useTranslation();
  const table = lang === "en" ? KAKAO_TABLE_EN : KAKAO_TABLE;

  return (
    <div className="flex flex-col gap-12">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">
          {t("smsKakao.kakao.title")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {t("smsKakao.kakao.desc")}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-black text-foreground tracking-tight mb-5">
          {t("smsKakao.kakao.tableTitle")}
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="bg-foreground text-primary-foreground">
                <th colSpan={6} className="text-center px-5 py-3.5 font-bold text-base">
                  {t("smsKakao.kakao.tableHeader")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border bg-muted/40">
                <td className="px-5 py-3.5 font-bold text-foreground w-[140px]">{t("smsKakao.kakao.rowCount")}</td>
                {table.counts.map((c) => (
                  <td key={c} className="text-center px-3 py-3.5 font-semibold text-foreground">{c}</td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="px-5 py-3.5 font-bold text-foreground">{t("smsKakao.kakao.rowPerUnit")}</td>
                {table.perUnit.map((p, i) => (
                  <td key={i} className="text-center px-3 py-3.5 text-foreground">{p}</td>
                ))}
              </tr>
              <tr className="border-b border-border bg-muted/40">
                <td className="px-5 py-3.5 font-bold text-foreground">
                  {t("smsKakao.kakao.rowTotal")}
                  <span className="block text-xs font-normal text-muted-foreground">{t("smsKakao.kakao.vatNote")}</span>
                </td>
                {table.total.map((tt, i) => (
                  <td key={i} className="text-center px-3 py-3.5 font-semibold text-primary">{tt}</td>
                ))}
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-foreground">{t("smsKakao.kakao.rowPoints")}</td>
                <td colSpan={5} className="text-center px-3 py-3.5 text-foreground">
                  {t("smsKakao.kakao.pointInfo")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted/30 p-6 lg:p-8">
        <div className="flex items-start gap-3 mb-4">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <h3 className="text-lg font-black text-foreground tracking-tight">
            {t("smsKakao.kakao.infoTitle")}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("smsKakao.kakao.infoDesc")}
        </p>
      </div>
    </div>
  );
}