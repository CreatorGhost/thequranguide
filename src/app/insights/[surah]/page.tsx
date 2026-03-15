"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
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
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  // scroll to top on surah change
  useEffect(() => { window.scrollTo(0, 0); }, [surahNum]);

  if (!surahInfo) {
    return (
      <div style={{ background: 'var(--tqg-base, #0d0b08)', color: 'var(--tqg-text, #e5e5e5)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div className="text-center">
          <p style={{ fontSize: 48, marginBottom: 16 }}>404</p>
          <p style={{ color: 'var(--tqg-text-muted, #8a8078)' }}>Surah not found</p>
          <Link href="/insights" style={{ color: 'var(--tqg-gold, #B8983F)', display: 'inline-block', marginTop: 16, textDecoration: 'none', borderBottom: '1px solid rgba(184,152,63,0.3)' }}>
            Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  const prevSurah = surahNum > 1 ? SURAHS[surahNum - 2] : null;
  const nextSurah = surahNum < 114 ? SURAHS[surahNum] : null;
  const c = curated; // shorthand

  return (
    <PageLayout currentPath="/insights" footerVariant="minimal">
      <style>{`
        /* Section card */
        .sid-sec {
          background: var(--tqg-surface);
          border: 1px solid var(--tqg-border-subtle);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
        }
        .sid-sec-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--tqg-gold); margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .sid-sec-label::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(184,152,63,0.15), transparent);
        }

        /* Body text */
        .sid-body { font-size: 14px; line-height: 1.85; color: var(--tqg-text-muted); }
        .sid-body p + p { margin-top: 14px; }

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
          font-size: 11px; font-weight: 600; color: var(--tqg-gold);
          margin-bottom: 6px; letter-spacing: 0.06em;
        }

        /* Connection pill */
        .sid-conn {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px; background: var(--tqg-surface-2);
          border: 1px solid var(--tqg-border-subtle);
          border-radius: 12px; text-decoration: none; color: inherit;
          transition: all 0.2s;
        }
        .sid-conn:hover { border-color: rgba(184,152,63,0.2); transform: translateX(4px); }

        /* Lesson group */
        .sid-lesson-cat {
          font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--tqg-gold-light);
          margin-bottom: 10px; padding-bottom: 8px;
          border-bottom: 1px solid rgba(184,152,63,0.1);
        }
        .sid-lesson-pt {
          display: flex; gap: 12px; padding: 10px 0;
          font-size: 14px; line-height: 1.7; color: var(--tqg-text-muted);
        }
        .sid-lesson-pt + .sid-lesson-pt { border-top: 1px solid rgba(255,255,255,0.03); }

        /* Surah structure accordion */
        .sid-flow-item {
          border: 1px solid var(--tqg-border-subtle);
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
          text-align: left; color: var(--tqg-text); font-family: 'Inter', sans-serif;
        }
        .sid-flow-head:hover { background: rgba(184,152,63,0.03); }
        .sid-flow-body { padding: 0 20px 20px 54px; }

        @keyframes sid-fu { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .sid-fade { animation: sid-fu 0.5s ease-out both; }
      `}</style>

      {/* ─── HEADER ─── */}
      <section className="pt-28 pb-6 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/insights" className="text-xs" style={{ color: 'var(--tqg-text-muted)', textDecoration: 'none' }}>Insights</Link>
            <span className="text-xs" style={{ color: 'rgba(184,152,63,0.3)' }}>›</span>
            <span className="text-xs" style={{ color: 'var(--tqg-gold)' }}>{surahInfo.englishName}</span>
          </div>

          <div className="tqg-ornamental p-8 md:p-12 text-center sid-fade">
            <p className="tqg-arabic text-4xl md:text-5xl mb-3" style={{ color: 'rgba(184,152,63,0.5)', lineHeight: 2.8, wordSpacing: 16, letterSpacing: '0.03em' }}>{surahInfo.name}</p>
            <h1 className="tqg-heading tqg-gold-shimmer text-3xl md:text-5xl mb-2" style={{ fontWeight: 400 }}>{surahInfo.englishName}</h1>
            <p className="tqg-heading text-lg italic mb-5" style={{ color: 'var(--tqg-text-muted)', fontWeight: 400 }}>{surahInfo.englishNameTranslation}</p>
            <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
              <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: surahInfo.revelationType === 'Meccan' ? 'rgba(184,152,63,0.1)' : 'rgba(100,180,130,0.1)', color: surahInfo.revelationType === 'Meccan' ? 'var(--tqg-gold)' : '#64B482' }}>
                {surahInfo.revelationType}
              </span>
              <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', color: 'var(--tqg-text-muted)' }}>{surahInfo.numberOfAyahs} Ayahs</span>
              {c && <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', color: 'var(--tqg-text-muted)' }}>#{c.historicalContext.chronologicalOrder} in revelation order</span>}
            </div>
            <Link href={`/read?page=${surahInfo.startPage}`} className="tqg-btn-filled">Read this Surah</Link>
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
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'rgba(184,152,63,0.08)', color: 'var(--tqg-gold-light)' }}>{c.historicalContext.period}</span>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', color: 'var(--tqg-text-muted)' }}>Revealed #{c.historicalContext.chronologicalOrder} of 114</span>
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
                <p className="tqg-heading text-base leading-relaxed" style={{ color: 'var(--tqg-text)', fontWeight: 500 }}>{c.coreMessage.thesis}</p>
              </div>
            </div>
          )}

          {/* ── 4. Surah Structure & Flow ── */}
          {c?.sections && c.sections.length > 0 && (
            <div className="sid-sec sid-fade" style={{ animationDelay: '0.25s' }}>
              <p className="sid-sec-label">Surah Structure &amp; Flow</p>
              <p className="text-xs mb-4" style={{ color: 'var(--tqg-text-muted)' }}>Click each section to explore what Allah is saying and how it connects.</p>
              {c.sections.map((s, i) => {
                const isOpen = expandedSection === i;
                return (
                  <div key={i} className={`sid-flow-item ${isOpen ? 'open' : ''}`}>
                    <button className="sid-flow-head" onClick={() => setExpandedSection(isOpen ? null : i)}>
                      <span style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(184,152,63,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, color: 'var(--tqg-gold)', fontWeight: 600 }}>
                        {s.verseRange}
                      </span>
                      <span className="tqg-heading" style={{ fontSize: 15, fontWeight: 500, flex: 1 }}>{s.title}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--tqg-text-muted)" strokeWidth="1.5"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="sid-flow-body">
                        <p className="text-sm leading-relaxed mb-3" style={{ color: '#c8c0b4' }}>{s.summary}</p>
                        {s.connectionToNext && (
                          <p className="text-xs italic" style={{ color: 'var(--tqg-gold)' }}>→ {s.connectionToNext}</p>
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
                    <h4 className="tqg-heading text-base" style={{ fontWeight: 500 }}>{s.title}</h4>
                    <span className="text-xs" style={{ color: 'var(--tqg-gold)' }}>Verses {s.verseRange}</span>
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
                    <span className="text-xs font-semibold" style={{ color: 'var(--tqg-gold)' }}>Ayah {v.ayah}</span>
                    <Link href={`/read?page=${surahInfo.startPage}`} className="text-xs" style={{ color: 'var(--tqg-text-muted)', textDecoration: 'none', borderBottom: '1px solid rgba(184,152,63,0.15)' }}>
                      Read in Mushaf →
                    </Link>
                  </div>
                  <p className="tqg-arabic text-xl md:text-2xl text-center mb-4" style={{ color: 'var(--tqg-text)', lineHeight: 2.8, wordSpacing: 16, letterSpacing: '0.03em' }}>{v.arabic}</p>
                  <p className="tqg-heading text-sm italic text-center mb-5" style={{ color: '#c8c0b4' }}>&ldquo;{v.translation}&rdquo;</p>

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
                  <Link key={i} href={`/insights/${conn.surah}`} className="sid-conn">
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(184,152,63,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="tqg-heading text-sm" style={{ color: 'var(--tqg-gold)', fontWeight: 500 }}>{conn.surah}</span>
                    </div>
                    <div>
                      <p className="text-sm" style={{ fontWeight: 500, marginBottom: 2 }}>{conn.surahName}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--tqg-text-muted)' }}>{conn.relationship}</p>
                    </div>
                  </Link>
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
              <p className="text-xs mb-4" style={{ color: 'var(--tqg-text-muted)' }}>
                Detailed curated insights for this surah are coming soon. In the meantime, here are excerpts from Ibn Kathir&apos;s tafsir.
              </p>
              <div style={{ maxHeight: 500, overflowY: 'auto', paddingRight: 8 }}>
                {ibnKathir.slice(0, 12).map((entry, i) => (
                  <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < 11 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <span className="text-xs" style={{ color: 'var(--tqg-gold)', marginBottom: 4, display: 'block' }}>Verse {entry.verse_key || entry.verse_number}</span>
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
                    <span className="text-xs" style={{ color: 'var(--tqg-gold)', marginBottom: 4, display: 'block' }}>Verse {entry.verse_key || entry.verse_number}</span>
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
                        <span className="tqg-heading text-lg" style={{ color: 'var(--tqg-gold-light)', fontWeight: 500 }}>{w.transliteration}</span>
                        <span className="text-xs ml-2" style={{ color: 'var(--tqg-text-muted)' }}>— {w.surfaceMeaning}</span>
                      </div>
                      <span className="tqg-arabic text-xl" style={{ color: 'rgba(184,152,63,0.4)' }}>{w.arabic}</span>
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
              <Link href={`/insights/${prevSurah.number}`} className="tqg-btn-ghost">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                {prevSurah.englishName}
              </Link>
            ) : <div />}
            {nextSurah ? (
              <Link href={`/insights/${nextSurah.number}`} className="tqg-btn-ghost">
                {nextSurah.englishName}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            ) : <div />}
          </div>

        </div>
      </section>
    </PageLayout>
  );
}
