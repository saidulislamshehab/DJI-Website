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
  const name = (p.name || "").toLowerCase();
  const cat = (p.category || "").toLowerCase();
  const sub = (p.subCategory || "").toLowerCase();
  const tags = (p.tags || []).map((t) => t.toLowerCase());

  const accessoryKeywords = [
    "battery", "hub", "charger", "charging", "propeller", "filter", "case", "mount",
    "lanyard", "strap", "cable", "hood", "stick", "adapter", "lens", "card",
    "bracket", "arm", "bag", "protector", "care refresh", "antenna", "receiver",
    "motor", "guard", "landing pad", "cover", "safety case", "d1 labs", "lifthor",
    "freewell", "sunnylife", "pgytech", "pgtech", "ugreen", "sandisk", "polariser",
    "monitor hood", "remote controller", "control stick"
  ];

  const bundleKeywords = [
    "combo", "bundle", "fly more", "bonus bundle", "ultimate combo",
    "platinum combo", "creator combo", "basic package"
  ];

  const isAccessory =
    cat.includes("accessories") ||
    cat.includes("accessory") ||
    sub.includes("accessories") ||
    tags.includes("accessories") ||
    tags.includes("accessory") ||
    accessoryKeywords.some((k) => name.includes(k));

  if (isAccessory && (name.includes("filter") || name.includes("mount") || name.includes("propeller") || name.includes("lanyard") || name.includes("pack"))) {
    return "accessory";
  }

  const isBundle =
    bundleKeywords.some((k) => name.includes(k)) ||
    cat.includes("bundle") ||
    tags.includes("bundle");

  if (isBundle) return "bundle";
  if (isAccessory) return "accessory";
  return "product";
}

export default function CollectionPage() {
  const params = useParams();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<ICategory | null>(null);
  const [currentCollection, setCurrentCollection] = useState<ICollection | null>(() => findStaticCollection(slug));
  const [isLoading, setIsLoading] = useState(true);

  const [activeMainTab, setActiveMainTab] = useState<string>("Products");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("All");
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(30000);
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
  }, [slug]);

  // Sub-categories for collection
  const subCategoriesList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.subCategory) set.add(p.subCategory);
    });
    if (currentCategory?.subCategories) {
      currentCategory.subCategories.forEach((s) => {
        if (typeof s === "string") set.add(s);
        else if (s && typeof s === "object" && "name" in s) set.add(s.name);
      });
    }
    return ["All", ...Array.from(set)];
  }, [products, currentCategory]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Jump Nav Tabs Filter: [Products] [Bundles] [Accessories]
    if (activeMainTab === "Bundles") {
      result = result.filter((p) => getProductTier(p) === "bundle");
    } else if (activeMainTab === "Accessories") {
      result = result.filter((p) => getProductTier(p) === "accessory");
    } else if (activeMainTab === "Products") {
      // Products view: Show core products and combos/bundles with actual products first!
      // If collection is purely accessories, show accessories as fallback.
      const hasCore = result.some((p) => getProductTier(p) === "product");
      const hasBundles = result.some((p) => getProductTier(p) === "bundle");
      if (hasCore || hasBundles) {
        result = result.filter((p) => getProductTier(p) !== "accessory");
      }
    }

    // 2. Sub-Category / Series Pill Filter
    if (selectedSubCategory !== "All") {
      const s = selectedSubCategory.toLowerCase();
      result = result.filter((p) => {
        const sub = (p.subCategory || "").toLowerCase();
        const name = (p.name || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();
        return sub.includes(s) || name.includes(s) || cat.includes(s);
      });
    }

    // 3. In Stock Filter
    if (onlyInStock) {
      result = result.filter((p) => p.inStock);
    }

    // 4. Max Price Filter
    if (maxPriceFilter < 30000) {
      result = result.filter((p) => p.price <= maxPriceFilter);
    }

    // 5. Sorting: "first show the actual product then show bundle and accessories"
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

        // Exact match to current collection title / slug
        const targetWords = (currentCollection?.title || collectionTitle(slug) || slug)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, " ")
          .trim()
          .split(" ")
          .filter((w) => w.length > 2);

        // Core products tier
        if (tierA === "product") {
          const matchA = targetWords.filter((w) => nameA.includes(w)).length;
          const matchB = targetWords.filter((w) => nameB.includes(w)).length;
          if (matchA !== matchB) return matchB - matchA;

          // Controllers go after actual drone/hardware unit
          const isControllerA = nameA.includes("controller") || nameA.includes("rc-n") || nameA.includes("rc 2");
          const isControllerB = nameB.includes("controller") || nameB.includes("rc-n") || nameB.includes("rc 2");
          if (isControllerA !== isControllerB) {
            return isControllerA ? 1 : -1;
          }

          // Higher price first (e.g. $1699 drone before $165 controller)
          return (b.price || 0) - (a.price || 0);
        }

        // Bundles tier: standard Fly More combos before store combos
        if (tierA === "bundle") {
          const isFlyMoreA = nameA.includes("fly more") && !nameA.includes("bonus") && !nameA.includes("ultimate") && !nameA.includes("platinum");
          const isFlyMoreB = nameB.includes("fly more") && !nameB.includes("bonus") && !nameB.includes("ultimate") && !nameB.includes("platinum");
          if (isFlyMoreA !== isFlyMoreB) return isFlyMoreA ? -1 : 1;
          return (b.price || 0) - (a.price || 0);
        }

        // Accessories tier: higher rated and relevant
        return (b.rating || 0) - (a.rating || 0) || (b.price || 0) - (a.price || 0);
      });
    }

    return result;
  }, [products, activeMainTab, selectedSubCategory, onlyInStock, maxPriceFilter, sortBy, currentCollection, slug]);

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

  const pageTitle = currentCollection?.title || currentCategory?.name || collectionTitle(slug);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#121212]">
      <Header />

      <main className="flex-1 pb-[64px]">
        {/* Collection Hero Header: Check if collection has scraped heroBannerImage */}
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
                {/* Breadcrumbs from Scraped DB hierarchy */}
                <nav
                  aria-label="Breadcrumb"
                  className="flex flex-wrap items-center gap-2 text-[13px] sm:text-[14px] text-white/80 font-medium mb-3"
                >
                  {currentCollection.breadcrumbs && currentCollection.breadcrumbs.length > 0 ? (
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
                  <Link href="/collections/all" className="hover:text-[#0071e3] transition-colors">
                    Collections
                  </Link>
                  <ChevronRight className="w-[14px] h-[14px]" />
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

        {/* JUMP TABS BAR (Products, Bundles, Accessories) from DB */}
        {currentCollection?.tabs && currentCollection.tabs.length > 0 && (
          <div className="w-full bg-white border-b border-gray-100 sticky top-[68px] lg:top-[72px] z-30 shadow-xs">
            <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
              {["All", ...currentCollection.tabs].map((tab) => {
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
          </div>
        )}

        {/* Filters & Sorting Bar */}
        <div className="bg-white border-b border-gray-200 py-[14px]">
          <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] flex flex-wrap items-center justify-between gap-[16px]">
            {/* Sub-category Pill Filter Buttons */}
            <div className="flex items-center gap-[8px] overflow-x-auto no-scrollbar py-[2px]">
              {subCategoriesList.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubCategory(sub)}
                  style={{ fontSize: "14px" }}
                  className={`px-[18px] py-[8px] rounded-full font-bold whitespace-nowrap transition-all ${
                    selectedSubCategory === sub
                      ? "bg-[#121212] text-white shadow-sm"
                      : "bg-[#f5f5f7] hover:bg-gray-200 text-[#121212]"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Filter Controls & Sort Selector */}
            <div className="flex items-center gap-[16px]">
              <label
                style={{ fontSize: "14px" }}
                className="flex items-center gap-[8px] cursor-pointer font-bold text-gray-700 select-none"
              >
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3] w-[16px] h-[16px] cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>

              <div className="flex items-center gap-[8px]">
                <SlidersHorizontal className="w-[16px] h-[16px] text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ fontSize: "14px" }}
                  className="bg-transparent border border-gray-200 rounded-[10px] px-[12px] py-[8px] font-bold text-[#121212] focus:outline-none focus:border-[#0071e3] cursor-pointer"
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
        <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] mt-[32px]">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] md:gap-[28px]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[20px] h-[400px] border border-gray-100 animate-pulse p-[20px] space-y-[16px]"
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-[16px]" />
                  <div className="h-[16px] bg-gray-100 rounded w-3/4" />
                  <div className="h-[16px] bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
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
                  setSelectedSubCategory("All");
                  setActiveMainTab("All");
                  setOnlyInStock(false);
                  setMaxPriceFilter(30000);
                  setSortBy("featured");
                }}
                className="px-[24px] py-[10px] rounded-full bg-[#121212] text-white font-bold text-[14px] hover:bg-black transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] md:gap-[28px]">
              {filteredProducts.map((product) => {
                const isAdded = addedId === (product._id || product.slug);
                return (
                  <div
                    key={product._id || product.slug}
                    className="bg-white rounded-[20px] border border-[#e5e5ea] overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative group p-[20px]"
                  >
                    <div>
                      {/* Product Image Area */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="block aspect-square w-full relative mb-[16px] overflow-hidden rounded-[12px] bg-[#fafafa]"
                      >
                        <img
                          src={product.mainImage || product.images?.[0] || "/placeholder.png"}
                          alt={product.name}
                          className="w-full h-full object-contain p-[10px] transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {product.badge && (
                          <div className="absolute top-[8px] left-[8px] px-[10px] py-[4px] rounded-full text-[11px] font-black uppercase tracking-wider bg-red-500 text-white shadow-xs">
                            {product.badge}
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="space-y-[6px]">
                        <div className="flex items-center gap-[4px] text-amber-500 text-[13px]">
                          <Star className="w-[14px] h-[14px] fill-amber-400 stroke-amber-400" />
                          <span className="font-bold text-[#121212]">
                            {product.rating || 5.0}
                          </span>
                          <span className="text-gray-400 font-normal">
                            ({product.reviewCount || 1})
                          </span>
                        </div>

                        <Link href={`/products/${product.slug}`} className="block">
                          <h3 className="font-bold text-[16px] text-[#121212] leading-snug line-clamp-2 hover:text-[#007aff] transition-colors">
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
                        className={`py-[9px] px-[16px] rounded-[10px] text-[13px] font-bold flex items-center gap-[6px] transition-all cursor-pointer shadow-xs active:scale-95 ${
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
      </main>

      <Footer />
    </div>
  );
}
