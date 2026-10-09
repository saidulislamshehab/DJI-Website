# Responsive Design & Multi-Device Breakpoint Standards

This document establishes the **responsive adaptation standards** across all supported screen resolutions for the D1 Store platform.

---

## 1. Verified Testing Viewports

Every interface and layout must be visually inspected and verified at these **eight canonical viewport widths**:

```
  ┌────────────────────────────────────────────────────────┐
  │ 1920px  Ultra-Wide Desktop (Studio Display, 1080p Ext) │
  ├────────────────────────────────────────────────────────┤
  │ 1440px  Large Desktop Monitor, MacBook Pro 16"         │
  ├────────────────────────────────────────────────────────┤
  │ 1280px  Standard Laptop Display (MacBook Air 13")      │
  ├────────────────────────────────────────────────────────┤
  │ 1024px  Small Laptop, iPad Pro Landscape (Tablet Max)  │
  ├────────────────────────────────────────────────────────┤
  │  768px  iPad Portrait, Standard Android Tablet         │
  ├────────────────────────────────────────────────────────┤
  │  430px  Large Mobile (iPhone 14/15/16 Pro Max)         │
  ├────────────────────────────────────────────────────────┤
  │  390px  Standard Mobile (iPhone 12/13/14/15/16)        │
  ├────────────────────────────────────────────────────────┤
  │  360px  Compact Android (Samsung Galaxy A-series)      │
  └────────────────────────────────────────────────────────┘
```

---

## 2. The Core Law of Responsive Adaptation

> **THE CARDINAL RULE**: Responsive design rearranges, stacks, and reflows content. It **NEVER** shrinks component scale, contracts button heights below 44px, or scales typography down to microscopic sizes just to force multi-column content onto small screens.

---

## 3. Section-by-Section Responsive Transition Matrix

### 1. Product Detail Page (PDP) Shopping Hero
- **Desktop (≥ 1024px)**:
  - 12-column grid (`grid grid-cols-12 gap-12 lg:gap-14`).
  - Left column: 7 columns (`lg:col-span-7`) dedicated to the media gallery.
  - Right column: 5 columns (`lg:col-span-5`) for the sticky product purchase panel.
- **Tablet (768px – 1023px)**:
  - Stacks into single column. Media gallery renders full-width top; purchase panel renders directly beneath with full 100% width.
- **Mobile (360px – 430px)**:
  - Single column. Gallery features touch swipe thumbnails.
  - Key purchase actions mirrored in the **sticky bottom bar** (`MobilePurchaseBar.tsx`) to eliminate scrolling fatigue.

### 2. Collection & Search Product Grids (PLP)
- **1440px – 1920px**: **4 Columns** (`grid-cols-4 gap-7`).
- **1024px – 1280px**: **3 or 4 Columns** (`grid-cols-3 lg:grid-cols-4 gap-6`).
- **768px – 1023px**: **3 Columns** (`grid-cols-3 gap-5`).
- **430px – 640px**: **2 Columns** (`grid-cols-2 gap-4`).
- **360px – 390px**: **2 Columns** with compact padding (`grid-cols-2 gap-3.5`).
- **PROHIBITION**: Never render 3 or 4 columns on mobile phones. This compresses cards into illegible vertical slivers.

### 3. "What's in the Box" Gear Cutout Grid
- **Desktop (≥ 1024px)**: **6 Columns** or **4 Columns** (`grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4`).
- **Tablet (768px – 1023px)**: **3 or 4 Columns** (`grid-cols-3 sm:grid-cols-4 gap-4`).
- **Mobile (360px – 430px)**: **2 Columns** (`grid-cols-2 gap-3`).
  - Cards maintain clear 1:1 image boxes and legible 2-line accessory descriptions.

### 4. Overview Bento Feature Cards
- **Desktop (≥ 1024px)**: **3 Equal Columns** (`grid-cols-1 md:grid-cols-3 gap-6`).
- **Mobile & Tablet (< 1024px)**: Stacks into **1 Column** vertical cards (`space-y-4`).

### 5. Multi-Step Checkout Experience
- **Desktop (≥ 1024px)**:
  - 12-column split within `max-w-[1280px]`: 7 columns (`lg:col-span-7`) for customer address & payment forms; 5 columns (`lg:col-span-5`) for sticky order summary.
- **Mobile (< 1024px)**:
  - Single column form stack.
  - Sticky/collapsible **Order Summary Accordion** at top of screen (`MobileOrderSummaryToggle.tsx`) allows users to review line items and totals on demand without dominating vertical screen height.

---

## 4. Mobile Form Layouts & iOS Safari Standards

1. **Input Grouping**:
   - Desktop: Side-by-side inputs (e.g., First Name + Last Name, City + State + Postcode).
   - Mobile: Stacks side-by-side inputs vertically or keeps only related pairs (e.g. First/Last Name) in a 2-column grid while keeping street addresses 100% width.
2. **The 16px Font Rule**:
   - All inputs on mobile must specify `text-base` (16px) font size to prevent iOS Safari from automatically zooming into the field upon focus.
3. **Safe Area Insets**:
   - Fixed mobile elements (such as `MobilePurchaseBar` and mobile navigation drawers) must incorporate CSS environment variables:
   ```css
   padding-bottom: max(16px, env(safe-area-inset-bottom));
   ```

---

## 5. Horizontal Overflow Prevention Strategy

Unintentional horizontal scrolling is an immediate quality failure.

1. **Root Protection**:
   - `html, body { overflow-x: hidden; width: 100%; }`
2. **Table Wrapping**:
   - Specification tables and comparison matrices must always be wrapped in an explicit scrolling container:
   ```tsx
   <div className="w-full overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
     <table className="min-w-[640px] w-full">...</table>
   </div>
   ```
3. **Image Fluidity**:
   - All image elements must enforce `max-w-full h-auto` or use Next.js `<Image />` with `fill` and responsive `sizes` attributes.
