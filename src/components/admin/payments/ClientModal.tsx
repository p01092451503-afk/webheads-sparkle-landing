import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Client {
  id: string;
  client_no: number;
  name: string;
  expected_payment_day: string | null;
  notes: string | null;
  is_active: boolean;
}

interface ClientCompany {
  id: string;
  company_name: string;
  business_number: string;
  num: string | null;
  is_active: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; expected_payment_day: string; notes: string; is_active: boolean }) => void;
  editClient?: Client | null;
  clients?: Client[];
}

export default function ClientModal({ open, onClose, onSubmit, editClient, clients }: Props) {
  const [name, setName] = useState("");
  const [expectedDay, setExpectedDay] = useState("");
  const [notes, setNotes] = useState("");
  const [isActive, setIsActive] = useState(true);

  // For selecting from client_companies
  const [companies, setCompanies] = useState<ClientCompany[]>([]);
  const [companySearch, setCompanySearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<ClientCompany | null>(null);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  useEffect(() => {
    if (open) {
      if (editClient) {
        setName(editClient.name);
        setExpectedDay(editClient.expected_payment_day || "");
        setNotes(editClient.notes || "");
        setIsActive(editClient.is_active);
        setSelectedCompany(null);
        setCompanySearch("");
      } else {
        setName("");
        setExpectedDay("");
        setNotes("");
        setIsActive(true);
        setSelectedCompany(null);
        setCompanySearch("");
        fetchCompanies();
      }
    }
  }, [open, editClient]);

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    const { data } = await supabase
      .from("client_companies")
      .select("id, company_name, business_number, num, is_active")
      .eq("is_active", true)
      .order("company_name");
    setCompanies(data || []);
    setLoadingCompanies(false);
  };

  // Filter out companies already registered as clients
  const existingNames = useMemo(() => new Set((clients || []).map(c => c.name)), [clients]);

  const filteredCompanies = useMemo(() => {
    const q = companySearch.trim().toLowerCase();
    return companies
      .filter(c => !existingNames.has(c.company_name))
      .filter(c => !q || c.company_name.toLowerCase().includes(q) || c.business_number.includes(q));
  }, [companies, companySearch, existingNames]);

  const handleSelectCompany = (company: ClientCompany) => {
    setSelectedCompany(company);
    setName(company.company_name);
    setCompanySearch("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-[16px]">{editClient ? "고객사 수정" : "고객사 추가"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {editClient && (
            <div className="space-y-1.5">
              <Label className="text-[13px]">고객번호</Label>
              <Input value={editClient.client_no} disabled className="h-9 text-[13px] bg-muted" />
            </div>
          )}

          {/* Add mode: select from client_companies */}
          {!editClient && (
            <div className="space-y-1.5">
              <Label className="text-[13px]">고객사관리에서 선택 *</Label>
              {selectedCompany ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-9 px-3 flex items-center rounded-md border bg-muted text-[13px]">
                    {selectedCompany.company_name}
                    <span className="ml-2 text-[11px] text-muted-foreground">({selectedCompany.business_number})</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 text-[12px]"
                    onClick={() => { setSelectedCompany(null); setName(""); }}
                  >
                    변경
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={companySearch}
                      onChange={(e) => setCompanySearch(e.target.value)}
                      placeholder="고객사명 또는 사업자번호 검색..."
                      className="h-9 text-[13px] pl-8"
                    />
                  </div>
                  <div className="max-h-[200px] overflow-y-auto border rounded-md">
                    {loadingCompanies ? (
                      <div className="px-3 py-4 text-center text-[12px] text-muted-foreground">로딩 중...</div>
                    ) : filteredCompanies.length === 0 ? (
                      <div className="px-3 py-4 text-center text-[12px] text-muted-foreground">
                        {companySearch ? "검색 결과가 없습니다" : "추가 가능한 고객사가 없습니다"}
                      </div>
                    ) : (
                      filteredCompanies.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-accent/50 transition-colors border-b last:border-b-0 text-[13px]"
                          onClick={() => handleSelectCompany(c)}
                        >
                          <span className="font-medium">{c.company_name}</span>
                          <span className="ml-2 text-[11px] text-muted-foreground">{c.business_number}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit mode: show name input */}
          {editClient && (
            <div className="space-y-1.5">
              <Label className="text-[13px]">고객사명 *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="회사명" className="h-9 text-[13px]" />
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-[13px]">예상납부일</Label>
            <Input value={expectedDay} onChange={(e) => setExpectedDay(e.target.value)} placeholder="예: 10일" className="h-9 text-[13px]" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[13px]">비고</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="비고 (선택)" className="h-9 text-[13px]" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-[13px]">활성 여부</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
          {!editClient && (
            <p className="text-[11px] text-muted-foreground">고객번호는 자동으로 부여됩니다</p>
          )}
          <Button
            onClick={() => onSubmit({ name, expected_payment_day: expectedDay, notes, is_active: isActive })}
            disabled={!name.trim()}
            className="w-full h-10 text-[13px] bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]"
          >
            {editClient ? "수정" : "추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
