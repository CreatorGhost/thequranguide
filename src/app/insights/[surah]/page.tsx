"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { SURAHS } from "@/data/surahs";
import { useSurahInsight } from "@/hooks/useSurahInsight";

function stripHtml(html: string): string {
  if (typeof document !== "undefined") {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  return html.replace(/<[^>]*>/g, "");
}

export default function SurahInsightPage() {
  const params = useParams();
  const surahNum = Number(params.surah);
  const { surahInfo, curated, ibnKathir, asbabAlNuzul, loading } =
    useSurahInsight(surahNum);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  // scroll to top on surah change
  useEffect(() => { window.scrollTo(0, 0); }, [surahNum]);

  if (!surahInfo) {
    return (
      <div style={{ background: '#0d0b08', color: '#e5e5e5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div className="text-center">
          <p style={{ fontSize: 48, marginBottom: 16 }}>404</p>
          <p style={{ color: '#8a8078' }}>Surah not found</p>
          <a href="/insights" style={{ color: '#B8983F', display: 'inline-block', marginTop: 16, textDecoration: 'none', borderBottom: '1px solid rgba(184,152,63,0.3)' }}>
            Back to Insights
          </a>
        </div>
      </div>
    );
  }

  const prevSurah = surahNum > 1 ? SURAHS[surahNum - 2] : null;
  const nextSurah = surahNum < 114 ? SURAHS[surahNum] : null;
  const c = curated; // shorthand

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

        .sid {
          --gold: #B8983F;
          --gold-light: #D4B85A;
          --gold-deep: #8B6914;
          --base: #0d0b08;
          --surface: #131110;
          --surface2: #1a1714;
          --surface3: #1f1c17;
          --text: #e5e5e5;
          --text-secondary: #c8c0b4;
          --text-muted: #8a8078;
          --border: rgba(184,152,63,0.12);
          --border-subtle: rgba(255,255,255,0.06);
          background: var(--base);
          color: var(--text);
          font-family: 'Inter', -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        .sid-h { font-family: 'EB Garamond', serif; }
        .sid-ar { font-family: 'PDMS Saleem QuranFont', 'Amiri', serif; direction: rtl; line-height: 2.8; word-spacing: 16px; letter-spacing: 0.03em; }

        .sid-gg {
          background: linear-gradient(135deg, #8B6914 10%, #B8983F 40%, #D4B85A 60%, #B8983F 90%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .sid-gs {
          background: linear-gradient(135deg, #8B6914 10%, #B8983F 35%, #D4B85A 50%, #E8D5A0 55%, #D4B85A 65%, #B8983F 80%, #8B6914 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: sid-sh 6s ease-in-out infinite;
        }
        @keyframes sid-sh { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

        .sid-nav { background:rgba(13,11,8,0.92); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); }

        .sid-glow {
          position:fixed; top:20%; left:50%; transform:translate(-50%,-50%);
          width:900px; height:900px; border-radius:50%;
          background:radial-gradient(circle, rgba(184,152,63,0.08) 0%, rgba(139,105,20,0.03) 35%, transparent 70%);
          pointer-events:none; z-index:0;
        }

        /* Section card */
        .sid-sec {
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
        }
        .sid-sec-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--gold); margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .sid-sec-label::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(184,152,63,0.15), transparent);
        }

        /* Body text */
        .sid-body { font-size: 14px; line-height: 1.85; color: var(--text-secondary); }
        .sid-body p + p { margin-top: 14px; }

        /* Ornamental frame */
        .sid-orn { position:relative; }
        .sid-orn::before, .sid-orn::after {
          content:''; position:absolute; width:48px; height:48px;
          border-color:rgba(184,152,63,0.25); border-style:solid;
        }
        .sid-orn::before { top:-1px; left:-1px; border-width:1px 0 0 1px; }
        .sid-orn::after { bottom:-1px; right:-1px; border-width:0 1px 1px 0; }

        /* Vocab card */
        .sid-vocab {
          background: rgba(184,152,63,0.03);
          border: 1px solid rgba(184,152,63,0.08);
          border-radius: 12px;
          padding: 20px;
          transition: border-color 0.2s;
        }
        .sid-vocab:hover { border-color: rgba(184,152,63,0.2); }

        /* Story card */
        .sid-story {
          border-left: 2px solid rgba(184,152,63,0.2);
          padding-left: 24px;
          margin-bottom: 28px;
        }
        .sid-story:last-child { margin-bottom: 0; }

        /* Verse card */
        .sid-verse {
          background: rgba(184,152,63,0.02);
          border: 1px solid rgba(184,152,63,0.1);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 20px;
        }
        .sid-verse:hover { border-color: rgba(184,152,63,0.25); }

        /* Sub-detail inside verse */
        .sid-vd {
          background: rgba(184,152,63,0.04);
          border-radius: 10px;
          padding: 14px 18px;
          margin-top: 12px;
        }
        .sid-vd-label {
          font-size: 11px; font-weight: 600; color: var(--gold);
          margin-bottom: 6px; letter-spacing: 0.06em;
        }

        /* Connection pill */
        .sid-conn {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px; background: var(--surface2);
          border: 1px solid var(--border-subtle);
          border-radius: 12px; text-decoration: none; color: inherit;
          transition: all 0.2s;
        }
        .sid-conn:hover { border-color: rgba(184,152,63,0.2); transform: translateX(4px); }

        /* Lesson group */
        .sid-lesson-cat {
          font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--gold-light);
          margin-bottom: 10px; padding-bottom: 8px;
          border-bottom: 1px solid rgba(184,152,63,0.1);
        }
        .sid-lesson-pt {
          display: flex; gap: 12px; padding: 10px 0;
          font-size: 14px; line-height: 1.7; color: var(--text-secondary);
        }
        .sid-lesson-pt + .sid-lesson-pt { border-top: 1px solid rgba(255,255,255,0.03); }

        /* Surah structure accordion */
        .sid-flow-item {
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          margin-bottom: 8px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .sid-flow-item:hover, .sid-flow-item.open { border-color: rgba(184,152,63,0.2); }
        .sid-flow-head {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 20px; cursor: pointer;
          background: transparent; border: none; width: 100%;
          text-align: left; color: var(--text); font-family: 'Inter', sans-serif;
        }
        .sid-flow-head:hover { background: rgba(184,152,63,0.03); }
        .sid-flow-body { padding: 0 20px 20px 54px; }

        /* Buttons */
        .sid-btn-f {
          background: linear-gradient(135deg, #B8983F, #9A7B2F);
          color: #0d0b08; font-family: 'Inter', sans-serif;
          font-weight: 600; font-size: 14px; letter-spacing: 0.04em;
          padding: 12px 28px; border-radius: 12px; border: none;
          cursor: pointer; text-decoration: none; display: inline-block;
          transition: all 0.2s;
        }
        .sid-btn-f:hover { box-shadow: 0 0 24px rgba(184,152,63,0.25); transform: translateY(-1px); }

        .sid-btn-g {
          border: 1px solid rgba(184,152,63,0.35);
          color: var(--gold); font-family: 'Inter', sans-serif;
          font-weight: 500; font-size: 13px; letter-spacing: 0.04em;
          padding: 10px 20px; border-radius: 10px; background: transparent;
          cursor: pointer; text-decoration: none; display: inline-flex;
          align-items: center; gap: 8px; transition: all 0.2s;
        }
        .sid-btn-g:hover { background: rgba(184,152,63,0.08); border-color: rgba(184,152,63,0.55); }

        /* Noise */
        .sid-noise::after {
          content:''; position:fixed; inset:0; opacity:0.025; pointer-events:none; z-index:9999;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat:repeat; background-size:256px 256px;
        }

        @keyframes sid-fu { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .sid-fade { animation: sid-fu 0.5s ease-out both; }
      `}</style>

      <div className="sid sid-noise">
        <div className="sid-glow" />

        {/* ─── NAVIGATION ─── */}
        <nav className="sid-nav fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="#B8983F" strokeWidth="0.7" opacity="0.5"/>
                <circle cx="12" cy="12" r="4" stroke="#B8983F" strokeWidth="0.5" opacity="0.35"/>
                <path d="M12 2L12 4M12 20L12 22M2 12L4 12M20 12L22 12M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="#B8983F" strokeWidth="0.5" opacity="0.3"/>
              </svg>
              <a href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
                <span className="sid-h text-lg" style={{ color: '#B8983F', fontWeight: 500 }}>The Quran Guide</span>
                <span className="hidden sm:inline" style={{ color: 'rgba(184,152,63,0.5)', fontFamily: "'Amiri', serif", fontSize: '14px', direction: 'rtl', lineHeight: 1 }}>دليل القرآن</span>
              </a>
            </div>
            <div className="hidden md:flex items-center gap-10">
              {[
                { label: 'Home', href: '/' }, { label: 'Read', href: '/read' },
                { label: 'Insights', href: '/insights' }, { label: 'Learn', href: '/learn' },
                { label: 'Quiz', href: '/quiz' }, { label: 'Duas', href: '/dua' },
                { label: 'Khatmah', href: '/khatmah' }, { label: 'Search', href: '/search' },
              ].map((item) => (
                <a key={item.label} href={item.href} className="text-sm transition-colors duration-150" style={{ color: item.href === '/insights' ? '#D4B85A' : '#8a8078', textDecoration: 'none' }}>{item.label}</a>
              ))}
            </div>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#B8983F' }} aria-label="Toggle menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {mobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
              </svg>
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden" style={{ background: 'rgba(13,11,8,0.98)', borderTop: '1px solid rgba(184,152,63,0.06)', padding: '12px 24px' }}>
              {[
                { label: 'Home', href: '/' }, { label: 'Read', href: '/read' },
                { label: 'Insights', href: '/insights' }, { label: 'Learn', href: '/learn' },
                { label: 'Quiz', href: '/quiz' }, { label: 'Duas', href: '/dua' },
                { label: 'Khatmah', href: '/khatmah' }, { label: 'Search', href: '/search' },
              ].map((item) => (
                <a key={item.label} href={item.href} className="block py-2 text-sm" style={{ color: item.href === '/insights' ? '#D4B85A' : '#8a8078', textDecoration: 'none' }}>{item.label}</a>
              ))}
            </div>
          )}
          <div style={{ height: 1, background: 'rgba(184,152,63,0.06)' }} />
        </nav>

        {/* ─── HEADER ─── */}
        <section className="pt-28 pb-6 px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <a href="/insights" className="text-xs" style={{ color: '#8a8078', textDecoration: 'none' }}>Insights</a>
              <span className="text-xs" style={{ color: 'rgba(184,152,63,0.3)' }}>›</span>
              <span className="text-xs" style={{ color: '#B8983F' }}>{surahInfo.englishName}</span>
            </div>

            <div className="sid-orn p-8 md:p-12 text-center sid-fade">
              <p className="sid-ar text-4xl md:text-5xl mb-3" style={{ color: 'rgba(184,152,63,0.5)' }}>{surahInfo.name}</p>
              <h1 className="sid-h sid-gs text-3xl md:text-5xl mb-2" style={{ fontWeight: 400 }}>{surahInfo.englishName}</h1>
              <p className="sid-h text-lg italic mb-5" style={{ color: '#8a8078', fontWeight: 400 }}>{surahInfo.englishNameTranslation}</p>
              <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
                <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: surahInfo.revelationType === 'Meccan' ? 'rgba(184,152,63,0.1)' : 'rgba(100,180,130,0.1)', color: surahInfo.revelationType === 'Meccan' ? '#B8983F' : '#64B482' }}>
                  {surahInfo.revelationType}
                </span>
                <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', color: '#8a8078' }}>{surahInfo.numberOfAyahs} Ayahs</span>
                {c && <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', color: '#8a8078' }}>#{c.historicalContext.chronologicalOrder} in revelation order</span>}
              </div>
              <a href={`/read?page=${surahInfo.startPage}`} className="sid-btn-f">Read this Surah</a>
            </div>
          </div>
        </section>

        {/* ─── CONTENT ─── */}
        <section className="px-6 pb-20 relative z-10">
          <div className="max-w-3xl mx-auto">

            {/* ── 1. Historical Context ── */}
            {c?.historicalContext && (
              <div className="sid-sec sid-fade" style={{ animationDelay: '0.1s' }}>
                <p className="sid-sec-label">Historical Context</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'rgba(184,152,63,0.08)', color: '#D4B85A' }}>{c.historicalContext.period}</span>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', color: '#8a8078' }}>Revealed #{c.historicalContext.chronologicalOrder} of 114</span>
                </div>
                <div className="sid-body">
                  <p>{c.historicalContext.background}</p>
                </div>
                {c.historicalContext.occasionOfRevelation && (
                  <div className="sid-vd" style={{ marginTop: 16 }}>
                    <p className="sid-vd-label">Occasion of Revelation</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#c8c0b4' }}>{c.historicalContext.occasionOfRevelation}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── 2. Who Is Allah Addressing? ── */}
            {c?.audience && (
              <div className="sid-sec sid-fade" style={{ animationDelay: '0.15s' }}>
                <p className="sid-sec-label">Who Is Allah Addressing?</p>
                <div className="sid-body"><p>{c.audience}</p></div>
              </div>
            )}

            {/* ── 3. Core Message ── */}
            {c?.coreMessage && (
              <div className="sid-sec sid-fade" style={{ animationDelay: '0.2s' }}>
                <p className="sid-sec-label">Core Message</p>
                <div style={{ background: 'rgba(184,152,63,0.04)', borderRadius: 12, padding: '20px 24px', marginBottom: 16, borderLeft: '3px solid rgba(184,152,63,0.3)' }}>
                  <p className="sid-h text-base leading-relaxed" style={{ color: '#e5e5e5', fontWeight: 500 }}>{c.coreMessage.thesis}</p>
                </div>
              </div>
            )}

            {/* ── 4. Surah Structure & Flow ── */}
            {c?.sections && c.sections.length > 0 && (
              <div className="sid-sec sid-fade" style={{ animationDelay: '0.25s' }}>
                <p className="sid-sec-label">Surah Structure &amp; Flow</p>
                <p className="text-xs mb-4" style={{ color: '#8a8078' }}>Click each section to explore what Allah is saying and how it connects.</p>
                {c.sections.map((s, i) => {
                  const isOpen = expandedSection === i;
                  return (
                    <div key={i} className={`sid-flow-item ${isOpen ? 'open' : ''}`}>
                      <button className="sid-flow-head" onClick={() => setExpandedSection(isOpen ? null : i)}>
                        <span style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(184,152,63,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, color: '#B8983F', fontWeight: 600 }}>
                          {s.verseRange}
                        </span>
                        <span className="sid-h" style={{ fontSize: 15, fontWeight: 500, flex: 1 }}>{s.title}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8078" strokeWidth="1.5"
                          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}>
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="sid-flow-body">
                          <p className="text-sm leading-relaxed mb-3" style={{ color: '#c8c0b4' }}>{s.summary}</p>
                          {s.connectionToNext && (
                            <p className="text-xs italic" style={{ color: '#B8983F' }}>→ {s.connectionToNext}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── 5. Stories & Parables ── */}
            {c?.stories && c.stories.length > 0 && (
              <div className="sid-sec sid-fade" style={{ animationDelay: '0.35s' }}>
                <p className="sid-sec-label">Stories &amp; Parables</p>
                {c.stories.map((s, i) => (
                  <div key={i} className="sid-story">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="sid-h text-base" style={{ fontWeight: 500 }}>{s.title}</h4>
                      <span className="text-xs" style={{ color: '#B8983F' }}>Verses {s.verseRange}</span>
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: '#c8c0b4' }}>{s.narrative}</p>
                    <div className="sid-vd" style={{ marginBottom: 8 }}>
                      <p className="sid-vd-label">Lesson</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#c8c0b4' }}>{s.lesson}</p>
                    </div>
                    <div className="sid-vd">
                      <p className="sid-vd-label">Connection to Surah&apos;s Message</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#c8c0b4' }}>{s.connectionToMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── 7. Notable Verses (Deep) ── */}
            {c?.notableVerses && c.notableVerses.length > 0 && (
              <div className="sid-sec sid-fade" style={{ animationDelay: '0.4s' }}>
                <p className="sid-sec-label">Notable Verses — Deep Dive</p>
                {c.notableVerses.map((v, i) => (
                  <div key={i} className="sid-verse">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold" style={{ color: '#B8983F' }}>Ayah {v.ayah}</span>
                      <a href={`/read?page=${surahInfo.startPage}`} className="text-xs" style={{ color: '#8a8078', textDecoration: 'none', borderBottom: '1px solid rgba(184,152,63,0.15)' }}>
                        Read in Mushaf →
                      </a>
                    </div>
                    <p className="sid-ar text-xl md:text-2xl text-center mb-4" style={{ color: '#e5e5e5' }}>{v.arabic}</p>
                    <p className="sid-h text-sm italic text-center mb-5" style={{ color: '#c8c0b4' }}>&ldquo;{v.translation}&rdquo;</p>

                    <div className="sid-vd">
                      <p className="sid-vd-label">What the Scholars Say (Tafsir)</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#c8c0b4' }}>{v.tafsirExcerpt}</p>
                    </div>
                    <div className="sid-vd">
                      <p className="sid-vd-label">Arabic Linguistic Beauty</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#c8c0b4' }}>{v.linguisticNote}</p>
                    </div>
                    <div className="sid-vd">
                      <p className="sid-vd-label">How to Apply This</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#c8c0b4' }}>{v.practicalApplication}</p>
                    </div>
                    <div className="sid-vd">
                      <p className="sid-vd-label">Related Hadith</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#c8c0b4' }}>{v.relatedHadith}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── 8. Connections to Other Surahs ── */}
            {c?.connections && c.connections.length > 0 && (
              <div className="sid-sec sid-fade" style={{ animationDelay: '0.45s' }}>
                <p className="sid-sec-label">Connections to Other Surahs</p>
                <div className="grid grid-cols-1 gap-3">
                  {c.connections.map((conn, i) => (
                    <a key={i} href={`/insights/${conn.surah}`} className="sid-conn">
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(184,152,63,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="sid-h text-sm" style={{ color: '#B8983F', fontWeight: 500 }}>{conn.surah}</span>
                      </div>
                      <div>
                        <p className="text-sm" style={{ fontWeight: 500, marginBottom: 2 }}>{conn.surahName}</p>
                        <p className="text-xs leading-relaxed" style={{ color: '#8a8078' }}>{conn.relationship}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ── 9. Scholarly Notes ── */}
            {c?.scholarlyNotes && (
              <div className="sid-sec sid-fade" style={{ animationDelay: '0.55s' }}>
                <p className="sid-sec-label">Scholarly Notes</p>
                <div className="sid-body"><p>{c.scholarlyNotes}</p></div>
              </div>
            )}

            {/* ── CDN Fallback for non-curated surahs ── */}
            {!c && !loading && ibnKathir.length > 0 && (
              <div className="sid-sec sid-fade">
                <p className="sid-sec-label">From the Tafsir (Ibn Kathir)</p>
                <p className="text-xs mb-4" style={{ color: '#8a8078' }}>
                  Detailed curated insights for this surah are coming soon. In the meantime, here are excerpts from Ibn Kathir&apos;s tafsir.
                </p>
                <div style={{ maxHeight: 500, overflowY: 'auto', paddingRight: 8 }}>
                  {ibnKathir.slice(0, 12).map((entry, i) => (
                    <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < 11 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <span className="text-xs" style={{ color: '#B8983F', marginBottom: 4, display: 'block' }}>Verse {entry.verse_key || entry.verse_number}</span>
                      <p className="text-sm leading-relaxed" style={{ color: '#c8c0b4' }}>
                        {stripHtml(entry.text).slice(0, 600)}{entry.text.length > 600 && "..."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!c && !loading && asbabAlNuzul.length > 0 && (
              <div className="sid-sec sid-fade" style={{ animationDelay: '0.1s' }}>
                <p className="sid-sec-label">Revelation Context (Asbab al-Nuzul)</p>
                <div style={{ maxHeight: 400, overflowY: 'auto', paddingRight: 8 }}>
                  {asbabAlNuzul.slice(0, 8).map((entry, i) => (
                    <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < 7 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <span className="text-xs" style={{ color: '#B8983F', marginBottom: 4, display: 'block' }}>Verse {entry.verse_key || entry.verse_number}</span>
                      <p className="text-sm leading-relaxed" style={{ color: '#c8c0b4' }}>
                        {stripHtml(entry.text).slice(0, 500)}{entry.text.length > 500 && "..."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Key Vocabulary ── */}
            {c?.keyVocabulary && c.keyVocabulary.length > 0 && (
              <div className="sid-sec sid-fade" style={{ animationDelay: '0.6s' }}>
                <p className="sid-sec-label">Key Vocabulary</p>
                <div className="grid grid-cols-1 gap-3">
                  {c.keyVocabulary.map((w, i) => (
                    <div key={i} className="sid-vocab">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="sid-h text-lg" style={{ color: '#D4B85A', fontWeight: 500 }}>{w.transliteration}</span>
                          <span className="text-xs ml-2" style={{ color: '#8a8078' }}>— {w.surfaceMeaning}</span>
                        </div>
                        <span className="sid-ar text-xl" style={{ color: 'rgba(184,152,63,0.4)' }}>{w.arabic}</span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#c8c0b4' }}>{w.deeperMeaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Prev / Next ── */}
            <div className="flex items-center justify-between mt-10 gap-4">
              {prevSurah ? (
                <a href={`/insights/${prevSurah.number}`} className="sid-btn-g">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  {prevSurah.englishName}
                </a>
              ) : <div />}
              {nextSurah ? (
                <a href={`/insights/${nextSurah.number}`} className="sid-btn-g">
                  {nextSurah.englishName}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
              ) : <div />}
            </div>

          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="px-6 py-10" style={{ borderTop: '1px solid rgba(184,152,63,0.06)' }}>
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: '#8a8078' }}>&copy; 2026 The Quran Guide</p>
            <p className="sid-ar text-sm" style={{ color: 'rgba(184,152,63,0.25)' }}>رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ</p>
          </div>
        </footer>
      </div>
    </>
  );
}
