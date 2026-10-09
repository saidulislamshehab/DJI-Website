# Icons, Micro-Interactions & Animation Standards

This document establishes the standards for **iconography, button states, micro-interactions, and motion design** across the D1 Store platform.

---

## 1. Icon Library Standard: Lucide React

All icons across the platform must come strictly from **Lucide React** (`lucide-react`).

- **BANNED**: Mixing in FontAwesome, Material Icons, emoji characters (`🔥`, `⭐` in UI labels), or ad-hoc SVGs.
- **Stroke Width**: Standardized to `1.75px` or `2px` (`strokeWidth={2}`). Avoid hairline or ultra-heavy weights.

---

## 2. Standard Icon Size Scale

```
  ┌────────────────────────────────────────────────────────┐
  │ Micro-Inline:  w-3.5 h-3.5 (14px) [Badges only]        │
  ├────────────────────────────────────────────────────────┤
  │ Standard UI:   w-4 h-4 / w-5 h-5 (16px – 20px) [Buttons]
  ├────────────────────────────────────────────────────────┤
  │ Prominent:     w-6 h-6 (24px) [Empty States, Headers] │
  ├────────────────────────────────────────────────────────┤
  │ Feature Hero:  w-8 h-8 (32px) [Trust Banners]          │
  └────────────────────────────────────────────────────────┘
```

| Scale Tier | Dimension Classes | Pixel Size | Authorized Context |
|:---|:---:|:---:|:---|
| **Micro-Inline** | `w-3.5 h-3.5` | 14px | Micro-badges (`Sparkles`, `Check` inside status pills). |
| **Standard Button / Input** | `w-4 h-4` | 16px | Search bar icons, button chevrons, close triggers. |
| **Interface Navigation** | `w-5 h-5` | 20px | Header cart icon, user profile, accordion chevrons, star ratings. |
| **Section Anchor** | `w-6 h-6` | 24px | Empty state icons, filter dialog triggers. |
| **Feature / Trust Badge** | `w-8 h-8` | 32px | Trust bar icons (`ShieldCheck`, `Truck`, `RotateCcw`, `Award`). |

---

## 3. Accessible Icon-Only Controls

Any button or trigger that contains an icon without accompanying visible text **MUST** declare an accessible label via `aria-label`:

```tsx
// Compliant Pattern
<button
  type="button"
  onClick={handleClose}
  aria-label="Close dialog"
  className="w-11 h-11 rounded-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]"
>
  <X className="w-5 h-5" aria-hidden="true" />
</button>
```

---

## 4. Interaction States Pipeline

Every interactive control must support five distinct visual states:

1. **Resting**: Clean, clear contrast against surface.
2. **Hover**: Smooth color transition (`duration-200 ease-out`). Buttons darken slightly; cards elevate by `-2px` with expanded shadow.
3. **Active (Pressed)**: Subtle downscale (`active:scale-[0.98] duration-100`).
4. **Focus-Visible**: Explicit 2px blue ring (`focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2`).
5. **Loading**: Replaces icon or text with centered spinning indicator (`Loader2 className="w-5 h-5 animate-spin"`), with `disabled` and `aria-busy="true"`.

---

## 5. Motion Preferences & `prefers-reduced-motion`

Animations must be purposeful and subtle, enhancing comprehension without creating distraction or motion sickness.

### Global CSS Defense:
As declared in `frontend/src/app/globals.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Standard Transitions:
- Color transitions: `transition-colors duration-200 ease-out`.
- Modal / drawer fades: `transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)`.
- Card elevation: `transition-all duration-200 ease-out`.
