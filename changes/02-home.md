# Home Page Refactor (`src/app/page.tsx`)

## Summary
Refactored the Home page from ~703 lines to ~366 lines by eliminating duplicated code and adopting shared components.

## Changes

### Removed
- **`"use client"` directive** — no longer needed since all client-side state (`mobileMenuOpen` / `useState`) has been removed; the component is now a Server Component.
- **`useState` import and `mobileMenuOpen` state** — mobile menu state is now managed inside the Navbar component within PageLayout.
- **270-line inline `<style>` tag** (lines 9-278) — shared design system classes (`tqg-heading`, `tqg-arabic`, `tqg-gold-gradient`, `tqg-gold-shimmer`, `tqg-card`, `tqg-ornamental`, `tqg-divider`, `tqg-line`, `tqg-line-subtle`, `tqg-line-gradient`, `tqg-btn-filled`, `tqg-btn-ghost`, `tqg-btn-nav`, `tqg-nav`, `tqg-noise`, CSS variables, font imports) are now provided by `src/styles/design-system.css`.
- **Copy-pasted navigation bar** (lines 285-358) — replaced by `PageLayout` which includes the shared `Navbar` component.
- **Copy-pasted footer** (lines 648-698) — replaced by `PageLayout` which includes the shared `Footer` component.
- **`style={{ textDecoration: 'none' }}` on links** — unnecessary with Next.js `<Link>`.

### Added
- **`import { PageLayout } from "@/components/layout/PageLayout"`** — wraps all page content with `<PageLayout currentPath="/" footerVariant="full">`, providing shared nav, footer, page wrapper (`tqg` class, noise overlay, etc.).
- **`import Link from "next/link"`** — all `<a>` tags replaced with Next.js `<Link>` for client-side navigation.
- **Small page-specific `<style>` tag** (~65 lines) containing only styles unique to the home page:
  - `.tqg-central-glow` — the fixed radial golden glow
  - `.tqg-diamond` — rotated diamond icon containers in the features grid
  - `.tqg-feature-num` — large faded numbers (01-06) on feature cards
  - `.tqg-shamsa-spin` + `@keyframes tqg-rotate` — slow-rotating Shamsa medallion
  - `.tqg-scroll-line` + `@keyframes tqg-pulse` — pulsing scroll indicator line
  - `.tqg-pattern` — subtle SVG Islamic star background pattern

### Preserved (no changes)
- Hero section with Shamsa medallion, Bismillah frame, heading, subtitle, CTA buttons, scroll indicator
- Features bento grid with all 6 feature cards (Mushaf Display, Live Translation, Audio Recitation, AI Tafsir, Hadith Links, Reading Tracker)
- Verse of the Day section
- Stats section (604 Pages, 114 Surahs, 30 Juz, 6,236 Ayahs)
- CTA section with "Begin Your Journey" heading and links
- All Arabic text, SVG icons, class names, and visual structure

## Why
- **Eliminate duplication**: Nav and footer were copy-pasted across every page; now they come from shared components.
- **Single source of truth for design tokens**: CSS variables, font imports, and shared component styles live in `design-system.css` instead of being repeated in every page's inline `<style>`.
- **Better Next.js patterns**: Using `<Link>` for client-side navigation instead of `<a>` tags; removing unnecessary `"use client"` since the page no longer has state.
- **Smaller file**: ~703 lines reduced to ~366 lines (48% reduction).
