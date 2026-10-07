import { IProduct } from "@/types";
import rawCarouselData from "@/data/product_carousels_data.json";
import { d1MegaMenus } from "@/data/d1_mega_menu";

type CarouselItem = {
  id: number;
  title: string;
  price: string;
  href: string;
  primaryImg?: string;
  hoverImg?: string;
};

type CarouselCategory = {
  sectionTitle: string;
  products: CarouselItem[];
};

const CATEGORY_SLUGS: Record<string, string> = {
  drones: "drones",
  handhelds: "handhelds",
  enterprise: "enterprise-agriculture",
  hasselblad: "hasselblad",
};

function parsePrice(price: string): number {
  const n = parseFloat(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function slugFromHref(href: string, fallback: string): string {
  const product = href.match(/\/products\/([^/?#]+)/);
  if (product) return product[1];
  const collection = href.match(/\/collections\/([^/?#]+)/);
  if (collection) return collection[1];
  return fallback;
}

function toProduct(
  item: CarouselItem,
  category: string,
  categorySlug: string
): IProduct {
  const slug = slugFromHref(hrefSafe(item.href), `prod-${item.id}`);
  const images = [item.primaryImg, item.hoverImg].filter(Boolean) as string[];
  return {
    _id: `static-${categorySlug}-${item.id}`,
    name: item.title,
    slug,
    sku: `D1-${slug.toUpperCase()}`,
    category,
    categorySlug,
    price: parsePrice(item.price),
    description: `${item.title} — genuine Australian stock with local warranty and support from D1 Store.`,
    features: [
      "Genuine Australian stock",
      "Local warranty support",
      "Click & Collect from D1 stores",
      "DJI-certified service available",
    ],
    specs: {},
    images,
    mainImage: images[0] || "",
    inStock: true,
    stockCount: 12,
    rating: 4.9,
    reviewCount: 18,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    tagline: category,
  };
}

function hrefSafe(href: string) {
  return href || "";
}

function carouselProducts(): IProduct[] {
  const data = rawCarouselData as unknown as Record<string, CarouselCategory>;
  const out: IProduct[] = [];
  for (const [key, cat] of Object.entries(data)) {
    const slug = CATEGORY_SLUGS[key] || key;
    for (const item of cat.products || []) {
      out.push(toProduct(item, cat.sectionTitle, slug));
    }
  }
  return out;
}

function megaMenuProducts(): IProduct[] {
  const out: IProduct[] = [];
  for (const menu of d1MegaMenus) {
    for (const col of menu.columns) {
      for (const item of col.items) {
        if (!item.href?.includes("/products/")) continue;
        const slug = slugFromHref(item.href, item.title);
        out.push({
          _id: `mega-${slug}`,
          name: item.title,
          slug,
          sku: `D1-${slug.toUpperCase()}`,
          category: menu.label,
          categorySlug: menu.id,
          price: 0,
          badge: item.badge || undefined,
          description: `${item.title} available from D1 Store, Australia's authorised DJI retailer.`,
          features: [],
          specs: {},
          images: col.img ? [col.img] : [],
          mainImage: col.img || "",
          inStock: true,
          stockCount: 8,
          rating: 5,
          reviewCount: 10,
          isFeatured: false,
          isNewArrival: item.badge?.toLowerCase() === "new",
          isBestSeller: false,
          tagline: col.seriesTitle,
        });
      }
    }
  }
  return out;
}

let cached: IProduct[] | null = null;

export function getStaticCatalog(): IProduct[] {
  if (cached) return cached;
  const bySlug = new Map<string, IProduct>();
  for (const p of [...carouselProducts(), ...megaMenuProducts()]) {
    if (!bySlug.has(p.slug)) bySlug.set(p.slug, p);
  }
  cached = Array.from(bySlug.values());
  return cached;
}

export function findStaticProduct(slug: string): IProduct | null {
  return getStaticCatalog().find((p) => p.slug === slug) || null;
}

function tokens(slug: string): string[] {
  return slug
    .toLowerCase()
    .split(/[-_\s]+/)
    .filter((t) => t && !["dji", "the", "and", "all", "shop"].includes(t));
}

export function getStaticProductsForCollection(slug: string): IProduct[] {
  const catalog = getStaticCatalog();
  const s = (slug || "all").toLowerCase();

  if (s === "all" || s === "just-landed" || s === "new") return catalog;
  if (s === "dji-sale" || s === "sale") {
    return catalog.filter((p) => Boolean(p.badge) || Boolean(p.originalPrice));
  }

  const alias: Record<string, string[]> = {
    drones: ["drones", "dji-drones"],
    "dji-drones": ["drones", "dji-drones"],
    handhelds: ["handhelds", "handheld-cameras"],
    "handheld-cameras": ["handhelds", "handheld-cameras"],
    "enterprise-agriculture": ["enterprise-agriculture", "enterprise"],
    enterprise: ["enterprise-agriculture", "enterprise"],
    hasselblad: ["hasselblad"],
    accessories: ["accessories"],
    "lifestyle-tech": ["lifestyle-tech", "handhelds"],
  };

  const cats = alias[s];
  if (cats) {
    const hit = catalog.filter((p) => cats.includes(p.categorySlug) || cats.includes(p.category.toLowerCase()));
    if (hit.length) return hit;
  }

  const t = tokens(s);
  const named = catalog.filter((p) => {
    const hay = `${p.name} ${p.slug} ${p.category} ${p.tagline || ""}`.toLowerCase();
    return t.every((tok) => hay.includes(tok));
  });
  if (named.length) return named;

  return catalog.filter((p) => {
    const hay = `${p.name} ${p.slug}`.toLowerCase();
    return t.some((tok) => tok.length > 2 && hay.includes(tok));
  });
}

export function searchStaticCatalog(query: string): IProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return getStaticCatalog().slice(0, 24);
  return getStaticCatalog().filter((p) =>
    `${p.name} ${p.category} ${p.slug} ${p.tagline || ""}`.toLowerCase().includes(q)
  );
}

export function collectionTitle(slug: string, fallback?: string): string {
  if (fallback) return fallback;
  if (!slug || slug === "all") return "All Products";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
