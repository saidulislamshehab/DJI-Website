"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  Check,
  Package,
  Layers,
  HelpCircle,
  Sparkles,
  Camera,
  Battery,
  Sliders,
  Share2,
  Info,
  Percent,
  ChevronDown,
  ChevronUp,
  Tag,
  Gift,
  ExternalLink,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [careRefreshPlan, setCareRefreshPlan] = useState<"none" | "1year" | "2year">("none");
  const [selectedSpecTab, setSelectedSpecTab] = useState<string>("All");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
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

          // Fetch related products from database
          const [relRes, colRes] = await Promise.all([
            fetchProducts({ category: prod.categorySlug, limit: 12 }).catch(() => ({ products: [] as IProduct[] })),
            fetchProducts({ collection: prod.categorySlug, limit: 12 }).catch(() => ({ products: [] as IProduct[] })),
          ]);

          const combined = [...(relRes.products || []), ...(colRes.products || [])];
          const unique = Array.from(new Map(combined.map((item) => [item.slug, item])).values())
            .filter((p) => p.slug !== slug);

          setRelatedProducts(
            unique.length > 0
              ? unique
              : getStaticCatalog().filter((p) => p.slug !== slug && p.categorySlug === prod.categorySlug)
          );
        }
      } catch (err) {
        console.error("Error loading product detail:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  const tier = useMemo(() => {
    if (!product) return "product";
    if (product.tier) return product.tier;
    const name = (product.name || "").toLowerCase();
    if (/\b(combo|bundle)\b/i.test(name)) return "bundle";
    if (product.categorySlug?.includes("accessories") || /\b(tripod|battery|filter|case|cable|mount|strap|hub)\b/i.test(name)) {
      return "accessory";
    }
    return "product";
  }, [product]);

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
            Browse All Drones & Cameras
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const careRefreshCost = careRefreshPlan === "1year" ? 59 : careRefreshPlan === "2year" ? 99 : 0;
  const currentPrice = product.price + careRefreshCost;
  const originalPriceDisplay = product.originalPrice ? product.originalPrice + careRefreshCost : null;
  const savings = originalPriceDisplay ? originalPriceDisplay - currentPrice : 0;

  const handleAddToCart = () => {
    addToCart(
      {
        id: `${product._id || product.slug}${careRefreshPlan !== "none" ? `-${careRefreshPlan}` : ""}`,
        productId: product._id,
        slug: product.slug,
        title: `${product.name} ${careRefreshPlan !== "none" ? `(+ DJI Care Refresh ${careRefreshPlan === "1year" ? "1-Year" : "2-Year"})` : ""}`.trim(),
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

  // Specifications normalized
  const specsData = product.specs as Record<string, any> || {};
  const specCategories = Object.keys(specsData).length > 0
    ? ["All", ...Object.keys(specsData)]
    : ["All"];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#121212] selection:bg-[#0071e3] selection:text-white">
      <Header />

      <main className="flex-1 pb-[80px]">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-gray-100 bg-[#fbfbfd]">
          <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[14px]">
            <nav style={{ fontSize: "13px" }} className="flex items-center gap-[8px] text-gray-500 font-medium">
              <Link href="/" className="hover:text-[#0071e3] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-[14px] h-[14px]" />
              <Link
                href={`/collections/${product.categorySlug || "all"}`}
                className="hover:text-[#0071e3] transition-colors capitalize"
              >
                {product.category || "Collections"}
              </Link>
              <ChevronRight className="w-[14px] h-[14px]" />
              <span className="text-[#121212] font-bold truncate max-w-[280px]">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        {/* TOP SECTION: Interactive Media Gallery & Buy Box */}
        <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[32px] md:py-[48px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] lg:gap-[56px]">
            {/* Left Column: Gallery */}
            <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-[16px]">
              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex md:flex-col gap-[12px] overflow-x-auto md:overflow-y-auto no-scrollbar md:w-[88px] flex-shrink-0">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-[72px] h-[72px] md:w-[80px] md:h-[80px] rounded-[14px] overflow-hidden bg-[#f5f5f7] border-[2px] transition-all flex items-center justify-center p-[8px] flex-shrink-0 cursor-pointer ${
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

              {/* Main Image Display */}
              <div className="relative flex-1 aspect-square bg-[#f8f8fa] rounded-[24px] overflow-hidden border border-gray-100 flex items-center justify-center p-[24px] sm:p-[48px] group">
                <div className="absolute top-[20px] left-[20px] z-10 flex flex-wrap gap-[8px]">
                  {product.badge ? (
                    <span style={{ fontSize: "12px" }} className="px-[12px] py-[6px] font-black tracking-wider rounded-[8px] bg-[#121212] text-white shadow-xs">
                      {product.badge}
                    </span>
                  ) : tier === "bundle" ? (
                    <span style={{ fontSize: "12px" }} className="px-[12px] py-[6px] font-black tracking-wider rounded-[8px] bg-[#0071e3] text-white shadow-xs flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5" /> OFFICIAL BUNDLE
                    </span>
                  ) : tier === "accessory" ? (
                    <span style={{ fontSize: "12px" }} className="px-[12px] py-[6px] font-bold tracking-wider rounded-[8px] bg-[#f0f0f2] text-[#121212] shadow-xs">
                      GENUINE ACCESSORY
                    </span>
                  ) : null}
                  {savings > 0 && (
                    <span style={{ fontSize: "12px" }} className="px-[10px] py-[6px] font-black rounded-[8px] bg-emerald-600 text-white shadow-xs">
                      SAVE ${savings.toLocaleString()}
                    </span>
                  )}
                </div>

                <img
                  src={selectedImage || product.mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right Column: Sticky Purchasing Box */}
            <div className="lg:col-span-5 flex flex-col justify-start space-y-[24px]">
              {/* Product Header / SKU / Rating */}
              <div className="flex flex-col gap-[10px]">
                <div className="flex items-center gap-[8px] flex-wrap">
                  <span style={{ fontSize: "12px" }} className="font-bold tracking-wider uppercase text-[#0071e3] bg-blue-50 px-[10px] py-[4px] rounded-[6px]">
                    Authorised Australian Stock
                  </span>
                  <span style={{ fontSize: "12px" }} className="text-gray-400 font-semibold">
                    SKU: {product.sku}
                  </span>
                </div>

                <div>
                  <h1 style={{ fontSize: "32px" }} className="font-bold tracking-tight text-[#121212] leading-[1.2]">
                    {product.name}
                  </h1>
                  {product.tagline && (
                    <p style={{ fontSize: "15px" }} className="text-gray-500 mt-[6px] font-medium">
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
                    {Number(product.rating || 4.9).toFixed(1)}
                  </span>
                  <span style={{ fontSize: "13px" }} className="text-gray-400">
                    ({product.reviewCount || 24} Verified Reviews)
                  </span>
                </div>
              </div>

              <div className="w-full h-[1px] bg-gray-100" />

              {/* Pricing Block */}
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-baseline gap-[12px] flex-wrap">
                  <span style={{ fontSize: "32px" }} className="font-black text-[#121212]">
                    ${currentPrice.toLocaleString()}.00 AUD
                  </span>
                  {originalPriceDisplay && originalPriceDisplay > currentPrice && (
                    <span style={{ fontSize: "16px" }} className="text-gray-400 line-through font-semibold">
                      ${originalPriceDisplay.toLocaleString()}.00
                    </span>
                  )}
                  {savings > 0 && (
                    <span style={{ fontSize: "13px" }} className="font-bold px-[8px] py-[3px] rounded-[6px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Save ${savings.toLocaleString()} AUD
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "13px" }} className="text-gray-500">
                  Includes Australian GST • Free Express Courier Delivery
                </p>
                <div className="flex items-center gap-2 mt-1 text-[12px] text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="font-bold">or 4 interest-free payments of ${(currentPrice / 4).toFixed(2)} with</span>
                  <span className="font-black text-black">afterpay</span>
                  <span>or</span>
                  <span className="font-black text-[#3c3c3b]">zip</span>
                </div>
              </div>

              {/* Stock Status Box */}
              <div className="p-[16px] rounded-[14px] bg-[#f2f9f4] border border-[#d3ebd8] flex items-center justify-between">
                <div className="flex items-center gap-[12px]">
                  <span className="w-[10px] h-[10px] rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  <div className="flex flex-col">
                    <span style={{ fontSize: "14px" }} className="font-bold text-emerald-950">
                      {product.inStock ? "In Stock - Ready to Ship" : "Out of Stock"}
                    </span>
                    <span style={{ fontSize: "12px" }} className="text-emerald-800 mt-[1px]">
                      Dispatched within 24h • Click & Collect in 12+ stores
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: "13px" }} className="font-bold text-emerald-800 text-right min-w-[70px]">
                  {product.stockCount || 15} available
                </span>
              </div>

              {/* Variant / Edition Options (for Product or Bundle) */}
              {product.variants && product.variants.length > 0 && (
                <div className="flex flex-col gap-[10px]">
                  <label style={{ fontSize: "13px" }} className="font-bold uppercase tracking-wider text-gray-600">
                    Select Edition / Combo:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-[10px]">
                    {product.variants.map((v) => {
                      const isCurrent = v.slug === product.slug;
                      return (
                        <Link
                          key={v.slug}
                          href={`/products/${v.slug}`}
                          className={`p-[12px] rounded-[12px] border text-left transition-all ${
                            isCurrent
                              ? "border-[#0071e3] bg-blue-50/30 ring-[1px] ring-[#0071e3]"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div style={{ fontSize: "13px" }} className="font-bold text-[#121212] truncate">
                            {v.name}
                          </div>
                          <div style={{ fontSize: "12px" }} className="text-[#0071e3] font-bold mt-[2px]">
                            ${v.price.toLocaleString()}
                          </div>
                          {v.badge && (
                            <span style={{ fontSize: "10px" }} className="inline-block mt-[4px] px-[6px] py-[2px] rounded-[4px] bg-gray-100 font-bold text-gray-700">
                              {v.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Care Refresh Protection Selector (for Core Products and Bundles) */}
              {tier !== "accessory" && (
                <div className="p-[16px] rounded-[14px] bg-[#fafafc] border border-gray-200 flex flex-col gap-[12px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[8px]">
                      <ShieldCheck className="w-[18px] h-[18px] text-[#0071e3]" />
                      <span style={{ fontSize: "14px" }} className="font-bold text-[#121212]">
                        Protect Your {product.name.split(" ")[0]} with DJI Care Refresh
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-[8px]">
                    <button
                      type="button"
                      onClick={() => setCareRefreshPlan("none")}
                      className={`p-[10px] rounded-[10px] text-center border text-[13px] font-bold cursor-pointer transition-all ${
                        careRefreshPlan === "none"
                          ? "border-[#121212] bg-[#121212] text-white shadow-xs"
                          : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      No Protection
                    </button>
                    <button
                      type="button"
                      onClick={() => setCareRefreshPlan("1year")}
                      className={`p-[10px] rounded-[10px] text-center border text-[13px] font-bold cursor-pointer transition-all ${
                        careRefreshPlan === "1year"
                          ? "border-[#0071e3] bg-[#0071e3] text-white shadow-xs"
                          : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div>1-Year Plan</div>
                      <div className="text-[11px] opacity-90 font-medium">+ $59.00</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCareRefreshPlan("2year")}
                      className={`p-[10px] rounded-[10px] text-center border text-[13px] font-bold cursor-pointer transition-all ${
                        careRefreshPlan === "2year"
                          ? "border-[#0071e3] bg-[#0071e3] text-white shadow-xs"
                          : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div>2-Year Plan</div>
                      <div className="text-[11px] opacity-90 font-medium">+ $99.00</div>
                    </button>
                  </div>
                  <p style={{ fontSize: "11px" }} className="text-gray-500 leading-[1.4]">
                    Includes accidental damage, water damage replacement, and free same-day in-store swaps at all D1 Store retail locations across Australia.
                  </p>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart / Buy Now */}
              <div className="flex flex-col gap-[12px]">
                <div className="flex items-center gap-[12px]">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-300 rounded-[10px] bg-white h-[50px] px-[6px] w-[124px] flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-[36px] h-[40px] flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-[6px] transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-[16px] h-[16px]" />
                    </button>
                    <span style={{ fontSize: "15px" }} className="flex-1 text-center font-bold text-[#121212]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stockCount || 10, q + 1))}
                      className="w-[36px] h-[40px] flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-[6px] transition-colors cursor-pointer"
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
                    className={`flex-1 h-[50px] rounded-[10px] font-bold transition-all flex items-center justify-center gap-[8px] cursor-pointer shadow-xs ${
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
                        <span>Added to Cart!</span>
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
                  className="w-full h-[50px] rounded-[10px] bg-[#0071e3] hover:bg-[#005bb8] text-white font-bold transition-all flex items-center justify-center gap-[8px] cursor-pointer shadow-xs"
                >
                  <Zap className="w-[18px] h-[18px]" />
                  <span>Instant Checkout</span>
                </button>
              </div>

              {/* D1 Store Trust Value Propositions */}
              <div className="pt-[18px] border-t border-gray-100 grid grid-cols-2 gap-y-[12px] gap-x-[16px] text-gray-700">
                <div className="flex items-center gap-[8px]">
                  <Truck className="w-[18px] h-[18px] text-[#0071e3] flex-shrink-0" />
                  <span style={{ fontSize: "12px" }} className="font-semibold">Free Express Shipping &gt;$99</span>
                </div>
                <div className="flex items-center gap-[8px]">
                  <ShieldCheck className="w-[18px] h-[18px] text-[#0071e3] flex-shrink-0" />
                  <span style={{ fontSize: "12px" }} className="font-semibold">2-Year Official AU Warranty</span>
                </div>
                <div className="flex items-center gap-[8px]">
                  <RotateCcw className="w-[18px] h-[18px] text-[#0071e3] flex-shrink-0" />
                  <span style={{ fontSize: "12px" }} className="font-semibold">14-Day Return Guarantee</span>
                </div>
                <div className="flex items-center gap-[8px]">
                  <Building2 className="w-[18px] h-[18px] text-[#0071e3] flex-shrink-0" />
                  <span style={{ fontSize: "12px" }} className="font-semibold">12+ Stores for Click & Collect</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TIER-SPECIFIC BELOW-THE-FOLD PRESENTATION (STYLE BRANCHING) */}
        {/* ========================================================================= */}

        {/* ------------------------------------------------------------------------- */}
        {/* STYLE 1: CORE PRODUCT EXPERIENCE (Like osmo-pocket-4p) */}
        {/* ------------------------------------------------------------------------- */}
        {tier === "product" && (
          <div className="w-full mt-[40px]">
            {/* Sticky Section Sub-Navbar */}
            <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-md border-y border-gray-200 py-3">
              <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] flex items-center justify-between overflow-x-auto no-scrollbar gap-6">
                <div className="flex items-center gap-6 text-[14px] font-bold text-gray-600 whitespace-nowrap">
                  <a href="#overview" className="hover:text-[#0071e3] transition-colors">Overview</a>
                  <a href="#in-the-box" className="hover:text-[#0071e3] transition-colors">In the Box</a>
                  <a href="#specifications" className="hover:text-[#0071e3] transition-colors">Specifications</a>
                  <a href="#faqs" className="hover:text-[#0071e3] transition-colors">FAQ</a>
                  <a href="#accessories" className="hover:text-[#0071e3] transition-colors">Compatible Gear</a>
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-[14px] font-bold text-[#121212]">{product.name}</span>
                  <span className="text-[14px] font-bold text-[#0071e3]">${product.price}.00</span>
                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-1.5 rounded-full bg-[#121212] text-white text-[13px] font-bold hover:bg-black transition-all cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Section 1: Overview & Story Showcases */}
            <section id="overview" className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[64px]">
              {/* Hero Banner */}
              <div className="bg-[#121212] text-white rounded-[28px] p-[36px] md:p-[64px] text-center mb-[48px] overflow-hidden relative shadow-lg">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-[12px] font-bold tracking-wider uppercase mb-4">
                  Flagship Performance
                </span>
                <h2 style={{ fontSize: "36px" }} className="font-extrabold md:text-[48px] tracking-tight mb-4 max-w-[800px] mx-auto leading-[1.15]">
                  {product.storyBlocks && product.storyBlocks[0]
                    ? product.storyBlocks[0].title
                    : `Flagship Cinematic Power with ${product.name}`}
                </h2>
                <p style={{ fontSize: "17px" }} className="text-gray-300 max-w-[700px] mx-auto leading-[1.6]">
                  {product.storyBlocks && product.storyBlocks[0]
                    ? product.storyBlocks[0].description
                    : product.description}
                </p>
              </div>

              {/* Story Feature Cards */}
              {product.storyBlocks && product.storyBlocks.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                  {product.storyBlocks.slice(1).map((block, idx) => (
                    <div
                      key={idx}
                      className="bg-[#f8f8fa] border border-gray-100 rounded-[24px] p-[32px] md:p-[40px] flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        {block.tag && (
                          <span style={{ fontSize: "11px" }} className="font-black uppercase tracking-wider text-[#0071e3] mb-2 block">
                            {block.tag}
                          </span>
                        )}
                        <h3 style={{ fontSize: "24px" }} className="font-bold text-[#121212] mb-3">
                          {block.title}
                        </h3>
                        <p style={{ fontSize: "15px" }} className="text-gray-600 leading-[1.6]">
                          {block.description}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center gap-2 text-[#0071e3] font-bold text-[14px]">
                        <span>D1 Store Certified Performance</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Section 2: In the Box */}
            <section id="in-the-box" className="bg-[#fbfbfd] border-y border-gray-200/80 py-[64px]">
              <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px]">
                <div className="text-center max-w-[600px] mx-auto mb-[40px]">
                  <span className="text-[12px] font-black uppercase tracking-wider text-[#0071e3] block mb-1">
                    Unboxing Experience
                  </span>
                  <h2 style={{ fontSize: "32px" }} className="font-black text-[#121212]">
                    What&apos;s in the Box
                  </h2>
                  <p style={{ fontSize: "15px" }} className="text-gray-500 mt-2">
                    Everything you need to begin shooting straight out of the box.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[16px]">
                  {((product.inTheBox && product.inTheBox.length > 0)
                    ? product.inTheBox
                    : [
                        { title: `1 x ${product.name}`, qty: 1, image: product.mainImage },
                        { title: "1 x Fast Charging Cable", qty: 1, image: product.mainImage },
                        { title: "1 x Protective Travel Cover", qty: 1, image: product.mainImage },
                        { title: "1 x Quick Start Guide", qty: 1, image: product.mainImage },
                      ]
                  ).map((item, idx) => {
                    const titleStr = typeof item === "string" ? item : item.title;
                    const imgStr = typeof item === "string" ? product.mainImage : item.image || product.mainImage;
                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-[20px] p-[20px] border border-gray-200 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-shadow"
                      >
                        <div className="w-[100px] h-[100px] flex items-center justify-center mb-3">
                          <img
                            src={imgStr}
                            alt={titleStr}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <span style={{ fontSize: "13px" }} className="font-bold text-[#121212] leading-[1.3] line-clamp-2">
                          {titleStr}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Section 3: Technical Specifications */}
            <section id="specifications" className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[64px]">
              <div className="text-center max-w-[600px] mx-auto mb-[40px]">
                <span className="text-[12px] font-black uppercase tracking-wider text-[#0071e3] block mb-1">
                  Engineered Detail
                </span>
                <h2 style={{ fontSize: "32px" }} className="font-black text-[#121212]">
                  Technical Specifications
                </h2>
                <p style={{ fontSize: "15px" }} className="text-gray-500 mt-2">
                  Complete technical breakdown and operating parameters.
                </p>
              </div>

              {/* Spec Tabs */}
              {specCategories.length > 1 && (
                <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar mb-8">
                  {specCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedSpecTab(cat)}
                      className={`px-5 py-2 rounded-full text-[14px] font-bold transition-all cursor-pointer ${
                        selectedSpecTab === cat
                          ? "bg-[#121212] text-white shadow-xs"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Specs Table */}
              <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {Object.entries(specsData).flatMap(([catName, fields]) => {
                      if (selectedSpecTab !== "All" && selectedSpecTab !== catName) return [];
                      if (typeof fields !== "object" || fields === null) {
                        return [
                          <tr key={catName} className="border-b border-gray-100 hover:bg-gray-50/50">
                            <th className="py-4 px-6 font-bold text-gray-900 w-1/3 text-[14px]">{catName}</th>
                            <td className="py-4 px-6 text-gray-700 text-[14px]">{String(fields)}</td>
                          </tr>
                        ];
                      }
                      return Object.entries(fields).map(([k, v], i) => (
                        <tr key={`${catName}-${k}`} className="border-b border-gray-100 hover:bg-gray-50/50">
                          <th className="py-4 px-6 font-bold text-gray-900 w-1/3 text-[14px]">
                            {k.replace(/([A-Z])/g, " $1").trim()}
                          </th>
                          <td className="py-4 px-6 text-gray-700 text-[14px]">{String(v)}</td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4: FAQs */}
            {product.faqs && product.faqs.length > 0 && (
              <section id="faqs" className="bg-[#fbfbfd] border-t border-gray-200 py-[64px]">
                <div className="max-w-[900px] mx-auto px-[16px] md:px-[36px]">
                  <div className="text-center mb-[40px]">
                    <span className="text-[12px] font-black uppercase tracking-wider text-[#0071e3] block mb-1">
                      Help &amp; Answers
                    </span>
                    <h2 style={{ fontSize: "32px" }} className="font-black text-[#121212]">
                      Frequently Asked Questions
                    </h2>
                  </div>

                  <div className="space-y-[12px]">
                    {product.faqs.map((faq, idx) => {
                      const isOpen = openFaqIndex === idx;
                      return (
                        <div
                          key={idx}
                          className="bg-white rounded-[16px] border border-gray-200 overflow-hidden shadow-xs transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                            className="w-full py-5 px-6 flex items-center justify-between text-left font-bold text-[16px] text-[#121212] hover:text-[#0071e3] transition-colors cursor-pointer"
                          >
                            <span>{faq.question}</span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-5 pt-1 text-gray-600 text-[15px] leading-[1.6] border-t border-gray-50">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* STYLE 2: BUNDLE EXPERIENCE (Like osmo-pocket-4p-ultimate-combo) */}
        {/* ------------------------------------------------------------------------- */}
        {tier === "bundle" && (
          <div className="w-full mt-[40px]">
            {/* Sticky Section Sub-Navbar */}
            <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-md border-y border-gray-200 py-3">
              <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] flex items-center justify-between overflow-x-auto no-scrollbar gap-6">
                <div className="flex items-center gap-6 text-[14px] font-bold text-gray-600 whitespace-nowrap">
                  <a href="#bundle-overview" className="hover:text-[#0071e3] transition-colors">Overview</a>
                  <a href="#main-product" className="hover:text-[#0071e3] transition-colors">Main Product</a>
                  <a href="#included-in-bundle" className="hover:text-[#0071e3] transition-colors">Included in Bundle</a>
                  <a href="#bundle-in-box" className="hover:text-[#0071e3] transition-colors">In the Box</a>
                  <a href="#accessories" className="hover:text-[#0071e3] transition-colors">More Accessories</a>
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-[14px] font-bold text-[#121212]">{product.name}</span>
                  <span className="text-[14px] font-bold text-emerald-600">${product.price}.00</span>
                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-1.5 rounded-full bg-[#0071e3] text-white text-[13px] font-bold hover:bg-[#005bb8] transition-all cursor-pointer"
                  >
                    Get This Bundle
                  </button>
                </div>
              </div>
            </div>

            {/* Section 1: Bundle Overview Banner */}
            <section id="bundle-overview" className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[48px]">
              <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-[24px] p-[32px] md:p-[48px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                <div className="max-w-[700px]">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[12px] font-bold tracking-wider uppercase inline-block mb-3">
                    D1 Store Exclusive Bundle
                  </span>
                  <h2 style={{ fontSize: "32px" }} className="font-extrabold tracking-tight mb-3">
                    {product.name}
                  </h2>
                  <p style={{ fontSize: "16px" }} className="text-blue-100 leading-[1.6]">
                    {product.description ||
                      `${product.name} is a comprehensive all-in-one package curated by D1 Store Australia — an Authorised DJI Retailer. Equipped with all essential filters, batteries, and accessories for immediate field use.`}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-[18px] p-[24px] text-center min-w-[220px] border border-white/20">
                  <div className="text-[12px] uppercase font-bold text-blue-200">Combined Value</div>
                  <div className="text-[28px] font-black line-through text-white/70">
                    ${(product.originalPrice || Math.round(product.price * 1.15)).toLocaleString()}.00
                  </div>
                  <div className="text-[12px] uppercase font-bold text-blue-200 mt-2">Bundle Price</div>
                  <div className="text-[32px] font-black text-emerald-400">
                    ${product.price.toLocaleString()}.00
                  </div>
                  <div className="mt-2 text-[12px] font-black bg-emerald-500 text-black px-3 py-1 rounded-full inline-block">
                    Save ${((product.originalPrice || Math.round(product.price * 1.15)) - product.price).toLocaleString()} AUD
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Main Product Spotlight Card */}
            {product.bundleMainProduct && (
              <section id="main-product" className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] pb-[48px]">
                <div className="mb-6">
                  <span className="text-[12px] font-black uppercase tracking-wider text-[#0071e3] block mb-1">
                    Core Hardware Unit
                  </span>
                  <h2 style={{ fontSize: "28px" }} className="font-black text-[#121212]">
                    Main Product
                  </h2>
                </div>

                <div className="bg-white rounded-[24px] border border-gray-200 p-[24px] md:p-[36px] flex flex-col md:flex-row items-center gap-[32px] shadow-xs hover:shadow-md transition-shadow">
                  <div className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] bg-gray-50 rounded-[18px] p-4 flex items-center justify-center flex-shrink-0">
                    <img
                      src={product.bundleMainProduct.image || product.mainImage}
                      alt={product.bundleMainProduct.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
                      <h3 style={{ fontSize: "22px" }} className="font-bold text-[#121212]">
                        {product.bundleMainProduct.title}
                      </h3>
                      {product.bundleMainProduct.rrp && (
                        <span className="text-[18px] font-black text-[#121212]">
                          RRP ${product.bundleMainProduct.rrp.toLocaleString()}.00
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "15px" }} className="text-gray-600 leading-[1.6] mb-4">
                      {product.bundleMainProduct.description ||
                        "Flagship core hardware unit included in this package with all standard manufacturer in-box gear."}
                    </p>
                    {product.bundleMainProduct.slug && (
                      <Link
                        href={`/products/${product.bundleMainProduct.slug}`}
                        className="inline-flex items-center gap-1.5 text-[#0071e3] font-bold text-[14px] hover:underline"
                      >
                        <span>View standalone product specifications</span>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Section 3: Included in this Bundle Cards (d1-bl__cards) */}
            <section id="included-in-bundle" className="bg-[#fbfbfd] border-y border-gray-200/80 py-[64px]">
              <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px]">
                <div className="text-center max-w-[650px] mx-auto mb-[40px]">
                  <span className="text-[12px] font-black uppercase tracking-wider text-[#0071e3] block mb-1">
                    Complete Itemized Kit
                  </span>
                  <h2 style={{ fontSize: "32px" }} className="font-black text-[#121212]">
                    Included in this Bundle
                  </h2>
                  <p style={{ fontSize: "15px" }} className="text-gray-500 mt-2">
                    Every piece hand-picked by D1 Store specialists to give you complete creative freedom.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                  {((product.bundleInclusions && product.bundleInclusions.length > 0)
                    ? product.bundleInclusions
                    : [
                        {
                          title: "Main Core Drone / Camera Unit",
                          rrp: Math.round(product.price * 0.75),
                          qty: 1,
                          image: product.mainImage,
                          description: "Primary aircraft or gimbal unit with standard operating accessories.",
                        },
                        {
                          title: "Intelligent Flight Batteries (2-Pack)",
                          rrp: Math.round(product.price * 0.18),
                          qty: 2,
                          image: product.mainImage,
                          description: "Extended flight batteries for continuous multi-hour shooting sessions.",
                        },
                        {
                          title: "Fast Two-Way Charging Hub",
                          rrp: Math.round(product.price * 0.07),
                          qty: 1,
                          image: product.mainImage,
                          description: "Intelligent multi-battery sequential charging hub.",
                        },
                      ]
                  ).map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-[20px] p-[24px] border border-gray-200 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-[16px]">
                        <div className="w-[80px] h-[80px] rounded-[14px] bg-gray-50 border border-gray-100 flex items-center justify-center p-2 flex-shrink-0">
                          <img
                            src={item.image || product.mainImage}
                            alt={item.title}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-[6px] bg-blue-50 text-[#0071e3] text-[11px] font-black">
                              {item.qty ? `${item.qty}x` : "1x"}
                            </span>
                            {item.rrp ? (
                              <span className="text-gray-400 text-[12px] font-semibold">
                                Value: ${item.rrp.toLocaleString()}.00
                              </span>
                            ) : null}
                          </div>
                          <h4 style={{ fontSize: "15px" }} className="font-bold text-[#121212] leading-[1.3] line-clamp-2">
                            {item.title}
                          </h4>
                        </div>
                      </div>

                      {item.description && (
                        <p style={{ fontSize: "13px" }} className="text-gray-500 mt-3 pt-3 border-t border-gray-100 leading-[1.5]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Savings Calculator Summary Box */}
                <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-[20px] p-[24px] text-center max-w-[700px] mx-auto">
                  <div className="text-emerald-950 font-black text-[18px] mb-1">
                    Guaranteed Bundle Savings
                  </div>
                  <p className="text-emerald-800 text-[14px]">
                    Purchasing these items separately would cost{" "}
                    <strong>${(product.originalPrice || Math.round(product.price * 1.15)).toLocaleString()}.00 AUD</strong>. You save{" "}
                    <strong>${((product.originalPrice || Math.round(product.price * 1.15)) - product.price).toLocaleString()} AUD</strong> by ordering this complete kit today.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: In the Box Packing List */}
            {product.inTheBox && product.inTheBox.length > 0 && (
              <section id="bundle-in-box" className="max-w-[1000px] mx-auto px-[16px] md:px-[36px] py-[64px]">
                <div className="text-center mb-[32px]">
                  <h2 style={{ fontSize: "28px" }} className="font-black text-[#121212]">
                    Complete Packing Checklist
                  </h2>
                </div>
                <div className="bg-white rounded-[20px] border border-gray-200 p-[24px] md:p-[32px] grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.inTheBox.map((item, idx) => {
                    const title = typeof item === "string" ? item : item.title;
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/70">
                        <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span className="font-bold text-[14px] text-[#121212]">{title}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* STYLE 3: ACCESSORY EXPERIENCE (Like osmo-mini-tripod) */}
        {/* ------------------------------------------------------------------------- */}
        {tier === "accessory" && (
          <div className="w-full mt-[40px]">
            {/* Sticky Section Sub-Navbar */}
            <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-md border-y border-gray-200 py-3">
              <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] flex items-center justify-between overflow-x-auto no-scrollbar gap-6">
                <div className="flex items-center gap-6 text-[14px] font-bold text-gray-600 whitespace-nowrap">
                  <a href="#acc-overview" className="hover:text-[#0071e3] transition-colors">Overview</a>
                  <a href="#acc-highlights" className="hover:text-[#0071e3] transition-colors">Highlights</a>
                  <a href="#acc-compatibility" className="hover:text-[#0071e3] transition-colors">Compatibility</a>
                  <a href="#acc-specs" className="hover:text-[#0071e3] transition-colors">Specifications</a>
                  <a href="#acc-box" className="hover:text-[#0071e3] transition-colors">In the Box</a>
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-[14px] font-bold text-[#121212]">{product.name}</span>
                  <span className="text-[14px] font-bold text-[#0071e3]">${product.price}.00</span>
                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-1.5 rounded-full bg-[#121212] text-white text-[13px] font-bold hover:bg-black transition-all cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Section 1: Overview */}
            <section id="acc-overview" className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[48px]">
              <div className="bg-[#f8f8fa] border border-gray-200/80 rounded-[24px] p-[32px] md:p-[48px] flex flex-col md:flex-row items-center justify-between gap-[32px]">
                <div className="max-w-[700px]">
                  <span className="text-[12px] font-black uppercase tracking-wider text-[#0071e3] block mb-1">
                    Product Overview
                  </span>
                  <h2 style={{ fontSize: "28px" }} className="font-black text-[#121212] mb-3">
                    About {product.name}
                  </h2>
                  <p style={{ fontSize: "16px" }} className="text-gray-600 leading-[1.6]">
                    {product.description ||
                      `Mount and go with the ${product.name}, a genuine DJI accessory crafted with high-precision engineering for rock-solid stability and seamless integration with your gear.`}
                  </p>
                </div>
                <div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] bg-white rounded-[20px] p-4 flex items-center justify-center border border-gray-200 shadow-xs flex-shrink-0">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Highlights Checklist */}
            <section id="acc-highlights" className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] pb-[48px]">
              <div className="mb-6">
                <span className="text-[12px] font-black uppercase tracking-wider text-[#0071e3] block mb-1">
                  Key Features
                </span>
                <h2 style={{ fontSize: "28px" }} className="font-black text-[#121212]">
                  Highlights
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {((product.highlights && product.highlights.length > 0)
                  ? product.highlights
                  : product.features && product.features.length > 0
                  ? product.features
                  : [
                      "Official Genuine DJI Accessory from Authorised Retailer",
                      "Engineered specifically for optimal performance and secure fit",
                      "Backed by 100% Australian Warranty & Local Support",
                      "Precision durable materials built for lasting reliability",
                    ]
                ).map((hl, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-[16px] bg-white border border-gray-200 flex items-start gap-4 shadow-xs hover:border-[#0071e3] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 font-bold" />
                    </div>
                    <span style={{ fontSize: "15px" }} className="font-semibold text-gray-800 leading-[1.5]">
                      {hl}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Compatibility Table / Grid (d1storeosmomi-compat-table-wrap) */}
            <section id="acc-compatibility" className="bg-[#fbfbfd] border-y border-gray-200/80 py-[64px]">
              <div className="max-w-[1000px] mx-auto px-[16px] md:px-[36px]">
                <div className="text-center mb-[40px]">
                  <span className="text-[12px] font-black uppercase tracking-wider text-[#0071e3] block mb-1">
                    Device Support
                  </span>
                  <h2 style={{ fontSize: "32px" }} className="font-black text-[#121212]">
                    Compatibility
                  </h2>
                  <p style={{ fontSize: "15px" }} className="text-gray-500 mt-2">
                    Verified to work seamlessly with the following DJI models and hardware families.
                  </p>
                </div>

                <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-xs">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      {((product.compatibility && product.compatibility.length > 0)
                        ? product.compatibility
                        : ["Osmo Pocket 4P", "Osmo Pocket 4", "Osmo Pocket 3", "Osmo Action Series"]
                      ).map((model, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50">
                          <th className="py-4 px-6 font-bold text-gray-900 text-[15px] flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{model}</span>
                          </th>
                          <td className="py-4 px-6 text-right">
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[12px] font-bold border border-emerald-200">
                              Fully Compatible
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 4: Specifications */}
            <section id="acc-specs" className="max-w-[1000px] mx-auto px-[16px] md:px-[36px] py-[64px]">
              <div className="mb-6 text-center">
                <span className="text-[12px] font-black uppercase tracking-wider text-[#0071e3] block mb-1">
                  Technical Data
                </span>
                <h2 style={{ fontSize: "28px" }} className="font-black text-[#121212]">
                  Specifications
                </h2>
              </div>

              <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {Object.entries(specsData).flatMap(([catName, fields]) => {
                      if (typeof fields !== "object" || fields === null) {
                        return [
                          <tr key={catName} className="border-b border-gray-100 hover:bg-gray-50/50">
                            <th className="py-4 px-6 font-bold text-gray-900 w-1/3 text-[14px]">{catName}</th>
                            <td className="py-4 px-6 text-gray-700 text-[14px]">{String(fields)}</td>
                          </tr>
                        ];
                      }
                      return Object.entries(fields).map(([k, v]) => (
                        <tr key={`${catName}-${k}`} className="border-b border-gray-100 hover:bg-gray-50/50">
                          <th className="py-4 px-6 font-bold text-gray-900 w-1/3 text-[14px]">
                            {k.replace(/([A-Z])/g, " $1").trim()}
                          </th>
                          <td className="py-4 px-6 text-gray-700 text-[14px]">{String(v)}</td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 5: In the Box */}
            <section id="acc-box" className="bg-[#fbfbfd] border-t border-gray-200 py-[48px]">
              <div className="max-w-[800px] mx-auto px-[16px] md:px-[36px] text-center">
                <h2 style={{ fontSize: "24px" }} className="font-black text-[#121212] mb-6">
                  In the Box
                </h2>
                <div className="bg-white rounded-[20px] border border-gray-200 p-6 flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl p-2 flex items-center justify-center border border-gray-100">
                    <img src={product.mainImage} alt={product.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <span className="font-bold text-[16px] text-[#121212]">
                    1 x {product.name}
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* RELATED PRODUCTS CAROUSEL (ACROSS ALL PAGES) */}
        {/* ========================================================================= */}
        {relatedProducts.length > 0 && (
          <div id="accessories" className="mt-[64px]">
            <ProductCarousel
              sectionTitle={
                tier === "product"
                  ? `Recommended Accessories & Gear for ${product.name}`
                  : tier === "bundle"
                  ? "Other Popular Combos & Accessories"
                  : "Matching Cameras & Drones"
              }
              subtitle="Curated by D1 Store specialists for the ultimate experience"
              products={relatedProducts}
              viewAllHref={`/collections/${product.categorySlug || "all"}`}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
