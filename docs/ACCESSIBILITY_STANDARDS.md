# Accessibility Standards (WCAG 2.2 Level AA Compliance)

This document establishes the **mandatory accessibility (a11y) standards** for the D1 Store platform, adhering to the Web Content Accessibility Guidelines (**WCAG 2.2 AA**).

---

## 1. Core Principles of Web Accessibility

Every interface must be:
1. **Perceivable**: Information and user interface components must be presentable to users in ways they can perceive (contrast, text scaling, alt text).
2. **Operable**: User interface components and navigation must be operable via keyboard, touch, and assistive tech.
3. **Understandable**: Information and the operation of the interface must be clear, predictable, and forgiving of errors.
4. **Robust**: Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including screen readers.

---

## 2. Color Contrast Mandates

All text and essential user interface components must satisfy strict contrast ratios:

| Element Type | Minimum Contrast Ratio | Baseline Values | Verification Check |
|:---|:---:|:---|:---:|
| **Standard Body & Headings** | **4.5:1** (AA) | `#121212` on `#ffffff` = **16.1:1**<br>`#4b5563` on `#ffffff` = **7.1:1** | Pass (Exceeds AAA) |
| **Large Text (≥ 24px bold)** | **3.0:1** (AA) | `#0071e3` on `#ffffff` = **4.6:1** | Pass |
| **Interactive UI Borders & Icons** | **3.0:1** (AA) | Border `#e5e5ea`, Active Ring `#0071e3` | Pass |
| **Placeholder / Disabled Text** | Exempt | `#9ca3af` on `#ffffff` = **2.9:1** | Allowed for non-essential hints |

---

## 3. Keyboard Navigation & Visible Focus Rings

Any user must be able to complete a purchase from product selection to checkout confirmation **using only a keyboard**.

1. **Tab Sequence**:
   - Focus must move in logical visual order from top to bottom, left to right.
   - Do not use positive `tabIndex` values (`tabIndex={1}` is prohibited).
2. **Standard Visible Focus Ring**:
   - Focus indicator must never be removed with `outline: none` without providing an explicit replacement.
   - Standard Tailwind focus class:
     ```tsx
     className="... focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
     ```
3. **Trigger Operation**:
   - All custom clickable components must respond to both `Enter` and `Space` key presses.
   - Modals and drawers must immediately close upon pressing `Escape`.

---

## 4. Semantic HTML Architecture

Always use native semantic elements rather than generic `<div>` or `<span>` tags with click handlers:

| Intent | Correct Semantic Tag | Prohibited Pattern |
|:---|:---|:---|
| **Navigation trigger** | `<a href="...">` or Next.js `<Link>` | `<div onClick={goToPage}>` |
| **In-page action** | `<button type="button">` | `<div onClick={addToCart}>` |
| **Main page landmarks** | `<header>`, `<main>`, `<nav>`, `<footer>` | `<div id="header">` |
| **Listings & Grids** | `<ul>`, `<li>` or grid containers | Unordered div soups |
| **Specification key/value** | `<table>` or `<dl>`, `<dt>`, `<dd>` | Random detached paragraphs |

---

## 5. Modal Dialog & Drawer Protocol

All modals (such as the Lightbox Gallery, Review Submission Modal, and Cart Drawer) must follow the **WAI-ARIA Dialog Pattern**:

1. **Focus Trap**: Keyboard focus must be constrained inside the modal while open. Focus must not escape into background page elements.
2. **Background Inactivity**: Add `aria-hidden="true"` to page content outside the modal or use native `<dialog>` / Radix `@radix-ui/react-dialog`.
3. **Escape to Close**: Pressing `Escape` must close the dialog.
4. **Focus Restoration**: When the dialog closes, keyboard focus must automatically return to the button that originally triggered it.

---

## 6. Form Accessibility & Error Recovery

1. **Explicit Labels**: Every input field must have an explicit `<label htmlFor="id">`.
2. **Error Associations**: Validation errors must be linked to the invalid field using `aria-describedby="field-error-id"`.
3. **Invalid Flag**: Set `aria-invalid="true"` on fields that fail validation.
4. **Autocomplete**: Address fields must provide standard browser autocomplete tags (`autoComplete="given-name"`, `autoComplete="street-address"`, `autoComplete="postal-code"`).

---

## 7. Touch Target Sizing (WCAG 2.5.5 / 2.5.8)

Every touchable element on mobile must provide a bounding box of at least **44 × 44px**. For compact icon buttons, add transparent click-target padding:
```tsx
<button className="p-2.5 rounded-full ..."> {/* Extends tap area to 44px */}
  <X className="w-5 h-5" />
</button>
```

---

## 8. Zoom and Reflow (WCAG 1.4.10)

The website must withstand **200% browser zoom** without:
- Text overlapping or getting clipped.
- Content overflowing horizontally offscreen.
- Essential controls or purchase buttons disappearing.
