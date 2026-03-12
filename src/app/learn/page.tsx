"use client";

import { useState, useEffect } from "react";

/* ─── Flashcard data ─── */
const FLASHCARDS = [
  { arabic: "كِتَابٌ", transliteration: "kitaab", meaning: "Book", root: "ك-ت-ب" },
  { arabic: "عِلْمٌ", transliteration: "'ilm", meaning: "Knowledge", root: "ع-ل-م" },
  { arabic: "نُورٌ", transliteration: "noor", meaning: "Light", root: "ن-و-ر" },
  { arabic: "صَبْرٌ", transliteration: "sabr", meaning: "Patience", root: "ص-ب-ر" },
  { arabic: "رَحْمَةٌ", transliteration: "rahmah", meaning: "Mercy", root: "ر-ح-م" },
  { arabic: "هُدًى", transliteration: "hudaa", meaning: "Guidance", root: "ه-د-ي" },
  { arabic: "قَلْبٌ", transliteration: "qalb", meaning: "Heart", root: "ق-ل-ب" },
  { arabic: "سَلَامٌ", transliteration: "salaam", meaning: "Peace", root: "س-ل-م" },
  { arabic: "شُكْرٌ", transliteration: "shukr", meaning: "Gratitude", root: "ش-ك-ر" },
  { arabic: "تَوْبَةٌ", transliteration: "tawbah", meaning: "Repentance", root: "ت-و-ب" },
  { arabic: "ذِكْرٌ", transliteration: "dhikr", meaning: "Remembrance", root: "ذ-ك-ر" },
  { arabic: "حَقٌّ", transliteration: "haqq", meaning: "Truth / Right", root: "ح-ق-ق" },
];

/* ─── Root word examples ─── */
const ROOT_EXAMPLES = [
  {
    root: "ك-ت-ب",
    meaning: "to write",
    derived: [
      { word: "كِتَابٌ", meaning: "Book", form: "Noun (masdar)" },
      { word: "كَاتِبٌ", meaning: "Writer / Scribe", form: "Active participle" },
      { word: "مَكْتُوبٌ", meaning: "Written / Decreed", form: "Passive participle" },
      { word: "كُتُبٌ", meaning: "Books", form: "Plural noun" },
      { word: "مَكْتَبَةٌ", meaning: "Library", form: "Noun of place" },
      { word: "كَتَبَ", meaning: "He wrote", form: "Past tense (Form I)" },
    ],
  },
  {
    root: "ع-ل-م",
    meaning: "to know",
    derived: [
      { word: "عِلْمٌ", meaning: "Knowledge", form: "Noun (masdar)" },
      { word: "عَالِمٌ", meaning: "Scholar / Knower", form: "Active participle" },
      { word: "مَعْلُومٌ", meaning: "Known", form: "Passive participle" },
      { word: "عَلَّمَ", meaning: "He taught", form: "Form II verb" },
      { word: "تَعَلَّمَ", meaning: "He learned", form: "Form V verb" },
      { word: "عَلِيمٌ", meaning: "All-Knowing", form: "Intensive adjective" },
    ],
  },
  {
    root: "ر-ح-م",
    meaning: "to show mercy",
    derived: [
      { word: "رَحْمَةٌ", meaning: "Mercy", form: "Noun (masdar)" },
      { word: "رَحِيمٌ", meaning: "Most Merciful", form: "Intensive adjective" },
      { word: "رَحْمَانٌ", meaning: "Most Gracious", form: "Intensive adjective" },
      { word: "أَرْحَامٌ", meaning: "Wombs / Kinship ties", form: "Plural noun" },
      { word: "رَحِمَ", meaning: "He showed mercy", form: "Past tense (Form I)" },
      { word: "مَرْحُومٌ", meaning: "One shown mercy", form: "Passive participle" },
    ],
  },
];

/* ─── Grammar tag examples ─── */
const GRAMMAR_EXAMPLES = [
  {
    arabic: "بِسْمِ",
    breakdown: [
      { part: "بِ", tag: "Preposition (Harf Jarr)", color: "#6BA3D6" },
      { part: "ـسْمِ", tag: "Noun (Ism), Genitive (Majroor)", color: "#D4B44A" },
    ],
    meaning: "In the name of",
  },
  {
    arabic: "ٱللَّهِ",
    breakdown: [
      { part: "ٱللَّهِ", tag: "Proper Noun (Ism 'Alam), Genitive", color: "#D4B44A" },
    ],
    meaning: "Allah",
  },
  {
    arabic: "ٱلرَّحْمَـٰنِ",
    breakdown: [
      { part: "ٱلْ", tag: "Definite Article (Lam at-Ta'reef)", color: "#8BC6A0" },
      { part: "رَّحْمَـٰنِ", tag: "Adjective (Sifah), Genitive, Intensive form (fa'laan)", color: "#D4B44A" },
    ],
    meaning: "The Most Gracious",
  },
  {
    arabic: "ٱلرَّحِيمِ",
    breakdown: [
      { part: "ٱلْ", tag: "Definite Article (Lam at-Ta'reef)", color: "#8BC6A0" },
      { part: "رَّحِيمِ", tag: "Adjective (Sifah), Genitive, Intensive form (fa'eel)", color: "#D4B44A" },
    ],
    meaning: "The Most Merciful",
  },
  {
    arabic: "يَعْلَمُ",
    breakdown: [
      { part: "يَـ", tag: "Prefix: 3rd person masculine singular", color: "#C97DB6" },
      { part: "ـعْلَمُ", tag: "Imperfect Verb (Fi'l Mudari'), Indicative (Marfoo')", color: "#E8925B" },
    ],
    meaning: "He knows",
  },
  {
    arabic: "أَنزَلْنَا",
    breakdown: [
      { part: "أَ", tag: "Prefix: Form IV (transitive causative)", color: "#C97DB6" },
      { part: "نزَلْ", tag: "Perfect Verb (Fi'l Maadi), Root: ن-ز-ل", color: "#E8925B" },
      { part: "نَا", tag: "Suffix: 1st person plural pronoun (We)", color: "#C97DB6" },
    ],
    meaning: "We sent down",
  },
];

type VocabProgress = Record<string, { known: boolean; reviewed: number }>;

function loadProgress(): VocabProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("tqg-vocab");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(p: VocabProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem("tqg-vocab", JSON.stringify(p));
}

/* ─── SM-2 Spaced Repetition ─── */
type SM2Card = {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
};

type SM2Data = Record<string, SM2Card>;

function defaultSM2Card(): SM2Card {
  return { easeFactor: 2.5, interval: 0, repetitions: 0, nextReview: 0 };
}

function loadSM2Data(): SM2Data {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("tqg-sm2-data");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSM2Data(data: SM2Data) {
  if (typeof window === "undefined") return;
  localStorage.setItem("tqg-sm2-data", JSON.stringify(data));
}

function sm2Update(card: SM2Card, quality: number): SM2Card {
  let { easeFactor, interval, repetitions } = card;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
    repetitions++;
  }

  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;
  return { easeFactor, interval, repetitions, nextReview };
}

function getDueCards(sm2: SM2Data): number[] {
  const now = Date.now();
  const dueIndices: number[] = [];
  const notDueIndices: number[] = [];
  FLASHCARDS.forEach((card, i) => {
    const key = card.arabic;
    const data = sm2[key];
    if (!data || data.nextReview <= now) {
      dueIndices.push(i);
    } else {
      notDueIndices.push(i);
    }
  });
  return [...dueIndices, ...notDueIndices];
}

export default function LearnPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"root" | "vocab" | "grammar" | null>(null);
  const [selectedRoot, setSelectedRoot] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState<VocabProgress>({});
  const [sm2Data, setSm2Data] = useState<SM2Data>({});
  const [cardOrder, setCardOrder] = useState<number[]>(() => FLASHCARDS.map((_, i) => i));
  const [orderPos, setOrderPos] = useState(0);

  useEffect(() => {
    setProgress(loadProgress());
    const loaded = loadSM2Data();
    setSm2Data(loaded);
    const order = getDueCards(loaded);
    setCardOrder(order);
    setOrderPos(0);
  }, []);

  const cardIdx = cardOrder[orderPos] ?? 0;

  const dueCount = FLASHCARDS.filter((card) => {
    const data = sm2Data[card.arabic];
    return !data || data.nextReview <= Date.now();
  }).length;

  const rateCard = (quality: number) => {
    const key = FLASHCARDS[cardIdx].arabic;
    const current = sm2Data[key] || defaultSM2Card();
    const updated = sm2Update(current, quality);
    const newSM2 = { ...sm2Data, [key]: updated };
    setSm2Data(newSM2);
    saveSM2Data(newSM2);

    // Also update the legacy progress for the progress bar
    const known = quality >= 3;
    const updatedProgress = { ...progress, [key]: { known, reviewed: (progress[key]?.reviewed || 0) + 1 } };
    setProgress(updatedProgress);
    saveProgress(updatedProgress);

    setFlipped(false);
    setTimeout(() => {
      // Recompute due order and advance
      const newOrder = getDueCards(newSM2);
      setCardOrder(newOrder);
      // Move to next position, wrapping if needed
      setOrderPos((prev) => {
        const next = prev + 1;
        return next >= newOrder.length ? 0 : next;
      });
    }, 200);
  };

  const knownCount = Object.values(progress).filter((v) => v.known).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500&family=Amiri:wght@400;700&display=swap');

        @font-face {
          font-family: 'PDMS Saleem QuranFont';
          src: url('/fonts/pdms-saleem-quranfont.woff') format('woff'),
               url('/fonts/pdms-saleem-quranfont.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        .learn-page {
          --gold: #B8983F;
          --gold-light: #D4B85A;
          --gold-deep: #8B6914;
          --gold-pale: #E8D5A0;
          --base: #0d0b08;
          --surface: #131110;
          --surface2: #1a1714;
          --text: #e5e5e5;
          --text-muted: #8a8078;
          --border: rgba(184,152,63,0.12);
          --border-subtle: rgba(255,255,255,0.06);
          background: var(--base);
          color: var(--text);
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 400;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        .learn-heading { font-family: 'EB Garamond', serif; }
        .learn-arabic {
          font-family: 'PDMS Saleem QuranFont', 'Amiri', serif;
          direction: rtl;
          line-height: 2.2;
        }

        .learn-gold-shimmer {
          background: linear-gradient(135deg, #8B6914 10%, #B8983F 35%, #D4B85A 50%, #E8D5A0 55%, #D4B85A 65%, #B8983F 80%, #8B6914 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: learn-shimmer 6s ease-in-out infinite;
        }
        @keyframes learn-shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .learn-gold-gradient {
          background: linear-gradient(135deg, #8B6914 10%, #B8983F 40%, #D4B85A 60%, #B8983F 90%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .learn-glow {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 900px; height: 900px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,152,63,0.09) 0%, rgba(139,105,20,0.04) 30%, rgba(184,152,63,0.015) 50%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .learn-nav {
          background: rgba(13,11,8,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .learn-card {
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          position: relative;
          transition: all 0.25s ease-out;
          cursor: pointer;
          overflow: hidden;
        }
        .learn-card:hover {
          border-color: rgba(184,152,63,0.2);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(184,152,63,0.08);
        }

        .learn-card-active {
          border-color: rgba(184,152,63,0.3) !important;
          box-shadow: 0 0 32px rgba(184,152,63,0.1);
        }

        .learn-btn-filled {
          background: linear-gradient(135deg, #B8983F, #9A7B2F);
          color: #0d0b08;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: all 0.2s ease-out;
          border: none;
          cursor: pointer;
          box-shadow: 0 0 0 0 rgba(184,152,63,0);
        }
        .learn-btn-filled:hover {
          box-shadow: 0 0 24px rgba(184,152,63,0.25);
          transform: translateY(-1px);
        }

        .learn-btn-ghost {
          border: 1px solid rgba(184,152,63,0.35);
          color: var(--gold);
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          letter-spacing: 0.04em;
          transition: all 0.2s ease-out;
          background: none;
          cursor: pointer;
        }
        .learn-btn-ghost:hover {
          background: rgba(184,152,63,0.08);
          border-color: rgba(184,152,63,0.55);
        }

        .learn-diamond {
          width: 40px; height: 40px;
          border: 1px solid rgba(184,152,63,0.2);
          transform: rotate(45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.2s ease;
        }
        .learn-diamond > * { transform: rotate(-45deg); }
        .learn-card:hover .learn-diamond { border-color: rgba(184,152,63,0.4); }

        .learn-line { height: 1px; background: var(--border); }
        .learn-line-subtle { height: 1px; background: rgba(184,152,63,0.06); }

        .learn-divider {
          display: flex; align-items: center; justify-content: center; gap: 16px;
        }
        .learn-divider::before, .learn-divider::after {
          content: ''; height: 1px; flex: 1;
          background: linear-gradient(90deg, transparent, rgba(184,152,63,0.18));
        }
        .learn-divider::after {
          background: linear-gradient(90deg, rgba(184,152,63,0.18), transparent);
        }

        /* Flashcard flip */
        .flashcard-container { perspective: 800px; }
        .flashcard-inner {
          position: relative;
          width: 100%;
          min-height: 280px;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .flashcard-inner.flipped { transform: rotateY(180deg); }
        .flashcard-front, .flashcard-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px;
        }
        .flashcard-front {
          background: linear-gradient(160deg, var(--surface) 0%, rgba(26,23,20,1) 100%);
          border: 1px solid rgba(184,152,63,0.15);
        }
        .flashcard-back {
          background: linear-gradient(160deg, rgba(26,23,20,1) 0%, var(--surface) 100%);
          border: 1px solid rgba(184,152,63,0.2);
          transform: rotateY(180deg);
        }

        .learn-noise::after {
          content: '';
          position: fixed; inset: 0;
          opacity: 0.025; pointer-events: none; z-index: 9999;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 256px 256px;
        }

        .learn-tag {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .grammar-word-card {
          background: rgba(184,152,63,0.03);
          border: 1px solid rgba(184,152,63,0.10);
          border-radius: 12px;
          padding: 20px 24px;
          transition: all 0.2s;
        }
        .grammar-word-card:hover {
          border-color: rgba(184,152,63,0.2);
          background: rgba(184,152,63,0.05);
        }

        .root-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 16px;
          border: 1px solid rgba(184,152,63,0.15);
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
        }
        .root-chip:hover { border-color: rgba(184,152,63,0.35); background: rgba(184,152,63,0.06); }
        .root-chip.active {
          border-color: rgba(184,152,63,0.5);
          background: rgba(184,152,63,0.1);
        }

        .progress-bar-bg {
          height: 4px;
          background: rgba(184,152,63,0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #8B6914, #D4B85A);
          border-radius: 2px;
          transition: width 0.3s ease;
        }
      `}</style>

      <div className="learn-page learn-noise">
        <div className="learn-glow" />

        {/* ═══ NAVIGATION ═══ */}
        <nav className="learn-nav fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="#B8983F" strokeWidth="0.7" opacity="0.5"/>
                <circle cx="12" cy="12" r="4" stroke="#B8983F" strokeWidth="0.5" opacity="0.35"/>
                <path d="M12 2L12 4M12 20L12 22M2 12L4 12M20 12L22 12M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="#B8983F" strokeWidth="0.5" opacity="0.3"/>
              </svg>
              <a href="/" className="learn-heading text-lg" style={{ color: '#B8983F', fontWeight: 500, textDecoration: 'none' }}>
                theQuranGuide
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
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm transition-colors duration-150"
                  style={{ color: item.href === '/learn' ? '#D4B85A' : '#8a8078', textDecoration: 'none' }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a href="/read" className="learn-btn-filled px-5 py-2 rounded-lg text-sm inline-block hidden sm:inline-block" style={{ textDecoration: 'none' }}>
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
                <a key={item.label} href={item.href} className="block py-2 text-sm" style={{ color: item.href === '/learn' ? '#D4B85A' : '#8a8078', textDecoration: 'none' }}>
                  {item.label}
                </a>
              ))}
            </div>
          )}
          <div className="learn-line-subtle" />
        </nav>

        {/* ═══ HERO ═══ */}
        <section className="pt-32 pb-16 px-6 text-center relative z-10">
          <div className="learn-divider max-w-sm mx-auto mb-6">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" stroke="#B8983F" strokeWidth="0.5" opacity="0.3"/>
            </svg>
          </div>
          <h1 className="learn-heading learn-gold-shimmer text-5xl md:text-7xl mb-4" style={{ fontWeight: 400 }}>
            Learn Arabic
          </h1>
          <p className="text-sm md:text-base max-w-lg mx-auto mb-6" style={{ color: '#8a8078' }}>
            Understand the language of the Quran through root analysis, vocabulary building, and grammatical insight.
          </p>
          <div className="learn-divider max-w-xs mx-auto">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" stroke="#B8983F" strokeWidth="0.5" opacity="0.25"/>
            </svg>
          </div>
        </section>

        {/* ═══ SECTION CARDS ═══ */}
        {!activeSection && (
          <section className="px-6 pb-32 relative z-10">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Root Word Analysis */}
              <div className="learn-card p-8" onClick={() => setActiveSection("root")}>
                <div className="learn-diamond mb-6">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8983F" strokeWidth="1.5">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    <path d="M8 7h8M8 11h6"/>
                  </svg>
                </div>
                <h3 className="learn-heading text-2xl mb-3" style={{ fontWeight: 500 }}>Root Word Analysis</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#8a8078' }}>
                  Explore how Arabic words derive from three-letter roots. See the morphological patterns that connect related words across the Quran.
                </p>
                <div style={{ background: 'rgba(184,152,63,0.04)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                  <p className="learn-arabic text-2xl mb-2" style={{ color: '#B8983F' }}>ك - ت - ب</p>
                  <p className="text-xs" style={{ color: '#8a8078' }}>Root: &quot;to write&quot; &rarr; book, writer, written, library...</p>
                </div>
              </div>

              {/* Vocabulary Flashcards */}
              <div className="learn-card p-8" onClick={() => setActiveSection("vocab")}>
                <div className="learn-diamond mb-6">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8983F" strokeWidth="1.5">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="M12 4v16M2 12h20"/>
                  </svg>
                </div>
                <h3 className="learn-heading text-2xl mb-3" style={{ fontWeight: 500 }}>Vocabulary Flashcards</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#8a8078' }}>
                  Build your Quranic vocabulary one word at a time. Interactive flashcards with Arabic, transliteration, and meaning. Progress is saved locally.
                </p>
                <div style={{ background: 'rgba(184,152,63,0.04)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                  <p className="learn-arabic text-xl mb-1" style={{ color: '#D4B85A' }}>رَحْمَةٌ</p>
                  <p className="text-xs" style={{ color: '#8a8078' }}>Tap to flip &middot; {FLASHCARDS.length} words</p>
                </div>
              </div>

              {/* Grammar Tags */}
              <div className="learn-card p-8" onClick={() => setActiveSection("grammar")}>
                <div className="learn-diamond mb-6">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8983F" strokeWidth="1.5">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44"/>
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44"/>
                    <path d="M5.5 8H12M12 8h6.5"/>
                  </svg>
                </div>
                <h3 className="learn-heading text-2xl mb-3" style={{ fontWeight: 500 }}>Grammar Tags</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#8a8078' }}>
                  See Arabic words broken down with grammatical analysis: nouns, verbs, particles, case markers, and morphological forms.
                </p>
                <div style={{ background: 'rgba(184,152,63,0.04)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <span className="learn-tag" style={{ background: 'rgba(107,163,214,0.12)', color: '#6BA3D6' }}>Harf</span>
                    <span className="learn-tag" style={{ background: 'rgba(212,180,74,0.12)', color: '#D4B44A' }}>Ism</span>
                    <span className="learn-tag" style={{ background: 'rgba(232,146,91,0.12)', color: '#E8925B' }}>Fi'l</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══ ROOT WORD ANALYSIS SECTION ═══ */}
        {activeSection === "root" && (
          <section className="px-6 pb-32 relative z-10">
            <div className="max-w-4xl mx-auto">
              <button
                className="learn-btn-ghost px-5 py-2 rounded-lg text-sm mb-10"
                onClick={() => setActiveSection(null)}
              >
                &larr; Back to sections
              </button>

              <h2 className="learn-heading learn-gold-gradient text-3xl md:text-4xl mb-3" style={{ fontWeight: 400 }}>
                Root Word Analysis
              </h2>
              <p className="text-sm mb-8" style={{ color: '#8a8078' }}>
                Most Arabic words derive from a three-letter root. Understanding roots unlocks the meaning of thousands of Quranic words.
              </p>

              {/* Root selector chips */}
              <div className="flex flex-wrap gap-3 mb-10">
                {ROOT_EXAMPLES.map((r, i) => (
                  <button
                    key={r.root}
                    className={`root-chip ${selectedRoot === i ? "active" : ""}`}
                    onClick={() => setSelectedRoot(i)}
                  >
                    <span className="learn-arabic" style={{ fontSize: '16px', color: selectedRoot === i ? '#D4B85A' : '#B8983F', lineHeight: 1 }}>
                      {r.root.split('-').join(' ')}
                    </span>
                    <span style={{ color: selectedRoot === i ? '#D4B85A' : '#8a8078' }}>
                      {r.meaning}
                    </span>
                  </button>
                ))}
              </div>

              {/* Derived words grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ROOT_EXAMPLES[selectedRoot].derived.map((d, i) => (
                  <div key={i} className="grammar-word-card">
                    <p className="learn-arabic text-3xl mb-2" style={{ color: '#F5E8B0', textAlign: 'center' }}>{d.word}</p>
                    <p className="learn-heading text-base text-center mb-1" style={{ color: '#e5e5e5', fontWeight: 500 }}>{d.meaning}</p>
                    <p className="text-xs text-center" style={{ color: '#8a8078' }}>{d.form}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center" style={{ background: 'rgba(184,152,63,0.04)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(184,152,63,0.08)' }}>
                <p className="text-sm" style={{ color: '#8a8078' }}>
                  QUL Morphology integration coming soon. This will provide complete root analysis for every word in the Quran.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ═══ VOCABULARY FLASHCARDS SECTION ═══ */}
        {activeSection === "vocab" && (
          <section className="px-6 pb-32 relative z-10">
            <div className="max-w-2xl mx-auto">
              <button
                className="learn-btn-ghost px-5 py-2 rounded-lg text-sm mb-10"
                onClick={() => setActiveSection(null)}
              >
                &larr; Back to sections
              </button>

              <div className="flex items-center gap-4 mb-3 flex-wrap">
                <h2 className="learn-heading learn-gold-gradient text-3xl md:text-4xl" style={{ fontWeight: 400 }}>
                  Vocabulary Flashcards
                </h2>
                {dueCount > 0 && (
                  <span style={{
                    background: 'rgba(184,152,63,0.12)',
                    color: '#D4B85A',
                    padding: '3px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    border: '1px solid rgba(184,152,63,0.2)',
                  }}>
                    {dueCount} due
                  </span>
                )}
              </div>
              <p className="text-sm mb-4" style={{ color: '#8a8078' }}>
                Flip the card, then rate how well you knew the answer. Cards are scheduled using spaced repetition.
              </p>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: '#8a8078' }}>Progress</span>
                  <span className="text-xs" style={{ color: '#D4B85A' }}>{knownCount} / {FLASHCARDS.length} known</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${(knownCount / FLASHCARDS.length) * 100}%` }} />
                </div>
              </div>

              {/* Card counter */}
              <p className="text-xs text-center mb-4" style={{ color: '#8a8078' }}>
                Card {orderPos + 1} of {FLASHCARDS.length}
                {sm2Data[FLASHCARDS[cardIdx].arabic] && (
                  <span style={{ color: '#8a8078', marginLeft: '8px' }}>
                    {(() => {
                      const data = sm2Data[FLASHCARDS[cardIdx].arabic];
                      const isDue = !data || data.nextReview <= Date.now();
                      if (isDue) return <span style={{ color: '#D4B85A' }}>Due now</span>;
                      const daysLeft = Math.ceil((data.nextReview - Date.now()) / (24 * 60 * 60 * 1000));
                      return <span style={{ color: '#8BC6A0' }}>Next review in {daysLeft}d</span>;
                    })()}
                  </span>
                )}
              </p>

              {/* Flashcard */}
              <div className="flashcard-container" onClick={() => setFlipped(!flipped)}>
                <div className={`flashcard-inner ${flipped ? "flipped" : ""}`}>
                  {/* Front */}
                  <div className="flashcard-front">
                    <p className="learn-arabic text-6xl md:text-7xl mb-4" style={{ color: '#F5E8B0' }}>
                      {FLASHCARDS[cardIdx].arabic}
                    </p>
                    <p className="text-sm" style={{ color: '#8a8078', fontStyle: 'italic' }}>
                      Tap to reveal
                    </p>
                  </div>
                  {/* Back */}
                  <div className="flashcard-back">
                    <p className="learn-arabic text-5xl md:text-6xl mb-4" style={{ color: '#F5E8B0' }}>
                      {FLASHCARDS[cardIdx].arabic}
                    </p>
                    <p className="learn-heading text-2xl mb-2" style={{ color: '#D4B85A', fontWeight: 500 }}>
                      {FLASHCARDS[cardIdx].meaning}
                    </p>
                    <p className="text-sm mb-1" style={{ color: '#8a8078', fontStyle: 'italic' }}>
                      {FLASHCARDS[cardIdx].transliteration}
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(184,152,63,0.4)' }}>
                      Root: {FLASHCARDS[cardIdx].root}
                    </p>
                  </div>
                </div>
              </div>

              {/* SM-2 Rating buttons — shown after flipping */}
              {flipped ? (
                <div className="flex items-center justify-center gap-3 mt-8">
                  {[
                    { label: 'Again', quality: 0, bg: 'rgba(220,80,80,0.12)', border: 'rgba(220,80,80,0.35)', color: '#DC5050' },
                    { label: 'Hard', quality: 2, bg: 'rgba(224,160,60,0.12)', border: 'rgba(224,160,60,0.35)', color: '#E0A03C' },
                    { label: 'Good', quality: 3, bg: 'rgba(184,152,63,0.12)', border: 'rgba(184,152,63,0.35)', color: '#D4B85A' },
                    { label: 'Easy', quality: 5, bg: 'rgba(100,180,120,0.12)', border: 'rgba(100,180,120,0.35)', color: '#64B478' },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={(e) => { e.stopPropagation(); rateCard(btn.quality); }}
                      style={{
                        background: btn.bg,
                        border: `1px solid ${btn.border}`,
                        color: btn.color,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: '13px',
                        letterSpacing: '0.03em',
                        padding: '8px 18px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-out',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 16px ${btn.bg}`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-center mt-8" style={{ color: '#8a8078' }}>
                  Flip the card to rate your recall
                </p>
              )}

              {/* Navigation dots — ordered by due status */}
              <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                {cardOrder.map((originalIdx, posIdx) => {
                  const key = FLASHCARDS[originalIdx].arabic;
                  const data = sm2Data[key];
                  const isDue = !data || data.nextReview <= Date.now();
                  return (
                    <button
                      key={originalIdx}
                      onClick={() => { setOrderPos(posIdx); setFlipped(false); }}
                      style={{
                        width: '8px', height: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                        background: posIdx === orderPos
                          ? '#D4B85A'
                          : isDue
                            ? 'rgba(220,80,80,0.4)'
                            : data && data.repetitions > 0
                              ? 'rgba(139,198,160,0.5)'
                              : 'rgba(184,152,63,0.15)',
                        transition: 'all 0.2s',
                      }}
                      aria-label={`Go to card ${posIdx + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ═══ GRAMMAR TAGS SECTION ═══ */}
        {activeSection === "grammar" && (
          <section className="px-6 pb-32 relative z-10">
            <div className="max-w-4xl mx-auto">
              <button
                className="learn-btn-ghost px-5 py-2 rounded-lg text-sm mb-10"
                onClick={() => setActiveSection(null)}
              >
                &larr; Back to sections
              </button>

              <h2 className="learn-heading learn-gold-gradient text-3xl md:text-4xl mb-3" style={{ fontWeight: 400 }}>
                Grammar Tags
              </h2>
              <p className="text-sm mb-4" style={{ color: '#8a8078' }}>
                Understanding Arabic grammar (Nahw and Sarf) is essential for comprehending the Quran. See how each word is analyzed.
              </p>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mb-10">
                <div className="flex items-center gap-2">
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D4B44A' }} />
                  <span className="text-xs" style={{ color: '#8a8078' }}>Ism (Noun)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#E8925B' }} />
                  <span className="text-xs" style={{ color: '#8a8078' }}>Fi&apos;l (Verb)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6BA3D6' }} />
                  <span className="text-xs" style={{ color: '#8a8078' }}>Harf (Particle)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8BC6A0' }} />
                  <span className="text-xs" style={{ color: '#8a8078' }}>Definite Article</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#C97DB6' }} />
                  <span className="text-xs" style={{ color: '#8a8078' }}>Affix / Pronoun</span>
                </div>
              </div>

              {/* Grammar cards */}
              <div className="flex flex-col gap-5">
                {GRAMMAR_EXAMPLES.map((ex, i) => (
                  <div key={i} className="grammar-word-card">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                      {/* Arabic word */}
                      <div className="text-center md:text-right" style={{ minWidth: '140px' }}>
                        <p className="learn-arabic text-4xl" style={{ color: '#F5E8B0' }}>{ex.arabic}</p>
                        <p className="learn-heading text-sm mt-1" style={{ color: '#8a8078', fontStyle: 'italic' }}>{ex.meaning}</p>
                      </div>

                      {/* Breakdown */}
                      <div className="flex-1">
                        <div className="flex flex-col gap-2">
                          {ex.breakdown.map((b, j) => (
                            <div key={j} className="flex items-start gap-3">
                              <span
                                className="learn-arabic text-xl"
                                style={{ color: b.color, minWidth: '60px', textAlign: 'center' }}
                              >
                                {b.part}
                              </span>
                              <div>
                                <span
                                  className="learn-tag"
                                  style={{
                                    background: `${b.color}18`,
                                    color: b.color,
                                  }}
                                >
                                  {b.tag}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══ PRACTICE CTA ═══ */}
        {!activeSection && (
          <section className="px-6 pb-16 relative z-10">
            <div className="max-w-md mx-auto text-center">
              <div className="learn-divider max-w-xs mx-auto mb-8">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" stroke="#B8983F" strokeWidth="0.5" opacity="0.25"/>
                </svg>
              </div>
              <h3 className="learn-heading text-2xl mb-3" style={{ fontWeight: 400, color: '#e5e5e5' }}>
                Test Your <span className="learn-gold-gradient">Knowledge</span>
              </h3>
              <p className="text-sm mb-6" style={{ color: '#8a8078' }}>
                Practice what you&apos;ve learned with interactive quizzes on Quranic vocabulary, surahs, and ayahs.
              </p>
              <a href="/quiz" className="learn-btn-filled px-8 py-3 rounded-xl text-sm inline-block" style={{ textDecoration: 'none' }}>
                Take a Quiz
              </a>
            </div>
          </section>
        )}

        {/* ═══ FOOTER ═══ */}
        <footer className="px-6 py-12 relative z-10" style={{ borderTop: '1px solid rgba(184,152,63,0.06)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs" style={{ color: '#8a8078' }}>&copy; 2026 theQuranGuide</p>
              <p className="learn-arabic text-sm" style={{ color: 'rgba(184,152,63,0.25)' }}>
                رَبِّ زِدْنِي عِلْمًا
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
