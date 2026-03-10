import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Loader2, Plus, Search, FileText, CheckCircle2, AlertTriangle,
  ChevronLeft, ChevronRight, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

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
  const [issuing, setIssuing] = useState(false);
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
    supplyAmount: "",
    taxAmount: "",
    memo: "",
    writeDate: new Date().toISOString().split("T")[0],
  });

  // Matched contacts for selected client (shown as read-only info)
  const [matchedContacts, setMatchedContacts] = useState<ClientContact[]>([]);

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

  const handleSupplyChange = (val: string) => {
    const num = parseInt(val.replace(/,/g, "")) || 0;
    const tax = Math.round(num * 0.1);
    setForm((f) => ({
      ...f,
      supplyAmount: val,
      taxAmount: String(tax),
    }));
  };

  const handleIssue = async () => {
    if (!form.clientId || !form.buyerCorpNum || !form.supplyAmount) {
      toast.error("필수 항목을 입력해주세요");
      return;
    }

    setIssuing(true);
    try {
      const supplyAmount = parseInt(form.supplyAmount.replace(/,/g, "")) || 0;
      const taxAmount = parseInt(form.taxAmount.replace(/,/g, "")) || 0;

      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("popbill-tax-invoice", {
        body: {
          action: "issue",
          clientId: form.clientId,
          buyerCorpNum: form.buyerCorpNum.replace(/-/g, ""),
          buyerCorpName: form.buyerCorpName,
          buyerCEOName: form.buyerCEOName,
          buyerEmail: form.buyerEmail,
          supplyAmount,
          taxAmount,
          totalAmount: supplyAmount + taxAmount,
          writeDate: form.writeDate.replace(/-/g, ""),
          memo: form.memo,
        },
      });

      if (res.error) throw new Error(res.error.message);
      const result = res.data;
      if (!result.success) throw new Error(result.error);

      toast.success("세금계산서가 발행되었습니다");
      setIssueOpen(false);
      setForm({
        clientId: "",
        buyerCorpNum: "",
        buyerCorpName: "",
        buyerCEOName: "",
        buyerEmail: "",
        buyerAddress: "",
        buyerBusinessType: "",
        buyerBusinessItem: "",
        supplyAmount: "",
        taxAmount: "",
        memo: "",
        writeDate: new Date().toISOString().split("T")[0],
      });
      setMatchedContacts([]);
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "발행 중 오류가 발생했습니다");
    } finally {
      setIssuing(false);
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

      {/* Issue Dialog */}
      <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[16px]">세금계산서 발행</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-[12px] font-medium text-muted-foreground">고객사 *</label>
              <Select value={form.clientId} onValueChange={handleClientSelect}>
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue placeholder="고객사 선택" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => {
                    const matched = getCompanyForClient(c);
                    return (
                      <SelectItem key={c.id} value={c.id} className="text-[13px]">
                        {matched ? matched.company_name : c.name}
                        {matched && <span className="text-muted-foreground ml-1">({matched.business_number})</span>}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-medium text-muted-foreground">사업자번호 *</label>
                <Input
                  value={form.buyerCorpNum}
                  onChange={(e) => setForm((f) => ({ ...f, buyerCorpNum: e.target.value }))}
                  placeholder="000-00-00000"
                  className="h-9 text-[13px]"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-muted-foreground">상호</label>
                <Input
                  value={form.buyerCorpName}
                  onChange={(e) => setForm((f) => ({ ...f, buyerCorpName: e.target.value }))}
                  className="h-9 text-[13px]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-medium text-muted-foreground">대표자명</label>
                <Input
                  value={form.buyerCEOName}
                  onChange={(e) => setForm((f) => ({ ...f, buyerCEOName: e.target.value }))}
                  className="h-9 text-[13px]"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-muted-foreground">이메일</label>
                <Input
                  value={form.buyerEmail}
                  onChange={(e) => setForm((f) => ({ ...f, buyerEmail: e.target.value }))}
                  type="email"
                  className="h-9 text-[13px]"
                />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-muted-foreground">주소</label>
              <Input
                value={form.buyerAddress}
                onChange={(e) => setForm((f) => ({ ...f, buyerAddress: e.target.value }))}
                placeholder="주소"
                className="h-9 text-[13px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-medium text-muted-foreground">업태</label>
                <Input
                  value={form.buyerBusinessType}
                  onChange={(e) => setForm((f) => ({ ...f, buyerBusinessType: e.target.value }))}
                  className="h-9 text-[13px]"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-muted-foreground">종목</label>
                <Input
                  value={form.buyerBusinessItem}
                  onChange={(e) => setForm((f) => ({ ...f, buyerBusinessItem: e.target.value }))}
                  className="h-9 text-[13px]"
                />
              </div>
            </div>

            {/* Matched contacts info */}
            {matchedContacts.length > 0 && (
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2">
                <p className="text-[11px] font-semibold text-foreground">발행정보 / 연락처</p>
                {matchedContacts.map((ct, i) => (
                  <div key={i} className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-muted-foreground">
                    {ct.name && <span className="font-medium text-foreground">{ct.name}{ct.position && ` (${ct.position})`}</span>}
                    {ct.phone && <span>☎ {ct.phone}</span>}
                    {ct.mobile && <span>📱 {ct.mobile}</span>}
                    {ct.email && <span>✉ {ct.email}</span>}
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-medium text-muted-foreground">공급가액 *</label>
                <Input
                  value={form.supplyAmount}
                  onChange={(e) => handleSupplyChange(e.target.value)}
                  placeholder="0"
                  className="h-9 text-[13px]"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-muted-foreground">세액 (자동계산)</label>
                <Input
                  value={form.taxAmount}
                  onChange={(e) => setForm((f) => ({ ...f, taxAmount: e.target.value }))}
                  className="h-9 text-[13px]"
                />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-muted-foreground">작성일자</label>
              <Input
                type="date"
                value={form.writeDate}
                onChange={(e) => setForm((f) => ({ ...f, writeDate: e.target.value }))}
                className="h-9 text-[13px]"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-muted-foreground">메모</label>
              <Input
                value={form.memo}
                onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
                placeholder="품목명/비고"
                className="h-9 text-[13px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIssueOpen(false)} className="text-[13px]">
              취소
            </Button>
            <Button onClick={handleIssue} disabled={issuing} className="text-[13px] gap-1.5">
              {issuing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              발행하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
