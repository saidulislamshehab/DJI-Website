"use client";

import React, { useState } from "react";

export default function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(4);
  const totalSlides = 7;

  return (
    <section className="w-full relative overflow-hidden bg-white">
      {/* Side peek strips — adjacent slides visible on edges */}
      <div className="absolute top-0 left-0 w-[48px] h-full z-10">
        <div className="w-full h-full bg-[#191919] rounded-r-[14px]" />
      </div>
      <div className="absolute top-0 right-0 w-[30px] h-full z-10">
        <div className="w-full h-full bg-[#262626] rounded-l-[14px]" />
      </div>

      {/* Main banner container */}
      <div className="relative" style={{ marginLeft: "48px", marginRight: "30px" }}>
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: "calc(100vh - 134px)",
            maxHeight: "640px",
            minHeight: "440px",
            borderRadius: "16px",
          }}
        >
          {/* Banner image */}
          <img
            src="/hero-banner.jpg"
            alt="DJI Drone flying over mountain landscape at sunset"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

          {/* Left-aligned text content */}
          <div
            className="absolute inset-0 flex flex-col justify-center"
            style={{ paddingLeft: "52px", paddingBottom: "80px" }}
          >
            {/* Subtitle */}
            <p className="text-white/80 text-[12px] font-bold tracking-[0.2em] uppercase mb-[10px]">
              Aerial Photography Redefined
            </p>

            {/* Main heading */}
            <h1
              className="text-white font-bold leading-[1.06] tracking-[-0.01em] mb-[10px]"
              style={{ fontSize: "52px" }}
            >
              DJI Mavic 3
              <br />
              Pro
            </h1>

            {/* Description */}
            <p className="text-white/70 text-[15px] font-normal mb-[22px] italic">
              See the Bigger Picture
            </p>

            {/* CTA Button */}
            <div>
              <button className="px-[22px] py-[10px] bg-white text-[#1a1a1a] text-[13px] font-medium border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300">
                Explore Now
              </button>
            </div>
          </div>

          {/* Left arrow */}
          <button
            onClick={() =>
              setActiveSlide(
                (prev) => (prev - 1 + totalSlides) % totalSlides
              )
            }
            className="absolute left-[10px] bottom-[18px] w-[36px] h-[36px] flex items-center justify-center text-white/50 hover:text-white transition-colors z-20"
            aria-label="Previous slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={() =>
              setActiveSlide((prev) => (prev + 1) % totalSlides)
            }
            className="absolute right-[10px] bottom-[18px] w-[36px] h-[36px] flex items-center justify-center text-white/50 hover:text-white transition-colors z-20"
            aria-label="Next slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>

          {/* Pagination dots */}
          <div className="absolute bottom-[24px] left-1/2 -translate-x-1/2 flex items-center gap-[6px] z-20">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === activeSlide
                    ? "w-[16px] h-[5px] bg-white"
                    : "w-[5px] h-[5px] bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
