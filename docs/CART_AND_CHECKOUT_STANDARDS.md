# Cart & Checkout Experience Standards

This document establishes the UI/UX and interaction specifications for the **Shopping Cart (`/cart`)** and **Checkout Flow (`/checkout`)**.

---

## 1. Master Checkout Layout Architecture

Checkout is a high-stakes transactional flow requiring clarity, trust, and zero cognitive friction.

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │ 1. Minimal Header (Logo + 100% SSL Encrypted Trust Badge)              │
  ├────────────────────────────────────────────────────────────────────────┤
  │ [Mobile Only] Collapsible Order Summary Bar ($1,249.00 - View Details) │
  ├────────────────────────────────────────────────────────────────────────┤
  │ max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12              │
  │                                                                        │
  │ ┌──────────────────────────────────────┬─────────────────────────────┐ │
  │ │ 7 Columns (lg:col-span-7)            │ 5 Columns (lg:col-span-5)   │ │
  │ │                                      │ [Sticky Order Summary]      │ │
  │ │ 1. Express Checkout (Apple/GPay)     │ - Line items with thumbnails│ │
  │ │ 2. Contact Information               │ - Promo code input field    │ │
  │ │ 3. Delivery (Ship vs In-Store Pickup)│ - Subtotal                  │ │
  │ │ 4. Shipping Address Fields           │ - Shipping fee (Free >$199) │ │
  │ │ 5. Shipping Method Selection         │ - 10% Australian GST        │ │
  │ │ 6. Payment Options (Card, PayPal, Zip│ - Final Total AUD           │ │
  │ │ 7. Complete Order Button (h-12)      │ - Australian Trust Badges   │ │
  │ └──────────────────────────────────────┴─────────────────────────────┘ │
  ├────────────────────────────────────────────────────────────────────────┤
  │ Minimal Checkout Footer (Australian Consumer Law Warranty, Privacy)    │
  └────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Desktop Space Utilization & Container Standards

- **Container Constraint**: `max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8`.
- **Prohibited Defect**: Never center checkout in a narrow single column (`max-w-md` or `max-w-lg`) on a 1920px screen. This compresses inputs, obscures the order summary, and damages conversion rates.
- **Column Allocation**:
  - **Left Form Section**: `lg:col-span-7` (~700px width). Gives form fields breathing room for side-by-side inputs (e.g. City, State, Postcode).
  - **Right Summary Section**: `lg:col-span-5` (~500px width). Sticky sidebar (`sticky top-24`) that keeps total price and item count in constant view.

---

## 3. Checkout Form Modules

### 1. Contact Information (`ContactSection.tsx`)
- Email address input with real-time format validation.
- "Have an account? Log in" quick link for registered D1 Store customers.
- "Keep me updated on news and exclusive offers" checkbox.

### 2. Delivery Options (`ShippingAddressSection.tsx`)
- Tab switcher: **"Ship to Address"** vs **"Pick up in store (Click & Collect)"**.
- If Pick up selected: Dropdown of physical D1 Stores:
  - D1 Store Sydney Flagship (World Square)
  - D1 Store Melbourne Central
  - D1 Store Chadstone
  - D1 Store Brisbane City
  - D1 Store Perth Karrinyup
- If Ship selected: Standard Australian address fields:
  - Country: Locked to "Australia" (or regional selector).
  - First Name + Last Name (side-by-side grid).
  - Street Address + Apartment/Unit/Suite (optional).
  - City / Suburb.
  - State / Territory: Dropdown (`NSW`, `VIC`, `QLD`, `WA`, `SA`, `TAS`, `ACT`, `NT`).
  - Postcode: 4-digit numeric validation.
  - Mobile Phone: For AusPost delivery notifications.

### 3. Shipping Methods (`ShippingMethodSection.tsx`)
- Radio option cards:
  - **Standard AusPost Delivery**: Free for orders over $199 AUD (otherwise $15 AUD).
  - **Express Courier Delivery**: $25 AUD (Next business day metro).
  - **Same-Day Sydney / Melbourne Courier**: $45 AUD.

### 4. Payment Gateways (`PaymentMethodSection.tsx`)
- Radio tabs for:
  - **Credit / Debit Card**: Form fields for Card Number, Name, Expiry Date, CVV with real-time format masking.
  - **PayPal**: PayPal Express checkout integration.
  - **Zip Pay / Afterpay**: Buy Now Pay Later interest-free financing badges.
  - **Direct Bank Deposit**: For B2B / Enterprise orders.

---

## 4. Sticky Order Summary Sidebar (`OrderSummarySidebar.tsx`)

1. **Line Item Rows**:
   - Product thumbnail (`size-16 rounded-xl border border-gray-100 bg-gray-50`).
   - Title & selected combo variant name.
   - Quantity pill badge (`w-5 h-5 rounded-full bg-gray-500 text-white text-xs`).
   - Line price in AUD.
2. **Promo Code Field**:
   - Side-by-side input and "Apply" button (`h-11 px-4`).
3. **Financial Breakdown**:
   - Subtotal (inc. GST).
   - Discount deduction (highlighted in `#16a34a`).
   - Shipping fee.
   - Estimated GST (10% included in total).
   - Final Total in large high-contrast typography (`text-2xl font-black text-[#121212]`).

---

## 5. Mobile Checkout Adaptation

On screens `< 1024px`:
- The right-hand order summary transforms into a **collapsible top bar** (`MobileOrderSummaryToggle.tsx`):
  - Displays: Total price + *"Show order summary & coupon"* trigger.
  - Clicking expands an animated accordion revealing line items without disorienting form progress.
- Forms stack in a clean, single-column sequence with standard 48px touch inputs.

---

## 6. Post-Checkout Confirmation & Invoice

After payment validation:
1. Redirects immediately to `/orders/[id]/confirmation`.
2. Displays Australian Tax Invoice with unique Order Number (`D1-AU-XXXXX`), dispatched email notification, tracking milestone stepper, and printable PDF tax receipt button (`/orders/[id]/invoice`).
