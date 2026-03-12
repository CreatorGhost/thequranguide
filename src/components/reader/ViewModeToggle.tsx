import type { ViewMode } from "@/types/quran";

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  showTransliteration?: boolean;
  onToggleTransliteration?: () => void;
}

export function ViewModeToggle({ mode, onChange, showTransliteration, onToggleTransliteration }: ViewModeToggleProps) {
  const modes: { key: ViewMode; label: string }[] = [
    { key: "reading", label: "Reading" },
    { key: "translation", label: "Translation" },
    { key: "word-by-word", label: "Word by Word" },
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="vd-mode-toggle">
        {modes.map((m) => (
          <button
            key={m.key}
            className={`vd-mode-btn ${mode === m.key ? "active" : ""}`}
            onClick={() => onChange(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>
      {onToggleTransliteration && (
        <button
          className={`vd-mode-btn ${showTransliteration ? "active" : ""}`}
          onClick={onToggleTransliteration}
          title="Toggle transliteration"
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            fontSize: "11px",
            border: `1px solid ${showTransliteration ? "rgba(212,180,74,0.25)" : "rgba(212,180,74,0.12)"}`,
          }}
        >
          Aa
        </button>
      )}
    </div>
  );
}
