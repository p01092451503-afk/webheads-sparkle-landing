import { useLocation, Link, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Home } from "lucide-react";

// 기존 홈페이지(webheads.co.kr) 레거시 경로 → 새 경로 매핑
const LEGACY_REDIRECTS: Record<string, string> = {
  "/newpage.php": "/",
  "/newpage": "/",
  "/index.php": "/",
  "/index.html": "/",
  "/sub/lms.php": "/lms",
  "/sub/lms": "/lms",
  "/sub/hosting.php": "/hosting",
  "/sub/hosting": "/hosting",
  "/sub/chatbot.php": "/chatbot",
  "/sub/chatbot": "/chatbot",
  "/sub/app.php": "/app",
  "/sub/app": "/app",
  "/sub/content.php": "/content",
  "/sub/content": "/content",
  "/sub/drm.php": "/drm",
  "/sub/drm": "/drm",
  "/sub/channel.php": "/channel",
  "/sub/channel": "/channel",
  "/sub/pg.php": "/pg",
  "/sub/pg": "/pg",
  "/sub/maintenance.php": "/maintenance",
  "/sub/maintenance": "/maintenance",
  "/sub/contact.php": "/#contact",
  "/sub/contact": "/#contact",
  "/sub/about.php": "/overview",
  "/sub/about": "/overview",
};

const NotFound = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "ko";

  const legacyPath = location.pathname.toLowerCase();
  const redirectTo = LEGACY_REDIRECTS[legacyPath];

  useEffect(() => {
    if (!redirectTo) {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname, redirectTo]);

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  const content = lang === "en"
    ? {
        code: "404",
        title: "Page Not Found",
        desc: "The page you're looking for doesn't exist or has been moved.",
        home: "Back to Home",
        back: "Go Back",
      }
    : {
        code: "404",
        title: "페이지를 찾을 수 없습니다",
        desc: "요청하신 페이지가 존재하지 않거나 이동되었습니다.",
        home: "홈으로 돌아가기",
        back: "이전 페이지",
      };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <span
          className="block font-black tracking-tighter leading-none mb-6"
          style={{ fontSize: "8rem", color: "hsl(var(--primary))", opacity: 0.15 }}
        >
          {content.code}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-3">
          {content.title}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          {content.desc}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {content.back}
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            {content.home}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;