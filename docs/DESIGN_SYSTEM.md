# Design System & Authoritative Token Specifications

This document defines the **single source of truth for design tokens** used throughout the D1 Store e-commerce application. All components, utilities, and styles must align with these token definitions.

Tokens are labeled with their implementation status:
- `[IMPLEMENTED]`: Active in `frontend/src/app/globals.css`, `frontend/src/styles/d1-design-tokens.css`, or `frontend/tailwind.config.ts`.
- `[PROPOSED]`: Standardized design targets established by this specification to unify remaining ad-hoc styles.

---

## 1. Color Palette Tokens

The color system reflects DJI's precision engineering aesthetic combined with D1 Store Australia's brand palette: clean whites, high-contrast dark slates, subtle neutral surfaces, and vibrant Apple-blue accents.

### Brand & Interactive Colors
| Token Name | Hex Value | CSS Variable / Tailwind | Status | Usage Context |
|:---|:---:|:---|:---:|:---|
| **Primary Brand Blue** | `#0071e3` | `--primary`, `bg-[#0071e3]`, `text-primary` | `[IMPLEMENTED]` | Primary CTAs, active tab pills, links, checkout buttons. |
| **Primary Blue Hover** | `#0058b8` | `hover:bg-[#0058b8]` | `[IMPLEMENTED]` | Hover state for primary buttons. |
| **Primary Blue Subdued** | `#e1f0ff` | `bg-blue-50`, `bg-[#e1f0ff]` | `[IMPLEMENTED]` | Badge backgrounds, active filter highlights, icon backdrops. |
| **Secondary Accent** | `#2997ff` | `--primary (dark mode)` | `[IMPLEMENTED]` | Dark mode interactive blue, high-visibility link accent. |

### Surface & Neutral Backgrounds
| Token Name | Hex Value | CSS Variable / Tailwind | Status | Usage Context |
|:---|:---:|:---|:---:|:---|
| **Canvas Pure White** | `#ffffff` | `--background`, `bg-white` | `[IMPLEMENTED]` | Primary page background, card surfaces, modal panels. |
| **Subtle Neutral Surface** | `#f5f5f7` | `--secondary`, `--muted`, `bg-[#f5f5f7]` | `[IMPLEMENTED]` | Gallery thumbnail tracks, secondary buttons, spec tables. |
| **Cool Gray Neutral** | `#f0f0f2` | `bg-[#f0f0f2]` | `[IMPLEMENTED]` | Inactive filter pills, category chip backgrounds. |
| **Dark Carbon Surface** | `#121212` | `bg-[#121212]` | `[IMPLEMENTED]` | Announcement bar, dark video cards, hero banner backgrounds. |
| **Deep Elevated Slate** | `#1c1c1e` | `--card (dark mode)` | `[IMPLEMENTED]` | Dark mode cards, elevated bento containers. |

### Typography & Foreground Colors
| Token Name | Hex Value | CSS Variable / Tailwind | Status | Contrast Ratio (vs #FFF) |
|:---|:---:|:---|:---:|:---:|
| **Primary Text (Heading & Body)** | `#121212` | `--foreground`, `text-[#121212]` | `[IMPLEMENTED]` | **16.1:1** (AAA) |
| **Secondary Subdued Text** | `#4b5563` | `text-gray-600`, `text-slate-600` | `[IMPLEMENTED]` | **7.1:1** (AAA) |
| **Muted Metadata Text** | `#6e6e73` | `--muted-foreground`, `text-[#6e6e73]` | `[IMPLEMENTED]` | **5.4:1** (AA) |
| **Disabled / Placeholder Text** | `#9ca3af` | `text-gray-400`, `placeholder-gray-400` | `[IMPLEMENTED]` | Non-text UI (AA) |
| **White Text (On Dark)** | `#ffffff` | `text-white` | `[IMPLEMENTED]` | **16.1:1** (vs #121212) |

### Border & Divider Colors
| Token Name | Hex Value | CSS Variable / Tailwind | Status | Usage Context |
|:---|:---:|:---|:---:|:---|
| **Subtle Divider** | `#f3f4f6` | `border-gray-100` | `[IMPLEMENTED]` | Interior card dividers, subtle row separators. |
| **Standard Border** | `#e5e5ea` | `--border`, `border-gray-200` | `[IMPLEMENTED]` | Card outlines, form input borders, table borders. |
| **Dark Elevated Border** | `#38383a` | `--border (dark mode)` | `[IMPLEMENTED]` | Borders within dark bento cards and hero modules. |

### Semantic Status Colors
| Semantic Role | Hex Value | Tailwind Classes | Status | Context |
|:---|:---:|:---|:---:|:---|
| **Success** | `#16a34a` / `#34c759` | `text-green-600`, `bg-green-50`, `border-green-200` | `[IMPLEMENTED]` | "In Stock", "Free Shipping Unlocked", verified reviews. |
| **Warning / Rating** | `#f5a623` / `#ff9500` | `text-[#f5a623]`, `bg-amber-50`, `border-amber-200` | `[IMPLEMENTED]` | Star rating glyphs, "Low Stock (Only 2 left)", alerts. |
| **Destructive / Error** | `#ef4444` / `#dc2626` | `text-red-600`, `bg-red-50`, `border-red-200` | `[IMPLEMENTED]` | Validation errors, out of stock alerts, remove cart item. |
| **Informational** | `#0071e3` | `text-blue-600`, `bg-blue-50`, `border-blue-200` | `[IMPLEMENTED]` | Warranty notices, care refresh information, announcements. |

---

## 2. Spacing Scale Tokens

The spacing scale is based on an **8px grid** with 4px sub-grid increments for tight alignments.

| Token | Rem | Px | CSS Variable | Tailwind Class | Application |
|:---|:---:|:---:|:---|:---|:---|
| `space-xs` | `0.25rem` | `4px` | `--d1-space-xs` | `gap-1`, `p-1`, `m-1` | Micro-gaps between badge icon and label. |
| `space-sm` | `0.5rem` | `8px` | `--d1-space-sm` | `gap-2`, `p-2`, `m-2` | Gap between rating stars and numerical score. |
| `space-md` | `1rem` | `16px` | `--d1-space-md` | `gap-4`, `p-4`, `m-4` | Mobile container padding, field gaps in compact forms. |
| `space-lg` | `1.5rem` | `24px` | `--d1-space-lg` | `gap-6`, `p-6`, `m-6` | Desktop card padding, standard form field spacing. |
| `space-xl` | `2rem` | `32px` | `--d1-space-xl` | `gap-8`, `p-8`, `m-8` | Section subtitle spacing, two-column column gap. |
| `space-2xl` | `3rem` | `48px` | `--d1-space-2xl` | `gap-12`, `py-12` | Standard mobile section vertical padding. |
| `space-3xl` | `4rem` | `64px` | `--d1-space-3xl` | `gap-16`, `py-16` | Standard desktop section vertical padding. |
| `space-4xl` | `5.5rem` | `88px` | `--d1-space-4xl` | `py-20`, `py-24` | Hero banners and flagship showcase margins. |

---

## 3. Border Radius Tokens

The interface avoids harsh right angles while maintaining restrained, sophisticated curves.

| Token | Px Value | CSS Variable | Tailwind Class | Status | Usage |
|:---|:---:|:---|:---|:---:|:---|
| `radius-xs` | `4px` | `calc(var(--radius) - 8px)` | `rounded-xs` | `[IMPLEMENTED]` | Checkbox boxes, micro-tooltips. |
| `radius-sm` | `8px` | `calc(var(--radius) - 4px)` | `rounded-sm` / `rounded-md` | `[IMPLEMENTED]` | Small chips, form inputs, dropdown items. |
| `radius-md` | `10px` | `calc(var(--radius) - 2px)` | `rounded-[10px]` | `[IMPLEMENTED]` | Standard buttons, filter pills, thumbnails. |
| `radius-lg` | `12px` | `var(--radius)` | `rounded-xl` / `rounded-[12px]` | `[IMPLEMENTED]` | Standard cards, checkout containers, review cards. |
| `radius-xl` | `16px` | `--d1-radius-xl` | `rounded-2xl` / `rounded-[16px]` | `[IMPLEMENTED]` | Product cards, bento feature boxes, gallery viewport. |
| `radius-2xl` | `24px` | `--d1-radius-2xl` | `rounded-3xl` / `rounded-[24px]` | `[IMPLEMENTED]` | Hero story cards, marketing overview banners. |
| `radius-full` | `9999px` | `--d1-radius-full` | `rounded-full` | `[IMPLEMENTED]` | Primary CTAs ("Add to Cart"), badge pills, avatars. |

---

## 4. Shadow & Elevation Tokens

Shadows must be soft, diffused, and natural. Heavy dark drop-shadows are strictly forbidden.

| Token Name | Box Shadow Value | Tailwind Utility | Status | Usage |
|:---|:---|:---|:---:|:---|
| `shadow-xs` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | `shadow-xs` | `[IMPLEMENTED]` | Form inputs, buttons resting state. |
| `shadow-sm` | `0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)` | `shadow-sm` | `[IMPLEMENTED]` | Product cards, filter bar sticky layer. |
| `shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)` | `shadow-md` | `[IMPLEMENTED]` | Hover state on product cards, dropdown menus. |
| `shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)` | `shadow-lg` | `[IMPLEMENTED]` | Modal dialogs, floating quick-buy widgets. |
| `shadow-sticky` | `0 -4px 20px 0 rgba(0, 0, 0, 0.08)` | `shadow-[0_-4px_20px_rgba(0,0,0,0.08)]` | `[IMPLEMENTED]` | Mobile sticky bottom purchase bar. |

---

## 5. Breakpoint Definitions

The platform targets standard Apple and modern Android device viewports.

| Breakpoint Key | Min Width | Target Devices & Context |
|:---|:---:|:---|
| `mobile-sm` | `360px` | Compact Android phones (Samsung Galaxy A-series). |
| `mobile` | `390px` | Standard iPhones (iPhone 12/13/14/15/16). |
| `mobile-lg` | `430px` | Max/Plus iPhones (iPhone 14/15/16 Pro Max, Pixel 8 Pro). |
| `sm` | `640px` | Small tablets in portrait, large mobile landscape. |
| `md` | `768px` | iPad portrait, standard tablets. |
| `lg` | `1024px` | iPad landscape, small laptops. Desktop navigation activates here. |
| `xl` | `1280px` | Standard laptop (MacBook Air 13", 1080p desktop). Multi-column checkout. |
| `2xl` | `1440px` | Modern desktop monitor, MacBook Pro 16". Primary PDP container width. |
| `wide` | `1760px` | Ultra-wide desktop, Apple Studio Display (Full width banners). |

---

## 6. Interactive States Specification

Interactive controls must consistently express state changes:

1. **Hover (`:hover`)**:
   - Primary blue button: Transition to `#0058b8` with subtle brightness curve (`transition-colors duration-200`).
   - Cards: Subtle upward elevation `transform: translateY(-2px)` and transition from `shadow-sm` to `shadow-md`.
2. **Active / Pressed (`:active`)**:
   - Buttons: Subtle depression `scale-[0.98]` or darker shade.
3. **Focus Visible (`:focus-visible`)**:
   - Compulsory visible outline ring: `outline-none ring-2 ring-[#0071e3] ring-offset-2 ring-offset-white`. Never remove focus rings without providing this replacement.
4. **Disabled (`:disabled`)**:
   - Opacity reduced to `50%` (`opacity-50`), cursor changed to `cursor-not-allowed`, and pointer events disabled (`pointer-events-none`).
