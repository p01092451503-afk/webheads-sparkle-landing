import { useState } from "react";
import RichTextEditor from "./RichTextEditor";
import { Helmet } from "react-helmet-async";
import { Send, Loader2, ChevronDown, Monitor, Lock, Phone, PenSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

type InquiryType = "consultation" | "demo";

/* ── Inline client marquee (lightweight, no separate component needed) ── */
function ContactMarquee() {
  const { t } = useTranslation();
  const clients = t("lms.clients", { returnObjects: true }) as string[];

  const renderList = () =>
    clients.map((name, i) => (
      <span
        key={i}
        className="mx-5 shrink-0 text-sm font-semibold tracking-tight text-muted-foreground/50"
      >
        {name}
      </span>
    ));

  return (
    <div className="overflow-hidden py-6 scrollbar-hide">
      <div className="flex w-max contact-marquee-track">
        <div className="flex shrink-0">{renderList()}</div>
        <div className="flex shrink-0">{renderList()}</div>
      </div>
      <style>{`
        @keyframes contact-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .contact-marquee-track {
          animation: contact-marquee 55s linear infinite;
        }
      `}</style>
    </div>
  );
}

/* ── Main ContactSection ── */
export default function ContactSection({ showDemo = false }: { showDemo?: boolean }) {
  const { t } = useTranslation();
  const services = t("contact.services", { returnObjects: true }) as string[];

  const [inquiryType, setInquiryType] = useState<InquiryType>("consultation");
  const [form, setForm] = useState({
    company: "",
    name: "",
    phone: "",
    email: "",
    service: [] as string[],
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAgreed) {
      setError(t("contact.formPrivacyRequired"));
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "send-contact-email",
        { body: { ...form, service: form.service.join(", "), inquiryType, marketingAgreed, session_id: sessionStorage.getItem("_sid") || undefined } }
      );
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || t("contact.formError"));
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-lg px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/40 bg-muted border border-border";
  const inputFocus =
    "focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10";

  return (
    <section id="contact" className="pt-8 pb-14 bg-background scroll-mt-[120px]">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* ── Header ── */}
        <div className="text-center mb-10">
          <h2
            className="text-3xl lg:text-4xl leading-tight tracking-tight text-primary"
            style={{ fontWeight: 900 }}
          >
            {t("contact.title")}
            <br />
            {t("contact.titleHighlight")}
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            {t("contact.desc")}
          </p>

          {/* ── Phone buttons + Response badge ── */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <a
              href="tel:02-336-4338"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              {t("footer.newPhone")}
            </a>
            <a
              href="tel:02-540-4337"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              {t("footer.maintenancePhone")}
            </a>
            <button
              type="button"
              onClick={() => {
                const formEl = document.querySelector('form');
                formEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
            >
              <PenSquare className="w-3.5 h-3.5" />
              {t("contact.writeInquiry")}
            </button>
          </div>
        </div>


        {/* ── Client marquee ── */}
        <ContactMarquee />

        {/* ── Form or Success ── */}
        {submitted ? (
          <div className="rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4 min-h-[400px] bg-card border border-border">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{
                background: "hsl(var(--primary))",
                boxShadow: "0 6px 20px hsl(var(--primary) / 0.25)",
              }}
            >
              <Send className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl tracking-tight text-foreground" style={{ fontWeight: 900 }}>
              {t("contact.successTitle")}
            </h3>
            <p className="text-sm leading-relaxed max-w-xs whitespace-pre-line text-muted-foreground">
              {t("contact.successDesc")}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setPrivacyAgreed(false);
                setMarketingAgreed(false);
              }}
              className="mt-3 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-80 bg-secondary text-foreground"
            >
              {t("contact.successRetry")}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="relative rounded-2xl p-8 lg:p-10 flex flex-col gap-5 bg-card border border-border shadow-sm"
          >

            {/* Response badge */}
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm text-foreground tracking-tight border border-border w-fit">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              {t("contact.responseBadge")}
            </span>

            {/* Inquiry type tabs */}
            {showDemo && (
              <div className="flex rounded-lg p-1 gap-1 bg-muted">
                <button
                  type="button"
                  onClick={() => setInquiryType("consultation")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-md text-sm font-bold transition-all duration-200 ${
                    inquiryType === "consultation"
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  {t("contact.tabConsultation")}
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType("demo")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-md text-sm font-bold transition-all duration-200 ${
                    inquiryType === "demo"
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  {t("contact.tabDemo")}
                </button>
              </div>
            )}

            {/* Row 1: Company (optional) + Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label={t("contact.formCompany")}>
                <input
                  type="text"
                  placeholder={t("contact.formCompanyPlaceholder")}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className={`${inputBase} ${inputFocus}`}
                />
              </FormField>
              <FormField label={t("contact.formName")} required>
                <input
                  type="text"
                  required
                  placeholder={t("contact.formNamePlaceholder")}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`${inputBase} ${inputFocus}`}
                />
              </FormField>
            </div>

            {/* Row 2: Phone + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label={t("contact.formPhone")} required>
                <input
                  type="tel"
                  required
                  placeholder={t("contact.formPhonePlaceholder")}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`${inputBase} ${inputFocus}`}
                />
              </FormField>
              <FormField label={t("contact.formEmail")}>
                <input
                  type="email"
                  placeholder={t("contact.formEmailPlaceholder")}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`${inputBase} ${inputFocus}`}
                />
              </FormField>
            </div>

            {/* Service select */}
            <FormField label={t("contact.formService")}>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                  className={`${inputBase} ${inputFocus} text-left flex items-center justify-between cursor-pointer`}
                >
                  <span className={form.service.length === 0 ? "text-muted-foreground/40" : "text-foreground"}>
                    {form.service.length === 0
                      ? t("contact.formServicePlaceholder")
                      : form.service.join(", ")}
                  </span>
                  <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${showServiceDropdown ? "rotate-180" : ""}`} />
                </button>
                {showServiceDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto p-2">
                    {services.map((s) => (
                      <label
                        key={s}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer hover:bg-muted transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={form.service.includes(s)}
                          onChange={() => {
                            setForm(prev => ({
                              ...prev,
                              service: prev.service.includes(s)
                                ? prev.service.filter(v => v !== s)
                                : [...prev.service, s]
                            }));
                          }}
                          className="w-4 h-4 rounded border-2 border-border accent-primary cursor-pointer shrink-0"
                        />
                        <span className="text-sm text-foreground">{s}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </FormField>

            {/* Message */}
            <FormField label={t("contact.formMessage")}>
              <RichTextEditor
                value={form.message}
                onChange={(html) => setForm({ ...form, message: html })}
                placeholder={
                  inquiryType === "demo"
                    ? t("contact.formMessagePlaceholderDemo")
                    : t("contact.formMessagePlaceholder")
                }
              />
            </FormField>

            {/* ── Privacy checkbox ── */}
            <label className="flex items-center gap-3 cursor-pointer select-none group pt-2">
              <input
                type="checkbox"
                checked={privacyAgreed}
                onChange={(e) => setPrivacyAgreed(e.target.checked)}
                className="w-[18px] h-[18px] rounded border-2 border-border accent-primary cursor-pointer shrink-0"
              />
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {t("contact.formPrivacy")}
              </span>
            </label>

            {/* ── Marketing checkbox ── */}
            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={marketingAgreed}
                onChange={(e) => setMarketingAgreed(e.target.checked)}
                className="w-[18px] h-[18px] rounded border-2 border-border accent-primary cursor-pointer shrink-0 mt-0.5"
              />
              <div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {t("contact.formMarketing")}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("contact.formMarketingDesc")}
                </p>
              </div>
            </label>

            {error && (
              <p className="text-sm text-center rounded-lg py-2.5 px-4 font-medium bg-destructive/10 text-destructive border border-destructive/20">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !privacyAgreed}
              className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 bg-foreground text-background"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("contact.formSending")}
                </>
              ) : (
                <>
                  {inquiryType === "demo" ? t("contact.formSubmitDemo") : t("contact.formSubmit")}
                </>
              )}
            </button>

            {/* Trust line */}
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3.5 h-3.5" />
              {t("contact.trustLine")}
            </p>
          </form>
        )}
      </div>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://service.webheads.co.kr/#localbusiness",
            "name": "웹헤즈 (Webheads)",
            "url": "https://service.webheads.co.kr",
            "telephone": "+82-2-336-4338",
            "email": "34bus@webheads.co.kr",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "KR",
              "addressLocality": "서울특별시"
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
                "opens": "09:00",
                "closes": "18:00"
              }
            ],
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+82-2-336-4338",
                "contactType": "sales",
                "availableLanguage": "Korean",
                "hoursAvailable": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
                  "opens": "09:00",
                  "closes": "18:00"
                }
              },
              {
                "@type": "ContactPoint",
                "telephone": "+82-2-540-4337",
                "contactType": "technical support",
                "availableLanguage": "Korean"
              }
            ]
          })}
        </script>
      </Helmet>
    </section>
  );
}

/* ── Tiny helper for labels ── */
function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold tracking-wide text-foreground">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
