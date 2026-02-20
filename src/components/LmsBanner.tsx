import { ExternalLink, Sparkles } from "lucide-react";

/**
 * 웹헤즈 이러닝솔루션(LMS) 소개 배너 버튼
 * 각 서비스 페이지 Hero 섹션에서 공통으로 사용
 */
export default function LmsBanner() {
  return (
    <a
      href="https://www.webheads.co.kr"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
      style={{
        background: "linear-gradient(135deg, hsl(214, 90%, 52%) 0%, hsl(245, 70%, 55%) 100%)",
        color: "#fff",
        boxShadow: "0 2px 12px hsl(214, 90%, 52%, 0.30)",
      }}
    >
      <Sparkles className="w-4 h-4 opacity-90" />
      <span>웹헤즈 이러닝솔루션 바로가기</span>
      <ExternalLink className="w-3.5 h-3.5 opacity-75 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}
