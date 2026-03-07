import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Loader2, Mail, Shield } from "lucide-react";

export default function AdminLogin() {
  const savedEmail = localStorage.getItem("admin_saved_email") || "";
  const savedPassword = localStorage.getItem("admin_saved_password") || "";
  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState(savedPassword);
  const [rememberMe, setRememberMe] = useState(!!savedEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const hasAdminAccess = async (userId: string) => {
    const { data, error } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    if (error) return false;
    return data === true;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user && (await hasAdminAccess(session.user.id))) {
        navigate("/admin", { replace: true });
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user && (await hasAdminAccess(session.user.id))) {
        navigate("/admin", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", authData.user.id).eq("role", "admin").maybeSingle();
    if (!roleData) {
      await supabase.auth.signOut();
      setError("관리자 권한이 없는 계정입니다.");
      setLoading(false);
      return;
    }

    if (rememberMe) {
      localStorage.setItem("admin_saved_email", email);
      localStorage.setItem("admin_saved_password", password);
    } else {
      localStorage.removeItem("admin_saved_email");
      localStorage.removeItem("admin_saved_password");
    }

    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "hsl(var(--background))" }}
    >
      <div className="w-full max-w-[400px]">
        {/* Logo / Icon Area */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-5 bg-primary"
            style={{
              boxShadow: "0 8px 28px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-[26px] tracking-[-0.04em] text-foreground"
            style={{ fontWeight: 700 }}
          >
            관리자 로그인
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-foreground pl-1" style={{ letterSpacing: "-0.01em" }}>
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl pl-12 pr-5 py-4 text-[15px] outline-none transition-all duration-200 text-foreground placeholder:text-muted-foreground/40"
                style={{
                  background: "hsl(var(--muted))",
                  border: "1.5px solid hsl(var(--border))",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1.5px solid hsl(var(--primary))";
                  e.currentTarget.style.boxShadow = "0 0 0 4px hsl(var(--primary) / 0.08)";
                  e.currentTarget.style.background = "hsl(var(--background))";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1.5px solid hsl(var(--border))";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.background = "hsl(var(--muted))";
                }}
                placeholder="admin@webheads.co.kr"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-foreground pl-1" style={{ letterSpacing: "-0.01em" }}>
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/50" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl pl-12 pr-5 py-4 text-[15px] outline-none transition-all duration-200 text-foreground placeholder:text-muted-foreground/40"
                style={{
                  background: "hsl(var(--muted))",
                  border: "1.5px solid hsl(var(--border))",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1.5px solid hsl(var(--primary))";
                  e.currentTarget.style.boxShadow = "0 0 0 4px hsl(var(--primary) / 0.08)";
                  e.currentTarget.style.background = "hsl(var(--background))";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1.5px solid hsl(var(--border))";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.background = "hsl(var(--muted))";
                }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none pl-1">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded accent-primary cursor-pointer"
            />
            <span className="text-[13px] text-muted-foreground" style={{ fontWeight: 500 }}>
              아이디 / 비밀번호 저장
            </span>
          </label>

          {error && (
            <div
              className="flex items-center gap-3 rounded-2xl py-3.5 px-4 text-[14px]"
              style={{
                background: "hsl(0 84% 60% / 0.06)",
                color: "hsl(0 84% 50%)",
                border: "1px solid hsl(0 84% 60% / 0.12)",
              }}
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "hsl(0 84% 60% / 0.12)" }}
              >
                <span className="text-xs">!</span>
              </div>
              <span style={{ fontWeight: 500 }}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl text-[15px] flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            style={{
              fontWeight: 600,
              background: "hsl(var(--foreground))",
              color: "hsl(var(--background))",
              letterSpacing: "-0.01em",
              marginTop: "4px",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-[18px] h-[18px] animate-spin" />
                로그인 중...
              </>
            ) : (
              "로그인"
            )}
          </button>
        </form>

        {/* Footer text */}
        <p className="text-center text-[12px] text-muted-foreground/60 mt-8" style={{ letterSpacing: "-0.01em" }}>
          Copyright ⓒ 2010 - 2026 WEBHEADS, Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}
