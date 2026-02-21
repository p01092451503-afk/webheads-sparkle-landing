import { useState } from "react";
import { Send, Mail, Loader2, Clock, Phone, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

export default function ContactSection() {
  const { t } = useTranslation();
  const services = t("contact.services", { returnObjects: true }) as string[];

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
        { body: form }
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
        ? "1.5px solid hsl(214, 90%, 52%)"
        : "1px solid hsl(var(--border))",
    background:
      focusedField === field ? "hsl(0, 0%, 100%)" : "hsl(var(--muted))",
    color: "hsl(var(--foreground))",
    boxShadow:
      focusedField === field
        ? "0 0 0 3px hsl(214 90% 52% / 0.08), 0 2px 8px hsl(214 90% 52% / 0.06)"
        : "none",
  });

  return (
    <section
      id="contact"
      className="py-28 border-t"
      style={{
        background:
          "linear-gradient(180deg, hsl(214, 30%, 97%) 0%, hsl(214, 25%, 94%) 100%)",
        borderColor: "hsl(var(--border))",
      }}
    >
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-16">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: "hsl(var(--primary))" }}
          >
            {t("contact.sub")}
          </p>
          <h2
            className="leading-tight text-4xl lg:text-5xl tracking-tight"
            style={{ fontWeight: 900, color: "hsl(var(--foreground))" }}
          >
            {t("contact.title")}{" "}
            <span style={{ color: "hsl(var(--primary))" }}>
              {t("contact.titleHighlight")}
            </span>
            {t("contact.titleEnd")}
          </h2>
          <p
            className="mt-4 text-base"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {t("contact.desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Phone numbers */}
            <div
              className="rounded-2xl p-7 transition-all duration-300 group"
              style={{
                background: "hsl(0 0% 100%)",
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 2px 8px hsl(220 60% 8% / 0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px hsl(214 90% 52% / 0.1)";
                e.currentTarget.style.borderColor = "hsl(214, 80%, 85%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px hsl(220 60% 8% / 0.04)";
                e.currentTarget.style.borderColor = "hsl(var(--border))";
              }}
            >
              <div
                className="flex items-stretch gap-0 divide-x"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <div className="flex-1 pr-6">
                  <p
                    className="text-[0.7rem] font-semibold mb-2 uppercase tracking-wider"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {t("contact.newInquiry")}
                  </p>
                  <a
                    href="tel:0233364338"
                    className="block text-[1.45rem] tracking-tight transition-colors"
                    style={{
                      fontWeight: 900,
                      color: "hsl(var(--foreground))",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "hsl(214, 90%, 52%)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "hsl(var(--foreground))"}
                  >
                    02.336.4338
                  </a>
                </div>
                <div className="flex-1 pl-6">
                  <p
                    className="text-[0.7rem] font-semibold mb-2 uppercase tracking-wider"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {t("contact.maintenanceInquiry")}
                  </p>
                  <a
                    href="tel:0254044337"
                    className="block text-[1.45rem] tracking-tight transition-colors"
                    style={{
                      fontWeight: 900,
                      color: "hsl(var(--foreground))",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "hsl(214, 90%, 52%)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "hsl(var(--foreground))"}
                  >
                    02.540.4337
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div
              className="rounded-2xl p-7 flex items-center gap-5 transition-all duration-300"
              style={{
                background: "hsl(0 0% 100%)",
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 2px 8px hsl(220 60% 8% / 0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px hsl(214 90% 52% / 0.1)";
                e.currentTarget.style.borderColor = "hsl(214, 80%, 85%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px hsl(220 60% 8% / 0.04)";
                e.currentTarget.style.borderColor = "hsl(var(--border))";
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "hsl(var(--primary) / 0.08)",
                }}
              >
                <Mail
                  className="w-5 h-5"
                  style={{ color: "hsl(var(--primary))" }}
                />
              </div>
              <div>
                <p
                  className="text-[0.7rem] font-semibold mb-1 uppercase tracking-wider"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {t("contact.emailInquiry")}
                </p>
                <a
                  href="mailto:34bus@webheads.co.kr"
                  className="font-bold text-[1.1rem] leading-snug transition-colors"
                  style={{ color: "hsl(var(--foreground))" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "hsl(214, 90%, 52%)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "hsl(var(--foreground))"}
                >
                  34bus@webheads.co.kr
                </a>
                <p
                  className="text-[0.78rem] mt-0.5"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {t("contact.emailAvailable")}
                </p>
              </div>
            </div>

            {/* Business hours */}
            <div
              className="rounded-2xl p-7 flex items-start gap-5 transition-all duration-300"
              style={{
                background: "hsl(0 0% 100%)",
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 2px 8px hsl(220 60% 8% / 0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px hsl(214 90% 52% / 0.1)";
                e.currentTarget.style.borderColor = "hsl(214, 80%, 85%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px hsl(220 60% 8% / 0.04)";
                e.currentTarget.style.borderColor = "hsl(var(--border))";
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "hsl(var(--primary) / 0.08)",
                }}
              >
                <Clock
                  className="w-5 h-5"
                  style={{ color: "hsl(var(--primary))" }}
                />
              </div>
              <div>
                <p
                  className="text-[0.7rem] font-semibold mb-1 uppercase tracking-wider"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {t("contact.businessHours")}
                </p>
                <p
                  className="text-[1.1rem] font-bold leading-snug"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {t("contact.businessHoursValue")}
                </p>
                <div className="mt-0.5 flex flex-col gap-0.5">
                  <p
                    className="text-[0.78rem]"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {t("contact.lunchBreak")}
                  </p>
                  <p
                    className="text-[0.78rem]"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {t("contact.holiday")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div
                className="rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-4 min-h-[500px] backdrop-blur-sm"
                style={{
                  background: "hsl(0 0% 100% / 0.9)",
                  border: "1px solid hsl(var(--border))",
                  boxShadow:
                    "0 4px 24px hsl(220 60% 8% / 0.06), 0 1px 3px hsl(220 60% 8% / 0.04)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
                  style={{
                    background: "var(--primary-gradient)",
                    boxShadow: "0 8px 24px hsl(214 90% 52% / 0.3)",
                  }}
                >
                  <Send className="w-7 h-7 text-white" />
                </div>
                <h3
                  className="text-2xl tracking-tight"
                  style={{
                    fontWeight: 900,
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {t("contact.successTitle")}
                </h3>
                <p
                  className="text-sm leading-relaxed max-w-xs whitespace-pre-line"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {t("contact.successDesc")}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
                  style={{
                    background: "hsl(var(--secondary))",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {t("contact.successRetry")}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl p-8 lg:p-10 flex flex-col gap-5 backdrop-blur-sm"
                style={{
                  background: "hsl(0 0% 100% / 0.9)",
                  border: "1px solid hsl(var(--border))",
                  boxShadow:
                    "0 4px 24px hsl(220 60% 8% / 0.06), 0 1px 3px hsl(220 60% 8% / 0.04)",
                }}
              >
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-xs font-bold tracking-wide"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {t("contact.formCompany")}{" "}
                      <span style={{ color: "hsl(var(--primary))" }}>*</span>
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
                    <label
                      className="text-xs font-bold tracking-wide"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {t("contact.formName")}{" "}
                      <span style={{ color: "hsl(var(--primary))" }}>*</span>
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
                    <label
                      className="text-xs font-bold tracking-wide"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {t("contact.formPhone")}{" "}
                      <span style={{ color: "hsl(var(--primary))" }}>*</span>
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
                    <label
                      className="text-xs font-bold tracking-wide"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
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
                  <label
                    className="text-xs font-bold tracking-wide"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
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
                    <ChevronDown
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs font-bold tracking-wide"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {t("contact.formMessage")}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t("contact.formMessagePlaceholder")}
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
                  <p
                    className="text-sm text-center rounded-xl py-2.5 px-4 font-medium"
                    style={{
                      background: "hsl(0, 100%, 97%)",
                      color: "hsl(0, 72%, 51%)",
                      border: "1px solid hsl(0, 80%, 90%)",
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "var(--primary-gradient)",
                    color: "hsl(var(--primary-foreground))",
                    boxShadow: "0 4px 16px hsl(214 90% 52% / 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px hsl(214 90% 52% / 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px hsl(214 90% 52% / 0.3)";
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("contact.formSending")}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t("contact.formSubmit")}
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
