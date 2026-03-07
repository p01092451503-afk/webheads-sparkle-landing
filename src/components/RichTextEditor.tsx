import { useRef, useState, useCallback, useEffect } from "react";
import { Bold, Italic, Underline, Strikethrough, Type, Palette } from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const FONT_SIZES = [
  { label: "아주 작게", value: "1" },
  { label: "작게", value: "2" },
  { label: "보통", value: "3" },
  { label: "약간 크게", value: "4" },
  { label: "크게", value: "5" },
  { label: "아주 크게", value: "6" },
  { label: "최대", value: "7" },
];

const COLORS = [
  "#000000", "#374151", "#6b7280",
  "#dc2626", "#ea580c", "#d97706",
  "#16a34a", "#2563eb", "#7c3aed",
  "#db2777",
];

export default function RichTextEditor({ value, onChange, placeholder, className }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const isComposing = useRef(false);
  const initialized = useRef(false);

  // Set initial value once
  useEffect(() => {
    if (editorRef.current && !initialized.current) {
      if (value) {
        editorRef.current.innerHTML = value;
        setIsEmpty(false);
      }
      initialized.current = true;
    }
  }, []);

  const syncValue = useCallback(() => {
    if (!editorRef.current) return;
    const text = editorRef.current.textContent || "";
    setIsEmpty(!text.trim());
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const exec = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    syncValue();
  }, [syncValue]);

  const handleInput = useCallback(() => {
    if (isComposing.current) return;
    syncValue();
  }, [syncValue]);

  const ToolBtn = ({ onClick, children, title }: { onClick: () => void; children: React.ReactNode; title: string }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className="p-1.5 rounded-md transition-colors hover:bg-primary/10 text-muted-foreground"
    >
      {children}
    </button>
  );

  return (
    <div className={`rounded-lg border border-border bg-muted transition-all duration-200 focus-within:border-primary focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/10 ${className || ""}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border/50 flex-wrap">
        <ToolBtn title="굵게" onClick={() => exec("bold")}>
          <Bold className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn title="기울임" onClick={() => exec("italic")}>
          <Italic className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn title="밑줄" onClick={() => exec("underline")}>
          <Underline className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn title="취소선" onClick={() => exec("strikeThrough")}>
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolBtn>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Font Size */}
        <div className="relative">
          <ToolBtn title="글자 크기" onClick={() => { setShowSizePicker(!showSizePicker); setShowColorPicker(false); }}>
            <Type className="w-3.5 h-3.5" />
          </ToolBtn>
          {showSizePicker && (
            <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg p-1.5 z-50 flex flex-col gap-0.5 min-w-[100px]">
              {FONT_SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    exec("fontSize", s.value);
                    setShowSizePicker(false);
                  }}
                  className="px-3 py-1.5 text-left rounded-md hover:bg-muted text-sm text-foreground transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color */}
        <div className="relative">
          <ToolBtn title="글자 색상" onClick={() => { setShowColorPicker(!showColorPicker); setShowSizePicker(false); }}>
            <Palette className="w-3.5 h-3.5" />
          </ToolBtn>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg p-2 z-50 grid grid-cols-5 gap-1.5 min-w-[140px]">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    exec("foreColor", color);
                    setShowColorPicker(false);
                  }}
                  className="w-6 h-6 rounded-full border-2 border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Editor */}
      <div className="relative" style={{ resize: "vertical", overflow: "auto", minHeight: expanded ? 200 : 120 }}>
        {isEmpty && (
          <div className="absolute top-0 left-0 right-0 px-4 py-3.5 text-sm text-muted-foreground/40 pointer-events-none select-none">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onCompositionStart={() => { isComposing.current = true; }}
          onCompositionEnd={() => { isComposing.current = false; syncValue(); }}
          onBlur={syncValue}
          onFocus={() => { setShowSizePicker(false); setShowColorPicker(false); }}
          className="px-4 py-3.5 text-sm outline-none text-foreground h-full"
          style={{ wordBreak: "keep-all", minHeight: "inherit" }}
        />
      </div>
    </div>
  );
}
