import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Client {
  id: string;
  client_no: number;
  name: string;
  expected_payment_day: string | null;
  notes: string | null;
  is_active: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; expected_payment_day: string; notes: string; is_active: boolean }) => void;
  editClient?: Client | null;
  clients?: Client[];
}

export default function ClientModal({ open, onClose, onSubmit, editClient }: Props) {
  const [name, setName] = useState("");
  const [expectedDay, setExpectedDay] = useState("");
  const [notes, setNotes] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (open) {
      if (editClient) {
        setName(editClient.name);
        setExpectedDay(editClient.expected_payment_day || "");
        setNotes(editClient.notes || "");
        setIsActive(editClient.is_active);
      } else {
        setName("");
        setExpectedDay("");
        setNotes("");
        setIsActive(true);
      }
    }
  }, [open, editClient]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
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
          <div className="space-y-1.5">
            <Label className="text-[13px]">고객사명 *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="회사명" className="h-9 text-[13px]" />
          </div>
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