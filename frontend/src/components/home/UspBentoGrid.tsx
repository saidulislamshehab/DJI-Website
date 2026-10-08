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
    <section
      id="shopify-section-template--21396722843809__usp_bento_grid_bhbJDP"
      className="shopify-section section-usp-bento"
    >
      <div
        className="usp-bento page-width usp-bento--mobile-carousel"
        id="usp-bento-template--21396722843809__usp_bento_grid_bhbJDP"
      >
        <h2 className="usp-bento__heading text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px] font-bold tracking-[-0.03em] text-[#121212] leading-[1.15] mb-6 md:mb-8">
          Shop with Confidence at D1
        </h2>
        <div
          className="usp-bento__grid"
          data-carousel="true"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {uspCards.map((card, idx) => (
            <div
              key={idx}
              className="usp-bento__card usp-bento__card--image-fill"
            >
              <Link
                href={card.href}
                className="usp-bento__card-link"
                aria-label={card.title}
              >
                <div className="usp-bento__card-image usp-bento__card-image--fill">
                  <img
                    src={card.img}
                    alt={card.title}
                    loading="lazy"
                    width="541"
                    height="281"
                    style={{ aspectRatio: "1.9252669039145907" }}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="usp-bento__carousel-dots">
          {uspCards.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`usp-bento__carousel-dot ${activeDot === idx ? "is-active" : ""}`}
              onClick={() => scrollToDot(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
