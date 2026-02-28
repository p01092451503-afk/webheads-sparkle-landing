import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function FloatingNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed right-5 bottom-6 z-50 flex flex-col gap-2">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-10 h-10 rounded-full bg-foreground/80 text-background flex items-center justify-center shadow-lg hover:bg-foreground transition-colors"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      <button
        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
        className="w-10 h-10 rounded-full bg-foreground/80 text-background flex items-center justify-center shadow-lg hover:bg-foreground transition-colors"
        aria-label="Scroll to bottom"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
}
