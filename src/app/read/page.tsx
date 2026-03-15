"use client";

import { useEffect, useState, useCallback } from "react";
import type { ViewMode } from "@/types/quran";
import { toArabicNum, TOTAL_PAGES } from "@/lib/utils";
import { useQuranPage } from "@/hooks/useQuranPage";
import { useAudio } from "@/hooks/useAudio";
import { useTheme } from "@/components/ui/ThemeProvider";
import { ReadingMode } from "@/components/reader/ReadingMode";
import { TranslationMode } from "@/components/reader/TranslationMode";
import { WordByWordMode } from "@/components/reader/WordByWordMode";
import { ViewModeToggle } from "@/components/reader/ViewModeToggle";
import { SurahSidebar } from "@/components/navigation/SurahSidebar";
import { JuzDropdown } from "@/components/navigation/JuzDropdown";
import { SearchOverlay } from "@/components/navigation/SearchOverlay";
import { MiniPlayer } from "@/components/audio/MiniPlayer";
import { SURAHS } from "@/data/surahs";
import { JUZ } from "@/data/juz";

const TRANSLATION_EDITIONS = [
  { code: "en.sahih", label: "EN", name: "English" },
  { code: "ur.jalandhry", label: "UR", name: "Urdu" },
  { code: "fr.hamidullah", label: "FR", name: "French" },
  { code: "tr.diyanet", label: "TR", name: "Turkish" },
  { code: "id.indonesian", label: "ID", name: "Bahasa" },
  { code: "es.cortes", label: "ES", name: "Spanish" },
] as const;

const NAV_LINKS = [
  { label: "Insights", href: "/insights" },
  { label: "Learn", href: "/learn" },
  { label: "Quiz", href: "/quiz" },
  { label: "Duas", href: "/dua" },
  { label: "Khatmah", href: "/khatmah" },
  { label: "Search", href: "/search" },
];

export default function ReadPage() {
  const [pageNum, setPageNum] = useState(1);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // Restore last page: ?page= query param takes priority, then localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("page");
      if (p) {
        const num = parseInt(p);
        if (!isNaN(num) && num >= 1 && num <= TOTAL_PAGES) {
          setPageNum(num);
          return;
        }
      }
      const saved = localStorage.getItem("tqg-last-page");
      if (saved) {
        const num = parseInt(saved);
        if (!isNaN(num) && num >= 1 && num <= TOTAL_PAGES) {
          setPageNum(num);
        }
      }
    }
  }, []);

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("tqg-last-page", String(pageNum));
  }, [pageNum]);
  const [mode, setMode] = useState<ViewMode>("reading");
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [translationLang, setTranslationLang] = useState("en.sahih");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { theme, cycleTheme } = useTheme();

  // Load saved translation language from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tqg-translation-lang");
    if (saved && TRANSLATION_EDITIONS.some((e) => e.code === saved)) {
      setTranslationLang(saved);
    }
  }, []);

  const changeTranslationLang = useCallback((code: string) => {
    setTranslationLang(code);
    localStorage.setItem("tqg-translation-lang", code);
    setLangDropdownOpen(false);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!langDropdownOpen && !moreMenuOpen) return;
    const handleClick = () => { setLangDropdownOpen(false); setMoreMenuOpen(false); };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [langDropdownOpen, moreMenuOpen]);

  const audio = useAudio();

  const onPageLoadStart = useCallback(() => {
    audio.stopAudio();
  }, [audio]);

  const page = useQuranPage(pageNum, onPageLoadStart, translationLang);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (searchOpen || sidebarOpen) return;
      if (e.key === "ArrowRight" && pageNum < TOTAL_PAGES) setPageNum((p) => p + 1);
      if (e.key === "ArrowLeft" && pageNum > 1) setPageNum((p) => p - 1);
      if (e.key === "Escape") audio.stopAudio();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [pageNum, audio, searchOpen, sidebarOpen]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => audio.stopAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (p: number) => { if (p >= 1 && p <= TOTAL_PAGES) setPageNum(p); };
  const navigate = (p: number) => { goTo(p); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Amiri+Quran&family=Amiri:wght@400;700&display=swap');

        @font-face {
          font-family: 'PDMS Saleem QuranFont';
          src: url('/fonts/pdms-saleem-quranfont.woff') format('woff'),
               url('/fonts/pdms-saleem-quranfont.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        .vd {
          background: var(--bg, #1A1610);
          color: var(--text, #F0DFA0);
          font-family: 'EB Garamond', Georgia, serif;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .vd-glow {
          position: fixed; top: 40%; left: 50%;
          transform: translate(-50%, -50%);
          width: 1000px; height: 800px; border-radius: 50%;
          background: radial-gradient(ellipse, var(--glow, rgba(212,180,74,0.04)) 0%, transparent 60%);
          pointer-events: none; z-index: 0;
        }

        .vd::after {
          content: ''; position: fixed; inset: 0;
          opacity: 0.015; pointer-events: none; z-index: 9999; display: var(--noise-display, block);
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 256px;
        }

        .vd-nav {
          background: var(--nav-bg, rgba(26,22,16,0.95));
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .vd-nav a { color: var(--text-muted); transition: color 0.15s; text-decoration: none; }
        .vd-nav a:hover { color: var(--accent); }

        .vd-nav-row1 {
          display: flex; align-items: center; justify-content: space-between;
          height: 48px; padding: 0 16px;
          max-width: 72rem; margin: 0 auto;
        }
        .vd-nav-row2 {
          display: flex; align-items: center; justify-content: space-between;
          height: 40px; padding: 0 16px;
          max-width: 72rem; margin: 0 auto;
          border-top: 1px solid var(--border);
        }
        .vd-surah-indicator {
          background: none; border: none; cursor: pointer;
          font-family: 'EB Garamond', serif; font-size: 16px;
          color: var(--accent); letter-spacing: 0.03em;
          transition: opacity 0.15s; padding: 4px 12px;
        }
        .vd-surah-indicator:hover { opacity: 0.75; }
        .vd-page-stepper {
          display: flex; align-items: center; gap: 6px;
          font-family: 'EB Garamond', serif; font-size: 14px;
          color: var(--text-muted);
        }
        .vd-page-stepper button {
          background: none; border: none; cursor: pointer;
          color: var(--text-muted); font-size: 13px; padding: 4px 6px;
          transition: color 0.15s; display: flex; align-items: center;
          border-radius: 4px;
        }
        .vd-page-stepper button:hover { color: var(--accent); }
        .vd-page-stepper button:disabled { opacity: 0.2; pointer-events: none; }

        .vd-page-input {
          background: var(--page-input-bg);
          border: 1px solid var(--page-input-border);
          color: var(--text);
          font-family: 'EB Garamond', serif;
          font-size: 16px; width: 56px; text-align: center;
          padding: 4px 0; border-radius: 6px; outline: none;
          transition: border-color 0.2s;
        }
        .vd-page-input:focus { border-color: var(--border-strong); }

        .vd-badge {
          font-size: 14px; color: var(--text-muted);
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 2px 10px; border-radius: 20px;
        }

        .vd-mode-toggle {
          display: flex; gap: 2px;
          background: var(--mode-toggle-bg);
          border: 1px solid var(--mode-toggle-border);
          border-radius: 10px; padding: 4px;
        }
        .vd-mode-btn {
          padding: 6px 14px; border-radius: 8px;
          font-size: 15px; color: var(--text-muted);
          cursor: pointer; transition: all 0.2s;
          border: none; background: none;
          font-family: 'EB Garamond', serif;
          white-space: nowrap; letter-spacing: 0.02em;
        }
        .vd-mode-btn:hover { color: var(--text); }
        .vd-mode-btn.active { color: var(--accent); background: var(--mode-active-bg); }
        @media (max-width: 639px) { .vd-mode-btn { padding: 4px 9px; font-size: 13px; } }

        .vd-mushaf {
          background: var(--page-bg);
          max-width: 100%; margin: 0 auto; position: relative;
          display: flex; flex-direction: column;
          min-height: calc(100vh - 100px);
          box-shadow: inset 0 1px 0 var(--border);
        }
        .vd-mushaf.wide { max-width: 100%; }

        .vd-page-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 48px 16px;
          border-bottom: 1px solid var(--border);
          direction: rtl;
        }
        @media (min-width: 768px) { .vd-page-header { padding: 24px 72px 18px; } }
        .vd-page-header-text {
          font-family: 'PDMS Saleem QuranFont', 'Amiri', serif;
          font-size: 16px; color: var(--header-text); direction: rtl;
          letter-spacing: 0.03em;
        }
        .vd-page-header-num { font-family: 'Amiri', serif; font-size: 16px; color: var(--header-num); }

        .vd-content { flex: 1; padding: 24px 20px 20px; }
        @media (min-width: 640px) { .vd-content { padding: 28px 32px 24px; } }
        @media (min-width: 768px) { .vd-content { padding: 32px 48px 28px; } }
        @media (min-width: 1024px) { .vd-content { padding: 32px 64px 28px; } }

        .vd-surah-banner {
          display: flex; align-items: center; justify-content: center; gap: 24px;
          padding: 20px 24px; margin-bottom: 8px; margin-top: 8px;
          text-align: center;
        }
        .vd-surah-banner-name {
          font-family: 'PDMS Saleem QuranFont', 'Amiri', serif;
          font-size: 42px; color: var(--accent); direction: rtl;
          line-height: 1.4; letter-spacing: 0.02em;
        }
        @media (max-width: 639px) { .vd-surah-banner-name { font-size: 34px; } }
        .vd-surah-banner-info { text-align: left; direction: ltr; }
        .vd-surah-banner-en {
          font-family: 'EB Garamond', serif; font-size: 18px;
          color: var(--text-bright, #F5E8B0); font-weight: 600;
          letter-spacing: 0.02em; line-height: 1.4;
        }
        .vd-surah-banner-trans {
          font-family: 'EB Garamond', serif; font-size: 14px;
          color: var(--text-muted); font-style: italic;
          letter-spacing: 0.02em; margin-top: 2px;
        }
        .vd-surah-banner-meta {
          font-size: 12px; color: var(--text-muted);
          letter-spacing: 0.06em; margin-top: 4px;
        }

        .vd-bismillah {
          font-family: 'PDMS Saleem QuranFont', 'Amiri', serif;
          font-size: 34px; color: var(--accent, #D4B44A); text-align: center;
          direction: rtl; line-height: 2.0; margin-bottom: 18px;
          margin-top: 8px; letter-spacing: 0.02em;
        }
        @media (min-width: 640px) { .vd-bismillah { font-size: 40px; margin-bottom: 22px; } }

        .vd-bismillah-en {
          font-family: 'EB Garamond', serif;
          font-size: 14px;
          color: var(--text-muted);
          text-align: center;
          margin-top: -10px;
          margin-bottom: 20px;
          letter-spacing: 0.02em;
        }

        .vd-quran {
          font-family: 'PDMS Saleem QuranFont', 'Amiri Quran', 'Amiri', serif;
          font-size: 30px; line-height: 2.1; direction: rtl;
          text-align: justify; color: var(--text-bright, #F5E8B0);
          word-spacing: 6px; letter-spacing: 0.02em;
        }
        @media (min-width: 640px) { .vd-quran { font-size: 34px; line-height: 2.0; word-spacing: 8px; } }
        @media (min-width: 768px) { .vd-quran { font-size: 38px; line-height: 2.0; word-spacing: 10px; } }

        .vd-ayah-playing {
          background: linear-gradient(90deg, transparent 0%, var(--surface) 10%, var(--surface) 90%, transparent 100%);
          border-radius: 4px; padding: 2px 0; transition: background 0.3s ease;
        }
        .vd-ayah-playing .vd-iword { color: var(--accent); transition: color 0.3s ease; }

        .vd-anum {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px;
          border: 1.5px solid var(--anum-border); border-radius: 50%;
          font-family: 'Amiri', serif; font-size: 12px;
          color: var(--anum-text);
          vertical-align: middle; margin: 0 4px;
          direction: ltr; flex-shrink: 0; line-height: 1;
        }
        .vd-anum-btn { cursor: pointer; transition: all 0.2s; }
        .vd-anum-btn:hover { border-color: var(--accent); color: var(--accent); }
        .vd-anum-btn.playing { border-color: var(--accent); color: var(--accent); animation: vd-glow-pulse 1.5s ease-in-out infinite; }
        @keyframes vd-glow-pulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }

        .vd-iword {
          position: relative; cursor: pointer;
          transition: color 0.15s;
          border-radius: 4px; padding: 0 1px;
        }
        .vd-iword:hover { color: var(--accent); }
        .vd-iword.active { color: var(--accent); }

        .vd-translit-inline {
          display: block; font-size: 10px; font-style: italic;
          color: var(--word-translit); direction: ltr; text-align: center;
          font-family: 'EB Garamond', serif; line-height: 1.2; margin-top: -8px;
        }

        .vd-tip {
          position: absolute; bottom: calc(100% + 12px); left: 50%;
          transform: translateX(-50%) scale(0.95); opacity: 0;
          pointer-events: none; transition: opacity 0.2s, transform 0.2s; z-index: 100;
          background: var(--tip-bg);
          border: 1px solid var(--tip-border); border-radius: 12px;
          padding: 14px 18px; min-width: 120px; max-width: 220px;
          text-align: center; backdrop-filter: blur(12px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.25);
          font-family: 'EB Garamond', serif; direction: ltr; line-height: 1.5;
        }
        .vd-tip::after {
          content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
          border: 6px solid transparent; border-top-color: var(--tip-border);
        }
        .vd-tip::before {
          content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
          border: 5px solid transparent; border-top-color: var(--tip-bg); z-index: 1;
        }
        .vd-iword:hover .vd-tip, .vd-iword.active .vd-tip { opacity: 1; transform: translateX(-50%) scale(1); pointer-events: auto; }
        .vd-tip-meaning { display: block; font-size: 15px; font-weight: 500; color: var(--text-bright); margin-bottom: 5px; }
        .vd-tip-translit { display: block; font-size: 12px; font-style: italic; color: var(--text-muted); margin-bottom: 8px; }
        .vd-tip-listen {
          display: flex; align-items: center; justify-content: center; gap: 5px;
          font-size: 11px; color: var(--text-muted);
          padding-top: 6px; border-top: 1px solid var(--border); letter-spacing: 0.04em;
        }
        .vd-iword.active .vd-tip-listen { color: var(--accent); }

        .vd-hint {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 10px 16px; margin-bottom: 16px;
          background: var(--hint-bg); border: 1px solid var(--hint-border);
          border-radius: 8px; font-family: 'EB Garamond', serif;
          font-size: 13px; color: var(--hint-text); letter-spacing: 0.02em; line-height: 1.5;
        }
        .vd-hint svg { flex-shrink: 0; opacity: 0.6; }

        .vd-page-footer {
          text-align: center; padding: 28px 24px 32px;
          border-top: 1px solid var(--border); margin-top: 16px;
        }
        .vd-page-footer-num { font-family: 'Amiri', serif; font-size: 20px; color: var(--footer-num); font-weight: 500; }
        .vd-manzil { font-family: 'PDMS Saleem QuranFont', 'Amiri', serif; font-size: 15px; color: var(--text-muted); direction: rtl; margin-top: 6px; }

        .vd-arrow {
          position: fixed; top: 50%; transform: translateY(-50%);
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--border-medium, rgba(212,180,74,0.15)); border-radius: 50%;
          color: var(--text-muted, rgba(212,180,74,0.45)); background: color-mix(in srgb, var(--bg, #1A1610) 85%, transparent);
          backdrop-filter: blur(8px); cursor: pointer; transition: all 0.2s; z-index: 30;
        }
        .vd-arrow:hover { border-color: var(--border-strong, rgba(212,180,74,0.35)); color: var(--accent, #D4B44A); background: color-mix(in srgb, var(--bg, #1A1610) 95%, transparent); }
        .vd-arrow-l { left: 20px; }
        .vd-arrow-r { right: 20px; }
        @media (max-width: 767px) { .vd-arrow { width: 40px; height: 40px; } .vd-arrow-l { left: 10px; } .vd-arrow-r { right: 10px; } }
        .vd-arrow[disabled] { opacity: 0.15; pointer-events: none; }

        @keyframes vd-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        .vd-loading { animation: vd-pulse 1.5s ease-in-out infinite; }

        .vd-surah-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border) 30%, var(--border) 70%, transparent);
          margin: 20px 0;
        }

        .vd-play-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 5px;
          padding: 4px 12px;
          border: 1px solid var(--play-btn-border); border-radius: 20px;
          background: var(--play-btn-bg); color: var(--text-muted);
          font-family: 'EB Garamond', serif; font-size: 13px;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .vd-play-btn:hover { border-color: var(--border-strong); color: var(--accent); background: var(--surface-hover); }
        .vd-play-btn.playing { border-color: var(--accent); color: var(--accent); background: var(--surface-hover); }

        .vd-wbw-ayah { margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
        .vd-wbw-ayah:last-child { border-bottom: none; margin-bottom: 8px; }
        .vd-wbw-ayah-header { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 14px; }
        .vd-wbw-ayah-label { font-family: 'EB Garamond', serif; font-size: 13px; color: var(--text-muted); letter-spacing: 0.08em; }

        .vd-wbw-words { display: flex; flex-wrap: wrap; gap: 12px; direction: rtl; justify-content: center; margin-bottom: 24px; }

        .vd-word-card {
          display: flex; flex-direction: column; align-items: center;
          padding: 14px 12px 12px;
          border: 1px solid var(--word-card-border); border-radius: 12px;
          background: var(--word-card-bg); transition: all 0.2s ease;
          cursor: pointer; min-width: 72px; position: relative;
        }
        .vd-word-card:hover { border-color: var(--word-card-hover-border); background: var(--word-card-hover-bg); transform: translateY(-2px); }
        .vd-word-card.playing { border-color: var(--accent); background: var(--surface-hover); transform: translateY(-2px); }
        .vd-word-card-speaker { position: absolute; top: 5px; left: 5px; opacity: 0; transition: opacity 0.15s; color: var(--text-muted); }
        .vd-word-card:hover .vd-word-card-speaker, .vd-word-card.playing .vd-word-card-speaker { opacity: 1; }
        .vd-word-card.playing .vd-word-card-speaker { color: var(--accent); }
        .vd-word-arabic { font-family: 'PDMS Saleem QuranFont', 'Amiri Quran', 'Amiri', serif; font-size: 28px; color: var(--text-bright); line-height: 1.8; direction: rtl; }
        @media (min-width: 640px) { .vd-word-arabic { font-size: 32px; } }
        .vd-word-translit { font-size: 10px; color: var(--word-translit); font-style: italic; margin-top: 2px; font-family: 'EB Garamond', serif; direction: ltr; }
        .vd-word-meaning { font-size: 11px; color: var(--text-muted); margin-top: 4px; text-align: center; font-family: 'EB Garamond', serif; max-width: 90px; line-height: 1.35; direction: ltr; }

        .vd-wbw-end {
          display: flex; align-items: center; justify-content: center;
          align-self: center; width: 36px; height: 36px;
          border: 1.5px solid var(--anum-border); border-radius: 50%;
          font-family: 'Amiri', serif; font-size: 14px;
          color: var(--anum-text); flex-shrink: 0; direction: ltr;
        }

        .vd-full-translation {
          font-family: 'EB Garamond', serif; font-size: 15px;
          color: var(--text-muted, #8A7D5E); line-height: 1.75;
          text-align: center; padding: 10px 20px;
          background: var(--surface, rgba(212,180,74,0.02)); border-radius: 8px;
          border: 1px solid var(--border, rgba(212,180,74,0.05)); direction: ltr;
        }
        @media (min-width: 640px) { .vd-full-translation { font-size: 16px; padding: 12px 28px; } }

        .vd-trans-ayah { margin-bottom: 18px; padding-bottom: 16px; border-bottom: 1px solid var(--trans-ayah-border); }
        .vd-trans-ayah:last-child { border-bottom: none; margin-bottom: 6px; }
        .vd-trans-ayah.playing { background: var(--trans-playing-bg); border-radius: 8px; padding: 16px 20px 20px; margin-left: -20px; margin-right: -20px; }
        .vd-trans-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; direction: ltr; }
        .vd-trans-arabic {
          font-family: 'PDMS Saleem QuranFont', 'Amiri Quran', 'Amiri', serif;
          font-size: 32px; line-height: 2.1; direction: rtl;
          text-align: right; color: var(--text-bright, #F5E8B0); margin-bottom: 12px;
          word-spacing: 8px; letter-spacing: 0.02em;
        }
        @media (min-width: 640px) { .vd-trans-arabic { font-size: 38px; line-height: 2.0; word-spacing: 10px; } }
        @media (min-width: 768px) { .vd-trans-arabic { font-size: 42px; line-height: 2.0; word-spacing: 12px; } }
        .vd-trans-english { font-family: 'EB Garamond', serif; font-size: 16px; color: var(--text-muted, #8A7D5E); line-height: 1.75; text-align: left; direction: ltr; padding-left: 2px; }
        @media (min-width: 640px) { .vd-trans-english { font-size: 17px; } }
        .vd-trans-english.rtl-text { direction: rtl; text-align: right; padding-left: 0; padding-right: 2px; font-size: 19px; line-height: 2.0; }
        @media (min-width: 640px) { .vd-trans-english.rtl-text { font-size: 21px; } }
        .vd-trans-ref { font-family: 'EB Garamond', serif; font-size: 14px; color: var(--text-muted); margin-top: 4px; direction: ltr; }

        .vd-nav-btn {
          background: none; border: none; cursor: pointer;
          color: var(--text-muted); padding: 4px; border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .vd-nav-btn:hover { color: var(--accent); background: var(--surface-hover); }

        .vd-more-menu {
          position: absolute; top: calc(100% + 6px); right: 0;
          background: var(--dropdown-bg); border: 1px solid var(--dropdown-border);
          border-radius: 8px; padding: 4px; min-width: 150px;
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.15); z-index: 200;
        }
        .vd-more-menu a {
          display: flex; align-items: center; gap: 8px; width: 100%;
          padding: 8px 14px; border-radius: 6px; font-size: 16px;
          color: var(--text-muted); text-decoration: none; transition: all 0.15s;
          font-family: 'EB Garamond', serif;
        }
        .vd-more-menu a:hover { background: var(--surface-hover); color: var(--accent); }
      `}</style>

      <div className="vd">
        <div className="vd-glow" />

        {/* ─── Nav ─── */}
        <nav className="vd-nav fixed top-0 left-0 right-0 z-50">
          {/* Row 1: Primary navigation */}
          <div className="vd-nav-row1">
            <div className="flex items-center gap-3">
              <button className="vd-nav-btn" onClick={() => setSidebarOpen(true)} title="Browse Surahs">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </button>
              <a href="/" className="flex items-center gap-2">
                <span style={{ fontFamily: "'EB Garamond', serif", color: "var(--accent)", fontSize: "17px" }}>The Quran Guide</span>
                <span className="hidden sm:inline" style={{ color: 'rgba(184,152,63,0.5)', fontFamily: "'Amiri', serif", fontSize: "13px", direction: 'rtl', lineHeight: 1 }}>دليل القرآن</span>
              </a>
            </div>

            {/* Center: Current surah name */}
            {!page.loading && page.firstSurah && (
              <button className="vd-surah-indicator hidden sm:block" onClick={() => setSidebarOpen(true)}>
                {page.firstSurah.englishName}
              </button>
            )}

            <div className="flex items-center gap-2">
              <button className="vd-nav-btn" onClick={() => setSearchOpen(true)} title="Search (Ctrl+K)">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
              <button className="vd-nav-btn" onClick={cycleTheme} title={`Theme: ${theme}`}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {theme === "dark" ? (
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  ) : theme === "light" ? (
                    <>
                      <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </>
                  ) : (
                    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" />
                  )}
                </svg>
              </button>
              <div style={{ position: "relative" }}>
                <button
                  className="vd-nav-btn"
                  onClick={(e) => { e.stopPropagation(); setMoreMenuOpen((v) => !v); }}
                  title="More pages"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="5" r="1.5" fill="currentColor" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><circle cx="12" cy="19" r="1.5" fill="currentColor" />
                  </svg>
                </button>
                {moreMenuOpen && (
                  <div className="vd-more-menu" onClick={(e) => e.stopPropagation()}>
                    {NAV_LINKS.map((link) => (
                      <a key={link.href} href={link.href}>{link.label}</a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Reader controls */}
          <div className="vd-nav-row2">
            {/* Left: Page stepper */}
            <div className="vd-page-stepper">
              <button onClick={() => goTo(pageNum - 1)} disabled={pageNum <= 1} aria-label="Previous page">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span>Page</span>
              <input
                type="number"
                className="vd-page-input"
                min={1}
                max={TOTAL_PAGES}
                value={pageNum}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v >= 1 && v <= TOTAL_PAGES) setPageNum(v);
                }}
              />
              <button onClick={() => goTo(pageNum + 1)} disabled={pageNum >= TOTAL_PAGES} aria-label="Next page">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Center: Mode toggle */}
            <ViewModeToggle
              mode={mode}
              onChange={(m) => { audio.stopAudio(); setMode(m); }}
              showTransliteration={showTransliteration}
              onToggleTransliteration={() => setShowTransliteration((p) => !p)}
            />

            {/* Right: Juz + Language */}
            <div className="flex items-center gap-2">
              {page.juz > 0 && (
                <JuzDropdown
                  juzData={JUZ}
                  surahs={SURAHS}
                  currentJuz={page.juz}
                  onNavigate={navigate}
                />
              )}
              <div style={{ position: "relative" }}>
                <button
                  className="vd-nav-btn"
                  onClick={(e) => { e.stopPropagation(); setLangDropdownOpen((v) => !v); }}
                  title="Translation language"
                  style={{ fontSize: "13px", fontFamily: "'EB Garamond', serif", gap: "4px", padding: "4px 8px" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                  <span>{TRANSLATION_EDITIONS.find((e) => e.code === translationLang)?.label || "EN"}</span>
                </button>
                {langDropdownOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      right: 0,
                      background: "var(--dropdown-bg)",
                      border: "1px solid var(--dropdown-border)",
                      borderRadius: "8px",
                      padding: "4px",
                      minWidth: "140px",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                      zIndex: 100,
                    }}
                  >
                    {TRANSLATION_EDITIONS.map((edition) => (
                      <button
                        key={edition.code}
                        onClick={() => changeTranslationLang(edition.code)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          width: "100%",
                          padding: "7px 12px",
                          border: "none",
                          background: translationLang === edition.code ? "var(--surface-hover)" : "none",
                          color: translationLang === edition.code ? "#D4B44A" : "#8A7D5E",
                          fontFamily: "'EB Garamond', serif",
                          fontSize: "15px",
                          cursor: "pointer",
                          borderRadius: "6px",
                          transition: "all 0.15s",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                          if (translationLang !== edition.code) {
                            e.currentTarget.style.background = "var(--surface)";
                            e.currentTarget.style.color = "#F0DFA0";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (translationLang !== edition.code) {
                            e.currentTarget.style.background = "none";
                            e.currentTarget.style.color = "#8A7D5E";
                          }
                        }}
                      >
                        <span style={{ fontWeight: 600, minWidth: "22px" }}>{edition.label}</span>
                        <span style={{ opacity: 0.7 }}>{edition.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Side arrows */}
        <button className="vd-arrow vd-arrow-l" onClick={() => goTo(pageNum - 1)} disabled={pageNum <= 1} aria-label="Previous page">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button className="vd-arrow vd-arrow-r" onClick={() => goTo(pageNum + 1)} disabled={pageNum >= TOTAL_PAGES} aria-label="Next page">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* ─── Mushaf page ─── */}
        <main className="relative z-10 pb-10" style={{ maxWidth: "100%", margin: "0 auto", paddingTop: "88px" }}>
          <div className={`vd-mushaf ${mode !== "reading" ? "wide" : ""}`}>
            {!page.loading && page.firstSurah && (
              <div className="vd-page-header">
                <span className="vd-page-header-text">{page.lastSurah?.name} {toArabicNum(page.lastSurah?.number || 0)}</span>
                <span className="vd-page-header-num">{toArabicNum(pageNum)}</span>
                <span className="vd-page-header-text">{page.firstSurah.name} {toArabicNum(page.firstSurah.number)}</span>
              </div>
            )}

            <div className="vd-content">
              {page.loading ? (
                <div className="flex items-center justify-center" style={{ minHeight: "80vh" }}>
                  <div className="text-center vd-loading">
                    <div style={{ width: "40px", height: "40px", border: "1.5px solid var(--border-medium)", borderRadius: "50%", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--text-muted)" }} />
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>Loading...</p>
                  </div>
                </div>

              ) : mode === "reading" ? (
                <ReadingMode
                  groupedBySurah={page.groupedBySurah}
                  verseByKey={page.verseByKey}
                  playingAyah={audio.playingAyah}
                  playingWordId={audio.playingWordId}
                  pageAyahPlayData={page.pageAyahPlayData}
                  ayahPlayIdx={page.ayahPlayIdx}
                  stopAudio={audio.stopAudio}
                  playWordAudio={audio.playWordAudio}
                  playAyahSequence={audio.playAyahSequence}
                  showTransliteration={showTransliteration}
                />

              ) : mode === "translation" ? (
                <TranslationMode
                  groupedBySurah={page.groupedBySurah}
                  translationMap={page.translationMap}
                  playingAyah={audio.playingAyah}
                  pageAyahPlayData={page.pageAyahPlayData}
                  ayahPlayIdx={page.ayahPlayIdx}
                  stopAudio={audio.stopAudio}
                  playAyahSequence={audio.playAyahSequence}
                />

              ) : (
                <WordByWordMode
                  versesGrouped={page.versesGrouped}
                  surahInfo={page.surahInfo}
                  translationMap={page.translationMap}
                  ayahNumMap={page.ayahNumMap}
                  playingAyah={audio.playingAyah}
                  playingWordId={audio.playingWordId}
                  isSequentialPlaying={audio.isSequentialPlaying}
                  stopAudio={audio.stopAudio}
                  playWordAudio={audio.playWordAudio}
                  playAyahAudio={audio.playAyahAudio}
                  playWordsSequentially={audio.playWordsSequentially}
                />
              )}
            </div>

            {/* Page footer */}
            {!page.loading && (
              <div className="vd-page-footer">
                <div className="vd-page-footer-num">{toArabicNum(pageNum)}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "6px", fontFamily: "'EB Garamond', serif", letterSpacing: "0.03em" }}>
                  {page.groupedBySurah.map((g, i) => (
                    <span key={i}>{g.surah.englishName}{i < page.groupedBySurah.length - 1 ? " \u00b7 " : ""}</span>
                  ))}
                  {" "}&middot; Page {pageNum}
                  {page.juz > 0 && <> &middot; Juz {page.juz}</>}
                </div>
                {page.manzil > 0 && <div className="vd-manzil">{"\u0645\u0646\u0632\u0644"} {toArabicNum(page.manzil)}</div>}
              </div>
            )}
          </div>
        </main>

        {/* ─── Overlays ─── */}
        <SurahSidebar
          surahs={SURAHS}
          currentPage={pageNum}
          onNavigate={navigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <SearchOverlay
          surahs={SURAHS}
          juzData={JUZ}
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onNavigate={navigate}
        />

        {/* ─── Mini Player ─── */}
        <MiniPlayer
          isPlaying={audio.playingAyah !== null || audio.playingWordId !== null}
          currentAyah={audio.playingAyah}
          reciter={audio.reciter}
          speed={audio.speed}
          loopMode={audio.loopMode}
          onStop={audio.stopAudio}
          onCycleSpeed={audio.cycleSpeed}
          onCycleReciter={audio.cycleReciter}
          onCycleLoop={audio.cycleLoopMode}
        />
      </div>
    </>
  );
}
