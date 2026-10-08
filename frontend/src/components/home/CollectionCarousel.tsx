"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

export interface CollectionItem {
  title: string;
  count: string;
  description: string;
  href: string;
  img: string;
  fallbackImg?: string;
}

const collectionItems: CollectionItem[] = [
  {
    title: "Just Landed",
    count: "5",
    description: "Shop the Latest from DJI",
    href: "/collections/just-landed",
    img: "/images/collections/just-landed.png",
    fallbackImg: "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_JustLanded_FA.png?v=1784185522&width=960",
  },
  {
    title: "DJI SDR Transmission 2",
    count: "1",
    description: "Versatile 4K Video Transceiver",
    href: "/collections/dji-sdr-transmission-2",
    img: "/images/collections/sdr-transmission-2.webp",
    fallbackImg: "https://www.d1store.com.au/cdn/shop/files/cat-thumb-sdr-transmission-2-v1.webp?v=1789646458&width=960",
  },
  {
    title: "Osmo 360 II",
    count: "1",
    description: "Unreal 8K 360 Video",
    href: "/collections/osmo-360-ii",
    img: "/images/collections/osmo-360-ii.webp",
    fallbackImg: "https://www.d1store.com.au/cdn/shop/files/cat-thumb-osmo36011-2026.webp?v=1788424158&width=960",
  },
  {
    title: "Osmo Pocket 4P",
    count: "2",
    description: "The Wait is Over!",
    href: "/collections/osmo-pocket-4p",
    img: "/images/collections/osmo-pocket-4p.jpg",
    fallbackImg: "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_Batch2_OsmoPocket4P_FA.jpg?v=1785398783&width=960",
  },
  {
    title: "DJI Mic Mini 2S",
    count: "4",
    description: "Capture Every Detail",
    href: "/collections/dji-mic-mini-2s",
    img: "/images/collections/mic-mini-2s.jpg",
    fallbackImg: "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_Batch2_MicMini2s_FA.jpg?v=1785897087&width=960",
  },
  {
    title: "Osmo Pocket 4",
    count: "2",
    description: "TikTok's Favourite Camera!",
    href: "/collections/osmo-pocket-4",
    img: "/images/collections/osmo-pocket-4.png",
    fallbackImg: "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_OsmoPocket4P_FA.png?v=1784185553&width=960",
  },
  {
    title: "DJI Mic Mini 2",
    count: "6",
    description: "New Wireless Microphone",
    href: "/collections/dji-mic-mini-2",
    img: "/images/collections/mic-mini-2.png",
    fallbackImg: "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_MicMini2_FA.png?v=1784185904&width=960",
  },
  {
    title: "DJI ROMO",
    count: "3",
    description: "Intelligent Robo Vacuum",
    href: "/collections/dji-romo",
    img: "/images/collections/romo.png",
    fallbackImg: "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_RomoP_FA.png?v=1784186433&width=960",
  },
];

export default function CollectionCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    const offset = direction === "left" ? -400 : 400;
    trackRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section
      id="shopify-section-template--21396722843809__collection_carousel_r94gBx"
      className="shopify-section section section-collection-carousel"
    >
      <div className="collection-carousel color-scheme-1 gradient pt-[27px] pb-[27px] md:pt-[36px] md:pb-[36px]">
        <div className="page-width">
          <div className="collection-carousel__header scroll-trigger animate--slide-in flex items-center justify-between mb-4 md:mb-6">
            <h2 className="collection-carousel__title inline-richtext text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px] font-bold tracking-[-0.03em] text-[#121212] leading-[1.15] m-0">
              What's New!
            </h2>
            <div className="collection-carousel__nav flex items-center gap-2">
              <button
                type="button"
                className="collection-carousel__nav-btn"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className="collection-carousel__nav-btn"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Next"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="collection-carousel__wrapper">
          <div className="collection-carousel__track" ref={trackRef} data-carousel-track>
            {collectionItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="group collection-carousel__card collection-carousel__card--below scroll-trigger animate--slide-in rounded-[20px] bg-white border border-[#e5e5ea]/80 shadow-xs hover:shadow-lg transition-all duration-300"
                style={{ "--animation-order": idx + 1 } as React.CSSProperties}
              >
                <div className="collection-carousel__card-image relative aspect-square overflow-hidden rounded-t-[20px] bg-white">
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    width={960}
                    height={960}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (item.fallbackImg && target.src !== item.fallbackImg) {
                        target.src = item.fallbackImg;
                      }
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="collection-carousel__card-content p-4 sm:p-5 pt-3 bg-white rounded-b-[20px]">
                  <h3 className="collection-carousel__card-title text-[17px] sm:text-[19px] font-bold text-[#121212] tracking-tight flex items-baseline gap-1.5 mb-1 leading-snug">
                    <span className="truncate">{item.title}</span>
                    <span className="collection-carousel__card-count text-[12px] font-semibold text-[#86868b] align-super select-none">
                      {item.count}
                    </span>
                  </h3>
                  <p className="collection-carousel__card-description text-[13px] sm:text-[14px] text-[#6e6e73] font-normal leading-normal truncate">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
