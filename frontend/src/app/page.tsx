"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import CartTakeoffBar from "@/components/home/CartTakeoffBar";
import CollectionCarousel from "@/components/home/CollectionCarousel";
import UspBentoGrid from "@/components/home/UspBentoGrid";
import ReviewsWidget from "@/components/home/ReviewsWidget";
import ProductCarousel, { FeaturedSpotlight } from "@/components/home/ProductCarousel";
import Footer from "@/components/layout/Footer";
import { fetchHomepageSections } from "@/lib/api";
import { IHomepageSection } from "@/types";

const SECTION_SPOTLIGHTS: Record<string, FeaturedSpotlight> = {
  new_arrivals: {
    title: "DJI Osmo 360",
    eyebrow: "Next-Gen 360 Panoramic",
    price: "From $899",
    btnText: "Shop now",
    btnHref: "/products/osmo-360-ii",
    img: "https://www.d1store.com.au/cdn/shop/files/DJI-D1-Home-Page-Tile-Pocket-3.jpg?v=1730076939",
    video: "https://www.d1store.com.au/cdn/shop/videos/c/vp/bfeacdd152814075aa49a814df82e035/bfeacdd152814075aa49a814df82e035.HD-720p-3.0Mbps-88779845.mp4?v=0",
  },
  dji_drones: {
    title: "DJI Air 3S",
    eyebrow: "Dual-Camera Flagship",
    price: "From $1,699",
    btnText: "Shop now",
    btnHref: "/products/dji-air-3s",
    img: "https://www.d1store.com.au/cdn/shop/files/DJI-D1-Home-Page-Tile-Air-3S.jpg?v=1730076939",
    video: "https://www.d1store.com.au/cdn/shop/videos/c/vp/ca1ff206c3a647d6be350bc84d3d81b9/ca1ff206c3a647d6be350bc84d3d81b9.HD-720p-3.0Mbps-88779845.mp4?v=0",
  },
  pro_drones: {
    title: "DJI Mavic 3 Pro",
    eyebrow: "Triple-Camera Imaging Flagship",
    price: "From $2,299",
    btnText: "Shop now",
    btnHref: "/products/ex-demo-dji-mavic-3-pro",
    img: "https://www.d1store.com.au/cdn/shop/files/DJI-D1-Home-Page-Tile-Mavic-3-Pro.jpg?v=1730076939",
    video: null,
  },
  enterprise_agriculture: {
    title: "AGRAS & Matrice Enterprise",
    eyebrow: "Mission-Critical Power",
    price: "From $21,999",
    btnText: "Explore Enterprise",
    btnHref: "/collections/enterprise-agriculture",
    img: "https://www.d1store.com.au/cdn/shop/files/DJI-D1-Home-Page-Tile-Matrice-400.jpg?v=1730076939",
    video: "https://cdn.d1store.app/shopify/Home-Page/Matrice%20400%20Homepage.mp4",
  },
};

export default function Home() {
  const [sections, setSections] = useState<IHomepageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const secRes = await fetchHomepageSections();
        if (active) {
          setSections(secRes || []);
        }
      } catch (err) {
        console.error("Failed to load homepage sections:", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const enabledSections = sections.filter((s) => s.isEnabled !== false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#121212] selection:bg-[#0071e3] selection:text-white w-full max-w-full overflow-x-clip">
      {/* 1. Header with TopBar, MainNav, SearchModal & CartDrawer */}
      <Header />

      {/* 2. Main Page Content - Driven 100% by Database Homepage Sections */}
      <main
        id="MainContent"
        className="content-for-layout focus-none flex-1 w-full max-w-full overflow-x-clip"
        role="main"
        tabIndex={-1}
      >
        {/* Section 1: Hero Slideshow */}
        <HeroSlideshow />

        {/* Section 2: Floating Cart Take-Off Bar */}
        <CartTakeoffBar />

        {/* Section 3: Collection Carousel ("What's New!") */}
        <CollectionCarousel />

        {/* Section 4: Shop with Confidence USP Bento Grid */}
        <UspBentoGrid />

        {/* Section 5: Reviews.io / Trustpilot Customer Reviews Widget */}
        <ReviewsWidget />

        {/* Section 6+: Dynamic Database-Driven Carousels */}
        {enabledSections.map((section) => (
          <ProductCarousel
            key={section.sectionKey}
            sectionId={`section-${section.sectionKey}`}
            sectionTitle={section.title}
            subtitle={section.subtitle}
            featured={SECTION_SPOTLIGHTS[section.sectionKey]}
            products={section.products || []}
          />
        ))}
      </main>

      {/* 3. Comprehensive Official Footer */}
      <Footer />
    </div>
  );
}
