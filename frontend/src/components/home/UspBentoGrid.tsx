"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

const uspCards = [
  {
    title: "Aussie Stores & Support",
    href: "/pages/stores",
    img: "https://www.d1store.com.au/cdn/shop/t/22/assets/usp-bento-canvas-50.png?v=63115760567785364271788239895"
  },
  {
    title: "Fast Dispatch & Free Shipping",
    href: "/policies/shipping-policy",
    img: "https://www.d1store.com.au/cdn/shop/files/Asset_51-PNG.png?v=1777876125&width=800"
  },
  {
    title: "Up to 30 Day Returns",
    href: "/policies/refund-policy",
    img: "https://www.d1store.com.au/cdn/shop/t/22/assets/usp-bento-canvas-52.png?v=141652490730704708151788239895"
  },
  {
    title: "Price Match",
    href: "/pages/price-match",
    img: "https://www.d1store.com.au/cdn/shop/t/22/assets/usp-bento-canvas-53.png?v=4182411078873006701788239895"
  },
  {
    title: "Care Refresh Swaps",
    href: "/pages/care-refresh-activation",
    img: "https://www.d1store.com.au/cdn/shop/t/22/assets/usp-bento-canvas-54.png?v=85128613535464115311788239895"
  },
  {
    title: "Get DJI Expert Help",
    href: "/pages/support",
    img: "https://www.d1store.com.au/cdn/shop/files/Asset_55-PNG.png?v=1777876125&width=800"
  }
];

export default function UspBentoGrid() {
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, offsetWidth } = scrollRef.current;
    const index = Math.round(scrollLeft / (offsetWidth * 0.85));
    setActiveDot(Math.min(index, uspCards.length - 1));
  };

  const scrollToDot = (idx: number) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.offsetWidth * 0.85;
    scrollRef.current.scrollTo({ left: cardWidth * idx, behavior: "smooth" });
    setActiveDot(idx);
  };

  return (
    <section className="py-8 md:py-14 bg-white border-t border-gray-100">
      <div className="page-width">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#121212] mb-6 md:mb-8 text-left">
          Shop with Confidence at D1
        </h2>

        {/* Bento Grid: Desktop 3x2 or 6 columns, Mobile Carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory py-2 -my-2"
        >
          {uspCards.map((card, idx) => (
            <Link
              key={idx}
              href={card.href}
              className="flex-none w-[82vw] sm:w-[360px] md:w-auto rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border border-gray-100 snap-start block group"
              aria-label={card.title}
            >
              <div className="relative aspect-[1.925] w-full overflow-hidden bg-gray-50">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Carousel Dots */}
        <div className="flex md:hidden items-center justify-center space-x-2 mt-6">
          {uspCards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToDot(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeDot === idx ? "w-6 bg-[#0071e3]" : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to USP ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
