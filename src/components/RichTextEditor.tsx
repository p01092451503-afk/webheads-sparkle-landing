import { useRef, useState, useCallback } from "react";
import { Bold, Italic, Underline, Strikethrough, Type, Palette, Expand, Shrink } from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px"];
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
  const [expanded, setExpanded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!value);

  const exec = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    updateValue();
  }, []);

  const updateValue = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const text = editorRef.current.textContent || "";
    setIsEmpty(!text.trim());
    onChange(html);
  }, [onChange]);

  const handleInput = useCallback(() => {
    updateValue();
  }, [updateValue]);

  const ToolBtn = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title: string }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`p-1.5 rounded-md transition-colors hover:bg-primary/10 ${active ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
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
            <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg p-1.5 z-50 flex flex-col gap-0.5 min-w-[80px]">
              {FONT_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    // fontSize command uses 1-7, so we use a span approach
                    exec("fontSize", "7");
                    // Replace font size 7 with actual pixel size
                    const el = editorRef.current;
                    if (el) {
                      const fonts = el.querySelectorAll('font[size="7"]');
                      fonts.forEach((f) => {
                        const span = document.createElement("span");
                        span.style.fontSize = size;
                        span.innerHTML = f.innerHTML;
                        f.replaceWith(span);
                      });
                      updateValue();
                    }
                    setShowSizePicker(false);
                  }}
                  className="px-3 py-1.5 text-left rounded-md hover:bg-muted text-sm text-foreground transition-colors"
                  style={{ fontSize: size }}
                >
                  {size}
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

        <div className="flex-1" />

        {/* Expand/Shrink */}
        <ToolBtn title={expanded ? "축소" : "확장"} onClick={() => setExpanded(!expanded)}>
          {expanded ? <Shrink className="w-3.5 h-3.5" /> : <Expand className="w-3.5 h-3.5" />}
        </ToolBtn>
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
          onBlur={updateValue}
          onFocus={() => { setShowSizePicker(false); setShowColorPicker(false); }}
          dangerouslySetInnerHTML={value ? { __html: value } : undefined}
          className="px-4 py-3.5 text-sm outline-none text-foreground h-full"
          style={{ wordBreak: "keep-all", minHeight: "inherit" }}
        />
      </div>
    </div>
  );
}
