import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const COOKIE_KEY = "webheads_cookie_consent";

const CookieConsent = () => {
  const { i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ essential: true, analytics: true, marketing: true, date: new Date().toISOString() }));
    setVisible(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ essential: true, analytics, marketing, date: new Date().toISOString() }));
    setVisible(false);
  };

  if (!visible) return null;

  const isKo = i18n.language === "ko";
  const isJa = i18n.language === "ja";

  const desc = isKo
    ? "당사는 웹사이트 운영, 더 나은 브라우징 경험 제공, 웹사이트 트래픽 분석을 위해 쿠키 및 관련 기술을 사용합니다."
    : isJa
    ? "当社はウェブサイトの運営、ブラウジング体験の向上、トラフィック分析のためにCookieを使用しています。"
    : "We use cookies to enhance your browsing experience and analyze website traffic.";

  const privacyLabel = isKo ? "개인정보 처리방침" : isJa ? "プライバシーポリシー" : "Privacy Policy";
  const btnAccept = isKo ? "모두 수락" : isJa ? "すべて許可" : "Accept all";
  const btnSettings = isKo ? "설정 관리" : isJa ? "設定管理" : "Manage preferences";
  const btnSave = isKo ? "설정 저장" : isJa ? "設定を保存" : "Save Settings";

  const labelEssential = isKo ? "필수 쿠키 (항상 활성)" : isJa ? "必須Cookie（常に有効）" : "Essential Cookies (Always Active)";
  const labelAnalytics = isKo ? "분석 쿠키" : isJa ? "分析Cookie" : "Analytics Cookies";
  const labelMarketing = isKo ? "마케팅 쿠키" : isJa ? "マーケティングCookie" : "Marketing Cookies";

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-4 duration-500">
      <div
        className="w-[320px] rounded-2xl p-6 shadow-2xl"
        style={{ background: "hsl(0, 0%, 8%)" }}
      >
        {/* Description */}
        {!showSettings && (
          <p className="text-sm leading-relaxed mb-5 text-center" style={{ color: "hsl(0, 0%, 75%)" }}>
            {desc}{" "}
            <span
              className="underline underline-offset-2 cursor-pointer transition-colors"
              style={{ color: "hsl(0, 0%, 90%)" }}
              onClick={() => window.dispatchEvent(new CustomEvent("open-privacy-policy"))}
              onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(0, 0%, 100%)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(0, 0%, 90%)")}
            >
              {privacyLabel}
            </span>
          </p>
        )}

        {/* Settings panel */}
        {showSettings && (
          <div className="mb-4 p-3 rounded-xl space-y-3 text-xs" style={{ background: "hsl(0, 0%, 14%)" }}>
            <label className="flex items-center gap-2" style={{ color: "hsl(0, 0%, 50%)" }}>
              <input type="checkbox" checked disabled className="accent-primary rounded" />
              {labelEssential}
            </label>
            <label className="flex items-center gap-2 cursor-pointer" style={{ color: "hsl(0, 0%, 85%)" }}>
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="accent-primary rounded" />
              {labelAnalytics}
            </label>
            <label className="flex items-center gap-2 cursor-pointer" style={{ color: "hsl(0, 0%, 85%)" }}>
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="accent-primary rounded" />
              {labelMarketing}
            </label>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          {!showSettings ? (
            <>
              <button
                onClick={handleAcceptAll}
                className="w-full py-3.5 text-sm font-semibold rounded-xl transition-colors"
                style={{ background: "hsl(0, 0%, 95%)", color: "hsl(0, 0%, 10%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(0, 0%, 100%)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(0, 0%, 95%)")}
              >
                {btnAccept}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="w-full py-3.5 text-sm font-semibold rounded-xl transition-colors"
                style={{ background: "hsl(0, 0%, 20%)", color: "hsl(0, 0%, 80%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(0, 0%, 28%)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(0, 0%, 20%)")}
              >
                {btnSettings}
              </button>
            </>
          ) : (
            <button
              onClick={handleSaveSettings}
              className="w-full py-3.5 text-sm font-semibold rounded-xl transition-colors"
              style={{ background: "hsl(0, 0%, 95%)", color: "hsl(0, 0%, 10%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(0, 0%, 100%)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(0, 0%, 95%)")}
            >
              {btnSave}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
