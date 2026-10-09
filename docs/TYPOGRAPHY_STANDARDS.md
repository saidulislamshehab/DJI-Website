# Typography Standards & Text Readability Specification

This document is the **authoritative typography specification** for the D1 Store platform. It defines font pairings, responsive type scales, line heights, font weights, and strict readability mandates.

---

## 1. Font Family System & Pairing Architecture

The platform uses two complementary font families configured via Next.js `next/font/google` in `frontend/src/app/layout.tsx`:

```tsx
// frontend/src/app/layout.tsx
const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});
```

### Font Responsibilities
1. **Figtree (`var(--font-figtree)`)**:
   - Used for **Display, Page Titles, Section Headings, and Hero Brand Statements**.
   - Clean, geometric, contemporary aesthetic matching official DJI and Australian D1 Store branding.
2. **Inter (`var(--font-inter)`)**:
   - Used for **Body Text, Specification Tables, Form Inputs, Micro-Labels, and Prices**.
   - Highly legible grotesque sans-serif with tall x-height, clear numerical tabular figures, and optimal low-contrast legibility.

---

## 2. Authoritative Typography Scale

The following table provides the mandatory size, weight, and line-height baselines.

| Element Role | Desktop (≥ 1024px) | Mobile (≤ 767px) | Font Weight | Line Height | Tailwind Class Examples |
|:---|:---:|:---:|:---:|:---:|:---|
| **Hero Display Heading** | 44px – 56px | 32px – 40px | 900 (Black) | 1.05 – 1.15 | `text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight` |
| **Main Page Title** | 32px – 42px | 26px – 34px | 800 (ExtraBold) | 1.15 – 1.25 | `text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight` |
| **Product Detail Title** | 30px – 40px | 24px – 32px | 800 (ExtraBold) | 1.20 – 1.25 | `text-2xl sm:text-3xl lg:text-[36px] font-extrabold leading-tight` |
| **Main Section Heading** | 26px – 34px | 22px – 28px | 800 (ExtraBold) | 1.25 – 1.30 | `text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight` |
| **Card / Bento Heading** | 18px – 23px | 17px – 21px | 700 (Bold) | 1.30 – 1.35 | `text-lg sm:text-xl font-bold leading-snug` |
| **Product Card Grid Title** | 15px – 17px | 14px – 16px | 700 (Bold) | 1.35 – 1.40 | `text-[15px] sm:text-base font-bold leading-snug line-clamp-2` |
| **Product Detail Price** | 26px – 32px | 24px – 28px | 900 (Black) | 1.10 – 1.15 | `text-2xl sm:text-3xl font-black text-[#121212] tracking-tight` |
| **Standard Body Paragraph** | 15px – 17px | 14px – 16px | 400 or 500 | 1.55 – 1.65 | `text-[15px] sm:text-[16px] text-gray-600 leading-relaxed` |
| **Product Description** | 15px – 17px | 14px – 16px | 400 or 500 | 1.55 – 1.65 | `text-[15px] sm:text-base text-gray-600 leading-relaxed` |
| **FAQ Accordion Question** | 16px – 19px | 15px – 18px | 700 (Bold) | 1.35 – 1.40 | `text-base sm:text-lg font-bold text-[#121212]` |
| **FAQ Accordion Answer** | 15px – 17px | 14px – 16px | 400 (Regular) | 1.60 – 1.65 | `text-[15px] sm:text-base text-gray-600 leading-relaxed` |
| **Form Field Label** | 14px – 15px | 14px – 15px | 600 (SemiBold) | 1.30 – 1.40 | `text-[14px] font-semibold text-gray-800` |
| **Form Input Value** | 15px – 16px | **16px (Strict)** | 500 (Medium) | 1.40 | `text-base sm:text-[15px] text-[#121212]` |
| **Button Label** | 14px – 16px | 14px – 16px | 700 (Bold) | 1.20 | `text-sm sm:text-base font-bold tracking-wide` |
| **Table Header Cell** | 13px – 14px | 13px – 14px | 700 (Bold) | 1.30 | `text-[13px] font-bold text-gray-900 uppercase tracking-wider` |
| **Specification Value** | 14px – 16px | 13px – 15px | 500 or 600 | 1.45 – 1.50 | `text-[14px] sm:text-[15px] text-[#121212]` |
| **Supporting / Meta Text** | 12px – 14px | 12px – 13px | 500 (Medium) | 1.40 | `text-xs sm:text-[13px] text-gray-500` |
| **Micro-Badges / Disclosures** | 11px – 12px | 11px – 12px | 700 (Bold) | 1.20 | `text-[11px] font-extrabold uppercase tracking-widest` |

---

## 3. Strict Typography Rules & Prohibitions

### Rule 1: The iOS 16px Input Rule
On mobile devices (`< 768px`), all `<input>`, `<select>`, and `<textarea>` elements **MUST** use an effective font size of **at least 16px** (`text-base` or `text-[16px]`).
- **Why**: iOS Safari will automatically zoom the entire webpage into the input if the font size is `< 16px`, distorting the layout and breaking user orientation.
- **Implementation**: `className="text-base sm:text-[15px] ..."`

### Rule 2: Primary Content Readability Minimum
Primary paragraph text, descriptions, reviews, and specification entries must never be styled with `text-xs` (12px) or `text-[10px]`.
- **Bad**: `<p className="text-xs text-gray-500">{product.description}</p>`
- **Good**: `<p className="text-[15px] sm:text-base text-gray-600 leading-relaxed">{product.description}</p>`

### Rule 3: Paragraph Measure (Line Length)
To maintain comfortable reading rhythm:
- Paragraph containers must not stretch indefinitely across ultra-wide monitors.
- Restrict prose containers to `max-w-2xl` (672px), `max-w-3xl` (768px), or approximately **60 to 75 characters per line**.

### Rule 4: Heading to Body Contrast
A section heading must always be substantially larger and heavier than its child content:
- Section headings must be at least **1.6×** larger than the accompanying body text.
- Headings use `font-extrabold` (800) or `font-black` (900) with tight tracking (`tracking-tight` / `-0.025em`).

---

## 4. Legitimate Exceptions for Compact Metadata

Small typography (`11px – 13px`) is permitted **ONLY** in the following restricted scenarios:

1. **SKU & Product Model Numbers**:
   - `text-[12px] font-semibold text-gray-400 tracking-wider uppercase` (e.g. `SKU: OSMON-64`).
2. **Micro Trust Badges**:
   - Compact uppercase badge tags (`text-[11px] font-bold tracking-widest uppercase`).
3. **Legal Disclosures & Footnotes**:
   - Fine print disclaimer at the base of pricing or financing widgets (`text-[12px] text-gray-500 leading-normal`).
4. **Table Column Sub-labels**:
   - Sub-units in spec headers (e.g. `(mm)`, `(grams)` styled as `text-[12px] font-normal text-gray-400`).
