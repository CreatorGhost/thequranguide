"use client";

import { useState, useEffect, useRef } from "react";
import type { SurahInfo, JuzInfo } from "@/types/quran";

interface SearchOverlayProps {
  surahs: SurahInfo[];
  juzData: JuzInfo[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: number) => void;
}

interface SearchResult {
  type: "surah" | "juz" | "page";
  label: string;
  sublabel: string;
  page: number;
}

export function SearchOverlay({ surahs, juzData, isOpen, onClose, onNavigate }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent toggles
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const results: SearchResult[] = [];

  if (query.trim()) {
    const q = query.trim().toLowerCase();

    // Page number
    const pageNum = parseInt(q);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= 604) {
      results.push({ type: "page", label: `Page ${pageNum}`, sublabel: "Go to page", page: pageNum });
    }

    // Surahs
    for (const s of surahs) {
      if (
        s.englishName.toLowerCase().includes(q) ||
        s.name.includes(query) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        String(s.number) === q
      ) {
        results.push({
          type: "surah",
          label: `${s.number}. ${s.englishName}`,
          sublabel: `${s.name} - ${s.englishNameTranslation} (${s.numberOfAyahs} ayahs)`,
          page: s.startPage,
        });
      }
    }

    // Juz
    for (const j of juzData) {
      if (`juz ${j.number}`.includes(q) || `juz${j.number}`.includes(q) || String(j.number) === q) {
        const surahName = surahs.find((s) => s.number === j.startSurah)?.englishName || "";
        results.push({
          type: "juz",
          label: `Juz ${j.number}`,
          sublabel: `Starts at ${surahName} ${j.startSurah}:${j.startAyah}`,
          page: j.startPage,
        });
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIdx]) {
      onNavigate(results[selectedIdx].page);
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />
      <div
        className="fixed z-50"
        style={{
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          maxWidth: "90vw",
          background: "var(--page-bg, #1E1A13)",
          border: "1px solid var(--border-medium)",
          borderRadius: "16px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        {/* Input */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search surah, juz, or page number..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: "var(--text)",
                fontSize: "15px",
                outline: "none",
                fontFamily: "'EB Garamond', serif",
              }}
            />
            <kbd style={{ fontSize: "10px", color: "var(--text-muted)", padding: "2px 6px", border: "1px solid var(--border)", borderRadius: "4px" }}>
              ESC
            </kbd>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div style={{ maxHeight: "300px", overflowY: "auto", padding: "4px 0" }}>
            {results.map((r, i) => (
              <button
                key={`${r.type}-${r.page}-${i}`}
                onClick={() => { onNavigate(r.page); onClose(); }}
                className="w-full text-left"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 20px",
                  background: i === selectedIdx ? "var(--surface-hover)" : "transparent",
                  cursor: "pointer",
                  border: "none",
                  width: "100%",
                  fontFamily: "'EB Garamond', serif",
                  transition: "background 0.1s",
                }}
                onMouseEnter={() => setSelectedIdx(i)}
              >
                <div>
                  <div style={{ fontSize: "14px", color: i === selectedIdx ? "var(--accent)" : "var(--text)" }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {r.sublabel}
                  </div>
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "capitalize" }}>
                  {r.type}
                </span>
              </button>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div style={{ padding: "24px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px", fontFamily: "'EB Garamond', serif" }}>
            No results found
          </div>
        )}

        {!query && (
          <div style={{ padding: "16px 20px", color: "var(--text-muted)", fontSize: "12px", fontFamily: "'EB Garamond', serif" }}>
            <p>Type a surah name, number, juz, or page to navigate</p>
            <div className="flex gap-3 mt-2" style={{ fontSize: "11px" }}>
              <span>e.g. &ldquo;Baqarah&rdquo; &middot; &ldquo;2&rdquo; &middot; &ldquo;Juz 30&rdquo; &middot; &ldquo;Page 50&rdquo;</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
