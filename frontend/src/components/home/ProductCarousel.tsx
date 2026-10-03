"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface ProductItem {
  id: number | string;
  title: string;
  price: string;
  href: string;
  cta?: string;
  primaryImg: string;
  hoverImg: string;
  badge?: string;
}

export interface FeaturedSpotlight {
  title: string;
  eyebrow: string;
  price: string;
  btnText: string;
  btnHref: string;
  img: string;
  video?: string | null;
}

interface ProductCarouselProps {
  sectionTitle: string;
  featured: FeaturedSpotlight;
  products: ProductItem[];
}

export default function ProductCarousel({
  sectionTitle,
  featured,
  products
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { addToCart } = useCart();

  const checkScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const track = trackRef.current;
    if (track) {
      track.addEventListener("scroll", checkScroll);
      return () => track.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const offset = direction === "left" ? -340 : 340;
    trackRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  const handleQuickAdd = (p: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Parse numeric price
    const numPrice = parseFloat(p.price.replace(/[^0-9.]/g, "")) || 499;
    addToCart({
      id: `${p.title}-${p.id}`,
      title: p.title,
      price: numPrice,
      img: p.primaryImg,
      subtitle: p.price
    });
  };

  return (
    <section className="py-8 md:py-14 bg-white border-t border-gray-100 overflow-hidden">
      <div className="page-width">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#121212]">
            {sectionTitle}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                canScrollLeft
                  ? "bg-[#0071e3] text-white hover:bg-[#0058b8] shadow-md"
                  : "border border-gray-200 text-gray-300 cursor-not-allowed bg-white"
              }`}
              aria-label={`Previous ${sectionTitle}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                canScrollRight
                  ? "bg-[#0071e3] text-white hover:bg-[#0058b8] shadow-md"
                  : "border border-gray-200 text-gray-300 cursor-not-allowed bg-white"
              }`}
              aria-label={`Next ${sectionTitle}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Outer Layout: Large Featured Hero Card + Carousel Track */}
        <div className="space-y-6">
          {/* Featured Spotlight Banner */}
          <div className="relative w-full aspect-[4/3] md:aspect-[3/1] md:max-h-[480px] rounded-3xl overflow-hidden bg-black group shadow-lg">
            {featured.video ? (
              <video
                src={featured.video}
                autoPlay
                loop
                muted
                playsInline
                poster={featured.img}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
            ) : (
              <img
                src={featured.img}
                alt={featured.title}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
            )}
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/30 md:to-transparent" />

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12 text-white">
              <div className="max-w-xl space-y-1.5 sm:space-y-2 md:space-y-3">
                {featured.eyebrow && (
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-blue-400">
                    {featured.eyebrow}
                  </span>
                )}
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight">
                  {featured.title}
                </h3>
                {featured.price && (
                  <p className="text-base sm:text-lg md:text-xl font-bold opacity-90 text-gray-200">
                    {featured.price}
                  </p>
                )}
                <div className="pt-2 sm:pt-3">
                  <Link
                    href={featured.btnHref}
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white text-black font-extrabold text-sm sm:text-base hover:bg-[#0071e3] hover:text-white transition-all duration-300 shadow-xl"
                  >
                    {featured.btnText || "Buy Now"}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Cards Track */}
          <div
            ref={trackRef}
            className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 -my-2"
          >
            {products.map((p) => (
              <div
                key={p.id}
                className="flex-none w-[240px] sm:w-[280px] md:w-[300px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group snap-start"
              >
                <Link href={p.href} className="block relative">
                  {/* Image container with hover transition */}
                  <div className="relative aspect-square w-full bg-[#f5f5f7] overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={p.primaryImg}
                      alt={p.title}
                      className="w-full h-full object-contain transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
                      loading="lazy"
                    />
                    <img
                      src={p.hoverImg || p.primaryImg}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-contain p-4 transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-1">
                    <h4 className="text-base font-bold text-[#121212] group-hover:text-[#0071e3] transition-colors truncate">
                      {p.title}
                    </h4>
                    <div className="text-sm font-extrabold text-[#121212]">
                      {p.price}
                    </div>
                  </div>
                </Link>

                {/* Quick Add CTA */}
                <div className="p-4 pt-0">
                  <button
                    onClick={(e) => handleQuickAdd(p, e)}
                    className="w-full py-2.5 px-4 rounded-full bg-[#f5f5f7] hover:bg-[#0071e3] text-[#121212] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{p.cta || "Shop now"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
