# Master UI/UX Rules & Core Design Invariants

This document establishes the **highest-authority visual and interaction standards** for the D1 Store e-commerce platform. These rules are **invariant**: they apply unconditionally to every page, modal, drawer, form, card, and component across the entire repository.

If any page-specific document, utility class, or legacy snippet suggests a practice that conflicts with this document, **this document wins**.

---

## 1. The Core Tenets

Every interface rendered on this platform must satisfy eight fundamental principles:

1. **Uncompromised Readability**: Text must be instantly legible without squinting or zooming. Primary product names, prices, body descriptions, and interactive button labels must never be rendered in tiny, compressed font sizes.
2. **Professional Proportionality**: Component heights, paddings, gaps, and hit targets must match standard human ergonomics. Buttons, inputs, and touch targets must not be shrunken down just to cram more items onto a single screen.
3. **Effective Space Utilization**: Wide desktop viewports (1280px–1920px) must use screen real estate with balanced multi-column composition. Layouts must never restrict critical user journeys (such as checkout, cart, or product details) to narrow mobile-width corridors that leave 60% of the screen as vacant white void.
4. **Adaptive Responsive Reflow**: On mobile devices, layouts must **reflow and stack** vertically rather than shrink component scale or scale down text to illegible sizes.
5. **Cross-Route Visual Consistency**: Shared components (buttons, badges, inputs, cards, headers, prices) must look and feel identical whether viewed on the homepage, category listing, product detail page, cart, checkout, or account portal.
6. **Robust Visual Hierarchy**: Every page must have an unambiguous focal point. Headings, subheadings, primary actions, secondary metadata, and helper text must be clearly differentiated through deliberate scale, weight, and contrast.
7. **Accessibility by Default**: Interfaces must comply with **WCAG 2.2 Level AA** standards: minimum 4.5:1 contrast for normal text, visible keyboard focus rings, semantic markup, and minimum 44×44px interactive touch targets.
8. **Truthful Data Representation**: No simulated mock data, fake rating badges, or hardcoded fake prices. All data must reflect genuine backend states or clean, graceful empty fallbacks.

---

## 2. Invariant Typography & Readability Rules

### The Primary Text Rule
> **RULE**: Primary content, including paragraph descriptions, product specifications, standard form labels, input values, and button text, must NEVER use font sizes below **14px** on desktop or **14px** on mobile.

| Content Classification | Allowed Font Size Range | Prohibited Classes | Purpose & Examples |
|:---|:---:|:---|:---|
| **Main Page Heading** | **32px – 42px** (Desktop)<br>**26px – 34px** (Mobile) | `text-lg`, `text-xl` | Primary page title, category banner titles. |
| **Product Detail Title** | **30px – 40px** (Desktop)<br>**24px – 32px** (Mobile) | `text-sm`, `text-base` | Product page main title (e.g. "DJI Osmo Pocket 4"). |
| **Section Heading** | **24px – 34px** (Desktop)<br>**22px – 28px** (Mobile) | `text-xs`, `text-sm` | "What's in the Box", "Specifications", "Reviews". |
| **Card / Subsection Title** | **18px – 22px** (Desktop)<br>**16px – 20px** (Mobile) | `text-xs`, `text-[12px]` | Bento card titles, feature headers, accordion titles. |
| **Product Card Grid Title** | **15px – 17px** | `text-[10px]`, `text-[11px]` | Product card name in listing grids (2-line clamp). |
| **Standard Body Text** | **15px – 17px** (Desktop)<br>**14px – 16px** (Mobile) | `text-xs`, `text-[11px]` | Descriptions, overview story paragraphs, FAQ answers. |
| **Primary Price Display** | **24px – 32px** (Desktop)<br>**22px – 28px** (Mobile) | `text-sm`, `text-base` | Hero product price, checkout final total. |
| **Product Card Price** | **17px – 20px** | `text-xs`, `text-[12px]` | Card price in collection grids. |
| **Form Labels & Inputs** | **14px – 16px** (16px on iOS input) | `text-[10px]`, `text-xs` | Text fields, selects, address inputs, radio labels. |
| **Button Text** | **14px – 16px** (Font-weight 600–700) | `text-[10px]`, `text-xs` | "Add to Cart", "Buy Now", "Proceed to Checkout". |
| **Secondary Metadata** | **12px – 14px** | `text-[8px]`, `text-[9px]` | SKUs, timestamps, category tags, stock count labels. |
| **Micro-Badges / Disclosures** | **11px – 12px** (Uppercase, bold) | `text-[7px]`, `text-[8px]` | "FREE SHIPPING", "NEW ARRIVAL", legal disclaimers. |

### Banned Typography Anti-Patterns
- **BANNED**: Using `text-xs` (12px) or `text-[10px]` for body descriptions simply because you want to cram text into a smaller box.
- **BANNED**: Setting headings smaller than body copy.
- **BANNED**: Paragraph line-lengths exceeding 75 characters without proper column constraints (results in eye fatigue on ultra-wide monitors).
- **BANNED**: Line heights tighter than `leading-snug` (1.35) for body copy. Body text must always use `leading-relaxed` (1.6) or `leading-normal` (1.5).

---

## 3. Invariant Component Dimensions & Touch Targets

### Minimum Interactive Sizing
> **RULE**: Any interactive control intended to be clicked or tapped (buttons, inputs, select triggers, checkboxes, icon triggers) must provide an active hit target of at least **44 × 44px** (or minimum **40px** for secondary desktop buttons).

```
  PROHIBITED: Sub-standard 32px / 36px Controls
  ┌───────────────────────────────┐
  │ [x] Cancel  (h-7 / 28px) ❌   │  <- Illegible, missed taps on mobile
  └───────────────────────────────┘

  MANDATORY: Standard 44px – 50px Controls
  ┌────────────────────────────────────────────────────────┐
  │ [  Proceed to Checkout  ] (h-12 / 48px, text-base)  ✔ │  <- Ergonomic & accessible
  └────────────────────────────────────────────────────────┘
```

1. **Primary Action Buttons ("Add to Cart", "Buy Now", "Checkout")**:
   - Height: **46px – 50px** (`h-12` or `h-[50px]`).
   - Padding: Horizontal `px-6` to `px-8` (24px–32px).
   - Font: `text-[15px]` or `text-base` (16px), `font-bold` or `font-semibold`.
   - Border Radius: Full pill (`rounded-full`) or modern rounded (`rounded-xl` / 12px).
2. **Secondary & Tertiary Buttons ("Filter", "Learn More", "Cancel")**:
   - Height: **40px – 46px** (`h-10` to `h-11`).
   - Padding: Horizontal `px-4` to `px-6` (16px–24px).
   - Font: `text-[14px]` or `text-[15px]`, `font-semibold`.
3. **Form Inputs & Dropdown Triggers**:
   - Height: **46px – 50px** (`h-12` standard, minimum `h-11` / 44px).
   - Padding: Horizontal `px-4` (16px), vertical `py-3`.
   - Font: Minimum `16px` on mobile (to prevent iOS Safari auto-zoom), `15px–16px` on desktop.
4. **Icon Buttons & Floating Controls**:
   - Minimum bounding box: `44 × 44px` (or `40 × 40px` with 44px touch-target padding).
   - Icon interior glyph size: **18px – 22px** (never 12px or 14px).

---

## 4. Invariant Layout & Spatial Balance Rules

### Desktop Viewport Utilization
- **Maximum Widths**:
  - Full-width hero backgrounds & announcement bars: `max-w-[1760px]` or `w-full`.
  - Product Detail Pages (PDP) & Category Grids: `max-w-[1400px]` with `px-4 sm:px-6 lg:px-8`.
  - Multi-step Checkout & Cart: `max-w-[1280px]` with dual-column split (e.g. 7-cols forms, 5-cols summary).
  - Dense Text Pages (Policies, Single Blog Article): `max-w-[860px]` or `max-w-3xl` for optimal reading measure.
- **BANNED**: Rendering a desktop checkout or product purchase form inside a centered `max-w-md` (448px) box on a 1920px screen. This wastes 75% of the viewport and creates an unbalanced, junior interface.

### Section Vertical Rhythm
- Desktop sections must maintain consistent vertical breathing room: **56px – 88px** (`py-14` to `py-20`).
- Mobile sections must maintain: **36px – 56px** (`py-9` to `py-14`).
- Section headings must be followed by a standard bottom margin of **24px – 32px** (`mb-6` to `mb-8`), not arbitrary random margins (`mb-1`, `mb-17`).

### Internal Card Padding
- Standard product, feature, or review cards must have internal padding of:
  - Desktop: **20px – 28px** (`p-5` to `p-7`).
  - Mobile: **16px – 20px** (`p-4` to `p-5`).
- **BANNED**: Placing dense text inside cards with `p-2` or `p-2.5` padding.

---

## 5. Mobile Adaptation Rules

Responsive adaptation does **NOT** mean shrinking element scale. It means **restructuring the layout for touch and single-column consumption**.

```
  PROHIBITED: Shrink to Fit
  Desktop: [ Card 1 ] [ Card 2 ] [ Card 3 ] [ Card 4 ] (4 Columns)
  Mobile:  [C1][C2][C3][C4] (Squeezed 4 columns with 8px text) ❌

  MANDATORY: Structural Reflow
  Desktop: [ Card 1 ] [ Card 2 ] [ Card 3 ] [ Card 4 ] (4 Columns)
  Mobile:  [   Card 1   ]
           [   Card 2   ] (Full width or 2-column grid with 15px text) ✔
```

1. **Grid Reflow**:
   - 4-column product grids reflow to: 3-column (tablet), 2-column (mobile 430px/390px), 1-column (compact 360px).
   - 2-column PDP hero reflows to: Gallery stacked on top, Purchase panel immediately below.
   - Dual-column Checkout reflows to: Collapsible order summary accordion on top, single-column address & payment forms below.
2. **No Horizontal Body Overflow**:
   - No table, image, or card row may trigger window-level horizontal scroll (`overflow-x: hidden` on root, explicit `overflow-x: auto` on tables and carousels only).
3. **Sticky Controls on Mobile**:
   - Product detail pages must render a bottom floating purchase bar (`MobilePurchaseBar.tsx`) on mobile viewports so users can add to cart without scrolling 5000px back to the top.

---

## 6. How to Apply These Rules

- **For New Features**: Implement directly against the tokenized dimensions defined in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) and [`COMPONENT_SIZING_STANDARDS.md`](./COMPONENT_SIZING_STANDARDS.md).
- **For Existing Code / Bug Fixes**: If modifying an existing component that contains tiny text (`text-xs`) or undersized buttons (`h-8`), upgrade that component to comply with these rules.
- **For Design Reviews & AI Agents**: Any code introducing text under 14px for primary content or buttons under 40px must be rejected immediately during review.
