"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fetchProductBySlug, fetchProducts, fetchProductReviewsApi } from "@/lib/api";
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

interface ProductDetailClientProps {
  slug: string;
  initialProduct: IProduct | null;
  initialReviews?: IReview[];
  initialReviewSummary?: IReviewSummary;
}

export default function ProductDetailClient({
  slug,
  initialProduct,
  initialReviews = [],
  initialReviewSummary,
}: ProductDetailClientProps) {
  const router = useRouter();

  const [product, setProduct] = useState<IProduct | null>(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>(
    initialProduct?.mainImage || (initialProduct?.images && initialProduct.images[0]) || ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<string>("standard");
  const [inTheBoxTab, setInTheBoxTab] = useState<string>("standard");
  const [careRefreshPlan, setCareRefreshPlan] = useState<"none" | "1year" | "2year">("none");
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [activeSection, setActiveSection] = useState<string>("overview");

  // Reviews state initialized with server data
  const [reviews, setReviews] = useState<IReview[]>(initialReviews);
  const [reviewSummary, setReviewSummary] = useState<IReviewSummary>(
    initialReviewSummary || {
      averageRating: initialProduct?.rating || 4.9,
      totalReviews: initialProduct?.reviewCount || 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  );

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

  // Sync initial product defaults if present
  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setSelectedImage(initialProduct.mainImage || (initialProduct.images && initialProduct.images[0]) || "");

      if (initialProduct.inTheBoxVariants && typeof initialProduct.inTheBoxVariants === "object") {
        const keys = Object.keys(initialProduct.inTheBoxVariants);
        if (keys.length > 0) {
          setInTheBoxTab(keys[0]);
        }
      }

      if (typeof window !== "undefined") {
        const queryVariant = new URLSearchParams(window.location.search).get("variant");
        if (queryVariant && initialProduct.variants && initialProduct.variants.length > 0) {
          const matched = initialProduct.variants.find(
            (v: any) => v.id === queryVariant || v.variantId === queryVariant || v.sku === queryVariant || v.name === queryVariant
          );
          if (matched) {
            setSelectedVariant(matched.id || matched.variantId || matched.name);
            if (matched.name.toLowerCase().includes("creator")) setInTheBoxTab("creator-128gb");
            else if (matched.name.toLowerCase().includes("128gb")) setInTheBoxTab("standard-128gb");
            else setInTheBoxTab("standard-64gb");
          } else {
            setSelectedVariant(initialProduct.variants[0].id || initialProduct.variants[0].variantId || initialProduct.variants[0].name);
          }
        } else if (initialProduct.variants && initialProduct.variants.length > 0) {
          setSelectedVariant(initialProduct.variants[0].id || initialProduct.variants[0].variantId || initialProduct.variants[0].name);
        }
      }
    }
  }, [initialProduct]);

  // Client-side refresh to always get fresh stock count and reviews from database
  useEffect(() => {
    async function loadClientData() {
      if (!initialProduct) {
        setIsLoading(true);
      }
      try {
        const [prod, reviewData] = await Promise.all([
          fetchProductBySlug(slug),
          fetchProductReviewsApi(slug),
        ]);

        if (prod) {
          setProduct((prev) => ({
            ...(prev || prod),
            ...prod,
            stockCount: prod.stockCount,
            inStock: prod.inStock,
          }));

          if (!initialProduct) {
            setSelectedImage(prod.mainImage || (prod.images && prod.images[0]) || "");

            if (prod.inTheBoxVariants && typeof prod.inTheBoxVariants === "object") {
              const keys = Object.keys(prod.inTheBoxVariants);
              if (keys.length > 0) {
                setInTheBoxTab(keys[0]);
              }
            }

            if (prod.variants && prod.variants.length > 0) {
              setSelectedVariant(prod.variants[0].id || prod.variants[0].variantId || prod.variants[0].name);
            }
          }
        }

        if (reviewData) {
          setReviews(reviewData.reviews || []);
          setReviewSummary(reviewData.summary);
        }

        // Fetch related products
        const currentCategory = initialProduct?.categorySlug || prod?.categorySlug || product?.categorySlug;
        if (currentCategory) {
          try {
            const [relRes, colRes] = await Promise.all([
              fetchProducts({ category: currentCategory, limit: 10 }).catch(() => ({ products: [] as IProduct[] })),
              fetchProducts({ collection: currentCategory, limit: 10 }).catch(() => ({ products: [] as IProduct[] })),
            ]);

            const combined = [...(relRes.products || []), ...(colRes.products || [])];
            const unique = Array.from(new Map(combined.map((item) => [item.slug, item])).values()).filter(
              (p) => p.slug !== slug
            );
            setRelatedProducts(unique.slice(0, 8));
          } catch (e) {
            console.warn("Related products fetch notice:", e);
          }
        }
      } catch (err) {
        console.error("Error loading product detail client-side:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadClientData();
  }, [slug, initialProduct]);

  // Variant change handler
  const handleSelectVariant = useCallback((variantKey: string, variantId?: string) => {
    setSelectedVariant(variantKey);
    const lowerKey = variantKey.toLowerCase();
    if (lowerKey.includes("creator")) {
      setInTheBoxTab("creator-128gb");
    } else if (lowerKey.includes("128gb")) {
      setInTheBoxTab("standard-128gb");
    } else {
      setInTheBoxTab("standard-64gb");
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
        (v.id && v.id.toLowerCase() === selectedVariant.toLowerCase()) ||
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

  // Loading Skeleton State (only when neither server nor client product is present yet)
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
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Product Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">
            The requested product does not exist or may have been retired from the catalog.
          </p>
          <Link
            href="/collections/all"
            className="inline-flex px-6 py-2.5 rounded-lg bg-[#0071e3] text-white text-sm font-semibold hover:bg-[#0058b8] transition-all shadow-sm"
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
                images={product.images && product.images.length > 0 ? product.images : [product.mainImage]}
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
        inStock={Boolean(product.inStock && (product.stockCount ?? 0) > 0)}
        onAddToCart={handleAddToCart}
        isAdded={isAdded}
      />

      <Footer />
    </div>
  );
}
