"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { fetchProducts } from "@/lib/api";
import { IProduct } from "@/types";

const popularSearches = [
  "Osmo Pocket 4P",
  "DJI Neo 2",
  "DJI Mavic 4 Pro",
  "DJI Mini 5 Pro",
  "Osmo Action 6",
  "DJI Mic Mini 2S",
  "DJI Avata 360",
  "Hasselblad X2D II",
];

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  // Handle ESC key and scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen, setIsSearchOpen]);

  // Initial load of trending/featured products from real database
  useEffect(() => {
    if (!isSearchOpen) return;

    let active = true;
    const loadInitial = async () => {
      try {
        setIsSearching(true);
        const res = await fetchProducts({ isFeatured: true, limit: 6 });
        if (active) {
          if (res.products && res.products.length > 0) {
            setProducts(res.products);
          } else {
            const fallback = await fetchProducts({ limit: 6 });
            if (active) setProducts(fallback.products || []);
          }
        }
      } catch (err) {
        console.error("Search modal initial fetch error:", err);
      } finally {
        if (active) setIsSearching(false);
      }
    };

    if (!query.trim()) {
      loadInitial();
    }

    return () => {
      active = false;
    };
  }, [isSearchOpen, query]);

  // Debounced live search against real database API
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    let active = true;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetchProducts({ search: trimmed, limit: 6 });
        if (active) {
          setProducts(res.products || []);
        }
      } catch (err) {
        console.error("Search query error:", err);
      } finally {
        if (active) setIsSearching(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex flex-col justify-start items-center animate-fade-in">
      <div
        className="absolute inset-0"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-4xl bg-white shadow-2xl rounded-b-2xl md:rounded-2xl mt-0 md:mt-16 overflow-hidden z-10 animate-slide-down max-h-[90vh] flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center gap-4">
          <Search className="w-6 h-6 text-[#0071e3] shrink-0" />
          <input
            type="text"
            placeholder="Search products, collections, categories..."
            className="w-full text-xl md:text-2xl font-medium outline-none border-none border-0 ring-0 focus:outline-none focus:ring-0 shadow-none appearance-none placeholder:text-gray-400 bg-transparent"
            style={{ border: "none", outline: "none", boxShadow: "none", background: "transparent" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                setIsSearchOpen(false);
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
              }
            }}
            autoFocus
          />
          {isSearching && (
            <Loader2 className="w-5 h-5 text-[#0071e3] animate-spin shrink-0" />
          )}
          {query && !isSearching && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-gray-400 hover:text-black transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-sm font-semibold text-gray-500 hover:text-black ml-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition"
          >
            Esc
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Quick Suggestions / Trending */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              <TrendingUp className="w-4 h-4 text-[#0071e3]" />
              <span>Trending Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3.5 py-1.5 rounded-full text-sm font-medium bg-[#f5f5f7] hover:bg-[#0071e3] hover:text-white transition-all text-[#121212]"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Product Results from Live Database */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              <span>{query.trim() ? "Search Results" : "Featured Products"}</span>
              {query.trim() && products.length > 0 && (
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="text-[#0071e3] hover:underline flex items-center gap-1 normal-case font-semibold text-xs"
                >
                  View all results
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {products.length === 0 && !isSearching ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm font-medium">No products found matching &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-gray-400 mt-1">Try searching for drones, combos, or handheld cameras.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {products.map((prod) => (
                  <Link
                    key={prod._id || prod.slug}
                    href={`/products/${prod.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-[#0071e3]/30 hover:bg-[#f5f5f7]/60 transition-all group"
                  >
                    <div className="w-16 h-16 bg-[#f5f5f7] rounded-lg overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                      <img
                        src={prod.mainImage || (prod.images && prod.images[0]) || "/placeholder.jpg"}
                        alt={prod.name}
                        className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-[#0071e3] uppercase truncate block">
                        {prod.category || prod.categorySlug}
                      </span>
                      <h4 className="text-sm font-bold text-[#121212] truncate group-hover:text-[#0071e3] transition-colors">
                        {prod.name}
                      </h4>
                      <span className="text-sm font-extrabold text-[#121212]">
                        ${prod.price.toLocaleString("en-AU", { minimumFractionDigits: 2 })} AUD
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0071e3] group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#f5f5f7] border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <span>Need help finding a product? Call (03) 9021 6668</span>
          <span className="font-semibold text-[#0071e3]">DJI Authorised Retail Store</span>
        </div>
      </div>
    </div>
  );
}
