"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
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
  Play,
  RotateCw,
  Search,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<string>("standard");
  const [inTheBoxTab, setInTheBoxTab] = useState<string>("standard");
  const [careRefreshPlan, setCareRefreshPlan] = useState<"none" | "1year" | "2year">("none");
  const [selectedSpecTab, setSelectedSpecTab] = useState<string>("All");
  const [faqCategory, setFaqCategory] = useState<string>("All");
  const [faqSearch, setFaqSearch] = useState<string>("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [portraitMood, setPortraitMood] = useState<number>(0);
  const [trackingMode, setTrackingMode] = useState<number>(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const videoRef4 = useRef<HTMLVideoElement>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const prod = (await fetchProductBySlug(slug)) || findStaticProduct(slug);
        if (prod) {
          setProduct(prod);
          setSelectedImage(prod.mainImage || (prod.images && prod.images[0]) || "");

          // Check if variant is in query string
          if (typeof window !== "undefined") {
            const queryVariant = new URLSearchParams(window.location.search).get("variant");
            if (queryVariant === "46551056122017") {
              setSelectedVariant("vlog");
              setInTheBoxTab("vlog");
            } else if (queryVariant === "46551056154785") {
              setSelectedVariant("ultimate");
            } else {
              setSelectedVariant("standard");
              setInTheBoxTab("standard");
            }
          }

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
            Browse All Drones &amp; Cameras
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate price dynamically based on config variant
  const selectedVariantObj = product.variants?.find((v: any) => {
    if (selectedVariant === "vlog") return v.name.toLowerCase().includes("vlog") || v.variantId === "46551056122017";
    if (selectedVariant === "ultimate") return v.name.toLowerCase().includes("ultimate") || v.variantId === "46551056154785";
    return v.name.toLowerCase().includes("standard") || v.variantId === "46551056089249";
  });

  const variantPrice = selectedVariantObj?.price || (selectedVariant === "vlog" ? 1099 : selectedVariant === "ultimate" ? 1109 : product.price);
  const currentSku = selectedVariantObj?.sku || (selectedVariant === "vlog" ? "OSMOPK4P-VC" : selectedVariant === "ultimate" ? "OSMOPK4P-UC" : product.sku);
  const currentTitle = selectedVariantObj
    ? `${product.name} (${selectedVariantObj.name})`
    : (selectedVariant === "vlog"
    ? `${product.name} (Vlog Combo)`
    : selectedVariant === "ultimate"
    ? `${product.name} (Ultimate Combo)`
    : `${product.name} (Standard Combo)`);

  const careRefreshCost = careRefreshPlan === "1year" ? 59 : careRefreshPlan === "2year" ? 99 : 0;
  const currentPrice = variantPrice + careRefreshCost;
  const originalPriceDisplay = product.originalPrice ? Math.max(product.originalPrice, variantPrice) + careRefreshCost : null;
  const savings = originalPriceDisplay ? originalPriceDisplay - currentPrice : 0;

  const handleSelectVariant = (variantKey: string, variantId?: string) => {
    setSelectedVariant(variantKey);
    if (variantKey === "vlog") {
      setInTheBoxTab("vlog");
    } else {
      setInTheBoxTab("standard");
    }
    if (typeof window !== "undefined" && variantId) {
      const url = new URL(window.location.href);
      url.searchParams.set("variant", variantId);
      window.history.replaceState(null, "", url.toString());
    }
  };

  const handleAddToCart = () => {
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
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const allImages = product.images && product.images.length > 0 ? product.images : [product.mainImage];

  // Normalized specs data for accessory & bundle
  const specsData = (product.specs as Record<string, any>) || {};

  // Raw Specs data
  const rawSpecsList = product.rawSpecs || [];
  const specGroups = ["All", ...Array.from(new Set(rawSpecsList.map((s) => s.group)))];

  // FAQs data
  const faqsList = product.faqs || [];
  const faqCategories = ["All", ...Array.from(new Set(faqsList.map((f: any) => f.group || f.category || "General")))];

  const filteredFaqs = faqsList.filter((f: any) => {
    const grp = f.group || f.category || "General";
    const matchesCat = faqCategory === "All" || grp.toLowerCase() === faqCategory.toLowerCase();
    const matchesSearch = !faqSearch || f.question.toLowerCase().includes(faqSearch.toLowerCase()) || f.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // In the box items depending on tab
  const activeInTheBoxItems = product.inTheBoxVariants
    ? (inTheBoxTab === "vlog" ? product.inTheBoxVariants.vlog : product.inTheBoxVariants.standard)
    : (product.inTheBox || []);

  const replayVideo = (vRef: React.RefObject<HTMLVideoElement | null>) => {
    if (vRef.current) {
      vRef.current.currentTime = 0;
      vRef.current.play();
    }
  };

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
                    SKU: {currentSku}
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
                      Dispatched within 24h • Click &amp; Collect in 12+ stores
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: "13px" }} className="font-bold text-emerald-800 text-right min-w-[70px]">
                  {product.stockCount || 15} available
                </span>
              </div>

              {/* CONFIGURATION / COMBO VARIANTS PICKER */}
              {tier === "product" && (
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center justify-between">
                    <label style={{ fontSize: "13px" }} className="font-bold uppercase tracking-wider text-gray-700">
                      Select Configuration:
                    </label>
                    <span className="text-[12px] text-gray-400 font-semibold">Genuine D1 Editions</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[10px]">
                    {/* Standard Combo */}
                    <button
                      type="button"
                      onClick={() => handleSelectVariant("standard", "46551056089249")}
                      className={`p-[14px] rounded-[14px] border text-left transition-all cursor-pointer ${
                        selectedVariant === "standard"
                          ? "border-[#0071e3] bg-blue-50/30 ring-[2px] ring-[#0071e3]"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div style={{ fontSize: "14px" }} className="font-bold text-[#121212]">
                        Standard Combo
                      </div>
                      <div style={{ fontSize: "13px" }} className="text-[#0071e3] font-bold mt-[2px]">
                        $959.00 AUD
                      </div>
                      <span style={{ fontSize: "11px" }} className="text-gray-500 block mt-1">
                        Camera + In-box Gear
                      </span>
                    </button>

                    {/* Vlog Combo */}
                    <button
                      type="button"
                      onClick={() => handleSelectVariant("vlog", "46551056122017")}
                      className={`p-[14px] rounded-[14px] border text-left transition-all cursor-pointer ${
                        selectedVariant === "vlog"
                          ? "border-[#0071e3] bg-blue-50/30 ring-[2px] ring-[#0071e3]"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div style={{ fontSize: "14px" }} className="font-bold text-[#121212]">
                          Vlog Combo
                        </div>
                        <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Popular
                        </span>
                      </div>
                      <div style={{ fontSize: "13px" }} className="text-[#0071e3] font-bold mt-[2px]">
                        $1,099.00 AUD
                      </div>
                      <span style={{ fontSize: "11px" }} className="text-gray-500 block mt-1">
                        Includes Mic Mini 2 &amp; Tripod
                      </span>
                    </button>

                    {/* Ultimate Combo */}
                    <button
                      type="button"
                      onClick={() => handleSelectVariant("ultimate", "46551056154785")}
                      className={`p-[14px] rounded-[14px] border text-left transition-all cursor-pointer ${
                        selectedVariant === "ultimate"
                          ? "border-[#0071e3] bg-blue-50/30 ring-[2px] ring-[#0071e3]"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div style={{ fontSize: "14px" }} className="font-bold text-[#121212]">
                          Ultimate Combo
                        </div>
                        <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          Save $150
                        </span>
                      </div>
                      <div style={{ fontSize: "13px" }} className="text-[#0071e3] font-bold mt-[2px]">
                        $1,109.00 AUD
                      </div>
                      <span style={{ fontSize: "11px" }} className="text-gray-500 block mt-1">
                        Full Filmmaker Kit
                      </span>
                    </button>
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
                  <span style={{ fontSize: "12px" }} className="font-semibold">12+ Stores for Click &amp; Collect</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CORE PRODUCT DETAILED SECTIONS WITH EMBEDDED VIDEOS & REAL D1 STORE DATA */}
        {/* ========================================================================= */}
        {tier === "product" && (
          <div className="w-full mt-[40px]">
            {/* Sticky Section Sub-Navbar */}
            <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-md border-y border-gray-200 py-3 shadow-xs">
              <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] flex items-center justify-between overflow-x-auto no-scrollbar gap-6">
                <div className="flex items-center gap-6 text-[14px] font-bold text-gray-600 whitespace-nowrap">
                  <a href="#overview" className="hover:text-[#0071e3] transition-colors">Overview</a>
                  <a href="#videos" className="hover:text-[#0071e3] transition-colors">Videos</a>
                  <a href="#in-the-box" className="hover:text-[#0071e3] transition-colors">In the Box</a>
                  <a href="#specifications" className="hover:text-[#0071e3] transition-colors">Specifications</a>
                  <a href="#faqs" className="hover:text-[#0071e3] transition-colors">FAQ ({faqsList.length})</a>
                  <a href="#accessories" className="hover:text-[#0071e3] transition-colors">Accessories</a>
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-[14px] font-bold text-[#121212]">{currentTitle}</span>
                  <span className="text-[14px] font-bold text-[#0071e3]">${currentPrice}.00</span>
                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-1.5 rounded-full bg-[#121212] text-white text-[13px] font-bold hover:bg-black transition-all cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Section 1: Overview Hero Banner */}
            <section id="overview" className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[64px]">
              <div className="bg-[#121212] text-white rounded-[28px] p-[36px] md:p-[64px] text-center mb-[48px] overflow-hidden relative shadow-lg">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-[12px] font-bold tracking-wider uppercase mb-4">
                  Dual-Lens Cinematic Pocket Gimbal Camera
                </span>
                <h2 style={{ fontSize: "36px" }} className="font-extrabold md:text-[48px] tracking-tight mb-4 max-w-[800px] mx-auto leading-[1.15]">
                  See More. Share More.
                </h2>
                <p style={{ fontSize: "17px" }} className="text-gray-300 max-w-[700px] mx-auto leading-[1.6]">
                  Two lenses. One camera. Infinite creativity in the palm of your hand. Say hello to Osmo Pocket 4P, engineered for cinematic storytellers who demand high fidelity without carrying bulky gear.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm font-bold text-white border border-white/15">
                    17-Stop Dynamic Range
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm font-bold text-white border border-white/15">
                    Dual 1-inch Optical System
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm font-bold text-white border border-white/15">
                    4K/120fps &amp; 4K/240fps
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm font-bold text-white border border-white/15">
                    103GB High-Speed Storage
                  </span>
                </div>
              </div>
            </section>

            {/* Section 2: Interactive Video Showcases */}
            <section id="videos" className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] pb-[64px] space-y-[48px]">
              {/* VIDEO SHOWCASE 1: 1-inch Imaging */}
              <div className="bg-[#f8f8fa] border border-gray-200/80 rounded-[28px] p-[24px] md:p-[48px] grid grid-cols-1 lg:grid-cols-12 gap-[32px] items-center">
                <div className="lg:col-span-6 relative aspect-[16/11] bg-black rounded-[22px] overflow-hidden group">
                  <video
                    ref={videoRef1}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    src="https://cdn.d1store.app/shopify/product-page-editor/assets/168f0fce-d4c3-41cc-aa08-a0adf634aff4/pocket-4p-stitched.webm"
                  />
                  <button
                    type="button"
                    onClick={() => replayVideo(videoRef1)}
                    className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer"
                    aria-label="Replay video"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
                <div className="lg:col-span-6 space-y-[20px]">
                  <span className="text-[12px] font-black uppercase tracking-wider text-[#0071e3]">
                    Sensor Innovation
                  </span>
                  <h3 style={{ fontSize: "32px" }} className="font-extrabold text-[#121212] leading-[1.2]">
                    1-inch Imaging with LOFIC Dynamic Range
                  </h3>
                  <p style={{ fontSize: "16px" }} className="text-gray-600 leading-[1.6]">
                    Osmo Pocket 4P is optimised for any shooting environment. Day or night, dark or bright, Osmo Pocket 4P handles it all with 17-stop dynamic range and a LOFIC-powered sensor. Highlights and shadows remain balanced for dynamic, true-to-life colours.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-white p-4 rounded-[14px] border border-gray-200 shadow-xs">
                      <div className="font-bold text-[15px] text-[#121212]">D-Log 2 10-Bit</div>
                      <div className="text-[13px] text-gray-500 mt-1">Preserves highlight and shadow data for ultimate color grading.</div>
                    </div>
                    <div className="bg-white p-4 rounded-[14px] border border-gray-200 shadow-xs">
                      <div className="font-bold text-[15px] text-[#121212]">37MP Photos</div>
                      <div className="text-[13px] text-gray-500 mt-1">Snap phenomenal high-resolution stills with reframing freedom.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* VIDEO SHOWCASE 2: Portrait Perfection */}
              <div className="bg-[#121212] text-white rounded-[28px] p-[24px] md:p-[48px] text-center space-y-[24px]">
                <div className="max-w-[700px] mx-auto">
                  <span className="text-[12px] font-black uppercase tracking-wider text-blue-400 block mb-2">
                    Cinematic Colour Science
                  </span>
                  <h3 style={{ fontSize: "32px" }} className="font-extrabold text-white">
                    Portrait Perfection Across Any Lighting
                  </h3>
                  <p style={{ fontSize: "15px" }} className="text-gray-300 mt-2">
                    Custom optical tuning reproduces lifelike skin tones and smooth depth transitions.
                  </p>
                </div>

                {/* Video container */}
                <div className="max-w-[900px] mx-auto aspect-video rounded-[22px] overflow-hidden bg-black relative shadow-2xl">
                  <video
                    ref={videoRef2}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    src="https://cdn.d1store.app/shopify/product-page-editor/assets/7e25af60-be85-47fc-9983-98b46504bea7/d57ee7a6-156f-4a39-bad3-c895320bd922-1.mp4"
                  />
                  <button
                    type="button"
                    onClick={() => replayVideo(videoRef2)}
                    className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer"
                    aria-label="Replay video"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Mood buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {["Neon Cityscapes", "Blue Hour", "Cool-Toned Portrait", "Warm-Toned Portrait"].map((m, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPortraitMood(idx)}
                      className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all cursor-pointer ${
                        portraitMood === idx
                          ? "bg-white text-black"
                          : "bg-white/10 hover:bg-white/20 text-gray-300"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* VIDEO SHOWCASE 3: Rotate to Record */}
              <div className="bg-[#f8f8fa] border border-gray-200/80 rounded-[28px] p-[24px] md:p-[48px] grid grid-cols-1 lg:grid-cols-12 gap-[32px] items-center">
                <div className="lg:col-span-6 space-y-[20px] order-2 lg:order-1">
                  <span className="text-[12px] font-black uppercase tracking-wider text-[#0071e3]">
                    Instant Aspect Switch
                  </span>
                  <h3 style={{ fontSize: "32px" }} className="font-extrabold text-[#121212] leading-[1.2]">
                    Rotate to Record
                  </h3>
                  <p style={{ fontSize: "16px" }} className="text-gray-600 leading-[1.6]">
                    Effortlessly flick the 2.0-inch rotatable OLED display to switch instantly between cinematic 16:9 widescreen landscape and social-ready 9:16 vertical video without losing gimbal calibration.
                  </p>
                  <div className="bg-white p-5 rounded-[16px] border border-gray-200 shadow-xs flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center flex-shrink-0">
                      <RotateCw className="w-5 h-5 font-bold" />
                    </div>
                    <div>
                      <div className="font-bold text-[15px] text-[#121212]">Half-Second Transition</div>
                      <div className="text-[13px] text-gray-500">Fast orientation detection locks framing instantly.</div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 relative aspect-[16/11] bg-black rounded-[22px] overflow-hidden order-1 lg:order-2 group">
                  <video
                    ref={videoRef3}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    src="https://cdn.d1store.app/shopify/product-page-editor/assets/6b6cdbae-2f35-4f29-8d74-df9511647958/45d4ac41-d24c-4300-a06f-d78ba24dfee2.webm"
                  />
                  <button
                    type="button"
                    onClick={() => replayVideo(videoRef3)}
                    className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer"
                    aria-label="Replay video"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* VIDEO SHOWCASE 4: Dynamic Subject Tracking */}
              <div className="bg-[#121212] text-white rounded-[28px] p-[24px] md:p-[48px] text-center space-y-[24px]">
                <div className="max-w-[700px] mx-auto">
                  <span className="text-[12px] font-black uppercase tracking-wider text-blue-400 block mb-2">
                    ActiveTrack 8.0
                  </span>
                  <h3 style={{ fontSize: "32px" }} className="font-extrabold text-white">
                    Dynamic Recording &amp; Follow Me Fun
                  </h3>
                  <p style={{ fontSize: "15px" }} className="text-gray-300 mt-2">
                    Advanced AI deep learning locks onto people, pets, and vehicles, keeping your subject dead-center throughout rapid motions.
                  </p>
                </div>

                <div className="max-w-[900px] mx-auto aspect-video rounded-[22px] overflow-hidden bg-black relative shadow-2xl">
                  <video
                    ref={videoRef4}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    src="https://cdn.d1store.app/shopify/product-page-editor/assets/d83fd051-9720-485b-81ee-4ec4b27a7485/3f4a2113-0711-4fac-a1c8-4bd1660e273f.webm"
                  />
                  <button
                    type="button"
                    onClick={() => replayVideo(videoRef4)}
                    className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer"
                    aria-label="Replay video"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3">
                  {["Follow Me Fun", "Keep Subjects Centred"].map((mode, i) => (
                    <button
                      key={i}
                      onClick={() => setTrackingMode(i)}
                      className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all cursor-pointer ${
                        trackingMode === i
                          ? "bg-white text-black"
                          : "bg-white/10 hover:bg-white/20 text-gray-300"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hardware Performance Grid: Power, Charging, Storage, Speed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                <div className="p-6 rounded-[20px] bg-white border border-gray-200 shadow-xs space-y-2">
                  <Battery className="w-6 h-6 text-[#0071e3]" />
                  <div className="font-bold text-[18px] text-[#121212]">Power Your Play</div>
                  <div className="text-[14px] text-gray-600 leading-[1.5]">
                    Upgraded 1545 mAh battery delivers up to 210 minutes of continuous runtime per charge.
                  </div>
                </div>

                <div className="p-6 rounded-[20px] bg-white border border-gray-200 shadow-xs space-y-2">
                  <Zap className="w-6 h-6 text-emerald-600" />
                  <div className="font-bold text-[18px] text-[#121212]">Rapid Recharge</div>
                  <div className="text-[14px] text-gray-600 leading-[1.5]">
                    Recharges to 80% in just 18 minutes when paired with a 65W PD fast charger.
                  </div>
                </div>

                <div className="p-6 rounded-[20px] bg-white border border-gray-200 shadow-xs space-y-2">
                  <Package className="w-6 h-6 text-indigo-600" />
                  <div className="font-bold text-[18px] text-[#121212]">103GB Storage</div>
                  <div className="text-[14px] text-gray-600 leading-[1.5]">
                    Massive internal high-speed memory ensures you never miss a shot even without an SD card.
                  </div>
                </div>

                <div className="p-6 rounded-[20px] bg-white border border-gray-200 shadow-xs space-y-2">
                  <RotateCcw className="w-6 h-6 text-amber-600" />
                  <div className="font-bold text-[18px] text-[#121212]">800MB/s Export</div>
                  <div className="text-[14px] text-gray-600 leading-[1.5]">
                    Wired USB-C 3.1 ultra-fast offload moves gigabytes of 4K video to your laptop in seconds.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: In the Box with Combo Compare Toggle */}
            <section id="in-the-box" className="bg-[#fbfbfd] border-y border-gray-200/80 py-[64px]">
              <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px]">
                <div className="text-center max-w-[650px] mx-auto mb-[32px]">
                  <span className="text-[12px] font-black uppercase tracking-wider text-[#0071e3] block mb-1">
                    Unboxing Experience
                  </span>
                  <h2 style={{ fontSize: "32px" }} className="font-black text-[#121212]">
                    What&apos;s in the Box
                  </h2>
                  <p style={{ fontSize: "15px" }} className="text-gray-500 mt-2">
                    Compare what is included in the Standard Combo vs the Vlog Combo.
                  </p>
                </div>

                {/* Compare Pills Bar */}
                <div className="flex items-center justify-center gap-3 mb-10">
                  <span className="text-sm font-bold text-gray-500">Compare:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setInTheBoxTab("standard");
                      setSelectedVariant("standard");
                    }}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                      inTheBoxTab === "standard"
                        ? "bg-[#121212] text-white shadow-xs"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Standard Combo (6 items)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInTheBoxTab("vlog");
                      setSelectedVariant("vlog");
                    }}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                      inTheBoxTab === "vlog"
                        ? "bg-[#0071e3] text-white shadow-xs"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Vlog Combo (17 items)
                  </button>
                </div>

                {/* In the box cards grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[16px]">
                  {activeInTheBoxItems.map((item: any, idx: number) => {
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

            {/* Section 4: Technical Specifications */}
            <section id="specifications" className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[64px]">
              <div className="text-center max-w-[600px] mx-auto mb-[40px]">
                <span className="text-[12px] font-black uppercase tracking-wider text-[#0071e3] block mb-1">
                  Engineered Detail
                </span>
                <h2 style={{ fontSize: "32px" }} className="font-black text-[#121212]">
                  Specifications
                </h2>
                <p style={{ fontSize: "15px" }} className="text-gray-500 mt-2">
                  Complete technical breakdown and operating parameters from D1 Store.
                </p>
              </div>

              {/* Spec Tabs */}
              {specGroups.length > 1 && (
                <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar mb-8">
                  {specGroups.map((cat) => (
                    <button
                      key={cat}
                      type="button"
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
                    {rawSpecsList
                      .filter((s) => selectedSpecTab === "All" || s.group.toLowerCase() === selectedSpecTab.toLowerCase())
                      .map((s, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                          <th className="py-4 px-6 font-bold text-gray-900 w-1/3 text-[14px]">
                            {s.label}
                          </th>
                          <td
                            className="py-4 px-6 text-gray-700 text-[14px]"
                            dangerouslySetInnerHTML={{ __html: s.value }}
                          />
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 5: All 86 FAQs Categorized */}
            <section id="faqs" className="bg-[#fbfbfd] border-t border-gray-200 py-[64px]">
              <div className="max-w-[1000px] mx-auto px-[16px] md:px-[36px]">
                <div className="text-center mb-[32px]">
                  <span className="text-[12px] font-black uppercase tracking-wider text-[#0071e3] block mb-1">
                    Help &amp; Answers
                  </span>
                  <h2 style={{ fontSize: "32px" }} className="font-black text-[#121212]">
                    Frequently Asked Questions ({faqsList.length})
                  </h2>
                  <p style={{ fontSize: "15px" }} className="text-gray-500 mt-2">
                    Everything you need to know about the Osmo Pocket 4P.
                  </p>
                </div>

                {/* FAQ Search Bar */}
                <div className="relative mb-6">
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    placeholder="Search all 86 questions..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-300 bg-white font-medium text-sm focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* FAQ Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 pb-1">
                  {faqCategories.map((cat) => {
                    const count = cat === "All"
                      ? faqsList.length
                      : faqsList.filter((f: any) => (f.group || f.category || "General").toLowerCase() === cat.toLowerCase()).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFaqCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          faqCategory.toLowerCase() === cat.toLowerCase()
                            ? "bg-[#0071e3] text-white shadow-xs"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* FAQs List */}
                <div className="space-y-[12px]">
                  {filteredFaqs.slice(0, 25).map((faq: any, idx: number) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-[16px] border border-gray-200 overflow-hidden shadow-xs transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full py-5 px-6 flex items-center justify-between text-left font-bold text-[15px] text-[#121212] hover:text-[#0071e3] transition-colors cursor-pointer"
                        >
                          <span className="pr-4">{faq.question}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div
                            className="px-6 pb-5 pt-1 text-gray-600 text-[14px] leading-[1.65] border-t border-gray-50"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {filteredFaqs.length > 25 && (
                  <p className="text-center text-gray-400 text-sm mt-6">
                    Showing top 25 of {filteredFaqs.length} matching questions. Use the search bar above to find specific topics.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STYLE 2: BUNDLE EXPERIENCE (Like osmo-pocket-4p-ultimate-combo) */}
        {/* ========================================================================= */}
        {tier === "bundle" && (
          <div className="w-full mt-[40px]">
            {/* Sticky Section Sub-Navbar */}
            <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-md border-y border-gray-200 py-3 shadow-xs">
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
                  <h2 style={{ fontSize: "32px" }} className="font-extrabold tracking-tight mb-2">
                    Save with the {product.name}
                  </h2>
                  <p style={{ fontSize: "16px" }} className="text-blue-100 leading-[1.6]">
                    Get everything you need in one complete package. Bundled by D1 Store experts with essential accessories, extra power, and dedicated protection for maximum value.
                  </p>
                </div>
                {savings > 0 && (
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-6 text-center min-w-[200px] flex-shrink-0">
                    <div className="text-[12px] font-bold uppercase tracking-wider text-blue-200">Total Savings</div>
                    <div className="text-[36px] font-black text-white my-1">${savings.toLocaleString()}</div>
                    <div className="text-[12px] text-blue-200 font-medium">Included vs Separately</div>
                  </div>
                )}
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

        {/* ========================================================================= */}
        {/* STYLE 3: ACCESSORY EXPERIENCE (Like osmo-mini-tripod) */}
        {/* ========================================================================= */}
        {tier === "accessory" && (
          <div className="w-full mt-[40px]">
            {/* Sticky Section Sub-Navbar */}
            <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-md border-y border-gray-200 py-3 shadow-xs">
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
