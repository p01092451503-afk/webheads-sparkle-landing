import { useState } from "react";
import { Send, Loader2, ChevronDown, Monitor, ExternalLink } from "lucide-react";
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
    <div className="overflow-hidden py-6">
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
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
        { body: { ...form, inquiryType } }
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
    "w-full rounded-lg px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/40 bg-background border border-border";
  const inputFocus =
    "focus:border-foreground focus:ring-1 focus:ring-foreground/10";

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* ── Header ── */}
        <div className="text-center mb-4">
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
            className="rounded-2xl p-8 lg:p-10 flex flex-col gap-5 bg-card border border-border shadow-sm"
          >
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

            {/* Row 1: Company + Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label={t("contact.formCompany")}
                required
              >
                <input
                  type="text"
                  required
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
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className={`${inputBase} ${inputFocus} appearance-none pr-10 cursor-pointer`}
                >
                  <option value="">{t("contact.formServicePlaceholder")}</option>
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
              </div>
            </FormField>

            {/* Message */}
            <FormField label={t("contact.formMessage")}>
              <textarea
                rows={4}
                placeholder={
                  inquiryType === "demo"
                    ? t("contact.formMessagePlaceholderDemo")
                    : t("contact.formMessagePlaceholder")
                }
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputBase} ${inputFocus} resize-none`}
              />
            </FormField>

            {/* ── Checkboxes ── */}
            <div className="flex flex-col gap-5 pt-4">
              {/* Privacy (required) */}
              <label className="flex items-center gap-3.5 cursor-pointer select-none group">
                <span className="w-6 h-6 rounded-md border-2 border-muted-foreground/30 flex items-center justify-center shrink-0 transition-colors group-hover:border-foreground data-[checked=true]:bg-foreground data-[checked=true]:border-foreground" data-checked={privacyAgreed}>
                  {privacyAgreed && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-6" stroke="hsl(var(--background))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="sr-only"
                  />
                </span>
                <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  {t("contact.formPrivacy")}
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </span>
              </label>

              {/* Marketing (optional) */}
              <label className="flex items-start gap-3.5 cursor-pointer select-none group">
                <span className="w-6 h-6 rounded-md border-2 border-muted-foreground/30 flex items-center justify-center shrink-0 mt-0.5 transition-colors group-hover:border-foreground data-[checked=true]:bg-foreground data-[checked=true]:border-foreground" data-checked={marketingAgreed}>
                  {marketingAgreed && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-6" stroke="hsl(var(--background))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                  <input
                    type="checkbox"
                    checked={marketingAgreed}
                    onChange={(e) => setMarketingAgreed(e.target.checked)}
                    className="sr-only"
                  />
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {t("contact.formMarketing")}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {t("contact.formMarketingDesc")}
                  </span>
                </div>
              </label>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-center rounded-lg py-2.5 px-4 font-medium bg-destructive/10 text-destructive border border-destructive/20">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !privacyAgreed}
              className="w-full py-4.5 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 mt-2"
              style={{
                background: "hsl(var(--foreground))",
                color: "hsl(var(--background))",
              }}
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
          </form>
        )}
      </div>
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
    <div className="flex flex-col gap-2.5">
      <label className="text-[13px] font-bold text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
