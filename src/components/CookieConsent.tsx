import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Cookie } from "lucide-react";

const COOKIE_KEY = "webheads_cookie_consent";

const CookieConsent = () => {
  const { t, i18n } = useTranslation();
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

  const handleRejectOptional = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ essential: true, analytics: false, marketing: false, date: new Date().toISOString() }));
    setVisible(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ essential: true, analytics, marketing, date: new Date().toISOString() }));
    setVisible(false);
  };

  if (!visible) return null;

  const isKo = i18n.language === "ko";
  const isJa = i18n.language === "ja";

  const title = isKo ? "웹헤즈의 쿠키 사용 안내" : isJa ? "Webheadsのクッキー使用について" : "How Webheads Uses Cookies";
  const desc = isKo
    ? "당사는 웹사이트 운영, 더 나은 브라우징 경험 제공, 웹사이트 트래픽 분석을 위해 쿠키 및 관련 기술을 사용합니다. 본 웹사이트의 쿠키 사용에 대한 자세한 내용은 개인정보 처리방침을 참조하십시오."
    : isJa
    ? "当社はウェブサイトの運営、ブラウジング体験の向上、トラフィック分析のためにCookieを使用しています。"
    : "We use cookies and related technologies to operate our website, provide a better browsing experience, and analyze website traffic. For more details, please refer to our Privacy Policy.";

  const btnSettings = isKo ? "설정 관리" : isJa ? "設定管理" : "Manage Settings";
  const btnAccept = isKo ? "모두 수락" : isJa ? "すべて許可" : "Accept All";
  const btnReject = isKo ? "선택 사항 거부" : isJa ? "オプション拒否" : "Reject Optional";
  const btnSave = isKo ? "설정 저장" : isJa ? "設定を保存" : "Save Settings";

  const labelEssential = isKo ? "필수 쿠키 (항상 활성)" : isJa ? "必須Cookie（常に有効）" : "Essential Cookies (Always Active)";
  const labelAnalytics = isKo ? "분석 쿠키" : isJa ? "分析Cookie" : "Analytics Cookies";
  const labelMarketing = isKo ? "마케팅 쿠키" : isJa ? "マーケティングCookie" : "Marketing Cookies";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-in slide-in-from-bottom duration-500">
      <div className="bg-[hsl(220,20%,10%)] text-[hsl(0,0%,92%)] border-t border-[hsl(220,15%,20%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          {/* Close */}
          <button
            onClick={handleRejectOptional}
            className="absolute top-3 right-4 text-[hsl(0,0%,60%)] hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Title */}
          <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
            <Cookie size={16} className="text-primary" />
            {title}
          </h3>

          {/* Description */}
          <p className="text-xs leading-relaxed text-[hsl(0,0%,65%)] max-w-4xl mb-4">
            {desc}
          </p>

          {/* Settings panel */}
          {showSettings && (
            <div className="mb-4 p-3 rounded-md bg-[hsl(220,15%,15%)] space-y-3 text-xs">
              <label className="flex items-center gap-2 text-[hsl(0,0%,60%)]">
                <input type="checkbox" checked disabled className="accent-primary" />
                {labelEssential}
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="accent-primary"
                />
                {labelAnalytics}
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="accent-primary"
                />
                {labelMarketing}
              </label>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-2">
            {!showSettings ? (
              <>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 text-xs font-medium rounded-md border border-[hsl(0,0%,40%)] text-white hover:bg-[hsl(220,15%,20%)] transition-colors"
                >
                  {btnSettings}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-xs font-medium rounded-md bg-white text-[hsl(220,20%,10%)] hover:bg-[hsl(0,0%,90%)] transition-colors"
                >
                  {btnAccept}
                </button>
                <button
                  onClick={handleRejectOptional}
                  className="px-4 py-2 text-xs font-medium rounded-md border border-[hsl(0,0%,30%)] text-[hsl(0,0%,60%)] hover:text-white hover:border-[hsl(0,0%,50%)] transition-colors"
                >
                  {btnReject}
                </button>
              </>
            ) : (
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 text-xs font-medium rounded-md bg-white text-[hsl(220,20%,10%)] hover:bg-[hsl(0,0%,90%)] transition-colors"
              >
                {btnSave}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
