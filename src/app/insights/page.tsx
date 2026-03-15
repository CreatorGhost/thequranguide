"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { SURAHS } from "@/data/surahs";
import { hasCuratedInsight, getCuratedSurahNumbers } from "@/data/surah-insights";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Filter = "all" | "featured" | "meccan" | "medinan";

const STATIC_FEATURED = getCuratedSurahNumbers();

export default function InsightsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [apiInsights, setApiInsights] = useState<Set<number>>(new Set());
  const [featuredCount, setFeaturedCount] = useState(STATIC_FEATURED.length);

  // Fetch insight availability from API
  useEffect(() => {
    fetch(`${API_BASE}/api/insights`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.insights) {
          const withInsight = new Set<number>(
            data.insights
              .filter((i: { has_insight: boolean }) => i.has_insight)
              .map((i: { surah: number }) => i.surah)
          );
          setApiInsights(withInsight);
          setFeaturedCount(Math.max(withInsight.size, STATIC_FEATURED.length));
        }
      })
      .catch(() => {
        // API failure — use static data only
      });
  }, []);

  const hasFeaturedInsight = (surahNum: number) =>
    apiInsights.has(surahNum) || hasCuratedInsight(surahNum);

  const filtered = SURAHS.filter((s) => {
    if (filter === "featured" && !hasFeaturedInsight(s.number)) return false;
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
    <PageLayout currentPath="/insights" footerVariant="minimal">
      <style>{`
        .ins-filter-btn {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid var(--tqg-border-subtle);
          background: transparent;
          color: var(--tqg-text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }
        .ins-filter-btn:hover {
          border-color: rgba(184,152,63,0.25);
          color: var(--tqg-text);
        }
        .ins-filter-btn.active {
          background: rgba(184,152,63,0.12);
          border-color: rgba(184,152,63,0.35);
          color: var(--tqg-gold-light);
        }

        .ins-search {
          background: var(--tqg-surface);
          border: 1px solid var(--tqg-border-subtle);
          border-radius: 10px;
          padding: 10px 16px 10px 40px;
          color: var(--tqg-text);
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
          color: var(--tqg-text-muted);
        }

        .ins-card-featured::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--tqg-gold), transparent);
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

        @keyframes ins-fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ins-fade { animation: ins-fadeIn 0.4s ease-out both; }
      `}</style>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-12 px-6 text-center relative z-10">
        <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--tqg-gold)' }}>
          Surah Insights
        </p>
        <h1 className="tqg-heading tqg-gold-gradient text-4xl md:text-6xl mb-4" style={{ fontWeight: 400 }}>
          Discover the Quran
        </h1>
        <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--tqg-text-muted)' }}>
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
                  {f.key === "featured" && ` (${featuredCount})`}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-auto">
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="var(--tqg-text-muted)" strokeWidth="1.5"
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
              <p className="text-sm" style={{ color: 'var(--tqg-text-muted)' }}>No surahs match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((s, i) => {
                const isFeatured = hasFeaturedInsight(s.number);
                return (
                  <Link
                    key={s.number}
                    href={`/insights/${s.number}`}
                    className={`tqg-card ins-fade block relative overflow-hidden no-underline ${isFeatured ? "ins-card-featured" : ""}`}
                    style={{
                      animationDelay: `${Math.min(i * 30, 600)}ms`,
                      padding: 20,
                      cursor: 'pointer',
                      color: 'inherit',
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="tqg-heading text-lg flex items-center justify-center"
                          style={{
                            width: 36,
                            height: 36,
                            border: '1px solid rgba(184,152,63,0.2)',
                            transform: 'rotate(45deg)',
                            flexShrink: 0,
                          }}
                        >
                          <span style={{ transform: 'rotate(-45deg)', display: 'block', color: 'var(--tqg-gold)', fontSize: 13, fontWeight: 500 }}>
                            {s.number}
                          </span>
                        </span>
                        <div>
                          <h3 className="tqg-heading text-base" style={{ fontWeight: 500 }}>
                            {s.englishName}
                          </h3>
                          <p className="text-xs" style={{ color: 'var(--tqg-text-muted)' }}>
                            {s.englishNameTranslation}
                          </p>
                        </div>
                      </div>
                      <span className="tqg-arabic text-lg" style={{ color: 'rgba(184,152,63,0.4)' }}>
                        {s.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="ins-badge"
                        style={{
                          background: s.revelationType === 'Meccan' ? 'rgba(184,152,63,0.08)' : 'rgba(100,180,130,0.08)',
                          color: s.revelationType === 'Meccan' ? 'var(--tqg-gold)' : '#64B482',
                        }}
                      >
                        {s.revelationType}
                      </span>
                      <span className="ins-badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--tqg-text-muted)' }}>
                        {s.numberOfAyahs} Ayahs
                      </span>
                      {isFeatured && (
                        <span className="ins-badge" style={{ background: 'rgba(184,152,63,0.12)', color: 'var(--tqg-gold-light)' }}>
                          ★ Featured
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
