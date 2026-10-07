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
import { fetchHomepageSections, fetchProducts } from "@/lib/api";
import { IHomepageSection, IProduct } from "@/types";
import rawCarouselData from "@/data/product_carousels_data.json";

function mapCarouselItemToProduct(item: any, category: string, catSlug: string): IProduct {
  const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
  const slug = item.href ? item.href.replace(/^\/products\//, "") : `prod-${item.id}`;
  return {
    _id: `carousel-${catSlug}-${item.id}`,
    name: item.title,
    slug: slug,
    sku: `SKU-${catSlug}-${item.id}`,
    category: category,
    categorySlug: catSlug,
    price: numericPrice,
    description: item.title,
    features: [],
    specs: {},
    images: [item.primaryImg, item.hoverImg].filter(Boolean),
    mainImage: item.primaryImg,
    inStock: true,
    stockCount: 15,
    rating: 5.0,
    reviewCount: 12,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
  };
}

export default function Home() {
  const [sections, setSections] = useState<IHomepageSection[]>([]);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [secRes, prodRes] = await Promise.all([
          fetchHomepageSections().catch(() => []),
          fetchProducts({ limit: 50 }).catch(() => ({ products: [] })),
        ]);
        setSections(secRes || []);
        setAllProducts(prodRes.products || []);
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Helper to extract products for a category
  const getProductsForCategory = (catKey: keyof typeof rawCarouselData, catName: string, catSlug: string) => {
    const rawCategory = rawCarouselData[catKey];
    const staticProds = (rawCategory?.products || []).map((p: any) =>
      mapCarouselItemToProduct(p, catName, catSlug)
    );

    // Merge with any matching dynamic products from the API/database
    const dynamicProds = allProducts.filter(
      (p) =>
        p.categorySlug === catSlug ||
        p.category.toLowerCase().includes(catName.toLowerCase())
    );

    if (dynamicProds.length > 0) {
      // Avoid duplicate slugs
      const seen = new Set(dynamicProds.map((p) => p.slug));
      const filteredStatic = staticProds.filter((p) => !seen.has(p.slug));
      return [...dynamicProds, ...filteredStatic];
    }

    return staticProds;
  };

  const dronesProducts = getProductsForCategory("drones", "Drones", "dji-drones");
  const handheldsProducts = getProductsForCategory("handhelds", "Handhelds", "handheld-cameras");
  const enterpriseProducts = getProductsForCategory("enterprise", "Enterprise Drones", "enterprise-agriculture");
  const hasselbladProducts = getProductsForCategory("hasselblad", "Hasselblad", "hasselblad");

  // Spotlights from live D1 Store data
  const dronesSpotlight: FeaturedSpotlight = {
    title: rawCarouselData.drones.featured.title,
    eyebrow: rawCarouselData.drones.featured.eyebrow,
    price: rawCarouselData.drones.featured.price,
    btnText: "Shop now",
    btnHref: rawCarouselData.drones.featured.btnHref,
    img: rawCarouselData.drones.featured.img,
    video: rawCarouselData.drones.featured.video,
  };

  const handheldsSpotlight: FeaturedSpotlight = {
    title: rawCarouselData.handhelds.featured.title,
    eyebrow: rawCarouselData.handhelds.featured.eyebrow,
    price: rawCarouselData.handhelds.featured.price,
    btnText: "Shop now",
    btnHref: rawCarouselData.handhelds.featured.btnHref,
    img: rawCarouselData.handhelds.featured.img,
    video: "https://www.d1store.com.au/cdn/shop/videos/c/vp/bfeacdd152814075aa49a814df82e035/bfeacdd152814075aa49a814df82e035.HD-720p-3.0Mbps-88779845.mp4?v=0",
  };

  const enterpriseSpotlight: FeaturedSpotlight = {
    title: rawCarouselData.enterprise.featured.title,
    eyebrow: rawCarouselData.enterprise.featured.eyebrow,
    price: rawCarouselData.enterprise.featured.price,
    btnText: "Shop now",
    btnHref: rawCarouselData.enterprise.featured.btnHref,
    img: rawCarouselData.enterprise.featured.img,
    video: "https://cdn.d1store.app/shopify/Home-Page/Matrice%20400%20Homepage.mp4",
  };

  const hasselbladSpotlight: FeaturedSpotlight = {
    title: rawCarouselData.hasselblad.featured.title,
    eyebrow: rawCarouselData.hasselblad.featured.eyebrow,
    price: rawCarouselData.hasselblad.featured.price,
    btnText: "Shop now",
    btnHref: rawCarouselData.hasselblad.featured.btnHref,
    img: rawCarouselData.hasselblad.featured.img,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#121212] selection:bg-[#0071e3] selection:text-white w-full max-w-full overflow-x-clip">
      {/* 1. Header with TopBar, MainNav, SearchModal & CartDrawer */}
      <Header />

      {/* 2. Main Page Content - Exact 9 Sections Matching https://www.d1store.com.au/ */}
      <main id="MainContent" className="content-for-layout focus-none flex-1 w-full max-w-full overflow-x-clip" role="main" tabIndex={-1}>
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

        {/* Section 6: Product Carousel - Drones */}
        <ProductCarousel
          sectionId="shopify-section-template--21396722843809__custom_product_carousel_KmmgUG"
          sectionTitle="Drones"
          featured={dronesSpotlight}
          products={dronesProducts}
        />

        {/* Section 7: Product Carousel - Handhelds */}
        <ProductCarousel
          sectionId="shopify-section-template--21396722843809__custom_product_carousel_BkPgyn"
          sectionTitle="Handhelds"
          featured={handheldsSpotlight}
          products={handheldsProducts}
        />

        {/* Section 8: Product Carousel - Enterprise Drones */}
        <ProductCarousel
          sectionId="shopify-section-template--21396722843809__custom_product_carousel_yGhACA"
          sectionTitle="Enterprise Drones"
          featured={enterpriseSpotlight}
          products={enterpriseProducts}
        />

        {/* Section 9: Product Carousel - Hasselblad */}
        <ProductCarousel
          sectionId="shopify-section-template--21396722843809__custom_product_carousel_aWDJq6"
          sectionTitle="Hasselblad"
          featured={hasselbladSpotlight}
          products={hasselbladProducts}
        />
      </main>

      {/* 3. Comprehensive Official Footer */}
      <Footer />
    </div>
  );
}
