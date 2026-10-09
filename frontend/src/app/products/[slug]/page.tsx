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
  Pause,
  RotateCw,
  Search,
  X,
  Phone,
  Mail,
  FileText,
  Headphones,
  Mic,
  Flame,
  Download,
  CheckCheck,
  ArrowRight,
  Clock,
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
  const [specSearch, setSpecSearch] = useState<string>("");
  const [faqCategory, setFaqCategory] = useState<string>("All");
  const [faqSearch, setFaqSearch] = useState<string>("");
  const [openFaqIndices, setOpenFaqIndices] = useState<Record<number, boolean>>({ 0: true });

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleToggleAllFaqs = (allIndices: number[]) => {
    const allOpen = allIndices.length > 0 && allIndices.every((i) => openFaqIndices[i]);
    if (allOpen) {
      setOpenFaqIndices({});
    } else {
      const next: Record<number, boolean> = {};
      allIndices.forEach((i) => {
        next[i] = true;
      });
      setOpenFaqIndices(next);
    }
  };
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const overviewVideoRef = useRef<HTMLVideoElement>(null);

  const { addToCart } = useCart();

  const toggleVideo = () => {
    if (overviewVideoRef.current) {
      if (isVideoPlaying) {
        overviewVideoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        overviewVideoRef.current.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "in-the-box", "specifications", "faqs", "accessories"];
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

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const prod = (await fetchProductBySlug(slug)) || findStaticProduct(slug);
        if (prod) {
          setProduct(prod);
          setSelectedImage(prod.mainImage || (prod.images && prod.images[0]) || "");

          // In the box default tab
          if (prod.inTheBoxVariants && typeof prod.inTheBoxVariants === "object") {
            const keys = Object.keys(prod.inTheBoxVariants);
            if (keys.length > 0) {
              setInTheBoxTab(keys[0]);
            }
          }

          // Check if variant is in query string
          if (typeof window !== "undefined") {
            const queryVariant = new URLSearchParams(window.location.search).get("variant");
            if (queryVariant && prod.variants && prod.variants.length > 0) {
              const matched = prod.variants.find(
                (v: any) => v.variantId === queryVariant || v.sku === queryVariant || v.name === queryVariant
              );
              if (matched) {
                setSelectedVariant(matched.variantId || matched.name);
                if (matched.name.toLowerCase().includes("creator")) setInTheBoxTab("creator");
                else if (matched.name.toLowerCase().includes("vlog")) setInTheBoxTab("vlog");
                else setInTheBoxTab("standard");
              } else {
                setSelectedVariant(prod.variants[0].variantId || prod.variants[0].name);
              }
            } else if (prod.variants && prod.variants.length > 0) {
              setSelectedVariant(prod.variants[0].variantId || prod.variants[0].name);
            } else {
              setSelectedVariant("standard");
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
    return (
      v.variantId === selectedVariant ||
      v.name === selectedVariant ||
      v.sku === selectedVariant ||
      (selectedVariant === "vlog" && v.name.toLowerCase().includes("vlog")) ||
      (selectedVariant === "ultimate" && v.name.toLowerCase().includes("ultimate")) ||
      (selectedVariant === "standard" && (v.name.toLowerCase().includes("standard") || v.name.toLowerCase().includes("drone only")))
    );
  }) || (product.variants && product.variants.length > 0 ? product.variants[0] : null);

  const variantPrice = selectedVariantObj?.price || product.price;
  const currentSku = selectedVariantObj?.sku || product.sku;
  const currentTitle = selectedVariantObj
    ? (selectedVariantObj.name.toLowerCase().includes(product.name.toLowerCase())
      ? selectedVariantObj.name
      : `${product.name} (${selectedVariantObj.name})`)
    : product.name;

  const careRefreshCost = careRefreshPlan === "1year" ? 59 : careRefreshPlan === "2year" ? 99 : 0;
  const currentPrice = variantPrice + careRefreshCost;
  const originalPriceDisplay = product.originalPrice ? Math.max(product.originalPrice, variantPrice) + careRefreshCost : null;
  const savings = originalPriceDisplay ? originalPriceDisplay - currentPrice : 0;

  const handleSelectVariant = (variantKey: string, variantId?: string) => {
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
  const rawSpecsList = useMemo(() => {
    if (product.rawSpecs && product.rawSpecs.length > 0) {
      return product.rawSpecs;
    }
    const list: { group: string; label: string; value: string }[] = [];
    Object.entries(specsData).forEach(([cat, fields]) => {
      if (typeof fields === "object" && fields !== null) {
        Object.entries(fields).forEach(([k, v]) => {
          list.push({
            group: cat,
            label: k.replace(/([A-Z])/g, " $1").trim(),
            value: String(v),
          });
        });
      } else {
        list.push({ group: "General", label: cat, value: String(fields) });
      }
    });
    return list;
  }, [product, specsData]);

  const specGroups = useMemo(() => {
    if (rawSpecsList.length > 0) {
      const unique = Array.from(new Set(rawSpecsList.map((s) => s.group))).filter(Boolean);
      return ["All", ...unique];
    }
    return ["All"];
  }, [rawSpecsList]);

  // FAQs data
  const faqsList = product.faqs || [];
  const faqCategories = useMemo(() => {
    return ["All", ...Array.from(new Set(faqsList.map((f: any) => f.group || f.category || "General")))];
  }, [faqsList]);

  const filteredFaqs = faqsList.filter((f: any) => {
    const grp = f.group || f.category || "General";
    const matchesCat = faqCategory === "All" || grp.toLowerCase() === faqCategory.toLowerCase();
    const matchesSearch =
      !faqSearch ||
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // In the box keys & items
  const inTheBoxKeys = useMemo(() => {
    if (product.inTheBoxVariants && typeof product.inTheBoxVariants === "object") {
      return Object.keys(product.inTheBoxVariants);
    }
    return [];
  }, [product]);

  const formatVariantLabel = (key: string) => {
    if (key.toLowerCase() === "standard") return "Standard Combo";
    if (key.toLowerCase() === "creator") return "Creator Combo";
    if (key.toLowerCase() === "vlog") return "Vlog Combo";
    if (key.toLowerCase() === "flymore" || key.toLowerCase() === "fly-more") return "Fly More Combo";
    return key.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " Combo";
  };

  const activeInTheBoxItems = useMemo(() => {
    if (inTheBoxKeys.length > 0 && product.inTheBoxVariants) {
      return product.inTheBoxVariants[inTheBoxTab] || product.inTheBoxVariants[inTheBoxKeys[0]] || [];
    }
    return product.inTheBox || [];
  }, [product, inTheBoxKeys, inTheBoxTab]);

  // Bento Feature Cards
  const featureCardsList = useMemo(() => {
    if (product.featureCards && product.featureCards.length > 0) {
      return product.featureCards;
    }
    if (product.storyBlocks && product.storyBlocks.length > 0) {
      return product.storyBlocks.map((sb) => ({
        title: sb.title,
        description: sb.description,
        image: sb.image || product.mainImage,
        tag: sb.tag || "Feature",
      }));
    }
    return [
      {
        title: "Rotatable Screen",
        description:
          "Flip the touchscreen to start recording fast and keep framing simple when you're shooting solo. It's a neat touch for creators who want speed without fuss.",
        image: (product.images && product.images[1]) || product.mainImage || "",
        tag: "OLED Display",
      },
      {
        title: "Pocket Form",
        description:
          "Small enough to carry anywhere, yet capable enough for proper content work. It's an easy fit for trips, events and everyday moments.",
        image: (product.images && product.images[2]) || product.mainImage || "",
        tag: "Ultra Portable",
      },
      {
        title: "Lossless Zoom",
        description:
          "Switch views quickly and keep your subject looking crisp from further back. It's handy when you can't move closer but still want a clean shot.",
        image: (product.images && product.images[3]) || product.mainImage || "",
        tag: "Pure Optics",
      },
    ];
  }, [product]);

  // Overview Stats (Bottom 5-col bar in hero card)
  const overviewStats = useMemo(() => {
    if (product.overviewBanner?.stats && product.overviewBanner.stats.length > 0) {
      return product.overviewBanner.stats;
    }
    return [
      { label: "Sensor", value: "1in" },
      { label: "Video", value: "4K/240" },
      { label: "HDR", value: "14-Stop" },
      { label: "D-Log", value: "10-bit" },
      { label: "Built-in Storage", value: "107gb" },
    ];
  }, [product]);

  // Visual Story Blocks for Overview section
  const storyBlocksList = useMemo(() => {
    if (product.storyBlocks && product.storyBlocks.length > 0) {
      return product.storyBlocks;
    }
    return [
      {
        title: "Next-Gen 1-Inch CMOS Sensor. Master Any Light.",
        description:
          "The all-new 1-inch CMOS sensor captures breathtaking 4K/60fps HDR and high-speed 4K/240fps slow motion. Equipped with an industry-leading 14 stops of dynamic range, it preserves crisp shadow details and prevents highlight blowouts even in harsh Australian midday sun.",
        image: "https://d1store.com.au/media/catalog/product/o/s/osmo_pocket_4_sensor.jpg",
        tag: "Imaging Revolution",
        badge: "1-INCH CMOS",
      },
      {
        title: "ActiveTrack 7.0. Next-Level AI Subject Locking.",
        description:
          "Powered by deep-learning AI algorithms, ActiveTrack 7.0 detects and locks onto faces, human bodies, and fast vehicles with infallible accuracy. Even in chaotic crowded markets or high-speed sports, dynamic framing automatically keeps you perfectly centered in the frame.",
        image: "https://d1store.com.au/media/catalog/product/o/s/osmo_pocket_4_activetrack.jpg",
        tag: "Intelligent Tracking",
        badge: "ACTIVETRACK 7.0",
      },
      {
        title: "3-Axis Mechanical Gimbal vs Digital EIS.",
        description:
          "Unlike action cameras and smartphones that crop up to 30% of your frame using electronic stabilization (EIS)—which introduces motion blur and suffers in low light—the Osmo Pocket 4 utilizes physical brushless 3-axis motors operating at 1000Hz for buttery smooth cinema pans without losing a single pixel.",
        image: "https://d1store.com.au/media/catalog/product/o/s/osmo_pocket_4_gimbal.jpg",
        tag: "Physical Stabilization",
        badge: "TRUE 3-AXIS",
      },
      {
        title: "Pro 32-Bit Float Audio & Dual DJI Mic Link.",
        description:
          "Equipped with a tri-microphone omnidirectional array and intelligent ambient noise reduction. Built-in dual Wi-Fi audio receivers allow direct wireless pairing with two DJI Mic transmitters simultaneously without needing any external receiver plugged into the USB port.",
        image: "https://d1store.com.au/media/catalog/product/o/s/osmo_pocket_4_audio.jpg",
        tag: "Broadcast Audio",
        badge: "32-BIT FLOAT",
      },
    ];
  }, [product]);

  // Hardware Performance Matrix
  const hardwarePerformanceList = [
    {
      icon: Battery,
      title: "Power Your Day",
      stat: "210 Mins",
      subtitle: "Continuous 1080p Recording",
      desc: "Upgraded 1545 mAh high-density cell delivers up to 3.5 hours of operating time, or 160 minutes in full 4K/60fps without overheating.",
    },
    {
      icon: Zap,
      title: "Rapid PD Quick Charge",
      stat: "16 Mins",
      subtitle: "Recharge to 80% Capacity",
      desc: "Charges from 0% to 80% in just 16 minutes with standard 65W PD chargers, getting you back to shooting fast.",
    },
    {
      icon: Layers,
      title: "107GB High-Speed Storage",
      stat: "107 GB",
      subtitle: "Built-In Solid State Flash",
      desc: "Never miss a shot if you forget your microSD card. Internal high-speed memory records hours of pristine 4K video instantly.",
    },
    {
      icon: RotateCw,
      title: "High-Speed Data Offload",
      stat: "800 MB/s",
      subtitle: "Direct USB 3.1 Gen 2 Transfer",
      desc: "Blazing fast wired transfer directly to your iPhone 15/16, Android, Mac or PC without needing an external card reader.",
    },
  ];

  // Filtered technical specifications
  const filteredRawSpecs = useMemo(() => {
    return rawSpecsList.filter((s) => {
      const matchesGroup =
        selectedSpecTab === "All" || s.group.toLowerCase() === selectedSpecTab.toLowerCase();
      const query = specSearch.toLowerCase().trim();
      const matchesQuery =
        !query ||
        s.label.toLowerCase().includes(query) ||
        s.value.toLowerCase().includes(query) ||
        s.group.toLowerCase().includes(query);
      return matchesGroup && matchesQuery;
    });
  }, [rawSpecsList, selectedSpecTab, specSearch]);

  const groupedFilteredSpecs = useMemo(() => {
    const groups: { [key: string]: typeof filteredRawSpecs } = {};
    filteredRawSpecs.forEach((s) => {
      if (!groups[s.group]) groups[s.group] = [];
      groups[s.group].push(s);
    });
    return groups;
  }, [filteredRawSpecs]);

  // In the Box combo comparison items
  const allComparisonItems = useMemo(() => {
    if (!product.inTheBoxVariants) return [];
    const standardList = product.inTheBoxVariants.standard || [];
    const creatorList = product.inTheBoxVariants.creator || [];
    const standardTitles = standardList.map((it: any) => (typeof it === "string" ? it : it.title));
    const creatorTitles = creatorList.map((it: any) => (typeof it === "string" ? it : it.title));
    const allTitles = Array.from(new Set([...standardTitles, ...creatorTitles]));
    return allTitles.map((title) => {
      const stdItem = standardList.find((it: any) => (typeof it === "string" ? it === title : it.title === title));
      const crtItem = creatorList.find((it: any) => (typeof it === "string" ? it === title : it.title === title));
      return {
        title,
        stdIncluded: !!stdItem,
        stdQty: stdItem && typeof stdItem === "object" ? stdItem.qty || 1 : stdItem ? 1 : 0,
        crtIncluded: !!crtItem,
        crtQty: crtItem && typeof crtItem === "object" ? crtItem.qty || 1 : crtItem ? 1 : 0,
        image:
          (crtItem && typeof crtItem === "object" && crtItem.image) ||
          (stdItem && typeof stdItem === "object" && stdItem.image) ||
          product.mainImage,
      };
    });
  }, [product]);

  // Gear Spotlight accessories
  const gearSpotlightList = [
    {
      title: "DJI Battery Handle",
      subtitle: "+62% Extended Battery Runtime",
      desc: "Built-in 950mAh rechargeable battery pack increases operating time by over an hour. Features a 1/4\" tripod thread at the base and supports direct USB-C fast charging while shooting.",
      image: "https://d1store.com.au/media/catalog/product/p/o/pocket_3_battery_handle.jpg",
      highlight: "Hot-Swappable Power",
    },
    {
      title: "DJI Mic 2 Transmitter",
      subtitle: "32-Bit Float & 250m Wireless Range",
      desc: "Crystal-clear studio audio with 8GB internal recording (up to 14 hours of uncompressed 24-bit 48kHz audio). Magnetic clip allows rapid mounting to clothing and active noise cancellation filters harsh wind.",
      image: "https://d1store.com.au/media/catalog/product/d/j/dji_mic_2_transmitter.jpg",
      highlight: "Studio-Grade Vocals",
    },
    {
      title: "DJI Wide-Angle Lens",
      subtitle: "Expanded 108° Ultra-Wide Field of View",
      desc: "Snaps on magnetically to the front element in less than a second. Expands your framing to capture dramatic Australian landscapes, group vlogs, and interior architectural scenes with zero optical distortion.",
      image: "https://d1store.com.au/media/catalog/product/p/o/pocket_3_wide_angle_lens.jpg",
      highlight: "Magnetic Snap-On",
    },
    {
      title: "DJI Mini Tripod & Protective Shell",
      subtitle: "Everyday Stability & Rigid Travel Shield",
      desc: "Ultra-compact collapsible aluminum legs with non-slip silicone feet for table recording and timelapses. The custom hard case protects the 3-axis gimbal and houses two magnetic lenses and micro SD cards.",
      image: "https://d1store.com.au/media/catalog/product/p/o/pocket_3_mini_tripod.jpg",
      highlight: "Precision Transport",
    },
  ];


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
              {tier === "product" && product.variants && product.variants.length > 0 && (
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center justify-between">
                    <label style={{ fontSize: "13px" }} className="font-bold uppercase tracking-wider text-gray-700">
                      Select Configuration:
                    </label>
                    <span className="text-[12px] text-gray-400 font-semibold">Genuine D1 Editions</span>
                  </div>
                  <div
                    className={`grid grid-cols-1 ${
                      product.variants.length === 2
                        ? "sm:grid-cols-2"
                        : product.variants.length >= 3
                        ? "sm:grid-cols-2 md:grid-cols-3"
                        : ""
                    } gap-[10px]`}
                  >
                    {product.variants.map((v: any, idx: number) => {
                      const isSelected =
                        selectedVariantObj?.variantId === v.variantId ||
                        selectedVariantObj?.name === v.name ||
                        selectedVariant === v.variantId ||
                        selectedVariant === v.name;
                      const rawTitle = v.name || "Standard";
                      const cleanTitle =
                        rawTitle
                          .replace(new RegExp(`^${product.name}\\s*[-–(]?`, "i"), "")
                          .replace(/[)]\s*$/, "")
                          .trim() || rawTitle;

                      return (
                        <button
                          key={v.variantId || idx}
                          type="button"
                          onClick={() => handleSelectVariant(v.variantId || v.name, v.variantId)}
                          className={`p-[14px] rounded-[14px] border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#0071e3] bg-blue-50/30 ring-[2px] ring-[#0071e3]"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div style={{ fontSize: "14px" }} className="font-bold text-[#121212] line-clamp-1">
                              {cleanTitle}
                            </div>
                            {v.badge ? (
                              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 ml-1 flex-shrink-0">
                                {v.badge}
                              </span>
                            ) : idx === 1 && product.variants && product.variants.length > 2 ? (
                              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 ml-1 flex-shrink-0">
                                Popular
                              </span>
                            ) : null}
                          </div>
                          <div style={{ fontSize: "13px" }} className="text-[#0071e3] font-bold mt-[2px]">
                            ${(v.price || product.price).toLocaleString()}.00 AUD
                          </div>
                          {v.sku && (
                            <span style={{ fontSize: "11px" }} className="text-gray-500 block mt-1">
                              SKU: {v.sku}
                            </span>
                          )}
                        </button>
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
            {/* Sticky Section Sub-Navbar (Screenshot 1) */}
            <div className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-y border-gray-200/90 shadow-xs py-3.5 transition-all">
              <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] flex items-center justify-between gap-4">
                {/* Centered / Left Pill Nav buttons */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                  <button
                    type="button"
                    onClick={() => scrollToSection("overview")}
                    className={`px-6 py-2 rounded-full text-[14px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeSection === "overview"
                        ? "bg-[#0071e3] text-white shadow-xs"
                        : "text-gray-600 hover:text-black hover:bg-gray-100"
                    }`}
                  >
                    Overview
                  </button>

                  {activeInTheBoxItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => scrollToSection("in-the-box")}
                      className={`px-6 py-2 rounded-full text-[14px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeSection === "in-the-box"
                          ? "bg-[#0071e3] text-white shadow-xs"
                          : "text-gray-600 hover:text-black hover:bg-gray-100"
                      }`}
                    >
                      In the Box
                    </button>
                  )}

                  {rawSpecsList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => scrollToSection("specifications")}
                      className={`px-6 py-2 rounded-full text-[14px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeSection === "specifications"
                          ? "bg-[#0071e3] text-white shadow-xs"
                          : "text-gray-600 hover:text-black hover:bg-gray-100"
                      }`}
                    >
                      Specifications
                    </button>
                  )}

                  {faqsList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => scrollToSection("faqs")}
                      className={`px-6 py-2 rounded-full text-[14px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeSection === "faqs"
                          ? "bg-[#0071e3] text-white shadow-xs"
                          : "text-gray-600 hover:text-black hover:bg-gray-100"
                      }`}
                    >
                      FAQ ({faqsList.length})
                    </button>
                  )}

                  {relatedProducts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => scrollToSection("accessories")}
                      className={`px-6 py-2 rounded-full text-[14px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeSection === "accessories"
                          ? "bg-[#0071e3] text-white shadow-xs"
                          : "text-gray-600 hover:text-black hover:bg-gray-100"
                      }`}
                    >
                      Accessories
                    </button>
                  )}
                </div>

                {/* Right quick purchase widget */}
                <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                  <div className="flex flex-col text-right">
                    <span className="text-[13px] font-bold text-[#121212] line-clamp-1 max-w-[240px]">
                      {currentTitle}
                    </span>
                    <span className="text-[14px] font-black text-[#0071e3]">
                      ${currentPrice.toLocaleString()}.00 AUD
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="px-6 py-2 rounded-full bg-[#0071e3] text-white text-[13px] font-bold hover:bg-[#0058b8] transition-all cursor-pointer shadow-xs"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Section 1: Overview (Screenshots 1 & 2) */}
            <section id="overview" className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[48px] md:py-[64px]">
              {/* Hero Dark Card (Screenshot 1) */}
              <div className="relative rounded-[28px] overflow-hidden bg-black text-white shadow-2xl border border-neutral-900 group">
                {/* Background Video / Image */}
                {product.overviewBanner?.videoUrl ? (
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <video
                      ref={overviewVideoRef}
                      src={product.overviewBanner.videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover opacity-55"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30 pointer-events-none" />
                  </div>
                ) : product.overviewBanner?.bgImage ? (
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={product.overviewBanner.bgImage}
                      alt={product.name}
                      className="w-full h-full object-cover opacity-45 filter brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 pointer-events-none" />
                  </div>
                ) : (
                  <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#111113] via-[#08080a] to-black">
                    <div className="absolute -right-20 -bottom-20 w-[500px] h-[500px] bg-[#0071e3]/15 rounded-full blur-3xl pointer-events-none" />
                  </div>
                )}

                {/* Video Play/Pause Toggle button */}
                {product.overviewBanner?.videoUrl && (
                  <button
                    type="button"
                    onClick={toggleVideo}
                    className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer border border-white/20"
                    aria-label={isVideoPlaying ? "Pause video" : "Play video"}
                  >
                    {isVideoPlaying ? (
                      <Pause className="w-5 h-5 fill-white" />
                    ) : (
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    )}
                  </button>
                )}

                {/* Card Content */}
                <div className="relative z-10 p-8 sm:p-12 md:p-16 flex flex-col justify-between min-h-[460px] md:min-h-[520px]">
                  <div className="max-w-[800px]">
                    {/* Blue Kicker */}
                    <span className="text-[#0071e3] font-black uppercase text-xs sm:text-sm tracking-widest block mb-3">
                      {product.overviewBanner?.badge || product.badge || "1-INCH CMOS POCKET GIMBAL CAMERA"}
                    </span>

                    {/* Big Headline */}
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-4">
                      {product.overviewBanner?.title || "Pocket Gimbal Power."}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-[700px] leading-[1.6]">
                      {product.overviewBanner?.description || product.tagline || product.description}
                    </p>
                  </div>

                  {/* 5-Column Stats Bar (Screenshot 1) */}
                  {overviewStats.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-0">
                      {overviewStats.map((st: any, sIdx: number) => (
                        <div
                          key={sIdx}
                          className="md:border-r md:border-white/15 md:last:border-r-0 md:px-6 md:first:pl-0 flex flex-col"
                        >
                          <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                            {st.value}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-300 font-semibold mt-1">
                            {st.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bento Feature Highlight Cards (Screenshot 2) */}
              {featureCardsList.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {featureCardsList.map((card: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-[24px] border border-gray-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                    >
                      {/* Card Top Image */}
                      <div className="aspect-[16/10] bg-[#0c0c0e] relative overflow-hidden flex items-center justify-center">
                        {card.image ? (
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <Camera className="w-12 h-12" />
                          </div>
                        )}
                        {card.tag && (
                          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
                            {card.tag}
                          </span>
                        )}
                      </div>

                      {/* Card Bottom Text */}
                      <div className="p-6 md:p-7 flex flex-col flex-1 justify-between bg-white">
                        <div>
                          <h3 className="text-[22px] font-black text-[#121212] mb-2 leading-tight">
                            {card.title}
                          </h3>
                          <p className="text-[14px] text-gray-600 leading-[1.6]">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Visual Feature Story Blocks (Deep Technical Storytelling) */}
              {storyBlocksList.length > 0 && (
                <div className="space-y-[32px] pt-4">
                  <div className="text-center max-w-[700px] mx-auto mb-8">
                    <span className="text-[#0071e3] font-black uppercase text-xs tracking-widest block mb-2">
                      IN-DEPTH ARCHITECTURE
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#121212]">
                      Engineered for Perfection.
                    </h2>
                    <p className="text-[15px] text-gray-500 mt-2">
                      Explore the cutting-edge hardware innovations inside the most advanced pocket gimbal camera ever created.
                    </p>
                  </div>

                  {storyBlocksList.map((block: any, bIdx: number) => {
                    const isEven = bIdx % 2 === 0;
                    return (
                      <div
                        key={bIdx}
                        className="bg-[#fbfbfd] border border-gray-200/90 rounded-[28px] p-6 sm:p-10 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs hover:shadow-md transition-shadow"
                      >
                        <div
                          className={`lg:col-span-6 relative aspect-[16/10] bg-black rounded-[22px] overflow-hidden group shadow-md ${
                            !isEven ? "lg:order-2" : ""
                          }`}
                        >
                          <img
                            src={block.image || product.mainImage}
                            alt={block.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          {block.badge && (
                            <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-black tracking-wider uppercase border border-white/10">
                              {block.badge}
                            </span>
                          )}
                        </div>

                        <div
                          className={`lg:col-span-6 space-y-4 ${
                            !isEven ? "lg:order-1" : ""
                          }`}
                        >
                          {block.tag && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0071e3] text-xs font-black uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5" />
                              {block.tag}
                            </span>
                          )}
                          <h3 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight leading-tight">
                            {block.title}
                          </h3>
                          <p className="text-[15px] sm:text-[16px] text-gray-600 leading-[1.7]">
                            {block.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Hardware Performance & Battery Matrix */}
              <div className="pt-6">
                <div className="text-center max-w-[700px] mx-auto mb-8">
                  <span className="text-[#0071e3] font-black uppercase text-xs tracking-widest block mb-2">
                    HARDWARE PERFORMANCE
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#121212]">
                    Unmatched Endurance &amp; Efficiency
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {hardwarePerformanceList.map((hp, idx) => {
                    const IconComponent = hp.icon;
                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-[22px] p-6 border border-gray-200/90 shadow-xs hover:border-[#0071e3]/40 hover:shadow-lg transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-12 h-12 rounded-[14px] bg-blue-50 text-[#0071e3] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="text-3xl font-black text-[#121212] tracking-tight">
                            {hp.stat}
                          </div>
                          <div className="text-[13px] font-bold text-[#0071e3] mt-1 uppercase tracking-wide">
                            {hp.subtitle}
                          </div>
                          <h4 className="text-[17px] font-bold text-[#121212] mt-3">
                            {hp.title}
                          </h4>
                          <p className="text-[13px] text-gray-500 mt-2 leading-[1.6]">
                            {hp.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Optional Interactive Video Showcases (if defined on product) */}
            {product.videoShowcases && product.videoShowcases.length > 0 && (
              <section id="videos" className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] pb-[64px] space-y-[48px]">
                {product.videoShowcases.map((showcase: any, idx: number) => {
                  const isEven = idx % 2 === 0;
                  const isDark = idx === 1;
                  return (
                    <div
                      key={showcase.id || idx}
                      className={`${
                        isDark
                          ? "bg-[#121212] text-white"
                          : "bg-[#f8f8fa] border border-gray-200/80 text-[#121212]"
                      } rounded-[28px] p-[24px] md:p-[48px] ${
                        showcase.modes
                          ? "text-center space-y-[24px]"
                          : "grid grid-cols-1 lg:grid-cols-12 gap-[32px] items-center"
                      }`}
                    >
                      {showcase.modes ? (
                        <>
                          <div className="max-w-[700px] mx-auto">
                            <span className={`text-[12px] font-black uppercase tracking-wider block mb-2 ${isDark ? "text-blue-400" : "text-[#0071e3]"}`}>
                              Feature Spotlight
                            </span>
                            <h3 style={{ fontSize: "32px" }} className={`font-extrabold ${isDark ? "text-white" : "text-[#121212]"}`}>
                              {showcase.title}
                            </h3>
                            {showcase.description && (
                              <p style={{ fontSize: "15px" }} className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                {showcase.description}
                              </p>
                            )}
                          </div>

                          <div className="max-w-[900px] mx-auto aspect-video rounded-[22px] overflow-hidden bg-black relative shadow-2xl group">
                            <video
                              autoPlay
                              muted
                              loop
                              playsInline
                              className="w-full h-full object-cover"
                              src={showcase.videoUrl}
                            />
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                            {showcase.modes.map((modeName: string, mIdx: number) => (
                              <span
                                key={mIdx}
                                className={`px-4 py-2 rounded-full text-[13px] font-bold ${
                                  isDark
                                    ? "bg-white/10 text-gray-200 border border-white/15"
                                    : "bg-white text-gray-800 border border-gray-200 shadow-xs"
                                }`}
                              >
                                {modeName}
                              </span>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={`lg:col-span-6 relative aspect-[16/11] bg-black rounded-[22px] overflow-hidden group ${!isEven ? "lg:order-2" : ""}`}>
                            <video
                              autoPlay
                              muted
                              loop
                              playsInline
                              className="w-full h-full object-cover"
                              src={showcase.videoUrl}
                            />
                          </div>
                          <div className={`lg:col-span-6 space-y-[20px] ${!isEven ? "lg:order-1" : ""}`}>
                            <span className={`text-[12px] font-black uppercase tracking-wider ${isDark ? "text-blue-400" : "text-[#0071e3]"}`}>
                              Intelligent Technology
                            </span>
                            <h3 style={{ fontSize: "32px" }} className={`font-extrabold ${isDark ? "text-white" : "text-[#121212]"} leading-[1.2]`}>
                              {showcase.title}
                            </h3>
                            {showcase.description && (
                              <p style={{ fontSize: "16px" }} className={`${isDark ? "text-gray-300" : "text-gray-600"} leading-[1.6]`}>
                                {showcase.description}
                              </p>
                            )}
                            {showcase.subcards && showcase.subcards.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                {showcase.subcards.map((sc: any, scIdx: number) => (
                                  <div
                                    key={scIdx}
                                    className={`${
                                      isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-200 text-[#121212]"
                                    } p-4 rounded-[14px] border shadow-xs`}
                                  >
                                    <div className="font-bold text-[15px]">{sc.title}</div>
                                    <div className={`text-[13px] mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{sc.description}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </section>
            )}

            {/* Section 2: In the Box (Detailed Combos, Matrix & Gear Spotlight) */}
            {activeInTheBoxItems.length > 0 && (
              <section id="in-the-box" className="bg-[#fbfbfd] border-y border-gray-200/80 py-[64px] space-y-[48px]">
                <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px]">
                  {/* Section Header */}
                  <div className="text-center max-w-[700px] mx-auto mb-10">
                    <span className="text-[#0071e3] font-black uppercase text-xs tracking-widest block mb-2">
                      PACKAGE CONTENTS &amp; COMBOS
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#121212]">
                      What&apos;s in the Box
                    </h2>
                    <p className="text-[15px] text-gray-500 mt-2">
                      Choose the kit that matches your creative workflow. Compare combos and see every included component.
                    </p>
                  </div>

                  {/* Compare Pills Bar */}
                  {inTheBoxKeys.length > 0 && (
                    <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
                      <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-gray-500">
                        SELECT KIT:
                      </span>
                      {inTheBoxKeys.map((k) => {
                        const isSelected = inTheBoxTab.toLowerCase() === k.toLowerCase();
                        const label = formatVariantLabel(k);
                        const count = (product.inTheBoxVariants && product.inTheBoxVariants[k]?.length) || 0;
                        return (
                          <button
                            key={k}
                            type="button"
                            onClick={() => {
                              setInTheBoxTab(k);
                              if (product.variants && product.variants.length > 0) {
                                const match = product.variants.find(
                                  (v: any) =>
                                    v.name.toLowerCase().includes(k.toLowerCase()) ||
                                    v.variantId === k ||
                                    v.sku === k
                                );
                                if (match) setSelectedVariant(match.variantId || match.name);
                              }
                            }}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer shadow-xs flex items-center gap-2 ${
                              isSelected
                                ? "bg-[#0071e3] text-white"
                                : "bg-[#e5e5ea] text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            <span>{label}</span>
                            {count > 0 && (
                              <span
                                className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                                  isSelected ? "bg-white/25 text-white" : "bg-white text-gray-700"
                                }`}
                              >
                                {count} Items
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* 6-Column Item Cutout Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {activeInTheBoxItems.map((item: any, idx: number) => {
                      const titleStr = typeof item === "string" ? item : item.title;
                      const imgStr = typeof item === "string" ? product.mainImage : item.image || product.mainImage;
                      const qty = typeof item === "object" ? item.qty : undefined;
                      const desc = typeof item === "object" ? item.description : undefined;
                      const role = typeof item === "object" ? item.role : undefined;
                      return (
                        <div
                          key={idx}
                          className="bg-white rounded-[22px] p-5 border border-gray-200/90 flex flex-col items-center justify-between min-h-[240px] shadow-xs hover:shadow-md transition-shadow relative group"
                        >
                          <div className="w-full flex items-center justify-between absolute top-3 px-3">
                            {role ? (
                              <span className="text-[10px] font-black uppercase tracking-wider text-[#0071e3] bg-blue-50 px-2 py-0.5 rounded-md truncate max-w-[100px]">
                                {role}
                              </span>
                            ) : <span />}
                            {qty && qty > 1 && (
                              <span className="text-[11px] font-black bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                {qty}x
                              </span>
                            )}
                          </div>

                          <div className="w-full h-[120px] flex items-center justify-center p-2 mt-4 mb-2">
                            <img
                              src={imgStr}
                              alt={titleStr}
                              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                            />
                          </div>

                          <div className="w-full text-center">
                            <span className="text-[13px] font-bold text-[#121212] leading-[1.3] line-clamp-2 block">
                              {titleStr}
                            </span>
                            {desc && (
                              <span className="text-[11px] text-gray-500 line-clamp-1 mt-1 block">
                                {desc}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Combo Comparison Matrix Table (Side-by-Side Breakdown) */}
                  {allComparisonItems.length > 0 && (
                    <div className="mt-14 bg-white rounded-[24px] border border-gray-200/90 overflow-hidden shadow-xs">
                      <div className="p-6 md:p-8 bg-[#fafafa] border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-xs font-black uppercase text-[#0071e3] tracking-widest block mb-1">
                            SIDE-BY-SIDE MATRIX
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black text-[#121212]">
                            Combo Comparison Breakdown
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Compare all {allComparisonItems.length} components across Standard and Creator configurations.
                          </p>
                        </div>
                        <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-bold">
                          Save $245 AUD with Creator Combo
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200 bg-white">
                              <th className="py-4 px-6 text-sm font-bold text-gray-600 w-1/2">
                                Included Component
                              </th>
                              <th className="py-4 px-6 text-sm font-black text-[#121212] text-center w-1/4 bg-gray-50/50">
                                Standard Combo
                                <div className="text-xs font-semibold text-gray-500 mt-0.5">$769 AUD</div>
                              </th>
                              <th className="py-4 px-6 text-sm font-black text-[#0071e3] text-center w-1/4 bg-blue-50/30">
                                Creator Combo
                                <div className="text-xs font-bold text-[#0071e3] mt-0.5">$1,029 AUD</div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {allComparisonItems.map((item, idx) => (
                              <tr
                                key={idx}
                                className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors"
                              >
                                <td className="py-3.5 px-6 text-sm font-medium text-[#121212] flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 p-1 flex items-center justify-center flex-shrink-0">
                                    <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                                  </div>
                                  <span>{item.title}</span>
                                </td>
                                <td className="py-3.5 px-6 text-center bg-gray-50/30">
                                  {item.stdIncluded ? (
                                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-full">
                                      <Check className="w-3.5 h-3.5" />
                                      {item.stdQty > 1 ? `${item.stdQty}x` : "Included"}
                                    </span>
                                  ) : (
                                    <span className="text-gray-300 font-bold">—</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-6 text-center bg-blue-50/20">
                                  {item.crtIncluded ? (
                                    <span className="inline-flex items-center gap-1 text-[#0071e3] font-bold text-xs bg-blue-50 px-2.5 py-1 rounded-full">
                                      <Check className="w-3.5 h-3.5" />
                                      {item.crtQty > 1 ? `${item.crtQty}x` : "Included"}
                                    </span>
                                  ) : (
                                    <span className="text-gray-300 font-bold">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Included Gear Spotlight Cards */}
                  <div className="mt-14">
                    <div className="text-center max-w-[700px] mx-auto mb-8">
                      <span className="text-[#0071e3] font-black uppercase text-xs tracking-widest block mb-2">
                        ESSENTIAL ACCESSORY SPOTLIGHT
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-[#121212]">
                        Why These Add-Ons Matter
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Engineered specifically for the Osmo Pocket 4 to extend shooting time and audio fidelity.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {gearSpotlightList.map((gear, gIdx) => (
                        <div
                          key={gIdx}
                          className="bg-white rounded-[22px] border border-gray-200/90 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all group"
                        >
                          <div>
                            <span className="text-[11px] font-black uppercase tracking-wider text-[#0071e3] bg-blue-50 px-2.5 py-1 rounded-full inline-block mb-3">
                              {gear.highlight}
                            </span>
                            <div className="w-full h-[140px] flex items-center justify-center p-2 mb-4 bg-[#f8f8fa] rounded-[16px]">
                              <img
                                src={gear.image}
                                alt={gear.title}
                                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <h4 className="text-[17px] font-black text-[#121212] leading-snug">
                              {gear.title}
                            </h4>
                            <p className="text-[12px] font-bold text-emerald-600 mt-1">
                              {gear.subtitle}
                            </p>
                            <p className="text-[13px] text-gray-600 mt-2.5 leading-[1.6]">
                              {gear.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Section 3: Technical Specifications (Deep 36-Parameter Specs Table) */}
            {rawSpecsList.length > 0 && (
              <section id="specifications" className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[64px]">
                <div className="text-center max-w-[700px] mx-auto mb-[36px]">
                  <span className="text-[#0071e3] font-black uppercase text-xs tracking-widest block mb-2">
                    TECHNICAL DATA &amp; PARAMETERS
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#121212]">
                    Full Specifications
                  </h2>
                  <p className="text-[15px] text-gray-500 mt-2">
                    Complete technical breakdown across {rawSpecsList.length} engineering parameters for {product.name}.
                  </p>
                </div>

                {/* Specs Live Search & Controls */}
                <div className="max-w-[700px] mx-auto mb-8">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={specSearch}
                      onChange={(e) => setSpecSearch(e.target.value)}
                      placeholder={`Search ${rawSpecsList.length} specifications... (e.g. "sensor", "battery", "weight", "shutter")`}
                      className="w-full pl-12 pr-10 py-3.5 rounded-full border border-gray-300 bg-white font-medium text-sm focus:outline-none focus:border-[#0071e3] shadow-xs"
                    />
                    {specSearch && (
                      <button
                        type="button"
                        onClick={() => setSpecSearch("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        aria-label="Clear specification search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {specSearch && (
                    <div className="text-xs text-gray-500 font-semibold mt-2 text-center">
                      Showing {filteredRawSpecs.length} of {rawSpecsList.length} matching parameters
                    </div>
                  )}
                </div>

                {/* Category Filter Pills */}
                {specGroups.length > 1 && (
                  <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar mb-8 flex-wrap">
                    {specGroups.map((cat) => {
                      const count =
                        cat === "All"
                          ? rawSpecsList.length
                          : rawSpecsList.filter((s) => s.group.toLowerCase() === cat.toLowerCase()).length;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedSpecTab(cat)}
                          className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            selectedSpecTab.toLowerCase() === cat.toLowerCase()
                              ? "bg-[#0071e3] text-white shadow-xs"
                              : "bg-[#f2f2f7] text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          <span>{cat}</span>
                          <span
                            className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                              selectedSpecTab.toLowerCase() === cat.toLowerCase()
                                ? "bg-white/20 text-white"
                                : "bg-gray-300 text-gray-700"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Two-Column Clean High-Contrast Specs Table */}
                {filteredRawSpecs.length > 0 ? (
                  <div className="bg-white rounded-[24px] border border-gray-200/90 overflow-hidden shadow-xs">
                    {selectedSpecTab === "All" && !specSearch ? (
                      // Grouped by Category Headers
                      Object.entries(groupedFilteredSpecs).map(([grp, specs], gIdx) => (
                        <div key={grp} className={gIdx > 0 ? "border-t-2 border-gray-200" : ""}>
                          <div className="bg-[#f8f8fa] px-6 py-3.5 border-b border-gray-200 flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-widest text-[#0071e3]">
                              {grp} Specifications
                            </span>
                            <span className="text-xs font-bold text-gray-500">
                              {specs.length} items
                            </span>
                          </div>
                          <table className="w-full text-left border-collapse">
                            <tbody>
                              {specs.map((s, i) => (
                                <tr
                                  key={i}
                                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60 transition-colors"
                                >
                                  <th className="py-4 px-6 font-bold text-[#121212] w-1/3 sm:w-1/4 text-[14px] bg-[#fafafa]/50 align-top">
                                    {s.label}
                                  </th>
                                  <td
                                    className="py-4 px-6 text-gray-700 text-[14px] leading-[1.6]"
                                    dangerouslySetInnerHTML={{ __html: s.value }}
                                  />
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))
                    ) : (
                      // Flat Filtered / Searched Specs
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          {filteredRawSpecs.map((s, i) => (
                            <tr
                              key={i}
                              className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60 transition-colors"
                            >
                              <th className="py-4 px-6 font-bold text-[#121212] w-1/3 sm:w-1/4 text-[14px] bg-[#fafafa]/50 align-top">
                                <span className="block">{s.label}</span>
                                <span className="text-[11px] text-gray-400 font-normal uppercase tracking-wider">
                                  {s.group}
                                </span>
                              </th>
                              <td
                                className="py-4 px-6 text-gray-700 text-[14px] leading-[1.6]"
                                dangerouslySetInnerHTML={{ __html: s.value }}
                              />
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-[24px] border border-gray-200 p-12 text-center">
                    <p className="text-base text-gray-600 font-medium">
                      No technical specifications matched &ldquo;{specSearch}&rdquo;.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSpecSearch("");
                        setSelectedSpecTab("All");
                      }}
                      className="mt-4 px-5 py-2 rounded-full bg-[#0071e3] text-white text-xs font-bold hover:bg-[#0058b8] cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </div>
                )}

                {/* PDF & Support Callout */}
                <div className="mt-8 bg-blue-50/60 border border-blue-200/80 rounded-[20px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0071e3] text-white flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#121212]">
                        Looking for the complete manual or compliance certifications?
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Download the full Australian warranty documentation and regulatory conformity sheets.
                      </p>
                    </div>
                  </div>
                  <a
                    href="mailto:support@d1store.com.au?subject=DJI Osmo Pocket 4 Spec Sheet Request"
                    className="px-5 py-2 rounded-full bg-white border border-gray-300 text-gray-800 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap shadow-xs"
                  >
                    <Download className="w-4 h-4 text-[#0071e3]" />
                    <span>Request PDF Specs</span>
                  </a>
                </div>
              </section>
            )}

            {/* Section 4: FAQs (16 In-Depth Answers across 6 Categories) */}
            {faqsList.length > 0 && (
              <section id="faqs" className="bg-[#fbfbfd] border-t border-gray-200/80 py-[64px]">
                <div className="max-w-[1000px] mx-auto px-[16px] md:px-[36px]">
                  <div className="text-center mb-[36px]">
                    <span className="text-[#0071e3] font-black uppercase text-xs tracking-widest block mb-2">
                      KNOWLEDGE BASE &amp; SUPPORT
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#121212]">
                      Frequently Asked Questions
                    </h2>
                    <p className="text-[15px] text-gray-500 mt-2">
                      Got questions? We&apos;ve got answers. Browse our complete library of {faqsList.length} verified answers for {product.name}.
                    </p>
                  </div>

                  {/* FAQ Search Bar */}
                  <div className="relative mb-6">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      placeholder={`Search all ${faqsList.length} questions... (e.g. "mic", "waterproof", "battery", "sd card")`}
                      className="w-full pl-12 pr-10 py-3.5 rounded-full border border-gray-300 bg-white font-medium text-sm focus:outline-none focus:border-[#0071e3] shadow-xs"
                    />
                    {faqSearch && (
                      <button
                        type="button"
                        onClick={() => setFaqSearch("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        aria-label="Clear FAQ search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* FAQ Category Pills */}
                  {faqCategories.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6 pb-1 flex-wrap">
                      {faqCategories.map((cat) => {
                        const count =
                          cat === "All"
                            ? faqsList.length
                            : faqsList.filter(
                                (f: any) =>
                                  (f.group || f.category || "General").toLowerCase() === cat.toLowerCase()
                              ).length;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFaqCategory(cat)}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                              faqCategory.toLowerCase() === cat.toLowerCase()
                                ? "bg-[#0071e3] text-white shadow-xs"
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {cat} ({count})
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Quick Action Bar: Results count & Expand/Collapse All */}
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-4 px-1">
                    <span>
                      Showing {filteredFaqs.length} of {faqsList.length} questions
                    </span>
                    {filteredFaqs.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleToggleAllFaqs(filteredFaqs.map((_, i) => i))}
                        className="text-[#0071e3] hover:underline cursor-pointer"
                      >
                        {filteredFaqs.every((_, i) => openFaqIndices[i]) ? "Collapse All" : "Expand All"}
                      </button>
                    )}
                  </div>

                  {/* FAQs List */}
                  {filteredFaqs.length > 0 ? (
                    <div className="space-y-[12px]">
                      {filteredFaqs.map((faq: any, idx: number) => {
                        const isOpen = !!openFaqIndices[idx];
                        const grp = faq.group || faq.category || "General";
                        return (
                          <div
                            key={idx}
                            className={`bg-white rounded-[18px] border transition-all ${
                              isOpen
                                ? "border-[#0071e3]/40 shadow-md ring-1 ring-[#0071e3]/20"
                                : "border-gray-200/90 shadow-xs hover:border-gray-300"
                            } overflow-hidden`}
                          >
                            <button
                              type="button"
                              onClick={() => toggleFaq(idx)}
                              className="w-full py-5 px-6 flex items-start justify-between text-left font-bold text-[15px] sm:text-[16px] text-[#121212] hover:text-[#0071e3] transition-colors cursor-pointer gap-4"
                            >
                              <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-black uppercase tracking-wider text-[#0071e3]">
                                  {grp}
                                </span>
                                <span>{faq.question}</span>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1">
                                {isOpen ? (
                                  <ChevronUp className="w-4 h-4 text-[#0071e3]" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                              </div>
                            </button>
                            {isOpen && (
                              <div
                                className="px-6 pb-6 pt-2 text-gray-600 text-[14px] leading-[1.7] border-t border-gray-100 bg-[#fafafa]/50"
                                dangerouslySetInnerHTML={{ __html: faq.answer }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white rounded-[20px] border border-gray-200 p-10 text-center">
                      <p className="text-gray-600 font-medium">
                        No questions matched your search &ldquo;{faqSearch}&rdquo;.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setFaqSearch("");
                          setFaqCategory("All");
                        }}
                        className="mt-4 px-5 py-2 rounded-full bg-[#0071e3] text-white text-xs font-bold hover:bg-[#0058b8] cursor-pointer"
                      >
                        View All FAQs
                      </button>
                    </div>
                  )}

                  {/* D1 Store Australian Support & Expert Assistance Card */}
                  <div className="mt-12 bg-white border border-gray-200/90 rounded-[24px] p-6 sm:p-8 shadow-xs">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div>
                        <span className="text-xs font-black uppercase text-[#0071e3] tracking-widest block mb-1">
                          AUSTRALIAN DJI SPECIALISTS
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-[#121212]">
                          Still Have Questions?
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 max-w-[500px]">
                          Speak directly with our local Australian drone and gimbal specialists for personalised product advice.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <a
                          href="tel:0392887882"
                          className="px-5 py-2.5 rounded-full bg-[#121212] hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>(03) 9288 7882</span>
                        </a>
                        <a
                          href="mailto:sales@d1store.com.au"
                          className="px-5 py-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0071e3] text-xs font-bold flex items-center gap-2 shadow-xs"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>sales@d1store.com.au</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STYLE 2: BUNDLE EXPERIENCE (Like osmo-pocket-4p-ultimate-combo) */}
        {/* ========================================================================= */}
        {tier === "bundle" && (
          <div className="w-full mt-[40px]">
            {/* Section Sub-Navbar */}
            <div className="w-full bg-white border-y border-gray-200 py-3">
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
            {/* Section Sub-Navbar */}
            <div className="w-full bg-white border-y border-gray-200 py-3">
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
