import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const PaymentDashboard = lazy(() => import("./PaymentDashboard"));
const ClientList = lazy(() => import("./ClientList"));
const ClientDetail = lazy(() => import("./ClientDetail"));
const PaymentModal = lazy(() => import("./PaymentModal"));
const ClientModal = lazy(() => import("./ClientModal"));
const PaymentCalendar = lazy(() => import("./PaymentCalendar"));

interface Client {
  id: string;
  client_no: number;
  name: string;
  expected_payment_day: string | null;
  notes: string | null;
  is_active: boolean;
}

interface Payment {
  id: string;
  client_id: string;
  year: number;
  month: number;
  amount: number;
  paid_date: string | null;
  is_unpaid: boolean;
  memo: string | null;
}

type SubView = "dashboard" | "clients" | "detail" | "calendar";

const Loader = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
  </div>
);

interface Props {
  isSuperAdmin: boolean;
  logActivity: (action: string, targetType?: string, targetId?: string, details?: any) => Promise<void>;
}

export default function AdminPayments({ isSuperAdmin, logActivity }: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subView, setSubView] = useState<SubView>("dashboard");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [preselectedClientId, setPreselectedClientId] = useState<string | undefined>(undefined);
  const [deletePaymentId, setDeletePaymentId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const [cRes, pRes] = await Promise.all([
      supabase.from("clients").select("*").order("client_no"),
      supabase.from("payments").select("*").order("year", { ascending: false }),
    ]);
    if (cRes.data) setClients(cRes.data as any);
    if (pRes.data) setPayments(pRes.data as any);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleNavigate = (view: string, clientId?: string) => {
    if (view === "detail" && clientId) {
      setSelectedClientId(clientId);
      setSubView("detail");
    } else {
      setSubView(view as SubView);
    }
  };

  const handleAddPayment = (clientId?: string) => {
    setEditPayment(null);
    setPreselectedClientId(clientId);
    setPaymentModalOpen(true);
  };

  const handleEditPayment = (payment: Payment) => {
    setEditPayment(payment);
    setPreselectedClientId(undefined);
    setPaymentModalOpen(true);
  };

  const handleSubmitPayment = async (data: any) => {
    try {
      if (editPayment) {
        const { error } = await supabase.from("payments").update(data).eq("id", editPayment.id);
        if (error) throw error;
        toast.success("입금 정보가 수정되었습니다");
        await logActivity("payment_updated", "payment", editPayment.id);
      } else {
        const { error } = await supabase.from("payments").insert(data);
        if (error) throw error;
        toast.success("입금이 등록되었습니다");
        await logActivity("payment_created", "payment");
      }
      setPaymentModalOpen(false);
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "오류가 발생했습니다");
    }
  };

  const handleDeletePayment = async () => {
    if (!deletePaymentId) return;
    try {
      const { error } = await supabase.from("payments").delete().eq("id", deletePaymentId);
      if (error) throw error;
      toast.success("입금 기록이 삭제되었습니다");
      await logActivity("payment_deleted", "payment", deletePaymentId);
      setDeletePaymentId(null);
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "삭제 중 오류가 발생했습니다");
    }
  };

  const handleEditClient = (client: Client) => {
    setEditClient(client);
    setClientModalOpen(true);
  };

  const handleAddClient = () => {
    setEditClient(null);
    setClientModalOpen(true);
  };

  const handleSubmitClient = async (data: any) => {
    try {
      if (editClient) {
        const { error } = await supabase.from("clients").update(data).eq("id", editClient.id);
        if (error) throw error;
        toast.success("고객사 정보가 수정되었습니다");
        await logActivity("client_updated", "client", editClient.id);
      } else {
        const { error } = await supabase.from("clients").insert(data);
        if (error) throw error;
        toast.success("고객사가 추가되었습니다");
        await logActivity("client_created", "client");
      }
      setClientModalOpen(false);
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "오류가 발생했습니다");
    }
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // Sub-navigation tabs
  const subTabs = [
    { key: "dashboard" as SubView, label: "대시보드" },
    { key: "clients" as SubView, label: "고객사 관리" },
    { key: "calendar" as SubView, label: "캘린더" },
  ];

  return (
    <div className="space-y-4">
      {/* Sub-tabs (only show when not in detail) */}
      {subView !== "detail" && (
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-[hsl(220,13%,91%)] w-fit">
          {subTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setSubView(t.key)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                subView === t.key
                  ? "bg-[hsl(221,83%,53%)] text-white"
                  : "text-muted-foreground hover:bg-[hsl(220,14%,96%)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <Suspense fallback={<Loader />}>
        {subView === "dashboard" && (
          <PaymentDashboard clients={clients} payments={payments} onNavigate={handleNavigate} />
        )}
        {subView === "clients" && (
          <ClientList
            clients={clients}
            payments={payments}
            onNavigate={handleNavigate}
            onAddPayment={handleAddPayment}
            onEditClient={handleEditClient}
            onAddClient={handleAddClient}
            onRefresh={fetchData}
          />
        )}
        {subView === "calendar" && (
          <PaymentCalendar clients={clients} payments={payments} onNavigate={handleNavigate} />
        )}
        {subView === "detail" && selectedClient && (
          <ClientDetail
            client={selectedClient}
            payments={payments}
            onBack={() => setSubView("clients")}
            onAddPayment={() => handleAddPayment(selectedClient.id)}
            onEditPayment={handleEditPayment}
            onDeletePayment={(id) => setDeletePaymentId(id)}
            onEditClient={() => handleEditClient(selectedClient)}
          />
        )}
      </Suspense>

      {/* Modals */}
      <Suspense fallback={null}>
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          onSubmit={handleSubmitPayment}
          clients={clients}
          editPayment={editPayment}
          preselectedClientId={preselectedClientId}
        />
        <ClientModal
          open={clientModalOpen}
          onClose={() => setClientModalOpen(false)}
          onSubmit={handleSubmitClient}
          editClient={editClient}
        />
      </Suspense>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletePaymentId} onOpenChange={(v) => !v && setDeletePaymentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[16px]">입금 기록 삭제</AlertDialogTitle>
            <AlertDialogDescription className="text-[13px]">
              이 입금 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-[13px]">취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePayment} className="bg-red-600 hover:bg-red-700 text-[13px]">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
