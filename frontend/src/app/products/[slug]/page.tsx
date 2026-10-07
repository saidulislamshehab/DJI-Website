"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCarousel from "@/components/home/ProductCarousel";
import { fetchProductBySlug, fetchProducts } from "@/lib/api";
import { findStaticProduct, getStaticCatalog } from "@/lib/catalog";
import { IProduct } from "@/types";
import { useCart } from "@/context/CartContext";
import {
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Zap,
  Building2,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedBundle, setSelectedBundle] = useState<string>("standard");
  const [activeTab, setActiveTab] = useState<"features" | "specs" | "description">("features");
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const prod = (await fetchProductBySlug(slug)) || findStaticProduct(slug);
        if (prod) {
          setProduct(prod);
          setSelectedImage(prod.mainImage || (prod.images && prod.images[0]) || "");

          const relRes = await fetchProducts({
            category: prod.categorySlug,
            limit: 8,
          });
          const related =
            relRes.products.filter((p) => p.slug !== slug).length > 0
              ? relRes.products.filter((p) => p.slug !== slug)
              : getStaticCatalog().filter((p) => p.slug !== slug && p.categorySlug === prod.categorySlug);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Error loading product detail:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 max-w-[1400px] w-full mx-auto px-[16px] md:px-[36px] py-[80px] flex flex-col items-center justify-center">
          <div className="w-[48px] h-[48px] border-[4px] border-[#0071e3] border-t-transparent rounded-full animate-spin mb-[16px]" />
          <p style={{ fontSize: "14px" }} className="text-gray-500 font-bold">Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 max-w-[1400px] w-full mx-auto px-[16px] md:px-[36px] py-[96px] text-center">
          <h1 style={{ fontSize: "32px" }} className="font-black text-[#121212] mb-[12px]">Product Not Found</h1>
          <p style={{ fontSize: "16px" }} className="text-gray-500 mb-[24px]">
            The product you are looking for does not exist or may have been retired.
          </p>
          <Link
            href="/collections/all"
            style={{ fontSize: "16px" }}
            className="inline-flex px-[32px] py-[12px] rounded-full bg-[#0071e3] text-white font-bold hover:bg-[#0058b8] transition-all"
          >
            Browse All Drones
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const bundlePriceModifier = selectedBundle === "creator" ? 350 : selectedBundle === "flymore" ? 420 : 0;
  const currentPrice = product.price + bundlePriceModifier;
  const originalPriceDisplay = product.originalPrice ? product.originalPrice + bundlePriceModifier : null;
  const savings = originalPriceDisplay ? originalPriceDisplay - currentPrice : 0;

  const handleAddToCart = () => {
    addToCart(
      {
        id: `${product._id || product.slug}-${selectedBundle}`,
        productId: product._id,
        slug: product.slug,
        title: `${product.name} ${selectedBundle === "creator" ? "(Creator Combo)" : selectedBundle === "flymore" ? "(Fly More Combo)" : ""}`.trim(),
        price: currentPrice,
        originalPrice: originalPriceDisplay || undefined,
        img: selectedImage || product.mainImage,
        subtitle: `${product.category} • SKU: ${product.sku}`,
      },
      quantity
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const allImages = product.images && product.images.length > 0 ? product.images : [product.mainImage];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#121212] selection:bg-[#0071e3] selection:text-white">
      <Header />

      <main className="flex-1 pb-[64px]">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-gray-100 bg-[#fbfbfd]">
          <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[12px]">
            <nav style={{ fontSize: "13px" }} className="flex items-center gap-[8px] text-gray-500 font-medium">
              <Link href="/" className="hover:text-[#0071e3] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-[14px] h-[14px]" />
              <Link
                href={`/collections/${product.categorySlug}`}
                className="hover:text-[#0071e3] transition-colors capitalize"
              >
                {product.category}
              </Link>
              <ChevronRight className="w-[14px] h-[14px]" />
              <span className="text-[#121212] font-bold truncate max-w-[240px]">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[32px] md:py-[48px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] lg:gap-[48px]">
            {/* Left Column: Multi-Image Interactive Gallery */}
            <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-[16px]">
              {/* Thumbnail Selector */}
              {allImages.length > 1 && (
                <div className="flex md:flex-col gap-[12px] overflow-x-auto md:overflow-y-auto no-scrollbar md:w-[88px] flex-shrink-0">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-[72px] h-[72px] md:w-[80px] md:h-[80px] rounded-[12px] overflow-hidden bg-[#f5f5f7] border-[2px] transition-all flex items-center justify-center p-[8px] flex-shrink-0 ${
                        selectedImage === img
                          ? "border-[#0071e3] shadow-sm"
                          : "border-transparent hover:border-gray-300 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Featured Image Display */}
              <div className="relative flex-1 aspect-square bg-[#f8f8fa] rounded-[24px] overflow-hidden border border-gray-100 flex items-center justify-center p-[24px] sm:p-[40px] group">
                {product.badge && (
                  <span style={{ fontSize: "12px" }} className="absolute top-[20px] left-[20px] z-10 px-[12px] py-[6px] font-black tracking-wider rounded-[8px] bg-[#121212] text-white shadow-md">
                    {product.badge}
                  </span>
                )}
                <img
                  src={selectedImage || product.mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right Column: Product Purchasing Details */}
            <div className="lg:col-span-5 flex flex-col justify-start space-y-[24px]">
              
              {/* Product Badge / Title / Subtitle / Rating */}
              <div className="flex flex-col gap-[12px]">
                <div className="flex items-center gap-[8px]">
                  <span style={{ fontSize: "12px" }} className="font-black tracking-wider uppercase text-[#0071e3] bg-blue-50 px-[10px] py-[4px] rounded-[6px]">
                    Official Authorized Stock
                  </span>
                  <span style={{ fontSize: "12px" }} className="text-gray-400 font-semibold">SKU: {product.sku}</span>
                </div>

                <div>
                  <h1 style={{ fontSize: "32px" }} className="font-semibold tracking-tight text-[#121212] leading-[1.2]">
                    {product.name}
                  </h1>
                  {product.tagline && (
                    <p style={{ fontSize: "15px" }} className="text-gray-500 mt-[8px]">
                      {product.tagline}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-[8px]">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-[14px] h-[14px] ${
                          i < Math.floor(product.rating || 5)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "13px" }} className="font-bold text-[#121212]">
                    {product.rating?.toFixed(1) || "5.0"}
                  </span>
                  <span style={{ fontSize: "13px" }} className="text-gray-400">
                    ({product.reviewCount || 24} Verified Reviews)
                  </span>
                </div>
              </div>

              <div className="w-full h-[1px] bg-gray-100"></div>

              {/* Pricing Block */}
              <div className="flex flex-col gap-[8px]">
                <div className="flex items-baseline gap-[12px]">
                  <span style={{ fontSize: "32px" }} className="font-bold text-[#121212]">
                    ${currentPrice.toLocaleString()}.00 AUD
                  </span>
                  {originalPriceDisplay && originalPriceDisplay > currentPrice && (
                    <span style={{ fontSize: "15px" }} className="text-gray-400 line-through font-semibold">
                      ${originalPriceDisplay.toLocaleString()}.00
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <p style={{ fontSize: "13px" }} className="font-bold text-emerald-600">
                    Save ${savings.toLocaleString()} AUD today!
                  </p>
                )}
                <p style={{ fontSize: "12px" }} className="text-gray-500">Includes Australian GST • Free Shipping</p>
              </div>

              {/* Stock Status Box */}
              <div className="p-[16px] rounded-[12px] bg-[#eef8f2] border border-[#d1ebd9] flex items-center justify-between">
                <div className="flex items-center gap-[12px]">
                  <span className="w-[10px] h-[10px] rounded-full bg-emerald-500 animate-pulse" />
                  <div className="flex flex-col">
                    <span style={{ fontSize: "14px" }} className="font-semibold text-emerald-900">
                      {product.inStock ? "In Stock - Ready to Ship" : "Out of Stock"}
                    </span>
                    <span style={{ fontSize: "12px" }} className="text-emerald-700 mt-[2px]">
                      Dispatched from Melbourne Warehouse within 24 hours
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: "13px" }} className="font-bold text-emerald-800 text-right min-w-[80px]">
                  {product.stockCount} units available
                </span>
              </div>

              {/* Bundle / Package Selector */}
              <div className="flex flex-col gap-[12px]">
                <label style={{ fontSize: "14px" }} className="font-semibold text-[#121212]">Select Package / Bundle</label>
                <div className="grid grid-cols-2 gap-[12px]">
                  <button
                    type="button"
                    onClick={() => setSelectedBundle("standard")}
                    className={`p-[16px] rounded-[12px] border text-left transition-all ${
                      selectedBundle === "standard"
                        ? "border-[#0071e3] bg-blue-50/20 ring-[1px] ring-[#0071e3]"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div style={{ fontSize: "14px" }} className="font-semibold text-[#121212] mb-[4px]">Standard Pack</div>
                    <div style={{ fontSize: "12px" }} className="text-gray-500">Original in-box gear</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedBundle("creator")}
                    className={`p-[16px] rounded-[12px] border text-left transition-all ${
                      selectedBundle === "creator"
                        ? "border-[#0071e3] bg-blue-50/20 ring-[1px] ring-[#0071e3]"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div style={{ fontSize: "14px" }} className="font-semibold text-[#121212] mb-[4px]">Creator Combo (+ $350)</div>
                    <div style={{ fontSize: "12px" }} className="text-gray-500">Extra batteries & mic</div>
                  </button>
                </div>
              </div>

              {/* Quantity Selector & CTA Buttons */}
              <div className="flex flex-col gap-[12px]">
                <div className="flex items-center gap-[12px]">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-gray-300 rounded-[8px] bg-white h-[48px] px-[4px] w-[120px] flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-[36px] h-[40px] flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-[6px] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-[16px] h-[16px]" />
                    </button>
                    <span style={{ fontSize: "15px" }} className="flex-1 text-center font-semibold text-[#121212]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stockCount || 10, q + 1))}
                      className="w-[36px] h-[40px] flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-[6px] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-[16px] h-[16px]" />
                    </button>
                  </div>

                  {/* Primary Add to Cart Button */}
                  <button
                    type="button"
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                    style={{ fontSize: "15px" }}
                    className={`flex-1 h-[48px] rounded-[8px] font-semibold transition-all flex items-center justify-center gap-[8px] ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : product.inStock
                        ? "bg-[#121212] hover:bg-black text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle2 className="w-[18px] h-[18px]" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-[18px] h-[18px]" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Buy It Now */}
                <button
                  type="button"
                  disabled={!product.inStock}
                  onClick={handleBuyNow}
                  style={{ fontSize: "15px" }}
                  className="w-full h-[48px] rounded-[8px] bg-[#0071e3] hover:bg-[#0060c2] text-white font-semibold transition-all flex items-center justify-center gap-[8px]"
                >
                  <Zap className="w-[18px] h-[18px]" />
                  <span>Buy It Now</span>
                </button>
              </div>

              {/* D1 Store Trust Value Propositions */}
              <div className="pt-[16px] border-t border-gray-100 flex flex-wrap gap-y-[12px] gap-x-[16px] text-gray-600">
                <div className="flex items-center gap-[6px] w-[calc(50%-8px)]">
                  <Truck className="w-[16px] h-[16px] text-[#0071e3] flex-shrink-0" />
                  <span style={{ fontSize: "12px" }}>Free Express Delivery over $99</span>
                </div>
                <div className="flex items-center gap-[6px] w-[calc(50%-8px)]">
                  <ShieldCheck className="w-[16px] h-[16px] text-[#0071e3] flex-shrink-0" />
                  <span style={{ fontSize: "12px" }}>Official 2-Year Aussie Warranty</span>
                </div>
                <div className="flex items-center gap-[6px] w-[calc(50%-8px)]">
                  <RotateCcw className="w-[16px] h-[16px] text-[#0071e3] flex-shrink-0" />
                  <span style={{ fontSize: "12px" }}>14-Day Money Back Guarantee</span>
                </div>
                <div className="flex items-center gap-[6px] w-[calc(50%-8px)]">
                  <Building2 className="w-[16px] h-[16px] text-[#0071e3] flex-shrink-0" />
                  <span style={{ fontSize: "12px" }}>8 Stores Nationwide for Pickup</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs: Key Features, Specifications, Description */}
        <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] mt-[48px]">
          <div className="bg-white rounded-[16px] border border-gray-200 overflow-hidden shadow-sm">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200 bg-[#fbfbfd] px-[16px] md:px-[32px]">
              <button
                type="button"
                onClick={() => setActiveTab("features")}
                style={{ fontSize: "15px" }}
                className={`py-[16px] px-[16px] md:px-[24px] font-semibold border-b-[2px] transition-all cursor-pointer ${
                  activeTab === "features"
                    ? "border-[#0071e3] text-[#0071e3]"
                    : "border-transparent text-gray-500 hover:text-[#121212]"
                }`}
              >
                Key Features
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                style={{ fontSize: "15px" }}
                className={`py-[16px] px-[16px] md:px-[24px] font-semibold border-b-[2px] transition-all cursor-pointer ${
                  activeTab === "specs"
                    ? "border-[#0071e3] text-[#0071e3]"
                    : "border-transparent text-gray-500 hover:text-[#121212]"
                }`}
              >
                Technical Specifications
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("description")}
                style={{ fontSize: "15px" }}
                className={`py-[16px] px-[16px] md:px-[24px] font-semibold border-b-[2px] transition-all cursor-pointer ${
                  activeTab === "description"
                    ? "border-[#0071e3] text-[#0071e3]"
                    : "border-transparent text-gray-500 hover:text-[#121212]"
                }`}
              >
                Full Overview
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-[24px] md:p-[40px]">
              {activeTab === "features" && (
                <div className="flex flex-col gap-[16px]">
                  <h3 style={{ fontSize: "20px" }} className="font-bold text-[#121212]">Highlights & Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                    {product.features && product.features.length > 0 ? (
                      product.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-[12px] p-[16px] rounded-[12px] bg-[#f8f8fa]">
                          <CheckCircle2 className="w-[20px] h-[20px] text-[#0071e3] flex-shrink-0 mt-[2px]" />
                          <span style={{ fontSize: "14px" }} className="font-medium text-gray-800 leading-[1.4]">{feat}</span>
                        </div>
                      ))
                    ) : (
                      <p style={{ fontSize: "14px" }} className="text-gray-500">Official DJI features loaded from genuine firmware.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="flex flex-col gap-[16px]">
                  <h3 style={{ fontSize: "20px" }} className="font-bold text-[#121212]">Technical Specifications</h3>
                  {product.specs && Object.keys(product.specs).length > 0 ? (
                    <div className="border border-gray-100 rounded-[12px] overflow-hidden divide-y divide-gray-100">
                      {Object.entries(product.specs).map(([key, val]) => (
                        <div key={key} className="grid grid-cols-1 sm:grid-cols-3 p-[16px] hover:bg-[#fbfbfd]">
                          <span style={{ fontSize: "13px" }} className="font-bold text-gray-500 uppercase tracking-wide">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span style={{ fontSize: "14px" }} className="sm:col-span-2 font-medium text-[#121212]">
                            {String(val)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: "14px" }} className="text-gray-500">Contact D1 Store specialist team for custom enterprise payload specs.</p>
                  )}
                </div>
              )}

              {activeTab === "description" && (
                <div className="flex flex-col gap-[16px] max-w-[800px]">
                  <h3 style={{ fontSize: "20px" }} className="font-bold text-[#121212]">Product Overview</h3>
                  <p style={{ fontSize: "15px" }} className="text-gray-700 leading-[1.6]">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommended & Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-[48px]">
            <ProductCarousel
              sectionTitle="Recommended Accessories & Gear"
              subtitle="Pilots and creators also bought with this unit"
              products={relatedProducts}
              viewAllHref={`/collections/${product.categorySlug}`}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

