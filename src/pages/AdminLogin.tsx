import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Loader2, Mail, Shield } from "lucide-react";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;
const LOCKOUT_STORAGE_KEY = "admin_login_lockout";

function getLockoutState(): { attempts: number; lockedUntil: number | null } {
  try {
    const raw = sessionStorage.getItem(LOCKOUT_STORAGE_KEY);
    if (!raw) return { attempts: 0, lockedUntil: null };
    return JSON.parse(raw);
  } catch {
    return { attempts: 0, lockedUntil: null };
  }
}

function setLockoutState(state: { attempts: number; lockedUntil: number | null }) {
  sessionStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify(state));
}

export default function AdminLogin() {
  const savedEmail = localStorage.getItem("admin_saved_email") || "";
  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(!!savedEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const navigate = useNavigate();

  // Check lockout on mount and tick down
  useEffect(() => {
    const tick = () => {
      const state = getLockoutState();
      if (state.lockedUntil && state.lockedUntil > Date.now()) {
        setLockoutRemaining(Math.ceil((state.lockedUntil - Date.now()) / 1000));
      } else {
        setLockoutRemaining(0);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const hasAdminAccess = async (userId: string) => {
    const { data, error } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (error) return false;
    return data === true;
  };

  useEffect(() => {
    const handleSession = (session: { user: { id: string } } | null) => {
      if (!session?.user) return;
      hasAdminAccess(session.user.id)
        .then((ok) => {
          if (ok) navigate("/admin", { replace: true });
        })
        .catch(() => undefined);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") return;
      handleSession(session as { user: { id: string } } | null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session as { user: { id: string } } | null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting check
    const lockState = getLockoutState();
    if (lockState.lockedUntil && lockState.lockedUntil > Date.now()) {
      const remaining = Math.ceil((lockState.lockedUntil - Date.now()) / 1000);
      setError(`로그인 시도가 제한되었습니다. ${remaining}초 후 다시 시도해주세요.`);
      return;
    }

    setLoading(true);
    setError(null);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      const newAttempts = (lockState.attempts || 0) + 1;
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockedUntil = Date.now() + LOCKOUT_SECONDS * 1000;
        setLockoutState({ attempts: newAttempts, lockedUntil });
        setError(`로그인 ${MAX_ATTEMPTS}회 실패. ${LOCKOUT_SECONDS}초간 로그인이 제한됩니다.`);
      } else {
        setLockoutState({ attempts: newAttempts, lockedUntil: null });
        setError(`이메일 또는 비밀번호가 올바르지 않습니다. (${newAttempts}/${MAX_ATTEMPTS})`);
      }
      setLoading(false);
      return;
    }

    const isAdmin = await hasAdminAccess(authData.user.id);
    if (!isAdmin) {
      await supabase.auth.signOut();
      setError("관리자 권한이 없는 계정입니다.");
      setLoading(false);
      return;
    }

    // Reset lockout on success
    setLockoutState({ attempts: 0, lockedUntil: null });

    // Only save email (never password)
    if (rememberMe) {
      localStorage.setItem("admin_saved_email", email);
    } else {
      localStorage.removeItem("admin_saved_email");
    }
    // Clean up legacy password storage
    localStorage.removeItem("admin_saved_password");

    navigate("/admin", { replace: true });
  };

  const isLocked = lockoutRemaining > 0;

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
              이메일 저장
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

          {isLocked && (
            <div
              className="flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-[13px] font-semibold"
              style={{
                background: "hsl(37 90% 51% / 0.08)",
                color: "hsl(37 90% 40%)",
                border: "1px solid hsl(37 90% 51% / 0.15)",
              }}
            >
              <Lock className="w-3.5 h-3.5" />
              {lockoutRemaining}초 후 다시 시도할 수 있습니다
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isLocked}
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
            ) : isLocked ? (
              "로그인 제한 중"
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
