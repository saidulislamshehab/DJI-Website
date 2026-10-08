"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  fetchProducts,
  fetchCategories,
  fetchCategoryBySlug,
  fetchCollectionByHandle,
} from "@/lib/api";
import { collectionTitle, getStaticProductsForCollection, findStaticCollection } from "@/lib/catalog";
import { IProduct, ICategory, ICollection } from "@/types";
import { useCart } from "@/context/CartContext";
import parentCategoriesDataRaw from "@/data/parent_categories_data.json";
import {
  SlidersHorizontal,
  ChevronRight,
  Star,
  ShoppingBag,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export type ProductTier = "product" | "bundle" | "accessory";

export function getProductTier(p: IProduct): ProductTier {
  if (p.tier) return p.tier;

  const tags = (p.tags || []).map((t) => String(t).trim().toLowerCase());
  const name = (p.name || "").toLowerCase();
  const slug = (p.slug || "").toLowerCase();
  const category = (p.category || "").toLowerCase();
  const subCategory = (p.subCategory || "").toLowerCase();

  // 1. Explicit Bundle Tag from D1 Store
  if (tags.includes("bundle-listing") || tags.includes("bundle")) {
    return "bundle";
  }

  // 2. High-priority Bundle names (Combos, Bundles, Packages)
  const isExcludedBundle = /\b(filter|propeller|cable|screw|cleaning|lanyard|strap|mount|nozzle|sprinkler|lens hood)\b/i.test(name);
  const isExplicitBundle =
    /\b(combo|bundle|fly more|creator combo|ultimate combo|adventure combo|pro combo|standard combo|plus combo|cinema combo|enterprise combo|rtk combo|travel combo|diving bundle|vlog bundle|biking bundle|vlog combo)\b/i.test(name) ||
    slug.includes("-combo") ||
    slug.includes("-bundle") ||
    slug.includes("fly-more");

  if (isExplicitBundle && !isExcludedBundle) {
    return "bundle";
  }

  // 3. Explicit Service / Warranty / Software / Accessory indicators that should NEVER be a Core product
  const strictAccessoryWords = [
    "care refresh", "care enterprise", "maintenance program", "dji terra", "warranty",
    "service plan", "parachute", "landing gear", "gimbal clamp", "propeller", "battery",
    "charging hub", "charger", "filter", "case", "mount", "lanyard", "strap", "cable",
    "hood", "stick", "adapter", "bracket", "arm", "bag", "protector", "antenna",
    "receiver", "guard", "landing pad", "cover", "tripod", "holder", "harness",
    "sun hood", "silicone case", "corrective lenses", "water sampling", "sampling system"
  ];
  if (strictAccessoryWords.some((w) => name.includes(w) || slug.includes(w))) {
    return "accessory";
  }

  // 4. Explicit Accessory Tag
  if (tags.includes("catalog:product_role:accessory") || tags.includes("accessory") || tags.includes("accessories")) {
    return "accessory";
  }

  // 5. Category is accessories
  if (category.includes("accessor") || subCategory.includes("accessor") || tags.includes("catalog:top_category:accessories")) {
    return "accessory";
  }

  // 6. Explicit Core Tag -> "product"
  if (tags.includes("catalog:product_role:core")) {
    return "product";
  }

  // 7. General accessory brand/type names
  const accessoryWords = [
    "d1 labs", "lifthor", "freewell", "sunnylife", "pgytech", "pgtech", "ugreen", "sandisk",
    "polariser", "remote controller", "control stick", "dji rc"
  ];
  if (accessoryWords.some((w) => name.includes(w) || slug.includes(w))) {
    return "accessory";
  }

  // Default to product
  return "product";
}

export default function CollectionPage() {
  const params = useParams();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";
  const normalizedSlug = (slug || "").toLowerCase();

  const parentCategoryInfo = useMemo(() => {
    const data = parentCategoriesDataRaw as Record<
      string,
      { title: string; breadcrumb: string; cards: { title: string; href: string; img: string }[] }
    >;
    if (data[normalizedSlug]) return data[normalizedSlug];
    if (normalizedSlug === "enterprise" || normalizedSlug === "enterprise-agriculture") {
      return data["enterprise"] || data["enterprise-agriculture"] || null;
    }
    return null;
  }, [normalizedSlug]);

  const childToParentMap = useMemo(() => {
    const data = parentCategoriesDataRaw as Record<
      string,
      { title: string; breadcrumb: string; cards: { title: string; href: string; img: string }[] }
    >;
    const map: Record<string, { parentSlug: string; parentTitle: string }> = {};
    for (const [pKey, pVal] of Object.entries(data)) {
      if (pVal && Array.isArray(pVal.cards)) {
        for (const card of pVal.cards) {
          const cSlug = card.href.replace("/collections/", "").trim().toLowerCase();
          if (cSlug && !map[cSlug]) {
            map[cSlug] = {
              parentSlug: pKey === "enterprise-agriculture" ? "enterprise" : pKey,
              parentTitle: pVal.title,
            };
          }
        }
      }
    }
    return map;
  }, []);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<ICategory | null>(null);
  const [currentCollection, setCurrentCollection] = useState<ICollection | null>(() => findStaticCollection(slug));
  const [isLoading, setIsLoading] = useState(true);

  const [activeMainTab, setActiveMainTab] = useState<string>("All");
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [addedId, setAddedId] = useState<string | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const initialCol = findStaticCollection(slug);
    if (initialCol) {
      setCurrentCollection(initialCol);
    }

    async function loadData() {
      setIsLoading(true);
      try {
        if (parentCategoryInfo) {
          const catKeyword = parentCategoryInfo.title;
          const [byCat, bySearch] = await Promise.all([
            fetchProducts({ category: catKeyword, limit: 100 }).catch(() => ({ products: [] as IProduct[] })),
            fetchProducts({ search: catKeyword, limit: 100 }).catch(() => ({ products: [] as IProduct[] })),
          ]);
          const combined = [...(byCat.products || []), ...(bySearch.products || [])];
          const uniqueProds = Array.from(new Map(combined.map((item) => [item.slug, item])).values());
          setProducts(uniqueProds);
          setIsLoading(false);
          return;
        }

        const [catsRes, catRes, colRes] = await Promise.all([
          fetchCategories().catch(() => []),
          fetchCategoryBySlug(slug).catch(() => null),
          fetchCollectionByHandle(slug).catch(() => null),
        ]);
        const staticCol = findStaticCollection(slug);
        const resolvedCol = colRes || staticCol || null;
        setCategories(catsRes);
        setCurrentCategory(catRes);
        if (resolvedCol) {
          setCurrentCollection(resolvedCol);
        }

        let prodParams: Record<string, unknown> = { limit: 100 };
        if (slug === "just-landed" || slug === "dji-sale") {
          prodParams.isNewArrival = true;
        } else if (slug && slug !== "all") {
          prodParams.collection = slug;
        }

        const prodsRes = await fetchProducts(prodParams).catch(() => ({ products: [] as IProduct[] }));
        let loaded: IProduct[] = (prodsRes.products as IProduct[]) || [];

        if (loaded.length === 0 && slug) {
          const byCat = await fetchProducts({ category: slug, limit: 100 }).catch(() => ({ products: [] as IProduct[] }));
          loaded = (byCat.products as IProduct[]) || [];
        }

        if (loaded.length === 0 && slug) {
          const keyword = slug.replace(/-/g, " ");
          const searchRes = await fetchProducts({ search: keyword, limit: 100 }).catch(() => ({ products: [] as IProduct[] }));
          loaded = (searchRes.products as IProduct[]) || [];
        }

        const staticProds = getStaticProductsForCollection(slug);
        const seen = new Set(loaded.map((p) => p.slug));
        for (const p of staticProds) {
          if (!seen.has(p.slug)) {
            loaded.push(p);
            seen.add(p.slug);
          }
        }

        setProducts(loaded);
      } catch (err) {
        console.error("Error loading collection data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug, parentCategoryInfo]);

  // Main Category Tabs: [All] [Products] [Bundles] [Accessories]
  const mainTabs = useMemo(() => {
    return ["All", "Products", "Bundles", "Accessories"];
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Jump Nav Tabs Filter: [All] [Products] [Bundles] [Accessories]
    if (activeMainTab === "Products") {
      result = result.filter((p) => getProductTier(p) === "product");
    } else if (activeMainTab === "Bundles") {
      result = result.filter((p) => getProductTier(p) === "bundle");
    } else if (activeMainTab === "Accessories") {
      result = result.filter((p) => getProductTier(p) === "accessory");
    }
    // "All" tab displays all collection products in the golden tier order:
    // First: Actual Product, Second: Bundles, Third: Accessories!

    // 2. In Stock Filter
    if (onlyInStock) {
      result = result.filter((p) => p.inStock);
    }

    // 3. Sorting: "first show the actual product then show bundle and accessories"
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name_asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Default Featured Sort: Strictly "first show the actual product, then show bundle, and accessories"
      result.sort((a, b) => {
        const tierA = getProductTier(a);
        const tierB = getProductTier(b);

        const weight: Record<ProductTier, number> = { product: 0, bundle: 1, accessory: 2 };
        if (weight[tierA] !== weight[tierB]) {
          return weight[tierA] - weight[tierB];
        }

        const nameA = (a.name || "").toLowerCase();
        const nameB = (b.name || "").toLowerCase();

        // Target keywords from collection title or slug
        const targetWords = (currentCollection?.title || collectionTitle(slug) || slug)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, " ")
          .trim()
          .split(" ")
          .filter((w) => w.length > 2 && w !== "dji");

        // Tier 0: Core actual product(s)
        if (tierA === "product") {
          const matchA = targetWords.filter((w) => nameA.includes(w)).length;
          const matchB = targetWords.filter((w) => nameB.includes(w)).length;
          if (matchA !== matchB) return matchB - matchA;

          // Put non-zero priced items before $0 demo items
          if ((a.price > 0) !== (b.price > 0)) {
            return a.price > 0 ? -1 : 1;
          }

          // Higher price first (e.g. $1699 drone before controllers)
          return (b.price || 0) - (a.price || 0);
        }

        // Tier 1: Bundles (standard Fly More combos before custom combos)
        if (tierA === "bundle") {
          const isStandardFlyMoreA =
            nameA.includes("fly more") &&
            !nameA.includes("platinum") &&
            !nameA.includes("ultimate") &&
            !nameA.includes("bonus");
          const isStandardFlyMoreB =
            nameB.includes("fly more") &&
            !nameB.includes("platinum") &&
            !nameB.includes("ultimate") &&
            !nameB.includes("bonus");
          if (isStandardFlyMoreA !== isStandardFlyMoreB) {
            return isStandardFlyMoreA ? -1 : 1;
          }
          return (b.price || 0) - (a.price || 0);
        }

        // Tier 2: Accessories (higher rating and relevant items first)
        return (b.rating || 0) - (a.rating || 0) || (b.price || 0) - (a.price || 0);
      });
    }

    return result;
  }, [products, activeMainTab, onlyInStock, sortBy, currentCollection, slug]);

  const handleQuickAdd = (p: IProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: p._id || p.slug,
      productId: p._id,
      slug: p.slug,
      title: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      img: p.mainImage,
      subtitle: p.tagline || p.category,
    });

    setAddedId(p._id || p.slug);
    setTimeout(() => setAddedId(null), 1800);
  };

  const pageTitle =
    parentCategoryInfo?.title ||
    currentCollection?.title ||
    currentCategory?.name ||
    collectionTitle(slug);

  const renderProductToolbarAndGrid = (showEmptyFeedback: boolean = true) => {
    if (!showEmptyFeedback && !isLoading && filteredProducts.length === 0) {
      return null;
    }

    return (
      <>
        {/* STICKY TABS & FILTERS BAR (1 ROW) */}
        <div
          style={{
            position: "sticky",
            top: "var(--nav-offset, 72px)",
            transition: "top 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: 50,
            backgroundColor: "#ffffff",
          }}
          className="w-full bg-white border-b border-gray-200 shadow-xs will-change-[top]"
        >
          <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-3.5 flex flex-wrap items-center justify-between gap-4">
            {/* Left Side: [All] [Products] [Bundles] [Accessories] */}
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
              {mainTabs.map((tab) => {
                const isActive = activeMainTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveMainTab(tab);
                    }}
                    className={`px-5 py-2.5 rounded-[10px] text-[14px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#121212] text-white shadow-xs"
                        : "bg-[#f0f0f2] hover:bg-gray-200 text-[#121212]"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Right Side: Filter Controls & Sort Selector */}
            <div className="flex items-center gap-4">
              <label
                style={{ fontSize: "14px" }}
                className="flex items-center gap-2 cursor-pointer font-bold text-gray-700 select-none"
              >
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3] w-4 h-4 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ fontSize: "14px" }}
                  className="bg-transparent border border-gray-200 rounded-[10px] px-3 py-2 font-bold text-[#121212] focus:outline-none focus:border-[#0071e3] cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] mt-[36px]">
          {isLoading ? (
            <div
              style={{
                display: "grid",
                gap: "28px",
                rowGap: "36px",
                columnGap: "28px",
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[22px] h-[420px] border border-gray-100 animate-pulse p-[22px] space-y-[16px]"
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-[16px]" />
                  <div className="h-[16px] bg-gray-100 rounded w-3/4" />
                  <div className="h-[16px] bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            showEmptyFeedback ? (
              <div className="text-center py-[80px] bg-white rounded-[24px] border border-gray-100 p-[32px] max-w-[500px] mx-auto shadow-sm">
                <div className="w-[60px] h-[60px] rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-[16px] text-gray-400">
                  <ShoppingBag className="w-[28px] h-[28px]" />
                </div>
                <h3 style={{ fontSize: "22px" }} className="font-bold text-[#121212] mb-[6px]">
                  No products found
                </h3>
                <p style={{ fontSize: "14px" }} className="text-gray-500 mb-[24px]">
                  Try adjusting your filters or search criteria to view available items.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMainTab("All");
                    setOnlyInStock(false);
                    setSortBy("featured");
                  }}
                  className="px-[24px] py-[10px] rounded-full bg-[#121212] text-white font-bold text-[14px] hover:bg-black transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : null
          ) : (
            <div
              style={{
                display: "grid",
                gap: "28px",
                rowGap: "36px",
                columnGap: "28px",
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {filteredProducts.map((product) => {
                const isAdded = addedId === (product._id || product.slug);
                return (
                  <div
                    key={product._id || product.slug}
                    className="bg-white rounded-[22px] border border-gray-200/90 hover:border-gray-300 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group p-[20px] sm:p-[22px]"
                  >
                    <div>
                      {/* Product Image Area */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="block aspect-square w-full relative mb-[16px] overflow-hidden rounded-[16px] bg-[#f8f9fa]"
                      >
                        <img
                          src={product.mainImage || product.images?.[0] || "/placeholder.png"}
                          alt={product.name}
                          className="w-full h-full object-contain p-[12px] transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {product.badge && (
                          <div className="absolute top-[10px] left-[10px] px-[10px] py-[4px] rounded-full text-[11px] font-black uppercase tracking-wider bg-red-500 text-white shadow-xs">
                            {product.badge}
                          </div>
                        )}
                        {/* In Stock Badge */}
                        {product.inStock && (
                          <div className="absolute bottom-[10px] left-[10px] px-[8px] py-[3px] rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-xs text-emerald-700 flex items-center gap-1 shadow-xs border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            <span>In Stock</span>
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="space-y-[6px]">
                        <div className="flex items-center gap-[4px] text-amber-500 text-[13px]">
                          <Star className="w-[14px] h-[14px] fill-amber-400 stroke-amber-400" />
                          <span className="font-bold text-[#121212]">
                            {Number(product.rating || 4.9).toFixed(1)}
                          </span>
                          <span className="text-gray-400 font-normal">
                            ({product.reviewCount || 1})
                          </span>
                        </div>

                        <Link href={`/products/${product.slug}`} className="block">
                          <h3 className="font-bold text-[16px] text-[#121212] leading-snug line-clamp-2 min-h-[44px] hover:text-[#007aff] transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        {product.tagline && (
                          <p className="text-gray-500 text-[13px] line-clamp-1">
                            {product.tagline}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="mt-[20px] pt-[14px] border-t border-gray-100 flex items-center justify-between gap-[10px]">
                      <div>
                        <div className="text-[19px] font-extrabold text-[#121212]">
                          ${product.price?.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-[13px] text-gray-400 line-through">
                            ${product.originalPrice?.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`py-[10px] px-[18px] rounded-[12px] text-[13px] font-bold flex items-center gap-[6px] transition-all cursor-pointer shadow-xs active:scale-95 ${
                          isAdded
                            ? "bg-[#16a34a] text-white"
                            : "bg-[#007aff] hover:bg-[#0066d6] text-white"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-[15px] h-[15px] stroke-[3]" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-[15px] h-[15px]" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#121212]" style={{ overflow: "visible" }}>
      <Header />

      <main className="flex-1 pb-[64px]" style={{ overflow: "visible" }}>
        {parentCategoryInfo ? (
          <>
            {/* Black Hero Banner matching D1 Store: Home / {Category} + Bold Heading */}
            <div className="w-full bg-[#000000] text-white">
              <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-18 lg:pb-20">
                <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
                  <ol className="flex items-center gap-2 text-[13px] sm:text-[14px] text-white/70 font-medium">
                    <li>
                      <Link href="/" className="hover:text-white transition-colors">
                        Home
                      </Link>
                    </li>
                    <li aria-hidden="true" className="text-white/40">
                      /
                    </li>
                    <li className="text-white font-medium">{parentCategoryInfo.title}</li>
                  </ol>
                </nav>

                <h1
                  style={{
                    fontSize: "clamp(48px, 6.5vw, 92px)",
                    fontWeight: 800,
                    lineHeight: 1.04,
                    letterSpacing: "-0.03em",
                  }}
                  className="text-white font-black tracking-tight"
                >
                  {parentCategoryInfo.title}
                </h1>
              </div>
            </div>

            {/* Model Series Cards Grid (matching D1 Store screenshot) */}
            <div className="w-full bg-white">
              <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-14 lg:py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {parentCategoryInfo.cards.map((card) => (
                    <div key={card.title} className="d1-parent-children__card">
                      <Link
                        href={card.href}
                        className="group flex flex-col items-stretch justify-start w-full h-auto p-3.5 sm:p-5 rounded-[22px] bg-transparent transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:bg-white hover:shadow-[0_12px_28px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070e0]"
                      >
                        <div className="relative w-full aspect-square rounded-[16px] overflow-hidden bg-transparent flex items-center justify-center">
                          <img
                            src={card.img}
                            alt={card.title}
                            loading="lazy"
                            width={600}
                            height={600}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="mt-3.5 sm:mt-4 text-left">
                          <h3 className="text-[15px] sm:text-[17px] font-bold text-[#121212] group-hover:text-[#0070e0] transition-colors leading-snug">
                            {card.title}
                          </h3>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* If this parent category has products, also show product catalog below */}
            {filteredProducts.length > 0 && (
              <div className="w-full">
                <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] pt-12 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121212]">
                    All {parentCategoryInfo.title} Products
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                  </p>
                </div>
                {renderProductToolbarAndGrid(false)}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Child Collection: Scraped hero banner or standard header */}
            {currentCollection?.heroBannerImage ? (
              <div
                className="w-full relative min-h-[380px] sm:min-h-[420px] md:min-h-[460px] lg:min-h-[500px] flex items-center bg-cover bg-center overflow-hidden"
                style={{
                  backgroundImage: `url(${currentCollection.heroBannerImage})`,
                  backgroundPosition: "center right",
                }}
              >
                {/* Soft left-to-right vignette so title and breadcrumbs are crystal clear */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent pointer-events-none" />

                <div className="max-w-[1760px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-16">
                  <div className="max-w-2xl">
                    {/* Breadcrumbs from reverse-mapping or Scraped DB hierarchy */}
                    <nav
                      aria-label="Breadcrumb"
                      className="flex flex-wrap items-center gap-2 text-[13px] sm:text-[14px] text-white/80 font-medium mb-3"
                    >
                      {childToParentMap[normalizedSlug] ? (
                        <>
                          <Link href="/" className="hover:text-white transition-colors">
                            Home
                          </Link>
                          <span className="text-white/40">/</span>
                          <Link
                            href={`/collections/${childToParentMap[normalizedSlug].parentSlug}`}
                            className="hover:text-white transition-colors"
                          >
                            {childToParentMap[normalizedSlug].parentTitle}
                          </Link>
                          <span className="text-white/40">/</span>
                          <span className="text-white font-semibold">{pageTitle}</span>
                        </>
                      ) : currentCollection.breadcrumbs && currentCollection.breadcrumbs.length > 0 ? (
                        currentCollection.breadcrumbs.map((crumb, idx) => {
                          const isLast = idx === currentCollection.breadcrumbs!.length - 1;
                          return (
                            <React.Fragment key={crumb}>
                              {idx > 0 && <span className="text-white/40">/</span>}
                              {isLast ? (
                                <span className="text-white font-semibold">{crumb}</span>
                              ) : (
                                <Link
                                  href={idx === 0 ? "/" : `/collections/${crumb.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                                  className="hover:text-white transition-colors"
                                >
                                  {crumb}
                                </Link>
                              )}
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <>
                          <Link href="/" className="hover:text-white transition-colors">
                            Home
                          </Link>
                          <span className="text-white/40">/</span>
                          <Link href="/collections/all" className="hover:text-white transition-colors">
                            Collections
                          </Link>
                          <span className="text-white/40">/</span>
                          <span className="text-white font-semibold">{pageTitle}</span>
                        </>
                      )}
                    </nav>

                    {/* Massive Bold Heading */}
                    <h1
                      style={{
                        fontSize: "clamp(46px, 5.5vw, 78px)",
                        fontWeight: 900,
                        lineHeight: 1.05,
                        color: "#ffffff",
                        letterSpacing: "-0.03em",
                      }}
                      className="text-white font-black tracking-tight leading-[1.05] drop-shadow-md"
                    >
                      {pageTitle}
                    </h1>

                    {/* Tagline if available */}
                    {currentCollection.tagline && (
                      <p className="mt-3 text-white/85 text-[16px] sm:text-[18px] max-w-xl font-medium">
                        {currentCollection.tagline}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Standard Breadcrumb Navigation */}
                <div className="bg-white border-b border-gray-100">
                  <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[12px]">
                    <nav style={{ fontSize: "13px" }} className="flex items-center gap-[8px] text-gray-500 font-medium">
                      <Link href="/" className="hover:text-[#0071e3] transition-colors">
                        Home
                      </Link>
                      <ChevronRight className="w-[14px] h-[14px]" />
                      {childToParentMap[normalizedSlug] ? (
                        <>
                          <Link
                            href={`/collections/${childToParentMap[normalizedSlug].parentSlug}`}
                            className="hover:text-[#0071e3] transition-colors"
                          >
                            {childToParentMap[normalizedSlug].parentTitle}
                          </Link>
                          <ChevronRight className="w-[14px] h-[14px]" />
                        </>
                      ) : (
                        <>
                          <Link href="/collections/all" className="hover:text-[#0071e3] transition-colors">
                            Collections
                          </Link>
                          <ChevronRight className="w-[14px] h-[14px]" />
                        </>
                      )}
                      <span className="text-[#121212] font-bold">{pageTitle}</span>
                    </nav>
                  </div>
                </div>

                {/* Standard Collection Header */}
                <div className="bg-white border-b border-gray-100 py-[32px] md:py-[48px]">
                  <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px]">
                    <div className="max-w-[800px] space-y-[10px]">
                      <div
                        style={{ fontSize: "12px" }}
                        className="inline-flex items-center gap-[6px] px-[12px] py-[5px] rounded-full bg-blue-50 text-[#0071e3] font-bold tracking-wide"
                      >
                        <Sparkles className="w-[14px] h-[14px]" />
                        <span>Official DJI Authorized Collection</span>
                      </div>
                      <h1
                        style={{ fontSize: "36px" }}
                        className="font-black tracking-tight text-[#121212] capitalize leading-tight"
                      >
                        {pageTitle}
                      </h1>
                      <p
                        style={{ fontSize: "15px" }}
                        className="text-gray-600 font-normal leading-relaxed"
                      >
                        {currentCollection?.description ||
                          currentCategory?.description ||
                          `Explore genuine DJI ${pageTitle} with official Australian warranty, local fast shipping, and expert support.`}
                      </p>
                      <div style={{ fontSize: "13px" }} className="pt-[6px] font-bold text-gray-400">
                        Showing {filteredProducts.length} of {products.length} products
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {renderProductToolbarAndGrid(true)}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
