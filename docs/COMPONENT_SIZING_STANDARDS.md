# Component Sizing Standards & Dimension Specifications

This document defines the **standard height, width, padding, and dimensional tokens** for every reusable component on the D1 Store platform.

---

## 1. Primary Component Dimensional Matrix

```
  ┌────────────────────────────────────────────────────────┐
  │ Primary Action Button: 48px – 50px (h-12)              │
  ├────────────────────────────────────────────────────────┤
  │ Secondary Button:      42px – 46px (h-11)              │
  ├────────────────────────────────────────────────────────┤
  │ Text / Select Input:   46px – 50px (h-12)              │
  ├────────────────────────────────────────────────────────┤
  │ Icon Touch Target:     44px × 44px (p-2.5)             │
  ├────────────────────────────────────────────────────────┤
  │ Card Internal Padding: 20px – 28px (p-5 to p-7)        │
  └────────────────────────────────────────────────────────┘
```

| Component | Standard Height | Minimum Touch Target | Padding / Dimensions | Target Classes |
|:---|:---:|:---:|:---:|:---|
| **Primary CTA Button** | **48px – 50px** | 48px | `px-7 py-3` | `h-12 px-7 rounded-full text-base font-bold` |
| **Secondary Button** | **42px – 46px** | 44px | `px-5 py-2.5` | `h-11 px-5 rounded-xl text-sm font-semibold` |
| **Form Text Input** | **46px – 50px** | 46px | `px-4 py-3` | `h-12 px-4 rounded-xl text-base sm:text-[15px]` |
| **Dropdown Select Trigger** | **46px – 50px** | 46px | `px-4 py-3` | `h-12 px-4 rounded-xl text-sm sm:text-base` |
| **Icon Button** | **44px × 44px** | 44px | Bounding `size-11` | `w-11 h-11 flex items-center justify-center rounded-full` |
| **Checkbox / Radio Control** | **20px × 20px** | 44px (with label) | Box `w-5 h-5` | `w-5 h-5 rounded-md border-gray-300 text-[#0071e3]` |
| **Quantity Stepper Input** | **46px – 50px** | 46px | Total `h-12` | `h-12 rounded-full border border-gray-200 px-3` |
| **Filter Navigation Pill** | **38px – 42px** | 44px | `px-4 py-2` | `px-5 py-2.5 rounded-[10px] text-sm font-bold` |
| **Status Badge / Tag** | **24px – 28px** | N/A (non-tap) | `px-3 py-1` | `px-3 py-1 rounded-full text-[12px] font-bold` |
| **Product Card** | **420px – 480px** | Entire card | `p-4 sm:p-5` | `rounded-[20px] border border-gray-100 bg-white` |
| **Gallery Thumbnail** | **72px – 80px** | 72px | `size-18` to `size-20` | `w-18 h-18 sm:w-20 sm:h-20 rounded-xl border` |
| **Sticky Section Sub-Nav** | **52px – 58px** | 52px | Bar height | `py-3 border-y border-gray-200 bg-white/95` |
| **Mobile Bottom Bar** | **68px – 76px** | Full screen width | Floating dock | `fixed bottom-0 inset-x-0 h-[72px] px-4 bg-white` |

---

## 2. Detailed Component Specifications

### 1. Buttons & Action Triggers
- **Primary ("Add to Cart", "Instant Buy", "Place Order")**:
  - Class pattern: `h-12 px-8 rounded-full bg-[#0071e3] hover:bg-[#0058b8] text-white font-bold text-base shadow-sm transition-all cursor-pointer`
  - Never allow primary buttons to fall below `46px` in height.
- **Secondary ("Learn More", "Continue Shopping")**:
  - Class pattern: `h-11 px-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm transition-all cursor-pointer`
- **Icon Only ("Close Dialog", "Next Slide", "Toggle Filter")**:
  - Class pattern: `w-11 h-11 rounded-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer`
  - Internal Lucide icon: `w-5 h-5` (never `w-3 h-3`).

### 2. Form Inputs & Select Triggers
- **Input Fields**:
  - Class pattern: `h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base sm:text-[15px] placeholder-gray-400 focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all`
  - Always pair with an explicit `<label className="block text-[14px] font-semibold text-gray-800 mb-1.5">`.

### 3. Product Cards (Collection Grids & Carousels)
- **Dimensions**:
  - Image area: Square `aspect-square` or `aspect-[4/3]` with `p-4` surrounding the cutout product image.
  - Overall card height: **420px – 480px** on desktop, responsive auto-height on mobile.
  - Padding: `p-4 sm:p-5`.
  - Border radius: `rounded-[20px]` or `rounded-2xl`.
- **Content Hierarchy**:
  - Badge / Series tag: Top-left `text-[11px] font-bold`.
  - Title: 2-line clamped `text-[15px] sm:text-base font-bold text-[#121212]`.
  - Price: `text-lg sm:text-xl font-black text-[#121212]`.
  - Quick-Add Button: Minimum `h-10 px-4 rounded-full text-xs font-bold`.

### 4. Image Galleries & Lightbox Modals
- **Main Viewport**:
  - Desktop: Minimum `aspect-[4/3]` or `h-[480px] – h-[560px]`, rounded `rounded-2xl`, background `#f9fafb` or white.
  - Mobile: Full width `aspect-square` or `aspect-[4/3]`.
- **Thumbnails**:
  - Desktop track: Horizontal row or vertical column of `w-18 h-18 sm:w-20 sm:h-20` (72px–80px) thumbnails.
  - Active thumbnail indicator: `ring-2 ring-[#0071e3] ring-offset-2`.
- **Lightbox Dialog**:
  - Responsive dialog container: `max-w-5xl w-full h-[85vh]` with centered zoomable image and accessible navigation arrows (`w-12 h-12`).

### 5. Modals, Drawers & Dialogs
- **Modal Containers**:
  - Standard dialog: `max-w-lg` (512px) or `max-w-2xl` (672px), `rounded-2xl`, internal padding `p-6 sm:p-8`.
  - Mobile: Reflows to slide-up drawer via Vaul or full-screen modal with top sticky close trigger.

### 6. Review Summary & Distribution Bars
- **Numerical Score Display**: `text-4xl sm:text-5xl font-black text-[#121212]`.
- **Star Glyphs**: `w-5 h-5` (`size-5`) colored in `#f5a623`.
- **Progress Track**: Height `h-2.5` (10px) with `rounded-full bg-gray-100`, filled track with `rounded-full bg-[#f5a623]`.
- **Percentage Label**: `text-[13px] font-bold text-gray-500 w-10 text-right`.

### 7. Loading Skeletons
- Always match the exact dimensions of the target component:
  - Product card skeleton: `h-[440px] rounded-[20px] bg-white border border-gray-100 p-5 animate-pulse`.
  - Button skeleton: `h-12 rounded-full bg-gray-200 animate-pulse`.
  - Input skeleton: `h-12 rounded-xl bg-gray-100 animate-pulse`.
