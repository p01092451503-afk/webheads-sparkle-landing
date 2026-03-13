import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Upload, Trash2, Download, Eye, FileText, FileImage, FileSpreadsheet,
  File, FolderOpen, Plus, Search, Loader2, X, Pencil,
} from "lucide-react";
import { toast } from "sonner";

interface WorkFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  content_type: string | null;
  folder: string;
  memo: string | null;
  uploaded_by: string | null;
  created_at: string;
}

const DEFAULT_FOLDERS = ["일반", "계약서", "세금계산서", "견적서", "기타"];

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(contentType: string | null, fileName: string) {
  if (contentType?.startsWith("image/")) return <FileImage className="w-5 h-5 text-emerald-500" />;
  if (contentType?.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />;
  if (contentType?.includes("sheet") || contentType?.includes("excel") || fileName.endsWith(".xlsx") || fileName.endsWith(".csv"))
    return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
  return <File className="w-5 h-5 text-muted-foreground" />;
}

function isPreviewable(contentType: string | null): boolean {
  if (!contentType) return false;
  return contentType.startsWith("image/") || contentType === "application/pdf";
}

export default function WorkFileManager({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [files, setFiles] = useState<WorkFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("all");
  const [folders, setFolders] = useState<string[]>(DEFAULT_FOLDERS);

  // Upload dialog
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFolder, setUploadFolder] = useState("일반");
  const [uploadMemo, setUploadMemo] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview dialog
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewFile, setPreviewFile] = useState<WorkFile | null>(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<WorkFile | null>(null);

  // Edit dialog
  const [editTarget, setEditTarget] = useState<WorkFile | null>(null);
  const [editFolder, setEditFolder] = useState("일반");
  const [editMemo, setEditMemo] = useState("");
  const [editReplaceFile, setEditReplaceFile] = useState<File | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("work_files")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("파일 목록을 불러올 수 없습니다");
    } else {
      setFiles(data || []);
      const uniqueFolders = [...new Set([...DEFAULT_FOLDERS, ...(data || []).map((f: WorkFile) => f.folder)])];
      setFolders(uniqueFolders);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const folderToPathKey: Record<string, string> = {
    "일반": "general",
    "계약서": "contracts",
    "세금계산서": "invoices",
    "견적서": "quotes",
    "기타": "etc",
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    try {
      for (const file of selectedFiles) {
        const ext = file.name.split(".").pop();
        const safeFolder = folderToPathKey[uploadFolder] || "general";
        const filePath = `${safeFolder}/${Date.now()}_${crypto.randomUUID().slice(0, 6)}.${ext}`;

        const { error: storageError } = await supabase.storage
          .from("work-files")
          .upload(filePath, file);
        if (storageError) throw storageError;

        const { error: dbError } = await supabase.from("work_files").insert({
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          content_type: file.type,
          folder: uploadFolder,
          memo: uploadMemo || null,
        });
        if (dbError) throw dbError;
      }
      toast.success(`${selectedFiles.length}개 파일 업로드 완료`);
      setUploadOpen(false);
      setSelectedFiles([]);
      setUploadMemo("");
      fetchFiles();
    } catch (e: any) {
      toast.error("업로드 실패: " + (e.message || "알 수 없는 오류"));
    }
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await supabase.storage.from("work-files").remove([deleteTarget.file_path]);
      await supabase.from("work_files").delete().eq("id", deleteTarget.id);
      toast.success("파일이 삭제되었습니다");
      setDeleteTarget(null);
      fetchFiles();
    } catch {
      toast.error("삭제 실패");
    }
  };

  const handlePreview = async (file: WorkFile) => {
    const { data, error } = await supabase.storage.from("work-files").download(file.file_path);
    if (error || !data) { toast.error("미리보기 실패"); return; }
    const url = URL.createObjectURL(data);
    setPreviewUrl(url);
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  const handleDownload = async (file: WorkFile) => {
    const { data, error } = await supabase.storage.from("work-files").download(file.file_path);
    if (error || !data) { toast.error("다운로드 실패"); return; }
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filtered = files.filter((f) => {
    const matchFolder = folderFilter === "all" || f.folder === folderFilter;
    const matchSearch = !search || f.file_name.toLowerCase().includes(search.toLowerCase()) || (f.memo || "").toLowerCase().includes(search.toLowerCase());
    return matchFolder && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FolderOpen className="w-5 h-5" /> 업무자료
        </h2>
        <Button onClick={() => setUploadOpen(true)} className="px-5 py-2.5 rounded-xl gap-2">
          <Upload className="w-4 h-4" /> 파일 업로드
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="파일명 또는 메모 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-60"
          />
        </div>
        <Select value={folderFilter} onValueChange={setFolderFilter}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 폴더</SelectItem>
            {folders.map((f) => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filtered.length}개 파일</span>
      </div>

      {/* File list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          {files.length === 0 ? "업로드된 파일이 없습니다" : "검색 결과가 없습니다"}
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground">
                <th className="text-left px-4 py-3 font-medium">파일명</th>
                <th className="text-left px-4 py-3 font-medium w-24">폴더</th>
                <th className="text-left px-4 py-3 font-medium w-24">크기</th>
                <th className="text-left px-4 py-3 font-medium w-28">업로드일</th>
                <th className="text-left px-4 py-3 font-medium w-48">메모</th>
                <th className="text-center px-4 py-3 font-medium w-32">작업</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((file) => (
                <tr key={file.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.content_type, file.file_name)}
                      <span className="truncate max-w-xs">{file.file_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{file.folder}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatFileSize(file.file_size)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(file.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground truncate max-w-[12rem]">{file.memo || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleDownload(file)} title="다운로드">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(file)} title="삭제" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>파일 업로드</DialogTitle>
            <DialogDescription>업무자료 파일을 업로드합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>폴더</Label>
              <Select value={uploadFolder} onValueChange={setUploadFolder}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>메모 (선택)</Label>
              <Input
                className="mt-1"
                value={uploadMemo}
                onChange={(e) => setUploadMemo(e.target.value)}
                placeholder="파일에 대한 간단한 메모"
              />
            </div>
            <div>
              <Label>파일 선택</Label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                }}
              />
              {selectedFiles.length === 0 ? (
                <div
                  className="mt-1 border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30"
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.add("border-primary", "bg-primary/10"); }}
                  onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.remove("border-primary", "bg-primary/10"); }}
                  onDrop={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    e.currentTarget.classList.remove("border-primary", "bg-primary/10");
                    if (e.dataTransfer.files?.length) setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">파일을 여기에 끌어다 놓거나 클릭하여 선택</p>
                </div>
              ) : (
                <div className="mt-1 space-y-1">
                  {selectedFiles.map((f, i) => (
                    <div key={i} className="text-xs flex items-center justify-between bg-muted/50 rounded px-2 py-1.5">
                      <span className="truncate" title={f.name}>{f.name}</span>
                      <button onClick={() => setSelectedFiles((prev) => prev.filter((_, j) => j !== i))}>
                        <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline mt-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    + 파일 추가
                  </button>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>취소</Button>
            <Button onClick={handleUpload} disabled={uploading || selectedFiles.length === 0} className="gap-2">
              {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
              업로드
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={(open) => { if (!open && previewUrl) URL.revokeObjectURL(previewUrl); setPreviewOpen(open); }}>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>{previewFile?.file_name}</DialogTitle>
            <DialogDescription>파일 미리보기</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center overflow-auto max-h-[65vh]">
            {previewFile?.content_type?.startsWith("image/") ? (
              <img src={previewUrl} alt={previewFile.file_name} className="max-w-full max-h-[60vh] object-contain rounded" />
            ) : previewFile?.content_type === "application/pdf" ? (
              <object data={previewUrl} type="application/pdf" className="w-full h-[60vh] rounded border">
                <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-muted-foreground">
                  <FileText className="w-10 h-10" />
                  <p className="text-sm">PDF 미리보기를 지원하지 않는 브라우저입니다.</p>
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">새 탭에서 열기</a>
                </div>
              </object>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => previewFile && handleDownload(previewFile)} className="gap-2">
              <Download className="w-4 h-4" /> 다운로드
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>파일 삭제</DialogTitle>
            <DialogDescription>
              "{deleteTarget?.file_name}" 파일을 삭제하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>취소</Button>
            <Button variant="destructive" onClick={handleDelete}>삭제</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
