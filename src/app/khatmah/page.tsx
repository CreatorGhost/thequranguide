"use client";

import { useState, useEffect, useCallback } from "react";
import { JUZ } from "@/data/juz";
import { SURAHS } from "@/data/surahs";

const TOTAL_PAGES = 604;
const STORAGE_KEY = "tqg-khatmah";
const RAMADAN_STORAGE_KEY = "tqg-ramadan-progress";

type TabMode = "progress" | "ramadan";

interface KhatmahData {
  pagesRead: number[];        // page numbers that have been read
  dailyGoal: number;          // pages per day
  readDates: string[];        // ISO date strings "YYYY-MM-DD"
}

interface RamadanDayInfo {
  day: number;
  juzNumber: number;
  startPage: number;
  endPage: number;
  surahs: string[];
}

function buildRamadanPlan(): RamadanDayInfo[] {
  const plan: RamadanDayInfo[] = [];
  for (let i = 0; i < 30; i++) {
    const juz = JUZ[i];
    const startPage = juz.startPage;
    const endPage = i < 29 ? JUZ[i + 1].startPage - 1 : TOTAL_PAGES;
    // Find surahs that overlap with this page range
    const surahNames: string[] = [];
    for (const s of SURAHS) {
      const surahStart = s.startPage;
      // surah ends at next surah's startPage - 1, or TOTAL_PAGES for last surah
      const nextSurah = SURAHS.find((ns) => ns.number === s.number + 1);
      const surahEnd = nextSurah ? nextSurah.startPage - 1 : TOTAL_PAGES;
      if (surahStart <= endPage && surahEnd >= startPage) {
        surahNames.push(s.englishName);
      }
    }
    plan.push({
      day: i + 1,
      juzNumber: juz.number,
      startPage,
      endPage,
      surahs: surahNames,
    });
  }
  return plan;
}

function loadRamadanProgress(): boolean[] {
  if (typeof window === "undefined") return new Array(30).fill(false);
  try {
    const raw = localStorage.getItem(RAMADAN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 30) return parsed;
    }
  } catch {
    // corrupt data
  }
  return new Array(30).fill(false);
}

function saveRamadanProgress(progress: boolean[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(RAMADAN_STORAGE_KEY, JSON.stringify(progress));
  }
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function loadData(): KhatmahData {
  if (typeof window === "undefined") {
    return { pagesRead: [], dailyGoal: 4, readDates: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        pagesRead: parsed.pagesRead || [],
        dailyGoal: parsed.dailyGoal || 4,
        readDates: parsed.readDates || [],
      };
    }
  } catch {
    // corrupt data — start fresh
  }
  return { pagesRead: [], dailyGoal: 4, readDates: [] };
}

function saveData(data: KhatmahData) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

function computeStreak(readDates: string[]): { current: number; longest: number } {
  if (readDates.length === 0) return { current: 0, longest: 0 };

  let longest = 0;
  let streak = 0;

  // For computing longest streak, iterate forward through unique sorted dates
  const forward = [...new Set(readDates)].sort();
  for (let i = 0; i < forward.length; i++) {
    if (i === 0) {
      streak = 1;
    } else {
      const prev = new Date(forward[i - 1]);
      const curr = new Date(forward[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      streak = diff === 1 ? streak + 1 : 1;
    }
    longest = Math.max(longest, streak);
  }

  // For current streak, walk backward from today
  const sorted = [...new Set(readDates)].sort().reverse();
  const today = getToday();
  let current = 0;
  const todayDate = new Date(today);
  let checkDate = todayDate;
  for (let i = 0; i < sorted.length; i++) {
    const checkStr = checkDate.toISOString().split("T")[0];
    if (sorted.includes(checkStr)) {
      current++;
      checkDate = new Date(checkDate.getTime() - 86400000);
    } else {
      break;
    }
  }

  return { current, longest };
}

function getLast30Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

export default function KhatmahPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState<KhatmahData>({
    pagesRead: [],
    dailyGoal: 4,
    readDates: [],
  });
  const [mounted, setMounted] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const [activeTab, setActiveTab] = useState<TabMode>("progress");
  const [ramadanProgress, setRamadanProgress] = useState<boolean[]>(new Array(30).fill(false));
  const [ramadanPlan] = useState<RamadanDayInfo[]>(() => buildRamadanPlan());

  useEffect(() => {
    const loaded = loadData();
    setData(loaded);
    setGoalInput(String(loaded.dailyGoal));
    setRamadanProgress(loadRamadanProgress());
    setMounted(true);
  }, []);

  const updateData = useCallback((updater: (prev: KhatmahData) => KhatmahData) => {
    setData((prev) => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  const markPageRead = useCallback((page: number) => {
    updateData((prev) => {
      const today = getToday();
      const pagesRead = prev.pagesRead.includes(page)
        ? prev.pagesRead
        : [...prev.pagesRead, page];
      const readDates = prev.readDates.includes(today)
        ? prev.readDates
        : [...prev.readDates, today];
      return { ...prev, pagesRead, readDates };
    });
  }, [updateData]);

  const markTodayPages = useCallback(() => {
    updateData((prev) => {
      const today = getToday();
      // Find next unread pages up to daily goal
      const unread: number[] = [];
      for (let p = 1; p <= TOTAL_PAGES && unread.length < prev.dailyGoal; p++) {
        if (!prev.pagesRead.includes(p)) {
          unread.push(p);
        }
      }
      if (unread.length === 0) return prev;
      const pagesRead = [...prev.pagesRead, ...unread];
      const readDates = prev.readDates.includes(today)
        ? prev.readDates
        : [...prev.readDates, today];
      return { ...prev, pagesRead, readDates };
    });
  }, [updateData]);

  const setDailyGoal = useCallback((goal: number) => {
    const clamped = Math.max(1, Math.min(50, goal));
    updateData((prev) => ({ ...prev, dailyGoal: clamped }));
    setGoalInput(String(clamped));
    setShowGoalEdit(false);
  }, [updateData]);

  const resetProgress = useCallback(() => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all progress? This cannot be undone."
    );
    if (confirmed) {
      const fresh: KhatmahData = { pagesRead: [], dailyGoal: data.dailyGoal, readDates: [] };
      saveData(fresh);
      setData(fresh);
    }
  }, [data.dailyGoal]);

  const toggleRamadanDay = useCallback((dayIndex: number) => {
    setRamadanProgress((prev) => {
      const next = [...prev];
      next[dayIndex] = !next[dayIndex];
      saveRamadanProgress(next);
      return next;
    });
  }, []);

  const resetRamadanProgress = useCallback(() => {
    const confirmed = window.confirm(
      "Are you sure you want to reset your Ramadan progress? This cannot be undone."
    );
    if (confirmed) {
      const fresh = new Array(30).fill(false);
      saveRamadanProgress(fresh);
      setRamadanProgress(fresh);
    }
  }, []);

  // Derived values
  const totalPagesRead = data.pagesRead.length;
  const percentage = Math.round((totalPagesRead / TOTAL_PAGES) * 100);
  const { current: currentStreak, longest: longestStreak } = computeStreak(data.readDates);
  const last30 = getLast30Days();
  const readDateSet = new Set(data.readDates);

  // Ramadan derived values
  const ramadanDaysCompleted = ramadanProgress.filter(Boolean).length;
  const ramadanPercentage = Math.round((ramadanDaysCompleted / 30) * 100);
  const pagesReadSet = new Set(data.pagesRead);
  // Find the user's current reading position (first unread page)
  const currentReadingPage = (() => {
    for (let p = 1; p <= TOTAL_PAGES; p++) {
      if (!pagesReadSet.has(p)) return p;
    }
    return TOTAL_PAGES;
  })();

  // SVG progress ring
  const ringRadius = 90;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (percentage / 100) * ringCircumference;

  // Days remaining at current rate
  const pagesRemaining = TOTAL_PAGES - totalPagesRead;
  const daysRemaining = data.dailyGoal > 0 ? Math.ceil(pagesRemaining / data.dailyGoal) : 0;

  if (!mounted) {
    return (
      <div style={{ background: "#0d0b08", minHeight: "100vh" }} />
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&family=Amiri:wght@400;700&display=swap');

        @font-face {
          font-family: 'PDMS Saleem QuranFont';
          src: url('/fonts/pdms-saleem-quranfont.woff') format('woff'),
               url('/fonts/pdms-saleem-quranfont.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        .kh {
          --gold: #B8983F;
          --gold-light: #D4B85A;
          --gold-deep: #8B6914;
          --gold-pale: #E8D5A0;
          --base: #0d0b08;
          --surface: #131110;
          --surface2: #1a1714;
          --text: #e5e5e5;
          --text-muted: #8a8078;
          --border: rgba(184, 152, 63, 0.12);
          --border-subtle: rgba(255, 255, 255, 0.06);
          --accent: #D4B44A;
          background: var(--base);
          color: var(--text);
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 400;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        .kh-heading {
          font-family: 'EB Garamond', Georgia, serif;
        }

        .kh-glow {
          position: fixed; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 900px; height: 900px; border-radius: 50%;
          background: radial-gradient(circle, rgba(184,152,63,0.09) 0%, rgba(139,105,20,0.04) 30%, rgba(184,152,63,0.015) 50%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .kh::after {
          content: ''; position: fixed; inset: 0;
          opacity: 0.025; pointer-events: none; z-index: 9999;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 256px 256px;
        }

        .kh-nav {
          background: rgba(13, 11, 8, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(184, 152, 63, 0.06);
        }

        .kh-gold-gradient {
          background: linear-gradient(135deg, #8B6914 10%, #B8983F 40%, #D4B85A 60%, #B8983F 90%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .kh-gold-shimmer {
          background: linear-gradient(135deg, #8B6914 10%, #B8983F 35%, #D4B85A 50%, #E8D5A0 55%, #D4B85A 65%, #B8983F 80%, #8B6914 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: kh-shimmer 6s ease-in-out infinite;
        }

        @keyframes kh-shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .kh-card {
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          position: relative;
          transition: all 0.2s ease-out;
        }
        .kh-card:hover {
          border-color: rgba(184, 152, 63, 0.15);
        }

        .kh-ring-container {
          position: relative;
          width: 220px; height: 220px;
          margin: 0 auto;
        }
        .kh-ring-svg {
          transform: rotate(-90deg);
          width: 100%; height: 100%;
        }
        .kh-ring-bg {
          fill: none;
          stroke: rgba(184, 152, 63, 0.08);
          stroke-width: 8;
        }
        .kh-ring-progress {
          fill: none;
          stroke: url(#kh-ring-grad);
          stroke-width: 8;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .kh-ring-center {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        .kh-ring-pct {
          font-family: 'EB Garamond', serif;
          font-size: 48px; font-weight: 500;
          line-height: 1;
        }
        .kh-ring-label {
          font-size: 12px; color: var(--text-muted);
          margin-top: 4px; letter-spacing: 0.06em;
        }

        .kh-stat-card {
          text-align: center; padding: 24px 16px;
        }
        .kh-stat-num {
          font-family: 'EB Garamond', serif;
          font-size: 32px; font-weight: 500;
          line-height: 1; margin-bottom: 6px;
        }
        .kh-stat-label {
          font-size: 11px; color: var(--text-muted);
          letter-spacing: 0.08em; text-transform: uppercase;
        }

        .kh-calendar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }
        .kh-cal-header {
          font-size: 10px; color: var(--text-muted);
          text-align: center; padding-bottom: 4px;
          letter-spacing: 0.04em;
        }
        .kh-cal-day {
          aspect-ratio: 1; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; color: rgba(184, 152, 63, 0.25);
          background: rgba(184, 152, 63, 0.03);
          border: 1px solid rgba(184, 152, 63, 0.06);
          transition: all 0.2s;
        }
        .kh-cal-day.active {
          background: rgba(184, 152, 63, 0.15);
          border-color: rgba(184, 152, 63, 0.30);
          color: #D4B85A;
          box-shadow: 0 0 12px rgba(184, 152, 63, 0.10);
        }
        .kh-cal-day.today {
          border-color: rgba(184, 152, 63, 0.45);
        }

        .kh-btn-filled {
          background: linear-gradient(135deg, #B8983F, #9A7B2F);
          color: #0d0b08;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 12px 28px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease-out;
          box-shadow: 0 0 0 0 rgba(184, 152, 63, 0);
        }
        .kh-btn-filled:hover {
          box-shadow: 0 0 24px rgba(184, 152, 63, 0.25);
          transform: translateY(-1px);
        }

        .kh-btn-ghost {
          border: 1px solid rgba(184, 152, 63, 0.35);
          color: var(--gold);
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 10px 24px;
          border-radius: 12px;
          background: none;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s ease-out;
        }
        .kh-btn-ghost:hover {
          background: rgba(184, 152, 63, 0.08);
          border-color: rgba(184, 152, 63, 0.55);
        }

        .kh-btn-danger {
          border: 1px solid rgba(220, 80, 80, 0.25);
          color: rgba(220, 80, 80, 0.65);
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 8px 20px;
          border-radius: 10px;
          background: none;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease-out;
        }
        .kh-btn-danger:hover {
          background: rgba(220, 80, 80, 0.08);
          border-color: rgba(220, 80, 80, 0.45);
          color: rgba(220, 80, 80, 0.85);
        }

        .kh-goal-input {
          background: rgba(184, 152, 63, 0.06);
          border: 1px solid rgba(184, 152, 63, 0.20);
          color: var(--text);
          font-family: 'EB Garamond', serif;
          font-size: 18px;
          width: 64px; text-align: center;
          padding: 6px 0; border-radius: 8px;
          outline: none; transition: border-color 0.2s;
        }
        .kh-goal-input:focus {
          border-color: rgba(184, 152, 63, 0.45);
        }

        .kh-divider {
          display: flex; align-items: center;
          justify-content: center; gap: 16px;
        }
        .kh-divider::before, .kh-divider::after {
          content: ''; height: 1px; flex: 1;
          background: linear-gradient(90deg, transparent, rgba(184, 152, 63, 0.18));
        }
        .kh-divider::after {
          background: linear-gradient(90deg, rgba(184, 152, 63, 0.18), transparent);
        }

        .kh-line {
          height: 1px;
          background: rgba(184, 152, 63, 0.08);
        }

        .kh-nav-btn {
          background: none; border: none; cursor: pointer;
          color: var(--text-muted); padding: 6px;
          border-radius: 8px; transition: color 0.15s, background 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .kh-nav-btn:hover {
          color: var(--gold); background: rgba(184, 152, 63, 0.08);
        }

        .kh-tab-bar {
          display: flex;
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          padding: 4px;
          gap: 4px;
        }
        .kh-tab {
          flex: 1;
          padding: 10px 20px;
          border-radius: 10px;
          border: none;
          background: none;
          color: var(--text-muted);
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.2s ease-out;
          text-align: center;
        }
        .kh-tab:hover {
          color: var(--text);
          background: rgba(184, 152, 63, 0.04);
        }
        .kh-tab.active {
          background: rgba(184, 152, 63, 0.12);
          color: #D4B85A;
          border: 1px solid rgba(184, 152, 63, 0.20);
        }

        .kh-ramadan-bar-track {
          width: 100%;
          height: 8px;
          background: rgba(184, 152, 63, 0.08);
          border-radius: 4px;
          overflow: hidden;
        }
        .kh-ramadan-bar-fill {
          height: 100%;
          border-radius: 4px;
          background: linear-gradient(90deg, #8B6914, #B8983F, #D4B85A);
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .kh-day-card {
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          padding: 20px;
          transition: all 0.2s ease-out;
          position: relative;
        }
        .kh-day-card:hover {
          border-color: rgba(184, 152, 63, 0.18);
          background: var(--surface2);
        }
        .kh-day-card.completed {
          border-color: rgba(184, 152, 63, 0.25);
          background: rgba(184, 152, 63, 0.04);
        }

        .kh-checkbox {
          width: 22px; height: 22px;
          border-radius: 6px;
          border: 1.5px solid rgba(184, 152, 63, 0.35);
          background: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease-out;
          flex-shrink: 0;
          padding: 0;
        }
        .kh-checkbox:hover {
          border-color: rgba(184, 152, 63, 0.6);
          background: rgba(184, 152, 63, 0.06);
        }
        .kh-checkbox.checked {
          background: linear-gradient(135deg, #B8983F, #9A7B2F);
          border-color: #B8983F;
        }

        .kh-badge-current {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: rgba(184, 152, 63, 0.15);
          color: #D4B85A;
          border: 1px solid rgba(184, 152, 63, 0.25);
        }

        .kh-start-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid rgba(184, 152, 63, 0.25);
          background: none;
          color: var(--gold);
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.2s ease-out;
          text-decoration: none;
        }
        .kh-start-btn:hover {
          background: rgba(184, 152, 63, 0.08);
          border-color: rgba(184, 152, 63, 0.45);
        }

        @media (max-width: 640px) {
          .kh-ring-container { width: 180px; height: 180px; }
          .kh-ring-pct { font-size: 38px; }
          .kh-stat-num { font-size: 26px; }
          .kh-day-card { padding: 16px; }
        }
      `}</style>

      <div className="kh">
        <div className="kh-glow" />

        {/* Navigation */}
        <nav className="kh-nav fixed top-0 left-0 right-0 z-50">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="#B8983F" strokeWidth="0.7" opacity="0.5" />
                  <circle cx="12" cy="12" r="4" stroke="#B8983F" strokeWidth="0.5" opacity="0.35" />
                </svg>
                <span className="kh-heading" style={{ color: "#B8983F", fontWeight: 500, fontSize: 18 }}>The Quran Guide</span>
                <span className="hidden sm:inline" style={{ color: 'rgba(184,152,63,0.5)', fontFamily: "'Amiri', serif", fontSize: 14, direction: 'rtl', lineHeight: 1 }}>دليل القرآن</span>
              </a>
            </div>
            <div className="hidden md:flex items-center gap-10">
              {[
                { label: 'Home', href: '/' },
                { label: 'Read', href: '/read' },
                { label: 'Insights', href: '/insights' },
                { label: 'Learn', href: '/learn' },
                { label: 'Quiz', href: '/quiz' },
                { label: 'Duas', href: '/dua' },
                { label: 'Khatmah', href: '/khatmah' },
                { label: 'Search', href: '/search' },
              ].map((item) => (
                <a key={item.label} href={item.href} className="text-sm" style={{ color: item.href === '/khatmah' ? '#D4B85A' : '#8a8078', textDecoration: 'none', transition: 'color 0.15s' }}>
                  {item.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href="/read" className="hidden sm:inline-block" style={{ background: "linear-gradient(135deg, #B8983F, #9A7B2F)", color: "#0d0b08", padding: "8px 20px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: 600, fontFamily: "'Inter', sans-serif", letterSpacing: "0.04em" }}>
                Open Reader
              </a>
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#B8983F' }}
                aria-label="Toggle menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {mobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
                </svg>
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden" style={{ background: 'rgba(13,11,8,0.98)', borderTop: '1px solid rgba(184,152,63,0.06)', padding: '12px 24px' }}>
              {[
                { label: 'Home', href: '/' },
                { label: 'Read', href: '/read' },
                { label: 'Insights', href: '/insights' },
                { label: 'Learn', href: '/learn' },
                { label: 'Quiz', href: '/quiz' },
                { label: 'Duas', href: '/dua' },
                { label: 'Khatmah', href: '/khatmah' },
                { label: 'Search', href: '/search' },
              ].map((item) => (
                <a key={item.label} href={item.href} className="block py-2 text-sm" style={{ color: item.href === '/khatmah' ? '#D4B85A' : '#8a8078', textDecoration: 'none' }}>
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </nav>

        {/* Main content */}
        <main className="relative z-10 pt-24 pb-20 px-6">
          <div className="max-w-4xl mx-auto">

            {/* Page title */}
            <div className="text-center mb-12">
              <div className="kh-divider max-w-xs mx-auto mb-6">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" stroke="#B8983F" strokeWidth="0.5" opacity="0.3" />
                </svg>
              </div>
              <h1 className="kh-heading kh-gold-shimmer text-4xl md:text-5xl mb-3" style={{ fontWeight: 400 }}>
                Khatmah Tracker
              </h1>
              <p className="text-sm" style={{ color: "#8a8078" }}>
                Track your journey through the complete Quran
              </p>
            </div>

            {/* Tab Toggle */}
            <div className="kh-tab-bar max-w-sm mx-auto mb-10">
              <button
                className={`kh-tab ${activeTab === "progress" ? "active" : ""}`}
                onClick={() => setActiveTab("progress")}
              >
                My Progress
              </button>
              <button
                className={`kh-tab ${activeTab === "ramadan" ? "active" : ""}`}
                onClick={() => setActiveTab("ramadan")}
              >
                Ramadan Plan
              </button>
            </div>

            {activeTab === "progress" && (<>
            {/* Progress Ring */}
            <div className="kh-card p-8 md:p-12 mb-6">
              <div className="kh-ring-container">
                <svg className="kh-ring-svg" viewBox="0 0 220 220">
                  <defs>
                    <linearGradient id="kh-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B6914" />
                      <stop offset="40%" stopColor="#B8983F" />
                      <stop offset="60%" stopColor="#D4B85A" />
                      <stop offset="100%" stopColor="#B8983F" />
                    </linearGradient>
                  </defs>
                  <circle
                    className="kh-ring-bg"
                    cx="110" cy="110" r={ringRadius}
                  />
                  <circle
                    className="kh-ring-progress"
                    cx="110" cy="110" r={ringRadius}
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringOffset}
                  />
                </svg>
                <div className="kh-ring-center">
                  <div className="kh-ring-pct kh-gold-gradient">
                    {percentage}%
                  </div>
                  <div className="kh-ring-label">complete</div>
                </div>
              </div>

              <div className="text-center mt-8">
                <p className="kh-heading text-lg" style={{ color: "#D4B85A", fontWeight: 500 }}>
                  {totalPagesRead} of {TOTAL_PAGES} pages
                </p>
                {pagesRemaining > 0 && data.dailyGoal > 0 && (
                  <p className="text-xs mt-2" style={{ color: "#8a8078" }}>
                    ~{daysRemaining} days remaining at {data.dailyGoal} pages/day
                  </p>
                )}
                {pagesRemaining === 0 && (
                  <p className="kh-heading text-sm mt-2" style={{ color: "#D4B85A" }}>
                    Masha&apos;Allah! Khatmah complete!
                  </p>
                )}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="kh-card kh-stat-card">
                <div className="kh-stat-num kh-gold-gradient">{totalPagesRead}</div>
                <div className="kh-stat-label">Pages Read</div>
              </div>
              <div className="kh-card kh-stat-card">
                <div className="kh-stat-num kh-gold-gradient">{currentStreak}</div>
                <div className="kh-stat-label">Current Streak</div>
              </div>
              <div className="kh-card kh-stat-card">
                <div className="kh-stat-num kh-gold-gradient">{longestStreak}</div>
                <div className="kh-stat-label">Longest Streak</div>
              </div>
              <div className="kh-card kh-stat-card">
                <div className="kh-stat-num kh-gold-gradient">
                  {Math.floor(totalPagesRead / TOTAL_PAGES)}
                </div>
                <div className="kh-stat-label">Completions</div>
              </div>
            </div>

            {/* Streak Calendar + Daily Goal side by side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

              {/* Streak Calendar */}
              <div className="kh-card p-6 md:col-span-2">
                <h2 className="kh-heading text-lg mb-4" style={{ fontWeight: 500, color: "#D4B85A" }}>
                  Last 30 Days
                </h2>
                <div className="kh-calendar">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={i} className="kh-cal-header">{d}</div>
                  ))}
                  {/* Offset cells to align first day to correct weekday */}
                  {(() => {
                    const firstDay = new Date(last30[0]);
                    const dayOfWeek = firstDay.getDay();
                    const offsets = [];
                    for (let i = 0; i < dayOfWeek; i++) {
                      offsets.push(<div key={`off-${i}`} />);
                    }
                    return offsets;
                  })()}
                  {last30.map((date) => {
                    const isActive = readDateSet.has(date);
                    const isToday = date === getToday();
                    const dayNum = new Date(date).getDate();
                    return (
                      <div
                        key={date}
                        className={`kh-cal-day ${isActive ? "active" : ""} ${isToday ? "today" : ""}`}
                        title={date}
                      >
                        {dayNum}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Daily Goal */}
              <div className="kh-card p-6 flex flex-col">
                <h2 className="kh-heading text-lg mb-4" style={{ fontWeight: 500, color: "#D4B85A" }}>
                  Daily Goal
                </h2>
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  {showGoalEdit ? (
                    <div className="flex flex-col items-center gap-3">
                      <input
                        type="number"
                        className="kh-goal-input"
                        min={1}
                        max={50}
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const val = parseInt(goalInput);
                            if (!isNaN(val)) setDailyGoal(val);
                          }
                        }}
                        autoFocus
                      />
                      <span className="text-xs" style={{ color: "#8a8078" }}>pages per day</span>
                      <div className="flex gap-2">
                        <button
                          className="kh-btn-ghost"
                          style={{ padding: "6px 16px", fontSize: 12 }}
                          onClick={() => {
                            const val = parseInt(goalInput);
                            if (!isNaN(val)) setDailyGoal(val);
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="kh-btn-ghost"
                          style={{ padding: "6px 16px", fontSize: 12, borderColor: "rgba(184,152,63,0.15)", color: "#8a8078" }}
                          onClick={() => {
                            setGoalInput(String(data.dailyGoal));
                            setShowGoalEdit(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="kh-heading kh-gold-gradient" style={{ fontSize: 56, fontWeight: 400, lineHeight: 1 }}>
                        {data.dailyGoal}
                      </div>
                      <p className="text-xs mt-2 mb-4" style={{ color: "#8a8078" }}>
                        pages per day
                      </p>
                      <button
                        className="kh-btn-ghost"
                        style={{ padding: "6px 18px", fontSize: 12 }}
                        onClick={() => setShowGoalEdit(true)}
                      >
                        Edit Goal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="kh-card p-6 mb-6">
              <h2 className="kh-heading text-lg mb-5" style={{ fontWeight: 500, color: "#D4B85A" }}>
                Quick Actions
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <button className="kh-btn-filled" onClick={markTodayPages}>
                  Mark Today&apos;s Pages ({data.dailyGoal})
                </button>
                <button
                  className="kh-btn-ghost"
                  onClick={() => {
                    const nextUnread = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).find(
                      (p) => !data.pagesRead.includes(p)
                    );
                    if (nextUnread) markPageRead(nextUnread);
                  }}
                >
                  Mark Next Page
                </button>
                <a href="/read" className="kh-btn-ghost" style={{ textDecoration: "none", display: "inline-block" }}>
                  Open Reader
                </a>
              </div>
            </div>

            {/* Reset section */}
            <div className="text-center">
              <div className="kh-line mb-8" />
              <button className="kh-btn-danger" onClick={resetProgress}>
                Reset All Progress
              </button>
              <p className="text-xs mt-3" style={{ color: "rgba(138, 128, 120, 0.5)" }}>
                This will clear all reading progress and streaks
              </p>
            </div>
            </>)}

            {activeTab === "ramadan" && (<>
            {/* Ramadan Progress Summary */}
            <div className="kh-card p-8 md:p-10 mb-6">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.82-.5-3.53-1.36-5" stroke="#B8983F" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M17.5 2.5C15 5 14 8 14.5 12c-4-.5-7-1.5-9.5-4" stroke="#D4B85A" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  </svg>
                  <h2 className="kh-heading kh-gold-gradient text-2xl md:text-3xl" style={{ fontWeight: 400 }}>
                    Ramadan Khatmah Plan
                  </h2>
                </div>
                <p className="text-sm" style={{ color: "#8a8078" }}>
                  Complete the entire Quran in 30 days — one Juz per day
                </p>
                <div style={{ width: "100%", maxWidth: 400 }} className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="kh-heading" style={{ color: "#D4B85A", fontSize: 16, fontWeight: 500 }}>
                      {ramadanDaysCompleted}/30 days completed
                    </span>
                    <span className="kh-heading kh-gold-gradient" style={{ fontSize: 18, fontWeight: 500 }}>
                      {ramadanPercentage}%
                    </span>
                  </div>
                  <div className="kh-ramadan-bar-track">
                    <div className="kh-ramadan-bar-fill" style={{ width: `${ramadanPercentage}%` }} />
                  </div>
                </div>
                {ramadanDaysCompleted === 30 && (
                  <p className="kh-heading text-sm mt-2" style={{ color: "#D4B85A" }}>
                    Masha&apos;Allah! You have completed the Quran this Ramadan!
                  </p>
                )}
              </div>
            </div>

            {/* 30-Day Cards */}
            <div className="flex flex-col gap-3">
              {ramadanPlan.map((dayInfo, idx) => {
                const isCompleted = ramadanProgress[idx];
                const isCurrent = currentReadingPage >= dayInfo.startPage && currentReadingPage <= dayInfo.endPage;
                const surahDisplay = dayInfo.surahs.length > 4
                  ? dayInfo.surahs.slice(0, 3).join(", ") + ` +${dayInfo.surahs.length - 3} more`
                  : dayInfo.surahs.join(", ");
                return (
                  <div
                    key={dayInfo.day}
                    className={`kh-day-card ${isCompleted ? "completed" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        className={`kh-checkbox ${isCompleted ? "checked" : ""}`}
                        onClick={() => toggleRamadanDay(idx)}
                        aria-label={`Mark Day ${dayInfo.day} as ${isCompleted ? "incomplete" : "complete"}`}
                        style={{ marginTop: 2 }}
                      >
                        {isCompleted && (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7.5L5.5 10L11 4" stroke="#0d0b08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="kh-heading" style={{
                            fontSize: 17,
                            fontWeight: 500,
                            color: isCompleted ? "#D4B85A" : "#e5e5e5",
                            textDecoration: isCompleted ? "line-through" : "none",
                            textDecorationColor: "rgba(184, 152, 63, 0.3)",
                          }}>
                            Day {dayInfo.day} — Juz {dayInfo.juzNumber}
                          </span>
                          {isCurrent && !isCompleted && (
                            <span className="kh-badge-current">Current</span>
                          )}
                        </div>
                        <p className="text-xs mb-1" style={{ color: "#8a8078" }}>
                          Pages {dayInfo.startPage}–{dayInfo.endPage}
                        </p>
                        <p className="text-xs" style={{ color: "rgba(138, 128, 120, 0.7)", lineHeight: 1.5 }}>
                          {surahDisplay}
                        </p>
                      </div>

                      {/* Start Reading button */}
                      <a
                        href={`/read?page=${dayInfo.startPage}`}
                        className="kh-start-btn"
                        style={{ flexShrink: 0, marginTop: 2 }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" />
                          <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" />
                        </svg>
                        Start
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ramadan Reset */}
            <div className="text-center mt-8">
              <div className="kh-line mb-8" />
              <button className="kh-btn-danger" onClick={resetRamadanProgress}>
                Reset Ramadan Progress
              </button>
              <p className="text-xs mt-3" style={{ color: "rgba(138, 128, 120, 0.5)" }}>
                This will clear your Ramadan completion checkmarks
              </p>
            </div>
            </>)}

          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-12" style={{ borderTop: "1px solid rgba(184, 152, 63, 0.06)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs" style={{ color: "#8a8078" }}>&copy; 2026 The Quran Guide</p>
              <p style={{ fontFamily: "'PDMS Saleem QuranFont', 'Amiri', serif", fontSize: "14px", color: "rgba(184,152,63,0.25)", direction: "rtl" as const }}>
                رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
