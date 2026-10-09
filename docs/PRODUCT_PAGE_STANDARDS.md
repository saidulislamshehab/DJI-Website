# Product Detail Page (PDP) Standards

This document establishes the **mandatory design, architectural, and functional standards** for all Product Detail Pages (`/products/[slug]`) on the D1 Store platform.

Reference benchmarks: [DJI Osmo Nano](https://www.d1store.com.au/products/osmo-nano) and [DJI Osmo Pocket 4](https://www.d1store.com.au/products/osmo-pocket-4).

---

## 1. The Mandatory 5-Section Sequence

Every product page in the database **MUST** render the following five content sections in this **strict, non-negotiable sequence**:

```
  ┌────────────────────────────────────────────────────────┐
  │ 0. Primary Shopping Hero (Gallery + Purchase Panel)    │
  ├────────────────────────────────────────────────────────┤
  │    Sticky Section Sub-Navbar (Scrollspy + Quick Buy)   │
  ├────────────────────────────────────────────────────────┤
  │ 1. Product Overview               (#overview)          │
  ├────────────────────────────────────────────────────────┤
  │ 2. What's in the Box              (#in-the-box)        │
  ├────────────────────────────────────────────────────────┤
  │ 3. Specifications                 (#specifications)    │
  ├────────────────────────────────────────────────────────┤
  │ 4. Frequently Asked Questions     (#faqs)              │
  ├────────────────────────────────────────────────────────┤
  │ 5. Customer Reviews               (#reviews)           │
  ├────────────────────────────────────────────────────────┤
  │ 6. Ecosystem & Recommended Accessories                 │
  └────────────────────────────────────────────────────────┘
```

---

## 2. Primary Shopping Hero Layout

- **Container**: `max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12`.
- **Desktop Grid**: 12-column grid (`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14`).
  - **Left 7 Columns (`lg:col-span-7`)**: Product Media Gallery.
  - **Right 5 Columns (`lg:col-span-5`)**: Product Purchase & Information Panel.

### Media Gallery (`ProductGallery.tsx`)
1. **Primary Viewport**:
   - Aspect ratio: `aspect-[4/3]` or minimum `h-[460px] – h-[540px]`.
   - High-resolution rendering with smooth image transitions.
   - Video badge indicator when displaying video content.
   - Interactive zoom / fullscreen trigger opening the **Lightbox Modal**.
2. **Thumbnail Navigation**:
   - Horizontal thumbnail track underneath or vertical strip to the side.
   - Sizing: `w-18 h-18 sm:w-20 sm:h-20` (72px–80px) rounded-xl boxes.
   - Active state: `ring-2 ring-[#0071e3] ring-offset-2`.
3. **Accessible Lightbox Modal**:
   - Fullscreen modal dialog accessible via `Esc`, arrow keys (`←`, `→`), and touch swipe.
   - Media counter (e.g. `3 / 8`) and full resolution pan/zoom.

### Product Purchase Panel (`ProductPurchasePanel.tsx`)
1. **Product Header**:
   - Breadcrumb link jump.
   - Title: `text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#121212] tracking-tight`.
   - Rating star row with jump link clicking straight to `#reviews`.
   - SKU & Stock status indicator (`text-green-600 font-semibold flex items-center gap-1.5`).
2. **Price Block**:
   - Current price: `text-3xl sm:text-4xl font-black text-[#121212] tracking-tight`.
   - Strikethrough compare-at price & calculated savings badge (e.g. `Save $80`).
3. **Dynamic Variant Selector**:
   - Storage capacity, camera combo (Standard vs Creator Combo), or color options.
   - Pills with real-time price, SKU, and image synchronization.
4. **DJI Care Refresh Selector**:
   - Radio cards for official Australian replacement plans: `No Plan`, `1-Year Plan (+ $59)`, `2-Year Plan (+ $99)`.
   - Updates total cart payload dynamically.
5. **Quantity & Action Triggers**:
   - Quantity selector bounded between `1` and current `stockCount`.
   - **Add to Cart Button**: Full pill `h-12 w-full rounded-full bg-[#0071e3] hover:bg-[#0058b8] text-white font-bold text-base shadow-sm`.
   - **Buy Now Button**: Instant checkout bypass button (`h-12 w-full rounded-full border-2 border-[#121212] text-[#121212] font-bold`).
6. **Australian Trust Propositions**:
   - Australian warranty guarantee (2-Year ACL compliance).
   - Free insured express shipping.
   - Local D1 Store retail service centers.

---

## 3. Sticky Section Sub-Navbar (`ProductSectionNavigation.tsx`)

- **Sticky Position**: `position: sticky; top: 0; z-index: 40;` with backdrop blur (`bg-white/95 backdrop-blur-md border-y border-gray-200`).
- **Scrollspy Tracking**: Continuously calculates user scroll position and highlights the active section pill in `#0071e3`.
- **Smooth Scrolling**: Clicking any tab triggers smooth animated scrolling with header offset adjustment (`window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' })`).
- **Desktop Quick-Buy Widget**: Displays thumbnail, product name, current price, and mini "Add to Cart" button when scrolled past the main purchase panel.

---

## 4. The 5 Content Section Specifications

### 1. Product Overview (`ProductOverview.tsx`)
- High-impact dark or light marketing block featuring cinematic product video or high-res imagery.
- **5-Metric Stat Ribbon**: Key highlights (e.g. `52g Body`, `4K/60fps`, `10m Waterproof`, `1/1.3″ CMOS`, `200min Battery`).
- **Bento Feature Grid**: 3 modular cards highlighting camera hardware and engineering.
- **Alternating Visual Story Blocks**: 4 narrative chapters pairing high-contrast imagery with descriptive copy.

### 2. What's in the Box (`ProductWhatsInTheBox.tsx`)
- **Combo Switcher Tabs**: Smooth tab switcher between combos (e.g. Standard Combo vs Creator Combo).
- **Cutout Gear Grid**: 6-column grid displaying high-contrast cutout images of every included accessory with quantity counts.
- **Side-by-Side Comparison Matrix**: Full comparison table showing checkmarks for items included in each combo.

### 3. Specifications (`ProductSpecifications.tsx`)
- Instant live search filter allowing users to find specific specs (e.g. "ISO", "Weight", "Battery").
- Category pill selector (Camera & Optics, Stabilisation, Battery, Dimensions, Connectivity).
- Two-column structured specification table with clear key-value alignments.

### 4. Frequently Asked Questions (`ProductFAQ.tsx`)
- Search bar filtering FAQ entries dynamically.
- Accessible accordion cards built on Radix primitives.
- "Expand All / Collapse All" toggle.
- Direct contact banner for local Australian technical support.

### 5. Customer Reviews (`ProductReviews.tsx`)
- Overall rating score with star distribution progress bars (5-star down to 1-star).
- "Write a Review" button opening an interactive submission modal.
- Real Mongoose backend persistence: reviews calculate live averages, store verified buyer status, and support helpful upvoting.

---

## 5. Universal Dynamic Fallback Strategy

Not every catalog item has custom bento grids or scraped marketing story blocks. The PDP architecture guarantees **graceful, automatic fallback**:
- If no story blocks exist: `ProductOverview` dynamically transforms the product description and features array into a clean highlight grid.
- If no rawSpecs exist: `ProductSpecifications` parses `product.specs` key-value pairs into structured tables.
- If no custom FAQs exist: `ProductFAQ` injects official Australian D1 Store warranty, shipping, and returns FAQs.
- No page may crash or look broken due to missing marketing metadata.
