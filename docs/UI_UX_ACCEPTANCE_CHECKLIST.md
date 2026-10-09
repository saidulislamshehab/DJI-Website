# Pre-Merge UI/UX Acceptance Checklist

This document is the **mandatory gatekeeper checklist**. No feature, redesign, or page modification may be marked as complete, approved, or merged into `main` without satisfying every item in this audit.

---

## 1. Typography & Readability Audit

- [ ] **Primary Body Text**: Paragraphs, specifications, and descriptions are styled at **15px – 17px** (Desktop) and **14px – 16px** (Mobile). Zero instances of `text-xs` or `text-[10px]` for primary content.
- [ ] **Headings Hierarchy**: Main headings (H1) are **30px – 42px**; section headings (H2) are **24px – 34px**; subsection headings (H3) are **18px – 22px**. Headings are noticeably larger and heavier than body copy.
- [ ] **Line Height & Measure**: Paragraphs use `leading-relaxed` (1.55–1.65) or `leading-normal` (1.5). Container widths for prose do not exceed 75 characters per line (`max-w-2xl` / `max-w-3xl`).
- [ ] **Mobile Input Typography**: All `<input>`, `<select>`, and `<textarea>` elements specify at least **16px** font size (`text-base sm:text-[15px]`) on mobile viewports to prevent iOS Safari auto-zoom.
- [ ] **Price Formatting**: Prices are displayed in Australian Dollars (`$X,XXX.XX AUD`) with bold, high-contrast typography (24px–32px). Compare-at prices are clearly struck-through with gray-400.

---

## 2. Component Dimensions & Touch Targets Audit

- [ ] **Primary Action Buttons**: "Add to Cart", "Buy Now", and "Complete Order" buttons are between **46px and 50px** high (`h-12`).
- [ ] **Secondary Buttons**: "Learn More", "Filter", and secondary actions are between **40px and 46px** high (`h-11`).
- [ ] **Text & Select Inputs**: Form inputs are between **46px and 50px** high (`h-12`) with `px-4` padding.
- [ ] **Touch Target Bounds**: All buttons, inputs, checkboxes, and clickable cards provide an active touch target of at least **44 × 44px**.
- [ ] **Icon Buttons**: Icon-only buttons (close, menu, cart) have a bounding box of at least **44 × 44px** and internal glyphs of **18px – 22px**.
- [ ] **Row Alignment**: Action buttons placed side-by-side in the same row share the exact same height.

---

## 3. Spacing, Padding & Layout Balance Audit

- [ ] **Container Max Width**: Pages conform to standard widths: Full-bleed canvas (`max-w-[1760px]`), Commerce PDP/PLP (`max-w-[1400px]`), Checkout/Cart (`max-w-[1280px]`), Prose (`max-w-[860px]`).
- [ ] **No "Empty Ocean" Desktop Defect**: Multi-column forms and checkout flows use balanced desktop compositions instead of being confined to a narrow centered `max-w-md` box on widescreen monitors.
- [ ] **Section Vertical Rhythm**: Sections maintain consistent breathing room: **56px – 88px** (`py-14` to `py-20`) on desktop; **36px – 56px** (`py-9` to `py-14`) on mobile.
- [ ] **Internal Card Padding**: Content cards maintain at least **20px – 28px** padding on desktop and **16px – 20px** on mobile. Zero instances of `p-2` on text cards.
- [ ] **Consistent Gaps**: Product card grids maintain 24px–28px gaps (`gap-6` / `gap-7`); bento cards maintain 16px–24px gaps; form fields maintain 16px–20px vertical gaps.

---

## 4. Responsive Adaptation & Reflow Audit

- [ ] **Grid Reflow (No Shrink-to-Fit)**: Desktop 4-column product grids reflow cleanly to 3 columns on tablet and **2 columns** on mobile. No 3- or 4-column squeezing on phones.
- [ ] **PDP Shopping Hero Reflow**: Media gallery and purchase panel stack vertically into 100% width blocks on tablet and mobile viewports.
- [ ] **Zero Horizontal Overflow**: The page introduces zero window-level horizontal scrollbars on mobile viewports (`document.documentElement.scrollWidth <= window.innerWidth`).
- [ ] **Table Wrapping**: All specification sheets and comparison tables are enclosed in responsive horizontal scrolling containers with visible scroll indicators.
- [ ] **Sticky Mobile Bottom Bar**: Product detail pages render a floating bottom purchase bar (`MobilePurchaseBar.tsx`) on mobile viewports `< 768px`.

---

## 5. Accessibility (WCAG 2.2 AA) Audit

- [ ] **Color Contrast**: Normal text satisfies at least **4.5:1** contrast against its background (`#121212` or `#4b5563` on `#ffffff`).
- [ ] **Visible Focus Rings**: All interactive elements display a visible outline ring (`focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2`).
- [ ] **Semantic Markup**: Proper landmark elements (`<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`) and heading hierarchies (`<h1>` through `<h6>`) are strictly used.
- [ ] **Accessible Icon Buttons**: All icon-only triggers declare explicit `aria-label` or visually hidden screen reader text.
- [ ] **Modal Focus Trapping**: Modals trap keyboard focus, dismiss on `Escape`, and return focus to the trigger upon closing.
- [ ] **Form Labeling**: Every input field is paired with an explicit `<label htmlFor="...">` tag.

---

## 6. Interaction States & Data Integrity Audit

- [ ] **Five State Coverage**: Every button and control displays clear Resting, Hover, Active, Focus, and Disabled/Loading states.
- [ ] **Data Authenticity**: All product details, prices, stock counts, and reviews originate from real backend API endpoints or authentic empty fallbacks. Zero fabricated mock data.
- [ ] **Live Recalculation**: Variant selection updates price, SKU, and gallery imagery in real time without page reloads.
- [ ] **Empty States**: Empty searches and empty cart views provide reassuring messaging and clear recovery action buttons.
- [ ] **Loading Skeletons**: Skeleton placeholders match the exact dimensions and geometry of the final loaded components.

---

## 7. Verification & Engineering Quality Gate

- [ ] **Frontend TypeScript Validation**: `npx --prefix frontend tsc --project frontend/tsconfig.json --noEmit` exits with code `0`.
- [ ] **Backend TypeScript Validation**: `npm --prefix backend run lint` exits with code `0`.
- [ ] **Production Build Check**: `npm --prefix frontend run build` completes successfully.
- [ ] **Actual Rendered Inspection**: Dev servers verified on ports 3000 and 5000; rendered HTML inspected across all 8 standard viewports (1920px, 1440px, 1280px, 1024px, 768px, 430px, 390px, 360px).
- [ ] **Console Cleanliness**: Zero React key warnings, hydration errors, or unhandled promise rejections in browser console.
