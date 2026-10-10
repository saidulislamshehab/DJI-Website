"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

const popularSearches = [
  "Osmo Pocket 4P",
  "DJI Neo 2",
  "DJI Mavic 4 Pro",
  "DJI Mini 5 Pro",
  "Osmo Action 6",
  "DJI Mic Mini 2S",
  "DJI Avata 360",
  "Hasselblad X2D II"
];

const sampleProducts = [
  {
    id: "p1",
    title: "DJI Mavic 4 Pro Fly More Combo",
    price: "$3,699.00",
    category: "Drones",
    img: "https://cdn.d1store.app/shopify/product-page-editor/assets/2d431330-99da-464d-9f0a-1815ed9aa61e/005-website-categoryimages-mavic4p-fa.webp",
    href: "/products/dji-mavic-4-pro"
  },
  {
    id: "p2",
    title: "Osmo Pocket 4P Creator Combo",
    price: "$1,199.00",
    category: "Handhelds",
    img: "https://cdn.d1store.app/shopify/product-page-editor/assets/2199914d-50ca-4726-83ac-36c929f5a850/005-website-categoryimages-batch2-osmopocket4p-fa.jpg",
    href: "/products/osmo-pocket-4p"
  },
  {
    id: "p3",
    title: "DJI Neo 2 Fly More Combo",
    price: "$499.00",
    category: "Drones",
    img: "https://cdn.d1store.app/shopify/product-page-editor/assets/c8150de7-006f-4f9b-84a4-526f5b082b97/005-website-categoryimages-neo2-fa.webp",
    href: "/products/dji-neo-2"
  },
  {
    id: "p4",
    title: "DJI Mini 5 Pro with DJI RC 2",
    price: "$1,349.00",
    category: "Drones",
    img: "https://cdn.d1store.app/shopify/product-page-editor/assets/619a4dc0-0846-4e64-9dd8-f30feb3937c5/cat-thumb-fis26-mini5pro-01-v1.webp",
    href: "/products/dji-mini-5-pro"
  }
];

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const [query, setQuery] = useState("");
  const router = useRouter();

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

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim()
    ? sampleProducts.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      )
    : sampleProducts;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex flex-col justify-start items-center animate-fade-in">
      <div
        className="absolute inset-0"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-4xl bg-white shadow-2xl rounded-b-2xl md:rounded-2xl mt-0 md:mt-16 overflow-hidden z-10 animate-slide-down max-h-[90vh] flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center gap-4">
          <Search className="w-6 h-6 text-[#0071e3]" />
          <input
            type="text"
            placeholder="Search products, collections, articles..."
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
          {query && (
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

          {/* Product Results */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Suggested Products
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredProducts.map((prod) => (
                <Link
                  key={prod.id}
                  href={prod.href}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-[#0071e3]/30 hover:bg-[#f5f5f7]/60 transition-all group"
                >
                  <div className="w-16 h-16 bg-[#f5f5f7] rounded-lg overflow-hidden flex-shrink-0 relative">
                    <img
                      src={prod.img}
                      alt={prod.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-[#0071e3] uppercase">
                      {prod.category}
                    </span>
                    <h4 className="text-sm font-bold text-[#121212] truncate group-hover:text-[#0071e3] transition-colors">
                      {prod.title}
                    </h4>
                    <span className="text-sm font-extrabold text-[#121212]">
                      {prod.price}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0071e3] group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
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
