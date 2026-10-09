# Forms, Inputs & User Entry Standards

This document establishes the **dimensional, visual, and accessibility standards for all form controls** across the D1 Store platform.

---

## 1. Universal Form Control Sizing Matrix

```
  ┌────────────────────────────────────────────────────────┐
  │ Label: text-[14px] font-semibold text-gray-850 mb-1.5  │
  ├────────────────────────────────────────────────────────┤
  │ Input / Select Field: h-12 (48px) px-4 rounded-xl      │
  │ Text: 16px Mobile / 15px Desktop                       │
  ├────────────────────────────────────────────────────────┤
  │ Error / Helper: text-[13px] text-red-600 mt-1.5        │
  └────────────────────────────────────────────────────────┘
```

| Control Type | Standard Height | Min Touch Target | Padding | Font Size | Border Radius |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Text Input (`text`, `email`, `tel`, `password`)** | **48px** (`h-12`) | 48px | `px-4 py-3` | 16px (Mobile) / 15px (Desktop) | `rounded-xl` (12px) |
| **Select Dropdown Trigger** | **48px** (`h-12`) | 48px | `px-4 py-3` | 16px (Mobile) / 15px (Desktop) | `rounded-xl` (12px) |
| **Multi-line Textarea** | **120px – 160px** | Auto | `px-4 py-3` | 16px (Mobile) / 15px (Desktop) | `rounded-xl` (12px) |
| **Checkbox Control** | **20px × 20px** | 44px (with label) | `p-0` | N/A | `rounded-md` (6px) |
| **Radio Button Control** | **20px × 20px** | 44px (with label) | `p-0` | N/A | `rounded-full` |
| **Quantity Stepper Control** | **48px** (`h-12`) | 48px | `px-2` | 15px (bold numeric) | `rounded-full` |

---

## 2. Accessible Labeling & Required Field Standards

> **MANDATORY RULE**: Every input, select, and textarea **MUST** have an explicitly associated `<label>` element. Never use the `placeholder` attribute as a substitute for a visible label.

### Accessible Pattern:
```tsx
<div className="space-y-1.5">
  <label
    htmlFor="customer-email"
    className="block text-[14px] font-semibold text-gray-800"
  >
    Email address <span className="text-red-500" aria-hidden="true">*</span>
  </label>
  <input
    id="customer-email"
    name="email"
    type="email"
    required
    aria-required="true"
    aria-invalid={hasError ? "true" : "false"}
    aria-describedby={hasError ? "email-error" : undefined}
    placeholder="you@example.com.au"
    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base sm:text-[15px] placeholder-gray-400 focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
  />
  {hasError && (
    <p id="email-error" className="text-[13px] font-medium text-red-600 flex items-center gap-1.5 mt-1">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>Please enter a valid email address.</span>
    </p>
  )}
</div>
```

---

## 3. Field States & Feedback

1. **Resting State**:
   - Background: Pure white `#ffffff`.
   - Border: Subtle neutral `border-gray-200` (`#e5e5ea`).
   - Shadow: `shadow-xs`.
2. **Focus State (`:focus-visible`)**:
   - Border transitions to `#0071e3`.
   - Outer glow ring: `ring-2 ring-[#0071e3]/20`.
   - Native browser outline eliminated.
3. **Invalid / Error State**:
   - Border changes to red: `border-red-500`.
   - Focus ring: `ring-2 ring-red-500/20`.
   - Inline error message rendered immediately below with `AlertCircle` icon.
4. **Disabled State**:
   - Background: Soft gray `bg-gray-100`.
   - Text & icon: `text-gray-400`.
   - Cursor: `cursor-not-allowed`.
   - Opacity: `opacity-60`.

---

## 4. Checkbox & Radio Button Specifications

1. **Hit Target Area**:
   - Wrap both the control box and text label in a clickable container with padding (`p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center gap-3`).
2. **Visual Contrast**:
   - Checkbox size: `w-5 h-5` (20px). Checked background: `#0071e3` with white checkmark.
   - Radio size: `w-5 h-5` (20px). Selected indicator: Solid `#0071e3` center ring.

---

## 5. Mobile Specifics (iOS Auto-Zoom Prevention)

To prevent iOS Safari from automatically zooming the page upon tapping an input:
- **Always specify `text-base` (16px) font size on mobile**:
  `className="... text-base sm:text-[15px] ..."`
- Maintain at least **16px vertical gap** between stacked form fields (`space-y-4` or `space-y-5`) to eliminate accidental fat-finger taps.
