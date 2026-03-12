"use client";

import { useState, useRef, useEffect } from "react";
import type { JuzInfo, SurahInfo } from "@/types/quran";

interface JuzDropdownProps {
  juzData: JuzInfo[];
  surahs: SurahInfo[];
  currentJuz: number;
  onNavigate: (page: number) => void;
}

export function JuzDropdown({ juzData, surahs, currentJuz, onNavigate }: JuzDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getSurahName = (num: number) => surahs.find((s) => s.number === num)?.englishName || `Surah ${num}`;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="vd-badge"
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer", background: "none", border: "1px solid var(--border-medium, rgba(212,180,74,0.15))", color: "var(--text-muted)", padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontFamily: "'EB Garamond', serif" }}
      >
        Juz {currentJuz} <span style={{ marginLeft: "4px", fontSize: "8px" }}>&#9662;</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "260px",
            maxHeight: "400px",
            overflowY: "auto",
            background: "var(--page-bg, #1E1A13)",
            border: "1px solid var(--border-medium)",
            borderRadius: "12px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
            zIndex: 60,
            padding: "4px 0",
          }}
        >
          {juzData.map((j) => {
            const isCurrent = j.number === currentJuz;
            return (
              <button
                key={j.number}
                onClick={() => { onNavigate(j.startPage); setOpen(false); }}
                className="w-full text-left"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 16px",
                  background: isCurrent ? "var(--surface-hover)" : "transparent",
                  cursor: "pointer",
                  border: "none",
                  width: "100%",
                  fontFamily: "'EB Garamond', serif",
                  transition: "background 0.15s",
                }}
              >
                <span style={{ fontSize: "13px", color: isCurrent ? "var(--accent)" : "var(--text)", fontWeight: isCurrent ? 600 : 400 }}>
                  Juz {j.number}
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {getSurahName(j.startSurah)} {j.startSurah}:{j.startAyah}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
