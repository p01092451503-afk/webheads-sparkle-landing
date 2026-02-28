import { useState } from "react";
import { Phone, X } from "lucide-react";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="bg-card border border-border rounded-xl shadow-lg p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 min-w-[200px]">
          <a
            href="tel:02-336-4338"
            className="flex items-center gap-3 text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-primary" />
            </span>
            <span className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">도입문의</span>
              <span>02.336.4338</span>
            </span>
          </a>
          <a
            href="tel:02-540-4337"
            className="flex items-center gap-3 text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-accent/60 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-primary" />
            </span>
            <span className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">유지보수</span>
              <span>02.540.4337</span>
            </span>
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="전화 문의"
      >
        {open ? <X className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
      </button>
    </div>
  );
}
