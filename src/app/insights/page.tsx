"use client";

import { useState } from "react";
import { SURAHS } from "@/data/surahs";
import { hasCuratedInsight, getCuratedSurahNumbers } from "@/data/surah-insights";

type Filter = "all" | "featured" | "meccan" | "medinan";

const FEATURED = getCuratedSurahNumbers();

export default function InsightsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filtered = SURAHS.filter((s) => {
    if (filter === "featured" && !FEATURED.includes(s.number)) return false;
    if (filter === "meccan" && s.revelationType !== "Meccan") return false;
    if (filter === "medinan" && s.revelationType !== "Medinan") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(search) ||
        String(s.number) === q
      );
    }
    return true;
  });

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

        .ins-page {
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
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        .ins-heading { font-family: 'EB Garamond', serif; }
        .ins-arabic { font-family: 'PDMS Saleem QuranFont', 'Amiri', serif; direction: rtl; line-height: 2; }

        .ins-gold-gradient {
          background: linear-gradient(135deg, #8B6914 10%, #B8983F 40%, #D4B85A 60%, #B8983F 90%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ins-nav {
          background: rgba(13,11,8,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .ins-glow {
          position: fixed;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 800px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,152,63,0.07) 0%, rgba(139,105,20,0.03) 35%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .ins-filter-btn {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid var(--border-subtle);
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }
        .ins-filter-btn:hover {
          border-color: rgba(184,152,63,0.25);
          color: var(--text);
        }
        .ins-filter-btn.active {
          background: rgba(184,152,63,0.12);
          border-color: rgba(184,152,63,0.35);
          color: var(--gold-light);
        }

        .ins-search {
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          padding: 10px 16px 10px 40px;
          color: var(--text);
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          width: 100%;
          max-width: 360px;
          outline: none;
          transition: border-color 0.2s;
        }
        .ins-search:focus {
          border-color: rgba(184,152,63,0.35);
        }
        .ins-search::placeholder {
          color: var(--text-muted);
        }

        .ins-card {
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s ease-out;
          text-decoration: none;
          color: inherit;
          display: block;
          position: relative;
          overflow: hidden;
        }
        .ins-card:hover {
          border-color: rgba(184,152,63,0.25);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .ins-card.featured::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #B8983F, transparent);
        }

        .ins-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .ins-noise::after {
          content: '';
          position: fixed;
          inset: 0;
          opacity: 0.025;
          pointer-events: none;
          z-index: 9999;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 256px 256px;
        }

        @keyframes ins-fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ins-fade { animation: ins-fadeIn 0.4s ease-out both; }
      `}</style>

      <div className="ins-page ins-noise">
        <div className="ins-glow" />

        {/* ─── NAVIGATION ─── */}
        <nav className="ins-nav fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="#B8983F" strokeWidth="0.7" opacity="0.5"/>
                <circle cx="12" cy="12" r="4" stroke="#B8983F" strokeWidth="0.5" opacity="0.35"/>
                <path d="M12 2L12 4M12 20L12 22M2 12L4 12M20 12L22 12M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="#B8983F" strokeWidth="0.5" opacity="0.3"/>
              </svg>
              <a href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
                <span className="ins-heading text-lg" style={{ color: '#B8983F', fontWeight: 500 }}>The Quran Guide</span>
                <span className="ins-arabic text-sm hidden sm:inline" style={{ color: 'rgba(184,152,63,0.5)', fontFamily: "'Amiri', serif", direction: 'rtl', lineHeight: 1 }}>دليل القرآن</span>
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
                <a key={item.label} href={item.href} className="text-sm transition-colors duration-150" style={{ color: item.href === '/insights' ? '#D4B85A' : '#8a8078', textDecoration: 'none' }}>
                  {item.label}
                </a>
              ))}
            </div>

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
                <a key={item.label} href={item.href} className="block py-2 text-sm" style={{ color: item.href === '/insights' ? '#D4B85A' : '#8a8078', textDecoration: 'none' }}>
                  {item.label}
                </a>
              ))}
            </div>
          )}
          <div style={{ height: 1, background: 'rgba(184,152,63,0.06)' }} />
        </nav>

        {/* ─── HERO ─── */}
        <section className="pt-32 pb-12 px-6 text-center relative z-10">
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#B8983F' }}>
            Surah Insights
          </p>
          <h1 className="ins-heading ins-gold-gradient text-4xl md:text-6xl mb-4" style={{ fontWeight: 400 }}>
            Discover the Quran
          </h1>
          <p className="text-sm max-w-lg mx-auto" style={{ color: '#8a8078' }}>
            Stories, themes, and lessons behind every surah — written to be understood, not just read.
          </p>
        </section>

        {/* ─── FILTERS & SEARCH ─── */}
        <section className="px-6 pb-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {([
                  { key: "all", label: "All Surahs" },
                  { key: "featured", label: "Featured" },
                  { key: "meccan", label: "Meccan" },
                  { key: "medinan", label: "Medinan" },
                ] as const).map((f) => (
                  <button
                    key={f.key}
                    className={`ins-filter-btn ${filter === f.key ? "active" : ""}`}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label}
                    {f.key === "featured" && ` (${FEATURED.length})`}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-auto">
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#8a8078" strokeWidth="1.5"
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
                >
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
                <input
                  className="ins-search"
                  placeholder="Search surahs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── SURAH GRID ─── */}
        <section className="px-6 pb-24 relative z-10">
          <div className="max-w-6xl mx-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-sm" style={{ color: '#8a8078' }}>No surahs match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((s, i) => {
                  const isFeatured = hasCuratedInsight(s.number);
                  return (
                    <a
                      key={s.number}
                      href={`/insights/${s.number}`}
                      className={`ins-card ins-fade ${isFeatured ? "featured" : ""}`}
                      style={{ animationDelay: `${Math.min(i * 30, 600)}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="ins-heading text-lg flex items-center justify-center"
                            style={{
                              width: 36,
                              height: 36,
                              border: '1px solid rgba(184,152,63,0.2)',
                              transform: 'rotate(45deg)',
                              flexShrink: 0,
                            }}
                          >
                            <span style={{ transform: 'rotate(-45deg)', display: 'block', color: '#B8983F', fontSize: 13, fontWeight: 500 }}>
                              {s.number}
                            </span>
                          </span>
                          <div>
                            <h3 className="ins-heading text-base" style={{ fontWeight: 500 }}>
                              {s.englishName}
                            </h3>
                            <p className="text-xs" style={{ color: '#8a8078' }}>
                              {s.englishNameTranslation}
                            </p>
                          </div>
                        </div>
                        <span className="ins-arabic text-lg" style={{ color: 'rgba(184,152,63,0.4)' }}>
                          {s.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="ins-badge"
                          style={{
                            background: s.revelationType === 'Meccan' ? 'rgba(184,152,63,0.08)' : 'rgba(100,180,130,0.08)',
                            color: s.revelationType === 'Meccan' ? '#B8983F' : '#64B482',
                          }}
                        >
                          {s.revelationType}
                        </span>
                        <span className="ins-badge" style={{ background: 'rgba(255,255,255,0.04)', color: '#8a8078' }}>
                          {s.numberOfAyahs} Ayahs
                        </span>
                        {isFeatured && (
                          <span className="ins-badge" style={{ background: 'rgba(184,152,63,0.12)', color: '#D4B85A' }}>
                            ★ Featured
                          </span>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="px-6 py-10" style={{ borderTop: '1px solid rgba(184,152,63,0.06)' }}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: '#8a8078' }}>&copy; 2026 The Quran Guide</p>
            <p className="ins-arabic text-sm" style={{ color: 'rgba(184,152,63,0.25)' }}>
              رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
