"use client";

import { useState, useRef, useEffect } from "react";
import type { SurahInfo } from "@/types/quran";

interface SurahSidebarProps {
  surahs: SurahInfo[];
  currentPage: number;
  onNavigate: (page: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function SurahSidebar({ surahs, currentPage, onNavigate, isOpen, onClose }: SurahSidebarProps) {
  const [filter, setFilter] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const currentSurah = surahs.findLast((s) => s.startPage <= currentPage);

  const filtered = filter
    ? surahs.filter(
        (s) =>
          s.englishName.toLowerCase().includes(filter.toLowerCase()) ||
          s.name.includes(filter) ||
          String(s.number).includes(filter)
      )
    : surahs;

  useEffect(() => {
    if (isOpen && currentSurah && listRef.current) {
      const el = listRef.current.querySelector(`[data-surah="${currentSurah.number}"]`);
      if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [isOpen, currentSurah]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className="fixed top-0 left-0 h-full z-50 flex flex-col"
        style={{
          width: "340px",
          maxWidth: "85vw",
          background: "var(--page-bg, #1E1A13)",
          borderRight: "1px solid var(--border, rgba(212,180,74,0.10))",
          animation: "slideIn 0.2s ease-out",
        }}
      >
        <style>{`@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "18px", color: "var(--accent)" }}>
              Surahs
            </span>
            <button onClick={onClose} style={{ color: "var(--text-muted)", cursor: "pointer", background: "none", border: "none" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            placeholder="Search surah..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            autoFocus
            style={{
              width: "100%",
              padding: "8px 12px",
              background: "var(--surface)",
              border: "1px solid var(--border-medium)",
              borderRadius: "8px",
              color: "var(--text)",
              fontSize: "13px",
              outline: "none",
              fontFamily: "'EB Garamond', serif",
            }}
          />
        </div>

        {/* List */}
        <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {filtered.map((s) => {
            const isCurrent = currentSurah?.number === s.number;
            return (
              <button
                key={s.number}
                data-surah={s.number}
                onClick={() => { onNavigate(s.startPage); onClose(); }}
                className="w-full text-left"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 20px",
                  background: isCurrent ? "var(--surface-hover)" : "transparent",
                  borderLeft: isCurrent ? "2px solid var(--accent)" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  border: "none",
                  width: "100%",
                  fontFamily: "'EB Garamond', serif",
                }}
              >
                <span
                  style={{
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    border: "1px solid var(--border-medium)",
                    fontSize: "12px",
                    color: isCurrent ? "var(--accent)" : "var(--text-muted)",
                    flexShrink: 0,
                  }}
                >
                  {s.number}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: "14px", color: isCurrent ? "var(--accent)" : "var(--text)", fontWeight: 500 }}>
                      {s.englishName}
                    </span>
                    <span style={{ fontFamily: "'PDMS Saleem QuranFont', 'Amiri', serif", fontSize: "18px", color: isCurrent ? "var(--accent)" : "var(--text)", direction: "rtl" }}>
                      {s.name}
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {s.englishNameTranslation} &middot; {s.numberOfAyahs} ayahs &middot; {s.revelationType}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
