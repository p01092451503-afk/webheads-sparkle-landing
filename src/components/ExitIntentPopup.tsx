import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { X, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DISMISSED_KEY = "_wh_exit_dismissed";
const SUBMITTED_KEY = "_wh_exit_submitted";
const MIN_TIME_MS = 8000; // Show only after 8s on page

export default function ExitIntentPopup() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const mountTime = useRef(Date.now());
  const triggered = useRef(false);

  const dismiss = useCallback(() => {
    setShow(false);
    try { sessionStorage.setItem(DISMISSED_KEY, "1"); } catch {}
  }, []);

  // Exit intent detection (mouse leaves viewport top)
  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(DISMISSED_KEY);
    const wasSubmitted = sessionStorage.getItem(SUBMITTED_KEY);
    if (wasDismissed || wasSubmitted) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (triggered.current) return;
      if (e.clientY > 5) return; // only top exit
      if (Date.now() - mountTime.current < MIN_TIME_MS) return;
      triggered.current = true;
      setShow(true);
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show, dismiss]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(t("exitPopup.invalidEmail"));
      return;
    }

    setSubmitting(true);
    try {
      await supabase.from("contact_inquiries").insert({
        name: "Exit Popup Lead",
        company: "-",
        phone: "-",
        email: trimmed,
        inquiry_type: "exit_lead",
        message: "Exit intent popup lead capture",
        marketing_agreed: false,
      });
      setDone(true);
      try { sessionStorage.setItem(SUBMITTED_KEY, "1"); } catch {}
    } catch {
      setError(t("exitPopup.error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={dismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl bg-background border border-border shadow-2xl p-8 animate-in zoom-in-95 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {done ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "hsl(145, 60%, 93%)" }}>
              <CheckCircle2 className="w-7 h-7" style={{ color: "hsl(145, 60%, 38%)" }} />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">{t("exitPopup.thankTitle")}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{t("exitPopup.thankDesc")}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "hsl(var(--lms-primary) / 0.1)" }}>
                <MessageSquare className="w-5 h-5" style={{ color: "hsl(var(--lms-primary))" }} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg tracking-tight leading-snug">{t("exitPopup.title")}</h3>
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">{t("exitPopup.desc")}</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("exitPopup.placeholder")}
                className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                autoFocus
                maxLength={255}
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "hsl(var(--lms-primary))" }}
              >
                {submitting ? t("exitPopup.sending") : t("exitPopup.cta")}
                {!submitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <p className="text-[11px] text-muted-foreground/60 text-center mt-4 leading-relaxed">{t("exitPopup.privacy")}</p>
          </>
        )}
      </div>
    </div>
  );
}
