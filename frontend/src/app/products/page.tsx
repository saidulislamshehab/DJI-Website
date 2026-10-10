"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fetchProducts } from "@/lib/api";
import { IProduct } from "@/types";
import { useCart } from "@/context/CartContext";
import {
  SlidersHorizontal,
  Search,
  Star,
  ShoppingBag,
  Check,
  ChevronRight,
  X,
  PackageOpen,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [addedId, setAddedId] = useState<string | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetchProducts({ limit: 100 });
        if (isMounted) {
          setProducts(res.products || []);
        }
      } catch (err) {
        console.error("Products page load error:", err);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter(
        (p) =>
          (p.category && p.category.toLowerCase() === activeCategory.toLowerCase()) ||
          (p.categorySlug && p.categorySlug.toLowerCase() === activeCategory.toLowerCase())
      );
    }

    // In Stock filter
    if (onlyInStock) {
      result = result.filter((p) => p.inStock && (p.stockCount === undefined || p.stockCount > 0));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.tagline && p.tagline.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "name_asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, activeCategory, onlyInStock, searchQuery, sortBy]);

  const handleQuickAdd = (product: IProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const pid = product._id || product.slug;
    addToCart({
      id: pid,
      productId: product._id,
      slug: product.slug,
      title: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      img: product.mainImage,
      subtitle: product.tagline || product.category,
    }, 1);
    setAddedId(pid);
    setTimeout(() => {
      setAddedId((curr) => (curr === pid ? null : curr));
    }, 1800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#121212]">
      <Header />

      <main className="flex-1 pb-20">
        {/* Hero Banner with Dark Contrast Theme */}
        <div className="w-full bg-[#000000] text-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-9 pt-10 pb-12 sm:pt-14 sm:pb-16">
            <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
              <ol className="flex items-center gap-2 text-sm text-white/70 font-medium">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/40">
                  /
                </li>
                <li className="text-white font-medium">All Products</li>
              </ol>
            </nav>

            <span className="text-[#0071e3] font-black uppercase text-xs sm:text-sm tracking-widest block mb-2">
              OFFICIAL AUSTRALIAN CATALOG
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-[36px] font-black text-white tracking-tight leading-tight">
              All Products
            </h1>
            <p className="text-base sm:text-lg text-gray-300 mt-3 max-w-2xl leading-relaxed">
              Explore genuine DJI consumer drones, handheld gimbals, enterprise solutions, and accessories backed by local Australian warranty and service.
            </p>
          </div>
        </div>

        {/* Sticky Filters & Category Bar */}
        <div className="sticky top-0 z-30 w-full bg-white border-b border-gray-200/90 shadow-xs">
          <div className="max-w-[1400px] mx-auto px-4 md:px-9 py-3.5 flex flex-wrap items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`h-[42px] px-5 sm:px-6 rounded-full text-sm sm:text-[15px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#121212] text-white shadow-xs"
                        : "bg-[#f0f0f2] hover:bg-gray-200 text-[#121212]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Right: Search, Stock toggle & Sort selector */}
            <div className="flex items-center gap-3.5 flex-wrap w-full lg:w-auto justify-between lg:justify-start">
              {/* Search Bar */}
              <div className="relative flex-1 sm:flex-initial min-w-[160px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter products..."
                  className="h-[40px] pl-10 pr-8 rounded-full border border-gray-200 bg-gray-50 text-sm font-medium text-[#121212] focus:bg-white focus:outline-none focus:border-[#0071e3] transition-colors w-full sm:w-[220px]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* In Stock Only Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700 select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3] w-4 h-4 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-[40px] bg-transparent border border-gray-200 rounded-full px-3.5 text-sm font-bold text-[#121212] focus:outline-none focus:border-[#0071e3] cursor-pointer"
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

        {/* Product Catalog Grid */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-9 mt-10">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-bold text-gray-500">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[24px] h-[450px] border border-gray-100 animate-pulse p-6 space-y-4"
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-[18px]" />
                  <div className="h-5 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-100 rounded w-1/3 mt-6" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[26px] border border-gray-200 p-8 max-w-[540px] mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#121212] mb-2">
                No products found
              </h3>
              <p className="text-base text-gray-500 mb-6 leading-relaxed">
                Try adjusting your search query, clearing filters, or browsing other categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                  setOnlyInStock(false);
                  setSortBy("featured");
                }}
                className="h-[46px] px-8 rounded-full bg-[#121212] text-white font-bold text-base hover:bg-black transition-all cursor-pointer shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const isAdded = addedId === (product._id || product.slug);
                const isAvailable = Boolean(product.inStock && (product.stockCount === undefined || product.stockCount > 0));
                return (
                  <div
                    key={product._id || product.slug}
                    className="bg-white rounded-[20px] border border-gray-200/90 hover:border-gray-300 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative group p-4 sm:p-5"
                  >
                    <div>
                      {/* Product Image Area */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="block aspect-square w-full relative mb-3.5 overflow-hidden rounded-[16px] bg-[#f8f9fa]"
                      >
                        <img
                          src={product.mainImage || product.images?.[0] || "/placeholder.png"}
                          alt={product.name}
                          className="w-full h-full object-contain p-3.5 transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {product.badge && (
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-500 text-white shadow-xs">
                            {product.badge}
                          </div>
                        )}
                        {/* Stock Badge */}
                        {!isAvailable ? (
                          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 backdrop-blur-xs text-red-700 flex items-center gap-1.5 shadow-xs border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                            <span>No Stock</span>
                          </div>
                        ) : (
                          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 backdrop-blur-xs text-emerald-800 flex items-center gap-1.5 shadow-xs border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                            <span>In Stock</span>
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-amber-500 text-xs sm:text-[13px]">
                          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                          <span className="font-semibold text-[#121212]">
                            {Number(product.rating || 4.9).toFixed(1)}
                          </span>
                          <span className="text-gray-400 font-normal">
                            ({product.reviewCount || 1})
                          </span>
                        </div>

                        <Link href={`/products/${product.slug}`} className="block">
                          <h3 className="d1-product-card__title font-semibold text-[14px] sm:text-[15px] text-[#121212] leading-snug line-clamp-2 min-h-[40px] hover:text-[#007aff] transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        {product.tagline && (
                          <p className="text-gray-500 text-xs sm:text-[13px] line-clamp-1">
                            {product.tagline}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[18px] sm:text-[20px] font-bold text-[#121212]">
                          ${product.price?.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-xs text-gray-400 line-through">
                            ${product.originalPrice?.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={!isAvailable}
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`h-[40px] px-3.5 sm:px-4 rounded-[12px] text-xs sm:text-[13px] font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                          !isAvailable
                            ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                            : isAdded
                            ? "bg-[#16a34a] text-white active:scale-95 cursor-pointer"
                            : "bg-[#007aff] hover:bg-[#0066d6] text-white active:scale-95 cursor-pointer"
                        }`}
                      >
                        {!isAvailable ? (
                          <span>No Stock</span>
                        ) : isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
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
