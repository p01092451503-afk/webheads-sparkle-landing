import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Loader2, Plus, Search, FileText, CheckCircle2, AlertTriangle,
  ChevronLeft, ChevronRight, ChevronDown, ArrowLeft, Trash2, Save, Eye, Send, X, CirclePlus, CircleMinus,
  RefreshCw, Ban, Mail, Wallet, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command, CommandInput, CommandList, CommandEmpty, CommandItem,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SalesLineItem {
  date: string;
  itemName: string;
  spec: string;
  quantity: number;
  unitPrice: string;
  supplyAmount: string;
  taxAmount: string;
  totalAmount: string;
}

interface AddContact {
  name: string;
  email: string;
}

interface TaxInvoiceLog {
  id: string;
  payment_id: string | null;
  client_id: string;
  nts_confirm_num: string | null;
  invoice_num: string | null;
  supplier_corp_num: string | null;
  buyer_corp_num: string | null;
  buyer_corp_name: string | null;
  buyer_ceo_name: string | null;
  buyer_email: string | null;
  supply_amount: number;
  tax_amount: number;
  total_amount: number;
  issue_date: string | null;
  status: string;
  memo: string | null;
  popbill_response: any;
  created_at: string;
}

interface Client {
  id: string;
  name: string;
  client_no: number | null;
}

interface ClientCompany {
  id: string;
  business_number: string;
  num: string | null;
  company_name: string;
  ceo_name: string | null;
  business_type: string | null;
  business_item: string | null;
  address1: string | null;
  address2: string | null;
  is_active: boolean;
}

interface ClientContact {
  company_id: string;
  name: string | null;
  position: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
}

export default function TaxInvoiceManager() {
  const [logs, setLogs] = useState<TaxInvoiceLog[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientCompanies, setClientCompanies] = useState<ClientCompany[]>([]);
  const [clientContacts, setClientContacts] = useState<ClientContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [issueOpen, setIssueOpen] = useState(false);
  const [clientSearchOpen, setClientSearchOpen] = useState(false);
  const [issuing, setIssuing] = useState(false);
  // Multi-step: 1=form, 2=preview/confirm, 3=final issue
  const [issueStep, setIssueStep] = useState<1 | 2 | 3>(1);
  const [saved, setSaved] = useState(false);
  const [savedLogId, setSavedLogId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [detailLog, setDetailLog] = useState<TaxInvoiceLog | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [isProduction, setIsProduction] = useState<boolean | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  // Issue form state
  const [form, setForm] = useState({
    clientId: "",
    buyerCorpNum: "",
    buyerCorpName: "",
    buyerCEOName: "",
    buyerEmail: "",
    buyerAddress: "",
    buyerBusinessType: "",
    buyerBusinessItem: "",
    memo: "",
    writeDate: new Date().toISOString().split("T")[0],
    applyDateToAll: true,
    invoiceType: "청구" as "영수" | "청구" | "없음",
    taxType: "과세" as "과세" | "영세" | "면세",
    // 공급자 담당자
    supplierContactName: "",
    supplierDeptName: "",
    supplierTEL: "",
    supplierHP: "",
    // 수정세금계산서
    isModify: false,
    modifyCode: "" as string,
    orgNTSConfirmNum: "",
    // 첨부
    businessLicenseYN: false,
    bankBookYN: false,
  });

  const emptyLine = (): SalesLineItem => ({
    date: form.writeDate,
    itemName: "",
    spec: "",
    quantity: 1,
    unitPrice: "",
    supplyAmount: "",
    taxAmount: "",
    totalAmount: "",
  });

  const [addContacts, setAddContacts] = useState<AddContact[]>([]);

  const [lineItems, setLineItems] = useState<SalesLineItem[]>([emptyLine()]);

  const [matchedContacts, setMatchedContacts] = useState<ClientContact[]>([]);
  const [selectedContactIdx, setSelectedContactIdx] = useState<number>(0);

  // Build a map: client_no -> client_companies info (matched by num)
  const clientCompanyMap = useMemo(() => {
    const map = new Map<string, ClientCompany>();
    for (const cc of clientCompanies) {
      if (cc.num && cc.is_active) {
        map.set(cc.num, cc);
      }
    }
    return map;
  }, [clientCompanies]);

  const getCompanyForClient = useCallback((client: Client) => {
    if (client.client_no == null) return null;
    return clientCompanyMap.get(String(client.client_no)) || null;
  }, [clientCompanyMap]);

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) {
      setForm(f => ({ ...f, clientId }));
      setMatchedContacts([]);
      return;
    }
    const company = getCompanyForClient(client);
    const companyContacts = company
      ? clientContacts.filter(ct => ct.company_id === company.id)
      : [];
    setMatchedContacts(companyContacts);
    setSelectedContactIdx(0);

    const address = company
      ? [company.address1, company.address2].filter(Boolean).join(" ")
      : "";

    // Primary email = first contact's email
    const primaryEmail = companyContacts[0]?.email || "";

    setForm(f => ({
      ...f,
      clientId,
      buyerCorpNum: company?.business_number || f.buyerCorpNum,
      buyerCorpName: company?.company_name || client.name,
      buyerCEOName: company?.ceo_name || f.buyerCEOName,
      buyerEmail: primaryEmail || f.buyerEmail,
      buyerAddress: address || f.buyerAddress,
      buyerBusinessType: company?.business_type || f.buyerBusinessType,
      buyerBusinessItem: company?.business_item || f.buyerBusinessItem,
    }));

    // Auto-populate addContacts with all other contacts that have email (excluding primary at idx 0)
    const additionalContacts = companyContacts
      .filter((ct, idx) => idx > 0 && ct.email)
      .slice(0, 5)
      .map(ct => ({ name: ct.name || "", email: ct.email || "" }));
    setAddContacts(additionalContacts);
  };

  // When담당자 changes, update addContacts to include all OTHER contacts with email
  const handleContactChange = (idx: number) => {
    setSelectedContactIdx(idx);
    const selected = matchedContacts[idx];
    setForm(f => ({ ...f, buyerEmail: selected?.email || f.buyerEmail }));

    // Rebuild addContacts: all contacts with email except the selected one
    const others = matchedContacts
      .filter((ct, i) => i !== idx && ct.email)
      .slice(0, 5)
      .map(ct => ({ name: ct.name || "", email: ct.email || "" }));
    setAddContacts(others);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [logsRes, clientsRes, companiesRes, contactsRes] = await Promise.all([
      supabase
        .from("tax_invoice_logs" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase.from("clients").select("id, name, client_no").order("sort_order"),
      supabase.from("client_companies").select("id, business_number, num, company_name, ceo_name, business_type, business_item, address1, address2, is_active"),
      supabase.from("client_contacts").select("company_id, name, position, phone, mobile, email"),
    ]);
    if (logsRes.data) setLogs(logsRes.data as any);
    if (clientsRes.data) setClients(clientsRes.data as any);
    if (companiesRes.data) setClientCompanies(companiesRes.data as any);
    if (contactsRes.data) setClientContacts(contactsRes.data as any);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch balance and environment on mount
  useEffect(() => {
    const fetchMeta = async () => {
      setBalanceLoading(true);
      try {
        const [balRes, envRes] = await Promise.all([
          supabase.functions.invoke("popbill-tax-invoice", { body: { action: "checkBalance" } }),
          supabase.functions.invoke("popbill-tax-invoice", { body: { action: "getEnvironment" } }),
        ]);
        console.log("[TaxInvoice] balRes:", JSON.stringify(balRes.data));
        if (balRes.data?.success) {
          const bd = balRes.data.data;
          console.log("[TaxInvoice] bd:", JSON.stringify(bd), "type:", typeof bd);
          let val: number | null = null;
          if (typeof bd === "object" && bd !== null && "totalPoint" in bd) {
            // New format: { partnerPoint, popbillPoint, totalPoint }
            val = typeof bd.totalPoint === "number" ? bd.totalPoint : parseFloat(bd.totalPoint) || null;
          } else if (typeof bd === "number") {
            val = bd;
          } else if (typeof bd === "object" && bd !== null) {
            val = bd.remainPoint ?? bd.Balance ?? bd.balance ?? bd.Point ?? bd.point ?? null;
            if (typeof val === "string") val = parseFloat(val);
          } else if (typeof bd === "string") {
            val = parseFloat(bd);
          }
          setBalance(typeof val === "number" && !isNaN(val) ? val : null);
        }
        if (envRes.data?.success) setIsProduction(envRes.data.data?.isProduction ?? false);
      } catch { /* ignore */ }
      setBalanceLoading(false);
    };
    fetchMeta();
  }, []);

  // 상태 동기화
  const handleSyncStatus = async (log: TaxInvoiceLog, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const mgtKey = (log.popbill_response as any)?.invoicerMgtKey || (log.popbill_response as any)?.mgtKey;
    if (!mgtKey) { toast.error("문서번호를 찾을 수 없습니다"); return; }
    setSyncingId(log.id);
    try {
      const res = await supabase.functions.invoke("popbill-tax-invoice", {
        body: { action: "checkStatus", mgtKey, invoiceLogId: log.id },
      });
      if (res.data?.success) {
        toast.success("상태가 동기화되었습니다");
        fetchData();
      } else {
        throw new Error(res.data?.error || "동기화 실패");
      }
    } catch (err: any) { toast.error(err.message); }
    setSyncingId(null);
  };

  // 발행 취소
  const handleCancel = async (log: TaxInvoiceLog, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm("세금계산서 발행을 취소하시겠습니까?\n국세청 전송 전에만 가능합니다.")) return;
    const mgtKey = (log.popbill_response as any)?.invoicerMgtKey || (log.popbill_response as any)?.mgtKey;
    if (!mgtKey) { toast.error("문서번호를 찾을 수 없습니다"); return; }
    setCancellingId(log.id);
    try {
      const res = await supabase.functions.invoke("popbill-tax-invoice", {
        body: { action: "cancel", mgtKey, invoiceLogId: log.id },
      });
      if (res.data?.success) {
        toast.success("발행이 취소되었습니다");
        fetchData();
        if (detailLog?.id === log.id) setDetailLog(null);
      } else {
        throw new Error(res.data?.error || "취소 실패");
      }
    } catch (err: any) { toast.error(err.message); }
    setCancellingId(null);
  };

  // 이메일 재전송
  const handleResendEmail = async (log: TaxInvoiceLog, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const mgtKey = (log.popbill_response as any)?.invoicerMgtKey || (log.popbill_response as any)?.mgtKey;
    if (!mgtKey) { toast.error("문서번호를 찾을 수 없습니다"); return; }
    setResendingId(log.id);
    try {
      const res = await supabase.functions.invoke("popbill-tax-invoice", {
        body: { action: "resendEmail", mgtKey, receiverEmail: log.buyer_email || "" },
      });
      if (res.data?.success) {
        toast.success(`${log.buyer_email || "거래처"}로 이메일이 재전송되었습니다`);
      } else {
        throw new Error(res.data?.error || "재전송 실패");
      }
    } catch (err: any) { toast.error(err.message); }
    setResendingId(null);
  };

  const filteredLogs = useMemo(() => {
    let result = logs.filter((l) => {
      if (!l.issue_date) return false;
      const d = new Date(l.issue_date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.buyer_corp_name?.toLowerCase().includes(s) ||
          l.buyer_corp_num?.includes(s) ||
          l.memo?.toLowerCase().includes(s)
      );
    }
    return result;
  }, [logs, year, month, search]);

  const monthTotal = useMemo(() => {
    return filteredLogs.reduce(
      (acc, l) => ({
        supply: acc.supply + (l.supply_amount || 0),
        tax: acc.tax + (l.tax_amount || 0),
        total: acc.total + (l.total_amount || 0),
      }),
      { supply: 0, tax: 0, total: 0 }
    );
  }, [filteredLogs]);

  const updateLineItem = (idx: number, field: keyof SalesLineItem, value: string | number) => {
    setLineItems(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      // Auto-calculate when unitPrice or quantity changes
      if (field === "unitPrice" || field === "quantity") {
        const qty = field === "quantity" ? Number(value) : updated[idx].quantity;
        const price = parseInt(String(field === "unitPrice" ? value : updated[idx].unitPrice).replace(/,/g, "")) || 0;
        const supply = qty * price;
        const tax = Math.round(supply * 0.1);
        updated[idx].supplyAmount = supply.toLocaleString("ko-KR");
        updated[idx].taxAmount = tax.toLocaleString("ko-KR");
        updated[idx].totalAmount = (supply + tax).toLocaleString("ko-KR");
      }
      return updated;
    });
  };

  const addLineItem = () => setLineItems(prev => [...prev, emptyLine()]);
  const removeLineItem = (idx: number) => {
    if (lineItems.length <= 1) return;
    setLineItems(prev => prev.filter((_, i) => i !== idx));
  };

  const lineTotals = useMemo(() => {
    return lineItems.reduce(
      (acc, l) => ({
        supply: acc.supply + (parseInt(l.supplyAmount.replace(/,/g, "")) || 0),
        tax: acc.tax + (parseInt(l.taxAmount.replace(/,/g, "")) || 0),
        total: acc.total + (parseInt(l.totalAmount.replace(/,/g, "")) || 0),
      }),
      { supply: 0, tax: 0, total: 0 }
    );
  }, [lineItems]);

  const filledLines = useMemo(() => lineItems.filter(l => l.itemName || l.unitPrice), [lineItems]);

  // Step 1: Save to DB with status "saved"
  const handleSave = async () => {
    if (!form.clientId || !form.buyerCorpNum) {
      toast.error("필수 항목을 입력해주세요 (고객사, 사업자번호)");
      return;
    }
    if (lineTotals.supply === 0) {
      toast.error("매출항목을 입력해주세요");
      return;
    }
    try {
      const { data, error } = await supabase.from("tax_invoice_logs" as any).insert({
        client_id: form.clientId,
        buyer_corp_num: form.buyerCorpNum,
        buyer_corp_name: form.buyerCorpName,
        buyer_ceo_name: form.buyerCEOName,
        buyer_email: form.buyerEmail,
        supply_amount: lineTotals.supply,
        tax_amount: lineTotals.tax,
        total_amount: lineTotals.total,
        issue_date: form.writeDate,
        status: "saved",
        memo: form.memo,
      }).select("id").single();
      if (error) throw error;
      setSavedLogId((data as any).id);
      setSaved(true);
      toast.success("세금계산서 정보가 저장되었습니다. 내용을 확인해주세요.");
      setIssueStep(2);
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "저장 중 오류가 발생했습니다");
    }
  };

  // Step 3: Actually issue via Popbill API → NTS
  const handleIssue = async () => {
    setIssuing(true);
    try {
      const supplyAmount = lineTotals.supply;
      const taxAmount = lineTotals.tax;

      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("popbill-tax-invoice", {
        body: {
          action: "issue",
          existingLogId: savedLogId,
          clientId: form.clientId,
          buyerCorpNum: form.buyerCorpNum.replace(/-/g, ""),
          buyerCorpName: form.buyerCorpName,
          buyerCEOName: form.buyerCEOName,
          buyerEmail: form.buyerEmail,
          buyerAddr: form.buyerAddress,
          buyerBizType: form.buyerBusinessType,
          buyerBizClass: form.buyerBusinessItem,
          supplyAmount,
          taxAmount,
          totalAmount: supplyAmount + taxAmount,
          writeDate: form.writeDate.replace(/-/g, ""),
          purposeType: form.invoiceType === "영수" ? 1 : 2,
          memo: form.memo,
          // 공급자 담당자
          supplierContactName: form.supplierContactName || undefined,
          supplierDeptName: form.supplierDeptName || undefined,
          supplierTEL: form.supplierTEL || undefined,
          supplierHP: form.supplierHP || undefined,
          // 수정세금계산서
          modifyCode: form.isModify && form.modifyCode ? parseInt(form.modifyCode) : undefined,
          orgNTSConfirmNum: form.isModify && form.orgNTSConfirmNum ? form.orgNTSConfirmNum : undefined,
          // 첨부
          businessLicenseYN: form.businessLicenseYN || undefined,
          bankBookYN: form.bankBookYN || undefined,
          // 추가 담당자
          addContactList: addContacts.length > 0 ? addContacts : undefined,
          items: filledLines.map(l => ({
            name: l.itemName,
            spec: l.spec || undefined,
            quantity: l.quantity,
            unitCost: parseInt(l.unitPrice.replace(/,/g, "")) || 0,
            date: l.date.replace(/-/g, ""),
            supplyAmount: parseInt(l.supplyAmount.replace(/,/g, "")) || 0,
            taxAmount: parseInt(l.taxAmount.replace(/,/g, "")) || 0,
            remark: "",
          })),
        },
      });

      if (res.error) throw new Error(res.error.message);
      const result = res.data;
      if (!result.success) throw new Error(result.error);

      // Update the saved record to "issued"
      if (savedLogId) {
        await supabase.from("tax_invoice_logs" as any)
          .update({
            status: "issued",
            popbill_response: result.data,
            invoice_num: result.data?.invoiceNum || null,
            nts_confirm_num: result.data?.ntsconfirmNum || null,
          })
          .eq("id", savedLogId);
      }

      toast.success("세금계산서가 발행되어 국세청(홈택스)에 전송되었습니다");
      resetAndClose();
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "발행 중 오류가 발생했습니다");
    } finally {
      setIssuing(false);
    }
  };

  const resetAndClose = () => {
    setIssueOpen(false);
    setIssueStep(1);
    setSaved(false);
    setSavedLogId(null);
    setForm({
      clientId: "",
      buyerCorpNum: "",
      buyerCorpName: "",
      buyerCEOName: "",
      buyerEmail: "",
      buyerAddress: "",
      buyerBusinessType: "",
      buyerBusinessItem: "",
      memo: "",
      writeDate: new Date().toISOString().split("T")[0],
      applyDateToAll: true,
      invoiceType: "청구",
      taxType: "과세",
      supplierContactName: "",
      supplierDeptName: "",
      supplierTEL: "",
      supplierHP: "",
      isModify: false,
      modifyCode: "",
      orgNTSConfirmNum: "",
      businessLicenseYN: false,
      bankBookYN: false,
    });
    setLineItems([emptyLine()]);
    setMatchedContacts([]);
    setSelectedContactIdx(0);
    setAddContacts([]);
  };
  // Open a saved log for issuing
  const handleOpenSavedLog = (log: TaxInvoiceLog) => {
    setSavedLogId(log.id);
    setSaved(true);
    const client = clients.find(c => c.id === log.client_id);
    const company = client ? getCompanyForClient(client) : null;
    const address = company ? [company.address1, company.address2].filter(Boolean).join(" ") : "";
    const contacts = company ? clientContacts.filter(ct => ct.company_id === company.id) : [];
    setMatchedContacts(contacts);
    setSelectedContactIdx(0);
    setForm({
      clientId: log.client_id,
      buyerCorpNum: log.buyer_corp_num || "",
      buyerCorpName: log.buyer_corp_name || "",
      buyerCEOName: log.buyer_ceo_name || "",
      buyerEmail: log.buyer_email || "",
      buyerAddress: address,
      buyerBusinessType: company?.business_type || "",
      buyerBusinessItem: company?.business_item || "",
      memo: log.memo || "",
      writeDate: log.issue_date || new Date().toISOString().split("T")[0],
      applyDateToAll: true,
      invoiceType: "청구",
      taxType: "과세",
      supplierContactName: "",
      supplierDeptName: "",
      supplierTEL: "",
      supplierHP: "",
      isModify: false,
      modifyCode: "",
      orgNTSConfirmNum: "",
      businessLicenseYN: false,
      bankBookYN: false,
    });
    setLineItems([{
      date: log.issue_date || new Date().toISOString().split("T")[0],
      itemName: log.memo || "서비스 이용료",
      spec: "",
      quantity: 1,
      unitPrice: log.supply_amount.toLocaleString("ko-KR"),
      supplyAmount: log.supply_amount.toLocaleString("ko-KR"),
      taxAmount: log.tax_amount.toLocaleString("ko-KR"),
      totalAmount: log.total_amount.toLocaleString("ko-KR"),
    }]);
    // Auto-populate addContacts with additional contacts that have email (excluding primary)
    const additionalContacts = contacts
      .filter((ct, idx) => idx > 0 && ct.email)
      .slice(0, 5)
      .map(ct => ({ name: ct.name || "", email: ct.email || "" }));
    setAddContacts(additionalContacts);
    setIssueStep(2);
    setIssueOpen(true);
  };

  const handleDeleteSavedLog = async (logId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("저장된 세금계산서를 삭제하시겠습니까?")) return;
    try {
      const { error } = await supabase.from("tax_invoice_logs").delete().eq("id", logId).eq("status", "saved");
      if (error) throw error;
      toast.success("삭제되었습니다");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "삭제 중 오류가 발생했습니다");
    }
  };

  const getClientName = (clientId: string) =>
    clients.find((c) => c.id === clientId)?.name || "-";

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  const prevMonth = () => {
    if (month === 1) { setYear(year - 1); setMonth(12); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(year + 1); setMonth(1); }
    else setMonth(month + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-bold flex items-center gap-2">
            <FileText className="w-4 h-4" />
            세금계산서 관리
          </h2>
          {isProduction !== null && (
            <Badge variant="outline" className={`text-[10px] ${isProduction ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
              <Globe className="w-3 h-3 mr-1" />
              {isProduction ? "운영" : "테스트"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* 포인트 잔액 */}
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg border">
            <Wallet className="w-3.5 h-3.5" />
            {balanceLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : balance !== null ? (
              <span className="font-semibold text-foreground">{typeof balance === "number" ? fmt(balance) : balance} P</span>
            ) : (
              <span>-</span>
            )}
          </div>
          <Button size="sm" className="text-[13px] gap-1.5" onClick={() => setIssueOpen(true)}>
            <Plus className="w-3.5 h-3.5" />
            세금계산서 발행
          </Button>
        </div>
      </div>

      {/* Month nav + search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-background border rounded-lg px-1">
          <button onClick={prevMonth} className="p-1.5 hover:bg-muted rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[13px] font-medium px-2 min-w-[80px] text-center">
            {year}년 {month}월
          </span>
          <button onClick={nextMonth} className="p-1.5 hover:bg-muted rounded">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="relative flex-1 max-w-[240px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="거래처 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-[13px]"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-background border rounded-xl p-3">
          <p className="text-[11px] text-muted-foreground">공급가액</p>
          <p className="text-[15px] font-bold">{fmt(monthTotal.supply)}원</p>
        </div>
        <div className="bg-background border rounded-xl p-3">
          <p className="text-[11px] text-muted-foreground">세액</p>
          <p className="text-[15px] font-bold">{fmt(monthTotal.tax)}원</p>
        </div>
        <div className="bg-background border rounded-xl p-3">
          <p className="text-[11px] text-muted-foreground">합계</p>
          <p className="text-[15px] font-bold text-primary">{fmt(monthTotal.total)}원</p>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left px-3 py-2 font-medium">발행일</th>
                <th className="text-left px-3 py-2 font-medium">거래처</th>
                <th className="text-left px-3 py-2 font-medium">사업자번호</th>
                <th className="text-right px-3 py-2 font-medium">공급가액</th>
                <th className="text-right px-3 py-2 font-medium">세액</th>
                <th className="text-right px-3 py-2 font-medium">합계</th>
                <th className="text-center px-3 py-2 font-medium">상태</th>
                <th className="text-left px-3 py-2 font-medium">메모</th>
                <th className="px-3 py-2 w-[160px] text-center font-medium">작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-muted-foreground text-[13px]">
                    발행된 세금계산서가 없습니다
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const statusConfig: Record<string, { label: string; className: string }> = {
                    issued: { label: "발행완료", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                    saved: { label: "저장", className: "bg-blue-50 text-blue-700 border-blue-200" },
                    nts_success: { label: "국세청승인", className: "bg-green-50 text-green-800 border-green-300" },
                    nts_failed: { label: "전송실패", className: "bg-red-50 text-red-700 border-red-200" },
                    cancelled: { label: "취소", className: "bg-gray-50 text-gray-500 border-gray-200" },
                  };
                  const st = statusConfig[log.status] || { label: log.status, className: "bg-amber-50 text-amber-700 border-amber-200" };

                  return (
                    <tr
                      key={log.id}
                      className="border-b last:border-0 hover:bg-muted/30 cursor-pointer"
                      onClick={() => {
                        if (log.status === "saved") handleOpenSavedLog(log);
                        else setDetailLog(log);
                      }}
                    >
                      <td className="px-3 py-2 whitespace-nowrap">{log.issue_date || "-"}</td>
                      <td className="px-3 py-2 font-medium">
                        {log.buyer_corp_name || getClientName(log.client_id)}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{log.buyer_corp_num || "-"}</td>
                      <td className="px-3 py-2 text-right">{fmt(log.supply_amount)}</td>
                      <td className="px-3 py-2 text-right">{fmt(log.tax_amount)}</td>
                      <td className="px-3 py-2 text-right font-medium">{fmt(log.total_amount)}</td>
                      <td className="px-3 py-2 text-center">
                        <Badge variant="outline" className={`${st.className} text-[11px]`}>
                          {st.label}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground max-w-[120px] truncate">
                        {log.memo || "-"}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1 justify-center" onClick={e => e.stopPropagation()}>
                          {log.status === "saved" && (
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                              onClick={(e) => handleDeleteSavedLog(log.id, e)}>
                              <X className="w-3 h-3" /> 삭제
                            </Button>
                          )}
                          {(log.status === "issued" || log.status === "nts_success" || log.status === "nts_failed") && (
                            <>
                              <Button variant="ghost" size="sm" className="h-7 px-1.5 text-[11px] gap-0.5"
                                disabled={syncingId === log.id}
                                onClick={(e) => handleSyncStatus(log, e)}
                                title="상태 동기화">
                                <RefreshCw className={`w-3 h-3 ${syncingId === log.id ? "animate-spin" : ""}`} />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 px-1.5 text-[11px] gap-0.5"
                                disabled={resendingId === log.id}
                                onClick={(e) => handleResendEmail(log, e)}
                                title="이메일 재전송">
                                <Mail className={`w-3 h-3 ${resendingId === log.id ? "animate-pulse" : ""}`} />
                              </Button>
                              {log.status === "issued" && (
                                <Button variant="ghost" size="sm" className="h-7 px-1.5 text-[11px] text-destructive hover:text-destructive hover:bg-destructive/10 gap-0.5"
                                  disabled={cancellingId === log.id}
                                  onClick={(e) => handleCancel(log, e)}
                                  title="발행 취소">
                                  <Ban className={`w-3 h-3 ${cancellingId === log.id ? "animate-pulse" : ""}`} />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Dialog - Popbill Style */}
      <Dialog open={issueOpen} onOpenChange={(open) => { if (!open) resetAndClose(); else setIssueOpen(true); }}>
        <DialogContent className="max-w-[90vw] w-[1445px] max-h-[92vh] p-0 overflow-hidden">
          <ScrollArea className="max-h-[calc(92vh-2rem)] w-full">
          {/* Step 2/3: Preview & Issue */}
          {issueStep >= 2 && (
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span className="text-[20px] font-bold">세금계산서 {issueStep === 2 ? "미리보기" : "발행 확인"}</span>
                <Button variant="ghost" size="sm" className="ml-2 text-[13px] h-7 gap-1" onClick={() => setIssueStep(issueStep === 3 ? 2 : 1)}>
                  <ArrowLeft className="w-3.5 h-3.5" /> 이전
                </Button>
              </div>

              {/* Popbill-style read-only invoice preview */}
              <div style={{ border: "1px solid #999", backgroundColor: "#fff" }}>
                {/* Title row */}
                <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid #999" }}>
                  <h3 className="text-[16px] font-extrabold tracking-[0.3em]" style={{ color: "#333" }}>전자세금계산서</h3>
                  <div className="flex items-center gap-4 text-[12px]" style={{ color: "#666" }}>
                    <span>책 번호 : _____ 권 _____ 호</span>
                    <span>일련번호 : __________</span>
                  </div>
                </div>

                {/* Supplier & Buyer side by side */}
                <div className="grid grid-cols-2" style={{ borderBottom: "1px solid #999" }}>
                  {/* 공급자 */}
                  <div className="flex" style={{ borderRight: "2px solid #999" }}>
                    <div className="flex items-center justify-center shrink-0" style={{ width: "36px", backgroundColor: "#fff2f2", borderRight: "1px solid #ccc", writingMode: "vertical-rl" as any }}>
                      <span className="text-[16px] font-bold" style={{ color: "#cc3333", letterSpacing: "0.2em" }}>공급자</span>
                    </div>
                    <table className="flex-1 text-[13px]" style={{ borderCollapse: "collapse", tableLayout: "fixed" }}>
                      <colgroup>
                        <col style={{ width: "75px" }} />
                        <col style={{ width: "40%" }} />
                        <col style={{ width: "70px" }} />
                        <col />
                      </colgroup>
                      <tbody>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td className="px-3 py-[7px] font-bold whitespace-nowrap" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>등록번호</td>
                          <td className="px-3 py-[7px] font-medium" style={{ color: "#333" }}>204-86-20072</td>
                          <td className="px-3 py-[7px] font-bold whitespace-nowrap" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>종사업장</td>
                          <td className="px-3 py-[7px]"></td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>상호</td>
                          <td className="px-3 py-[7px]" style={{ color: "#333" }}>주식회사 웹헤즈</td>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>성명</td>
                          <td className="px-3 py-[7px]" style={{ color: "#333" }}>박진열</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>주소</td>
                          <td colSpan={3} className="px-3 py-[7px]" style={{ color: "#333" }}>서울특별시 마포구 월드컵로114, 3층(성산동, 효남빌딩)</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>업태</td>
                          <td className="px-3 py-[7px]" style={{ color: "#333" }}>정보통신업</td>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>종목</td>
                          <td className="px-3 py-[7px]" style={{ color: "#333" }}>응용소프트웨어 개발 및 공급</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>담당자명</td>
                          <td className="px-3 py-[7px]" style={{ color: "#333" }}>{form.supplierContactName || "박진열"}</td>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>연락처</td>
                          <td className="px-3 py-[7px]" style={{ color: "#333" }}>{form.supplierTEL || ""}</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>이메일</td>
                          <td colSpan={3} className="px-3 py-[7px]" style={{ color: "#333" }}>34bus@webheads.co.kr</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 공급받는자 */}
                  <div className="flex">
                    <div className="flex items-center justify-center shrink-0" style={{ width: "36px", backgroundColor: "#f0f4ff", borderRight: "1px solid #ccc", writingMode: "vertical-rl" as any }}>
                      <span className="text-[16px] font-bold" style={{ color: "#3366cc", letterSpacing: "0.15em" }}>공급받는자</span>
                    </div>
                    <table className="flex-1 text-[13px]" style={{ borderCollapse: "collapse", tableLayout: "fixed" }}>
                      <colgroup>
                        <col style={{ width: "75px" }} />
                        <col style={{ width: "40%" }} />
                        <col style={{ width: "70px" }} />
                        <col />
                      </colgroup>
                      <tbody>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td className="px-3 py-[7px] font-bold whitespace-nowrap" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd" }}>등록번호</td>
                          <td className="px-3 py-[7px] font-medium" style={{ color: "#333" }}>{form.buyerCorpNum || "-"}</td>
                          <td className="px-3 py-[7px] font-bold whitespace-nowrap" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>종사업장</td>
                          <td className="px-3 py-[7px]"></td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd" }}>상호</td>
                          <td className="px-3 py-[7px]" style={{ color: "#333" }}>{form.buyerCorpName || "-"}</td>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>성명</td>
                          <td className="px-3 py-[7px]" style={{ color: "#333" }}>{form.buyerCEOName || "-"}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd" }}>주소</td>
                          <td colSpan={3} className="px-3 py-[7px]" style={{ color: "#333" }}>{form.buyerAddress || "-"}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd" }}>업태</td>
                          <td className="px-3 py-[7px]" style={{ color: "#333" }}>{form.buyerBusinessType || "-"}</td>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>종목</td>
                          <td className="px-3 py-[7px]" style={{ color: "#333" }}>{form.buyerBusinessItem || "-"}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd" }}>담당자명</td>
                          <td className="px-3 py-[7px]" style={{ color: "#333" }}></td>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>연락처</td>
                          <td className="px-3 py-[7px]" style={{ color: "#333" }}></td>
                        </tr>
                        <tr>
                          <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd" }}>이메일</td>
                          <td colSpan={3} className="px-3 py-[7px]" style={{ color: "#333" }}>{form.buyerEmail || "-"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 작성일자 / 공급가액 / 세액 */}
                <table className="w-full text-[13px]" style={{ borderCollapse: "collapse", borderBottom: "1px solid #999" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f0f0f0" }}>
                      <th className="px-3 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "200px" }}>작성일자</th>
                      <th className="px-3 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc" }}>공급가액</th>
                      <th className="px-3 py-[6px] font-bold text-center">세액</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderTop: "1px solid #ddd" }}>
                      <td className="px-3 py-[6px] text-center" style={{ borderRight: "1px solid #ccc" }}>{form.writeDate}</td>
                      <td className="px-3 py-[6px] text-right font-semibold tabular-nums text-[14px]" style={{ borderRight: "1px solid #ccc" }}>{fmt(lineTotals.supply)}</td>
                      <td className="px-3 py-[6px] text-right font-semibold tabular-nums text-[14px]">{fmt(lineTotals.tax)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* 비고 */}
                {form.memo && (
                  <table className="w-full text-[13px]" style={{ borderCollapse: "collapse", borderBottom: "1px solid #ddd" }}>
                    <tbody>
                      <tr>
                        <td className="px-3 py-[5px] font-bold text-center" style={{ width: "80px", backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc" }}>비고1</td>
                        <td className="px-3 py-[5px]" style={{ color: "#333" }}>{form.memo}</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {/* Line Items */}
                <table className="w-full text-[13px]" style={{ borderCollapse: "collapse", borderTop: "2px solid #999" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f0f0f0" }}>
                      <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "50px" }}>월</th>
                      <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "50px" }}>일</th>
                      <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", minWidth: "200px" }}>품목</th>
                      <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "100px" }}>규격</th>
                      <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "90px" }}>수량</th>
                      <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "120px" }}>단가</th>
                      <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "130px" }}>공급가액</th>
                      <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "120px" }}>세액</th>
                      <th className="px-2 py-[6px] font-bold text-center" style={{ minWidth: "80px" }}>비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filledLines.map((l, i) => {
                      const dateObj = new Date(l.date || form.writeDate);
                      return (
                        <tr key={i} style={{ borderTop: "1px solid #ddd" }}>
                          <td className="px-2 py-[6px] text-center" style={{ borderRight: "1px solid #ddd" }}>{dateObj.getMonth() + 1}</td>
                          <td className="px-2 py-[6px] text-center" style={{ borderRight: "1px solid #ddd" }}>{dateObj.getDate()}</td>
                          <td className="px-2 py-[6px] font-medium" style={{ borderRight: "1px solid #ddd", color: "#333" }}>{l.itemName}</td>
                          <td className="px-2 py-[6px] text-center" style={{ borderRight: "1px solid #ddd", color: "#666" }}>{l.spec || "-"}</td>
                          <td className="px-2 py-[6px] text-center" style={{ borderRight: "1px solid #ddd" }}>{l.quantity}</td>
                          <td className="px-2 py-[6px] text-right tabular-nums" style={{ borderRight: "1px solid #ddd" }}>{l.unitPrice ? `${l.unitPrice}` : "-"}</td>
                          <td className="px-2 py-[6px] text-right font-medium tabular-nums" style={{ borderRight: "1px solid #ddd" }}>{fmt(parseInt(l.supplyAmount.replace(/,/g, "")) || 0)}</td>
                          <td className="px-2 py-[6px] text-right tabular-nums" style={{ borderRight: "1px solid #ddd" }}>{fmt(parseInt(l.taxAmount.replace(/,/g, "")) || 0)}</td>
                          <td className="px-2 py-[6px]"></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Bottom totals */}
                <table className="w-full text-[13px]" style={{ borderCollapse: "collapse", borderTop: "2px solid #999" }}>
                  <tbody>
                    <tr>
                      <td className="px-3 py-[6px] font-bold text-center" style={{ backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc", width: "120px" }}>합계금액</td>
                      <td className="px-3 py-[6px] text-right font-bold tabular-nums" style={{ borderRight: "1px solid #ccc", width: "140px" }}>{fmt(lineTotals.total)}</td>
                      <td className="px-3 py-[6px] font-bold text-center" style={{ backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc", width: "60px" }}>현금</td>
                      <td className="px-3 py-[6px]" style={{ borderRight: "1px solid #ccc", width: "120px" }}></td>
                      <td className="px-3 py-[6px] font-bold text-center" style={{ backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc", width: "60px" }}>수표</td>
                      <td className="px-3 py-[6px]" style={{ borderRight: "1px solid #ccc", width: "120px" }}></td>
                      <td className="px-3 py-[6px] font-bold text-center" style={{ backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc", width: "60px" }}>어음</td>
                      <td className="px-3 py-[6px]" style={{ borderRight: "1px solid #ccc", width: "120px" }}></td>
                      <td className="px-3 py-[6px] font-bold text-center" style={{ backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc", width: "80px" }}>외상미수금</td>
                      <td className="px-3 py-[6px]" style={{ width: "120px" }}></td>
                    </tr>
                  </tbody>
                </table>

                {/* 영수/청구 */}
                <div className="flex items-center justify-end px-4 py-2 text-[13px]" style={{ borderTop: "2px solid #999", color: "#333" }}>
                  <span>이 금액을 [ <strong>{form.invoiceType === "없음" ? "" : form.invoiceType}</strong> ] 함</span>
                </div>
              </div>

              {/* 법적 안내 */}
              <p className="text-[11px]" style={{ color: "#999" }}>
                ※ 본 전자세금계산서는 국세청 미전송 건으로, 국세청 전송이 완료된 이후에 법적 효력을 갖습니다. (국세청고시 제2023-17호, 2023.9.1)
              </p>
              {issueStep === 2 && (
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={() => setIssueStep(1)} className="px-5 py-2.5 rounded-xl text-[13px] font-semibold gap-1.5 h-auto">
                    <ArrowLeft className="w-3.5 h-3.5" /> 수정하기
                  </Button>
                  <Button onClick={() => setIssueStep(3)} className="px-5 py-2.5 rounded-xl text-[13px] font-semibold gap-1.5 h-auto">
                    <Send className="w-3.5 h-3.5" /> 발행하기
                  </Button>
                </div>
              )}
              {issueStep === 3 && (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-4.5 h-4.5 text-destructive" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[14px] font-bold text-foreground">세금계산서를 발행하시겠습니까?</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">
                        발행 후 팝빌을 통해 국세청(홈택스)에 자동 전송됩니다.<br />
                        발행 후에는 취소가 어려우므로 내용을 다시 한번 확인해주세요.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2.5 pt-1">
                    <Button variant="outline" onClick={() => setIssueStep(2)} className="px-5 py-2.5 rounded-xl text-[13px] font-semibold h-auto">취소</Button>
                    <Button onClick={handleIssue} disabled={issuing} className="px-5 py-2.5 rounded-xl text-[13px] font-semibold gap-1.5 h-auto bg-primary hover:bg-primary/90">
                      {issuing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      발행 및 홈택스 전송
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Popbill-style Form */}
          {issueStep === 1 && (
          <div className="p-6 space-y-4" style={{ backgroundColor: "#f5f5f5" }}>
            {/* Top options row */}
            <div className="flex items-center gap-6 flex-wrap text-[13px]">
              <div className="flex items-center gap-2">
                <span className="font-bold" style={{ color: "#333" }}>과세형태</span>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="tax-type" checked={form.taxType === "과세"} onChange={() => setForm(f => ({ ...f, taxType: "과세" }))} className="w-3.5 h-3.5" /> 과세(10%)</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="tax-type" checked={form.taxType === "영세"} onChange={() => setForm(f => ({ ...f, taxType: "영세" }))} className="w-3.5 h-3.5" /> 영세(0%)</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="tax-type" checked={form.taxType === "면세"} onChange={() => setForm(f => ({ ...f, taxType: "면세" }))} className="w-3.5 h-3.5" /> 면세(세액없음)</label>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold" style={{ color: "#333" }}>거래처유형</span>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="buyer-type" checked disabled className="w-3.5 h-3.5" /> 사업자(사업자번호)</label>
              </div>
            </div>

            {/* Main Invoice Table */}
            <div style={{ border: "1px solid #999", backgroundColor: "#fff" }}>
              {/* Title row with 책번호/일련번호 */}
              <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid #999" }}>
                <h3 className="text-[16px] font-extrabold tracking-[0.3em]" style={{ color: "#333" }}>전자세금계산서</h3>
                <div className="flex items-center gap-4 text-[12px]" style={{ color: "#666" }}>
                  <span>책 번호 : <input className="w-8 text-center border-b" style={{ borderColor: "#ccc" }} /> 권 <input className="w-8 text-center border-b" style={{ borderColor: "#ccc" }} /> 호</span>
                  <span>일련번호 : <input className="w-20 text-center border-b" style={{ borderColor: "#ccc" }} /></span>
                </div>
              </div>

              {/* Supplier & Buyer side by side */}
              <div className="grid grid-cols-2" style={{ borderBottom: "1px solid #999" }}>
                {/* 공급자 (Supplier) */}
                <div className="flex" style={{ borderRight: "2px solid #999" }}>
                  <div className="flex items-center justify-center shrink-0" style={{ width: "36px", backgroundColor: "#fff2f2", borderRight: "1px solid #ccc", writingMode: "vertical-rl" as any }}>
                    <span className="text-[16px] font-bold" style={{ color: "#cc3333", letterSpacing: "0.2em" }}>공급자</span>
                  </div>
                  <table className="flex-1 text-[13px]" style={{ borderCollapse: "collapse", tableLayout: "fixed" }}>
                    <colgroup>
                      <col style={{ width: "75px" }} />
                      <col style={{ width: "40%" }} />
                      <col style={{ width: "70px" }} />
                      <col />
                    </colgroup>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <td className="px-3 py-[7px] font-bold whitespace-nowrap" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>등록번호</td>
                        <td className="px-3 py-[7px] font-medium" style={{ color: "#333" }}>204-86-20072</td>
                        <td className="px-3 py-[7px] font-bold whitespace-nowrap" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>종사업장</td>
                        <td className="px-3 py-[7px]"></td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>상호</td>
                        <td className="px-3 py-[7px]" style={{ color: "#333" }}>주식회사 웹헤즈</td>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>성명</td>
                        <td className="px-3 py-[7px]" style={{ color: "#333" }}>박진열</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>주소</td>
                        <td colSpan={3} className="px-3 py-[7px]" style={{ color: "#333" }}>서울특별시 마포구 월드컵로114, 3층(성산동, 효남빌딩)</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>업태</td>
                        <td className="px-3 py-[7px]" style={{ color: "#333" }}>정보통신업</td>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>종목</td>
                        <td className="px-3 py-[7px]" style={{ color: "#333" }}>응용소프트웨어 개발 및 공급</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>담당자명</td>
                        <td className="px-3 py-[7px]">
                          <Input value={form.supplierContactName} onChange={(e) => setForm(f => ({ ...f, supplierContactName: e.target.value }))} className="h-6 text-[13px] border-0 p-0 shadow-none focus-visible:ring-0" placeholder="박진열" />
                        </td>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>연락처</td>
                        <td className="px-3 py-[7px]">
                          <Input value={form.supplierTEL} onChange={(e) => setForm(f => ({ ...f, supplierTEL: e.target.value }))} className="h-6 text-[13px] border-0 p-0 shadow-none focus-visible:ring-0" placeholder="010-9245-1503" />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>이메일</td>
                        <td colSpan={3} className="px-3 py-[7px]" style={{ color: "#333" }}>34bus@webheads.co.kr</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 공급받는자 (Buyer) */}
                <div className="flex">
                  <div className="flex items-center justify-center shrink-0" style={{ width: "36px", backgroundColor: "#f0f4ff", borderRight: "1px solid #ccc", writingMode: "vertical-rl" as any }}>
                    <span className="text-[16px] font-bold" style={{ color: "#3366cc", letterSpacing: "0.15em" }}>공급받는자</span>
                  </div>
                  <table className="flex-1 text-[13px]" style={{ borderCollapse: "collapse", tableLayout: "fixed" }}>
                    <colgroup>
                      <col style={{ width: "75px" }} />
                      <col style={{ width: "40%" }} />
                      <col style={{ width: "70px" }} />
                      <col />
                    </colgroup>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <td className="px-3 py-[7px] font-bold whitespace-nowrap" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd" }}>등록번호</td>
                        <td className="px-3 py-[7px]" colSpan={1}>
                          <div className="flex items-center gap-1">
                            <Popover open={clientSearchOpen} onOpenChange={setClientSearchOpen}>
                              <PopoverTrigger asChild>
                                <button className="flex-1 text-left text-[13px] h-7 px-2 rounded truncate" style={{ border: "1px solid #ccc", backgroundColor: "#fff" }}>
                                  {form.buyerCorpNum || "등록번호 / 상호 / 성명"}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[460px] p-0" align="start" onWheel={(e) => e.stopPropagation()}>
                                <Command shouldFilter={true}>
                                  <CommandInput placeholder="고객명 또는 사업자번호 검색..." className="text-[13px]" />
                                  <div className="max-h-[300px] overflow-y-auto overscroll-contain" onWheel={(e) => e.stopPropagation()}>
                                    <CommandList className="max-h-none">
                                      <CommandEmpty className="text-[13px] py-4 text-center">검색 결과가 없습니다</CommandEmpty>
                                      {clients.map((c) => {
                                        const matched = getCompanyForClient(c);
                                        const displayName = matched ? matched.company_name : c.name;
                                        const bizNum = matched?.business_number || "";
                                        return (
                                          <CommandItem
                                            key={c.id}
                                            value={`${displayName} ${bizNum} ${c.name}`}
                                            onSelect={() => {
                                              handleClientSelect(c.id);
                                              setClientSearchOpen(false);
                                            }}
                                            className="text-[13px] cursor-pointer"
                                          >
                                            <span className="font-medium">{displayName}</span>
                                            {bizNum && <span className="text-muted-foreground ml-2">({bizNum})</span>}
                                          </CommandItem>
                                        );
                                      })}
                                    </CommandList>
                                  </div>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <button onClick={() => setClientSearchOpen(true)} className="h-7 px-3 text-[12px] rounded shrink-0" style={{ border: "1px solid #ccc", backgroundColor: "#f0f0f0", color: "#333" }}>조회</button>
                          </div>
                        </td>
                        <td className="px-3 py-[7px] font-bold whitespace-nowrap" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>종사업장</td>
                        <td className="px-3 py-[7px]"></td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd" }}>상호</td>
                        <td className="px-3 py-[7px]">
                          <Input value={form.buyerCorpName} onChange={(e) => setForm(f => ({ ...f, buyerCorpName: e.target.value }))} className="h-6 text-[13px] border-0 p-0 shadow-none focus-visible:ring-0" />
                        </td>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>성명</td>
                        <td className="px-3 py-[7px]">
                          <Input value={form.buyerCEOName} onChange={(e) => setForm(f => ({ ...f, buyerCEOName: e.target.value }))} className="h-6 text-[13px] border-0 p-0 shadow-none focus-visible:ring-0" />
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd" }}>주소</td>
                        <td colSpan={3} className="px-3 py-[7px]">
                          <Input value={form.buyerAddress} onChange={(e) => setForm(f => ({ ...f, buyerAddress: e.target.value }))} className="h-6 text-[13px] border-0 p-0 shadow-none focus-visible:ring-0" />
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd" }}>업태</td>
                        <td className="px-3 py-[7px]">
                          <Input value={form.buyerBusinessType} onChange={(e) => setForm(f => ({ ...f, buyerBusinessType: e.target.value }))} className="h-6 text-[13px] border-0 p-0 shadow-none focus-visible:ring-0" />
                        </td>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>종목</td>
                        <td className="px-3 py-[7px]">
                          <Input value={form.buyerBusinessItem} onChange={(e) => setForm(f => ({ ...f, buyerBusinessItem: e.target.value }))} className="h-6 text-[13px] border-0 p-0 shadow-none focus-visible:ring-0" />
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd" }}>담당자명</td>
                        <td className="px-3 py-[7px]">
                          {matchedContacts.length > 0 ? (
                            <select
                              value={selectedContactIdx}
                              onChange={(e) => handleContactChange(parseInt(e.target.value))}
                              className="h-6 text-[13px] bg-transparent border-0 p-0 w-full focus:outline-none"
                            >
                              {matchedContacts.map((ct, i) => (
                                <option key={i} value={i}>{ct.name || "-"} {ct.position ? `(${ct.position})` : ""}</option>
                              ))}
                            </select>
                          ) : (
                            <Input className="h-6 text-[13px] border-0 p-0 shadow-none focus-visible:ring-0" placeholder="" />
                          )}
                        </td>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>연락처</td>
                        <td className="px-3 py-[7px] text-[13px]" style={{ color: "#666" }}>
                          {matchedContacts[selectedContactIdx]?.phone || matchedContacts[selectedContactIdx]?.mobile || ""}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd" }}>이메일</td>
                        <td colSpan={2} className="px-3 py-[7px]">
                          <Input value={form.buyerEmail} onChange={(e) => setForm(f => ({ ...f, buyerEmail: e.target.value }))} className="h-6 text-[13px] border-0 p-0 shadow-none focus-visible:ring-0" type="email" />
                        </td>
                        <td className="px-3 py-[7px]"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 작성일자 / 공급가액 / 세액 row */}
              <table className="w-full text-[13px]" style={{ borderCollapse: "collapse", borderTop: "1px solid #999" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <th className="px-3 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "200px" }}>작성일자</th>
                    <th className="px-3 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc" }}>공급가액</th>
                    <th className="px-3 py-[6px] font-bold text-center">세액</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderTop: "1px solid #ddd" }}>
                    <td className="px-3 py-[6px]" style={{ borderRight: "1px solid #ccc" }}>
                      <Input
                        type="date"
                        value={form.writeDate}
                        onChange={(e) => {
                          const newDate = e.target.value;
                          setForm(f => ({ ...f, writeDate: newDate }));
                          if (form.applyDateToAll) {
                            setLineItems(prev => prev.map(l => ({ ...l, date: newDate })));
                          }
                        }}
                        className="h-7 text-[13px] w-[150px]"
                      />
                    </td>
                    <td className="px-3 py-[6px] text-right font-semibold tabular-nums text-[14px]" style={{ borderRight: "1px solid #ccc" }}>
                      {fmt(lineTotals.supply)}
                    </td>
                    <td className="px-3 py-[6px] text-right font-semibold tabular-nums text-[14px]">
                      {fmt(lineTotals.tax)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* 비고1 row */}
              <table className="w-full text-[13px]" style={{ borderCollapse: "collapse", borderTop: "1px solid #ddd" }}>
                <tbody>
                  <tr>
                    <td className="px-3 py-[5px] font-bold text-center" style={{ width: "80px", backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc" }}>비고1</td>
                    <td className="px-2 py-[5px]">
                      <Input value={form.memo} onChange={(e) => setForm(f => ({ ...f, memo: e.target.value }))} className="h-6 text-[13px] border-0 p-0 shadow-none focus-visible:ring-0" placeholder="" />
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Line Items Table */}
              <table className="w-full text-[13px]" style={{ borderCollapse: "collapse", borderTop: "2px solid #999" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "50px" }}>월</th>
                    <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "50px" }}>일</th>
                    <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", minWidth: "200px" }}>품목</th>
                    <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "100px" }}>규격</th>
                    <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "90px" }}>수량</th>
                    <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "110px" }}>단가</th>
                    <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "55px" }}>자동</th>
                    <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "130px" }}>공급가액</th>
                    <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "120px" }}>세액</th>
                    <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", minWidth: "80px" }}>비고</th>
                    <th className="px-1 py-[6px]" style={{ width: "30px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((line, idx) => {
                    const dateObj = new Date(line.date);
                    const mm = String(dateObj.getMonth() + 1);
                    const dd = String(dateObj.getDate());
                    return (
                      <tr key={idx} style={{ borderTop: "1px solid #ddd" }}>
                        <td className="px-1 py-1" style={{ borderRight: "1px solid #ddd" }}>
                          <Input
                            value={mm}
                            onChange={(e) => {
                              const m = parseInt(e.target.value) || 1;
                              const d = new Date(line.date);
                              d.setMonth(m - 1);
                              updateLineItem(idx, "date", d.toISOString().split("T")[0]);
                            }}
                            disabled={form.applyDateToAll}
                            className="h-7 text-[13px] text-center px-1 border-0 shadow-none focus-visible:ring-0"
                          />
                        </td>
                        <td className="px-1 py-1" style={{ borderRight: "1px solid #ddd" }}>
                          <Input
                            value={dd}
                            onChange={(e) => {
                              const dayVal = parseInt(e.target.value) || 1;
                              const d = new Date(line.date);
                              d.setDate(dayVal);
                              updateLineItem(idx, "date", d.toISOString().split("T")[0]);
                            }}
                            disabled={form.applyDateToAll}
                            className="h-7 text-[13px] text-center px-1 border-0 shadow-none focus-visible:ring-0"
                          />
                        </td>
                        <td className="px-1 py-1" style={{ borderRight: "1px solid #ddd" }}>
                          <div className="flex items-center gap-1">
                            <Input
                              value={line.itemName}
                              onChange={(e) => updateLineItem(idx, "itemName", e.target.value)}
                              className="h-7 text-[13px] px-1.5 border-0 shadow-none focus-visible:ring-0 flex-1"
                              placeholder="품목명 / 품목코드"
                            />
                            <button className="text-[11px] px-1.5 py-0.5 rounded shrink-0" style={{ border: "1px solid #ccc", backgroundColor: "#f0f0f0", color: "#333" }}>조회</button>
                          </div>
                        </td>
                        <td className="px-1 py-1" style={{ borderRight: "1px solid #ddd" }}>
                          <Input
                            value={line.spec}
                            onChange={(e) => updateLineItem(idx, "spec", e.target.value)}
                            className="h-7 text-[13px] px-1.5 border-0 shadow-none focus-visible:ring-0"
                          />
                        </td>
                        <td className="px-1 py-1" style={{ borderRight: "1px solid #ddd" }}>
                          <Input
                            type="number"
                            value={line.quantity}
                            onChange={(e) => updateLineItem(idx, "quantity", parseInt(e.target.value) || 1)}
                            className="h-7 text-[13px] text-center px-1 border-0 shadow-none focus-visible:ring-0"
                            min={1}
                          />
                        </td>
                        <td className="px-1 py-1" style={{ borderRight: "1px solid #ddd" }}>
                          <Input
                            value={line.unitPrice}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/,/g, "").replace(/[^0-9]/g, "");
                              const formatted = raw ? parseInt(raw).toLocaleString("ko-KR") : "";
                              updateLineItem(idx, "unitPrice", formatted);
                            }}
                            className="h-7 text-[13px] text-right px-1.5 border-0 shadow-none focus-visible:ring-0"
                          />
                        </td>
                        <td className="px-1 py-1 text-center" style={{ borderRight: "1px solid #ddd" }}>
                          <button
                            className="text-[12px] px-2 py-0.5 rounded"
                            style={{ border: "1px solid #ccc", backgroundColor: "#f0f0f0", color: "#333" }}
                            onClick={() => {
                              const price = parseInt(String(line.unitPrice).replace(/,/g, "")) || 0;
                              const supply = line.quantity * price;
                              const taxRate = form.taxType === "과세" ? 0.1 : 0;
                              const tax = Math.round(supply * taxRate);
                              setLineItems(prev => {
                                const u = [...prev];
                                u[idx] = { ...u[idx], supplyAmount: supply.toLocaleString("ko-KR"), taxAmount: tax.toLocaleString("ko-KR"), totalAmount: (supply + tax).toLocaleString("ko-KR") };
                                return u;
                              });
                            }}
                          >
                            계산
                          </button>
                        </td>
                        <td className="px-1 py-1" style={{ borderRight: "1px solid #ddd" }}>
                          <Input
                            value={line.supplyAmount}
                            readOnly
                            className="h-7 text-[13px] text-right px-1.5 border-0 shadow-none focus-visible:ring-0" style={{ backgroundColor: "#fafafa" }}
                          />
                        </td>
                        <td className="px-1 py-1" style={{ borderRight: "1px solid #ddd" }}>
                          <Input
                            value={line.taxAmount}
                            readOnly
                            className="h-7 text-[13px] text-right px-1.5 border-0 shadow-none focus-visible:ring-0" style={{ backgroundColor: "#fafafa" }}
                          />
                        </td>
                        <td className="px-1 py-1" style={{ borderRight: "1px solid #ddd" }}>
                          <Input className="h-7 text-[13px] px-1.5 border-0 shadow-none focus-visible:ring-0" />
                        </td>
                        <td className="px-1 py-1 text-center">
                          {lineItems.length > 1 ? (
                            <button onClick={() => removeLineItem(idx)} className="hover:text-destructive" style={{ color: "#999" }}>
                              <CircleMinus className="w-4 h-4" />
                            </button>
                          ) : (
                            <button onClick={addLineItem} className="hover:text-primary" style={{ color: "#999" }}>
                              <CirclePlus className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Add row button */}
              <div className="flex justify-end px-2 py-1" style={{ borderTop: "1px solid #ddd" }}>
                <button onClick={addLineItem} className="hover:text-primary" style={{ color: "#999" }}>
                  <CirclePlus className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom totals row */}
              <table className="w-full text-[13px]" style={{ borderCollapse: "collapse", borderTop: "2px solid #999" }}>
                <tbody>
                  <tr>
                    <td className="px-3 py-[6px] font-bold text-center" style={{ backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc", width: "120px" }}>합계금액</td>
                    <td className="px-3 py-[6px] text-right font-bold tabular-nums" style={{ borderRight: "1px solid #ccc", width: "140px" }}>{fmt(lineTotals.total)}</td>
                    <td className="px-3 py-[6px] font-bold text-center" style={{ backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc", width: "60px" }}>현금</td>
                    <td className="px-3 py-[6px]" style={{ borderRight: "1px solid #ccc", width: "120px" }}></td>
                    <td className="px-3 py-[6px] font-bold text-center" style={{ backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc", width: "60px" }}>수표</td>
                    <td className="px-3 py-[6px]" style={{ borderRight: "1px solid #ccc", width: "120px" }}></td>
                    <td className="px-3 py-[6px] font-bold text-center" style={{ backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc", width: "60px" }}>어음</td>
                    <td className="px-3 py-[6px]" style={{ borderRight: "1px solid #ccc", width: "120px" }}></td>
                    <td className="px-3 py-[6px] font-bold text-center" style={{ backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc", width: "80px" }}>외상미수금</td>
                    <td className="px-3 py-[6px]" style={{ width: "120px" }}></td>
                  </tr>
                </tbody>
              </table>

              {/* 영수/청구 row */}
              <div className="flex items-center justify-end px-4 py-2 gap-3 text-[13px]" style={{ borderTop: "2px solid #999", color: "#333" }}>
                <span>이 금액을</span>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="invoice-type" checked={form.invoiceType === "영수"} onChange={() => setForm(f => ({ ...f, invoiceType: "영수" }))} className="w-3.5 h-3.5" /> 영수</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="invoice-type" checked={form.invoiceType === "청구"} onChange={() => setForm(f => ({ ...f, invoiceType: "청구" }))} className="w-3.5 h-3.5" /> 청구</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="invoice-type" checked={form.invoiceType === "없음"} onChange={() => setForm(f => ({ ...f, invoiceType: "없음" as any }))} className="w-3.5 h-3.5" /> 없음</label>
                <span>함</span>
              </div>
            </div>

            {/* Below the invoice table */}
            <div className="space-y-4 text-[13px]" style={{ backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "4px", padding: "16px" }}>
              {/* 파일첨부 / 문자알림 tabs */}
              <div className="flex items-center gap-2 pb-2" style={{ borderBottom: "1px solid #eee" }}>
                <button className="text-[13px] px-3 py-1 rounded" style={{ border: "1px solid #ccc", backgroundColor: "#f0f0f0", color: "#333" }}>+ 파일첨부</button>
                <button className="text-[13px] px-3 py-1 rounded" style={{ border: "1px solid #ccc", backgroundColor: "#f0f0f0", color: "#333" }}>+ 문자알림</button>
              </div>

              {/* 관리메모 */}
              <div className="flex items-start gap-3">
                <span className="font-bold w-[80px] shrink-0 pt-1" style={{ color: "#333" }}>관리메모</span>
                <div className="flex-1">
                  <Input value={form.memo} onChange={(e) => setForm(f => ({ ...f, memo: e.target.value }))} className="h-8 text-[13px]" placeholder="공급자의 관리 목적으로 사용하며 공급받는자에게는 표시되지 않습니다." />
                </div>
              </div>

              {/* 첨부문서 */}
              <div className="flex items-center gap-3">
                <span className="font-bold w-[80px] shrink-0" style={{ color: "#333" }}>첨부문서 ⓘ</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Checkbox checked={form.businessLicenseYN} onCheckedChange={(v) => setForm(f => ({ ...f, businessLicenseYN: !!v }))} className="w-3.5 h-3.5" />
                  사업자등록증
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Checkbox checked={form.bankBookYN} onCheckedChange={(v) => setForm(f => ({ ...f, bankBookYN: !!v }))} className="w-3.5 h-3.5" />
                  통장사본
                </label>
              </div>

              {/* 추가담당자 */}
              <div className="flex items-start gap-3">
                <span className="font-bold w-[80px] shrink-0 pt-1" style={{ color: "#333" }}>추가담당자 ⓘ</span>
                <div className="flex-1 space-y-1.5">
                  <p className="text-[12px]" style={{ color: "#999" }}>
                    고객사 관리에 등록된 이메일 수신자가 자동으로 표시됩니다. 최대 5개까지 추가할 수 있습니다.
                  </p>
                  {addContacts.map((ac, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input value={ac.name} onChange={(e) => setAddContacts(prev => prev.map((p, j) => j === i ? { ...p, name: e.target.value } : p))} className="h-7 text-[13px] w-28" placeholder="성명" />
                      <Input value={ac.email} onChange={(e) => setAddContacts(prev => prev.map((p, j) => j === i ? { ...p, email: e.target.value } : p))} className="h-7 text-[13px] flex-1" placeholder="이메일" type="email" />
                      <button onClick={() => setAddContacts(prev => prev.filter((_, j) => j !== i))} style={{ color: "#999" }} className="hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  ))}
                  {addContacts.length < 5 && (
                    <Button size="sm" variant="outline" onClick={() => setAddContacts(prev => [...prev, { name: "", email: "" }])} className="text-[12px] h-6 gap-1">
                      <Plus className="w-3 h-3" /> 추가
                    </Button>
                  )}
                </div>
              </div>

              {/* 수정세금계산서 */}
              <div className="flex items-start gap-3">
                <label className="flex items-center gap-1.5 font-bold text-foreground w-[70px] shrink-0 cursor-pointer pt-1">
                  <Checkbox checked={form.isModify} onCheckedChange={(v) => setForm(f => ({ ...f, isModify: !!v }))} className="w-3.5 h-3.5" />
                  수정발행
                </label>
                {form.isModify && (
                  <div className="flex-1 grid grid-cols-2 gap-3 rounded-lg border bg-muted/20 p-3">
                    <div>
                      <span className="text-[11px] text-muted-foreground font-medium">수정 사유코드</span>
                      <select
                        value={form.modifyCode}
                        onChange={(e) => setForm(f => ({ ...f, modifyCode: e.target.value }))}
                        className="mt-1 w-full h-8 text-[12px] rounded-md border border-input bg-background px-2"
                      >
                        <option value="">선택</option>
                        <option value="1">1 - 기재사항 착오정정</option>
                        <option value="2">2 - 공급가액 변동</option>
                        <option value="3">3 - 환입</option>
                        <option value="4">4 - 계약의 해제</option>
                        <option value="5">5 - 내국신용장 사후개설</option>
                        <option value="6">6 - 착오에 의한 이중발급</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground font-medium">당초 국세청승인번호</span>
                      <Input value={form.orgNTSConfirmNum} onChange={(e) => setForm(f => ({ ...f, orgNTSConfirmNum: e.target.value }))} className="mt-1 h-8 text-[12px]" placeholder="24자리 승인번호" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons - matching Popbill style */}
            <div className="flex items-center justify-center gap-3 pt-3">
              <button onClick={handleSave} className="text-[13px] h-9 px-5 rounded" style={{ border: "1px solid #ccc", backgroundColor: "#f0f0f0", color: "#333" }}>
                임시저장
              </button>
              <button className="text-[13px] h-9 px-5 rounded" style={{ border: "1px solid #ccc", backgroundColor: "#f0f0f0", color: "#333" }}>
                발행예정
              </button>
              <label className="flex items-center gap-1.5 text-[13px] cursor-pointer" style={{ color: "#333" }}>
                <Checkbox className="w-3.5 h-3.5" />
                거래명세서 동시작성
              </label>
              <Button onClick={handleSave} className="text-[13px] h-9 px-6 gap-1.5 rounded" style={{ backgroundColor: "#4a90d9", color: "#fff" }}>
                <Send className="w-3.5 h-3.5" /> 발행
              </Button>
            </div>
          </div>
          )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog for issued invoices */}
      <Dialog open={!!detailLog} onOpenChange={(open) => { if (!open) setDetailLog(null); }}>
        <DialogContent className="max-w-[90vw] w-[1445px] max-h-[92vh] p-0 overflow-hidden">
          <ScrollArea className="max-h-[calc(92vh-2rem)] w-full">
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span className="text-[20px] font-bold">세금계산서 상세</span>
            </div>

            {detailLog && (() => {
              const clientName = detailLog.buyer_corp_name || getClientName(detailLog.client_id);
              return (
                <div className="space-y-4">
                  {/* Status & meta */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge
                      variant="outline"
                      className={
                        detailLog.status === "issued"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[12px] px-3 py-1"
                          : "bg-amber-50 text-amber-700 border-amber-200 text-[12px] px-3 py-1"
                      }
                    >
                      {detailLog.status === "issued" ? "발행완료" : detailLog.status}
                    </Badge>
                    {detailLog.nts_confirm_num && (
                      <span className="text-[12px] text-muted-foreground">
                        국세청 확인번호: {detailLog.nts_confirm_num}
                      </span>
                    )}
                    {detailLog.invoice_num && (
                      <span className="text-[12px] text-muted-foreground">
                        문서번호: {detailLog.invoice_num}
                      </span>
                    )}
                  </div>

                  {/* Popbill-style invoice table */}
                  <div style={{ border: "1px solid #999", backgroundColor: "#fff" }}>
                    {/* Title */}
                    <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid #999" }}>
                      <h3 className="text-[16px] font-extrabold tracking-[0.3em]" style={{ color: "#333" }}>전자세금계산서</h3>
                    </div>

                    {/* Supplier & Buyer */}
                    <div className="grid grid-cols-2" style={{ borderBottom: "1px solid #999" }}>
                      {/* 공급자 */}
                      <div className="flex" style={{ borderRight: "2px solid #999" }}>
                        <div className="flex items-center justify-center shrink-0" style={{ width: "36px", backgroundColor: "#fff2f2", borderRight: "1px solid #ccc", writingMode: "vertical-rl" as any }}>
                          <span className="text-[16px] font-bold" style={{ color: "#cc3333", letterSpacing: "0.2em" }}>공급자</span>
                        </div>
                        <table className="flex-1 text-[13px]" style={{ borderCollapse: "collapse", tableLayout: "fixed" }}>
                          <colgroup>
                            <col style={{ width: "75px" }} />
                            <col style={{ width: "40%" }} />
                            <col style={{ width: "70px" }} />
                            <col />
                          </colgroup>
                          <tbody>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                              <td className="px-3 py-[7px] font-bold whitespace-nowrap" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>등록번호</td>
                              <td className="px-3 py-[7px] font-medium" style={{ color: "#333" }}>{detailLog.supplier_corp_num || "204-86-20072"}</td>
                              <td className="px-3 py-[7px] font-bold whitespace-nowrap" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>종사업장</td>
                              <td className="px-3 py-[7px]"></td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                              <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>상호</td>
                              <td className="px-3 py-[7px]" style={{ color: "#333" }}>주식회사 웹헤즈</td>
                              <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>성명</td>
                              <td className="px-3 py-[7px]" style={{ color: "#333" }}>박진열</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                              <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>주소</td>
                              <td colSpan={3} className="px-3 py-[7px]" style={{ color: "#333" }}>서울특별시 마포구 월드컵로114, 3층(성산동, 효남빌딩)</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                              <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>업태</td>
                              <td className="px-3 py-[7px]" style={{ color: "#333" }}>정보통신업</td>
                              <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>종목</td>
                              <td className="px-3 py-[7px]" style={{ color: "#333" }}>응용소프트웨어 개발 및 공급</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-[7px] font-bold" style={{ color: "#cc3333", backgroundColor: "#fff8f8", borderRight: "1px solid #ddd" }}>이메일</td>
                              <td colSpan={3} className="px-3 py-[7px]" style={{ color: "#333" }}>34bus@webheads.co.kr</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* 공급받는자 */}
                      <div className="flex">
                        <div className="flex items-center justify-center shrink-0" style={{ width: "36px", backgroundColor: "#f0f4ff", borderRight: "1px solid #ccc", writingMode: "vertical-rl" as any }}>
                          <span className="text-[16px] font-bold" style={{ color: "#3366cc", letterSpacing: "0.15em" }}>공급받는자</span>
                        </div>
                        <table className="flex-1 text-[13px]" style={{ borderCollapse: "collapse", tableLayout: "fixed" }}>
                          <colgroup>
                            <col style={{ width: "75px" }} />
                            <col style={{ width: "40%" }} />
                            <col style={{ width: "70px" }} />
                            <col />
                          </colgroup>
                          <tbody>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                              <td className="px-3 py-[7px] font-bold whitespace-nowrap" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd" }}>등록번호</td>
                              <td className="px-3 py-[7px] font-medium" style={{ color: "#333" }}>{detailLog.buyer_corp_num || "-"}</td>
                              <td className="px-3 py-[7px] font-bold whitespace-nowrap" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>종사업장</td>
                              <td className="px-3 py-[7px]"></td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                              <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd" }}>상호</td>
                              <td className="px-3 py-[7px]" style={{ color: "#333" }}>{clientName}</td>
                              <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd" }}>성명</td>
                              <td className="px-3 py-[7px]" style={{ color: "#333" }}>{detailLog.buyer_ceo_name || "-"}</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                              <td className="px-3 py-[7px] font-bold" style={{ color: "#333", backgroundColor: "#f5f8ff", borderRight: "1px solid #ddd" }}>이메일</td>
                              <td colSpan={3} className="px-3 py-[7px]" style={{ color: "#333" }}>{detailLog.buyer_email || "-"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 작성일자 / 공급가액 / 세액 */}
                    <table className="w-full text-[13px]" style={{ borderCollapse: "collapse", borderBottom: "1px solid #999" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f0f0f0" }}>
                          <th className="px-3 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "200px" }}>작성일자</th>
                          <th className="px-3 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc" }}>공급가액</th>
                          <th className="px-3 py-[6px] font-bold text-center">세액</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderTop: "1px solid #ddd" }}>
                          <td className="px-3 py-[6px] text-center" style={{ borderRight: "1px solid #ccc" }}>{detailLog.issue_date || "-"}</td>
                          <td className="px-3 py-[6px] text-right font-semibold tabular-nums text-[14px]" style={{ borderRight: "1px solid #ccc" }}>{fmt(detailLog.supply_amount)}</td>
                          <td className="px-3 py-[6px] text-right font-semibold tabular-nums text-[14px]">{fmt(detailLog.tax_amount)}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* 비고1 */}
                    <table className="w-full text-[13px]" style={{ borderCollapse: "collapse", borderBottom: "1px solid #ddd" }}>
                      <tbody>
                        <tr>
                          <td className="px-3 py-[5px] font-bold text-center" style={{ width: "80px", backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc" }}>비고1</td>
                          <td className="px-3 py-[5px]" style={{ color: "#333" }}>{detailLog.memo || ""}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Line Items Table */}
                    <table className="w-full text-[13px]" style={{ borderCollapse: "collapse", borderTop: "2px solid #999" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f0f0f0" }}>
                          <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "50px" }}>월</th>
                          <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "50px" }}>일</th>
                          <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", minWidth: "200px" }}>품목</th>
                          <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "100px" }}>규격</th>
                          <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "90px" }}>수량</th>
                          <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "120px" }}>단가</th>
                          <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "130px" }}>공급가액</th>
                          <th className="px-2 py-[6px] font-bold text-center" style={{ borderRight: "1px solid #ccc", width: "120px" }}>세액</th>
                          <th className="px-2 py-[6px] font-bold text-center" style={{ minWidth: "80px" }}>비고</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          // Try to extract line items from popbill_response
                          const resp = detailLog.popbill_response as any;
                          const items = resp?.detailList || resp?.items || [];
                          if (items.length > 0) {
                            return items.map((item: any, i: number) => {
                              const d = item.purchaseDT ? new Date(item.purchaseDT.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")) : (detailLog.issue_date ? new Date(detailLog.issue_date) : new Date());
                              return (
                                <tr key={i} style={{ borderTop: "1px solid #ddd" }}>
                                  <td className="px-2 py-[6px] text-center" style={{ borderRight: "1px solid #ddd" }}>{d.getMonth() + 1}</td>
                                  <td className="px-2 py-[6px] text-center" style={{ borderRight: "1px solid #ddd" }}>{d.getDate()}</td>
                                  <td className="px-2 py-[6px] font-medium" style={{ borderRight: "1px solid #ddd", color: "#333" }}>{item.itemName || item.serialNum || "-"}</td>
                                  <td className="px-2 py-[6px] text-center" style={{ borderRight: "1px solid #ddd", color: "#666" }}>{item.spec || "-"}</td>
                                  <td className="px-2 py-[6px] text-center" style={{ borderRight: "1px solid #ddd" }}>{item.qty || item.quantity || 1}</td>
                                  <td className="px-2 py-[6px] text-right tabular-nums" style={{ borderRight: "1px solid #ddd" }}>{item.unitCost ? fmt(Number(item.unitCost)) : "-"}</td>
                                  <td className="px-2 py-[6px] text-right font-medium tabular-nums" style={{ borderRight: "1px solid #ddd" }}>{fmt(Number(item.supplyCost || item.supplyAmount || 0))}</td>
                                  <td className="px-2 py-[6px] text-right tabular-nums" style={{ borderRight: "1px solid #ddd" }}>{fmt(Number(item.tax || item.taxAmount || 0))}</td>
                                  <td className="px-2 py-[6px]">{item.remark || ""}</td>
                                </tr>
                              );
                            });
                          }
                          // Fallback: show as single row
                          const issueDate = detailLog.issue_date ? new Date(detailLog.issue_date) : new Date();
                          return (
                            <tr style={{ borderTop: "1px solid #ddd" }}>
                              <td className="px-2 py-[6px] text-center" style={{ borderRight: "1px solid #ddd" }}>{issueDate.getMonth() + 1}</td>
                              <td className="px-2 py-[6px] text-center" style={{ borderRight: "1px solid #ddd" }}>{issueDate.getDate()}</td>
                              <td className="px-2 py-[6px] font-medium" style={{ borderRight: "1px solid #ddd", color: "#333" }}>-</td>
                              <td className="px-2 py-[6px] text-center" style={{ borderRight: "1px solid #ddd", color: "#666" }}>-</td>
                              <td className="px-2 py-[6px] text-center" style={{ borderRight: "1px solid #ddd" }}>1</td>
                              <td className="px-2 py-[6px] text-right tabular-nums" style={{ borderRight: "1px solid #ddd" }}>{fmt(detailLog.supply_amount)}</td>
                              <td className="px-2 py-[6px] text-right font-medium tabular-nums" style={{ borderRight: "1px solid #ddd" }}>{fmt(detailLog.supply_amount)}</td>
                              <td className="px-2 py-[6px] text-right tabular-nums" style={{ borderRight: "1px solid #ddd" }}>{fmt(detailLog.tax_amount)}</td>
                              <td className="px-2 py-[6px]"></td>
                            </tr>
                          );
                        })()}
                      </tbody>
                    </table>

                    {/* Bottom totals */}
                    <table className="w-full text-[13px]" style={{ borderCollapse: "collapse", borderTop: "2px solid #999" }}>
                      <tbody>
                        <tr>
                          <td className="px-3 py-[6px] font-bold text-center" style={{ backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc", width: "120px" }}>합계금액</td>
                          <td className="px-3 py-[6px] text-right font-bold tabular-nums" style={{ borderRight: "1px solid #ccc", width: "140px" }}>{fmt(detailLog.total_amount)}</td>
                          <td className="px-3 py-[6px] font-bold text-center" style={{ backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc", width: "60px" }}>현금</td>
                          <td className="px-3 py-[6px]" style={{ borderRight: "1px solid #ccc", width: "120px" }}></td>
                          <td className="px-3 py-[6px] font-bold text-center" style={{ backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc", width: "60px" }}>수표</td>
                          <td className="px-3 py-[6px]" style={{ borderRight: "1px solid #ccc", width: "120px" }}></td>
                          <td className="px-3 py-[6px] font-bold text-center" style={{ backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc", width: "60px" }}>어음</td>
                          <td className="px-3 py-[6px]" style={{ borderRight: "1px solid #ccc", width: "120px" }}></td>
                          <td className="px-3 py-[6px] font-bold text-center" style={{ backgroundColor: "#f0f0f0", borderRight: "1px solid #ccc", width: "80px" }}>외상미수금</td>
                          <td className="px-3 py-[6px]" style={{ width: "120px" }}></td>
                        </tr>
                      </tbody>
                    </table>

                    {/* 영수/청구 */}
                    <div className="flex items-center justify-end px-4 py-2 text-[13px]" style={{ borderTop: "2px solid #999", color: "#333" }}>
                      <span>이 금액을 [ <strong>청구</strong> ] 함</span>
                    </div>
                  </div>

                  <p className="text-[11px]" style={{ color: "#999" }}>
                    ※ 본 전자세금계산서는 국세청 미전송 건으로, 국세청 전송이 완료된 이후에 법적 효력을 갖습니다. (국세청고시 제2023-17호, 2023.9.1)
                  </p>
                </div>
              );
            })()}
          </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
