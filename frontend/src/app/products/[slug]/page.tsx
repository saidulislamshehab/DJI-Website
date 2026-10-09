"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fetchProductBySlug, fetchProducts, fetchProductReviewsApi } from "@/lib/api";
import { findStaticProduct, getStaticCatalog } from "@/lib/catalog";
import { IProduct, IReview, IReviewSummary } from "@/types";
import { useCart } from "@/context/CartContext";

// Modular Subcomponents
import ProductBreadcrumbs from "@/components/product/ProductBreadcrumbs";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchasePanel from "@/components/product/ProductPurchasePanel";
import ProductSectionNavigation from "@/components/product/ProductSectionNavigation";
import ProductOverview from "@/components/product/ProductOverview";
import ProductWhatsInTheBox from "@/components/product/ProductWhatsInTheBox";
import ProductSpecifications from "@/components/product/ProductSpecifications";
import ProductFAQ from "@/components/product/ProductFAQ";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProductsSection from "@/components/product/RelatedProductsSection";
import MobilePurchaseBar from "@/components/product/MobilePurchaseBar";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";

  // Initial state with fast static fallback
  const staticInitial = useMemo(() => findStaticProduct(slug), [slug]);
  const [product, setProduct] = useState<IProduct | null>(staticInitial || null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>(
    staticInitial?.mainImage || (staticInitial?.images && staticInitial.images[0]) || ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<string>("standard");
  const [inTheBoxTab, setInTheBoxTab] = useState<string>("standard");
  const [careRefreshPlan, setCareRefreshPlan] = useState<"none" | "1year" | "2year">("none");
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(!staticInitial);
  const [activeSection, setActiveSection] = useState<string>("overview");

  // Reviews state
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [reviewSummary, setReviewSummary] = useState<IReviewSummary>({
    averageRating: staticInitial?.rating || 4.9,
    totalReviews: staticInitial?.reviewCount || 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  const { addToCart } = useCart();

  // Scrollspy tracking for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "in-the-box", "specifications", "faqs", "reviews"];
      const scrollPosition = window.scrollY + 140;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll handler
  const scrollToSection = useCallback((id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  // Fetch full product and reviews from database
  useEffect(() => {
    async function loadData() {
      if (!staticInitial) setIsLoading(true);
      try {
        const [prod, reviewData] = await Promise.all([
          fetchProductBySlug(slug),
          fetchProductReviewsApi(slug),
        ]);

        const resolvedProd = prod || findStaticProduct(slug);

        if (resolvedProd) {
          setProduct(resolvedProd);
          setSelectedImage(resolvedProd.mainImage || (resolvedProd.images && resolvedProd.images[0]) || "");

          // In the box default tab
          if (resolvedProd.inTheBoxVariants && typeof resolvedProd.inTheBoxVariants === "object") {
            const keys = Object.keys(resolvedProd.inTheBoxVariants);
            if (keys.length > 0) {
              setInTheBoxTab(keys[0]);
            }
          }

          // Check if variant query param exists
          if (typeof window !== "undefined") {
            const queryVariant = new URLSearchParams(window.location.search).get("variant");
            if (queryVariant && resolvedProd.variants && resolvedProd.variants.length > 0) {
              const matched = resolvedProd.variants.find(
                (v: any) => v.variantId === queryVariant || v.sku === queryVariant || v.name === queryVariant
              );
              if (matched) {
                setSelectedVariant(matched.variantId || matched.name);
                if (matched.name.toLowerCase().includes("creator")) setInTheBoxTab("creator");
                else if (matched.name.toLowerCase().includes("vlog")) setInTheBoxTab("vlog");
                else setInTheBoxTab("standard");
              } else {
                setSelectedVariant(resolvedProd.variants[0].variantId || resolvedProd.variants[0].name);
              }
            } else if (resolvedProd.variants && resolvedProd.variants.length > 0) {
              setSelectedVariant(resolvedProd.variants[0].variantId || resolvedProd.variants[0].name);
            }
          }

          // Fetch related products
          const [relRes, colRes] = await Promise.all([
            fetchProducts({ category: resolvedProd.categorySlug, limit: 10 }).catch(() => ({ products: [] as IProduct[] })),
            fetchProducts({ collection: resolvedProd.categorySlug, limit: 10 }).catch(() => ({ products: [] as IProduct[] })),
          ]);

          const combined = [...(relRes.products || []), ...(colRes.products || [])];
          const unique = Array.from(new Map(combined.map((item) => [item.slug, item])).values())
            .filter((p) => p.slug !== slug);

          setRelatedProducts(
            unique.length > 0
              ? unique
              : getStaticCatalog().filter((p) => p.slug !== slug && p.categorySlug === resolvedProd.categorySlug)
          );
        }

        // Set reviews
        if (reviewData) {
          setReviews(reviewData.reviews || []);
          setReviewSummary(reviewData.summary);
        }
      } catch (err) {
        console.error("Error loading product detail:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [slug, staticInitial]);

  // Variant change handler
  const handleSelectVariant = useCallback((variantKey: string, variantId?: string) => {
    setSelectedVariant(variantKey);
    const lowerKey = variantKey.toLowerCase();
    if (lowerKey.includes("creator")) {
      setInTheBoxTab("creator");
    } else if (lowerKey.includes("vlog")) {
      setInTheBoxTab("vlog");
    } else {
      setInTheBoxTab("standard");
    }

    if (typeof window !== "undefined" && variantId) {
      const url = new URL(window.location.href);
      url.searchParams.set("variant", variantId);
      window.history.replaceState(null, "", url.toString());
    }
  }, []);

  // Compute active variant price & SKU
  const activeVariantObj = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find(
      (v: any) =>
        (v.variantId && v.variantId.toLowerCase() === selectedVariant.toLowerCase()) ||
        (v.name && v.name.toLowerCase() === selectedVariant.toLowerCase()) ||
        (v.sku && v.sku.toLowerCase() === selectedVariant.toLowerCase())
    );
  }, [product, selectedVariant]);

  const basePrice = activeVariantObj?.price ?? product?.price ?? 0;
  const careRefreshCost = careRefreshPlan === "1year" ? 59 : careRefreshPlan === "2year" ? 99 : 0;
  const currentPrice = basePrice + careRefreshCost;
  const originalPriceDisplay = product?.originalPrice ? product.originalPrice + careRefreshCost : undefined;
  const currentSku = activeVariantObj?.sku || product?.sku || "D1-GENUINE";
  const currentTitle = activeVariantObj?.name ? `${product?.name} (${activeVariantObj.name})` : (product?.name || "");

  // Add to Cart handler
  const handleAddToCart = useCallback(() => {
    if (!product) return;

    addToCart(
      {
        id: `${product._id || product.slug}-${selectedVariant}${careRefreshPlan !== "none" ? `-${careRefreshPlan}` : ""}`,
        productId: product._id,
        slug: product.slug,
        title: `${currentTitle} ${careRefreshPlan !== "none" ? `(+ DJI Care Refresh ${careRefreshPlan === "1year" ? "1-Year" : "2-Year"})` : ""}`.trim(),
        price: currentPrice,
        originalPrice: originalPriceDisplay || undefined,
        img: selectedImage || product.mainImage,
        subtitle: `${product.category} • SKU: ${currentSku}`,
      },
      quantity
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }, [product, selectedVariant, careRefreshPlan, currentTitle, currentPrice, originalPriceDisplay, selectedImage, currentSku, quantity, addToCart]);

  // Instant Buy Now handler
  const handleBuyNow = useCallback(() => {
    handleAddToCart();
    router.push("/checkout");
  }, [handleAddToCart, router]);

  // Handle new review added
  const handleReviewAdded = useCallback((newReview: IReview) => {
    setReviews((prev) => [newReview, ...prev]);
    setReviewSummary((prev) => {
      const newTotal = prev.totalReviews + 1;
      const newSum = prev.averageRating * prev.totalReviews + newReview.rating;
      const newAvg = Math.round((newSum / newTotal) * 10) / 10;
      const newDist = {
        ...prev.distribution,
        [newReview.rating]: (prev.distribution[newReview.rating as 1 | 2 | 3 | 4 | 5] || 0) + 1,
      };
      const newPct = {
        5: Math.round(((newDist[5] || 0) / newTotal) * 100),
        4: Math.round(((newDist[4] || 0) / newTotal) * 100),
        3: Math.round(((newDist[3] || 0) / newTotal) * 100),
        2: Math.round(((newDist[2] || 0) / newTotal) * 100),
        1: Math.round(((newDist[1] || 0) / newTotal) * 100),
      };
      return {
        averageRating: newAvg,
        totalReviews: newTotal,
        distribution: newDist,
        percentages: newPct,
      };
    });
  }, []);

  // Loading Skeleton State
  if (isLoading && !product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-[16px] md:px-[36px] py-[64px] flex flex-col items-center justify-center">
          <div className="w-[50px] h-[50px] border-[4px] border-[#0071e3] border-t-transparent rounded-full animate-spin mb-[16px]" />
          <p className="text-[15px] text-gray-500 font-bold">Loading product details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // 404 Not Found State
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-[16px] md:px-[36px] py-[96px] text-center">
          <h1 className="text-[32px] font-black text-[#121212] mb-[12px]">Product Not Found</h1>
          <p className="text-[16px] text-gray-500 mb-[24px]">
            The requested product does not exist or may have been retired from the catalog.
          </p>
          <Link
            href="/collections/all"
            className="inline-flex px-[32px] py-[12px] rounded-full bg-[#0071e3] text-white font-bold hover:bg-[#0058b8] transition-all"
          >
            Explore Catalog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#121212] selection:bg-[#0071e3] selection:text-white">
      <Header />

      <main className="flex-1 pb-[80px]">
        {/* Breadcrumb Navigation */}
        <ProductBreadcrumbs
          productName={product.name}
          category={product.category}
          categorySlug={product.categorySlug}
        />

        {/* PRIMARY SHOPPING HERO: Gallery (Left) & Purchase Box (Right) */}
        <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[32px] md:py-[48px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] lg:gap-[56px] items-start">
            {/* Left Column: Product Gallery */}
            <div className="lg:col-span-7">
              <ProductGallery
                productName={product.name}
                images={product.images || [product.mainImage]}
                mainImage={product.mainImage}
                videoUrl={product.overviewBanner?.videoUrl}
                selectedImage={selectedImage || product.mainImage}
                onSelectImage={setSelectedImage}
              />
            </div>

            {/* Right Column: Product Purchase Information Panel */}
            <div className="lg:col-span-5">
              <ProductPurchasePanel
                product={product}
                currentTitle={currentTitle}
                currentPrice={currentPrice}
                originalPriceDisplay={originalPriceDisplay}
                currentSku={currentSku}
                selectedVariant={selectedVariant}
                onSelectVariant={handleSelectVariant}
                careRefreshPlan={careRefreshPlan}
                onChangeCareRefresh={setCareRefreshPlan}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                isAdded={isAdded}
                averageRating={reviewSummary.averageRating}
                totalReviews={reviewSummary.totalReviews}
                onScrollToReviews={() => scrollToSection("reviews")}
              />
            </div>
          </div>
        </div>

        {/* STICKY SECTION SUB-NAVBAR */}
        <ProductSectionNavigation
          currentTitle={currentTitle}
          currentPrice={currentPrice}
          activeSection={activeSection}
          onScrollToSection={scrollToSection}
          onAddToCart={handleAddToCart}
          hasInTheBox={true}
          hasSpecs={true}
          hasFaqs={true}
          reviewsCount={reviewSummary.totalReviews}
        />

        {/* 1. PRODUCT OVERVIEW SECTION */}
        <ProductOverview product={product} />

        {/* 2. WHAT'S IN THE BOX SECTION */}
        <ProductWhatsInTheBox
          product={product}
          inTheBoxTab={inTheBoxTab}
          onSelectInTheBoxTab={setInTheBoxTab}
        />

        {/* 3. SPECIFICATIONS SECTION */}
        <ProductSpecifications product={product} />

        {/* 4. FREQUENTLY ASKED QUESTIONS SECTION */}
        <ProductFAQ product={product} />

        {/* 5. CUSTOMER REVIEWS SECTION */}
        <ProductReviews
          productSlug={product.slug}
          productName={product.name}
          reviews={reviews}
          summary={reviewSummary}
          onReviewAdded={handleReviewAdded}
        />

        {/* RELATED PRODUCTS & ACCESSORIES CAROUSEL */}
        <RelatedProductsSection
          products={relatedProducts}
          categoryName={product.category}
          categorySlug={product.categorySlug}
        />
      </main>

      {/* MOBILE STICKY BOTTOM PURCHASE BAR */}
      <MobilePurchaseBar
        title={currentTitle}
        price={currentPrice}
        image={selectedImage || product.mainImage}
        inStock={product.inStock}
        onAddToCart={handleAddToCart}
        isAdded={isAdded}
      />

      <Footer />
    </div>
  );
}
