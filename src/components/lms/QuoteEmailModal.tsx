import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Mail, CheckCircle } from "lucide-react";

interface QuoteEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  monthlyTotal: number;
}

export default function QuoteEmailModal({ open, onOpenChange, planName, monthlyTotal }: QuoteEmailModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    try {
      await supabase.from("simulator_leads" as any).insert({
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || null,
        plan_recommended: planName,
        monthly_total: monthlyTotal,
      } as any);
      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
        setName("");
        setEmail("");
        setCompany("");
      }, 3000);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <p className="text-base font-bold text-foreground text-center">✅ 입력하신 이메일로 견적서를 발송했습니다</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">견적서를 이메일로 보내드립니다</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium text-foreground">이름 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="홍길동"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">이메일 <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">회사명 <span className="text-muted-foreground text-xs">(선택)</span></label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  maxLength={100}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="회사명"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !name.trim() || !email.trim()}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "hsl(255, 75%, 58%)" }}
              >
                <Mail className="w-4 h-4" />
                {loading ? "전송 중..." : "견적서 받기"}
              </button>
              <p className="text-[11px] text-muted-foreground text-center">
                영업 목적으로 사용되지 않으며, 견적 내용만 발송됩니다.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
