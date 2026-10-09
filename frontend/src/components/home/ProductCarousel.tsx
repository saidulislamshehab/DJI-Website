"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { IProduct } from "@/types";

export interface FeaturedSpotlight {
  title: string;
  eyebrow?: string;
  price?: string;
  btnText?: string;
  btnHref?: string;
  img: string;
  video?: string | null;
}

interface ProductCarouselProps {
  sectionId?: string;
  sectionTitle: string;
  subtitle?: string;
  featured?: FeaturedSpotlight;
  products: IProduct[];
  viewAllHref?: string;
}

export default function ProductCarousel({
  sectionId,
  sectionTitle,
  featured,
  products,
}: ProductCarouselProps) {
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
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const offset = direction === "left" ? -400 : 400;
    trackRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section
      id={sectionId}
      className="shopify-section section-custom-product-carousel"
    >
      <div className="d1-home-carousel color-scheme-1 gradient pt-[27px] pb-[27px] md:pt-[36px] md:pb-[36px]">
        <div className="page-width">
          <div
            className={`d1-home-carousel__inner ${
              featured ? "d1-home-carousel__inner--with-featured" : ""
            }`}
            data-d1-home-carousel
          >
            {/* Header */}
            <div className="d1-home-carousel__header scroll-trigger animate--slide-in mb-3 md:mb-5 flex items-center justify-between">
              <h2 className="d1-home-carousel__title inline-richtext text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-[-0.03em] text-[#121212] leading-[1.15]">
                {sectionTitle}
              </h2>

              {/* If no featured banner, display nav buttons in the header aligned right */}
              {!featured && (
                <div className="d1-home-carousel__actions ml-auto">
                  <div className="d1-home-carousel__nav flex items-center gap-2">
                    <button
                      type="button"
                      className="d1-home-carousel__nav-btn d1-home-carousel__nav-btn--prev w-[44px] h-[44px] rounded-full flex items-center justify-center bg-[#007aff] text-white hover:bg-[#0066d6] shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-35 disabled:cursor-default"
                      onClick={() => scroll("left")}
                      disabled={!canScrollLeft}
                      aria-label={`Previous ${sectionTitle}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-[20px] h-[20px]"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="d1-home-carousel__nav-btn d1-home-carousel__nav-btn--next w-[44px] h-[44px] rounded-full flex items-center justify-center bg-[#007aff] text-white hover:bg-[#0066d6] shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-35 disabled:cursor-default"
                      onClick={() => scroll("right")}
                      disabled={!canScrollRight}
                      aria-label={`Next ${sectionTitle}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-[20px] h-[20px]"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Featured Spotlight Card */}
            {featured && (
              <div className="d1-home-carousel__featured d1-home-carousel__featured--has-overlay d1-home-carousel__featured--text-light scroll-trigger animate--slide-in relative">
                <div className="d1-home-carousel__featured-media">
                  {featured.video ? (
                    <video
                      className="d1-home-carousel__featured-video"
                      playsInline
                      autoPlay
                      loop
                      muted
                      preload="metadata"
                      poster={featured.img}
                      src={featured.video}
                    />
                  ) : (
                    <picture className="d1-home-carousel__featured-picture">
                      <img
                        src={featured.img}
                        alt={featured.title}
                        className="d1-home-carousel__featured-img"
                        loading="lazy"
                        width="3000"
                        height="1199"
                      />
                    </picture>
                  )}
                </div>

                <Link
                  className="d1-home-carousel__featured-link"
                  href={featured.btnHref || "#"}
                  aria-label={featured.title}
                >
                  &nbsp;
                </Link>

                <div className="d1-home-carousel__featured-overlay">
                  <div className="d1-home-carousel__featured-content">
                    {featured.eyebrow && (
                      <p className="d1-home-carousel__featured-eyebrow caption">
                        {featured.eyebrow}
                      </p>
                    )}
                    <h3 className="d1-home-carousel__featured-title h0">
                      {featured.title}
                    </h3>
                    {featured.price && (
                      <p className="d1-home-carousel__featured-price">
                        {featured.price}
                      </p>
                    )}
                    <Link
                      href={featured.btnHref || "#"}
                      className="d1-home-carousel__featured-btn"
                    >
                      {featured.btnText || "Shop now"}
                    </Link>
                  </div>
                </div>

                {/* Arrow buttons at the right side of the video */}
                <div className="d1-home-carousel__actions absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10 pointer-events-auto">
                  <div className="d1-home-carousel__nav flex items-center gap-2">
                    <button
                      type="button"
                      className="d1-home-carousel__nav-btn d1-home-carousel__nav-btn--prev w-[44px] h-[44px] rounded-full flex items-center justify-center bg-[#007aff] text-white hover:bg-[#0066d6] shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-35 disabled:cursor-default"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        scroll("left");
                      }}
                      disabled={!canScrollLeft}
                      aria-label={`Previous ${sectionTitle}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-[20px] h-[20px]"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="d1-home-carousel__nav-btn d1-home-carousel__nav-btn--next w-[44px] h-[44px] rounded-full flex items-center justify-center bg-[#007aff] text-white hover:bg-[#0066d6] shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-35 disabled:cursor-default"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        scroll("right");
                      }}
                      disabled={!canScrollRight}
                      aria-label={`Next ${sectionTitle}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-[20px] h-[20px]"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Product Cards Track */}
            <div
              className="d1-home-carousel__track"
              ref={trackRef}
              data-carousel-track
            >
              {products.map((p, idx) => {
                const hoverImage = (p.images && p.images.length > 1) ? p.images[1] : undefined;
                return (
                  <div
                    key={p._id || p.slug}
                    className="d1-home-carousel__card scroll-trigger animate--slide-in group/pcard transition-shadow duration-[850ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12)]"
                    style={{ "--animation-order": idx + 1 } as React.CSSProperties}
                  >
                    <Link
                      className="d1-home-carousel__card-link"
                      href={`/products/${p.slug}`}
                    >
                      <div
                        className={`d1-home-carousel__card-media ${
                          hoverImage
                            ? "d1-home-carousel__card-media--hover"
                            : ""
                        }`}
                      >
                        <img
                          src={p.mainImage}
                          alt={p.name}
                          className="d1-home-carousel__card-img transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu group-hover/pcard:scale-[1.04]"
                          loading="lazy"
                          width="800"
                          height="800"
                        />
                        {hoverImage && (
                          <img
                            src={hoverImage}
                            alt={p.name}
                            className="d1-home-carousel__card-img d1-home-carousel__card-img--hover transition-all duration-[1100ms] ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu group-hover/pcard:scale-[1.04]"
                            loading="lazy"
                            width="800"
                            height="800"
                          />
                        )}
                      </div>
                      <div className="d1-home-carousel__card-body p-4 sm:p-5">
                        <h3 className="d1-home-carousel__card-title inline-richtext text-[15px] sm:text-[16px] font-bold text-[#121212] leading-snug line-clamp-2">
                          {p.name}
                        </h3>
                        <div className="d1-home-carousel__price text-[14px] sm:text-[15px] font-bold text-[#121212] mt-1">
                          From $
                          {p.price.toLocaleString("en-AU", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <span className="d1-home-carousel__cta">
                          Shop now
                        </span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
