import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Send, Loader2, ChevronDown, MessageSquareText, MonitorSmartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

type RequestType = "sms_recharge" | "remote_support";

const SMS_AMOUNTS = ["1만원", "3만원", "5만원", "10만원", "30만원", "50만원"];
const SMS_COUNTS = ["50,000건", "100,000건", "500,000건", "1,000,000건"];
type RechargeUnit = "amount" | "count";

export default function ServiceRequestPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type");
  const [requestType, setRequestType] = useState<RequestType>(initialType === "remote" ? "remote_support" : "sms_recharge");
  const [form, setForm] = useState({
    company: "",
    name: "",
    phone: "",
    email: "",
    amount: "",
    reason: "",
    preferred_datetime: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [rechargeUnit, setRechargeUnit] = useState<RechargeUnit>("amount");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAgreed) {
      setError(t("serviceRequest.privacyError"));
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "submit-service-request",
        {
          body: {
            request_type: requestType,
            company: form.company,
            name: form.name,
            phone: form.phone,
            email: form.email || undefined,
            amount: requestType === "sms_recharge" ? form.amount : undefined,
            reason: requestType === "remote_support" ? form.reason : undefined,
            preferred_datetime: requestType === "remote_support" ? form.preferred_datetime : undefined,
            session_id: sessionStorage.getItem("_sid") || undefined,
          },
        }
      );
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || t("serviceRequest.submitError"));
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-lg px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/40 bg-muted border border-border";
  const inputFocus =
    "focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10";

  return (
    <>
      <Helmet>
        <title>{t("serviceRequest.pageTitle")}</title>
        <meta name="description" content={t("serviceRequest.pageDesc")} />
      </Helmet>
      <section className="pt-20 pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-6 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1
              className="text-3xl lg:text-4xl leading-tight tracking-tight text-primary"
              style={{ fontWeight: 900 }}
            >
              {t("serviceRequest.heading")}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("serviceRequest.subheading")}
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4 min-h-[360px] bg-card border border-border">
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
                {t("serviceRequest.successTitle")}
              </h3>
              <p className="text-sm leading-relaxed max-w-xs text-muted-foreground whitespace-pre-line">
                {requestType === "sms_recharge"
                  ? t("serviceRequest.successSms")
                  : t("serviceRequest.successRemote")}
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setPrivacyAgreed(false);
                  setForm({ company: "", name: "", phone: "", email: "", amount: "", reason: "", preferred_datetime: "" });
                }}
                className="mt-3 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-80 bg-secondary text-foreground"
              >
                {t("serviceRequest.retry")}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl p-8 lg:p-10 flex flex-col gap-5 bg-card border border-border shadow-sm"
            >
              {/* Type tabs — hide when remote-only */}
              {!remoteOnly && (
                <div className="flex rounded-lg p-1 gap-1 bg-muted">
                  <button
                    type="button"
                    onClick={() => setRequestType("sms_recharge")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-md text-sm font-bold transition-all duration-200 ${
                      requestType === "sms_recharge"
                        ? "bg-background text-primary shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    <MessageSquareText className="w-3.5 h-3.5" />
                    {t("serviceRequest.tabSms")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestType("remote_support")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-md text-sm font-bold transition-all duration-200 ${
                      requestType === "remote_support"
                        ? "bg-background text-primary shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    <MonitorSmartphone className="w-3.5 h-3.5" />
                    {t("serviceRequest.tabRemote")}
                  </button>
                </div>
              )}
              {requestType === "remote_support" && (
                <p className="text-xs text-muted-foreground -mt-2">
                  {t("serviceRequest.remoteNote")}
                </p>
              )}

              {/* Company + Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FieldLabel label={t("serviceRequest.company")} required>
                  <input
                    type="text"
                    required
                    placeholder={t("serviceRequest.companyPlaceholder")}
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className={`${inputBase} ${inputFocus}`}
                  />
                </FieldLabel>
                <FieldLabel label={t("serviceRequest.name")} required>
                  <input
                    type="text"
                    required
                    placeholder={t("serviceRequest.namePlaceholder")}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`${inputBase} ${inputFocus}`}
                  />
                </FieldLabel>
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FieldLabel label={t("serviceRequest.phone")} required>
                  <input
                    type="tel"
                    required
                    placeholder={t("serviceRequest.phonePlaceholder")}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`${inputBase} ${inputFocus}`}
                  />
                </FieldLabel>
                <FieldLabel label={t("serviceRequest.email")}>
                  <input
                    type="email"
                    placeholder={t("serviceRequest.emailPlaceholder")}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`${inputBase} ${inputFocus}`}
                  />
                </FieldLabel>
              </div>

              {/* Conditional fields */}
              {requestType === "sms_recharge" && (
                <>
                  {/* Unit toggle */}
                  <div className="flex rounded-lg p-1 gap-1 bg-muted">
                    <button
                      type="button"
                      onClick={() => { setRechargeUnit("amount"); setForm({ ...form, amount: "" }); setIsCustomAmount(false); }}
                      className={`flex-1 py-2 rounded-md text-xs font-bold transition-all duration-200 ${
                        rechargeUnit === "amount" ? "bg-background text-primary shadow-sm" : "text-muted-foreground"
                      }`}
                    >
                      {t("serviceRequest.unitAmount")}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRechargeUnit("count"); setForm({ ...form, amount: "" }); setIsCustomAmount(false); }}
                      className={`flex-1 py-2 rounded-md text-xs font-bold transition-all duration-200 ${
                        rechargeUnit === "count" ? "bg-background text-primary shadow-sm" : "text-muted-foreground"
                      }`}
                    >
                      {t("serviceRequest.unitCount")}
                    </button>
                  </div>

                  <FieldLabel label={rechargeUnit === "amount" ? t("serviceRequest.amountLabel") : t("serviceRequest.countLabel")} required>
                    <div className="relative">
                      <select
                        value={isCustomAmount ? "custom" : form.amount}
                        onChange={(e) => {
                          if (e.target.value === "custom") {
                            setIsCustomAmount(true);
                            setForm({ ...form, amount: "" });
                          } else {
                            setIsCustomAmount(false);
                            setForm({ ...form, amount: e.target.value });
                          }
                        }}
                        className={`${inputBase} ${inputFocus} appearance-none pr-10 cursor-pointer`}
                      >
                        <option value="">{rechargeUnit === "amount" ? t("serviceRequest.amountPlaceholder") : t("serviceRequest.countPlaceholder")}</option>
                        {(rechargeUnit === "amount" ? SMS_AMOUNTS : SMS_COUNTS).map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                        <option value="custom">{t("serviceRequest.customOption")}</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
                    </div>
                  </FieldLabel>
                  {isCustomAmount && (
                    <FieldLabel label={rechargeUnit === "amount" ? t("serviceRequest.customAmountLabel") : t("serviceRequest.customCountLabel")} required>
                      <input
                        type="text"
                        required
                        placeholder={rechargeUnit === "amount" ? t("serviceRequest.customAmountPlaceholder") : t("serviceRequest.customCountPlaceholder")}
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        className={`${inputBase} ${inputFocus}`}
                      />
                    </FieldLabel>
                  )}
                </>
              )}

              {requestType === "remote_support" && (
                <>
                  <FieldLabel label={t("serviceRequest.reasonLabel")} required>
                    <textarea
                      required
                      rows={3}
                      placeholder={t("serviceRequest.reasonPlaceholder")}
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      className={`${inputBase} ${inputFocus} resize-none`}
                    />
                  </FieldLabel>
                  <FieldLabel label={t("serviceRequest.datetimeLabel")}>
                    <input
                      type="text"
                      placeholder={t("serviceRequest.datetimePlaceholder")}
                      value={form.preferred_datetime}
                      onChange={(e) => setForm({ ...form, preferred_datetime: e.target.value })}
                      className={`${inputBase} ${inputFocus}`}
                    />
                  </FieldLabel>
                </>
              )}

              {/* Privacy */}
              <label className="flex items-center gap-3 cursor-pointer select-none group pt-2">
                <input
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="w-[18px] h-[18px] rounded border-2 border-border accent-primary cursor-pointer shrink-0"
                />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {t("serviceRequest.privacy")}
                </span>
              </label>

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
                className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 bg-foreground text-background"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("serviceRequest.sending")}
                  </>
                ) : (
                  <>
                    {requestType === "sms_recharge" ? t("serviceRequest.submitSms") : t("serviceRequest.submitRemote")}
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-xs text-muted-foreground mt-8">
            {t("serviceRequest.copyright")}
          </p>
        </div>
      </section>
    </>
  );
}

function FieldLabel({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
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
