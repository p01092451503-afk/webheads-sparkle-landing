import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Loader2, Check, Shield } from "lucide-react";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    // Verify current password
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("세션이 만료되었습니다. 다시 로그인해주세요.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.user.email!,
      password: currentPassword,
    });

    if (signInError) {
      setError("현재 비밀번호가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setError("비밀번호 변경에 실패했습니다.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setLoading(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h2 className="text-[22px] tracking-[-0.04em] text-foreground" style={{ fontWeight: 700 }}>설정</h2>
        <p className="text-[14px] text-muted-foreground mt-1">계정 및 보안 설정</p>
      </div>

      {/* Password Change */}
      <div className="rounded-2xl p-6" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.08)" }}>
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-[15px] text-foreground" style={{ fontWeight: 600 }}>비밀번호 변경</h3>
            <p className="text-[12px] text-muted-foreground">보안을 위해 주기적으로 변경하세요</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-muted-foreground pl-1" style={{ fontWeight: 600 }}>현재 비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
              <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl pl-11 pr-4 py-3 text-[14px] outline-none transition-all text-foreground"
                style={{ background: "hsl(var(--muted))", border: "1.5px solid hsl(var(--border))" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(var(--primary))"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(var(--primary) / 0.06)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(var(--border))"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-muted-foreground pl-1" style={{ fontWeight: 600 }}>새 비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
              <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8자 이상"
                className="w-full rounded-xl pl-11 pr-4 py-3 text-[14px] outline-none transition-all text-foreground placeholder:text-muted-foreground/40"
                style={{ background: "hsl(var(--muted))", border: "1.5px solid hsl(var(--border))" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(var(--primary))"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(var(--primary) / 0.06)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(var(--border))"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-muted-foreground pl-1" style={{ fontWeight: 600 }}>새 비밀번호 확인</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl pl-11 pr-4 py-3 text-[14px] outline-none transition-all text-foreground"
                style={{ background: "hsl(var(--muted))", border: "1.5px solid hsl(var(--border))" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(var(--primary))"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(var(--primary) / 0.06)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(var(--border))"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl py-3 px-4 text-[13px]"
              style={{ background: "hsl(0 84% 60% / 0.06)", color: "hsl(0 84% 50%)", border: "1px solid hsl(0 84% 60% / 0.12)", fontWeight: 500 }}>
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl py-3 px-4 text-[13px]"
              style={{ background: "hsl(150 60% 42% / 0.06)", color: "hsl(150 60% 35%)", border: "1px solid hsl(150 60% 42% / 0.12)", fontWeight: 500 }}>
              <Check className="w-4 h-4" /> 비밀번호가 변경되었습니다
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-1"
            style={{ fontWeight: 600, background: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>
      </div>
    </div>
  );
}
