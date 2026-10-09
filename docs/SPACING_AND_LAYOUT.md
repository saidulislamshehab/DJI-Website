# Spacing & Layout Architecture Standards

This document establishes the standard container widths, spatial rhythms, grid gaps, and compositional principles for the D1 Store e-commerce platform.

---

## 1. Master Container Width System

To prevent content from stretching into unreadable single-line bands or shrinking into claustrophobic corridors, the platform utilizes **four purposeful container widths**:

```
  ┌───────────────────────────────────────────────────────────────┐
  │ 1. Full-Bleed Marketing Canvas: max-w-[1760px]               │
  │    (Global Header, Mega-Menu, Top Announcement, Hero Sliders) │
  └───────────────────────────────────────────────────────────────┘

  ┌───────────────────────────────────────────────────────────────┐
  │ 2. Primary Commerce Container: max-w-[1400px]                 │
  │    (Product Detail Pages, Collection Grids, Account Portal)   │
  └───────────────────────────────────────────────────────────────┘

  ┌───────────────────────────────────────────────────────────────┐
  │ 3. Focused Transactional Container: max-w-[1280px]            │
  │    (Shopping Cart, Dual-Column Multi-Step Checkout)           │
  └───────────────────────────────────────────────────────────────┘

  ┌───────────────────────────────────────────────────────────────┐
  │ 4. Prose & Policy Container: max-w-[860px]                    │
  │    (Warranty Terms, Privacy Policy, Individual Blog Post)     │
  └───────────────────────────────────────────────────────────────┘
```

| Container Scope | Max Width | Standard Classes | Target Application |
|:---|:---:|:---|:---|
| **Marketing / Header Canvas** | **1760px** | `max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8` | Global navigation bar, full-width photo carousels, announcement bar. |
| **Primary Commerce Canvas** | **1400px** | `max-w-[1400px] mx-auto px-[16px] md:px-[36px]` | PDP (Product Detail Page), PLP (Catalog Listing), Admin tables. |
| **Transactional Canvas** | **1280px** | `max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8` | Cart page, multi-step Checkout (7-col form + 5-col order summary). |
| **Prose / Policy Canvas** | **860px** | `max-w-[860px] mx-auto px-4 sm:px-6` | Australian warranty disclosures, store policies, editorial articles. |

---

## 2. Horizontal Page Padding (Gutters)

Every page container must declare responsive side padding to prevent content from touching the glass of the display:

- **Mobile (`< 768px`)**: `px-4` (16px) or `px-5` (20px).
- **Tablet (`768px – 1023px`)**: `px-6` (24px).
- **Desktop (`≥ 1024px`)**: `px-8` (32px) or `px-[36px]` (36px).

```tsx
// Standard Page Wrapper Pattern
<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

---

## 3. Section Vertical Rhythm

Inconsistent vertical margins destroy page structure. Standardize section padding across all pages:

```
  ┌────────────────────────────────────────────────────────┐
  │ Section N                                              │
  │                                                        │
  │ py-14 md:py-20 (56px – 80px Desktop / 36px – 56px Mobile)
  │                                                        │
  └────────────────────────────────────────────────────────┘
  ┌────────────────────────────────────────────────────────┐
  │ Section N+1                                            │
  │                                                        │
  └────────────────────────────────────────────────────────┘
```

- **Desktop Sections (`≥ 1024px`)**:
  - Standard spacing: `py-16` (64px) to `py-20` (80px).
  - Compact sections (trust badges, breadcrumb strip): `py-8` (32px) to `py-10` (40px).
  - Major marketing showcases: `py-24` (96px).
- **Mobile Sections (`< 768px`)**:
  - Standard spacing: `py-10` (40px) to `py-12` (48px).
  - Compact sections: `py-6` (24px).

---

## 4. Grid Columns and Gap Scale

Gaps between layout items must be consistent:

| Grid Type | Desktop Gap | Mobile Gap | Tailwind Classes |
|:---|:---:|:---:|:---|
| **Product Detail Hero (Gallery vs Buy Panel)** | **40px – 56px** | **24px – 32px** | `gap-[32px] lg:gap-[56px]` |
| **Product Card Grid (Collections & Search)** | **24px – 28px** | **16px – 20px** | `gap-4 sm:gap-6 lg:gap-7` |
| **Bento Feature Grid (Overview Section)** | **20px – 24px** | **16px** | `gap-4 md:gap-6` |
| **In The Box Gear Grid (Cutout Items)** | **16px – 20px** | **12px – 16px** | `gap-3 sm:gap-4 lg:gap-5` |
| **Checkout Layout (Forms vs Order Summary)** | **32px – 48px** | **24px** | `gap-8 lg:gap-12` |
| **Form Fields (Row to Row)** | **16px – 20px** | **16px** | `space-y-4 sm:space-y-5` |

---

## 5. Desktop Composition: Avoiding the "Empty Ocean" Defect

A recurring defect introduced by autonomous coding agents is rendering desktop content in a tiny centered box, leaving 70% of the display as vacant white space.

### Anti-Pattern: The Centered Corridor
```
  [1920px Desktop Screen]
  ┌───────────────────────────────────────────────────────────┐
  │               ┌───────────────┐                           │
  │               │ Checkout Form │                           │
  │   [EMPTY]     │ max-w-md      │         [EMPTY]           │
  │   (700px)     │ (448px wide)  │         (700px)           │
  │               └───────────────┘                           │
  └───────────────────────────────────────────────────────────┘
  ❌ Result: Cramped inputs, unreadable summary, wasted viewport.
```

### Compliant Pattern: Balanced Multi-Column Composition
```
  [1920px Desktop Screen]
  ┌───────────────────────────────────────────────────────────┐
  │       ┌────────────────────────┬──────────────────┐       │
  │       │ Contact & Shipping     │ Order Summary    │       │
  │       │ (7 Columns / ~720px)   │ (5 Columns)      │       │
  │       │ Form fields, pickup,   │ Subtotals, cart, │       │
  │       │ address inputs, pay    │ coupons, trust   │       │
  │       └────────────────────────┴──────────────────┘       │
  │       <─────────────── max-w-[1280px] ───────────>       │
  └───────────────────────────────────────────────────────────┘
  ✔ Result: Ergonomic proportions, clear summary, balanced space.
```

---

## 6. Internal Card Padding Standards

- **Standard Cards (Product card, Checkout panel, Settings card)**:
  - Desktop: `p-6` (24px) or `p-7` (28px).
  - Mobile: `p-4` (16px) or `p-5` (20px).
- **Dense Table / Accordion Cells**:
  - Horizontal: `px-4` to `px-6` (16px–24px).
  - Vertical: `py-3.5` to `py-4.5` (14px–18px).
- **Compact Badges & Pill Buttons**:
  - `px-3 py-1.5` (12px horizontal, 6px vertical).
