"use client";

import { useState, useMemo } from "react";
import { SURAHS } from "@/data/surahs";

interface SearchResult {
  arabic: string;
  translation: string;
  surah: string;
  ayah: number;
  surahNumber: number;
}

export default function SearchPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const surahPageMap = useMemo(() => {
    const map: Record<number, number> = {};
    for (const s of SURAHS) {
      map[s.number] = s.startPage;
    }
    return map;
  }, []);

  const SUGGESTED_QUERIES = [
    "verses about patience",
    "what does the Quran say about charity",
    "mercy of Allah",
    "stories of prophets",
    "verses about forgiveness",
    "paradise in the Quran",
    "guidance and light",
    "gratitude and thankfulness",
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch {
      setError("Semantic search requires the backend to be running. Please start the API server and try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

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

        .search-page {
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

        .search-heading { font-family: 'EB Garamond', serif; }
        .search-arabic {
          font-family: 'PDMS Saleem QuranFont', 'Amiri', serif;
          direction: rtl;
          line-height: 2.2;
        }

        .search-gold-shimmer {
          background: linear-gradient(135deg, #8B6914 10%, #B8983F 35%, #D4B85A 50%, #E8D5A0 55%, #D4B85A 65%, #B8983F 80%, #8B6914 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: search-shimmer 6s ease-in-out infinite;
        }
        @keyframes search-shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .search-gold-gradient {
          background: linear-gradient(135deg, #8B6914 10%, #B8983F 40%, #D4B85A 60%, #B8983F 90%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .search-glow {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 900px; height: 900px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,152,63,0.09) 0%, rgba(139,105,20,0.04) 30%, rgba(184,152,63,0.015) 50%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .search-nav {
          background: rgba(13,11,8,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .search-line-subtle { height: 1px; background: rgba(184,152,63,0.06); }

        .search-divider {
          display: flex; align-items: center; justify-content: center; gap: 16px;
        }
        .search-divider::before, .search-divider::after {
          content: ''; height: 1px; flex: 1;
          background: linear-gradient(90deg, transparent, rgba(184,152,63,0.18));
        }
        .search-divider::after {
          background: linear-gradient(90deg, rgba(184,152,63,0.18), transparent);
        }

        .search-input-wrapper {
          position: relative;
          max-width: 640px;
          margin: 0 auto;
        }
        .search-input {
          width: 100%;
          padding: 16px 56px 16px 24px;
          background: var(--surface);
          border: 1px solid rgba(184,152,63,0.15);
          border-radius: 16px;
          color: var(--text);
          font-family: 'EB Garamond', serif;
          font-size: 18px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input::placeholder {
          color: rgba(138,128,120,0.6);
          font-style: italic;
        }
        .search-input:focus {
          border-color: rgba(184,152,63,0.4);
          box-shadow: 0 0 32px rgba(184,152,63,0.08);
        }

        .search-submit {
          position: absolute;
          right: 8px; top: 50%;
          transform: translateY(-50%);
          width: 40px; height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #B8983F, #9A7B2F);
          border: none;
          color: #0d0b08;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .search-submit:hover {
          box-shadow: 0 0 20px rgba(184,152,63,0.3);
        }
        .search-submit:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .search-btn-ghost {
          border: 1px solid rgba(184,152,63,0.35);
          color: var(--gold);
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          letter-spacing: 0.04em;
          transition: all 0.2s ease-out;
          background: none;
          cursor: pointer;
        }
        .search-btn-ghost:hover {
          background: rgba(184,152,63,0.08);
          border-color: rgba(184,152,63,0.55);
        }

        .search-btn-filled {
          background: linear-gradient(135deg, #B8983F, #9A7B2F);
          color: #0d0b08;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: all 0.2s ease-out;
          border: none;
          cursor: pointer;
        }
        .search-btn-filled:hover {
          box-shadow: 0 0 24px rgba(184,152,63,0.25);
          transform: translateY(-1px);
        }

        .search-suggestion {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 24px;
          border: 1px solid rgba(184,152,63,0.12);
          font-size: 13px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
          background: none;
          font-family: 'Inter', sans-serif;
        }
        .search-suggestion:hover {
          border-color: rgba(184,152,63,0.35);
          color: var(--gold);
          background: rgba(184,152,63,0.05);
        }

        .search-result-card {
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 28px 32px;
          transition: all 0.25s ease-out;
        }
        .search-result-card:hover {
          border-color: rgba(184,152,63,0.2);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }

        .search-error-box {
          background: rgba(184,152,63,0.04);
          border: 1px solid rgba(184,152,63,0.12);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          max-width: 500px;
          margin: 0 auto;
        }

        @keyframes search-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .search-spinner {
          width: 32px; height: 32px;
          border: 2px solid rgba(184,152,63,0.1);
          border-top-color: #D4B85A;
          border-radius: 50%;
          animation: search-spin 0.8s linear infinite;
        }

        .search-noise::after {
          content: '';
          position: fixed; inset: 0;
          opacity: 0.025; pointer-events: none; z-index: 9999;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 256px 256px;
        }

        .search-ornamental {
          position: relative;
        }
        .search-ornamental::before, .search-ornamental::after {
          content: '';
          position: absolute;
          width: 48px; height: 48px;
          border-color: rgba(184,152,63,0.20);
          border-style: solid;
        }
        .search-ornamental::before { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
        .search-ornamental::after { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }
      `}</style>

      <div className="search-page search-noise">
        <div className="search-glow" />

        {/* ═══ NAVIGATION ═══ */}
        <nav className="search-nav fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="#B8983F" strokeWidth="0.7" opacity="0.5"/>
                <circle cx="12" cy="12" r="4" stroke="#B8983F" strokeWidth="0.5" opacity="0.35"/>
                <path d="M12 2L12 4M12 20L12 22M2 12L4 12M20 12L22 12M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="#B8983F" strokeWidth="0.5" opacity="0.3"/>
              </svg>
              <a href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
                <span className="search-heading text-lg" style={{ color: '#B8983F', fontWeight: 500 }}>The Quran Guide</span>
                <span className="text-sm hidden sm:inline" style={{ color: 'rgba(184,152,63,0.5)', fontFamily: "'Amiri', serif", direction: 'rtl', lineHeight: 1 }}>دليل القرآن</span>
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
                  style={{ color: item.href === '/search' ? '#D4B85A' : '#8a8078', textDecoration: 'none' }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a href="/read" className="search-btn-filled px-5 py-2 rounded-lg text-sm inline-block hidden sm:inline-block" style={{ textDecoration: 'none' }}>
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
                <a key={item.label} href={item.href} className="block py-2 text-sm" style={{ color: item.href === '/search' ? '#D4B85A' : '#8a8078', textDecoration: 'none' }}>
                  {item.label}
                </a>
              ))}
            </div>
          )}
          <div className="search-line-subtle" />
        </nav>

        {/* ═══ HERO & SEARCH ═══ */}
        <section className="pt-32 pb-12 px-6 text-center relative z-10">
          <div className="search-divider max-w-sm mx-auto mb-6">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" stroke="#B8983F" strokeWidth="0.5" opacity="0.3"/>
            </svg>
          </div>

          <h1 className="search-heading search-gold-shimmer text-5xl md:text-7xl mb-4" style={{ fontWeight: 400 }}>
            Search the Quran
          </h1>
          <p className="text-sm md:text-base max-w-lg mx-auto mb-10" style={{ color: '#8a8078' }}>
            Ask questions in natural language and find relevant verses from the Holy Quran.
          </p>

          {/* Search input */}
          <div className="search-input-wrapper mb-8">
            <input
              type="text"
              className="search-input"
              placeholder="What does the Quran say about..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="search-submit"
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              aria-label="Search"
            >
              {loading ? (
                <div className="search-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              )}
            </button>
          </div>

          {/* Suggestion chips */}
          {!searched && (
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
              {SUGGESTED_QUERIES.map((sq) => (
                <button
                  key={sq}
                  className="search-suggestion"
                  onClick={() => {
                    setQuery(sq);
                  }}
                >
                  {sq}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ═══ RESULTS ═══ */}
        <section className="px-6 pb-32 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Loading state */}
            {loading && (
              <div className="text-center py-20">
                <div className="search-spinner mx-auto mb-4" />
                <p className="text-sm" style={{ color: '#8a8078' }}>Searching the Quran...</p>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="search-error-box">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B8983F" strokeWidth="1" style={{ margin: '0 auto 16px', opacity: 0.5 }}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <p className="search-heading text-lg mb-2" style={{ color: '#D4B85A', fontWeight: 500 }}>
                  Backend Not Available
                </p>
                <p className="text-sm" style={{ color: '#8a8078' }}>
                  {error}
                </p>
              </div>
            )}

            {/* No results state */}
            {searched && !loading && !error && results.length === 0 && (
              <div className="text-center py-16">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#B8983F" strokeWidth="0.8" style={{ margin: '0 auto 16px', opacity: 0.35 }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <p className="search-heading text-lg mb-2" style={{ color: '#8a8078' }}>
                  No results found
                </p>
                <p className="text-sm" style={{ color: 'rgba(138,128,120,0.6)' }}>
                  Try a different query or rephrase your question.
                </p>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && !loading && (
              <>
                <p className="text-xs mb-6" style={{ color: '#8a8078' }}>
                  {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
                </p>
                <div className="flex flex-col gap-5">
                  {results.map((r, i) => (
                    <div key={i} className="search-result-card search-ornamental">
                      {/* Arabic text */}
                      <p className="search-arabic text-2xl md:text-3xl mb-4" style={{ color: '#F5E8B0', textAlign: 'right' }}>
                        {r.arabic}
                      </p>

                      {/* Divider */}
                      <div style={{ height: '1px', background: 'rgba(184,152,63,0.08)', margin: '12px 0' }} />

                      {/* Translation */}
                      <p className="search-heading text-base mb-3" style={{ color: '#e5e5e5', fontWeight: 400, lineHeight: 1.7, fontStyle: 'italic' }}>
                        &ldquo;{r.translation}&rdquo;
                      </p>

                      {/* Reference + Read link */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="text-xs" style={{ color: 'rgba(184,152,63,0.5)', margin: 0 }}>
                          {r.surah} &middot; {r.surahNumber}:{r.ayah}
                        </p>
                        <a
                          href={`/read?page=${surahPageMap[r.surahNumber] || 1}`}
                          className="search-btn-ghost"
                          style={{
                            padding: '4px 14px', borderRadius: '8px', fontSize: '11px',
                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px',
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z"/>
                            <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z"/>
                          </svg>
                          Read in Mushaf
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="px-6 py-12 relative z-10" style={{ borderTop: '1px solid rgba(184,152,63,0.06)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs" style={{ color: '#8a8078' }}>&copy; 2026 The Quran Guide</p>
              <p className="search-arabic text-sm" style={{ color: 'rgba(184,152,63,0.25)' }}>
                وَنُنَزِّلُ مِنَ ٱلْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
