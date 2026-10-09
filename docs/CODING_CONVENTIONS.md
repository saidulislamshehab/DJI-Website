# Coding Conventions & TypeScript Guidelines

This document establishes the **engineering conventions, TypeScript practices, and styling standards** for the codebase.

---

## 1. Naming & File Conventions

| Entity | Convention | Example |
|:---|:---:|:---|
| **Component Files** | PascalCase | `ProductGallery.tsx`, `OrderSummarySidebar.tsx` |
| **Utility & Library Files** | camelCase | `api.ts`, `catalog.ts`, `utils.ts` |
| **App Router Route Directories** | kebab-case or dynamic | `collections/[slug]/page.tsx`, `orders/[id]/page.tsx` |
| **React Components** | PascalCase | `export default function ProductPurchasePanel()` |
| **Custom Hooks** | camelCase with `use` prefix | `useCart()`, `useMediaQuery()` |
| **Types & Interfaces** | PascalCase with `I` prefix for models | `IProduct`, `IReview`, `IOrder`, `ButtonProps` |
| **Constants / Enums** | UPPER_SNAKE_CASE | `API_BASE_URL`, `DEFAULT_PAGE_SIZE` |

---

## 2. TypeScript Best Practices

### 1. Strict Typing Without `any`
Avoid using `any`. If a data payload is polymorphic, use TypeScript unions or generics:
```tsx
// Bad
const handleSelect = (data: any) => { ... }

// Good
interface VariantSelectEvent {
  variantId: string;
  sku: string;
  price: number;
}
const handleSelect = (data: VariantSelectEvent) => { ... }
```

### 2. Component Props Interface Pattern
Always declare an explicit `interface` above the component declaration:
```tsx
interface ProductGalleryProps {
  productName: string;
  images: string[];
  mainImage: string;
  videoUrl?: string;
  selectedImage: string;
  onSelectImage: (imageUrl: string) => void;
}

export default function ProductGallery({
  productName,
  images,
  mainImage,
  videoUrl,
  selectedImage,
  onSelectImage,
}: ProductGalleryProps) {
  // Implementation
}
```

### 3. Centralized Model Definitions
Domain models that map to database records (`IProduct`, `ICategory`, `IOrder`, `IReview`, `IUser`) must be imported from `@/types`:
```tsx
import { IProduct, IReview, IReviewSummary } from "@/types";
```

---

## 3. Styling & Tailwind CSS Conventions

### 1. The `cn()` Class Merging Pattern
Always use the `@/lib/utils` `cn()` function when merging default classes with dynamic or consumer-provided `className` props:
```tsx
import { cn } from "@/lib/utils";

<button
  className={cn(
    "h-12 px-6 rounded-full font-bold transition-all",
    isActive ? "bg-[#0071e3] text-white" : "bg-gray-100 text-gray-800",
    className
  )}
>
  {children}
</button>
```

### 2. Logical Class Ordering
Structure Tailwind utility classes in a consistent, predictable order:
1. **Layout & Display**: `flex`, `grid`, `inline-flex`, `block`, `hidden`
2. **Positioning**: `relative`, `absolute`, `sticky top-0`, `z-30`
3. **Dimensions**: `w-full`, `max-w-lg`, `h-12`, `aspect-square`
4. **Spacing**: `p-4`, `px-6`, `py-3`, `gap-4`, `space-y-3`
5. **Typography**: `text-base`, `font-bold`, `leading-snug`, `tracking-tight`
6. **Colors & Backgrounds**: `bg-white`, `text-[#121212]`, `bg-blue-50`
7. **Borders & Radii**: `rounded-xl`, `border`, `border-gray-200`
8. **Shadows & Elevation**: `shadow-xs`, `shadow-sm`
9. **Interactive & Transitions**: `hover:bg-blue-600`, `cursor-pointer`, `transition-all duration-200`

### 3. No Arbitrary Inline Style Hacks
Avoid writing arbitrary inline styles (`style={{ fontSize: "11px", height: "31px" }}`) when standard Tailwind tokens or CSS custom properties exist.

---

## 4. State & Hook Sequence

Inside React components, organize logic in this standard order:
1. **Router & Context hooks**: `useRouter()`, `useParams()`, `useCart()`.
2. **Local State (`useState`)**: Grouped by domain.
3. **Derived State / Memoization (`useMemo`)**: Calculations (totals, active variant, filtered lists).
4. **Side Effects (`useEffect`)**: Scroll listeners, data loaders, event subscriptions.
5. **Event Handlers (`useCallback`)**: Click handlers, submit actions.
6. **Early Returns (Loading / Error)**: Guard clauses.
7. **JSX Return**: Render tree.
