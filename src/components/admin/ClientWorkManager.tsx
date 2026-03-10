import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, Building2, FolderKanban, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

const ClientProjectManager = lazy(() => import("./ClientProjectManager"));
const ClientCommLog = lazy(() => import("./ClientCommLog"));

interface Company {
  id: string;
  company_name: string;
  num: string | null;
  is_active: boolean;
}

interface Props {
  isSuperAdmin: boolean;
}

export default function ClientWorkManager({ isSuperAdmin }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [activeSection, setActiveSection] = useState<"project" | "comm">("project");

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("client_companies")
      .select("id, company_name, num, is_active")
      .eq("is_active", true)
      .order("num");
    setCompanies((data as Company[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  const filtered = companies.filter(c =>
    c.company_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.num && c.num.includes(search))
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Building2 className="w-5 h-5" /> 고객사별 업무 관리
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">고객사를 선택하여 프로젝트 및 커뮤니케이션 로그를 관리합니다</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Company list */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="고객사 검색..."
              className="h-8 text-[13px] pl-8"
            />
          </div>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="space-y-0.5 max-h-[calc(100vh-280px)] overflow-y-auto rounded-lg border border-border/60 bg-muted/10">
              {filtered.length === 0 ? (
                <p className="text-[12px] text-muted-foreground text-center py-6">검색 결과 없음</p>
              ) : (
                filtered.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCompany(c)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 text-[13px] transition-colors ${
                      selectedCompany?.id === c.id
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{c.company_name}</span>
                    {c.num && <span className="text-[10px] text-muted-foreground shrink-0">#{c.num}</span>}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="min-h-[300px]">
          {!selectedCompany ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground">
              <Building2 className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-[13px]">좌측에서 고객사를 선택하세요</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                <h3 className="text-[15px] font-bold text-foreground">{selectedCompany.company_name}</h3>
                {selectedCompany.num && (
                  <span className="text-[11px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">#{selectedCompany.num}</span>
                )}
              </div>

              {/* Section tabs */}
              <div className="flex gap-1 bg-muted/30 rounded-lg p-0.5 w-fit">
                <button
                  onClick={() => setActiveSection("project")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                    activeSection === "project"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FolderKanban className="w-3.5 h-3.5" /> 프로젝트 관리
                </button>
                <button
                  onClick={() => setActiveSection("comm")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                    activeSection === "comm"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" /> 커뮤니케이션 로그
                </button>
              </div>

              <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>}>
                {activeSection === "project" ? (
                  <ClientProjectManager
                    key={selectedCompany.id}
                    companyId={selectedCompany.id}
                    companyName={selectedCompany.company_name}
                    isSuperAdmin={isSuperAdmin}
                  />
                ) : (
                  <ClientCommLog
                    key={selectedCompany.id}
                    companyId={selectedCompany.id}
                    isSuperAdmin={isSuperAdmin}
                  />
                )}
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
