import { PageLayout } from "@/components/layout/PageLayout";
import Link from "next/link";

export default function Home() {
  return (
    <PageLayout currentPath="/" footerVariant="full">
      {/* Page-specific styles only — shared design system classes come from design-system.css */}
      <style>{`
        .tqg-central-glow {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 900px;
          height: 900px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,152,63,0.09) 0%, rgba(139,105,20,0.04) 30%, rgba(184,152,63,0.015) 50%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .tqg-diamond {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(184,152,63,0.2);
          transform: rotate(45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.2s ease;
        }
        .tqg-diamond > * {
          transform: rotate(-45deg);
        }
        .tqg-card:hover .tqg-diamond {
          border-color: rgba(184,152,63,0.4);
        }

        .tqg-feature-num {
          font-family: 'EB Garamond', serif;
          color: rgba(184,152,63,0.12);
          font-size: 56px;
          line-height: 1;
          font-weight: 400;
          position: absolute;
          top: 16px;
          right: 20px;
        }

        @keyframes tqg-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .tqg-shamsa-spin {
          animation: tqg-rotate 80s linear infinite;
        }

        @keyframes tqg-pulse {
          0%, 100% { opacity: 0.25; height: 28px; }
          50% { opacity: 0.7; height: 40px; }
        }
        .tqg-scroll-line {
          width: 1px;
          background: var(--gold);
          animation: tqg-pulse 3s ease-in-out infinite;
        }

        .tqg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L47.32 16.18L64.72 12.36L56.18 27.82L72.36 35.28L55.28 40L72.36 44.72L56.18 52.18L64.72 67.64L47.32 63.82L40 80L32.68 63.82L15.28 67.64L23.82 52.18L7.64 44.72L24.72 40L7.64 35.28L23.82 27.82L15.28 12.36L32.68 16.18L40 0z' fill='none' stroke='rgba(184,152,63,0.025)' stroke-width='0.5'/%3E%3C/svg%3E");
          background-repeat: repeat;
        }
      `}</style>

      {/* Single centered golden glow */}
      <div className="tqg-central-glow" />

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-14 relative">
        <div className="relative z-10 text-center max-w-5xl mx-auto">

          {/* Shamsa medallion */}
          <div className="w-36 h-36 mx-auto mb-10">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <g className="tqg-shamsa-spin" style={{ transformOrigin: '60px 60px' }}>
                <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(184,152,63,0.18)" strokeWidth="0.5"/>
                {Array.from({length: 16}).map((_, i) => {
                  const angle = (i * 22.5) * Math.PI / 180;
                  const x1 = 60 + 45 * Math.cos(angle);
                  const y1 = 60 + 45 * Math.sin(angle);
                  const x2 = 60 + 55 * Math.cos(angle);
                  const y2 = 60 + 55 * Math.sin(angle);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(184,152,63,0.22)" strokeWidth="0.5"/>;
                })}
              </g>
              <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(184,152,63,0.14)" strokeWidth="0.5"/>
              <circle cx="60" cy="60" r="28" fill="none" stroke="rgba(184,152,63,0.1)" strokeWidth="0.5"/>
              <path d="M60 25 L65 50 L85 45 L65 55 L75 75 L60 58 L45 75 L55 55 L35 45 L55 50 Z" fill="none" stroke="rgba(184,152,63,0.18)" strokeWidth="0.5"/>
              <circle cx="60" cy="60" r="3" fill="rgba(184,152,63,0.18)"/>
            </svg>
          </div>

          {/* Bismillah in ornamental frame */}
          <div className="tqg-ornamental inline-block px-10 py-5 mb-12">
            <p className="tqg-arabic text-xl md:text-3xl" style={{ color: '#B8983F' }}>
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
          </div>

          {/* Main heading */}
          <h1 className="tqg-heading text-6xl md:text-8xl lg:text-9xl leading-none mb-8" style={{ fontWeight: 400 }}>
            <span style={{ color: '#e5e5e5' }}>The Quran</span>
            <br />
            <span className="tqg-gold-gradient">Guide</span>
          </h1>

          <p className="text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: '#8a8078' }}>
            Your AI-powered companion for reading, understanding, and living the Holy Quran.
            Authentic mushaf. Scholarly tafsir. Precise audio. One interface.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-5 mb-16">
            <Link href="/read" className="tqg-btn-filled px-8 py-3 rounded-xl text-sm inline-block">
              Open the Quran
            </Link>
            <Link href="#features" className="tqg-btn-ghost px-8 py-3 rounded-xl text-sm inline-block">
              Discover Features
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs tracking-[0.25em] uppercase" style={{ color: '#8a8078' }}>Explore</span>
            <div className="tqg-divider max-w-xs">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="1.5" y="1.5" width="7" height="7" transform="rotate(45 5 5)" stroke="#B8983F" strokeWidth="0.5" opacity="0.35"/>
              </svg>
            </div>
            <div className="tqg-scroll-line" />
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="px-6 py-28 tqg-pattern relative">
        <div className="max-w-6xl mx-auto relative z-10">

          <div className="tqg-divider max-w-sm mx-auto mb-6">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" stroke="#B8983F" strokeWidth="0.5" opacity="0.3"/>
            </svg>
          </div>
          <h2 className="tqg-heading tqg-gold-gradient text-3xl md:text-5xl text-center mb-3" style={{ fontWeight: 400 }}>
            Sacred Features
          </h2>
          <p className="text-sm text-center mb-20" style={{ color: '#8a8078' }}>
            Every tool designed to deepen your connection with the Quran
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px]" style={{ background: 'rgba(184,152,63,0.04)' }}>

            {/* Mushaf Display */}
            <Link href="/read" className="tqg-card tqg-ornamental p-8 md:col-span-2 md:row-span-2" style={{ background: 'var(--base)', color: 'inherit', display: 'block' }}>
              <span className="tqg-feature-num">01</span>
              <div className="flex items-center gap-4 mb-5">
                <div className="tqg-diamond">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8983F" strokeWidth="1.5">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3z"/>
                  </svg>
                </div>
                <h3 className="tqg-heading text-2xl md:text-3xl" style={{ fontWeight: 500 }}>Mushaf-Style Display</h3>
              </div>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#8a8078' }}>
                All 604 pages of the Uthmani mushaf, faithfully rendered with the standard Madani print layout.
                Navigate by page, surah, juz, or hizb with precision — a digital mushaf that honors the physical experience.
              </p>
              <div className="tqg-ornamental p-5" style={{ background: 'rgba(184,152,63,0.02)' }}>
                <p className="tqg-arabic text-xl md:text-2xl text-center" style={{ color: 'rgba(184,152,63,0.45)' }}>
                  ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ
                </p>
                <p className="text-xs text-center mt-3 italic" style={{ color: '#8a8078', fontFamily: "'EB Garamond', serif" }}>
                  All praise is due to Allah, Lord of the worlds
                </p>
              </div>
            </Link>

            {/* Live Translation */}
            <Link href="/read" className="tqg-card p-6 relative" style={{ background: 'var(--base)', color: 'inherit', display: 'block' }}>
              <span className="tqg-feature-num text-4xl">02</span>
              <div className="tqg-diamond mb-5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8983F" strokeWidth="1.5">
                  <path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1"/>
                  <path d="M12 22l5-10 5 10M15.7 18.5h6.6"/>
                </svg>
              </div>
              <h3 className="tqg-heading text-xl mb-2" style={{ fontWeight: 500 }}>Live Translation</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#8a8078' }}>
                Tap any ayah for instant translation. Word-by-word mode maps each Arabic word to its English meaning.
              </p>
            </Link>

            {/* Audio Recitation */}
            <Link href="/read" className="tqg-card p-6 relative" style={{ background: 'var(--base)', color: 'inherit', display: 'block' }}>
              <span className="tqg-feature-num text-4xl">03</span>
              <div className="tqg-diamond mb-5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8983F" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <h3 className="tqg-heading text-xl mb-2" style={{ fontWeight: 500 }}>Audio Recitation</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#8a8078' }}>
                Three world-class reciters. Variable speed. Loop mode. Real-time ayah highlighting synced to audio.
              </p>
            </Link>

            {/* AI Tafsir */}
            <Link href="/search" className="tqg-card p-6 relative" style={{ background: 'var(--base)', color: 'inherit', display: 'block' }}>
              <span className="tqg-feature-num text-4xl">04</span>
              <div className="tqg-diamond mb-5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8983F" strokeWidth="1.5">
                  <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
                  <path d="M10 21h4"/>
                </svg>
              </div>
              <h3 className="tqg-heading text-xl mb-2" style={{ fontWeight: 500 }}>AI Tafsir</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#8a8078' }}>
                Ask questions. Receive answers grounded in Ibn Kathir, Al-Jalalayn, Al-Tabari. Every response cited.
              </p>
            </Link>

            {/* Hadith Links */}
            <Link href="/learn" className="tqg-card p-6 relative" style={{ background: 'var(--base)', color: 'inherit', display: 'block' }}>
              <span className="tqg-feature-num text-4xl">05</span>
              <div className="tqg-diamond mb-5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8983F" strokeWidth="1.5">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </div>
              <h3 className="tqg-heading text-xl mb-2" style={{ fontWeight: 500 }}>Hadith Links</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#8a8078' }}>
                Related ahadith from the six major collections. Full grading. Complete chain of narration.
              </p>
            </Link>

            {/* Reading Tracker */}
            <Link href="/khatmah" className="tqg-card p-6 relative" style={{ background: 'var(--base)', color: 'inherit', display: 'block' }}>
              <span className="tqg-feature-num text-4xl">06</span>
              <div className="tqg-diamond mb-5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8983F" strokeWidth="1.5">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <h3 className="tqg-heading text-xl mb-2" style={{ fontWeight: 500 }}>Reading Tracker</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#8a8078' }}>
                Daily goals. Streaks. Khatmah counter. Reading circles for communal completion of the Quran.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Verse of the Day */}
      <section className="px-6 py-32 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="tqg-line mb-20" />

          <div className="tqg-divider max-w-sm mx-auto mb-6">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" stroke="#B8983F" strokeWidth="0.5" opacity="0.3"/>
            </svg>
          </div>
          <p className="text-xs tracking-[0.3em] uppercase text-center mb-16" style={{ color: '#B8983F' }}>
            Verse of the Day
          </p>

          <div className="tqg-ornamental px-8 md:px-16 py-14 text-center relative">
            <p className="tqg-arabic text-4xl md:text-6xl lg:text-7xl mb-10" style={{ color: '#e5e5e5' }}>
              وَمَنْ يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُ
            </p>

            <div className="tqg-line max-w-16 mx-auto mb-10" />

            <p className="tqg-heading text-xl md:text-2xl italic font-light mb-4" style={{ color: '#8a8078' }}>
              &ldquo;And whoever relies upon Allah — then He is sufficient for him.&rdquo;
            </p>
            <p className="text-sm tracking-wide" style={{ color: 'rgba(184,152,63,0.5)' }}>
              Surah At-Talaq &middot; 65:3
            </p>
          </div>

          <div className="tqg-line mt-20" />
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-4 gap-0">
            {[
              { number: '604', label: 'Pages' },
              { number: '114', label: 'Surahs' },
              { number: '30', label: 'Juz' },
              { number: '6,236', label: 'Ayahs' },
            ].map((stat, i) => (
              <div key={stat.label} className="text-center py-10" style={{ borderLeft: i > 0 ? '1px solid rgba(184,152,63,0.08)' : 'none' }}>
                <p className="tqg-heading tqg-gold-gradient text-4xl md:text-5xl mb-1.5" style={{ fontWeight: 400 }}>{stat.number}</p>
                <p className="text-xs tracking-widest uppercase" style={{ color: '#8a8078' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 text-center relative">
        <div className="max-w-xl mx-auto relative z-10">
          <div className="mx-auto mb-10 w-16 h-16">
            <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
              <circle cx="32" cy="32" r="28" stroke="rgba(184,152,63,0.15)" strokeWidth="0.5"/>
              <circle cx="32" cy="32" r="20" stroke="rgba(184,152,63,0.1)" strokeWidth="0.5"/>
              <path d="M32 8L35 26L50 20L37 30L46 46L32 34L18 46L27 30L14 20L29 26Z" fill="none" stroke="rgba(184,152,63,0.15)" strokeWidth="0.5"/>
            </svg>
          </div>

          <h2 className="tqg-heading text-4xl md:text-6xl mb-6" style={{ fontWeight: 400, color: '#e5e5e5' }}>
            Begin Your <span className="tqg-gold-gradient">Journey</span>
          </h2>
          <p className="text-sm mb-10" style={{ color: '#8a8078' }}>
            Open the Quran and let every verse guide your path.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <Link href="/read" className="tqg-btn-filled px-10 py-3.5 rounded-xl text-sm inline-block">
              Begin Reading
            </Link>
            <Link href="/dua" className="tqg-btn-ghost px-8 py-3 rounded-xl text-sm inline-block">
              Browse Duas
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 mt-2">
            {[
              { label: 'Explore Insights', href: '/insights' },
              { label: 'Learn Arabic', href: '/learn' },
              { label: 'Take a Quiz', href: '/quiz' },
              { label: 'Track Khatmah', href: '/khatmah' },
            ].map((link) => (
              <Link key={link.label} href={link.href} className="text-xs" style={{ color: '#8a8078', borderBottom: '1px solid rgba(184,152,63,0.15)', paddingBottom: '1px' }}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="tqg-divider max-w-32 mx-auto mt-14">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" stroke="#B8983F" strokeWidth="0.5" opacity="0.25"/>
            </svg>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
