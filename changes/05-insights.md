# Insights Pages Refactor

## Files Modified
- `src/app/insights/page.tsx`
- `src/app/insights/[surah]/page.tsx`

## Changes

### Navigation & Footer Removal
- Removed copy-pasted inline `<nav>` blocks from both pages
- Removed copy-pasted inline `<footer>` blocks from both pages
- Wrapped both pages with `<PageLayout currentPath="/insights" footerVariant="minimal">`
- Removed `useState` for `mobileMenuOpen` from both pages (now handled by Navbar component)

### Shared Styles Eliminated
- Removed inline `@import url(...)` for Google Fonts (handled by design-system.css / root layout)
- Removed inline `@font-face` for PDMS Saleem QuranFont (handled by design-system.css)
- Removed duplicated CSS custom properties (`--gold`, `--base`, etc.) — now uses `--tqg-*` tokens from design-system.css
- Removed `.ins-nav` / `.sid-nav` — now uses `tqg-nav` via Navbar component
- Removed `.ins-glow` / `.sid-glow` — now uses `tqg-glow` via PageLayout
- Removed `.ins-noise::after` / `.sid-noise::after` — now uses `tqg-noise` via PageLayout
- Removed `.ins-page` / `.sid` root classes — now uses `tqg-page` via PageLayout

### Class Prefix Mapping
| Old Class | New Class | Location |
|-----------|-----------|----------|
| `.ins-heading` / `.sid-h` | `tqg-heading` | Both pages |
| `.ins-arabic` / `.sid-ar` | `tqg-arabic` | Both pages |
| `.ins-gold-gradient` / `.sid-gg` | `tqg-gold-gradient` | Both pages |
| `.sid-gs` | `tqg-gold-shimmer` | Surah detail page |
| `.sid-btn-f` | `tqg-btn-filled` | Surah detail page |
| `.sid-btn-g` | `tqg-btn-ghost` | Surah detail page |
| `.sid-orn` | `tqg-ornamental` | Surah detail page |
| `.ins-card` | `tqg-card` | Insights list page |

### Link Replacement
- All `<a>` tags replaced with Next.js `<Link>` for client-side navigation
- Affects navigation links, surah cards, breadcrumbs, prev/next buttons, and internal cross-references

### Page-Specific Styles Retained
**Insights list page (`ins-*`):**
- `.ins-filter-btn` (filter pill buttons with active state)
- `.ins-search` (search input styling)
- `.ins-card-featured::before` (gold gradient top border on featured cards)
- `.ins-badge` (small metadata badges)
- `.ins-fade` animation (staggered card entry)

**Surah detail page (`sid-*`):**
- `.sid-sec` / `.sid-sec-label` (section cards with label + gradient line)
- `.sid-body` (body text styling)
- `.sid-vocab` (vocabulary cards)
- `.sid-story` (story cards with left border)
- `.sid-verse` / `.sid-vd` (verse cards with sub-detail panels)
- `.sid-conn` (connection pills to other surahs)
- `.sid-lesson-cat` / `.sid-lesson-pt` (lesson groupings)
- `.sid-flow-item` / `.sid-flow-head` / `.sid-flow-body` (accordion for surah structure)
- `.sid-fade` animation (staggered section entry)

### Preserved
- All page-specific state and logic (filter, search, expandedSection, API calls)
- 404 error state for surah detail page (returned directly without PageLayout)
- All visual content, data rendering, and conditional sections
- `stripHtml` utility function in surah detail page
