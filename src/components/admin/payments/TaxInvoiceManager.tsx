import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Loader2, Plus, Search, FileText, CheckCircle2, AlertTriangle,
  ChevronLeft, ChevronRight, ChevronDown, ArrowLeft, Trash2, Save, Eye, Send
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

interface SalesLineItem {
  date: string;
  itemName: string;
  quantity: number;
  unitPrice: string;
  supplyAmount: string;
  taxAmount: string;
  totalAmount: string;
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
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

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
    invoiceType: "청구" as "영수" | "청구",
  });

  const emptyLine = (): SalesLineItem => ({
    date: form.writeDate,
    itemName: "",
    quantity: 1,
    unitPrice: "",
    supplyAmount: "",
    taxAmount: "",
    totalAmount: "",
  });

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

    setForm(f => ({
      ...f,
      clientId,
      buyerCorpNum: company?.business_number || f.buyerCorpNum,
      buyerCorpName: company?.company_name || client.name,
      buyerCEOName: company?.ceo_name || f.buyerCEOName,
      buyerEmail: companyContacts[0]?.email || f.buyerEmail,
      buyerAddress: address || f.buyerAddress,
      buyerBusinessType: company?.business_type || f.buyerBusinessType,
      buyerBusinessItem: company?.business_item || f.buyerBusinessItem,
    }));
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

  // Step 1: Save (validate form)
  const handleSave = () => {
    if (!form.clientId || !form.buyerCorpNum) {
      toast.error("필수 항목을 입력해주세요 (고객사, 사업자번호)");
      return;
    }
    if (lineTotals.supply === 0) {
      toast.error("매출항목을 입력해주세요");
      return;
    }
    setSaved(true);
    toast.success("세금계산서 정보가 저장되었습니다. 내용을 확인해주세요.");
    setIssueStep(2);
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
          items: filledLines.map(l => ({
            name: l.itemName,
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
    });
    setLineItems([emptyLine()]);
    setMatchedContacts([]);
    setSelectedContactIdx(0);
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
        <h2 className="text-[16px] font-bold flex items-center gap-2">
          <FileText className="w-4 h-4" />
          세금계산서 관리
        </h2>
        <Button size="sm" className="text-[13px] gap-1.5" onClick={() => setIssueOpen(true)}>
          <Plus className="w-3.5 h-3.5" />
          세금계산서 발행
        </Button>
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
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-muted-foreground text-[13px]">
                    발행된 세금계산서가 없습니다
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-3 py-2 whitespace-nowrap">{log.issue_date || "-"}</td>
                    <td className="px-3 py-2 font-medium">
                      {log.buyer_corp_name || getClientName(log.client_id)}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{log.buyer_corp_num || "-"}</td>
                    <td className="px-3 py-2 text-right">{fmt(log.supply_amount)}</td>
                    <td className="px-3 py-2 text-right">{fmt(log.tax_amount)}</td>
                    <td className="px-3 py-2 text-right font-medium">{fmt(log.total_amount)}</td>
                    <td className="px-3 py-2 text-center">
                      <Badge
                        variant="outline"
                        className={
                          log.status === "issued"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]"
                            : "bg-amber-50 text-amber-700 border-amber-200 text-[11px]"
                        }
                      >
                        {log.status === "issued" ? "발행완료" : log.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground max-w-[120px] truncate">
                      {log.memo || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Dialog - Multi-step */}
      <Dialog open={issueOpen} onOpenChange={(open) => { if (!open) resetAndClose(); else setIssueOpen(true); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[16px] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              세금계산서 {issueStep === 1 ? "작성" : issueStep === 2 ? "미리보기" : "발행 확인"}
              {issueStep > 1 && (
                <Button variant="ghost" size="sm" className="ml-2 text-[11px] h-6 gap-1" onClick={() => setIssueStep(issueStep === 3 ? 2 : 1)}>
                  <ArrowLeft className="w-3 h-3" /> 이전
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* Step 2: Preview */}
          {issueStep >= 2 && (
            <div className="border rounded-xl p-5 bg-background space-y-4">
              {/* Tax Invoice Thumbnail */}
              <div className="border-2 border-primary/20 rounded-lg p-4 bg-muted/10">
                <div className="text-center mb-3">
                  <h3 className="text-[15px] font-bold tracking-wide">전 자 세 금 계 산 서</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    ({form.invoiceType === "영수" ? "영수" : "청구"})
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[12px] mb-3">
                  {/* 공급자 */}
                  <div className="border rounded-lg p-3 space-y-1.5">
                    <p className="text-[11px] font-bold text-primary mb-1">공급자 (매출)</p>
                    <div className="grid grid-cols-[60px_1fr] gap-1">
                      <span className="text-muted-foreground">사업자번호</span>
                      <span className="font-medium">공급자 사업자번호</span>
                    </div>
                    <div className="grid grid-cols-[60px_1fr] gap-1">
                      <span className="text-muted-foreground">상호</span>
                      <span className="font-medium">웹헤즈</span>
                    </div>
                  </div>
                  {/* 공급받는자 */}
                  <div className="border rounded-lg p-3 space-y-1.5">
                    <p className="text-[11px] font-bold text-destructive mb-1">공급받는자 (매입)</p>
                    <div className="grid grid-cols-[60px_1fr] gap-1">
                      <span className="text-muted-foreground">사업자번호</span>
                      <span className="font-medium">{form.buyerCorpNum}</span>
                    </div>
                    <div className="grid grid-cols-[60px_1fr] gap-1">
                      <span className="text-muted-foreground">상호</span>
                      <span className="font-medium">{form.buyerCorpName}</span>
                    </div>
                    <div className="grid grid-cols-[60px_1fr] gap-1">
                      <span className="text-muted-foreground">대표자</span>
                      <span>{form.buyerCEOName}</span>
                    </div>
                    <div className="grid grid-cols-[60px_1fr] gap-1">
                      <span className="text-muted-foreground">이메일</span>
                      <span>{form.buyerEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground mb-2">작성일자: {form.writeDate}</div>

                {/* 매출항목 요약 */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="bg-muted/60 border-b">
                        <th className="px-2 py-1.5 text-left font-medium">항목명</th>
                        <th className="px-2 py-1.5 text-center font-medium">수량</th>
                        <th className="px-2 py-1.5 text-right font-medium">공급가액</th>
                        <th className="px-2 py-1.5 text-right font-medium">세액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filledLines.map((l, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="px-2 py-1.5">{l.itemName}</td>
                          <td className="px-2 py-1.5 text-center">{l.quantity}</td>
                          <td className="px-2 py-1.5 text-right">{fmt(parseInt(l.supplyAmount.replace(/,/g, "")) || 0)}</td>
                          <td className="px-2 py-1.5 text-right">{fmt(parseInt(l.taxAmount.replace(/,/g, "")) || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 flex justify-end gap-6 text-[13px]">
                  <span>공급가액: <strong>{fmt(lineTotals.supply)}원</strong></span>
                  <span>세액: <strong>{fmt(lineTotals.tax)}원</strong></span>
                  <span className="text-primary">합계: <strong>{fmt(lineTotals.total)}원</strong></span>
                </div>
                {form.memo && (
                  <p className="text-[11px] text-muted-foreground mt-2">비고: {form.memo}</p>
                )}
              </div>

              {issueStep === 2 && (
                <div className="flex justify-center gap-3 pt-2">
                  <Button variant="outline" onClick={() => setIssueStep(1)} className="text-[13px] gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5" /> 수정하기
                  </Button>
                  <Button onClick={() => setIssueStep(3)} className="text-[13px] gap-1.5">
                    <Send className="w-3.5 h-3.5" /> 발행하기
                  </Button>
                </div>
              )}

              {issueStep === 3 && (
                <div className="border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] font-bold text-amber-800 dark:text-amber-200">
                        세금계산서를 발행하시겠습니까?
                      </p>
                      <p className="text-[12px] text-amber-700 dark:text-amber-300 mt-1">
                        발행 후 팝빌을 통해 국세청(홈택스)에 자동 전송됩니다.
                        발행 후에는 취소가 어려울 수 있으므로 내용을 다시 한번 확인해주세요.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button variant="outline" size="sm" onClick={() => setIssueStep(2)} className="text-[12px]">
                      취소
                    </Button>
                    <Button size="sm" onClick={handleIssue} disabled={issuing} className="text-[12px] gap-1.5 bg-primary">
                      {issuing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      발행 및 홈택스 전송
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Form */}
          {issueStep === 1 && (
          <div className="border rounded-xl p-4 space-y-4 bg-background">
            {/* Section: 고객명 */}
            <div>
              <label className="text-[13px] font-bold text-foreground">고객명</label>
              <div className="mt-1.5 flex items-center gap-2">
                <Popover open={clientSearchOpen} onOpenChange={setClientSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="h-9 text-[13px] max-w-md w-full justify-between font-normal"
                    >
                      {form.clientId
                        ? (() => {
                            const c = clients.find(cl => cl.id === form.clientId);
                            if (!c) return "고객사 선택";
                            const matched = getCompanyForClient(c);
                            const name = matched ? matched.company_name : c.name;
                            const biz = matched ? ` (${matched.business_number})` : "";
                            return `${name}${biz}`;
                          })()
                        : "세금계산서를 발급하실 고객을 선택해주세요."}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[460px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="고객명 또는 사업자번호 검색..." className="text-[13px]" />
                      <CommandList className="max-h-[260px]">
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
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* 거래처 정보 (고객사 선택시 표시) */}
              {form.clientId && (
                <div className="mt-3 rounded-lg border bg-muted/20 p-3 space-y-2.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid grid-cols-[70px_1fr] items-center gap-2">
                      <span className="text-[11px] text-muted-foreground font-medium">사업자번호</span>
                      <Input value={form.buyerCorpNum} onChange={(e) => setForm(f => ({ ...f, buyerCorpNum: e.target.value }))} className="h-8 text-[12px]" />
                    </div>
                    <div className="grid grid-cols-[50px_1fr] items-center gap-2">
                      <span className="text-[11px] text-muted-foreground font-medium">대표자</span>
                      <Input value={form.buyerCEOName} onChange={(e) => setForm(f => ({ ...f, buyerCEOName: e.target.value }))} className="h-8 text-[12px]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-[70px_1fr] items-center gap-2">
                    <span className="text-[11px] text-muted-foreground font-medium">상호</span>
                    <Input value={form.buyerCorpName} onChange={(e) => setForm(f => ({ ...f, buyerCorpName: e.target.value }))} className="h-8 text-[12px]" />
                  </div>
                  <div className="grid grid-cols-[70px_1fr] items-center gap-2">
                    <span className="text-[11px] text-muted-foreground font-medium">사업장주소</span>
                    <Input value={form.buyerAddress} onChange={(e) => setForm(f => ({ ...f, buyerAddress: e.target.value }))} className="h-8 text-[12px]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid grid-cols-[70px_1fr] items-center gap-2">
                      <span className="text-[11px] text-muted-foreground font-medium">업태</span>
                      <Input value={form.buyerBusinessType} onChange={(e) => setForm(f => ({ ...f, buyerBusinessType: e.target.value }))} className="h-8 text-[12px]" />
                    </div>
                    <div className="grid grid-cols-[50px_1fr] items-center gap-2">
                      <span className="text-[11px] text-muted-foreground font-medium">종목</span>
                      <Input value={form.buyerBusinessItem} onChange={(e) => setForm(f => ({ ...f, buyerBusinessItem: e.target.value }))} className="h-8 text-[12px]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-[70px_1fr] items-center gap-2">
                    <span className="text-[11px] text-muted-foreground font-medium">이메일</span>
                    <Input value={form.buyerEmail} onChange={(e) => setForm(f => ({ ...f, buyerEmail: e.target.value }))} type="email" className="h-8 text-[12px]" />
                  </div>
                </div>
              )}
            </div>

            {/* Section: 작성일자 */}
            <div>
              <div className="flex items-center gap-4">
                <label className="text-[13px] font-bold text-foreground">작성일자</label>
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
                  className="h-8 text-[12px] w-[160px]"
                />
                <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
                  <Checkbox
                    checked={form.applyDateToAll}
                    onCheckedChange={(checked) => {
                      setForm(f => ({ ...f, applyDateToAll: !!checked }));
                      if (checked) {
                        setLineItems(prev => prev.map(l => ({ ...l, date: form.writeDate })));
                      }
                    }}
                    className="w-3.5 h-3.5"
                  />
                  모든 매출항목에 같은 일자 적용
                </label>
              </div>
            </div>

            {/* Section: 매출항목 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-bold text-foreground">매출항목</label>
                <Button size="sm" variant="outline" onClick={addLineItem} className="text-[11px] h-7 gap-1">
                  <Plus className="w-3 h-3" /> 행 추가
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden bg-background">
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="bg-muted/60 border-b">
                        <th className="px-2 py-1.5 text-center font-medium w-[90px]">일자</th>
                        <th className="px-2 py-1.5 text-left font-medium min-w-[120px]">항목명</th>
                        <th className="px-2 py-1.5 text-center font-medium w-[50px]">수량</th>
                        <th className="px-2 py-1.5 text-right font-medium w-[110px]">단가(세액별도)</th>
                        <th className="px-2 py-1.5 text-right font-medium w-[100px]">공급가액</th>
                        <th className="px-2 py-1.5 text-right font-medium w-[90px]">부가세</th>
                        <th className="px-2 py-1.5 text-right font-medium w-[100px]">합계</th>
                        <th className="px-2 py-1.5 w-[30px]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((line, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="px-1 py-1">
                            <Input
                              type="date"
                              value={line.date}
                              onChange={(e) => updateLineItem(idx, "date", e.target.value)}
                              disabled={form.applyDateToAll}
                              className="h-7 text-[11px] px-1 text-center"
                            />
                          </td>
                          <td className="px-1 py-1">
                            <Input
                              value={line.itemName}
                              onChange={(e) => updateLineItem(idx, "itemName", e.target.value)}
                              className="h-7 text-[11px] px-1.5"
                              placeholder=""
                            />
                          </td>
                          <td className="px-1 py-1">
                            <Input
                              type="number"
                              value={line.quantity}
                              onChange={(e) => updateLineItem(idx, "quantity", parseInt(e.target.value) || 1)}
                              className="h-7 text-[11px] text-center px-1"
                              min={1}
                            />
                          </td>
                          <td className="px-1 py-1">
                            <Input
                              value={line.unitPrice}
                              onChange={(e) => updateLineItem(idx, "unitPrice", e.target.value)}
                              className="h-7 text-[11px] text-right px-1.5"
                              placeholder=""
                            />
                          </td>
                          <td className="px-1 py-1">
                            <Input
                              value={line.supplyAmount}
                              readOnly
                              className="h-7 text-[11px] text-right px-1.5 bg-muted/30"
                            />
                          </td>
                          <td className="px-1 py-1">
                            <Input
                              value={line.taxAmount}
                              readOnly
                              className="h-7 text-[11px] text-right px-1.5 bg-muted/30"
                            />
                          </td>
                          <td className="px-1 py-1">
                            <Input
                              value={line.totalAmount}
                              readOnly
                              className="h-7 text-[11px] text-right px-1.5 bg-muted/30 font-medium"
                            />
                          </td>
                          <td className="px-1 py-1">
                            {lineItems.length > 1 && (
                              <button onClick={() => removeLineItem(idx)} className="p-0.5 text-muted-foreground hover:text-destructive">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/40 border-t font-medium">
                        <td colSpan={4} className="px-2 py-2 text-[12px]">총 {filledLines.length}개 항목</td>
                        <td className="px-2 py-2 text-right text-[12px]">{fmt(lineTotals.supply)}</td>
                        <td className="px-2 py-2 text-right text-[12px]">{fmt(lineTotals.tax)}</td>
                        <td className="px-2 py-2 text-right text-[12px] text-primary font-bold">{fmt(lineTotals.total)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Section: 영수/청구 */}
            <div>
              <div className="flex items-center gap-6">
                <label className="text-[13px] font-bold text-foreground">구분</label>
                <label className="flex items-center gap-1.5 text-[12px] cursor-pointer">
                  <input
                    type="radio"
                    name="invoice-type"
                    checked={form.invoiceType === "영수"}
                    onChange={() => setForm(f => ({ ...f, invoiceType: "영수" }))}
                    className="accent-primary w-3.5 h-3.5"
                  />
                  영수
                </label>
                <label className="flex items-center gap-1.5 text-[12px] cursor-pointer">
                  <input
                    type="radio"
                    name="invoice-type"
                    checked={form.invoiceType === "청구"}
                    onChange={() => setForm(f => ({ ...f, invoiceType: "청구" }))}
                    className="accent-primary w-3.5 h-3.5"
                  />
                  청구
                </label>
              </div>
            </div>

            {/* Section: 비고 */}
            <div>
              <label className="text-[13px] font-bold text-foreground">비고</label>
              <Input
                value={form.memo}
                onChange={(e) => setForm(f => ({ ...f, memo: e.target.value }))}
                placeholder="품목명/비고"
                className="h-8 text-[12px] mt-1.5"
              />
            </div>

            {/* Section: 담당자 */}
            {matchedContacts.length > 0 && (
              <div>
                <label className="text-[13px] font-bold text-foreground mb-2 block">담당자</label>
                <div className="border rounded-lg overflow-hidden bg-background">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="bg-muted/60 border-b">
                        <th className="px-2 py-1.5 w-[30px]"></th>
                        <th className="px-2 py-1.5 text-left font-medium">성명</th>
                        <th className="px-2 py-1.5 text-left font-medium">직급</th>
                        <th className="px-2 py-1.5 text-left font-medium">전화</th>
                        <th className="px-2 py-1.5 text-left font-medium">휴대폰</th>
                        <th className="px-2 py-1.5 text-left font-medium">이메일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchedContacts.map((ct, i) => (
                        <tr
                          key={i}
                          className={`border-b last:border-0 cursor-pointer transition-colors ${
                            selectedContactIdx === i ? "bg-primary/5" : "hover:bg-muted/30"
                          }`}
                          onClick={() => {
                            setSelectedContactIdx(i);
                            setForm(f => ({ ...f, buyerEmail: ct.email || f.buyerEmail }));
                          }}
                        >
                          <td className="px-2 py-1.5 text-center">
                            <input
                              type="radio"
                              name="contact-select"
                              checked={selectedContactIdx === i}
                              onChange={() => {
                                setSelectedContactIdx(i);
                                setForm(f => ({ ...f, buyerEmail: ct.email || f.buyerEmail }));
                              }}
                              className="accent-primary w-3.5 h-3.5"
                            />
                          </td>
                          <td className="px-2 py-1.5 font-medium">{ct.name || "-"}</td>
                          <td className="px-2 py-1.5 text-muted-foreground">{ct.position || "-"}</td>
                          <td className="px-2 py-1.5 text-muted-foreground">{ct.phone || "-"}</td>
                          <td className="px-2 py-1.5 text-muted-foreground">{ct.mobile || "-"}</td>
                          <td className="px-2 py-1.5 text-muted-foreground">{ct.email || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          )}

          {/* Step 1 Footer */}
          {issueStep === 1 && (
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={resetAndClose} className="text-[13px]">
                취소
              </Button>
              <Button onClick={handleSave} className="text-[13px] gap-1.5">
                <Save className="w-3.5 h-3.5" /> 저장 및 확인
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
