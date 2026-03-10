import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileDown, ChevronLeft, ChevronRight, BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Props {
  isSuperAdmin: boolean;
}

export default function MonthlyReport({ isSuperAdmin }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [revenue, setRevenue] = useState({ total: 0, paid: 0, unpaid: 0, count: 0 });
  const [expense, setExpense] = useState({ total: 0, paid: 0, unpaid: 0, count: 0 });
  const [taxInvoice, setTaxInvoice] = useState({ supply: 0, tax: 0, total: 0, count: 0 });
  const [prevRevenue, setPrevRevenue] = useState(0);
  const [clients, setClients] = useState<{ name: string; amount: number }[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);

    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    const [paymentsRes, expensesRes, taxRes, clientsRes, prevPaymentsRes] = await Promise.all([
      supabase.from("payments").select("*, clients(name)").eq("year", year).eq("month", month),
      supabase.from("expenses").select("*").eq("year", year).eq("month", month),
      supabase.from("tax_invoice_logs").select("*").gte("issue_date", `${year}-${String(month).padStart(2, "0")}-01`).lt("issue_date", month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, "0")}-01`),
      supabase.from("clients").select("*").eq("is_active", true),
      supabase.from("payments").select("amount").eq("year", prevYear).eq("month", prevMonth),
    ]);

    const payments = (paymentsRes.data as any[]) || [];
    const expenses = (expensesRes.data as any[]) || [];
    const taxes = (taxRes.data as any[]) || [];
    const allClients = (clientsRes.data as any[]) || [];
    const prevPayments = (prevPaymentsRes.data as any[]) || [];

    // Revenue
    const revTotal = payments.reduce((s, p) => s + (p.amount || 0), 0);
    const revPaid = payments.filter(p => p.paid_date).reduce((s, p) => s + (p.amount || 0), 0);
    setRevenue({ total: revTotal, paid: revPaid, unpaid: revTotal - revPaid, count: payments.length });

    // Prev revenue
    setPrevRevenue(prevPayments.reduce((s, p) => s + (p.amount || 0), 0));

    // Expense
    const expTotal = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    const expPaid = expenses.filter(e => e.is_paid).reduce((s, e) => s + (e.amount || 0), 0);
    setExpense({ total: expTotal, paid: expPaid, unpaid: expTotal - expPaid, count: expenses.length });

    // Tax invoices
    const taxSupply = taxes.reduce((s, t) => s + (t.supply_amount || 0), 0);
    const taxAmount = taxes.reduce((s, t) => s + (t.tax_amount || 0), 0);
    setTaxInvoice({ supply: taxSupply, tax: taxAmount, total: taxSupply + taxAmount, count: taxes.length });

    // Client breakdown
    const clientMap: Record<string, number> = {};
    payments.forEach(p => {
      const name = (p as any).clients?.name || "기타";
      clientMap[name] = (clientMap[name] || 0) + (p.amount || 0);
    });
    setClients(
      Object.entries(clientMap)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount)
    );

    setLoading(false);
  }, [year, month]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fmt = (v: number) => v.toLocaleString("ko-KR");

  const changeRate = prevRevenue > 0 ? ((revenue.total - prevRevenue) / prevRevenue * 100) : 0;
  const ChangeIcon = changeRate > 0 ? TrendingUp : changeRate < 0 ? TrendingDown : Minus;
  const changeColor = changeRate > 0 ? "text-emerald-600" : changeRate < 0 ? "text-red-600" : "text-muted-foreground";

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(18);
      doc.text(`WEBHEADS Monthly Report`, 14, 20);
      doc.setFontSize(12);
      doc.text(`${year}. ${month}`, 14, 28);

      // Revenue summary
      doc.setFontSize(14);
      doc.text("Revenue (매출)", 14, 42);
      autoTable(doc, {
        startY: 46,
        head: [["항목", "금액"]],
        body: [
          ["총 매출", `${fmt(revenue.total)}원`],
          ["입금 완료", `${fmt(revenue.paid)}원`],
          ["미수금", `${fmt(revenue.unpaid)}원`],
          ["건수", `${revenue.count}건`],
        ],
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
      });

      // Expense summary
      const afterRev = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text("Expense (지출)", 14, afterRev);
      autoTable(doc, {
        startY: afterRev + 4,
        head: [["항목", "금액"]],
        body: [
          ["총 지출", `${fmt(expense.total)}원`],
          ["지급 완료", `${fmt(expense.paid)}원`],
          ["미지급", `${fmt(expense.unpaid)}원`],
          ["건수", `${expense.count}건`],
        ],
        theme: "grid",
        headStyles: { fillColor: [239, 68, 68] },
      });

      // Tax invoice
      const afterExp = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text("Tax Invoice (세금계산서)", 14, afterExp);
      autoTable(doc, {
        startY: afterExp + 4,
        head: [["항목", "금액"]],
        body: [
          ["공급가액", `${fmt(taxInvoice.supply)}원`],
          ["세액", `${fmt(taxInvoice.tax)}원`],
          ["합계", `${fmt(taxInvoice.total)}원`],
          ["발행건수", `${taxInvoice.count}건`],
        ],
        theme: "grid",
        headStyles: { fillColor: [16, 185, 129] },
      });

      // Client breakdown
      if (clients.length > 0) {
        const afterTax = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.text("Client Revenue Breakdown", 14, afterTax);
        autoTable(doc, {
          startY: afterTax + 4,
          head: [["고객사", "매출액", "비중"]],
          body: clients.map(c => [
            c.name,
            `${fmt(c.amount)}원`,
            revenue.total > 0 ? `${((c.amount / revenue.total) * 100).toFixed(1)}%` : "-",
          ]),
          theme: "grid",
          headStyles: { fillColor: [99, 102, 241] },
        });
      }

      // Net
      const netIncome = revenue.total - expense.total;
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text(`Net Income: ${fmt(netIncome)}원`, 14, finalY);

      doc.save(`webheads-report-${year}-${String(month).padStart(2, "0")}.pdf`);
      toast.success("PDF 생성 완료");
    } catch (e) {
      toast.error("PDF 생성 실패");
    } finally { setGenerating(false); }
  };

  const prevMonthNav = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };
  const nextMonthNav = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> 월간 리포트
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">매출/지출/세금계산서 종합 리포트</p>
        </div>
        <button
          onClick={generatePDF}
          disabled={generating || loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
          PDF 다운로드
        </button>
      </div>

      {/* Month selector */}
      <div className="flex items-center gap-3">
        <button onClick={prevMonthNav} className="p-1.5 rounded-lg hover:bg-muted/50"><ChevronLeft className="w-4 h-4" /></button>
        <span className="text-[14px] font-semibold min-w-[100px] text-center">{year}년 {month}월</span>
        <button onClick={nextMonthNav} className="p-1.5 rounded-lg hover:bg-muted/50"><ChevronRight className="w-4 h-4" /></button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
              <p className="text-[11px] font-medium text-blue-600">총 매출</p>
              <p className="text-xl font-bold text-blue-700 mt-1">{fmt(revenue.total)}원</p>
              <div className="flex items-center gap-1 mt-1">
                <ChangeIcon className={`w-3.5 h-3.5 ${changeColor}`} />
                <span className={`text-[11px] font-medium ${changeColor}`}>
                  전월 대비 {changeRate > 0 ? "+" : ""}{changeRate.toFixed(1)}%
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{revenue.count}건 · 미수금 {fmt(revenue.unpaid)}원</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
              <p className="text-[11px] font-medium text-red-600">총 지출</p>
              <p className="text-xl font-bold text-red-700 mt-1">{fmt(expense.total)}원</p>
              <p className="text-[10px] text-muted-foreground mt-1">{expense.count}건 · 미지급 {fmt(expense.unpaid)}원</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <p className="text-[11px] font-medium text-emerald-600">순이익</p>
              <p className="text-xl font-bold text-emerald-700 mt-1">{fmt(revenue.total - expense.total)}원</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                마진율 {revenue.total > 0 ? (((revenue.total - expense.total) / revenue.total) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4">
              <p className="text-[11px] font-medium text-violet-600">세금계산서</p>
              <p className="text-xl font-bold text-violet-700 mt-1">{fmt(taxInvoice.total)}원</p>
              <p className="text-[10px] text-muted-foreground mt-1">{taxInvoice.count}건 · 세액 {fmt(taxInvoice.tax)}원</p>
            </div>
          </div>

          {/* Client breakdown */}
          {clients.length > 0 && (
            <div className="rounded-xl border border-border/60 bg-white p-4">
              <h3 className="text-[13px] font-semibold text-foreground mb-3">고객사별 매출</h3>
              <div className="space-y-2">
                {clients.map((c, i) => {
                  const pct = revenue.total > 0 ? (c.amount / revenue.total) * 100 : 0;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[12px] font-medium min-w-[120px] truncate">{c.name}</span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary/70 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[12px] font-semibold min-w-[90px] text-right">{fmt(c.amount)}원</span>
                      <span className="text-[10px] text-muted-foreground min-w-[40px] text-right">{pct.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function toast_success(msg: string) {}
