"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    href: "/collections/dji-just-landed",
    img: "https://www.d1store.com.au/cdn/shop/files/005_Website_CategoryImages_Batch2_JustLanded_FA.jpg?v=1785398759&width=960"
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
    const offset = direction === "left" ? -380 : 380;
    trackRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="py-8 md:py-12 bg-white overflow-hidden">
      <div className="page-width">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#121212]">
            What's New!
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
              aria-label="Previous categories"
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
              aria-label="Next categories"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Track */}
        <div
          ref={trackRef}
          className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 -my-2"
        >
          {collectionItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex-none w-[280px] sm:w-[320px] md:w-[340px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group snap-start flex flex-col"
            >
              {/* Image Aspect 1:1 */}
              <div className="relative aspect-square w-full bg-[#f5f5f7] overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg md:text-xl font-extrabold text-[#121212] group-hover:text-[#0071e3] transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-xs font-bold text-gray-400">
                      {item.count}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
