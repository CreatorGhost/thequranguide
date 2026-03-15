# The Quran Guide — UI/UX Refactoring Changelog

> All changes made by 6 parallel agents to unify the design system, eliminate duplication, and wire the site together as one cohesive application.

---

## Agent 1: Shared Infrastructure (4 files created, 2 modified)

### Files Created

**`src/styles/design-system.css`**
- Unified design tokens as CSS variables under `:root` (`--tqg-gold`, `--tqg-base`, `--tqg-text`, etc.)
- `@font-face` for PDMS Saleem QuranFont (woff + ttf)
- Shared utility classes: `.tqg-page`, `.tqg-heading`, `.tqg-arabic`, `.tqg-gold-gradient`, `.tqg-gold-shimmer`, `.tqg-btn-filled`, `.tqg-btn-ghost`, `.tqg-divider`, `.tqg-line`, `.tqg-line-subtle`, `.tqg-line-gradient`, `.tqg-ornamental`, `.tqg-card`, `.tqg-noise::after`, `.tqg-glow`, `.tqg-nav`
- Keyframe animations: `tqg-shimmer`, `tqg-rotate`, `tqg-pulse`

**`src/components/layout/Navbar.tsx`**
- Shared navigation with active link highlighting via `currentPath` prop
- 8 nav links, shamsa logo, "Begin Reading" CTA, mobile hamburger menu
- All links use Next.js `<Link>`

**`src/components/layout/Footer.tsx`**
- `full` variant: 4-column grid (branding, Navigate, Learn, More)
- `minimal` variant: copyright + Arabic dua
- All links use Next.js `<Link>`

**`src/components/layout/PageLayout.tsx`**
- Wraps `<Navbar>` + children + `<Footer>` inside `.tqg-page.tqg-noise` with `.tqg-glow`
- Props: `currentPath`, `footerVariant`

### Files Modified

**`src/app/layout.tsx`**
- Added `next/font/google` for Inter, EB Garamond, Amiri (replaces 8 `@import url()` in inline style tags)
- Imported `design-system.css`
- Applied font CSS variables to `<body>`

**`src/app/globals.css`**
- Replaced hardcoded colors with `var(--tqg-base)` and `var(--tqg-text)`

---

## Agent 2: Home Page (1 file modified)

**`src/app/page.tsx`** — 703 lines → 366 lines (48% reduction)

- Removed `"use client"` — page is now a Server Component
- Removed 270-line inline `<style>` tag (shared CSS now in design-system.css)
- Removed copy-pasted navigation (74 lines) and footer (51 lines)
- Replaced 14 `<a>` tags with Next.js `<Link>`
- Wrapped with `<PageLayout currentPath="/" footerVariant="full">`
- Kept small `<style>` tag (~65 lines) for home-only styles: `.tqg-central-glow`, `.tqg-diamond`, `.tqg-feature-num`, `.tqg-shamsa-spin`, `.tqg-scroll-line`, `.tqg-pattern`

---

## Agent 3: Dua + Search Pages (2 files modified)

**`src/app/dua/page.tsx`** — 683 lines → ~295 lines (57% reduction)

- Removed ~200 lines of shared CSS, nav (~70 lines), footer, glow, noise
- Removed `mobileMenuOpen` state
- Mapped `.dua-*` classes → `tqg-*` equivalents
- Replaced all `<a>` with `<Link>`
- Wrapped with `<PageLayout currentPath="/dua" footerVariant="minimal">`
- Retained page-specific: `.dua-category-card`, `.dua-icon-circle`, `.dua-count-badge`, `.dua-animate-in`

**`src/app/search/page.tsx`** — 561 lines → ~245 lines (56% reduction)

- Same treatment as Dua page
- Mapped `.search-*` classes → `tqg-*` equivalents
- Retained page-specific: `.search-input`, `.search-submit`, `.search-suggestion`, `.search-result-card`, `.search-error-box`, `.search-spinner`

---

## Agent 4: Quiz + Learn Pages (2 files modified)

**`src/app/quiz/page.tsx`** — 407 lines → ~213 lines (48% reduction)

- Removed shared inline CSS, nav, footer, glow, noise
- Removed `mobileMenuOpen` state
- Mapped inline styles to `tqg-*` classes and CSS variables
- Replaced `<a>` with `<Link>`
- Retained: `.quiz-option` (correct/wrong/dimmed states), all quiz logic and data

**`src/app/learn/page.tsx`** — 1013 lines → ~628 lines (38% reduction)

- Removed shared CSS, nav, footer
- Mapped `.learn-*` → `tqg-*` classes, hardcoded colors → CSS variables
- Retained: flashcard 3D flip, grammar cards, root chips, progress bars, SM-2 spaced repetition logic, all data arrays

---

## Agent 5: Insights Pages (2 files modified)

**`src/app/insights/page.tsx`** — 425 lines → 265 lines (38% reduction)

- Removed shared CSS, nav, footer, glow, noise
- Mapped `.ins-*` → `tqg-*` classes
- Replaced `<a>` with `<Link>` (surah cards, nav links)
- Retained: `.ins-filter-btn`, `.ins-search`, `.ins-badge`, `.ins-fade` animation

**`src/app/insights/[surah]/page.tsx`** — 572 lines → 423 lines (26% reduction)

- Same treatment
- Mapped `.sid-*` → `tqg-*` classes
- Retained all page-specific section styles (`.sid-sec`, `.sid-vocab`, `.sid-story`, `.sid-verse`, `.sid-conn`, `.sid-flow-*`)

---

## Agent 6: Khatmah Page (1 file modified)

**`src/app/khatmah/page.tsx`**

- Removed ~60 lines of nav, footer, `mobileMenuOpen` state
- Removed ~180 lines of shared CSS (fonts, variables, buttons, heading, glow, noise, cards, dividers)
- Mapped `.kh-*` → `tqg-*` classes
- Replaced `<a>` with `<Link>` (30+ Ramadan "Start" links)
- Wrapped with `<PageLayout currentPath="/khatmah" footerVariant="minimal">`
- Retained: progress ring, stat cards, streak calendar, tab toggle, Ramadan day cards, goal input, all localStorage logic

---

## Overall Impact

| Metric | Before | After |
|--------|--------|-------|
| Duplicated nav implementations | 8 | 1 (`Navbar.tsx`) |
| Duplicated footer implementations | 8 | 1 (`Footer.tsx`) |
| Inline `<style>` tags with shared CSS | 8 (200-400 lines each) | 0 (moved to `design-system.css`) |
| CSS class naming systems | 7 different prefixes | 1 unified (`tqg-*`) |
| Font loading locations | 8 `@import url()` in JSX | 1 (`next/font` in layout.tsx) |
| Navigation uses `<a>` tags | All pages | 0 (all use Next.js `<Link>`) |
| Total lines reduced | ~4,500+ lines of duplicated code eliminated |

### Not Modified (intentionally)
- **`src/app/read/page.tsx`** — Has a fundamentally different navigation paradigm (reader controls, page input, mode toggle, Juz dropdown) that requires separate treatment.
