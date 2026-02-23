import { useState } from "react";
import { Send, Mail, Loader2, Clock, Phone, ChevronDown, Monitor } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

type InquiryType = "consultation" | "demo";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const inputClass =
    "w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/60";

  const inputStyle = (field: string) => ({
    border:
      focusedField === field
        ? "1.5px solid hsl(var(--primary))"
        : "1px solid hsl(var(--border))",
    background:
      focusedField === field ? "hsl(var(--background))" : "hsl(var(--muted))",
    color: "hsl(var(--foreground))",
    boxShadow:
      focusedField === field
        ? "0 0 0 3px hsl(var(--primary) / 0.08), 0 2px 8px hsl(var(--primary) / 0.06)"
        : "none",
  });

  return (
    <section
      id="contact"
      className="py-28 border-t border-border"
      style={{
        background: "var(--contact-bg)",
      }}
    >
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-primary">
            {t("contact.sub")}
          </p>
          <h2
            className="leading-tight text-4xl lg:text-5xl tracking-tight text-foreground"
            style={{ fontWeight: 900 }}
          >
            {t("contact.title")}{" "}
            <span className="text-primary">
              {t("contact.titleHighlight")}
            </span>
            {t("contact.titleEnd")}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            {t("contact.desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Phone numbers */}
            <div
              className="rounded-2xl p-7 transition-all duration-300 group bg-card border border-border hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex items-stretch gap-0 divide-x divide-border">
                <div className="flex-1 pr-4 sm:pr-6 min-w-0">
                  <p className="text-[0.65rem] sm:text-[0.7rem] font-semibold mb-2 uppercase tracking-wider text-muted-foreground">
                    {t("contact.newInquiry")}
                  </p>
                  <a
                    href="tel:0233364338"
                    className="block text-lg sm:text-[1.45rem] tracking-tight transition-colors text-foreground hover:text-primary"
                    style={{ fontWeight: 900 }}
                  >
                    02.336.4338
                  </a>
                </div>
                <div className="flex-1 pl-4 sm:pl-6 min-w-0">
                  <p className="text-[0.65rem] sm:text-[0.7rem] font-semibold mb-2 uppercase tracking-wider text-muted-foreground">
                    {t("contact.maintenanceInquiry")}
                  </p>
                  <a
                    href="tel:0254044337"
                    className="block text-lg sm:text-[1.45rem] tracking-tight transition-colors text-foreground hover:text-primary"
                    style={{ fontWeight: 900 }}
                  >
                    02.540.4337
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="rounded-2xl p-7 flex items-center gap-5 transition-all duration-300 bg-card border border-border hover:border-primary/30 hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[0.7rem] font-semibold mb-1 uppercase tracking-wider text-muted-foreground">
                  {t("contact.emailInquiry")}
                </p>
                <a
                  href="mailto:34bus@webheads.co.kr"
                  className="font-bold text-[1.1rem] leading-snug transition-colors text-foreground hover:text-primary"
                >
                  34bus@webheads.co.kr
                </a>
                <p className="text-[0.78rem] mt-0.5 text-primary">
                  {t("contact.emailAvailable")}
                </p>
              </div>
            </div>

            {/* Business hours */}
            <div className="rounded-2xl p-7 flex items-start gap-5 transition-all duration-300 bg-card border border-border hover:border-primary/30 hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[0.7rem] font-semibold mb-1 uppercase tracking-wider text-muted-foreground">
                  {t("contact.businessHours")}
                </p>
                <p className="text-[1.1rem] font-bold leading-snug text-foreground">
                  {t("contact.businessHoursValue")}
                </p>
                <div className="mt-0.5 flex flex-col gap-0.5">
                  <p className="text-[0.78rem] text-muted-foreground">
                    {t("contact.lunchBreak")}
                  </p>
                  <p className="text-[0.78rem] text-muted-foreground">
                    {t("contact.holiday")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-4 min-h-[500px] backdrop-blur-sm bg-card/90 border border-border shadow-card">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
                  style={{
                    background: "var(--primary-gradient)",
                    boxShadow: "0 8px 24px hsl(var(--primary) / 0.3)",
                  }}
                >
                  <Send className="w-7 h-7 text-white" />
                </div>
                <h3
                  className="text-2xl tracking-tight text-foreground"
                  style={{ fontWeight: 900 }}
                >
                  {t("contact.successTitle")}
                </h3>
                <p className="text-sm leading-relaxed max-w-xs whitespace-pre-line text-muted-foreground">
                  {t("contact.successDesc")}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80 bg-secondary text-foreground"
                >
                  {t("contact.successRetry")}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl p-8 lg:p-10 flex flex-col gap-5 backdrop-blur-sm bg-card/90 border border-border shadow-card"
              >
                {showDemo && (
                  <div className="flex rounded-xl p-1 gap-1 bg-muted">
                    <button
                      type="button"
                      onClick={() => setInquiryType("consultation")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                        inquiryType === "consultation"
                          ? "bg-background text-primary shadow-sm"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      {t("contact.tabConsultation")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryType("demo")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                        inquiryType === "demo"
                          ? "bg-background text-primary shadow-sm"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                      {t("contact.tabDemo")}
                    </button>
                  </div>
                )}
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold tracking-wide text-foreground">
                      {t("contact.formCompany")}{" "}
                      <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("contact.formCompanyPlaceholder")}
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                      onFocus={() => setFocusedField("company")}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass}
                      style={inputStyle("company")}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold tracking-wide text-foreground">
                      {t("contact.formName")}{" "}
                      <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("contact.formNamePlaceholder")}
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass}
                      style={inputStyle("name")}
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold tracking-wide text-foreground">
                      {t("contact.formPhone")}{" "}
                      <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={t("contact.formPhonePlaceholder")}
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass}
                      style={inputStyle("phone")}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold tracking-wide text-foreground">
                      {t("contact.formEmail")}
                    </label>
                    <input
                      type="email"
                      placeholder={t("contact.formEmailPlaceholder")}
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass}
                      style={inputStyle("email")}
                    />
                  </div>
                </div>

                {/* Service */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold tracking-wide text-foreground">
                    {t("contact.formService")}
                  </label>
                  <div className="relative">
                    <select
                      value={form.service}
                      onChange={(e) =>
                        setForm({ ...form, service: e.target.value })
                      }
                      onFocus={() => setFocusedField("service")}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                      style={inputStyle("service")}
                    >
                      <option value="">
                        {t("contact.formServicePlaceholder")}
                      </option>
                      {services.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold tracking-wide text-foreground">
                    {t("contact.formMessage")}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={inquiryType === "demo" ? t("contact.formMessagePlaceholderDemo") : t("contact.formMessagePlaceholder")}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    className={`${inputClass} resize-none`}
                    style={inputStyle("message")}
                  />
                </div>

                {error && (
                  <p className="text-sm text-center rounded-xl py-2.5 px-4 font-medium bg-destructive/10 text-destructive border border-destructive/20">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 mt-1 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
                  style={{
                    background: "var(--primary-gradient)",
                    color: "hsl(var(--primary-foreground))",
                    boxShadow: "0 4px 16px hsl(var(--primary) / 0.3)",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("contact.formSending")}
                    </>
                  ) : (
                    <>
                      {inquiryType === "demo" ? <Monitor className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                      {inquiryType === "demo" ? t("contact.formSubmitDemo") : t("contact.formSubmit")}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
