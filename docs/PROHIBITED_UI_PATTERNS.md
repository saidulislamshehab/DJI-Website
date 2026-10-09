# Prohibited UI Patterns & Anti-Pattern Catalog

This document establishes the **explicit catalog of banned UI/UX mistakes and anti-patterns**. Introducing any pattern listed below into the codebase constitutes an immediate design failure.

---

## 1. Top Prohibited Anti-Patterns

### Anti-Pattern 1: Tiny Primary Text
- **What it is**: Styling descriptions, feature lists, specifications, or button labels with `text-[10px]`, `text-[11px]`, or `text-xs` (12px).
- **Why it is problematic**: Causes extreme eye fatigue, fails accessibility standards, makes an e-commerce store look unpolished, and forces users to zoom in.
- **Better Implementation**: Always use `text-[15px]` or `text-base` (16px) for body copy; `text-sm` (14px) only for compact secondary hints.
- **How to Detect in Review**: Grep for `text-xs` or `text-[10` or `text-[11` in primary content blocks.

### Anti-Pattern 2: Undersized Buttons & Interactive Targets
- **What it is**: Setting button or input heights to 32px (`h-8`), 36px (`h-9`), or 38px.
- **Why it is problematic**: Violates Apple and Android Human Interface Guidelines (minimum 44×44px touch targets). Leads to mis-taps on touchscreens.
- **Better Implementation**: Primary buttons: `h-12` (48px); secondary buttons: `h-11` (44px); text inputs: `h-12` (48px).
- **How to Detect in Review**: Check computed element heights on buttons and form fields.

### Anti-Pattern 3: The "Empty Ocean" Desktop Layout
- **What it is**: Confining multi-step checkout, cart, or account management to a narrow centered corridor (`max-w-md` / 448px) on a 1920px screen.
- **Why it is problematic**: Leaves 70% of widescreen displays completely blank while squeezing user forms into tight vertical strips.
- **Better Implementation**: Use balanced multi-column composition: 12-column grid inside `max-w-[1280px]` or `max-w-[1400px]` (e.g. 7 columns forms + 5 columns order summary).
- **How to Detect in Review**: View checkout or forms on a 1920px or 1440px desktop viewport.

### Anti-Pattern 4: Mobile "Shrink-to-Fit" (Scaling Instead of Reflowing)
- **What it is**: Keeping desktop 3- or 4-column grids on mobile by scaling down elements, using `transform: scale(0.7)`, or dropping text sizes to 9px.
- **Why it is problematic**: Renders cards and copy completely unreadable on mobile phones.
- **Better Implementation**: Reflow multi-column grids to 2 columns (or 1 column) on mobile, stacking cards vertically while preserving 15px–16px typography.
- **How to Detect in Review**: Inspect viewports at 390px and 360px. Confirm that card counts per row are 1 or 2, never 3 or 4.

### Anti-Pattern 5: Cramped Internal Card Padding
- **What it is**: Applying `p-2` or `p-2.5` (8px–10px) padding to cards containing paragraphs of text.
- **Why it is problematic**: Text suffocates against the card boundaries, degrading readability.
- **Better Implementation**: Desktop card padding: `p-6` (24px) or `p-7` (28px); mobile card padding: `p-4` (16px) or `p-5` (20px).
- **How to Detect in Review**: Search for `p-2` or `p-3` on main content cards.

### Anti-Pattern 6: Microscopic Icons & Missing Click Targets
- **What it is**: Using 10px–12px icons (`w-3 h-3`) without bounding click padding on buttons.
- **Why it is problematic**: Icons become unidentifiable smudges, and close buttons become impossible to tap.
- **Better Implementation**: Icon glyphs: minimum `w-4 h-4` (16px) or `w-5 h-5` (20px); bounding button target: minimum `44×44px`.
- **How to Detect in Review**: Search for `w-3` or `w-2` on Lucide icon declarations.

### Anti-Pattern 7: Mismatched Button Heights in the Same Row
- **What it is**: Placing an `h-10` button directly beside an `h-12` button in an action bar.
- **Why it is problematic**: Creates visual jaggedness and an amateur appearance.
- **Better Implementation**: All action buttons in a shared row must share the exact same height (`h-12`).
- **How to Detect in Review**: Visually inspect purchase panels and modal action rows.

### Anti-Pattern 8: Arbitrary One-Off Margin Hacks
- **What it is**: Hardcoding chaotic margin values like `mb-[17px]`, `mt-[39px]`, or `p-[7px]`.
- **Why it is problematic**: Destroys the visual rhythm of the 8px spatial grid.
- **Better Implementation**: Use standard Tailwind spacing scale (`mb-4`, `mb-6`, `mb-8`, `py-12`, `py-16`).
- **How to Detect in Review**: Grep for irregular bracketed pixel values in spacing classes.

### Anti-Pattern 9: Fixed-Width Elements Breaking Viewports
- **What it is**: Using rigid fixed pixel widths like `w-[650px]` on mobile containers.
- **Why it is problematic**: Causes horizontal scrolling and page distortion on mobile screens.
- **Better Implementation**: Use responsive widths: `w-full max-w-[650px]`.
- **How to Detect in Review**: Test for horizontal scrollbars on mobile viewports.

### Anti-Pattern 10: Low-Contrast Unreadable Text
- **What it is**: Using light gray text like `#d1d5db` (gray-300) on white backgrounds for secondary labels.
- **Why it is problematic**: Fails WCAG AA 4.5:1 contrast requirements, rendering text invisible in outdoor sunlight.
- **Better Implementation**: Muted text must be at least `#6e6e73` or `#4b5563` (minimum 5.4:1 contrast).
- **How to Detect in Review**: Run automated contrast checks or inspect color tokens against `#ffffff`.

### Anti-Pattern 11: Dead Action Triggers & Fake Links
- **What it is**: Coding buttons with empty `onClick={() => {}}` handlers or links pointing to `href="#"`.
- **Why it is problematic**: Frustrates users and causes silent behavioral failures.
- **Better Implementation**: Connect every control to its real action (e.g. cart drawer, modal trigger, real route).
- **How to Detect in Review**: Test clicking every button in the interface.

### Anti-Pattern 12: Hardcoded Mock Business Data
- **What it is**: Hardcoding fake prices (`$99.99`), fabricated fake customer reviews, or synthetic stock counts.
- **Why it is problematic**: Diverges from the real database and produces data inconsistency.
- **Better Implementation**: Connect directly to backend endpoints (`fetchProductBySlug`, `fetchProductReviewsApi`) or use clean, authentic empty fallbacks.
- **How to Detect in Review**: Search for hardcoded string literals where dynamic props should exist.

### Anti-Pattern 13: "Blind" Completion Claims
- **What it is**: An AI coding agent claiming "I have completed and verified the page" without actually running the dev server or inspecting the rendered browser output.
- **Why it is problematic**: Regressions slip past compilation checks undetected.
- **Better Implementation**: Run the application, fetch the rendered page, inspect computed dimensions and styles, and verify across viewports.
- **How to Detect in Review**: Demand proof of rendered verification and viewport checks.
