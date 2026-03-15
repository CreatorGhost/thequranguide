"use client";

import { useState, useMemo } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import Link from "next/link";
import { SURAHS } from "@/data/surahs";

interface SearchResult {
  arabic: string;
  translation: string;
  surah: string;
  ayah: number;
  surahNumber: number;
}

export default function SearchPage() {
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
    <PageLayout currentPath="/search" footerVariant="minimal">
      <style>{`
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
      `}</style>

      {/* Hero & Search */}
      <section className="pt-32 pb-12 px-6 text-center relative z-10">
        <div className="tqg-divider max-w-sm mx-auto mb-6">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" stroke="#B8983F" strokeWidth="0.5" opacity="0.3"/>
          </svg>
        </div>

        <h1 className="tqg-heading tqg-gold-shimmer text-5xl md:text-7xl mb-4" style={{ fontWeight: 400 }}>
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

      {/* Results */}
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
              <p className="tqg-heading text-lg mb-2" style={{ color: '#D4B85A', fontWeight: 500 }}>
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
              <p className="tqg-heading text-lg mb-2" style={{ color: '#8a8078' }}>
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
                  <div key={i} className="search-result-card tqg-ornamental">
                    {/* Arabic text */}
                    <p className="tqg-arabic text-2xl md:text-3xl mb-4" style={{ color: '#F5E8B0', textAlign: 'right' }}>
                      {r.arabic}
                    </p>

                    {/* Divider */}
                    <div style={{ height: '1px', background: 'rgba(184,152,63,0.08)', margin: '12px 0' }} />

                    {/* Translation */}
                    <p className="tqg-heading text-base mb-3" style={{ color: '#e5e5e5', fontWeight: 400, lineHeight: 1.7, fontStyle: 'italic' }}>
                      &ldquo;{r.translation}&rdquo;
                    </p>

                    {/* Reference + Read link */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="text-xs" style={{ color: 'rgba(184,152,63,0.5)', margin: 0 }}>
                        {r.surah} &middot; {r.surahNumber}:{r.ayah}
                      </p>
                      <Link
                        href={`/read?page=${surahPageMap[r.surahNumber] || 1}`}
                        className="tqg-btn-ghost"
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
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
