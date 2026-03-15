# Khatmah Page Refactor

## File Modified
- `src/app/khatmah/page.tsx`

## Changes

### Removed Duplicated Navigation & Footer
- Removed the entire copy-pasted `<nav>` block (~60 lines) including desktop nav links, mobile hamburger menu, and mobile dropdown menu.
- Removed the copy-pasted `<footer>` block.
- Removed the outer `<div className="kh">` wrapper and `<div className="kh-glow" />` (both provided by PageLayout).
- Wrapped page content with `<PageLayout currentPath="/khatmah" footerVariant="minimal">`.

### Removed `mobileMenuOpen` State
- Removed `useState` for `mobileMenuOpen` and the `setMobileMenuOpen` toggle — now handled by `Navbar` inside `PageLayout`.

### Replaced `<a>` Tags with Next.js `<Link>`
- "Open Reader" link in Quick Actions section.
- "Start" reading links on each Ramadan day card (`/read?page=N`).

### Removed Shared Styles from Inline `<style>` Tag
The following duplicated CSS was removed (now provided by `src/styles/design-system.css`):

| Removed (page-local)        | Shared class used instead   |
|-----------------------------|-----------------------------|
| `.kh` (root vars, base bg)  | `tqg-page` (via PageLayout) |
| `.kh-heading`               | `tqg-heading`               |
| `.kh-gold-gradient`         | `tqg-gold-gradient`         |
| `.kh-gold-shimmer` + `@keyframes kh-shimmer` | `tqg-gold-shimmer` |
| `.kh-glow`                  | `tqg-glow` (via PageLayout) |
| `.kh::after` (noise)        | `tqg-noise` (via PageLayout)|
| `.kh-nav` + `.kh-nav-btn`   | `tqg-nav` (via Navbar)      |
| `.kh-card` + hover          | `tqg-card`                  |
| `.kh-btn-filled` + hover    | `tqg-btn-filled`            |
| `.kh-btn-ghost` + hover     | `tqg-btn-ghost`             |
| `.kh-divider` + pseudo-elements | `tqg-divider`           |
| `.kh-line`                  | `tqg-line`                  |
| `@font-face` (PDMS Saleem)  | Defined in design-system.css|
| `@import` Google Fonts      | Handled globally            |
| CSS custom properties (vars)| Design tokens in `:root`    |

### Page-Specific Styles Retained
The following CSS remains in a reduced inline `<style>` tag as it is unique to this page:

- Progress ring (`.kh-ring-*`) — SVG circular progress indicator
- Stat cards (`.kh-stat-card`, `.kh-stat-num`, `.kh-stat-label`)
- Streak calendar (`.kh-calendar`, `.kh-cal-*`)
- Tab toggle bar (`.kh-tab-bar`, `.kh-tab`)
- Ramadan progress bar (`.kh-ramadan-bar-*`)
- Ramadan day cards (`.kh-day-card`)
- Checkboxes (`.kh-checkbox`)
- Current badge (`.kh-badge-current`)
- Start reading button (`.kh-start-btn`)
- Goal input (`.kh-goal-input`)
- Danger button (`.kh-btn-danger`)
- Responsive breakpoints

### Preserved
- All page-specific state and logic (khatmah data, Ramadan progress, tab switching, localStorage persistence, daily goals, streak computation, etc.)
- All visual content, SVG icons, and data display
- All interactive functionality (mark pages, toggle days, reset progress, edit goal)
