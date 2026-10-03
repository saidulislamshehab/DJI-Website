"use client";

import React from "react";
import Header from "@/components/layout/Header";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import CollectionCarousel from "@/components/home/CollectionCarousel";
import UspBentoGrid from "@/components/home/UspBentoGrid";
import ReviewsWidget from "@/components/home/ReviewsWidget";
import ProductCarousel from "@/components/home/ProductCarousel";
import CartTakeoffBar from "@/components/home/CartTakeoffBar";
import Footer from "@/components/layout/Footer";

import carouselsData from "@/data/product_carousels_data.json";

export default function Home() {
  const { drones, handhelds, enterprise, hasselblad } = carouselsData;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#121212] selection:bg-[#0071e3] selection:text-white">
      {/* 1. Header with TopBar, MainNav, SearchModal & CartDrawer */}
      <Header />

      {/* 2. Main Page Sections */}
      <main id="MainContent" className="flex-1">
        {/* Hero Slideshow */}
        <HeroSlideshow />

        {/* Floating Cart Take-Off Bar */}
        <CartTakeoffBar />

        {/* Category Carousel ("What's New! / Just Landed") */}
        <CollectionCarousel />

        {/* Shop with Confidence USP Bento Grid */}
        <UspBentoGrid />

        {/* Reviews.io / Trustpilot 4.9★ Customer Reviews Widget */}
        <ReviewsWidget />

        {/* Custom Product Carousel 1: Drones */}
        <ProductCarousel
          sectionTitle={drones.sectionTitle}
          featured={drones.featured}
          products={drones.products}
        />

        {/* Custom Product Carousel 2: Handhelds */}
        <ProductCarousel
          sectionTitle={handhelds.sectionTitle}
          featured={handhelds.featured}
          products={handhelds.products}
        />

        {/* Custom Product Carousel 3: Enterprise Drones */}
        <ProductCarousel
          sectionTitle={enterprise.sectionTitle}
          featured={enterprise.featured}
          products={enterprise.products}
        />

        {/* Custom Product Carousel 4: Hasselblad */}
        <ProductCarousel
          sectionTitle={hasselblad.sectionTitle}
          featured={hasselblad.featured}
          products={hasselblad.products}
        />
      </main>

      {/* 3. Comprehensive Official Footer */}
      <Footer />
    </div>
  );
}
