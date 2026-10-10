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
import defaultSections from "@/lib/defaultSections.json";

const SECTION_SPOTLIGHTS: Record<string, FeaturedSpotlight> = {
  new_arrivals: {
    title: "Osmo Pocket 4P",
    eyebrow: "Dual Lens Gimbal Camera",
    price: "From $959",
    btnText: "Shop now",
    btnHref: "/products/osmo-pocket-4p",
    img: "https://www.d1store.com.au/cdn/shop/files/Osmo_Pocket_4P_Lifestyle03_Large_c96b7d2c-3fec-4d0f-9c86-768cf1ec23b0.jpg?v=1785468008&width=2400",
    video: "https://www.d1store.com.au/cdn/shop/videos/c/vp/bfeacdd152814075aa49a814df82e035/bfeacdd152814075aa49a814df82e035.HD-720p-3.0Mbps-88779845.mp4?v=0",
  },
  dji_drones: {
    title: "DJI Air 3S",
    eyebrow: "Dual-Camera Flagship",
    price: "From $1,699",
    btnText: "Shop now",
    btnHref: "/products/dji-air-3s",
    img: "https://www.d1store.com.au/cdn/shop/files/Lito_X1_Homepage.jpg?v=1783910988&width=2400",
    video: "https://www.d1store.com.au/cdn/shop/videos/c/vp/348baedfe0054ed0bb8959e7ad163964/348baedfe0054ed0bb8959e7ad163964.HD-720p-4.5Mbps-88779808.mp4?v=0",
  },
  pro_drones: {
    title: "DJI Mavic 4 Pro",
    eyebrow: "Triple-Lens Flagship",
    price: "From $3,099",
    btnText: "Shop now",
    btnHref: "/products/dji-mavic-4-pro",
    img: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-MAVIC4PRO-D1DO-04.jpg?v=1781751000",
    video: "https://cdn.d1store.app/shopify/Home-Page/Mavic%204%20Pro%20Homepage.mp4",
  },
  enterprise_agriculture: {
    title: "DJI Matrice 400",
    eyebrow: "Mission-Critical Power",
    price: "From $13,090",
    btnText: "Explore Enterprise",
    btnHref: "/collections/enterprise-agriculture",
    img: "https://www.d1store.com.au/cdn/shop/files/Matrice_400_Homepage.png?v=1785984441&width=2400",
    video: "https://cdn.d1store.app/shopify/Home-Page/Matrice%20400%20Homepage.mp4",
  },
};

export default function Home() {
  const [sections, setSections] = useState<IHomepageSection[]>(
    defaultSections as unknown as IHomepageSection[]
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const secRes = await fetchHomepageSections();
        if (active && secRes && secRes.length > 0) {
          setSections(secRes);
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
            featured={section.spotlight || section.featured || SECTION_SPOTLIGHTS[section.sectionKey]}
            products={section.products || []}
          />
        ))}
      </main>

      {/* 3. Comprehensive Official Footer */}
      <Footer />
    </div>
  );
}
