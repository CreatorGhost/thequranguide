# Changelog: Quiz & Learn Page Refactoring

## Files Modified
- `src/app/quiz/page.tsx`
- `src/app/learn/page.tsx`

## Summary

Refactored both pages to eliminate duplicated code by using the shared design system (`design-system.css`) and shared layout components (`Navbar`, `Footer`).

---

## Quiz Page (`src/app/quiz/page.tsx`)

### Removed
- **Inline `<style>` shared styles**: Removed `@import` for Google Fonts (handled by root layout), `@font-face` for PDMS Saleem QuranFont (defined in `design-system.css`), `.quiz-page` base styles, `.quiz-glow` radial gradient, `.quiz-noise::after` texture overlay.
- **Copy-pasted navigation bar**: Entire `<nav>` block (~70 lines) with desktop links, mobile hamburger, and mobile dropdown.
- **Copy-pasted footer**: Entire `<footer>` block.
- **`mobileMenuOpen` state**: `useState` for mobile menu toggle, now handled internally by `Navbar`.

### Added
- `import Link from "next/link"` -- replaces all `<a>` tags with Next.js client-side routing.
- `import { Navbar } from "@/components/layout/Navbar"` -- shared nav component.
- `import { Footer } from "@/components/layout/Footer"` -- shared footer with `variant="minimal"`.

### Class Mapping
| Old (page-specific) | New (shared design system) |
|---|---|
| `.quiz-page` | `.tqg-page` |
| `.quiz-noise::after` | `.tqg-noise` |
| `.quiz-glow` | `.tqg-glow` |
| inline `fontFamily: "'EB Garamond', serif"` | `className="tqg-heading"` |
| inline Arabic font styling | `className="tqg-arabic"` |
| inline gold gradient button styles | `className="tqg-btn-filled"` |
| inline ghost button styles | `className="tqg-btn-ghost"` |

### Preserved
- All quiz state: `questions`, `currentIdx`, `selected`, `score`, `finished`.
- `shuffle()` function, `handleSelect`, `handleNext`, `restart` callbacks.
- `QUIZ_BANK` data array with all 10 questions.
- Page-specific CSS kept in a small `<style>` tag: `.quiz-option`, `.quiz-option.correct`, `.quiz-option.wrong`, `.quiz-option.dimmed`.
- All visual content (progress bar, question types, option rendering, result screen).

---

## Learn Page (`src/app/learn/page.tsx`)

### Removed
- **Inline `<style>` shared styles**: `@import` for Google Fonts, `@font-face`, `.learn-page` base, `.learn-heading`, `.learn-arabic`, `.learn-gold-shimmer` + keyframes, `.learn-gold-gradient`, `.learn-glow`, `.learn-nav`, `.learn-btn-filled` + hover, `.learn-btn-ghost` + hover, `.learn-line`, `.learn-line-subtle`, `.learn-divider` + pseudo-elements, `.learn-noise::after`.
- **Copy-pasted navigation bar**: Entire `<nav>` block (~75 lines).
- **Copy-pasted footer**: Entire `<footer>` block.
- **`mobileMenuOpen` state**: Now handled by `Navbar`.

### Added
- `import Link from "next/link"` -- replaces `<a href="/quiz">` in the CTA section.
- `import { Navbar } from "@/components/layout/Navbar"` with `currentPath="/learn"`.
- `import { Footer } from "@/components/layout/Footer"` with `variant="minimal"`.

### Class Mapping
| Old (page-specific) | New (shared design system) |
|---|---|
| `.learn-page` | `.tqg-page` |
| `.learn-noise::after` | `.tqg-noise` |
| `.learn-glow` | `.tqg-glow` |
| `.learn-heading` | `.tqg-heading` |
| `.learn-arabic` | `.tqg-arabic` |
| `.learn-gold-gradient` | `.tqg-gold-gradient` |
| `.learn-gold-shimmer` | `.tqg-gold-shimmer` |
| `.learn-btn-filled` | `.tqg-btn-filled` |
| `.learn-btn-ghost` | `.tqg-btn-ghost` |
| `.learn-divider` | `.tqg-divider` + `.tqg-line` children |
| `.learn-nav` | Replaced by `<Navbar>` component |
| hardcoded color values like `'#8a8078'` | `var(--tqg-text-muted)` |
| hardcoded color `'#e5e5e5'` | `var(--tqg-text)` |
| hardcoded font-family `'Inter', sans-serif` | `var(--font-inter), 'Inter', sans-serif` |

### Preserved (page-specific CSS kept in `<style>` tag)
- `.learn-card` + `.learn-card:hover` + `.learn-card-active` -- section card styles with unique hover transforms and shadows.
- `.learn-diamond` -- rotated diamond icon containers in section cards.
- `.flashcard-container`, `.flashcard-inner`, `.flashcard-front`, `.flashcard-back` -- 3D flip animation.
- `.learn-tag` -- inline grammar tags with custom padding/radius.
- `.grammar-word-card` -- grammar breakdown card styling.
- `.root-chip` + `.root-chip.active` -- root selector pill buttons.
- `.progress-bar-bg`, `.progress-bar-fill` -- vocabulary progress bar.

### Preserved (all page logic and data)
- `FLASHCARDS` array (12 vocabulary words).
- `ROOT_EXAMPLES` array (3 root word families with derived words).
- `GRAMMAR_EXAMPLES` array (6 grammar breakdown examples).
- All tab/section state (`activeSection`, `selectedRoot`).
- Flashcard state (`flipped`, `cardIdx`, `orderPos`, `cardOrder`).
- SM-2 spaced repetition logic (`sm2Update`, `getDueCards`, `rateCard`).
- `VocabProgress` localStorage persistence.
- All visual sections: hero, section cards, root analysis, vocabulary flashcards, grammar tags, practice CTA.

---

## Impact
- **Quiz page**: Reduced from ~407 lines to ~213 lines (~48% reduction).
- **Learn page**: Reduced from ~1013 lines to ~628 lines (~38% reduction).
- Both pages now use consistent typography, color tokens, and layout via the shared design system.
- Navigation and footer are maintained by single shared components, eliminating 8 duplicated link arrays.
