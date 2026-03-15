# Refactor: Dua and Search pages to use shared components

## Files modified
- `src/app/dua/page.tsx`
- `src/app/search/page.tsx`

## Changes applied to both pages

### 1. Removed massive inline `<style>` blocks
- Removed ~200 lines of duplicated CSS from each page (font imports, CSS variables, shared class definitions for buttons, headings, Arabic text, glow, noise, gradients, nav, dividers, ornamental corners, cards, and line-subtle)
- Only page-specific styles remain in a small inline `<style>` tag

### 2. Replaced copy-pasted navigation and footer with PageLayout
- Removed the entire `<nav>` block (~70 lines per page) including desktop nav, mobile menu, and hamburger toggle
- Removed the `<footer>` block (~10 lines per page)
- Wrapped page content with `<PageLayout currentPath="/dua" footerVariant="minimal">` and `<PageLayout currentPath="/search" footerVariant="minimal">` respectively
- Removed the outer `<div className="dua-page dua-noise">` / `<div className="search-page search-noise">` wrapper (handled by PageLayout)
- Removed the `<div className="dua-glow" />` / `<div className="search-glow" />` (handled by PageLayout)

### 3. Replaced `<a>` tags with Next.js `<Link>`
- All `<a href="...">` replaced with `<Link href="...">` for client-side navigation
- Added `import Link from "next/link"` to both pages

### 4. Mapped page-specific class prefixes to shared `tqg-*` classes
| Old (dua) | Old (search) | New (shared) |
|-----------|-------------|--------------|
| `.dua-heading` | `.search-heading` | `tqg-heading` |
| `.dua-arabic` | `.search-arabic` | `tqg-arabic` |
| `.dua-gold-gradient` | `.search-gold-gradient` | `tqg-gold-gradient` |
| `.dua-gold-shimmer` | `.search-gold-shimmer` | `tqg-gold-shimmer` |
| `.dua-btn-filled` | `.search-btn-filled` | `tqg-btn-filled` |
| `.dua-btn-ghost` | `.search-btn-ghost` | `tqg-btn-ghost` |
| `.dua-divider` | `.search-divider` | `tqg-divider` |
| `.dua-ornamental` | `.search-ornamental` | `tqg-ornamental` |
| `.dua-card` | — | `tqg-card` |
| `.dua-line-subtle` | `.search-line-subtle` | `tqg-line-subtle` |

### 5. Removed `mobileMenuOpen` state
- Removed `useState` for `mobileMenuOpen` from both pages (now handled by Navbar inside PageLayout)
- Dua page: only retains `activeCategory` state
- Search page: only retains `query`, `results`, `loading`, `error`, `searched` state

### 6. Retained page-specific styles in small inline `<style>` blocks

**Dua page** (~50 lines of CSS retained):
- `.dua-category-card` (with hover and ::before pseudo)
- `.dua-icon-circle` (with parent hover interaction)
- `.dua-count-badge`
- `.dua-animate-in` and `@keyframes dua-fadeIn`

**Search page** (~65 lines of CSS retained):
- `.search-input-wrapper`, `.search-input` (with focus and placeholder)
- `.search-submit` (with hover and disabled states)
- `.search-suggestion` (with hover)
- `.search-result-card` (with hover)
- `.search-error-box`
- `.search-spinner` and `@keyframes search-spin`

## Line count reduction
- **Dua page**: 683 lines -> ~295 lines (57% reduction)
- **Search page**: 561 lines -> ~245 lines (56% reduction)
- Combined: ~700 lines of duplicated code eliminated
