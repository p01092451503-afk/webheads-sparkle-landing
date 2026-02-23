import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function ScrollButtons() {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      setShowTop(scrollY > 400);
      setShowBottom(scrollY + windowHeight < docHeight - 200);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 bg-background/90 border border-border text-foreground shadow-md backdrop-blur-sm"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
      {showBottom && (
        <button
          onClick={() =>
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "smooth",
            })
          }
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 bg-background/90 border border-border text-foreground shadow-md backdrop-blur-sm"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
