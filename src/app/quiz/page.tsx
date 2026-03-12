"use client";

import { useState, useCallback } from "react";

interface QuizQuestion {
  type: "arabic-to-english" | "english-to-arabic" | "surah-match" | "fill-blank";
  question: string;
  questionArabic?: string;
  options: string[];
  correctIndex: number;
  reference: string;
}

const QUIZ_BANK: QuizQuestion[] = [
  {
    type: "arabic-to-english",
    question: "What does this ayah mean?",
    questionArabic: "\u0628\u0650\u0633\u0652\u0645\u0650 \u0671\u0644\u0644\u0651\u064E\u0647\u0650 \u0671\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0640\u0670\u0646\u0650 \u0671\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650",
    options: [
      "In the name of Allah, the Most Gracious, the Most Merciful",
      "All praise is due to Allah, Lord of the worlds",
      "Say: He is Allah, the One",
      "Guide us to the straight path",
    ],
    correctIndex: 0,
    reference: "1:1",
  },
  {
    type: "arabic-to-english",
    question: "What does this ayah mean?",
    questionArabic: "\u0627\u0644\u0652\u062D\u064E\u0645\u0652\u062F\u064F \u0644\u0650\u0644\u0651\u064E\u0647\u0650 \u0631\u064E\u0628\u0651\u0650 \u0627\u0644\u0652\u0639\u064E\u0627\u0644\u064E\u0645\u0650\u064A\u0646\u064E",
    options: [
      "The Most Gracious, the Most Merciful",
      "All praise is due to Allah, Lord of the worlds",
      "Master of the Day of Judgment",
      "It is You we worship and You we ask for help",
    ],
    correctIndex: 1,
    reference: "1:2",
  },
  {
    type: "surah-match",
    question: "Which surah is known as 'The Opening'?",
    options: ["Al-Baqarah", "Al-Fatihah", "Al-Ikhlas", "An-Nas"],
    correctIndex: 1,
    reference: "Surah 1",
  },
  {
    type: "surah-match",
    question: "Which surah declares the oneness of Allah?",
    options: ["Al-Falaq", "An-Nas", "Al-Ikhlas", "Al-Kawthar"],
    correctIndex: 2,
    reference: "Surah 112",
  },
  {
    type: "english-to-arabic",
    question: "Which is the Arabic for 'Say: He is Allah, the One'?",
    options: [
      "\u0642\u064F\u0644\u0652 \u0647\u064F\u0648\u064E \u0671\u0644\u0644\u0651\u064E\u0647\u064F \u0623\u064E\u062D\u064E\u062F\u064C",
      "\u0627\u0644\u0652\u062D\u064E\u0645\u0652\u062F\u064F \u0644\u0650\u0644\u0651\u064E\u0647\u0650 \u0631\u064E\u0628\u0651\u0650 \u0627\u0644\u0652\u0639\u064E\u0627\u0644\u064E\u0645\u0650\u064A\u0646\u064E",
      "\u0625\u0650\u064A\u0651\u064E\u0627\u0643\u064E \u0646\u064E\u0639\u0652\u0628\u064F\u062F\u064F",
      "\u0628\u0650\u0633\u0652\u0645\u0650 \u0671\u0644\u0644\u0651\u064E\u0647\u0650",
    ],
    correctIndex: 0,
    reference: "112:1",
  },
  {
    type: "fill-blank",
    question: "Ayat al-Kursi (2:255) begins with: 'Allah — there is no deity except ___'",
    options: ["Him", "Allah", "the One", "the Most High"],
    correctIndex: 0,
    reference: "2:255",
  },
  {
    type: "surah-match",
    question: "How many surahs are in the Quran?",
    options: ["100", "114", "120", "110"],
    correctIndex: 1,
    reference: "The Holy Quran",
  },
  {
    type: "surah-match",
    question: "Which surah is the longest in the Quran?",
    options: ["Al-Fatihah", "An-Nisa", "Al-Baqarah", "Aal-E-Imran"],
    correctIndex: 2,
    reference: "Surah 2 (286 ayahs)",
  },
  {
    type: "arabic-to-english",
    question: "What does this mean?",
    questionArabic: "\u0625\u0650\u064A\u0651\u064E\u0627\u0643\u064E \u0646\u064E\u0639\u0652\u0628\u064F\u062F\u064F \u0648\u064E\u0625\u0650\u064A\u0651\u064E\u0627\u0643\u064E \u0646\u064E\u0633\u0652\u062A\u064E\u0639\u0650\u064A\u0646\u064F",
    options: [
      "Guide us to the straight path",
      "It is You we worship and You we ask for help",
      "Master of the Day of Judgment",
      "In the name of Allah",
    ],
    correctIndex: 1,
    reference: "1:5",
  },
  {
    type: "surah-match",
    question: "Surah Ar-Rahman is known for repeating which phrase?",
    options: [
      "SubhanAllah",
      "Alhamdulillah",
      "Which of the favors of your Lord will you deny?",
      "In the name of Allah",
    ],
    correctIndex: 2,
    reference: "Surah 55",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [questions] = useState(() => shuffle(QUIZ_BANK).slice(0, 8));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[currentIdx];

  const handleSelect = useCallback((idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correctIndex) setScore((s) => s + 1);
  }, [selected, q]);

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
    }
  }, [currentIdx, questions.length]);

  const restart = useCallback(() => {
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Amiri:wght@400;700&display=swap');
        @font-face {
          font-family: 'PDMS Saleem QuranFont';
          src: url('/fonts/pdms-saleem-quranfont.woff') format('woff'),
               url('/fonts/pdms-saleem-quranfont.ttf') format('truetype');
          font-weight: normal; font-style: normal; font-display: swap;
        }
        .quiz-page { background: #0d0b08; color: #F0DFA0; font-family: 'EB Garamond', serif; min-height: 100vh; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        .quiz-glow {
          position: fixed; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 900px; height: 900px; border-radius: 50%;
          background: radial-gradient(circle, rgba(184,152,63,0.09) 0%, rgba(139,105,20,0.04) 30%, rgba(184,152,63,0.015) 50%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .quiz-noise::after {
          content: ''; position: fixed; inset: 0;
          opacity: 0.025; pointer-events: none; z-index: 9999;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 256px 256px;
        }
        .quiz-option {
          padding: 14px 20px; border-radius: 12px; cursor: pointer; transition: all 0.2s;
          border: 1px solid rgba(212,180,74,0.12); background: rgba(212,180,74,0.03);
          font-family: 'EB Garamond', serif; font-size: 15px; color: #F0DFA0;
          text-align: left; width: 100%; display: block;
        }
        .quiz-option:hover { border-color: rgba(212,180,74,0.30); background: rgba(212,180,74,0.06); }
        .quiz-option.correct { border-color: #4ade80; background: rgba(74,222,128,0.08); color: #4ade80; }
        .quiz-option.wrong { border-color: #f87171; background: rgba(248,113,113,0.08); color: #f87171; }
        .quiz-option.dimmed { opacity: 0.5; }
      `}</style>

      <div className="quiz-page quiz-noise">
        <div className="quiz-glow" />
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          background: "rgba(26,22,16,0.92)", backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}>
          <div className="max-w-7xl mx-auto px-6" style={{ height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="flex items-center gap-2.5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="#B8983F" strokeWidth="0.7" opacity="0.5"/>
                <circle cx="12" cy="12" r="4" stroke="#B8983F" strokeWidth="0.5" opacity="0.35"/>
              </svg>
              <a href="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
                <span style={{ color: "#D4B44A", fontSize: "18px", fontFamily: "'EB Garamond', serif", fontWeight: 500 }}>The Quran Guide</span>
                <span className="hidden sm:inline" style={{ color: 'rgba(184,152,63,0.5)', fontFamily: "'Amiri', serif", fontSize: "14px", direction: 'rtl', lineHeight: 1 }}>دليل القرآن</span>
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
                <a key={item.label} href={item.href} className="text-sm" style={{ color: item.href === '/quiz' ? '#D4B85A' : '#8A7D5E', textDecoration: 'none', transition: 'color 0.15s' }}>
                  {item.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href="/read" className="hidden sm:inline-block" style={{
                background: "linear-gradient(135deg, #D4B44A, #B89830)", color: "#1A1610",
                padding: "8px 20px", borderRadius: "8px", textDecoration: "none",
                fontSize: "14px", fontWeight: 600, fontFamily: "'EB Garamond', serif",
                letterSpacing: "0.04em",
              }}>
                Open Reader
              </a>
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#D4B44A' }}
                aria-label="Toggle menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {mobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
                </svg>
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden" style={{ background: 'rgba(26,22,16,0.98)', borderTop: '1px solid rgba(212,180,74,0.06)', padding: '12px 24px' }}>
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
                <a key={item.label} href={item.href} className="block py-2 text-sm" style={{ color: item.href === '/quiz' ? '#D4B85A' : '#8A7D5E', textDecoration: 'none', fontFamily: "'EB Garamond', serif" }}>
                  {item.label}
                </a>
              ))}
            </div>
          )}
          <div style={{ height: "1px", background: "rgba(212,180,74,0.06)" }} />
        </nav>

        <div className="max-w-2xl mx-auto px-6" style={{ paddingTop: "96px", paddingBottom: "48px" }}>
          {finished ? (
            <div style={{ textAlign: "center" }}>
              <h1 style={{ fontSize: "48px", color: "#D4B44A", marginBottom: "8px", fontFamily: "'EB Garamond', serif" }}>
                {score}/{questions.length}
              </h1>
              <p style={{ color: "#8A7D5E", fontSize: "16px", marginBottom: "32px" }}>
                {score === questions.length ? "MashAllah! Perfect score!" :
                 score >= questions.length * 0.7 ? "Great job! Keep learning!" :
                 "Good effort! Review and try again."}
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={restart} style={{
                  padding: "12px 32px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #D4B44A, #B89830)",
                  color: "#1A1610", fontWeight: 600, border: "none", cursor: "pointer",
                  fontSize: "15px", fontFamily: "'EB Garamond', serif",
                }}>
                  Try Again
                </button>
                <a href="/learn" style={{
                  padding: "12px 32px", borderRadius: "10px",
                  border: "1px solid rgba(212,180,74,0.35)", color: "#D4B44A",
                  fontWeight: 500, fontSize: "15px", fontFamily: "'EB Garamond', serif",
                  textDecoration: "none", display: "inline-block",
                }}>
                  Study More
                </a>
                <a href="/read" style={{
                  padding: "12px 32px", borderRadius: "10px",
                  border: "1px solid rgba(212,180,74,0.35)", color: "#D4B44A",
                  fontWeight: 500, fontSize: "15px", fontFamily: "'EB Garamond', serif",
                  textDecoration: "none", display: "inline-block",
                }}>
                  Open Reader
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div style={{ marginBottom: "32px" }}>
                <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#8A7D5E" }}>
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                  <span style={{ fontSize: "12px", color: "#D4B44A" }}>
                    Score: {score}
                  </span>
                </div>
                <div style={{ height: "3px", background: "rgba(212,180,74,0.10)", borderRadius: "2px" }}>
                  <div style={{
                    height: "100%", borderRadius: "2px",
                    background: "linear-gradient(90deg, #D4B44A, #B89830)",
                    width: `${((currentIdx + 1) / questions.length) * 100}%`,
                    transition: "width 0.3s ease",
                  }} />
                </div>
              </div>

              {/* Question */}
              <div style={{ marginBottom: "32px" }}>
                <span style={{
                  display: "inline-block", padding: "2px 10px", borderRadius: "12px",
                  background: "rgba(212,180,74,0.06)", border: "1px solid rgba(212,180,74,0.12)",
                  fontSize: "11px", color: "#8A7D5E", marginBottom: "16px",
                  textTransform: "capitalize",
                }}>
                  {q.type.replace(/-/g, " ")}
                </span>

                <h2 style={{ fontSize: "22px", color: "#F5E8B0", marginBottom: "12px", fontWeight: 500 }}>
                  {q.question}
                </h2>

                {q.questionArabic && (
                  <p style={{
                    fontFamily: "'PDMS Saleem QuranFont', 'Amiri', serif",
                    fontSize: "36px", color: "#D4B44A", direction: "rtl",
                    textAlign: "center", lineHeight: 2.2, marginBottom: "8px",
                    padding: "16px", background: "rgba(212,180,74,0.03)",
                    borderRadius: "12px", border: "1px solid rgba(212,180,74,0.08)",
                  }}>
                    {q.questionArabic}
                  </p>
                )}

                <p style={{ fontSize: "11px", color: "#8A7D5E" }}>Ref: {q.reference}</p>
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {q.options.map((opt, i) => {
                  let cls = "quiz-option";
                  if (selected !== null) {
                    if (i === q.correctIndex) cls += " correct";
                    else if (i === selected) cls += " wrong";
                    else cls += " dimmed";
                  }
                  return (
                    <button key={i} className={cls} onClick={() => handleSelect(i)}
                      style={opt.match(/[\u0600-\u06FF]/) ? { fontFamily: "'PDMS Saleem QuranFont', 'Amiri', serif", fontSize: "24px", direction: "rtl", textAlign: "right", lineHeight: 1.8 } : {}}>
                      <span style={{ marginRight: "10px", color: "#8A7D5E", fontSize: "12px" }}>{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Next button */}
              {selected !== null && (
                <button onClick={handleNext} style={{
                  padding: "12px 32px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #D4B44A, #B89830)",
                  color: "#1A1610", fontWeight: 600, border: "none", cursor: "pointer",
                  fontSize: "14px", fontFamily: "'EB Garamond', serif", width: "100%",
                }}>
                  {currentIdx + 1 >= questions.length ? "See Results" : "Next Question"}
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <footer style={{ padding: "40px 24px", borderTop: "1px solid rgba(184,152,63,0.06)", position: "relative", zIndex: 10 }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p style={{ fontSize: "12px", color: "#8a8078" }}>&copy; 2026 The Quran Guide</p>
              <p style={{ fontFamily: "'PDMS Saleem QuranFont', 'Amiri', serif", fontSize: "14px", color: "rgba(184,152,63,0.25)", direction: "rtl" }}>
                رَبِّ زِدْنِى عِلْمًا
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
