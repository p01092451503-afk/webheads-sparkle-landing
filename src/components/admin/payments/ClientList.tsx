import { useState, useMemo } from "react";
import { Search, Plus, Edit2, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

interface Props {
  clients: Client[];
  payments: Payment[];
  onNavigate: (view: string, clientId?: string) => void;
  onAddPayment: (clientId?: string) => void;
  onEditClient: (client: Client) => void;
  onAddClient: () => void;
}

const formatWon = (n: number) => "₩" + n.toLocaleString("ko-KR");

type FilterType = "all" | "paid" | "unpaid" | "managed";
type SortType = "unpaid" | "date" | "name";

export default function ClientList({ clients, payments, onNavigate, onAddPayment, onEditClient, onAddClient }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("name");

  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const clientData = useMemo(() => {
    return clients.map((c) => {
      const unpaidTotal = payments
        .filter((p) => p.client_id === c.id && p.is_unpaid)
        .reduce((s, p) => s + (p.amount || 0), 0);

      const thisMonth = payments.find(
        (p) => p.client_id === c.id && p.year === currentYear && p.month === currentMonth
      );

      const isManaged = c.expected_payment_day === "따로관리" || c.notes?.includes("따로 관리");

      let status: "paid" | "unpaid" | "managed";
      if (isManaged) status = "managed";
      else if (unpaidTotal > 0 || (thisMonth && thisMonth.is_unpaid)) status = "unpaid";
      else status = "paid";

      return { ...c, unpaidTotal, thisMonth, status };
    });
  }, [clients, payments, currentYear, currentMonth]);

  const filtered = useMemo(() => {
    let list = clientData;

    if (search) {
      list = list.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (filter === "paid") list = list.filter((c) => c.status === "paid");
    else if (filter === "unpaid") list = list.filter((c) => c.status === "unpaid");
    else if (filter === "managed") list = list.filter((c) => c.status === "managed");

    if (sort === "unpaid") list = [...list].sort((a, b) => b.unpaidTotal - a.unpaidTotal);
    else if (sort === "date") list = [...list].sort((a, b) => {
      const da = a.thisMonth?.paid_date || "";
      const db = b.thisMonth?.paid_date || "";
      return da.localeCompare(db);
    });
    else list = [...list].sort((a, b) => (a.client_no || 0) - (b.client_no || 0));

    return list;
  }, [clientData, search, filter, sort]);

  const statusBadge = (status: string) => {
    switch (status) {
      case "paid": return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[11px]">납부완료</Badge>;
      case "unpaid": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[11px]">미납</Badge>;
      case "managed": return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 text-[11px]">따로관리</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="고객사 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-[13px] bg-white"
            />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
            <SelectTrigger className="w-[120px] h-9 text-[13px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="paid">납부완료</SelectItem>
              <SelectItem value="unpaid">미납</SelectItem>
              <SelectItem value="managed">따로관리</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as SortType)}>
            <SelectTrigger className="w-[130px] h-9 text-[13px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">고객사명 순</SelectItem>
              <SelectItem value="unpaid">미납금 순</SelectItem>
              <SelectItem value="date">납부일 순</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onAddClient} className="h-9 text-[13px]">
            <Plus className="w-3.5 h-3.5 mr-1" />고객사 추가
          </Button>
          <Button size="sm" onClick={() => onAddPayment()} className="h-9 text-[13px] bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]">
            <CreditCard className="w-3.5 h-3.5 mr-1" />입금 등록
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[hsl(220,13%,91%)] bg-[hsl(220,14%,97%)]">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-[50px]">No</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">고객사명</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-[90px]">예상납부일</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-[100px]">입금일</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">비고</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground w-[120px]">미납금</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground w-[110px]">이달 금액</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground w-[80px]">상태</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground w-[90px]">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-[hsl(220,13%,93%)] hover:bg-[hsl(220,14%,97.5%)] transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{c.client_no}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onNavigate("detail", c.id)}
                      className="font-medium text-[hsl(221,83%,53%)] hover:underline"
                    >
                      {c.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.expected_payment_day || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.thisMonth?.paid_date ? c.thisMonth.paid_date.replace(/-/g, ".") : "-"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.notes || "-"}</td>
                  <td className={`px-4 py-3 text-right font-medium ${c.unpaidTotal > 0 ? "text-red-600" : ""}`}>
                    {c.unpaidTotal > 0 ? formatWon(c.unpaidTotal) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {c.thisMonth ? formatWon(c.thisMonth.amount || 0) : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">{statusBadge(c.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEditClient(c)}
                        className="p-1.5 rounded-lg hover:bg-[hsl(220,14%,93%)] text-muted-foreground transition-colors"
                        title="수정"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onAddPayment(c.id)}
                        className="p-1.5 rounded-lg hover:bg-[hsl(220,14%,93%)] text-muted-foreground transition-colors"
                        title="입금 등록"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                    검색 결과가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
