# Project Overview & Ground Truth Architecture

This document outlines the confirmed, empirical technical architecture of the **DJI Drone E-Commerce Website (D1 Store)**. Every detail in this document has been verified against the actual repository source code, dependencies, and configuration.

---

## 1. Confirmed Technology Stack

### Frontend Application (`frontend/`)
- **Framework**: **Next.js 16.3.6** (App Router, Turbopack enabled, Server-Side Rendering & Client Hydration).
- **Runtime & UI Library**: **React 19.2.8** & **React DOM 19.2.8**.
- **Language**: **TypeScript 5.x** (`typescript@^5` in `frontend/package.json`, strict type checking configured via `tsconfig.json`).
- **Styling Engine**: **Tailwind CSS 4.3.3** (`@tailwindcss/postcss@^4.3.3`, `tailwindcss@^4.3.3`, PostCSS 8.5.28).
- **CSS Pre-processor & Theme Structure**:
  - `frontend/src/app/globals.css` with `@import "tailwindcss";`, `@import "../styles/d1-all.css";`, and CSS custom property root tokens.
  - `frontend/src/styles/d1-design-tokens.css` (custom design tokens for spacing, typography, radii, shadows).
  - `frontend/src/styles/d1-all.css` & `d1-sections.css` (Shopify Dawn/D1 Store converted styles).
  - `frontend/tailwind.config.ts` (configured with `darkMode: "class"`, token extensions, and `tailwindcss-animate`).
- **Component Primitives**:
  - Full suite of **Radix UI** primitives (`@radix-ui/react-accordion`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tabs`, `@radix-ui/react-popover`, `@radix-ui/react-select`, `@radix-ui/react-radio-group`, `@radix-ui/react-checkbox`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-tooltip`).
  - **shadcn/ui** architecture (configured in `frontend/components.json` with `@/components/ui`, Tailwind CSS variables).
  - Animated notifications via **Sonner** (`sonner@^2.0.8`).
  - Drawer gestures via **Vaul** (`vaul@^1.1.2`).
  - Motion transitions via **Motion / Framer Motion** (`framer-motion@^14.0.0`, `motion@^14.0.0`).
- **Iconography**: **Lucide React** (`lucide-react@^1.50.0`).
- **Form Management & Validation**: **React Hook Form** (`react-hook-form@^7.89.0`), **Zod** (`zod@^4.6.5`), and `@hookform/resolvers@^5.9.1`.
- **Carousel Engine**: **Embla Carousel** (`embla-carousel-react@^8.6.0`).
- **HTTP Client**: **Axios** (`axios@^1.20.0`) configured with interceptors in `frontend/src/lib/api.ts`.

### Backend Application (`backend/`)
- **Server Framework**: **Express 5.2.1** (`express@^5.2.1`).
- **Runtime**: **Node.js** executed with **tsx** (`tsx watch src/server.ts`) in development and **tsc** compilation for production.
- **Language**: **TypeScript 5.8.2** (`typescript@^5.8.2`).
- **Database Layer**: **MongoDB Atlas** managed via **Mongoose 9.3.3** (`mongoose@^9.3.3`).
- **Security & Utilities**:
  - **Helmet** (`helmet@^8.1.0`) for HTTP headers security.
  - **CORS** (`cors@^2.8.6`) with origin verification.
  - **JSON Web Token** (`jsonwebtoken@^9.0.3`) for customer and administrator session management.
  - **Morgan** (`morgan@^1.10.1`) for HTTP request logging.
  - **Nodemailer** (`nodemailer@^10.0.16`) for order confirmation and dispatch emails.

---

## 2. Workspace & Root Orchestration

The root project is managed via npm workspaces orchestration in `package.json`:
- `npm run dev`: Executes `concurrently` running `npm --prefix frontend run dev` (Port 3000) and `npm --prefix backend run dev` (Port 5000).
- `npm run build`: Sequentially compiles backend (`npm run build:backend`) and frontend (`npm run build:frontend`).
- `npm run lint`: Runs ESLint on frontend and TypeScript validation across both packages.
- `npm run format`: Executes Prettier (`prettier@^3.5.3`) formatting across all `.ts, .tsx, .js, .json, .md, .css` files.

---

## 3. Confirmed Route Map & Page Inventory

The frontend uses Next.js App Router (`frontend/src/app/`):

| Route Path | Type | File Location | Responsibility |
|:---|:---:|:---|:---|
| `/` | Client / SSR | `src/app/page.tsx` | Main D1 Store homepage: Hero banner, bento category grid, flagship showcase, news slider. |
| `/products/[slug]` | Hybrid SSR/Client | `src/app/products/[slug]/page.tsx` | Dynamic Product Detail Page (PDP): Overview, What's in the Box, Specs, FAQs, Customer Reviews. |
| `/collections` | Client | `src/app/collections/page.tsx` | Top-level category index directory. |
| `/collections/[slug]` | Client | `src/app/collections/[slug]/page.tsx` | Product Listing Page (PLP): Tiered sorting (Products, Bundles, Accessories), sticky filter bar. |
| `/cart` | Client | `src/app/cart/page.tsx` | Full-page shopping cart with line items, quantity adjustments, upsells, shipping calculator. |
| `/checkout` | Client | `src/app/checkout/page.tsx` | D1 Store multi-step checkout: Contact, delivery/pickup, payment methods, order summary. |
| `/checkout/success` | Client | `src/app/checkout/success/page.tsx` | Instant checkout success and receipt dispatch confirmation. |
| `/account` | Client | `src/app/account/page.tsx` | Customer portal: Profile details, saved addresses, order history, loyalty tracking. |
| `/orders/[id]` | Client | `src/app/orders/[id]/page.tsx` | Order detail view with tracking milestones and line items. |
| `/orders/[id]/confirmation` | Client | `src/app/orders/[id]/confirmation/page.tsx` | Official order confirmation invoice screen. |
| `/orders/[id]/invoice` | Client | `src/app/orders/[id]/invoice/page.tsx` | Printable tax invoice compliant with Australian GST requirements. |
| `/search` | Client | `src/app/search/page.tsx` | Instant search results with live query filtering and result counts. |
| `/login` | Client | `src/app/login/page.tsx` | Customer authentication and registration gateway. |
| `/admin` | Client | `src/app/admin/page.tsx` | Administrator analytics overview dashboard. |
| `/admin/products` | Client | `src/app/admin/products/page.tsx` | Comprehensive product inventory manager (metadata, combos, specs, FAQs). |
| `/admin/categories` | Client | `src/app/admin/categories/page.tsx` | Category tree, collections, and parent-child taxonomy management. |
| `/admin/orders` | Client | `src/app/admin/orders/page.tsx` | Order dispatch tracking, status transitions, and customer lookups. |
| `/admin/homepage-sections` | Client | `src/app/admin/homepage-sections/page.tsx` | Dynamic homepage banner and curated grid management. |
| `/pages/[slug]` | Client | `src/app/pages/[slug]/page.tsx` | Static content pages: About Us, Contact, Stores, Repairs, Enterprise, Price Match. |
| `/policies/[slug]` | Client | `src/app/policies/[slug]/page.tsx` | Australian legal and consumer terms (Warranty, Shipping, Returns, Privacy). |
| `/blogs/news` | Client | `src/app/blogs/news/page.tsx` | D1 Store official blog and news feed. |
| `/blogs/news/[slug]` | Client | `src/app/blogs/news/[slug]/page.tsx` | Individual news article and gear review post. |

---

## 4. Reusable Component Inventory

Components are organized into strict functional modules under `frontend/src/components/`:

### UI Primitives (`components/ui/`)
Built with Radix UI, CVA, and Tailwind utilities:
- `button.tsx`: Primary, secondary, destructive, outline, ghost, link variants.
- `input.tsx`: Form inputs with focus rings and disabled states.
- `card.tsx`: Surface containers with header, title, description, content, and footer slots.
- `accordion.tsx`: Collapsible accordion groups (used in FAQs and order summaries).
- `tabs.tsx`: Accessible tab groups (used in product detail sections, admin views).
- `dialog.tsx` & `sheet.tsx`: Accessible modal dialogs and slide-out drawers.
- `badge.tsx`: Status tags and metadata pill badges.
- `table.tsx`: Semantic tabular structures for data display.
- `sonner.tsx`: Floating toast notification provider.

### Layout Architecture (`components/layout/`)
- `Header.tsx`: Global sticky desktop and mobile header with navigation triggers.
- `Navbar.tsx`: Category navigation menu and mega-menu hover panels.
- `AnnouncementBar.tsx`: Top rotating marquee bar featuring Australian trust propositions.
- `Footer.tsx`: Universal 4-column footer with Australian store directory and payment icons.

### Product Modules (`components/product/`)
- `ProductBreadcrumbs.tsx`: Category and collection breadcrumb trail.
- `ProductGallery.tsx`: Main media viewer with thumbnail carousel and fullscreen Lightbox modal.
- `ProductPurchasePanel.tsx`: Pricing, variant picker, Care Refresh selector, quantity, Add to Cart, Buy Now.
- `ProductSectionNavigation.tsx`: Sticky sub-navbar with scrollspy tracking and quick-buy action.
- `ProductOverview.tsx`: Feature ribbon, bento cards, alternating story blocks, hardware performance.
- `ProductWhatsInTheBox.tsx`: Combo tabs, 6-col cutout grid, gear comparison matrix.
- `ProductSpecifications.tsx`: Searchable category tables with PDF download requests.
- `ProductFAQ.tsx`: Category filtered accordions with expand/collapse toggles.
- `ProductReviews.tsx`: Customer review submission modal, star distribution, helpful voting.
- `RelatedProductsSection.tsx`: Compatible gear and accessories carousel.
- `MobilePurchaseBar.tsx`: Bottom sticky floating action bar for viewports `< 768px`.
- `ProductDetailClient.tsx`: Client hydration orchestrator managing variant selections and cart actions.

### Checkout Modules (`components/checkout/`)
- `CheckoutHeader.tsx`: Distraction-free secure checkout banner.
- `ContactSection.tsx`: Customer email input with guest or account sign-in link.
- `ShippingAddressSection.tsx`: Australian address fields with shipping vs store pickup selection.
- `ShippingMethodSection.tsx`: Standard AusPost, Express Courier, and Same-Day Metro choices.
- `PaymentMethodSection.tsx`: Credit Card, PayPal, Zip Pay, and Direct Deposit options.
- `OrderSummarySidebar.tsx`: Sticky desktop sidebar with promo coupons and item subtotals.
- `MobileOrderSummaryToggle.tsx`: Compact collapsible order summary for mobile viewports.

---

## 5. Development & Validation Commands

All engineers and automated agents must use these confirmed validation scripts:

```bash
# 1. Start development servers
npm run dev

# 2. Type-check frontend without emitting output
npx --prefix frontend tsc --project frontend/tsconfig.json --noEmit

# 3. Type-check backend without emitting output
npm --prefix backend run lint

# 4. Run Next.js production build check
npm --prefix frontend run build

# 5. Run backend production build
npm --prefix backend run build

# 6. Format all code files
npm run format
```

---

## 6. Implementation Constraints

1. **Monorepo Separation**: Frontend code lives strictly in `frontend/src/`. Backend API and Mongoose schemas live strictly in `backend/src/`. Shared types must remain synchronized between `frontend/src/types/index.ts` and `backend/src/types/index.ts`.
2. **Framework Alignment**: Do not install additional CSS frameworks, styled-components, or incompatible icon packages. The project is standardized on **Tailwind CSS 4** and **Lucide React**.
3. **No Redundant Routes**: Do not create duplicate routes (e.g. creating `/product/[id]` when `/products/[slug]` is the established standard).
