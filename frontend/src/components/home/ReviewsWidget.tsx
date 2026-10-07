"use client";

import React, { useRef, useState, useEffect } from "react";
import { Star, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  product: string;
  comment: string;
  verified: boolean;
}

const sampleReviews: Review[] = [
  {
    id: 1,
    name: "Marcus L.",
    rating: 5,
    date: "2 days ago",
    product: "DJI Mavic 4 Pro Fly More Combo",
    comment: "Incredible service from the team at Chatswood D1 Store. Ordered online with express delivery and it arrived next day in Brisbane. The Mavic 4 Pro camera is unmatched!",
    verified: true
  },
  {
    id: 2,
    name: "Sarah T.",
    rating: 5,
    date: "4 days ago",
    product: "Osmo Pocket 4P Creator Combo",
    comment: "Best vlog camera ever made. The 1-inch sensor in low light is mind blowing. D1 provided official AU stock with full warranty.",
    verified: true
  },
  {
    id: 3,
    name: "David K.",
    rating: 5,
    date: "1 week ago",
    product: "DJI Neo 2 Fly More Combo",
    comment: "Such a fun little drone! Perfect for palm takeoff and following my mountain bike rides. Fast dispatch and excellent customer support from D1.",
    verified: true
  },
  {
    id: 4,
    name: "Liam O.",
    rating: 5,
    date: "1 week ago",
    product: "DJI Mic Mini 2S",
    comment: "Crystal clear audio for my interviews and TikToks. The range and noise canceling are top notch. 10/10 recommend buying from D1 Store.",
    verified: true
  },
  {
    id: 5,
    name: "Elena R.",
    rating: 5,
    date: "2 weeks ago",
    product: "Hasselblad X2D II 100C",
    comment: "Unbelievable medium format color science and resolution. The staff at the Brunswick store were so knowledgeable and helpful with lens choices.",
    verified: true
  },
  {
    id: 6,
    name: "James W.",
    rating: 5,
    date: "2 weeks ago",
    product: "DJI Air 3S Fly More Combo",
    comment: "Dual cameras are game changing for travel photography. The Care Refresh swap process was also seamless when I needed help. Best DJI retailer in Australia!",
    verified: true
  }
];

export default function ReviewsWidget() {
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
    const offset = direction === "left" ? -360 : 360;
    trackRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="py-[40px] md:py-[64px] bg-[#f5f5f7] border-t border-b border-gray-200/80">
      <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px]">
        {/* Header with 4.9 Rating Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-[24px] mb-[32px]">
          <div className="flex items-center gap-[16px]">
            <div className="bg-[#0071e3] text-white p-[16px] rounded-[16px] flex flex-col items-center justify-center shadow-lg shadow-blue-500/10 min-w-[120px]">
              <span style={{ fontSize: "36px" }} className="font-black leading-none">4.9</span>
              <div className="flex items-center gap-[2px] mt-[4px]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-[14px] h-[14px] fill-white text-white" />
                ))}
              </div>
              <span style={{ fontSize: "10px" }} className="uppercase font-bold tracking-wider mt-[4px] opacity-90">
                Verified Reviews
              </span>
            </div>

            <div>
              <h2 style={{ fontSize: "28px" }} className="font-black text-[#121212] tracking-tight">
                Customer Reviews
              </h2>
              <p style={{ fontSize: "14px" }} className="text-gray-500 font-medium">
                Rated 4.9/5 based on over 12,000+ verified Australian customer reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[8px]">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all ${
                canScrollLeft
                  ? "bg-[#0071e3] text-white hover:bg-[#0058b8] shadow-md"
                  : "border border-gray-300 text-gray-300 cursor-not-allowed bg-white"
              }`}
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-[20px] h-[20px]" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all ${
                canScrollRight
                  ? "bg-[#0071e3] text-white hover:bg-[#0058b8] shadow-md"
                  : "border border-gray-300 text-gray-300 cursor-not-allowed bg-white"
              }`}
              aria-label="Next reviews"
            >
              <ChevronRight className="w-[20px] h-[20px]" />
            </button>
          </div>
        </div>

        {/* Reviews Cards Carousel */}
        <div
          ref={trackRef}
          className="flex gap-[16px] md:gap-[24px] overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-[8px] -my-[8px]"
        >
          {sampleReviews.map((rev) => (
            <div
              key={rev.id}
              className="flex-none w-[300px] sm:w-[340px] md:w-[380px] bg-white p-[24px] rounded-[16px] shadow-sm border border-gray-100 flex flex-col justify-between snap-start"
            >
              <div>
                <div className="flex items-center justify-between mb-[12px]">
                  <div className="flex items-center gap-[2px]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-[16px] h-[16px] fill-[#0071e3] text-[#0071e3]" />
                    ))}
                  </div>
                  <span style={{ fontSize: "12px" }} className="text-gray-400 font-medium">
                    {rev.date}
                  </span>
                </div>

                <p style={{ fontSize: "14px" }} className="text-[#121212] leading-relaxed mb-[16px]">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-[16px] border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 style={{ fontSize: "14px" }} className="font-bold text-[#121212]">
                      {rev.name}
                    </h4>
                    <span style={{ fontSize: "11px" }} className="font-semibold text-[#0071e3] block truncate max-w-[220px]">
                      {rev.product}
                    </span>
                  </div>

                  {rev.verified && (
                    <div className="flex items-center gap-[4px] bg-emerald-50 px-[8px] py-[4px] rounded-md">
                      <ShieldCheck className="w-[14px] h-[14px] text-emerald-600" />
                      <span style={{ fontSize: "11px" }} className="font-bold text-emerald-600">Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
