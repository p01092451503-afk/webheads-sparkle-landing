import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function ScrollArrows() {
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(true);

  useEffect(() => {
    const check = () => {
      setShowUp(window.scrollY > 200);
      setShowDown(window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 100);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollDown = () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  const btn = "w-9 h-9 md:w-10 md:h-10 rounded-full backdrop-blur-xl bg-background/40 border border-white/20 text-foreground shadow-[0_4px_16px_rgba(0,0,0,0.12)] ring-1 ring-black/5 flex items-center justify-center hover:bg-background/90 transition-all duration-200";

  return (
    <div className="fixed right-3 md:right-5 bottom-5 z-50 flex flex-col gap-1.5">
      {showUp && (
        <button onClick={scrollUp} className={btn} aria-label="Scroll to top">
          <ChevronUp className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      )}
      {showDown && (
        <button onClick={scrollDown} className={btn} aria-label="Scroll to bottom">
          <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      )}
    </div>
  );
}
