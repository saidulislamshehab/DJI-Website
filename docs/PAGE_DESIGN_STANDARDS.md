# Universal Page Design & Structural Standards

This document establishes the **foundational structure, layout anatomy, and state patterns** common to all pages across the D1 Store platform.

---

## 1. Master Page Anatomy

Every route in the Next.js App Router must conform to this standardized vertical layout pipeline:

```
  ┌────────────────────────────────────────────────────────┐
  │ 1. Announcement Bar (Trust Badges & Value Prop)        │
  ├────────────────────────────────────────────────────────┤
  │ 2. Primary Navigation Header (Logo, Search, Cart, Auth)│
  ├────────────────────────────────────────────────────────┤
  │ 3. Category Bar / Mega Menu (Desktop)                  │
  ├────────────────────────────────────────────────────────┤
  │ 4. Breadcrumb Navigation Strip                         │
  ├────────────────────────────────────────────────────────┤
  │ 5. Page Header / Hero Title Block                      │
  ├────────────────────────────────────────────────────────┤
  │                                                        │
  │ 6. Primary Main Content Container                      │
  │    (max-w-[1400px] or max-w-[1280px])                  │
  │                                                        │
  ├────────────────────────────────────────────────────────┤
  │ 7. Secondary / Related Content (Cross-sells, FAQs)     │
  ├────────────────────────────────────────────────────────┤
  │ 8. Global Universal Footer (Stores, Warranty, Legal)   │
  └────────────────────────────────────────────────────────┘
```

---

## 2. Page Header & Hero Structure

### Breadcrumbs
- **Position**: Located directly below the main header or hero banner.
- **Styling**: `text-[13px] sm:text-[14px] text-gray-500 font-medium`.
- **Delimiters**: Subtle chevron icon (`ChevronRight w-3.5 h-3.5 text-gray-400`).
- **Terminal Element**: The active page name must be styled as bold and high-contrast (`text-[#121212] font-bold`).

### Primary Page Heading Block
```tsx
<div className="max-w-[800px] space-y-3 mb-8 md:mb-12">
  {/* Optional Series / Official Tag */}
  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0071e3] text-xs font-bold">
    <Sparkles className="w-3.5 h-3.5" />
    <span>Official DJI Authorised Catalog</span>
  </div>

  {/* Main H1 Title */}
  <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#121212] tracking-tight leading-tight">
    {pageTitle}
  </h1>

  {/* Subtitle / Intro Copy */}
  <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed">
    {pageDescription}
  </p>
</div>
```

---

## 3. Empty States Architecture

Empty states must never present a dead end or blank screen. They must reassure the customer and provide immediate forward actions.

```
  ┌────────────────────────────────────────────────────────┐
  │                   [ Icon Bubble ]                      │
  │             (w-16 h-16 rounded-full)                   │
  │                                                        │
  │               No Products Found                        │
  │           (text-2xl font-bold text-gray-900)           │
  │                                                        │
  │      We couldn't find any items matching your          │
  │      selected filter criteria. Try clearing filters.   │
  │           (text-sm text-gray-500 max-w-sm)             │
  │                                                        │
  │              [ Reset Filters Button ]                  │
  │                (h-11 px-6 rounded-xl)                  │
  └────────────────────────────────────────────────────────┘
```

### Required Elements:
1. **Visual Anchor**: Circular icon container with soft background (`w-16 h-16 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center mx-auto mb-4`).
2. **Clear Heading**: `text-xl sm:text-2xl font-bold text-gray-900`.
3. **Actionable Explanation**: 1–2 sentences explaining why the list is empty and how to resolve it.
4. **Primary Recovery CTA**: Button linking back to the catalog, resetting filters, or contacting customer support.

---

## 4. Loading States & Skeleton Screens

Spinners alone are insufficient for content-rich pages. Skeletons prevent layout shifts (**CLS**) and reassure the user of incoming content.

1. **Geometry Parity**: The skeleton card must match the exact dimensions, border radius, and aspect ratio of the live component.
2. **Pulse Animation**: Use standard Tailwind `animate-pulse` with neutral zinc/gray tones (`bg-gray-100` or `bg-slate-100`).
3. **No Flashing Over Existing Content**: If refetching on the client when data is already present, use an unobtrusive background indicator rather than tearing down the rendered DOM.

---

## 5. Error Handling & Recovery States

When an API fetch or network request fails:
1. Display a friendly, human-readable error banner:
   ```tsx
   <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
     <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
     <span className="flex-1 font-medium">{errorMessage}</span>
     <button onClick={handleRetry} className="px-4 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs">
       Retry
     </button>
   </div>
   ```
2. For catastrophic page failures, provide a full-page boundary with links to the Home page and Phone Support hotline.

---

## 6. Footer Rhythm & Australian Trust Anchors

Every page concludes with the global footer:
- **Spacing**: Separated from page content by at least `mt-16 sm:mt-24` (64px–96px).
- **Australian Retail Trust Bar**: Prominently displays:
  - 100% Genuine Australian DJI Stock.
  - Nationwide Retail Locations (Melbourne, Sydney, Brisbane, Perth).
  - Certified Local DJI Repair Facility.
  - Payment badges: Visa, Mastercard, AMEX, PayPal, Zip, Apple Pay.
