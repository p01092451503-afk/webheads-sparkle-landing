import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

const STORAGE_KEY = "wh_og_image_alert_dismissed";

export default function ImageOptimizationAlert() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(STORAGE_KEY));

  if (!visible) return null;

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  return (
    <div className="relative flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
      <p className="flex-1">
        <strong>og-image.png</strong>가 <strong>700 KB</strong>입니다. WebP 형식으로{" "}
        <strong>200 KB 이하</strong>로 압축 후 교체하세요.{" "}
        <span className="text-amber-700">(권장: <a href="https://squoosh.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-900">squoosh.app</a> 사용)</span>
      </p>
      <button onClick={dismiss} className="shrink-0 rounded-md p-1 hover:bg-amber-200/60 transition-colors" aria-label="닫기">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
