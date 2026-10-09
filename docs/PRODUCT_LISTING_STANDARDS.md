# Product Listing & Catalog Standards (PLP)

This document establishes the UI/UX and architectural standards for all **Product Listing Pages, Category Pages, and Search Results** (`/collections/[slug]`, `/collections`, `/search`).

---

## 1. Master Page Structure & Hierarchy

```
  ┌────────────────────────────────────────────────────────┐
  │ 1. Hero Banner or Breadcrumb Header                    │
  ├────────────────────────────────────────────────────────┤
  │ 2. Sticky Filter & Tier Navigation Toolbar             │
  │    [All] [Products] [Bundles] [Accessories] | Sort     │
  ├────────────────────────────────────────────────────────┤
  │ 3. Responsive Product Grid                             │
  │    (4-col desktop, 3-col tablet, 2-col mobile)         │
  ├────────────────────────────────────────────────────────┤
  │ 4. Pagination / Infinite Scroll Loading State          │
  └────────────────────────────────────────────────────────┘
```

---

## 2. Product Card Specification

Product cards are the foundational atomic component of the e-commerce catalog. They must be balanced, touch-friendly, and visually uniform across all screen sizes.

```
  ┌────────────────────────────────────────────────────────┐
  │ [OFFICIAL RELEASE]                                     │
  │                                                        │
  │                     [ Image ]                          │
  │                   aspect-square                        │
  │                                                        │
  ├────────────────────────────────────────────────────────┤
  │ DJI Osmo Pocket 4 Creator Combo                        │
  │ (text-[15px] sm:text-base font-bold line-clamp-2)      │
  │                                                        │
  │ Handheld Cameras • 4K/240fps                           │
  │                                                        │
  │ ★★★★★ (142)                                            │
  │                                                        │
  │ $1,149.00 AUD  <s class="text-gray-400">$1,249.00</s>  │
  │ (text-lg sm:text-xl font-black text-[#121212])         │
  │                                                        │
  │ [           + Add to Cart (h-10 / 40px)              ] │
  └────────────────────────────────────────────────────────┘
```

### Card Anatomy & Rules:
1. **Container Dimensions**:
   - Total Height: **420px – 480px** on desktop; auto-height on mobile.
   - Internal Padding: `p-4 sm:p-5`.
   - Border & Radius: `rounded-[20px] border border-gray-100 bg-white hover:shadow-md hover:-translate-y-1 transition-all`.
2. **Product Image Area**:
   - Aspect Ratio: `aspect-square` or `aspect-[4/3]` with padding around the cutout product image.
   - Background: Clean white `#ffffff` or ultra-soft `#fbfbfd`.
   - Hover zoom: Subtle scale transition on image (`group-hover:scale-105 transition-transform duration-300`).
3. **Typography**:
   - Title: `text-[15px] sm:text-[16px] font-bold text-[#121212] line-clamp-2 leading-snug`.
   - Category / Subtitle: `text-[13px] text-gray-500 font-medium`.
   - Price: `text-lg sm:text-xl font-black text-[#121212] tracking-tight`.
   - Strikethrough compare-at price: `text-[13px] text-gray-400 line-through`.
4. **Interactive Action**:
   - "Quick Add" or "Add to Cart" button: Minimum height **40px – 44px** (`h-10 sm:h-11 rounded-full bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-bold`).
   - Must provide immediate visual feedback upon clicking (icon transitions to checkmark, toast confirmation via Sonner).

---

## 3. Responsive Column Allocation

> **RULE**: Do NOT cram excessive product cards into a single row. Respect the reading bounds and image clarity of each card.

| Viewport Width | Device Category | Columns | Gap |
|:---|:---|:---:|:---:|
| **1440px – 1920px** | Large Desktop / Studio Display | **4 Columns** | `gap-7` (28px) |
| **1024px – 1280px** | Standard Desktop / Laptops | **3 or 4 Columns** | `gap-6` (24px) |
| **768px – 1023px** | iPad / Android Tablets | **3 Columns** | `gap-5` (20px) |
| **430px – 640px** | Large Mobile (iPhone Pro Max) | **2 Columns** | `gap-4` (16px) |
| **360px – 390px** | Standard & Compact Mobile | **2 Columns** | `gap-3.5` (14px) |

---

## 4. Sticky Filter & Sorting Toolbar

The catalog toolbar must stick to the top as the user scrolls through hundreds of products:

```tsx
<div
  style={{
    position: "sticky",
    top: "var(--nav-offset, 72px)",
    zIndex: 30,
    backgroundColor: "#ffffff",
  }}
  className="w-full bg-white border-b border-gray-200 shadow-xs"
>
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-[36px] py-3.5 flex flex-wrap items-center justify-between gap-4">
    {/* Left: Tier Filter Tabs */}
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
      {["All", "Products", "Bundles", "Accessories"].map((tab) => (
        <button key={tab} className="px-5 py-2.5 rounded-[10px] text-sm font-bold ...">
          {tab}
        </button>
      ))}
    </div>

    {/* Right: Stock Toggle & Sort Dropdown */}
    <div className="flex items-center gap-4">
      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
        <input type="checkbox" className="w-4 h-4 rounded text-[#0071e3]" />
        <span>In Stock Only</span>
      </label>

      <select className="h-10 px-3 rounded-[10px] border border-gray-200 text-sm font-bold text-[#121212]">
        <option value="featured">Featured</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
      </select>
    </div>
  </div>
</div>
```

---

## 5. Tiered Sorting Logic

In collections containing mixed categories (e.g. `dji-avata-2`), the catalog implements a **3-tier sorting order**:
1. **Tier 0: Actual Core Products**: The primary drone, gimbal, or camera appears first.
2. **Tier 1: Bundles & Combos**: Official "Fly More Combos" and creator bundles appear immediately after.
3. **Tier 2: Accessories & Parts**: Propellers, batteries, carrying cases, and cables appear subsequent to main products.

---

## 6. Empty Search & Filter Results

When zero products match the user's active search query or filter pills:
1. Provide a clean empty state card (`max-w-md mx-auto py-16 text-center`).
2. Clearly display the query: *"No products found for 'xyz'"*.
3. Provide a prominent **"Clear All Filters"** button.
4. Render 4–6 quick suggestion chips for popular categories: `[Drones]`, `[Handhelds]`, `[Action Cameras]`, `[Accessories]`.
