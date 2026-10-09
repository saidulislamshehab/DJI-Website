"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

export interface HeroSlide {
  id: number;
  heading?: string;
  eyebrow?: string;
  subheading?: string;
  btnText: string;
  btnHref: string;
  textColor?: string;
  imgDesktop?: string;
  imgMobile?: string;
  videoUrl?: string;
  poster?: string;
  isDockedBottom?: boolean;
}

const slidesData: HeroSlide[] = [
  {
    id: 0,
    heading: "",
    eyebrow: "",
    subheading: "",
    btnText: "Shop Now",
    btnHref: "/collections/dji-sale",
    textColor: "#ffffff",
    imgDesktop:
      "https://cdn.d1store.app/shopify/product-page-editor/assets/b404315c-ebb6-4301-85e4-8c3438d1f82c/003-saleevents-flyintospring-phase2-webbanner-desktop-2560x700px-sep26-fa.jpg",
    imgMobile:
      "https://cdn.d1store.app/shopify/product-page-editor/assets/f5ea6a36-8a16-463e-920c-243ab22a01fd/003-saleevents-flyintospring-phase2-webbanner-mobile-1170x1500px-sep26-fa.jpg",
    isDockedBottom: true,
  },
  {
    id: 1,
    heading: "Osmo Pocket 4P",
    eyebrow: "Dual Lens Gimbal Camera",
    subheading: "See More. Share More.",
    btnText: "Order Now",
    btnHref: "/products/osmo-pocket-4p",
    textColor: "#ffffff",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Pocket%204P%20Homepage%20Video.mp4",
    poster: "https://www.d1store.com.au/cdn/shop/files/Osmo_Pocket_4P_Product_KV.jpg?v=1784606000&width=1920",
  },
  {
    id: 2,
    heading: "Osmo 360 II",
    eyebrow: "8K 360° Camera",
    subheading: "Next Generation Video",
    btnText: "Available Now",
    btnHref: "/products/osmo-360-ii",
    textColor: "#ffffff",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Osmo%20360%20II%20Home%20Video.mp4",
    poster: "https://www.d1store.com.au/cdn/shop/files/Osmo_360_II_Homw.jpg?v=1788477098&width=1920",
  },
  {
    id: 3,
    heading: "DJI ROMO P2",
    eyebrow: "Intelligent Robot Vacuum",
    subheading: "$500 Off for Early Bird Purchases",
    btnText: "Order Now",
    btnHref: "/products/dji-romo-p2-water-tank-version",
    textColor: "#ffffff",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Romo%20P2%20Home%20Video.mp4",
    poster: "https://www.d1store.com.au/cdn/shop/files/Romo_P2_Home.webp?v=1788477314&width=1920",
  },
  {
    id: 4,
    heading: "DJI Mic Mini 2S",
    eyebrow: "Pro Wireless Mic for Creators",
    subheading: "Capture Every Detail",
    btnText: "Mic Up",
    btnHref: "/collections/dji-mic-mini-2s",
    textColor: "#ffffff",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Mic%20Mini%202S%20Home.mp4",
    poster:
      "https://cdn.d1store.app/shopify/product-page-editor/assets/1ffb3967-df39-4404-b903-88ee1b753cb7/003-launch-micmini2s-webbanner-desktop-2560x700px-jan26-fa.jpg",
  },
  {
    id: 5,
    heading: "Osmo Action 6",
    eyebrow: "Flagship Action Camera",
    subheading: "Jump into Action",
    btnText: "Shop Osmo Action 6",
    btnHref: "/products/osmo-action-6",
    textColor: "#ffffff",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Osmo-Action-6-Home-Page.mp4",
    poster:
      "https://cdn.d1store.app/shopify/product-page-editor/assets/69eb3c1a-2831-4fa3-b1d5-2e6f43e5e408/003-launch-osmoaction6-webbanner-desktop-2560x700px-jan26-fa.jpg",
  },
  {
    id: 6,
    heading: "DJI Mavic 4 Pro",
    eyebrow: "Triple-Lens Flagship",
    subheading: "Spin Your World",
    btnText: "Shop Mavic 4 Pro",
    btnHref: "/products/dji-mavic-4-pro",
    textColor: "#ffffff",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Mavic%204%20Pro%20Homepage.mp4",
    poster:
      "https://cdn.d1store.app/shopify/product-page-editor/assets/941ba0da-246e-440e-b7d5-d0693510e1ea/003-launch-mavic4pro-webbanner-desktop-2560x700px-nov25-fa.jpg",
  },
];

const CLONES_COUNT = 2;
const SLIDE_DURATION = 7000;

// Create extended slides array with 2 prepended and 2 appended clones for seamless infinite looping
const extendedSlides: HeroSlide[] = [
  slidesData[slidesData.length - 2],
  slidesData[slidesData.length - 1],
  ...slidesData,
  slidesData[0],
  slidesData[1],
];

export default function HeroSlideshow() {
  const [trackIndex, setTrackIndex] = useState(CLONES_COUNT);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [dotKey, setDotKey] = useState(0);

  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Real active index (0 to slidesData.length - 1)
  const realActiveIndex = (trackIndex - CLONES_COUNT + slidesData.length) % slidesData.length;

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setTrackIndex((prev) => prev + 1);
    setDotKey((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setTrackIndex((prev) => prev - 1);
    setDotKey((prev) => prev + 1);
  }, []);

  const goToSlide = (targetRealIndex: number) => {
    setIsTransitioning(true);
    setTrackIndex(targetRealIndex + CLONES_COUNT);
    setDotKey((prev) => prev + 1);
  };

  // Autoplay timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Seamless jump when transitioning into clones
  const handleTransitionEnd = () => {
    if (trackIndex >= slidesData.length + CLONES_COUNT) {
      setIsTransitioning(false);
      setTrackIndex(CLONES_COUNT + (trackIndex - (slidesData.length + CLONES_COUNT)));
    } else if (trackIndex < CLONES_COUNT) {
      setIsTransitioning(false);
      setTrackIndex(slidesData.length + trackIndex);
    }
  };

  // Play active slide video, pause others
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([idxStr, video]) => {
      const idx = Number(idxStr);
      if (!video) return;
      if (idx === trackIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [trackIndex]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      nextSlide();
    } else if (distance < -45) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      id="shopify-section-template--21396722843809__hero_slideshow_KeeeeG"
      className={`shopify-section hero-slideshow-section select-none ${isPaused ? "is-paused" : ""}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        id="hero-slideshow-template--21396722843809__hero_slideshow_KeeeeG"
        className="hero-slideshow"
        data-autoplay={!isPaused}
        data-speed="7"
        style={{
          "--desktop-height": "680px",
          "--mobile-height": "500px",
        } as React.CSSProperties}
      >
        {/* Floating Side Navigation Chevrons for switching between videos */}
        <button
          type="button"
          className="hero-slideshow__floating-arrow hero-slideshow__floating-arrow--prev"
          onClick={prevSlide}
          aria-label="Previous video/slide"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          type="button"
          className="hero-slideshow__floating-arrow hero-slideshow__floating-arrow--next"
          onClick={nextSlide}
          aria-label="Next video/slide"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Side Hit Areas (Clicking the peeking boxes switches slides) */}
        <button
          type="button"
          className="hero-slideshow__side-hit hero-slideshow__side-hit--prev"
          onClick={prevSlide}
          aria-label="Previous Slide"
        />
        <button
          type="button"
          className="hero-slideshow__side-hit hero-slideshow__side-hit--next"
          onClick={nextSlide}
          aria-label="Next Slide"
        />

        {/* Viewport & Sliding Track */}
        <div className="hero-slideshow__viewport" data-hero-slideshow-viewport>
          <div
            className="hero-slideshow__track"
            data-hero-slideshow-track
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(calc(50vw - (var(--hero-slide-width) / 2) - ${trackIndex} * (var(--hero-slide-width) + var(--hero-slide-gap))))`,
              transition: isTransitioning
                ? "transform 550ms cubic-bezier(0.25, 1, 0.5, 1)"
                : "none",
            }}
          >
            {extendedSlides.map((slide, index) => {
              const isActive = index === trackIndex;
              const isPrevPeek = index === trackIndex - 1;
              const isNextPeek = index === trackIndex + 1;

              return (
                <div
                  key={`${slide.id}-${index}`}
                  className={`hero-slideshow__slide ${isActive ? "is-active" : ""}`}
                  data-index={index}
                  onClick={() => {
                    if (isPrevPeek) prevSlide();
                    if (isNextPeek) nextSlide();
                  }}
                  style={{
                    "--hero-text-color": slide.textColor || "#ffffff",
                    cursor: isActive ? "default" : "pointer",
                  } as React.CSSProperties}
                >
                  {/* Media (Video or Image) */}
                  <div className="hero-slideshow__media">
                    {slide.videoUrl ? (
                      <>
                        <video
                          ref={(el) => {
                            videoRefs.current[index] = el;
                          }}
                          className="hero-slideshow__video"
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          poster={slide.poster}
                          src={slide.videoUrl}
                        />
                        <div className="hero-slideshow__overlay hero-slideshow__overlay--video" />
                      </>
                    ) : (
                      <picture>
                        {slide.imgMobile && (
                          <source
                            media="(max-width: 749px)"
                            srcSet={slide.imgMobile}
                          />
                        )}
                        <img
                          className="hero-slideshow__image"
                          src={slide.imgDesktop}
                          alt={slide.heading || "Banner"}
                          width="2560"
                          height="1080"
                          loading="eager"
                        />
                      </picture>
                    )}
                  </div>

                  {/* Active Slide Link Overlay */}
                  {isActive && (
                    <Link
                      className="hero-slideshow__slide-link"
                      href={slide.btnHref}
                      tabIndex={0}
                      aria-label={slide.heading || slide.btnText}
                    >
                      &nbsp;
                    </Link>
                  )}

                  {/* Slide Content & Buttons */}
                  {slide.isDockedBottom ? (
                    <div className="hero-slideshow__cta-dock hero-slideshow__cta-dock--bottom-center hero-slideshow__cta-align-m--center">
                      <div className="hero-slideshow__cta-group hero-slideshow__cta-align-m--center">
                        <Link
                          className="hero-slideshow__button hero-slideshow__button--solid hero-slideshow__button--lg"
                          href={slide.btnHref}
                          tabIndex={isActive ? 0 : -1}
                        >
                          {slide.btnText}
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="hero-slideshow__content hero-slideshow__content--center-left hero-slideshow__content-m--center-center">
                      <div className="hero-slideshow__content-box">
                        <div className="hero-slideshow__text-group">
                          {slide.eyebrow && (
                            <p className="hero-slideshow__eyebrow hero-slideshow__eyebrow--lg">
                              {slide.eyebrow}
                            </p>
                          )}
                          {slide.heading && (
                            <h2 className="hero-slideshow__heading hero-slideshow__heading--lg">
                              {slide.heading}
                            </h2>
                          )}
                          {slide.subheading && (
                            <p className="hero-slideshow__subheading hero-slideshow__subheading--md">
                              {slide.subheading}
                            </p>
                          )}
                        </div>
                        <div className="hero-slideshow__cta-group hero-slideshow__cta-align-m--center">
                          <Link
                            className="hero-slideshow__button hero-slideshow__button--solid hero-slideshow__button--lg"
                            href={slide.btnHref}
                            tabIndex={isActive ? 0 : -1}
                          >
                            {slide.btnText}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hero Slideshow Navigation Controls (Centered dots pill) */}
        <div className="hero-slideshow__nav" aria-label="Slideshow Controls">
          {/* Frosted Glass Carousel Dots Pill */}
          <div className="hero-slideshow__dots">
            {slidesData.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`hero-slideshow__dot ${
                  idx === realActiveIndex ? "is-active" : ""
                }`}
                onClick={() => goToSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
              >
                <span
                  key={idx === realActiveIndex ? `fill-${realActiveIndex}-${dotKey}` : undefined}
                  className="hero-slideshow__dot-fill"
                  style={{
                    animationDuration: `${SLIDE_DURATION}ms`,
                  }}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
