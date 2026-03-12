"use client";

interface MiniPlayerProps {
  isPlaying: boolean;
  currentAyah: number | null;
  reciter: string;
  speed: number;
  loopMode: "none" | "single" | "range";
  onStop: () => void;
  onCycleSpeed: () => void;
  onCycleReciter: () => void;
  onCycleLoop: () => void;
}

const RECITER_NAMES: Record<string, string> = {
  "ar.alafasy": "Al-Afasy",
  "ar.abdulbasit": "Abdul Basit",
  "ar.sudais": "Al-Sudais",
};

export function MiniPlayer({
  isPlaying,
  currentAyah,
  reciter,
  speed,
  loopMode,
  onStop,
  onCycleSpeed,
  onCycleReciter,
  onCycleLoop,
}: MiniPlayerProps) {
  if (!isPlaying) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "var(--page-bg, #1E1A13)",
        borderTop: "1px solid var(--border-medium, rgba(212,180,74,0.15))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "10px 20px",
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Left: now playing info */}
        <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--accent, #D4B44A)",
              animation: "vd-glow-pulse 1.5s ease-in-out infinite",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "'EB Garamond', serif", whiteSpace: "nowrap" }}>
            {currentAyah ? `Ayah ${currentAyah}` : "Playing..."}
          </span>
        </div>

        {/* Center: controls */}
        <div className="flex items-center gap-2">
          {/* Reciter */}
          <button
            onClick={onCycleReciter}
            style={{
              padding: "4px 10px",
              borderRadius: "16px",
              border: "1px solid var(--border, rgba(212,180,74,0.10))",
              background: "var(--surface, rgba(212,180,74,0.04))",
              color: "var(--text-muted)",
              fontSize: "11px",
              cursor: "pointer",
              fontFamily: "'EB Garamond', serif",
              whiteSpace: "nowrap",
            }}
            title="Change reciter"
          >
            {RECITER_NAMES[reciter] || reciter}
          </button>

          {/* Speed */}
          <button
            onClick={onCycleSpeed}
            style={{
              padding: "4px 10px",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              background: speed !== 1 ? "var(--surface-hover)" : "var(--surface)",
              color: speed !== 1 ? "var(--accent)" : "var(--text-muted)",
              fontSize: "11px",
              cursor: "pointer",
              fontFamily: "'EB Garamond', serif",
            }}
            title="Change speed"
          >
            {speed}x
          </button>

          {/* Loop */}
          <button
            onClick={onCycleLoop}
            style={{
              padding: "4px 10px",
              borderRadius: "16px",
              border: `1px solid ${loopMode !== "none" ? "var(--border-strong)" : "var(--border)"}`,
              background: loopMode !== "none" ? "var(--surface-hover)" : "var(--surface)",
              color: loopMode !== "none" ? "var(--accent)" : "var(--text-muted)",
              fontSize: "11px",
              cursor: "pointer",
              fontFamily: "'EB Garamond', serif",
            }}
            title={`Loop: ${loopMode}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 014-4h14" />
              <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 01-4 4H3" />
            </svg>
            {loopMode !== "none" && (
              <span style={{ marginLeft: "3px" }}>{loopMode === "single" ? "1" : "R"}</span>
            )}
          </button>

          {/* Stop */}
          <button
            onClick={onStop}
            style={{
              padding: "6px 14px",
              borderRadius: "16px",
              border: "1px solid var(--accent)",
              background: "var(--surface-hover)",
              color: "var(--accent)",
              fontSize: "11px",
              cursor: "pointer",
              fontFamily: "'EB Garamond', serif",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="2" />
            </svg>
            Stop
          </button>
        </div>

        {/* Right: spacer for balance */}
        <div style={{ minWidth: "80px" }} />
      </div>
    </div>
  );
}
