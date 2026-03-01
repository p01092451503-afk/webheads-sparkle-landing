import { useState } from "react";
import { Link } from "react-router-dom";
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
  const [requestType, setRequestType] = useState<RequestType>("sms_recharge");
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
      setError("개인정보 수집 및 이용에 동의해주세요.");
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
      setError(err.message || "요청 전송 중 오류가 발생했습니다.");
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
        <title>서비스 요청 | 웹헤즈</title>
        <meta name="description" content="SMS 충전 및 카테노이드 원격지원 요청" />
      </Helmet>
      <section className="py-24 bg-background min-h-screen">
        <div className="container mx-auto px-6 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1
              className="text-3xl lg:text-4xl leading-tight tracking-tight text-primary"
              style={{ fontWeight: 900 }}
            >
              서비스 요청
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              SMS 충전 또는 카테노이드 원격지원이 필요하신 경우 아래 양식을 작성해주세요.
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
                요청이 접수되었습니다
              </h3>
              <p className="text-sm leading-relaxed max-w-xs text-muted-foreground">
                {requestType === "sms_recharge"
                  ? "SMS 충전 요청이 접수되었습니다.\n확인 후 빠르게 처리해드리겠습니다."
                  : "원격지원 요청이 접수되었습니다.\n담당자가 확인 후 연락드리겠습니다."}
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setPrivacyAgreed(false);
                  setForm({ company: "", name: "", phone: "", email: "", amount: "", reason: "", preferred_datetime: "" });
                }}
                className="mt-3 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-80 bg-secondary text-foreground"
              >
                추가 요청하기
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl p-8 lg:p-10 flex flex-col gap-5 bg-card border border-border shadow-sm"
            >
              {/* Type tabs */}
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
                  SMS 충전
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
                  원격지원 요청
                </button>
              </div>
              {requestType === "remote_support" && (
                <p className="text-xs text-muted-foreground -mt-2">
                  원격지원 요청 접수 후, 웹헤즈가 카테노이드에 지원을 재접수하는 절차를 거칩니다. 확인 완료 후 담당자가 연락드립니다.
                </p>
              )}

              {/* Company + Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FieldLabel label="회사명" required>
                  <input
                    type="text"
                    required
                    placeholder="회사명을 입력해주세요"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className={`${inputBase} ${inputFocus}`}
                  />
                </FieldLabel>
                <FieldLabel label="담당자명" required>
                  <input
                    type="text"
                    required
                    placeholder="담당자 성함"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`${inputBase} ${inputFocus}`}
                  />
                </FieldLabel>
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FieldLabel label="연락처" required>
                  <input
                    type="tel"
                    required
                    placeholder="010-0000-0000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`${inputBase} ${inputFocus}`}
                  />
                </FieldLabel>
                <FieldLabel label="이메일">
                  <input
                    type="email"
                    placeholder="email@company.com"
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
                      금액으로 충전
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRechargeUnit("count"); setForm({ ...form, amount: "" }); setIsCustomAmount(false); }}
                      className={`flex-1 py-2 rounded-md text-xs font-bold transition-all duration-200 ${
                        rechargeUnit === "count" ? "bg-background text-primary shadow-sm" : "text-muted-foreground"
                      }`}
                    >
                      건수로 충전
                    </button>
                  </div>

                  <FieldLabel label={rechargeUnit === "amount" ? "충전 금액" : "충전 건수"} required>
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
                        <option value="">{rechargeUnit === "amount" ? "충전 금액을 선택해주세요" : "충전 건수를 선택해주세요"}</option>
                        {(rechargeUnit === "amount" ? SMS_AMOUNTS : SMS_COUNTS).map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                        <option value="custom">직접 입력</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
                    </div>
                  </FieldLabel>
                  {isCustomAmount && (
                    <FieldLabel label={rechargeUnit === "amount" ? "금액 직접 입력" : "건수 직접 입력"} required>
                      <input
                        type="text"
                        required
                        placeholder={rechargeUnit === "amount" ? "예: 100,000원" : "예: 200,000건"}
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
                  <FieldLabel label="지원 사유" required>
                    <textarea
                      required
                      rows={3}
                      placeholder="어떤 문제로 원격지원이 필요한지 간략히 설명해주세요"
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      className={`${inputBase} ${inputFocus} resize-none`}
                    />
                  </FieldLabel>
                  <FieldLabel label="희망 일시">
                    <input
                      type="text"
                      placeholder="예: 2026-03-03 오후 2시"
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
                  개인정보 수집 및 이용에 동의합니다 (필수)
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
                    전송 중...
                  </>
                ) : (
                  <>
                    {requestType === "sms_recharge" ? "SMS 충전 요청" : "원격지원 요청"}
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-xs text-muted-foreground mt-8">
            Copyright ⓒ 2010 - 2026 Webheads, Inc. All rights reserved.
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
