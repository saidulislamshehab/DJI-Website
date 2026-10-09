# Performance & SEO Standards (Core Web Vitals)

This document establishes the **performance budgets, image optimization standards, search engine optimization (SEO), and structured data requirements** for the D1 Store platform.

---

## 1. Core Web Vitals Performance Targets

Every route must meet Google's Core Web Vitals thresholds:

| Metric | Target Threshold | Primary Risk Area | Mitigation Technique |
|:---|:---:|:---|:---|
| **LCP** (Largest Contentful Paint) | **< 2.5 seconds** | Main hero image, video banner | Use Next.js `<Image priority>` for the primary product image; avoid client-only rendering of hero blocks. |
| **CLS** (Cumulative Layout Shift) | **< 0.1** | Image loading, font swapping, dynamic banners | Set explicit `aspect-ratio` on all image wrappers; use font `display: swap`; render skeleton placeholders matching final component sizes. |
| **INP** (Interaction to Next Paint) | **< 200 ms** | Heavy filter computations, re-renders | Memoize filtered product arrays (`useMemo`); defer non-urgent state updates with React transitions. |

---

## 2. Image Optimization & Lazy Loading

1. **Aspect Ratio Enclosures**:
   - Every product image container must define an explicit CSS aspect ratio (`aspect-square` or `aspect-[4/3]`) to reserve layout geometry before image bytes load.
2. **Above-the-Fold Prioritization**:
   - The first product gallery image on PDP and the homepage hero slider banner must specify high fetch priority:
   ```tsx
   <Image
     src={product.mainImage}
     alt={product.name}
     width={800}
     height={800}
     priority={true}
     className="object-contain"
   />
   ```
3. **Below-the-Fold Lazy Loading**:
   - Secondary gallery thumbnails, "What's in the Box" cutouts, related accessories, and footer store photos must use `loading="lazy"`.
4. **Responsive Sizes Attribute**:
   - When using `fill`, always declare explicit responsive bounds:
   ```tsx
   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
   ```

---

## 3. Dynamic Metadata & SEO Tags (`generateMetadata`)

Every dynamic page must generate custom OpenGraph and Twitter cards in its server component:

```tsx
// frontend/src/app/products/[slug]/page.tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = (await fetchProductBySlug(slug)) || findStaticProduct(slug);

  if (!product) {
    return { title: "Product Not Found | D1 Store Australia" };
  }

  const title = `${product.name} | DJI Authorised Retailer Australia - D1 Store`;
  const description =
    product.description ||
    `Shop the official ${product.name} with 100% Australian Warranty and local support at D1 Store.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: product.mainImage, width: 1200, height: 1200, alt: product.name }],
      siteName: "D1 Store Australia",
      locale: "en_AU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.mainImage],
    },
  };
}
```

---

## 4. Schema.org JSON-LD Structured Data

To qualify for Google Search rich snippets (pricing, star ratings, stock availability), Product Detail Pages must inject JSON-LD structured data:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "DJI Osmo Pocket 4",
  "image": ["https://cdn.shopify.com/.../PRODUCT-THUMB-OSMOPK4-01.jpg"],
  "description": "Osmo Pocket 4 pairs a 1-inch CMOS sensor with 4K/240fps slow-motion...",
  "sku": "DJI-OSMOPK4-STD",
  "brand": {
    "@type": "Brand",
    "name": "DJI"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://www.d1store.com.au/products/osmo-pocket-4",
    "priceCurrency": "AUD",
    "price": 769.00,
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.9,
    "reviewCount": 142
  }
}
```

---

## 5. JavaScript Bundle Hygiene

1. **Avoid Duplicate Libraries**: Do not import multiple icon sets, animation frameworks, or carousel packages.
2. **Dynamic Imports**: For heavy administrative dialogs or specialized export charts that are rarely accessed by consumers, use Next.js dynamic imports (`import dynamic from "next/dynamic"`).
