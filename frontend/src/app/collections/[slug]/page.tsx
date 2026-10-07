"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fetchProducts, fetchCategories, fetchCategoryBySlug } from "@/lib/api";
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
          fetchCategories(),
          fetchCategoryBySlug(slug),
        ]);
        setCategories(catsRes);
        setCurrentCategory(catRes);

        // Fetch products: if slug is 'all' or 'just-landed', fetch all/new
        let prodParams: Record<string, unknown> = { limit: 50 };
        if (slug === "just-landed" || slug === "dji-sale") {
          prodParams.isNewArrival = true;
        } else if (slug && slug !== "all") {
          prodParams.category = slug;
        }

        const prodsRes = await fetchProducts(prodParams);

        // If specific category slug returned 0 products (e.g. 'osmo-pocket-4p'), search by keyword
        if (prodsRes.products.length === 0 && slug) {
          const keyword = slug.replace(/-/g, " ");
          const searchRes = await fetchProducts({ search: keyword, limit: 50 });
          setProducts(searchRes.products);
        } else {
          setProducts(prodsRes.products);
        }
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

  const pageTitle = currentCategory?.name || (slug ? slug.replace(/-/g, " ").toUpperCase() : "All Products");

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#121212]">
      <Header />

      <main className="flex-1 pb-16">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-gray-100">
          <div className="page-width py-3">
            <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <Link href="/" className="hover:text-[#0071e3] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/collections/all" className="hover:text-[#0071e3] transition-colors">
                Collections
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#121212] font-bold">{pageTitle}</span>
            </nav>
          </div>
        </div>

        {/* Collection Hero Header */}
        <div className="bg-white border-b border-gray-100 py-8 md:py-12">
          <div className="page-width">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0071e3] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Official DJI Authorized Collection</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#121212] capitalize">
                {pageTitle}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
                {currentCategory?.description ||
                  `Explore genuine DJI ${pageTitle} with official Australian warranty, local fast shipping, and expert support.`}
              </p>
              <div className="pt-2 text-xs font-bold text-gray-400">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Sorting Bar */}
        <div className="sticky top-[72px] z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs py-3.5">
          <div className="page-width flex flex-wrap items-center justify-between gap-4">
            {/* Sub-category Pill Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {subCategoriesList.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedSubCategory === sub
                      ? "bg-[#121212] text-white shadow-xs"
                      : "bg-[#f5f5f7] hover:bg-gray-200 text-[#121212]"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Filter Controls & Sort Selector */}
            <div className="flex items-center gap-3">
              {/* In-Stock Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3] w-4 h-4 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-bold text-[#121212] focus:outline-none focus:border-[#0071e3] cursor-pointer"
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
        <div className="page-width mt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-[360px] border border-gray-100 animate-pulse p-4 space-y-4"
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-xl" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 max-w-lg mx-auto shadow-xs">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#121212] mb-1">
                No products found
              </h3>
              <p className="text-sm text-gray-500 mb-6">
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-xs font-bold hover:bg-[#0058b8] transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((p) => {
                const isAdded = addedId === (p._id || p.slug);
                return (
                  <div
                    key={p._id || p.slug}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <Link href={`/products/${p.slug}`} className="block relative">
                      {/* Badge */}
                      {p.badge && (
                        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] sm:text-[11px] font-black tracking-wide rounded-md bg-[#121212] text-white shadow">
                          {p.badge}
                        </span>
                      )}

                      {/* Image Container */}
                      <div className="relative aspect-square w-full bg-[#f8f8fa] overflow-hidden flex items-center justify-center p-4">
                        <img
                          src={p.mainImage}
                          alt={p.name}
                          className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-1.5">
                        <div className="flex items-center gap-1 text-xs text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-[#121212]">
                            {p.rating?.toFixed(1) || "5.0"}
                          </span>
                          <span className="text-gray-400">
                            ({p.reviewCount || 14})
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-[#121212] group-hover:text-[#0071e3] transition-colors line-clamp-1">
                          {p.name}
                        </h3>

                        {p.tagline && (
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {p.tagline}
                          </p>
                        )}

                        <div className="pt-1 flex items-baseline gap-2">
                          <span className="text-base sm:text-lg font-black text-[#121212]">
                            ${p.price.toLocaleString()}
                          </span>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <span className="text-xs text-gray-400 line-through">
                              ${p.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="pt-1 flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              p.inStock ? "bg-emerald-500" : "bg-red-500"
                            }`}
                          />
                          <span
                            className={`text-[11px] font-bold ${
                              p.inStock ? "text-emerald-700" : "text-red-600"
                            }`}
                          >
                            {p.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Quick Add Button */}
                    <div className="p-4 pt-0">
                      <button
                        type="button"
                        disabled={!p.inStock}
                        onClick={(e) => handleQuickAdd(p, e)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          isAdded
                            ? "bg-emerald-600 text-white"
                            : p.inStock
                            ? "bg-[#f5f5f7] hover:bg-[#0071e3] text-[#121212] hover:text-white"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{p.inStock ? "Add to Cart" : "Out of Stock"}</span>
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
