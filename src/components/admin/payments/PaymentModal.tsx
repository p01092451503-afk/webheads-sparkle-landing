import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface Client {
  id: string;
  name: string;
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
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    client_id: string;
    year: number;
    month: number;
    amount: number;
    paid_date: string | null;
    is_unpaid: boolean;
    memo: string;
  }) => void;
  clients: Client[];
  editPayment?: Payment | null;
  preselectedClientId?: string;
}

export default function PaymentModal({ open, onClose, onSubmit, clients, editPayment, preselectedClientId }: Props) {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const [clientId, setClientId] = useState("");
  const [year, setYear] = useState(now.getFullYear().toString());
  const [month, setMonth] = useState((now.getMonth() + 1).toString());
  const [amount, setAmount] = useState("");
  const [paidDate, setPaidDate] = useState<Date | undefined>(undefined);
  const [isUnpaid, setIsUnpaid] = useState(false);
  const [memo, setMemo] = useState("");
  const [clientSearch, setClientSearch] = useState("");

  useEffect(() => {
    if (open) {
      if (editPayment) {
        setClientId(editPayment.client_id);
        setYear(editPayment.year.toString());
        setMonth(editPayment.month.toString());
        setAmount(editPayment.amount?.toLocaleString("ko-KR") || "");
        setPaidDate(editPayment.paid_date ? new Date(editPayment.paid_date) : undefined);
        setIsUnpaid(editPayment.is_unpaid);
        setMemo(editPayment.memo || "");
      } else {
        setClientId(preselectedClientId || "");
        setYear(now.getFullYear().toString());
        setMonth((now.getMonth() + 1).toString());
        setAmount("");
        setPaidDate(undefined);
        setIsUnpaid(false);
        setMemo("");
      }
      setClientSearch("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editPayment, preselectedClientId]);

  const handleAmountChange = (val: string) => {
    const num = val.replace(/[^0-9]/g, "");
    setAmount(num ? parseInt(num).toLocaleString("ko-KR") : "");
  };

  const handleSubmit = () => {
    const numAmount = parseInt(amount.replace(/,/g, "")) || 0;
    onSubmit({
      client_id: clientId,
      year: parseInt(year),
      month: parseInt(month),
      amount: numAmount,
      paid_date: paidDate ? format(paidDate, "yyyy-MM-dd") : null,
      is_unpaid: isUnpaid,
      memo,
    });
  };

  const filteredClients = clients.filter((c) =>
    !clientSearch || c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-[16px]">{editPayment ? "입금 수정" : "입금 등록"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {/* Client */}
          <div className="space-y-1.5">
            <Label className="text-[13px]">고객사</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue placeholder="고객사 선택" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 pb-2">
                  <Input
                    placeholder="검색..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="h-8 text-[12px]"
                  />
                </div>
                {filteredClients.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="text-[13px]">{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year + Month */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[13px]">연도</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2024, 2025, 2026].map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}년</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">월</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <SelectItem key={m} value={m.toString()}>{m}월</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label className="text-[13px]">입금액 (원)</Label>
            <Input
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              className="h-9 text-[13px]"
            />
          </div>

          {/* Paid Date */}
          <div className="space-y-1.5">
            <Label className="text-[13px]">입금일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full h-9 justify-start text-left text-[13px] font-normal", !paidDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {paidDate ? format(paidDate, "yyyy.MM.dd") : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={paidDate}
                  onSelect={setPaidDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Is Unpaid */}
          <div className="flex items-center justify-between">
            <Label className="text-[13px]">미납 처리</Label>
            <Switch checked={isUnpaid} onCheckedChange={setIsUnpaid} />
          </div>

          {/* Memo */}
          <div className="space-y-1.5">
            <Label className="text-[13px]">메모</Label>
            <Input
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="메모 (선택)"
              className="h-9 text-[13px]"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!clientId}
            className="w-full h-10 text-[13px] bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]"
          >
            {editPayment ? "수정" : "등록"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
