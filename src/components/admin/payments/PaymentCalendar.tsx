import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { PaymentClient as Client, PaymentRecord as Payment } from "./paymentTypes";

interface Props {
  clients: Client[];
  payments: Payment[];
  onNavigate: (view: string, clientId?: string) => void;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function PaymentCalendar({ clients, payments, onNavigate }: Props) {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const goPrev = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const goNext = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDow = firstDay.getDay(); // 0=Sun
    const totalDays = lastDay.getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < startDow; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [year, month]);

  // Paid on specific date
  const paidByDate = useMemo(() => {
    const map = new Map<number, { client: Client; amount: number }[]>();
    payments
      .filter((p) => p.year === year && p.month === month && p.paid_date && !p.is_unpaid)
      .forEach((p) => {
        const d = new Date(p.paid_date!).getDate();
        const client = clients.find((c) => c.id === p.client_id);
        if (!client) return;
        const arr = map.get(d) || [];
        arr.push({ client, amount: p.amount || 0 });
        map.set(d, arr);
      });
    return map;
  }, [payments, clients, year, month]);

  // Overdue: expected day has passed, but not paid
  const overdueByDay = useMemo(() => {
    const map = new Map<number, Client[]>();
    const monthPayments = payments.filter((p) => p.year === year && p.month === month);

    clients.forEach((c) => {
      if (!c.is_active) return;
      if (!c.expected_payment_day) return;
      const dayMatch = c.expected_payment_day.match(/(\d+)/);
      if (!dayMatch) return;
      const expectedDay = parseInt(dayMatch[1]);
      if (isNaN(expectedDay) || expectedDay < 1 || expectedDay > 31) return;

      // Check if paid this month
      const paid = monthPayments.find(
        (p) => p.client_id === c.id && !p.is_unpaid && p.paid_date
      );
      if (paid) return;

      // Check if overdue (expected day has passed)
      const expectedDate = `${year}-${String(month).padStart(2, "0")}-${String(expectedDay).padStart(2, "0")}`;
      if (expectedDate <= today) {
        const arr = map.get(expectedDay) || [];
        arr.push(c);
        map.set(expectedDay, arr);
      }
    });
    return map;
  }, [clients, payments, year, month, today]);

  const formatWon = (n: number) => "₩" + n.toLocaleString("ko-KR");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{year}년 {month}월</h3>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={goPrev}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[12px] px-3"
            onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth() + 1); }}
          >
            오늘
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={goNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[12px]">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />납부 완료
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />미납 (기한 초과)
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] overflow-hidden">
        {/* Weekday header */}
        <div className="grid grid-cols-7 border-b border-[hsl(220,13%,91%)]">
          {WEEKDAYS.map((d, i) => (
            <div
              key={d}
              className={`text-center py-2.5 text-[12px] font-semibold ${
                i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-muted-foreground"
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const isToday = day && `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}` === today;
            const dow = idx % 7;
            const paid = day ? paidByDate.get(day) || [] : [];
            const overdue = day ? overdueByDay.get(day) || [] : [];

            return (
              <div
                key={idx}
                className={`min-h-[100px] border-b border-r border-[hsl(220,13%,93%)] p-1.5 ${
                  !day ? "bg-[hsl(220,14%,97%)]" : ""
                }`}
              >
                {day && (
                  <>
                    <div className={`text-[12px] font-medium mb-1 ${
                      isToday
                        ? "w-6 h-6 rounded-full bg-[hsl(221,83%,53%)] text-white flex items-center justify-center"
                        : dow === 0 ? "text-red-500" : dow === 6 ? "text-blue-500" : "text-foreground"
                    }`}>
                      {day}
                    </div>

                    <div className="space-y-0.5">
                      {paid.map((item, i) => (
                        <button
                          key={`p-${i}`}
                          onClick={() => onNavigate("detail", item.client.id)}
                          className="w-full text-left px-1.5 py-0.5 rounded text-[10px] leading-tight bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors truncate block"
                          title={`${item.client.name} ${formatWon(item.amount)}`}
                        >
                          ✓ {item.client.name}
                        </button>
                      ))}
                      {overdue.map((client, i) => (
                        <button
                          key={`o-${i}`}
                          onClick={() => onNavigate("detail", client.id)}
                          className="w-full text-left px-1.5 py-0.5 rounded text-[10px] leading-tight bg-red-50 text-red-600 hover:bg-red-100 transition-colors truncate block"
                          title={`${client.name} — 미납`}
                        >
                          ✕ {client.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
