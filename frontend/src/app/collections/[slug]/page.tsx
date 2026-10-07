"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fetchProducts, fetchCategories, fetchCategoryBySlug } from "@/lib/api";
import { collectionTitle, getStaticProductsForCollection } from "@/lib/catalog";
import { IProduct, ICategory } from "@/types";
import { useCart } from "@/context/CartContext";
import {
  SlidersHorizontal,
  ChevronRight,
  Star,
  ShoppingBag,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function CollectionPage() {
  const params = useParams();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<ICategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("All");
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(30000);
  const [addedId, setAddedId] = useState<string | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [catsRes, catRes] = await Promise.all([
          fetchCategories().catch(() => []),
          fetchCategoryBySlug(slug).catch(() => null),
        ]);
        setCategories(catsRes);
        setCurrentCategory(catRes);

        let prodParams: Record<string, unknown> = { limit: 50 };
        if (slug === "just-landed" || slug === "dji-sale") {
          prodParams.isNewArrival = true;
        } else if (slug && slug !== "all") {
          prodParams.category = slug;
        }

        const prodsRes = await fetchProducts(prodParams).catch(() => ({ products: [] as IProduct[] }));
        let loaded: IProduct[] = (prodsRes.products as IProduct[]) || [];

        if (loaded.length === 0 && slug) {
          const keyword = slug.replace(/-/g, " ");
          const searchRes = await fetchProducts({ search: keyword, limit: 50 }).catch(() => ({ products: [] as IProduct[] }));
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

  // Available sub-categories derived from products and category metadata
  const subCategoriesList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.subCategory) set.add(p.subCategory);
    });
    if (currentCategory?.subCategories) {
      currentCategory.subCategories.forEach((s) => set.add(s));
    }
    return ["All", ...Array.from(set)];
  }, [products, currentCategory]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedSubCategory !== "All") {
      result = result.filter(
        (p) => p.subCategory?.toLowerCase() === selectedSubCategory.toLowerCase()
      );
    }

    if (onlyInStock) {
      result = result.filter((p) => p.inStock);
    }

    if (maxPriceFilter < 30000) {
      result = result.filter((p) => p.price <= maxPriceFilter);
    }

    // Sort
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name_asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, selectedSubCategory, onlyInStock, maxPriceFilter, sortBy]);

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

  const pageTitle = currentCategory?.name || collectionTitle(slug);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#121212]">
      <Header />

      <main className="flex-1 pb-[64px]">
        {/* Breadcrumb Navigation */}
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

        {/* Collection Hero Header */}
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
                {currentCategory?.description ||
                  `Explore genuine DJI ${pageTitle} with official Australian warranty, local fast shipping, and expert support.`}
              </p>
              <div style={{ fontSize: "13px" }} className="pt-[6px] font-bold text-gray-400">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Sorting Bar */}
        <div className="sticky top-[68px] md:top-[118px] z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm py-[14px]">
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
              {/* In-Stock Toggle */}
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

              {/* Sort By Dropdown */}
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
                  setOnlyInStock(false);
                  setMaxPriceFilter(30000);
                  setSortBy("featured");
                }}
                style={{ fontSize: "14px" }}
                className="inline-flex items-center gap-[8px] px-[24px] py-[12px] rounded-full bg-[#0071e3] text-white font-bold hover:bg-[#0058b8] transition-all"
              >
                <RotateCcw className="w-[16px] h-[16px]" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] md:gap-[28px]">
              {filteredProducts.map((p) => {
                const isAdded = addedId === (p._id || p.slug);
                return (
                  <div
                    key={p._id || p.slug}
                    className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <Link href={`/products/${p.slug}`} className="block relative">
                      {/* Badge */}
                      {p.badge && (
                        <span
                          style={{ fontSize: "11px" }}
                          className="absolute top-[12px] left-[12px] z-10 px-[10px] py-[4px] font-extrabold tracking-wider rounded-[6px] bg-[#121212] text-white shadow-sm uppercase"
                        >
                          {p.badge}
                        </span>
                      )}

                      {/* Image Container with Consistent Aspect Ratio */}
                      <div className="relative aspect-square w-full bg-[#f8f8fa] overflow-hidden flex items-center justify-center p-[20px]">
                        <img
                          src={p.mainImage || "https://cdn.d1store.app/shopify/product-page-editor/assets/c8150de7-006f-4f9b-84a4-526f5b082b97/005-website-categoryimages-neo2-fa.webp"}
                          alt={p.name}
                          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.currentTarget;
                            target.src = "https://cdn.d1store.app/shopify/product-page-editor/assets/c8150de7-006f-4f9b-84a4-526f5b082b97/005-website-categoryimages-neo2-fa.webp";
                          }}
                        />
                      </div>

                      {/* Card Content */}
                      <div className="p-[18px] flex flex-col flex-1 justify-between space-y-[10px]">
                        <div>
                          {/* Rating */}
                          <div className="flex items-center gap-[6px] text-amber-500 mb-[6px]">
                            <Star className="w-[14px] h-[14px] fill-amber-400 text-amber-400" />
                            <span style={{ fontSize: "13px" }} className="font-bold text-[#121212]">
                              {p.rating?.toFixed(1) || "4.9"}
                            </span>
                            <span style={{ fontSize: "13px" }} className="text-gray-400">
                              ({p.reviewCount || 15})
                            </span>
                          </div>

                          <h3
                            style={{ fontSize: "17px" }}
                            className="font-bold text-[#121212] group-hover:text-[#0071e3] transition-colors line-clamp-2 leading-snug"
                          >
                            {p.name}
                          </h3>

                          {p.tagline && (
                            <p
                              style={{ fontSize: "13px" }}
                              className="text-gray-500 line-clamp-1 mt-[4px]"
                            >
                              {p.tagline}
                            </p>
                          )}
                        </div>

                        <div className="pt-[8px]">
                          {/* Pricing */}
                          <div className="flex items-baseline gap-[8px]">
                            <span
                              style={{ fontSize: "20px" }}
                              className="font-extrabold text-[#121212]"
                            >
                              ${p.price.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span
                                style={{ fontSize: "14px" }}
                                className="text-gray-400 line-through"
                              >
                                ${p.originalPrice.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            )}
                          </div>

                          {/* Stock Status */}
                          <div className="flex items-center gap-[6px] mt-[6px]">
                            <span className="w-[7px] h-[7px] rounded-full bg-[#008a00]" />
                            <span
                              style={{ fontSize: "13px" }}
                              className="font-semibold text-[#008a00]"
                            >
                              In Stock
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Add to Cart button */}
                    <div className="px-[18px] pb-[18px]">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(p, e)}
                        style={{ fontSize: "14px" }}
                        className={`w-full py-[10px] rounded-full font-bold flex items-center justify-center gap-[8px] transition-all ${
                          isAdded
                            ? "bg-[#008a00] text-white"
                            : "bg-[#f5f5f7] hover:bg-[#0071e3] text-[#121212] hover:text-white"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-[16px] h-[16px]" />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-[16px] h-[16px]" />
                            <span>Add to Cart</span>
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
