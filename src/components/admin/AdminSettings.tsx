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
    <div className="flex flex-col gap-5 max-w-lg">
      <div>
        <h2 className="text-[20px] font-bold tracking-[-0.03em] text-foreground">설정</h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">계정 및 보안 설정</p>
      </div>

      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[hsl(221,83%,53%,0.08)]">
            <Shield className="w-[18px] h-[18px] text-[hsl(221,83%,53%)]" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">비밀번호 변경</h3>
            <p className="text-[12px] text-muted-foreground">보안을 위해 주기적으로 변경하세요</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          {[
            { label: "현재 비밀번호", value: currentPassword, onChange: setCurrentPassword, placeholder: "" },
            { label: "새 비밀번호", value: newPassword, onChange: setNewPassword, placeholder: "8자 이상" },
            { label: "새 비밀번호 확인", value: confirmPassword, onChange: setConfirmPassword, placeholder: "" },
          ].map((field) => (
            <div key={field.label} className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-muted-foreground pl-1">{field.label}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                <input
                  type="password"
                  required
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl pl-11 pr-4 py-3 text-[14px] outline-none text-foreground placeholder:text-muted-foreground/30 bg-[hsl(220,14%,96%)] border-[1.5px] border-transparent focus:border-[hsl(221,83%,53%)] focus:ring-2 focus:ring-[hsl(221,83%,53%,0.08)] transition-all"
                />
              </div>
            </div>
          ))}

          {error && (
            <div className="rounded-xl py-3 px-4 text-[13px] font-medium bg-[hsl(0,84%,60%,0.06)] text-[hsl(0,84%,50%)] border border-[hsl(0,84%,60%,0.12)]">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl py-3 px-4 text-[13px] font-medium bg-[hsl(152,57%,42%,0.06)] text-[hsl(152,57%,35%)] border border-[hsl(152,57%,42%,0.12)]">
              <Check className="w-4 h-4" /> 비밀번호가 변경되었습니다
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-1 bg-[hsl(221,83%,53%)] text-white hover:bg-[hsl(221,83%,48%)]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>
      </div>
    </div>
  );
}
