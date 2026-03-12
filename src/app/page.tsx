"use client";

import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

        /* ─── DESIGN SYSTEM ─── */
        .tqg {
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
        }

        .tqg-heading {
          font-family: 'EB Garamond', serif;
        }

        .tqg-arabic {
          font-family: 'PDMS Saleem QuranFont', 'Amiri', serif;
          direction: rtl;
          line-height: 2.2;
        }

        /* ─── GOLD TREATMENTS ─── */
        .tqg-gold-gradient {
          background: linear-gradient(135deg, #8B6914 10%, #B8983F 40%, #D4B85A 60%, #B8983F 90%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tqg-gold-shimmer {
          background: linear-gradient(135deg, #8B6914 10%, #B8983F 35%, #D4B85A 50%, #E8D5A0 55%, #D4B85A 65%, #B8983F 80%, #8B6914 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: tqg-shimmer 6s ease-in-out infinite;
        }

        @keyframes tqg-shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        /* ─── NAVIGATION ─── */
        .tqg-nav {
          background: rgba(13,11,8,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        /* ─── SINGLE CENTERED GLOW ─── */
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

        /* ─── LINES ─── */
        .tqg-line {
          height: 1px;
          background: var(--border);
        }

        .tqg-line-subtle {
          height: 1px;
          background: rgba(184,152,63,0.06);
        }

        .tqg-line-gradient {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(184,152,63,0.18) 20%, rgba(184,152,63,0.25) 50%, rgba(184,152,63,0.18) 80%, transparent);
        }

        /* ─── ORNAMENTAL FRAMES ─── */
        .tqg-ornamental {
          position: relative;
        }
        .tqg-ornamental::before,
        .tqg-ornamental::after {
          content: '';
          position: absolute;
          width: 64px;
          height: 64px;
          border-color: rgba(184,152,63,0.30);
          border-style: solid;
          transition: border-color 0.3s ease;
        }
        .tqg-ornamental::before {
          top: -1px;
          left: -1px;
          border-width: 1px 0 0 1px;
        }
        .tqg-ornamental::after {
          bottom: -1px;
          right: -1px;
          border-width: 0 1px 1px 0;
        }
        .tqg-ornamental:hover::before,
        .tqg-ornamental:hover::after {
          border-color: rgba(184,152,63,0.45);
        }

        /* ─── DIVIDER WITH DIAMOND ─── */
        .tqg-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .tqg-divider::before,
        .tqg-divider::after {
          content: '';
          height: 1px;
          flex: 1;
          background: linear-gradient(90deg, transparent, rgba(184,152,63,0.18));
        }
        .tqg-divider::after {
          background: linear-gradient(90deg, rgba(184,152,63,0.18), transparent);
        }

        /* ─── CARDS ─── */
        .tqg-card {
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          position: relative;
          transition: all 0.2s ease-out;
        }
        .tqg-card:hover {
          border-color: rgba(184,152,63,0.15);
        }

        /* ─── BUTTONS ─── */
        .tqg-btn-filled {
          background: linear-gradient(135deg, #B8983F, #9A7B2F);
          color: #0d0b08;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: all 0.2s ease-out;
          box-shadow: 0 0 0 0 rgba(184,152,63,0);
        }
        .tqg-btn-filled:hover {
          box-shadow: 0 0 24px rgba(184,152,63,0.25);
          transform: translateY(-1px);
        }

        .tqg-btn-ghost {
          border: 1px solid rgba(184,152,63,0.35);
          color: var(--gold);
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          letter-spacing: 0.04em;
          transition: all 0.2s ease-out;
        }
        .tqg-btn-ghost:hover {
          background: rgba(184,152,63,0.08);
          border-color: rgba(184,152,63,0.55);
        }

        .tqg-btn-nav {
          background: linear-gradient(135deg, #B8983F, #9A7B2F);
          color: #0d0b08;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: all 0.2s ease-out;
        }
        .tqg-btn-nav:hover {
          box-shadow: 0 0 16px rgba(184,152,63,0.2);
        }

        /* ─── FEATURE DIAMOND ICON ─── */
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

        /* ─── NUMBERED FEATURES ─── */
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

        /* ─── SHAMSA MEDALLION ─── */
        @keyframes tqg-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .tqg-shamsa-spin {
          animation: tqg-rotate 80s linear infinite;
        }

        /* ─── SCROLL INDICATOR ─── */
        @keyframes tqg-pulse {
          0%, 100% { opacity: 0.25; height: 28px; }
          50% { opacity: 0.7; height: 40px; }
        }
        .tqg-scroll-line {
          width: 1px;
          background: var(--gold);
          animation: tqg-pulse 3s ease-in-out infinite;
        }

        /* ─── SUBTLE PATTERN ─── */
        .tqg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L47.32 16.18L64.72 12.36L56.18 27.82L72.36 35.28L55.28 40L72.36 44.72L56.18 52.18L64.72 67.64L47.32 63.82L40 80L32.68 63.82L15.28 67.64L23.82 52.18L7.64 44.72L24.72 40L7.64 35.28L23.82 27.82L15.28 12.36L32.68 16.18L40 0z' fill='none' stroke='rgba(184,152,63,0.025)' stroke-width='0.5'/%3E%3C/svg%3E");
          background-repeat: repeat;
        }

        /* ─── NOISE ─── */
        .tqg-noise::after {
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
      `}</style>

      <div className="tqg tqg-noise min-h-screen">
        {/* Single centered golden glow — fixed, flows with scroll */}
        <div className="tqg-central-glow" />

        {/* ═══ NAVIGATION ═══ */}
        <nav className="tqg-nav fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="#B8983F" strokeWidth="0.7" opacity="0.5"/>
                <circle cx="12" cy="12" r="4" stroke="#B8983F" strokeWidth="0.5" opacity="0.35"/>
                <path d="M12 2L12 4M12 20L12 22M2 12L4 12M20 12L22 12M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="#B8983F" strokeWidth="0.5" opacity="0.3"/>
              </svg>
              <a href="/" className="tqg-heading text-lg" style={{ color: '#B8983F', fontWeight: 500, textDecoration: 'none' }}>
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
                <a key={item.label} href={item.href} className="text-sm transition-colors duration-150" style={{ color: item.href === '/' ? '#D4B85A' : '#8a8078', textDecoration: 'none' }}>
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a href="/read" className="tqg-btn-nav px-5 py-2 rounded-lg text-sm inline-block hidden sm:inline-block">
                Begin Reading
              </a>
              {/* Mobile menu toggle */}
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
          {/* Mobile dropdown */}
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
                <a
                  key={item.label}
                  href={item.href}
                  className="block py-2 text-sm"
                  style={{ color: '#8a8078', textDecoration: 'none' }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
          <div className="tqg-line-subtle" />
        </nav>

        {/* ═══ HERO ═══ */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-14 relative">
          <div className="relative z-10 text-center max-w-5xl mx-auto">

            {/* Shamsa medallion — more visible with warm gold */}
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

            {/* Bismillah in ornamental frame — more visible gold */}
            <div className="tqg-ornamental inline-block px-10 py-5 mb-12">
              <p className="tqg-arabic text-xl md:text-3xl" style={{ color: '#B8983F' }}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </p>
            </div>

            {/* Main heading — "The Quran" white on top, "Guide" gold below */}
            <h1 className="tqg-heading text-6xl md:text-8xl lg:text-9xl leading-none mb-8" style={{ fontWeight: 400 }}>
              <span style={{ color: '#e5e5e5' }}>The Quran</span>
              <br />
              <span className="tqg-gold-gradient">Guide</span>
            </h1>

            <p className="text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: '#8a8078' }}>
              Your AI-powered companion for reading, understanding, and living the Holy Quran.
              Authentic mushaf. Scholarly tafsir. Precise audio. One interface.
            </p>

            {/* Two CTA buttons matching screenshot */}
            <div className="flex items-center justify-center gap-5 mb-16">
              <a href="/read" className="tqg-btn-filled px-8 py-3 rounded-xl text-sm inline-block">
                Open the Quran
              </a>
              <a href="#features" className="tqg-btn-ghost px-8 py-3 rounded-xl text-sm inline-block">
                Discover Features
              </a>
            </div>

            {/* "EXPLORE" label + scroll indicator matching screenshot */}
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

        {/* ═══ FEATURES BENTO GRID ═══ */}
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

              {/* Mushaf Display — large */}
              <a href="/read" className="tqg-card tqg-ornamental p-8 md:col-span-2 md:row-span-2" style={{ background: 'var(--base)', textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
              </a>

              {/* Live Translation */}
              <a href="/read" className="tqg-card p-6 relative" style={{ background: 'var(--base)', textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
              </a>

              {/* Audio Recitation */}
              <a href="/read" className="tqg-card p-6 relative" style={{ background: 'var(--base)', textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
              </a>

              {/* AI Tafsir */}
              <a href="/search" className="tqg-card p-6 relative" style={{ background: 'var(--base)', textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
              </a>

              {/* Hadith Links */}
              <a href="/learn" className="tqg-card p-6 relative" style={{ background: 'var(--base)', textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
              </a>

              {/* Reading Tracker */}
              <a href="/khatmah" className="tqg-card p-6 relative" style={{ background: 'var(--base)', textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
              </a>
            </div>
          </div>
        </section>

        {/* ═══ VERSE OF THE DAY ═══ */}
        <section className="px-6 py-32 relative">
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="tqg-line mb-20" />

            {/* Diamond + title */}
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

        {/* ═══ STATS ═══ */}
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

        {/* ═══ CTA ═══ */}
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
              <a href="/read" className="tqg-btn-filled px-10 py-3.5 rounded-xl text-sm inline-block">
                Begin Reading
              </a>
              <a href="/dua" className="tqg-btn-ghost px-8 py-3 rounded-xl text-sm inline-block" style={{ textDecoration: 'none' }}>
                Browse Duas
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 mt-2">
              {[
                { label: 'Explore Insights', href: '/insights' },
                { label: 'Learn Arabic', href: '/learn' },
                { label: 'Take a Quiz', href: '/quiz' },
                { label: 'Track Khatmah', href: '/khatmah' },
              ].map((link) => (
                <a key={link.label} href={link.href} className="text-xs" style={{ color: '#8a8078', textDecoration: 'none', borderBottom: '1px solid rgba(184,152,63,0.15)', paddingBottom: '1px' }}>
                  {link.label}
                </a>
              ))}
            </div>

            <div className="tqg-divider max-w-32 mx-auto mt-14">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" stroke="#B8983F" strokeWidth="0.5" opacity="0.25"/>
              </svg>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="px-6 py-12" style={{ borderTop: '1px solid rgba(184,152,63,0.06)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <span className="tqg-heading text-lg" style={{ color: '#B8983F', fontWeight: 500 }}>theQuranGuide</span>
                <p className="text-xs mt-3 leading-relaxed" style={{ color: '#8a8078' }}>
                  Precision-built for the sacred text.
                </p>
              </div>
              {[
                { title: 'Navigate', links: [
                  { label: 'Read Quran', href: '/read' },
                  { label: 'Insights', href: '/insights' },
                  { label: 'Search', href: '/search' },
                  { label: 'Duas', href: '/dua' },
                ]},
                { title: 'Learn', links: [
                  { label: 'Arabic Study', href: '/learn' },
                  { label: 'Quiz', href: '/quiz' },
                  { label: 'Vocabulary', href: '/learn' },
                  { label: 'Grammar', href: '/learn' },
                ]},
                { title: 'More', links: [
                  { label: 'Khatmah Tracker', href: '/khatmah' },
                  { label: 'Quiz', href: '/quiz' },
                  { label: 'Search', href: '/search' },
                  { label: 'Learn Arabic', href: '/learn' },
                ]},
              ].map((col) => (
                <div key={col.title}>
                  <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#B8983F' }}>{col.title}</p>
                  <div className="flex flex-col gap-2.5">
                    {col.links.map((link) => (
                      <a key={link.label} href={link.href} className="text-xs transition-colors duration-150" style={{ color: '#8a8078', textDecoration: 'none' }}>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="tqg-line-subtle mb-6" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs" style={{ color: '#8a8078' }}>&copy; 2026 theQuranGuide</p>
              <p className="tqg-arabic text-sm" style={{ color: 'rgba(184,152,63,0.25)' }}>
                رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
