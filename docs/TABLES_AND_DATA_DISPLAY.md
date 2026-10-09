# Tables & Data Display Standards

This document establishes the UI/UX and layout standards for **tabular data, specification sheets, metrics ribbons, and data displays** across the D1 Store platform.

---

## 1. Tabular Data Core Principles

1. **Scannability First**: Dense technical specifications (sensor size, video bitrate, weight, flight time) must be effortless to parse. Align labels left and numerical values left or right consistently.
2. **Never Use Micro-Text**: Avoid the trap of shrinking table text to 10px or 11px to fit wide rows. Keep specification labels at **14px** and values at **14px–15px**.
3. **Responsive Defense**: Tables must never break the viewport layout. On mobile, wrap tables in smooth horizontal scrolling wrappers or reflow them into key-value definition cards.

---

## 2. Technical Specification Tables (`ProductSpecifications.tsx`)

Used in Section 3 of every Product Detail Page.

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │ [Search Specs: "Sensor"]  [All] [Camera] [Battery] [Physical]          │
  ├────────────────────────────────────────────────────────────────────────┤
  │ CAMERA & OPTICS                                                        │
  ├────────────────────────────────────┬───────────────────────────────────┤
  │ Image Sensor                       │ 1/1.3-inch CMOS Sensor            │
  ├────────────────────────────────────┼───────────────────────────────────┤
  │ Lens FOV                           │ 143° Super-Wide Angle             │
  ├────────────────────────────────────┼───────────────────────────────────┤
  │ Max Video Resolution               │ 4K (3840×2160) @ 60fps            │
  ├────────────────────────────────────┼───────────────────────────────────┤
  │ Color Profiles                     │ Normal (10-bit), D-Log M (10-bit) │
  └────────────────────────────────────┴───────────────────────────────────┘
```

### Layout & Class Standards:
- **Category Header Row**:
  - Background: Soft gray surface `bg-gray-50/80`.
  - Typography: `text-[13px] font-extrabold text-gray-900 uppercase tracking-wider py-3.5 px-5`.
- **Key-Value Data Rows**:
  - Border: Subtle bottom border `border-b border-gray-100`.
  - Left Key Cell: Width 35%–40%, `text-[14px] font-semibold text-gray-600 py-3.5 px-5`.
  - Right Value Cell: Width 60%–65%, `text-[14px] sm:text-[15px] font-medium text-[#121212] py-3.5 px-5`.
  - Hover state: Row highlights softly with `hover:bg-blue-50/30 transition-colors`.

---

## 3. Gear Comparison Matrix (`ProductWhatsInTheBox.tsx`)

Compares multiple bundle combos (e.g. Standard Combo vs Creator Combo vs Vlog Combo):

| Item / Feature | Standard Combo (64GB) | Creator Combo (128GB) |
|:---|:---:|:---:|
| **Osmo Nano Camera Unit** | ✔ 1x Included | ✔ 1x Included |
| **Multifunctional Vision Dock** | ✔ 1x Included | ✔ 1x Included |
| **DJI Mic 2 Transmitter** | ✕ | ✔ 1x Included |
| **Magnetic Headband** | ✕ | ✔ 1x Included |
| **Extension Rod & Mini Tripod** | ✕ | ✔ 1x Included |

- **Checkmark Icon**: Centered green circle `Check className="w-5 h-5 text-green-600 mx-auto"`.
- **Missing Icon**: Muted cross or dash `Minus className="w-4 h-4 text-gray-300 mx-auto"`.
- **Mobile Behavior**: Enables horizontal scrolling with sticky left feature column:
  ```tsx
  <div className="w-full overflow-x-auto no-scrollbar pb-4">
    <table className="min-w-[580px] w-full border-collapse">...</table>
  </div>
  ```

---

## 4. Key Metric & Statistics Ribbons (`ProductOverview.tsx`)

Prominently showcases top product specifications in a high-impact horizontal ribbon:

```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 py-8 border-y border-white/10">
  {stats.map((item) => (
    <div key={item.label} className="text-center sm:text-left space-y-1">
      <p className="text-xs font-bold text-white/50 uppercase tracking-widest">{item.label}</p>
      <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{item.value}</p>
      <p className="text-[13px] text-white/70 font-medium">{item.detail}</p>
    </div>
  ))}
</div>
```

---

## 5. Review Distribution & Ratings Display (`ProductReviews.tsx`)

- **Overall Numerical Score**: `text-4xl sm:text-5xl font-black text-[#121212]`.
- **Review Count & Stars**: Accompanying 5-star visual glyphs (`w-5 h-5 fill-amber-400 text-amber-400`).
- **Distribution Progress Bars**:
  - 5-Star down to 1-Star rows.
  - Track: `h-2.5 w-full bg-gray-100 rounded-full overflow-hidden`.
  - Fill Bar: `h-full bg-[#f5a623] rounded-full transition-all duration-500`.
  - Percent Indicator: `text-[13px] font-bold text-gray-500 w-10 text-right`.

---

## 6. Currency & Financial Formatting Rules

- **Standard Currency Format**: Australian Dollars (**AUD**).
- Format whole numbers cleanly: `$529.00 AUD` or `$1,149.00 AUD`.
- Strikethrough compare-at price: `$1,249.00` in `text-gray-400 line-through`.
- Savings highlight: `Save $100.00 (8% OFF)` in `text-green-700 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold`.
