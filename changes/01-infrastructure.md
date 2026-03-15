# Infrastructure Changes — Shared Layout & Design System

## Files Created

### `src/styles/design-system.css`
- Defined all TQG design tokens as CSS custom properties under `:root` (gold palette, base/surface colors, text colors, border colors)
- Added `@font-face` for PDMS Saleem QuranFont (woff + ttf from /fonts/)
- Created shared utility classes:
  - `.tqg-page` — base page styles (background, color, font-family Inter, min-h-screen, overflow-x hidden, antialiased)
  - `.tqg-heading` — EB Garamond serif font
  - `.tqg-arabic` — PDMS Saleem QuranFont / Amiri, RTL direction, line-height 2.2
  - `.tqg-gold-gradient` — gold gradient text via background-clip
  - `.tqg-gold-shimmer` — animated gold shimmer text with `tqg-shimmer` keyframe
  - `.tqg-btn-filled` — gold gradient button with hover glow and lift
  - `.tqg-btn-ghost` — outlined gold border button with hover fill
  - `.tqg-divider` — flex divider container
  - `.tqg-line` / `.tqg-line-subtle` / `.tqg-line-gradient` — separator line variants
  - `.tqg-ornamental` — corner bracket frame using ::before and ::after
  - `.tqg-card` — surface card with border and hover effect
  - `.tqg-noise::after` — fixed noise texture overlay (fractalNoise SVG, opacity 0.025)
  - `.tqg-glow` — central golden glow (fixed, centered, 900px radial gradient)
  - `.tqg-nav` — nav bar background with backdrop blur
- Added keyframe animations: `tqg-shimmer`, `tqg-rotate` (80s linear infinite), `tqg-pulse`

### `src/components/layout/Navbar.tsx`
- "use client" component with `{ currentPath: string }` props
- Logo: inline SVG shamsa icon + "The Quran Guide" + Arabic "دليل القرآن"
- Nav links: Home, Read, Insights, Learn, Quiz, Duas, Khatmah, Search
- Active link highlighting using `var(--tqg-gold-light)`, inactive `var(--tqg-text-muted)`
- "Begin Reading" CTA button (hidden on small screens, shown in mobile menu)
- Mobile: hamburger toggle with useState for open/close
- Sticky: fixed top-0 z-50 with backdrop-filter blur via `.tqg-nav`
- Bottom border line using `var(--tqg-border)`
- All links use Next.js `Link` component
- Named export: `Navbar`

### `src/components/layout/Footer.tsx`
- Props: `{ variant?: 'full' | 'minimal' }` (default 'full')
- Full variant: 4-column responsive grid (branding, Navigate, Learn, More)
- Minimal variant: copyright + Arabic dua text only
- Top gradient line separator in full variant
- All links use Next.js `Link` component
- Named export: `Footer`

### `src/components/layout/PageLayout.tsx`
- "use client" component wrapping Navbar + children + Footer
- Props: `{ children, currentPath, footerVariant? }`
- Renders `.tqg-page.tqg-noise` wrapper with `.tqg-glow` div
- Named export: `PageLayout`

## Files Modified

### `src/app/layout.tsx`
- Added Google Fonts via `next/font/google`: Inter, EB Garamond, Amiri
- Applied font CSS variables (`--font-inter`, `--font-eb-garamond`, `--font-amiri`) to `<body>`
- Added import for `../styles/design-system.css`
- Kept existing imports: globals.css, theme.css, ThemeWrapper

### `src/app/globals.css`
- Replaced hardcoded `#0d0b08` with `var(--tqg-base)` for background
- Replaced hardcoded `#e5e5e5` with `var(--tqg-text)` for text color
- Kept `@import "tailwindcss"` and base html/body styles
