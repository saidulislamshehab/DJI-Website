"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

export interface CollectionItem {
  title: string;
  count: string;
  description: string;
  href: string;
  img: string;
}

const collectionItems: CollectionItem[] = [
  {
    title: "Just Landed",
    count: "5",
    description: "Shop the Latest from DJI",
    href: "/collections/just-landed",
    img: "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_JustLanded_FA.png?v=1784185522&width=960"
  },
  {
    title: "DJI SDR Transmission 2",
    count: "1",
    description: "Versatile 4K Video Transceiver",
    href: "/collections/dji-sdr-transmission-2",
    img: "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_Batch2_SDR2_FA.jpg?v=1785398774&width=960"
  },
  {
    title: "Osmo 360 II",
    count: "1",
    description: "Unreal 8K 360 Video",
    href: "/collections/osmo-360-ii",
    img: "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_Batch2_Osmo360II_FA.jpg?v=1785398767&width=960"
  },
  {
    title: "Osmo Pocket 4P",
    count: "2",
    description: "The Wait is Over!",
    href: "/collections/osmo-pocket-4p",
    img: "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_Batch2_OsmoPocket4P_FA.jpg?v=1785398783&width=960"
  },
  {
    title: "DJI Mic Mini 2S",
    count: "4",
    description: "Capture Every Detail",
    href: "/collections/dji-mic-mini-2s",
    img: "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_Batch2_MicMini2s_FA.jpg?v=1785897087&width=960"
  },
  {
    title: "Osmo Pocket 4",
    count: "2",
    description: "TikTok's Favourite Camera!",
    href: "/collections/osmo-pocket-4",
    img: "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_OsmoPocket4P_FA.png?v=1784185553&width=960"
  },
  {
    title: "DJI Mic Mini 2",
    count: "6",
    description: "New Wireless Microphone",
    href: "/collections/dji-mic-mini-2",
    img: "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_MicMini2_FA.png?v=1784185904&width=960"
  },
  {
    title: "DJI ROMO",
    count: "3",
    description: "Intelligent Robo Vacuum",
    href: "/collections/dji-romo",
    img: "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_RomoP_FA.png?v=1784186433&width=960"
  }
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
          <div className="collection-carousel__header scroll-trigger animate--slide-in">
            <h2 className="collection-carousel__title inline-richtext h1">
              What's New!
            </h2>
            <div className="collection-carousel__nav">
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
                className="collection-carousel__card collection-carousel__card--below scroll-trigger animate--slide-in"
                style={{ "--animation-order": idx + 1 } as React.CSSProperties}
              >
                <div className="collection-carousel__card-image">
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    width="960"
                    height="960"
                  />
                </div>
                <div className="collection-carousel__card-content">
                  <h3 className="collection-carousel__card-title h2">
                    {item.title}
                    <span className="collection-carousel__card-count">{item.count}</span>
                  </h3>
                  <p className="collection-carousel__card-description">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
