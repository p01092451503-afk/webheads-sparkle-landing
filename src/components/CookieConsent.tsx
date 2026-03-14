import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

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
    setShowSettings(false);
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
  const btnSave = isKo ? "저장" : isJa ? "保存" : "Save";

  const settingsTitle = isKo ? "쿠키 설정" : isJa ? "Cookie設定" : "Storage Preferences";
  const settingsDesc = isKo
    ? "웹사이트를 방문할 때 쿠키 및 유사 기술을 사용하여 데이터를 저장하거나 검색할 수 있습니다. 쿠키는 웹사이트의 기본 기능뿐 아니라 다른 목적에도 필요할 수 있습니다. 특정 유형의 쿠키를 비활성화할 수 있지만, 이는 웹사이트 경험에 영향을 줄 수 있습니다."
    : isJa
    ? "ウェブサイトを訪問すると、Cookieや類似技術を使用してデータを保存・取得する場合があります。特定のCookieを無効にすることができますが、ウェブサイトの使用体験に影響を与える可能性があります。"
    : "When you visit websites, they may store or retrieve data about you using cookies and similar technologies. You have the option of disabling certain types of cookies, though doing so may impact your experience on the website.";

  const categories = isKo
    ? [
        { key: "essential" as const, label: "필수 쿠키", desc: "웹사이트의 기본 기능을 활성화하는 데 필요합니다. 필수 쿠키는 비활성화할 수 없습니다.", locked: true, value: true },
        { key: "analytics" as const, label: "분석 쿠키", desc: "웹사이트 운영자가 웹사이트의 성능, 방문자 상호작용 및 기술적 문제 여부를 파악하는 데 도움을 줍니다.", locked: false, value: analytics, setter: setAnalytics },
        { key: "marketing" as const, label: "마케팅 쿠키", desc: "사용자의 관심사에 더 적합한 광고를 제공하는 데 사용됩니다. 광고의 노출 횟수를 제한하고 광고 캠페인의 효과를 측정하는 데에도 활용될 수 있습니다.", locked: false, value: marketing, setter: setMarketing },
      ]
    : isJa
    ? [
        { key: "essential" as const, label: "必須Cookie", desc: "ウェブサイトの基本機能に必要です。無効にできません。", locked: true, value: true },
        { key: "analytics" as const, label: "分析Cookie", desc: "ウェブサイトのパフォーマンスと訪問者の行動を理解するのに役立ちます。", locked: false, value: analytics, setter: setAnalytics },
        { key: "marketing" as const, label: "マーケティングCookie", desc: "関連性の高い広告を配信するために使用されます。", locked: false, value: marketing, setter: setMarketing },
      ]
    : [
        { key: "essential" as const, label: "Essential", desc: "Required to enable basic website functionality. You may not disable essential cookies.", locked: true, value: true },
        { key: "analytics" as const, label: "Analytics", desc: "Help the website operator understand how its website performs, how visitors interact with the site, and whether there may be technical issues.", locked: false, value: analytics, setter: setAnalytics },
        { key: "marketing" as const, label: "Marketing", desc: "Used to deliver advertising that is more relevant to you and your interests. May also be used to limit the number of times you see an advertisement.", locked: false, value: marketing, setter: setMarketing },
      ];

  // Settings full-screen modal
  if (showSettings) {
    return (
      <>
        <div className="fixed inset-0 z-[9999] bg-black/50" onClick={() => setShowSettings(false)} />
        <div
          className="fixed z-[10000] inset-4 md:inset-auto md:bottom-6 md:left-6 md:w-[420px] md:max-h-[80vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          style={{ background: "hsl(0, 0%, 8%)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
            <h2 className="text-lg font-bold" style={{ color: "hsl(0, 0%, 95%)" }}>{settingsTitle}</h2>
            <button
              onClick={() => setShowSettings(false)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "hsl(0, 0%, 60%)" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            <p className="text-sm leading-relaxed mt-2 mb-6" style={{ color: "hsl(0, 0%, 60%)" }}>
              {settingsDesc}
            </p>

            <div className="space-y-6">
              {categories.map((cat, idx) => (
                <div key={cat.key} className={idx < categories.length - 1 ? "pb-6 border-b border-[hsl(0,0%,18%)]" : ""}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[15px]" style={{ color: cat.locked ? "hsl(0, 0%, 60%)" : "hsl(0, 0%, 90%)" }}>
                      {cat.label}
                    </span>
                    <Switch
                      checked={cat.value}
                      disabled={cat.locked}
                      onCheckedChange={cat.setter ? (v) => cat.setter!(v) : undefined}
                      className="data-[state=checked]:bg-[hsl(0,0%,50%)] data-[state=unchecked]:bg-[hsl(0,0%,25%)]"
                    />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(0, 0%, 55%)" }}>
                    {cat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div className="px-6 py-4 shrink-0">
            <button
              onClick={handleSaveSettings}
              className="w-full py-3.5 text-sm font-semibold rounded-xl transition-colors"
              style={{ background: "hsl(0, 0%, 95%)", color: "hsl(0, 0%, 10%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(0, 0%, 100%)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(0, 0%, 95%)")}
            >
              {btnSave}
            </button>
          </div>
        </div>
      </>
    );
  }

  // Main cookie banner
  return (
    <div className="fixed bottom-6 left-6 z-[9999] animate-in slide-in-from-bottom-4 duration-500">
      <div
        className="w-[320px] rounded-2xl p-6 shadow-2xl"
        style={{ background: "hsl(0, 0%, 8%)" }}
      >
        <p className="text-sm leading-relaxed mb-5" style={{ color: "hsl(0, 0%, 75%)" }}>
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

        <div className="flex flex-col gap-2.5">
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
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
