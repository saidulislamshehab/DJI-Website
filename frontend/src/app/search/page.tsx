"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { fetchProducts } from "@/lib/api";
import { IProduct } from "@/types";
import { Search, Loader2, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

function SearchInner() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") || "";

  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let active = true;
    async function performSearch() {
      setIsLoading(true);
      try {
        if (q.trim()) {
          const res = await fetchProducts({ search: q.trim(), limit: 48 });
          if (active) {
            setProducts(res.products || []);
            setTotalCount(res.total || res.products?.length || 0);
          }
        } else {
          // If query is empty, show featured catalog products
          const res = await fetchProducts({ isFeatured: true, limit: 24 });
          if (active) {
            setProducts(res.products || []);
            setTotalCount(res.total || res.products?.length || 0);
          }
        }
      } catch (err) {
        console.error("Search fetch error:", err);
        if (active) {
          setProducts([]);
          setTotalCount(0);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    performSearch();
    return () => {
      active = false;
    };
  }, [q]);

  return (
    <section className="page-width py-10 md:py-14">
      {/* Search Header */}
      <div className="max-w-2xl mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#121212] tracking-tight mb-4">
          {q ? `Search Results for “${q}”` : "Explore Catalog"}
        </h1>
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const val = String(fd.get("q") || "").trim();
            router.push(val ? `/search?q=${encodeURIComponent(val)}` : "/search");
          }}
        >
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search genuine DJI drones, cameras, accessories..."
              className="w-full h-13 pl-12 pr-28 rounded-full bg-[#f2f2f4] text-[#121212] placeholder:text-gray-400 outline-none border border-transparent focus:border-[#0071e3] focus:bg-white transition-all text-base font-medium shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2 rounded-full bg-[#0071e3] text-white text-sm font-semibold hover:bg-[#0077ed] transition-colors shadow-sm"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results status */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-500">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#0071e3]" />
              Searching database...
            </span>
          ) : q ? (
            <span>Found <strong className="text-[#121212]">{totalCount}</strong> products for “{q}”</span>
          ) : (
            <span>Showing <strong className="text-[#121212]">{products.length}</strong> featured catalog products</span>
          )}
        </p>

        {/* Quick category filter tags */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="text-gray-400 font-semibold uppercase">Popular:</span>
          {["Drones", "Handhelds", "Enterprise", "Accessories"].map((cat) => (
            <Link
              key={cat}
              href={`/collections/${cat.toLowerCase()}`}
              className="px-3 py-1 rounded-full bg-gray-100 hover:bg-[#0071e3] hover:text-white transition-all font-medium text-gray-700"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-gray-100 p-4 bg-gray-50/50">
              <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-5 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 px-4 bg-gray-50 rounded-2xl border border-gray-100 max-w-2xl mx-auto my-8">
          <Sparkles className="w-12 h-12 text-[#0071e3] mx-auto mb-4 opacity-80" />
          <h2 className="text-xl font-bold text-[#121212] mb-2">No products found</h2>
          <p className="text-sm text-gray-500 mb-6">
            We couldn&apos;t find any products matching &ldquo;{q}&rdquo;. Try checking the spelling or browse our full collections.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/collections/drones"
              className="px-5 py-2.5 rounded-full bg-[#0071e3] text-white text-sm font-semibold hover:bg-[#0077ed] transition"
            >
              Browse Drones
            </Link>
            <Link
              href="/collections/handhelds"
              className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-800 text-sm font-semibold hover:bg-gray-50 transition"
            >
              Browse Handhelds
            </Link>
            <Link
              href="/collections/all"
              className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-800 text-sm font-semibold hover:bg-gray-50 transition"
            >
              All Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => {
            const img = p.mainImage || (p.images && p.images[0]) || "/placeholder.jpg";
            return (
              <Link
                key={p._id || p.slug}
                href={`/products/${p.slug}`}
                className="group flex flex-col rounded-2xl border border-[#e5e5ea] bg-white p-4 hover:shadow-xl hover:border-[#0071e3]/40 transition-all duration-300 relative overflow-hidden"
              >
                {/* Badge */}
                {p.badge && (
                  <span className="absolute top-3 left-3 z-10 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0071e3] text-white uppercase tracking-wider">
                    {p.badge}
                  </span>
                )}

                {/* Image */}
                <div className="aspect-square bg-[#f5f5f7] rounded-xl mb-4 p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={img}
                    alt={p.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0071e3] block mb-1">
                      {p.category || p.categorySlug}
                    </span>
                    <h2 className="text-sm font-bold text-[#121212] group-hover:text-[#0071e3] transition-colors line-clamp-2 leading-snug mb-2">
                      {p.name}
                    </h2>
                  </div>

                  <div className="pt-2 border-t border-gray-50 mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-[#121212]">
                        ${p.price.toLocaleString("en-AU", { minimumFractionDigits: 2 })} AUD
                      </span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ${p.originalPrice.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs mt-2 text-gray-500">
                      <span className={`font-semibold flex items-center gap-1 ${p.inStock ? "text-emerald-600" : "text-amber-600"}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {p.inStock ? "In Stock" : "Pre-order"}
                      </span>
                      <span className="font-medium text-[#0071e3] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                        Shop <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function SearchPage() {
  return (
    <StorefrontShell>
      <Suspense fallback={<div className="page-width py-20 text-sm text-gray-500 text-center">Loading search catalog…</div>}>
        <SearchInner />
      </Suspense>
    </StorefrontShell>
  );
}
