import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Loader2, Check, Shield, UserPlus, Users, Trash2, Crown, AlertTriangle, Clock, RefreshCw, Bell, Building2, Save, Mail, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Menu, KeyRound } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface AdminSettingsProps {
  isSuperAdmin: boolean;
  logActivity: (action: string, targetType?: string, targetId?: string, details?: any) => void;
}

interface AdminUser {
  user_id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in: string | null;
}

export default function AdminSettings({ isSuperAdmin, logActivity }: AdminSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin management state
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "super_admin">("admin");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // Activity logs
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Menu permissions per admin
  const [menuPermissions, setMenuPermissions] = useState<Record<string, string[]>>({});
  const [menuPermSaving, setMenuPermSaving] = useState(false);
  const [menuPermSaved, setMenuPermSaved] = useState(false);

  const MENU_OPTIONS = [
    { key: "analytics", label: "분석" },
    { key: "inquiries", label: "문의" },
    { key: "payments", label: "입금관리" },
    { key: "expenses", label: "지출관리" },
    { key: "settings", label: "설정" },
  ];

  // Notification settings
  const [notifSettings, setNotifSettings] = useState({
    email_on_new_inquiry: true,
    email_on_service_request: true,
    notification_email: "34bus@webheads.co.kr",
  });
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  // Slack notification settings
  const [slackSettings, setSlackSettings] = useState({
    enabled: true,
    channel: "general",
    notify_new_inquiry: true,
    notify_service_request: true,
    notify_site_error: true,
  });
  const [slackSaving, setSlackSaving] = useState(false);
  const [slackSaved, setSlackSaved] = useState(false);
  const [slackTesting, setSlackTesting] = useState(false);

  // Company info
  const [companyInfo, setCompanyInfo] = useState({
    name: "WEBHEADS",
    address: "서울시 마포구 월드컵로114, 3층",
    phone: "02-540-4337",
    website: "www.webheads.co.kr",
    email: "34bus@webheads.co.kr",
  });
  const [companySaving, setCompanySaving] = useState(false);
  const [companySaved, setCompanySaved] = useState(false);

  // Auto-response templates
  const [autoResponse, setAutoResponse] = useState({
    enabled: true,
    templates: {
      consultation: {
        subject: "[웹헤즈] 상담 문의가 접수되었습니다",
        body: "안녕하세요, {{name}}님.\n\n{{company}}의 상담 문의가 정상적으로 접수되었습니다.\n담당자가 확인 후 빠른 시일 내에 연락드리겠습니다.\n\n문의 내용:\n{{message}}\n\n감사합니다.\nWEBHEADS 드림",
      },
      demo: {
        subject: "[웹헤즈] 데모 요청이 접수되었습니다",
        body: "안녕하세요, {{name}}님.\n\n{{company}}의 데모 요청이 정상적으로 접수되었습니다.\n담당자가 확인 후 데모 일정을 조율하여 연락드리겠습니다.\n\n문의 내용:\n{{message}}\n\n감사합니다.\nWEBHEADS 드림",
      },
    } as Record<string, { subject: string; body: string }>,
  });
  const [autoSaving, setAutoSaving] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const actionLabels: Record<string, string> = {
    login: "로그인", logout: "로그아웃", status_change: "상태 변경",
    note_update: "메모 수정", meeting_note_update: "미팅 내용 수정",
    export_csv: "CSV 내보내기", delete: "삭제",
    update_service_request_status: "고객지원 상태 변경",
  };

  const actionColors: Record<string, string> = {
    login: "hsl(221, 83%, 53%)", logout: "hsl(220, 9%, 46%)",
    status_change: "hsl(37, 90%, 51%)", note_update: "hsl(152, 57%, 42%)",
    meeting_note_update: "hsl(262, 60%, 55%)", export_csv: "hsl(199, 89%, 48%)",
    delete: "hsl(0, 84%, 60%)", update_service_request_status: "hsl(37, 90%, 51%)",
  };

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase
      .from("admin_settings")
      .select("key, value");
    if (data) {
      for (const row of data) {
        if (row.key === "notifications") setNotifSettings(row.value as any);
        if (row.key === "company_info") setCompanyInfo(row.value as any);
        if (row.key === "auto_response_templates") setAutoResponse(row.value as any);
        if (row.key === "admin_menu_permissions") setMenuPermissions((row.value as any) || {});
        if (row.key === "slack_notifications") setSlackSettings(prev => ({ ...prev, ...(row.value as any) }));
      }
    }
  }, []);

  const saveSettings = async (key: string, value: any) => {
    const setter = key === "notifications" ? setNotifSaving : setCompanySaving;
    const savedSetter = key === "notifications" ? setNotifSaved : setCompanySaved;
    setter(true);
    await supabase
      .from("admin_settings")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("key", key);
    setter(false);
    savedSetter(true);
    setTimeout(() => savedSetter(false), 2000);
    await logActivity("update_settings", "settings", key, { key });
  };

  useEffect(() => {
    fetchSettings();
    if (isSuperAdmin) {
      fetchAdmins();
      fetchActivityLogs();
    }
  }, [isSuperAdmin, fetchSettings]);

  const fetchAdmins = async () => {
    setAdminsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("manage-admins", {
        body: { action: "list_admins" },
      });
      if (error) throw error;
      setAdmins(data.admins || []);
    } catch (e) {
      console.error("Failed to fetch admins:", e);
    }
    setAdminsLoading(false);
  };

  const fetchActivityLogs = async () => {
    setLogsLoading(true);
    const { data } = await supabase
      .from("admin_activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setActivityLogs(data || []);
    setLogsLoading(false);
  };

  const createAdmin = async () => {
    setCreating(true);
    setCreateError("");
    try {
      if (!newEmail || !newAdminPassword) { setCreateError("이메일과 비밀번호를 입력해주세요."); setCreating(false); return; }
      if (newAdminPassword.length < 6) { setCreateError("비밀번호는 6자 이상이어야 합니다."); setCreating(false); return; }
      const { data, error } = await supabase.functions.invoke("manage-admins", {
        body: { action: "create_admin", email: newEmail, password: newAdminPassword, role: newRole },
      });
      if (error) throw error;
      if (data.error) { setCreateError(data.error); setCreating(false); return; }
      await logActivity("create_admin", "admin", data.user_id, { email: newEmail, role: newRole });
      setShowCreateDialog(false);
      setNewEmail("");
      setNewAdminPassword("");
      setNewRole("admin");
      fetchAdmins();
    } catch (e: any) {
      setCreateError(e.message || "생성 중 오류가 발생했습니다.");
    }
    setCreating(false);
  };

  const updateRole = async (admin: AdminUser, newRoleValue: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("manage-admins", {
        body: { action: "update_role", target_user_id: admin.user_id, new_role: newRoleValue },
      });
      if (error) throw error;
      if (data.error) { alert(data.error); return; }
      await logActivity("update_admin_role", "admin", admin.user_id, { email: admin.email, from: admin.role, to: newRoleValue });
      fetchAdmins();
    } catch (e: any) {
      alert(e.message || "권한 변경에 실패했습니다.");
    }
  };

  const deleteAdmin = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const { data, error } = await supabase.functions.invoke("manage-admins", {
        body: { action: "delete_admin", target_user_id: deleteTarget.user_id },
      });
      if (error) throw error;
      if (data.error) { setDeleteError(data.error); setDeleting(false); return; }
      await logActivity("delete_admin", "admin", deleteTarget.user_id, { email: deleteTarget.email });
      setDeleteTarget(null);
      fetchAdmins();
    } catch (e: any) {
      setDeleteError(e.message || "삭제 중 오류가 발생했습니다.");
    }
    setDeleting(false);
  };

  const handleResetPassword = async () => {
    if (!resetTarget) return;
    setResetError("");
    setResetSuccess(false);
    if (!resetPassword || resetPassword.length < 6) { setResetError("비밀번호는 6자 이상이어야 합니다."); return; }
    if (resetPassword !== resetConfirm) { setResetError("비밀번호가 일치하지 않습니다."); return; }
    setResetting(true);
    try {
      const { data, error } = await supabase.functions.invoke("manage-admins", {
        body: { action: "reset_password", target_user_id: resetTarget.user_id, new_password: resetPassword },
      });
      if (error) throw error;
      if (data.error) { setResetError(data.error); setResetting(false); return; }
      await logActivity("reset_admin_password", "admin", resetTarget.user_id, { email: resetTarget.email });
      setResetSuccess(true);
      setResetPassword("");
      setResetConfirm("");
      setTimeout(() => { setResetTarget(null); setResetSuccess(false); }, 1500);
    } catch (e: any) {
      setResetError(e.message || "비밀번호 초기화에 실패했습니다.");
    }
    setResetting(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) { setError("비밀번호는 8자 이상이어야 합니다."); return; }
    if (newPassword !== confirmPassword) { setError("새 비밀번호가 일치하지 않습니다."); return; }

    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setError("세션이 만료되었습니다. 다시 로그인해주세요."); setLoading(false); return; }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.user.email!, password: currentPassword,
    });
    if (signInError) { setError("현재 비밀번호가 올바르지 않습니다."); setLoading(false); return; }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) { setError("비밀번호 변경에 실패했습니다."); setLoading(false); return; }

    setSuccess(true);
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setLoading(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[20px] font-bold tracking-[-0.03em] text-foreground">설정</h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          {isSuperAdmin ? "계정 · 보안 · 관리자 관리" : "계정 및 보안 설정"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Password Change */}
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
                <input type="password" required value={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder={field.placeholder}
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

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[hsl(37,90%,51%,0.08)]">
            <Bell className="w-[18px] h-[18px] text-[hsl(37,90%,51%)]" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">알림 설정</h3>
            <p className="text-[12px] text-muted-foreground">새 문의 접수 시 이메일 알림</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[hsl(220,14%,97%)]">
            <div>
              <p className="text-[13px] font-medium text-foreground">새 문의 접수 알림</p>
              <p className="text-[11px] text-muted-foreground">문의가 접수되면 이메일로 알림</p>
            </div>
            <button
              onClick={() => {
                const updated = { ...notifSettings, email_on_new_inquiry: !notifSettings.email_on_new_inquiry };
                setNotifSettings(updated);
                saveSettings("notifications", updated);
              }}
              className={`w-11 h-6 rounded-full transition-all relative ${notifSettings.email_on_new_inquiry ? "bg-[hsl(221,83%,53%)]" : "bg-[hsl(220,13%,85%)]"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notifSettings.email_on_new_inquiry ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-muted-foreground pl-1">알림 수신 이메일</label>
            <input
              type="email"
              value={notifSettings.notification_email}
              onChange={(e) => setNotifSettings({ ...notifSettings, notification_email: e.target.value })}
              className="w-full rounded-xl px-4 py-3 text-[14px] outline-none text-foreground bg-[hsl(220,14%,96%)] border-[1.5px] border-transparent focus:border-[hsl(221,83%,53%)] transition-all"
            />
          </div>

          <button
            onClick={() => saveSettings("notifications", notifSettings)}
            disabled={notifSaving}
            className="self-end flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-[hsl(37,90%,51%)] hover:bg-[hsl(37,90%,45%)] transition-all disabled:opacity-50"
          >
            {notifSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : notifSaved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            {notifSaved ? "저장됨" : "저장"}
          </button>
        </div>
      </div>

      {/* Slack Notification Settings */}
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(329, 70%, 54%, 0.08)" }}>
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zm-2.521 10.124a2.528 2.528 0 0 1 2.521 2.52A2.528 2.528 0 0 1 15.166 24a2.528 2.528 0 0 1-2.521-2.522v-2.52h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.521h-6.312z" fill="hsl(329, 70%, 54%)"/>
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">Slack 알림</h3>
            <p className="text-[12px] text-muted-foreground">문의·장애 발생 시 Slack으로 알림</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Master toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[hsl(220,14%,97%)]">
            <div>
              <p className="text-[13px] font-medium text-foreground">Slack 알림 활성화</p>
              <p className="text-[11px] text-muted-foreground">모든 Slack 알림을 켜거나 끕니다</p>
            </div>
            <button
              onClick={() => setSlackSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`w-11 h-6 rounded-full transition-all relative ${slackSettings.enabled ? "bg-[hsl(221,83%,53%)]" : "bg-[hsl(220,13%,85%)]"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${slackSettings.enabled ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>

          {/* Channel */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-muted-foreground pl-1">Slack 채널명</label>
            <input
              type="text"
              value={slackSettings.channel}
              onChange={(e) => setSlackSettings(prev => ({ ...prev, channel: e.target.value }))}
              placeholder="general"
              className="w-full rounded-xl px-4 py-3 text-[14px] outline-none text-foreground bg-[hsl(220,14%,96%)] border-[1.5px] border-transparent focus:border-[hsl(221,83%,53%)] transition-all"
            />
            <p className="text-[11px] text-muted-foreground pl-1"># 없이 채널명만 입력</p>
          </div>

          {/* Per-type toggles */}
          {[
            { key: "notify_new_inquiry" as const, label: "신규 문의 알림", desc: "새 문의가 접수되면 알림" },
            { key: "notify_service_request" as const, label: "고객지원 요청 알림", desc: "SMS 충전·원격 지원 요청 시 알림" },
            { key: "notify_site_error" as const, label: "사이트 장애 알림", desc: "사이트 오류 감지 시 알림" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-[hsl(220,14%,97%)]">
              <div>
                <p className="text-[13px] font-medium text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
              <button
                onClick={() => setSlackSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`w-11 h-6 rounded-full transition-all relative ${slackSettings[item.key] ? "bg-[hsl(221,83%,53%)]" : "bg-[hsl(220,13%,85%)]"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${slackSettings[item.key] ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
          ))}

          <div className="flex items-center gap-2 justify-end">
            {/* Test button */}
            <button
              onClick={async () => {
                setSlackTesting(true);
                try {
                  const { error } = await supabase.functions.invoke("send-slack-notification", {
                    body: { type: "custom", title: "테스트 알림", details: { "상태": "Slack 연동 테스트 성공 ✅" }, urgency: "normal" },
                  });
                  if (error) throw error;
                  alert("테스트 알림이 전송되었습니다!");
                } catch (e: any) {
                  alert("전송 실패: " + (e.message || "알 수 없는 오류"));
                }
                setSlackTesting(false);
              }}
              disabled={slackTesting || !slackSettings.enabled}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-muted-foreground bg-white border border-[hsl(220,13%,91%)] hover:bg-[hsl(220,14%,96%)] transition-all disabled:opacity-50"
            >
              {slackTesting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              테스트 전송
            </button>

            {/* Save button */}
            <button
              onClick={async () => {
                setSlackSaving(true);
                await supabase.from("admin_settings").upsert({ key: "slack_notifications", value: slackSettings as any, updated_at: new Date().toISOString() }, { onConflict: "key" });
                setSlackSaving(false);
                setSlackSaved(true);
                setTimeout(() => setSlackSaved(false), 2000);
                await logActivity("update_settings", "settings", "slack_notifications");
              }}
              disabled={slackSaving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-white" style={{ background: "hsl(329, 70%, 54%)" }}
            >
              {slackSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : slackSaved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
              {slackSaved ? "저장됨" : "저장"}
            </button>
          </div>
        </div>
      </div>


      {isSuperAdmin && (
        <>
          <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[hsl(262,60%,55%,0.08)]">
                  <Users className="w-[18px] h-[18px] text-[hsl(262,60%,55%)]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground">관리자 관리</h3>
                  <p className="text-[12px] text-muted-foreground">관리자 등록, 권한 수정, 삭제</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={fetchAdmins} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-muted-foreground bg-white border border-[hsl(220,13%,91%)] hover:bg-[hsl(220,14%,96%)] transition-colors">
                  <RefreshCw className="w-3 h-3" />
                </button>
                <button onClick={() => { setShowCreateDialog(true); setCreateError(""); setNewEmail(""); setNewAdminPassword(""); setNewRole("admin"); }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold text-white bg-[hsl(262,60%,55%)] hover:bg-[hsl(262,60%,45%)] transition-all active:scale-[0.96]"
                >
                  <UserPlus className="w-3.5 h-3.5" /> 관리자 추가
                </button>
              </div>
            </div>

            {adminsLoading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
            ) : admins.length === 0 ? (
              <p className="text-center text-[13px] text-muted-foreground/50 py-10">등록된 관리자가 없습니다</p>
            ) : (
              <div className="flex flex-col gap-2">
                {admins.map((admin) => (
                  <div key={admin.user_id} className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(220,14%,97%)] border border-[hsl(220,13%,93%)]">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: admin.role === "super_admin" ? "hsl(37,90%,51%,0.1)" : "hsl(221,83%,53%,0.08)" }}
                    >
                      {admin.role === "super_admin" ? (
                        <Crown className="w-4 h-4 text-[hsl(37,90%,51%)]" />
                      ) : (
                        <Shield className="w-4 h-4 text-[hsl(221,83%,53%)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-semibold text-foreground truncate">{admin.email}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                          style={{ background: admin.role === "super_admin" ? "hsl(37,90%,51%)" : "hsl(221,83%,53%)" }}
                        >
                          {admin.role === "super_admin" ? "최고관리자" : "관리자"}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                        마지막 접속: {admin.last_sign_in ? formatTime(admin.last_sign_in) : "없음"}
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {admin.role === "admin" ? (
                        <button
                          onClick={() => updateRole(admin, "super_admin")}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-[hsl(37,90%,51%)] bg-[hsl(37,90%,51%,0.06)] hover:bg-[hsl(37,90%,51%,0.1)] transition-all"
                          title="최고관리자로 변경"
                        >
                          <Crown className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateRole(admin, "admin")}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-[hsl(220,9%,46%)] bg-[hsl(220,14%,96%)] hover:bg-[hsl(220,14%,93%)] transition-all"
                          title="일반 관리자로 변경"
                        >
                          <Shield className="w-3 h-3" />
                        </button>
                      )}
                      {admin.role !== "super_admin" && (
                        <button
                          onClick={() => { setDeleteTarget(admin); setDeleteError(""); }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-[hsl(0,84%,60%)] bg-[hsl(0,84%,60%,0.06)] hover:bg-[hsl(0,84%,60%,0.1)] transition-all"
                          title="관리자 삭제"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[hsl(152,57%,42%,0.08)]">
                  <Clock className="w-[18px] h-[18px] text-[hsl(152,57%,42%)]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground">관리자 활동 로그</h3>
                  <p className="text-[12px] text-muted-foreground">최근 50건의 관리자 활동 기록</p>
                </div>
              </div>
              <button onClick={fetchActivityLogs} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-muted-foreground bg-white border border-[hsl(220,13%,91%)] hover:bg-[hsl(220,14%,96%)] transition-colors">
                <RefreshCw className="w-3 h-3" /> 새로고침
              </button>
            </div>

            {logsLoading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
            ) : activityLogs.length === 0 ? (
              <p className="text-center text-[13px] text-muted-foreground/50 py-10">기록된 활동이 없습니다</p>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                {activityLogs.map((log, idx) => {
                  const color = actionColors[log.action] || "hsl(220, 9%, 46%)";
                  return (
                    <div key={log.id}
                      className="flex items-center gap-3 px-3 py-3 hover:bg-[hsl(220,14%,97%)] transition-colors"
                      style={{ borderBottom: idx < activityLogs.length - 1 ? "1px solid hsl(220, 13%, 95%)" : "none" }}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${color}12`, color }}
                      >
                        <Shield className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-foreground">
                          {actionLabels[log.action] || log.action}
                          {log.details?.status && <span className="text-muted-foreground font-normal"> → {log.details.status}</span>}
                          {log.details?.email && <span className="text-muted-foreground font-normal"> ({log.details.email})</span>}
                          {log.details?.count !== undefined && <span className="text-muted-foreground font-normal"> ({log.details.count}건)</span>}
                        </p>
                        {log.target_type && (
                          <p className="text-[10px] text-muted-foreground/50 mt-0.5">{log.target_type}: {log.target_id?.slice(0, 8)}...</p>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground/40 shrink-0">{formatTime(log.created_at)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Menu Permissions - Super Admin only */}
      {isSuperAdmin && admins.length > 0 && (
        <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[hsl(199,89%,48%,0.08)]">
                <Menu className="w-[18px] h-[18px] text-[hsl(199,89%,48%)]" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-foreground">메뉴 접근 권한</h3>
                <p className="text-[12px] text-muted-foreground">관리자별 접근 가능한 메뉴를 설정합니다</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {admins.map((admin) => {
              const perms = menuPermissions[admin.user_id] || MENU_OPTIONS.map((m) => m.key);
              const isSA = admin.role === "super_admin";
              return (
                <div key={admin.user_id} className="rounded-xl border border-[hsl(220,13%,93%)] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[13px] font-semibold text-foreground">{admin.email}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: isSA ? "hsl(37,90%,51%)" : "hsl(221,83%,53%)" }}
                    >
                      {isSA ? "최고관리자" : "관리자"}
                    </span>
                    {isSA && <span className="text-[11px] text-muted-foreground">(전체 접근)</span>}
                  </div>
                  {isSA ? (
                    <p className="text-[12px] text-muted-foreground">최고관리자는 모든 메뉴에 접근할 수 있습니다.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {MENU_OPTIONS.map((menu) => {
                        const isAllowed = perms.includes(menu.key);
                        return (
                          <button
                            key={menu.key}
                            onClick={() => {
                              const updated = isAllowed
                                ? perms.filter((p) => p !== menu.key)
                                : [...perms, menu.key];
                              if (updated.length === 0) return;
                              setMenuPermissions((prev) => ({ ...prev, [admin.user_id]: updated }));
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
                              isAllowed
                                ? "bg-[hsl(221,83%,53%)] text-white border-[hsl(221,83%,53%)]"
                                : "bg-white text-muted-foreground border-[hsl(220,13%,91%)] hover:border-[hsl(220,13%,85%)]"
                            }`}
                          >
                            {menu.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={async () => {
                setMenuPermSaving(true);
                await supabase
                  .from("admin_settings")
                  .update({ value: menuPermissions as any, updated_at: new Date().toISOString() })
                  .eq("key", "admin_menu_permissions");
                await logActivity("update_menu_permissions", "settings", "admin_menu_permissions");
                setMenuPermSaving(false);
                setMenuPermSaved(true);
                setTimeout(() => setMenuPermSaved(false), 2000);
              }}
              disabled={menuPermSaving}
              className="self-end flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,42%)] transition-all disabled:opacity-50"
            >
              {menuPermSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : menuPermSaved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
              {menuPermSaved ? "저장됨" : "권한 저장"}
            </button>
          </div>
        </div>
      )}

      {/* Auto-Response Templates */}
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[hsl(199,89%,48%,0.08)]">
              <Mail className="w-[18px] h-[18px] text-[hsl(199,89%,48%)]" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-foreground">자동 응답 이메일 템플릿</h3>
              <p className="text-[12px] text-muted-foreground">문의 접수 시 고객에게 자동 발송되는 확인 이메일</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const updated = { ...autoResponse, enabled: !autoResponse.enabled };
                setAutoResponse(updated);
                saveSettings("auto_response_templates", updated);
              }}
              className={`w-11 h-6 rounded-full transition-all relative ${autoResponse.enabled ? "bg-[hsl(199,89%,48%)]" : "bg-[hsl(220,13%,85%)]"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${autoResponse.enabled ? "left-[22px]" : "left-0.5"}`} />
            </button>
            <span className="text-[11px] font-medium text-muted-foreground">{autoResponse.enabled ? "활성" : "비활성"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {Object.entries(autoResponse.templates).map(([key, tpl]) => {
            const isEditing = editingTemplate === key;
            const typeLabel = key === "demo" ? "데모 요청" : "상담 문의";
            return (
              <div key={key} className="rounded-xl border border-[hsl(220,13%,93%)] overflow-hidden">
                <button
                  onClick={() => setEditingTemplate(isEditing ? null : key)}
                  className="w-full flex items-center justify-between p-4 hover:bg-[hsl(220,14%,97%)] transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
                      style={{ background: key === "demo" ? "hsl(262,60%,55%)" : "hsl(221,83%,53%)" }}
                    >
                      {typeLabel}
                    </span>
                    <span className="text-[13px] font-medium text-foreground">{tpl.subject}</span>
                  </div>
                  {isEditing ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                {isEditing && (
                  <div className="p-4 pt-0 flex flex-col gap-3 border-t border-[hsl(220,13%,95%)]">
                    <div className="flex flex-col gap-1.5 mt-3">
                      <label className="text-[12px] font-semibold text-muted-foreground pl-1">제목</label>
                      <input
                        type="text"
                        value={tpl.subject}
                        onChange={(e) => {
                          const updated = { ...autoResponse, templates: { ...autoResponse.templates, [key]: { ...tpl, subject: e.target.value } } };
                          setAutoResponse(updated);
                        }}
                        className="w-full rounded-xl px-4 py-3 text-[14px] outline-none text-foreground bg-[hsl(220,14%,96%)] border-[1.5px] border-transparent focus:border-[hsl(199,89%,48%)] transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-muted-foreground pl-1">본문</label>
                      <textarea
                        value={tpl.body}
                        onChange={(e) => {
                          const updated = { ...autoResponse, templates: { ...autoResponse.templates, [key]: { ...tpl, body: e.target.value } } };
                          setAutoResponse(updated);
                        }}
                        rows={8}
                        className="w-full rounded-xl px-4 py-3 text-[13px] outline-none text-foreground bg-[hsl(220,14%,96%)] border-[1.5px] border-transparent focus:border-[hsl(199,89%,48%)] transition-all resize-y leading-relaxed font-mono"
                      />
                      <p className="text-[10px] text-muted-foreground/50 pl-1">
                        사용 가능 변수: <code className="px-1 py-0.5 rounded bg-[hsl(220,14%,93%)] text-[10px]">{"{{name}}"}</code> <code className="px-1 py-0.5 rounded bg-[hsl(220,14%,93%)] text-[10px]">{"{{company}}"}</code> <code className="px-1 py-0.5 rounded bg-[hsl(220,14%,93%)] text-[10px]">{"{{message}}"}</code> <code className="px-1 py-0.5 rounded bg-[hsl(220,14%,93%)] text-[10px]">{"{{service}}"}</code>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={() => saveSettings("auto_response_templates", autoResponse)}
            disabled={autoSaving}
            className="self-end flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,42%)] transition-all disabled:opacity-50 mt-1"
          >
            {autoSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : autoSaved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            {autoSaved ? "저장됨" : "템플릿 저장"}
          </button>
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[hsl(152,57%,42%,0.08)]">
            <Building2 className="w-[18px] h-[18px] text-[hsl(152,57%,42%)]" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">회사 정보</h3>
            <p className="text-[12px] text-muted-foreground">제안서 및 이메일에 사용되는 정보</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { label: "회사명", key: "name" as const },
            { label: "주소", key: "address" as const },
            { label: "전화번호", key: "phone" as const },
            { label: "웹사이트", key: "website" as const },
            { label: "이메일", key: "email" as const },
          ].map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-muted-foreground pl-1">{field.label}</label>
              <input
                type="text"
                value={companyInfo[field.key]}
                onChange={(e) => setCompanyInfo({ ...companyInfo, [field.key]: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-[14px] outline-none text-foreground bg-[hsl(220,14%,96%)] border-[1.5px] border-transparent focus:border-[hsl(152,57%,42%)] transition-all"
              />
            </div>
          ))}

          <button
            onClick={() => saveSettings("company_info", companyInfo)}
            disabled={companySaving}
            className="self-end flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-[hsl(152,57%,42%)] hover:bg-[hsl(152,57%,35%)] transition-all disabled:opacity-50 mt-1"
          >
            {companySaving ? <Loader2 className="w-3 h-3 animate-spin" /> : companySaved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            {companySaved ? "저장됨" : "저장"}
          </button>
        </div>
      </div>

      </div>{/* end grid */}

      {/* Create Admin Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[16px]">
              <UserPlus className="w-5 h-5 text-[hsl(262,60%,55%)]" />
              관리자 등록
            </DialogTitle>
            <DialogDescription className="text-[13px]">
              새로운 관리자 계정을 생성합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-muted-foreground">이메일</label>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="admin@example.com"
                className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none text-foreground placeholder:text-muted-foreground/30 bg-[hsl(220,14%,96%)] border-[1.5px] border-transparent focus:border-[hsl(221,83%,53%)] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-muted-foreground">비밀번호</label>
              <input type="password" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} placeholder="6자 이상"
                className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none text-foreground placeholder:text-muted-foreground/30 bg-[hsl(220,14%,96%)] border-[1.5px] border-transparent focus:border-[hsl(221,83%,53%)] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-muted-foreground">권한</label>
              <div className="flex gap-2">
                {(["admin", "super_admin"] as const).map((r) => (
                  <button key={r} onClick={() => setNewRole(r)}
                    className="flex-1 py-2.5 rounded-xl text-[12px] font-medium transition-all"
                    style={{
                      color: newRole === r ? "white" : "hsl(220, 9%, 46%)",
                      background: newRole === r ? (r === "super_admin" ? "hsl(37,90%,51%)" : "hsl(221,83%,53%)") : "white",
                      border: newRole === r ? "none" : "1.5px solid hsl(220, 13%, 91%)",
                    }}
                  >
                    {r === "super_admin" ? "최고관리자" : "관리자 (읽기 전용)"}
                  </button>
                ))}
              </div>
            </div>
            {createError && <p className="text-[11px] text-[hsl(0,84%,50%)] bg-[hsl(0,84%,60%,0.06)] rounded-lg px-3 py-2">{createError}</p>}
          </div>
          <DialogFooter className="mt-3">
            <button onClick={() => setShowCreateDialog(false)}
              className="px-4 py-2 rounded-xl text-[12px] font-medium text-muted-foreground bg-white border border-[hsl(220,13%,91%)] hover:bg-[hsl(220,14%,96%)] transition-colors"
            >취소</button>
            <button onClick={createAdmin} disabled={creating}
              className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-[hsl(262,60%,55%)] hover:bg-[hsl(262,60%,45%)] transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {creating && <Loader2 className="w-3 h-3 animate-spin" />}
              등록
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Admin Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[16px]">
              <AlertTriangle className="w-5 h-5 text-[hsl(0,84%,60%)]" />
              관리자 삭제
            </DialogTitle>
            <DialogDescription className="text-[13px]">
              <strong>{deleteTarget?.email}</strong> 관리자 계정을 영구 삭제합니다. 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          {deleteError && <p className="text-[11px] text-[hsl(0,84%,50%)]">{deleteError}</p>}
          <DialogFooter className="mt-3">
            <button onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-xl text-[12px] font-medium text-muted-foreground bg-white border border-[hsl(220,13%,91%)] hover:bg-[hsl(220,14%,96%)] transition-colors"
            >취소</button>
            <button onClick={deleteAdmin} disabled={deleting}
              className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,50%)] transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {deleting && <Loader2 className="w-3 h-3 animate-spin" />}
              삭제
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
