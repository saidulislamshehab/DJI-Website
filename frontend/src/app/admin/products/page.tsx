"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchProducts,
  fetchCategories,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "@/lib/api";
import { IProduct, ICategory } from "@/types";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterTier, setFilterTier] = useState<"all" | "product" | "bundle" | "accessory" | "new_arrival" | "low_stock">("all");
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<"general" | "overview" | "inTheBox" | "specsFaq">("general");

  const [formData, setFormData] = useState<Partial<IProduct>>({
    name: "",
    slug: "",
    sku: "",
    category: "DJI Drones",
    categorySlug: "drones",
    price: 999,
    originalPrice: 1099,
    stockCount: 15,
    inStock: true,
    tier: "product",
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
    badge: "",
    mainImage: "",
    description: "",
    features: [],
  });
  const [featuresInput, setFeaturesInput] = useState("");
  const [modalError, setModalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Overview Banner state
  const [overviewKicker, setOverviewKicker] = useState("");
  const [overviewTitle, setOverviewTitle] = useState("");
  const [overviewDesc, setOverviewDesc] = useState("");
  const [overviewBgImage, setOverviewBgImage] = useState("");
  const [overviewVideoUrl, setOverviewVideoUrl] = useState("");
  const [overviewStats, setOverviewStats] = useState<[string, string][]>([
    ["Sensor", "1in"],
    ["Video", "4K/240"],
    ["HDR", "14-Stop"],
    ["D-Log", "10-bit"],
    ["Built-in Storage", "107gb"],
  ]);

  // Bento Feature Cards
  const [featureCards, setFeatureCards] = useState<
    { title: string; description: string; image: string; tag?: string }[]
  >([
    {
      title: "Rotatable Screen",
      description: "Flip the touchscreen to start recording fast and keep framing simple when you're shooting solo.",
      image: "",
      tag: "OLED Display",
    },
    {
      title: "Pocket Form",
      description: "Small enough to carry anywhere, yet capable enough for proper content work.",
      image: "",
      tag: "Ultra Portable",
    },
    {
      title: "Lossless Zoom",
      description: "Switch views quickly and keep your subject looking crisp from further back.",
      image: "",
      tag: "Pure Optics",
    },
  ]);

  // In the Box combos
  const [inTheBoxStandardInput, setInTheBoxStandardInput] = useState("");
  const [inTheBoxCreatorInput, setInTheBoxCreatorInput] = useState("");

  // Technical Specs & FAQs
  const [rawSpecsInput, setRawSpecsInput] = useState("");
  const [faqsInput, setFaqsInput] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        fetchProducts({ limit: 100 }),
        fetchCategories(),
      ]);
      setProducts(prodsRes.products);
      setCategories(catsRes);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setActiveAdminTab("general");
    setFormData({
      name: "",
      slug: "",
      sku: "DJI-PROD-" + Math.floor(1000 + Math.random() * 9000),
      category: categories[0]?.name || "DJI Drones",
      categorySlug: categories[0]?.slug || "drones",
      price: 999,
      originalPrice: 1099,
      stockCount: 20,
      inStock: true,
      tier: "product",
      isNewArrival: true,
      isFeatured: false,
      isBestSeller: false,
      badge: "New",
      mainImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/cc2128f7-0a63-4b8c-924b-d37d38f8b2e6/005-website-categoryimages-mavic4p-fa.webp",
      description: "High-performance authentic DJI product with local Australian warranty.",
      features: ["Advanced 4K Camera", "Omnidirectional Obstacle Sensing", "Up to 45 Mins Flight Time"],
    });
    setFeaturesInput("Advanced 4K Camera\nOmnidirectional Obstacle Sensing\nUp to 45 Mins Flight Time");
    setOverviewKicker("1-INCH CMOS POCKET GIMBAL CAMERA");
    setOverviewTitle("Pocket Gimbal Power.");
    setOverviewDesc("Shoot anytime, anywhere with a large sensor and high framerate recording.");
    setOverviewBgImage("");
    setOverviewVideoUrl("");
    setOverviewStats([
      ["Sensor", "1in"],
      ["Video", "4K/240"],
      ["HDR", "14-Stop"],
      ["D-Log", "10-bit"],
      ["Built-in Storage", "107gb"],
    ]);
    setFeatureCards([
      {
        title: "Rotatable Screen",
        description: "Flip the touchscreen to start recording fast and keep framing simple when you're shooting solo.",
        image: "",
        tag: "OLED Display",
      },
      {
        title: "Pocket Form",
        description: "Small enough to carry anywhere, yet capable enough for proper content work.",
        image: "",
        tag: "Ultra Portable",
      },
      {
        title: "Lossless Zoom",
        description: "Switch views quickly and keep your subject looking crisp from further back.",
        image: "",
        tag: "Pure Optics",
      },
    ]);
    setInTheBoxStandardInput("DJI Core Unit\nProtective Cover\nWrist Strap\nUSB-C Cable");
    setInTheBoxCreatorInput("DJI Core Unit\nDJI Mic 2 Transmitter\nBattery Handle\nMini Tripod\nCarrying Case");
    setRawSpecsInput("General | Dimensions | 139.7 × 42.2 × 33.5 mm\nGeneral | Weight | 179 g\nCamera | Sensor | 1-inch CMOS\nBattery | Operating Time | 166 mins");
    setFaqsInput("General | What are the key upgrades? | Larger sensor, 4K/240 slow motion, and built-in storage.\nBattery | How fast does it charge? | Reaches 80% in 16 minutes with a 65W PD fast charger.");
    setModalError("");
    setIsModalOpen(true);
  };

  const openEditModal = (p: IProduct) => {
    setEditingProduct(p);
    setActiveAdminTab("general");
    setFormData({
      ...p,
      tier: p.tier || "product",
      isNewArrival: !!p.isNewArrival,
      isFeatured: !!p.isFeatured,
      isBestSeller: !!p.isBestSeller,
    });
    setFeaturesInput(p.features ? p.features.join("\n") : "");

    // Overview banner
    setOverviewKicker(p.overviewBanner?.badge || "");
    setOverviewTitle(p.overviewBanner?.title || p.name || "");
    setOverviewDesc(p.overviewBanner?.description || p.description || "");
    setOverviewBgImage(p.overviewBanner?.bgImage || "");
    setOverviewVideoUrl(p.overviewBanner?.videoUrl || "");

    if (p.overviewBanner?.stats && p.overviewBanner.stats.length > 0) {
      setOverviewStats(
        p.overviewBanner.stats.map((s) => [s.label, s.value] as [string, string])
      );
    } else {
      setOverviewStats([
        ["Sensor", "1in"],
        ["Video", "4K/240"],
        ["HDR", "14-Stop"],
        ["D-Log", "10-bit"],
        ["Built-in Storage", "107gb"],
      ]);
    }

    // Feature Cards
    if (p.featureCards && p.featureCards.length === 3) {
      setFeatureCards(p.featureCards);
    } else {
      setFeatureCards([
        {
          title: "Rotatable Screen",
          description: "Flip the touchscreen to start recording fast and keep framing simple.",
          image: p.images?.[1] || "",
          tag: "OLED Display",
        },
        {
          title: "Pocket Form",
          description: "Small enough to carry anywhere, yet capable enough for proper content work.",
          image: p.images?.[2] || "",
          tag: "Ultra Portable",
        },
        {
          title: "Lossless Zoom",
          description: "Switch views quickly and keep your subject looking crisp from further back.",
          image: p.images?.[3] || "",
          tag: "Pure Optics",
        },
      ]);
    }

    // In the box combos
    const stdItems = (p.inTheBoxVariants?.standard || p.inTheBox || []).map(
      (it: any) => (typeof it === "string" ? it : it.title)
    );
    setInTheBoxStandardInput(stdItems.join("\n"));

    const creatorItems = (p.inTheBoxVariants?.creator || p.inTheBoxVariants?.vlog || []).map(
      (it: any) => (typeof it === "string" ? it : it.title)
    );
    setInTheBoxCreatorInput(creatorItems.join("\n"));

    // Raw Specs
    if (p.rawSpecs && p.rawSpecs.length > 0) {
      setRawSpecsInput(p.rawSpecs.map((s) => `${s.group} | ${s.label} | ${s.value}`).join("\n"));
    } else if (p.specs && typeof p.specs === "object") {
      const lines: string[] = [];
      Object.entries(p.specs).forEach(([k, v]) => {
        lines.push(`General | ${k} | ${String(v)}`);
      });
      setRawSpecsInput(lines.join("\n"));
    } else {
      setRawSpecsInput("");
    }

    // FAQs
    if (p.faqs && p.faqs.length > 0) {
      setFaqsInput(p.faqs.map((f: any) => `${f.group || f.category || "General"} | ${f.question} | ${f.answer}`).join("\n"));
    } else {
      setFaqsInput("");
    }

    setModalError("");
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!formData.name || !formData.price) {
      setModalError("Please provide at least a Product Name and Price.");
      return;
    }

    const autoSlug =
      formData.slug?.trim() ||
      formData.name
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const parsedFeatures = featuresInput
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const parsedRawSpecs = rawSpecsInput
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const parts = l.split("|").map((p) => p.trim());
        return {
          group: parts[0] || "General",
          label: parts[1] || "",
          value: parts.slice(2).join(" | ") || "",
        };
      })
      .filter((s) => s.label);

    const parsedFaqs = faqsInput
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const parts = l.split("|").map((p) => p.trim());
        return {
          group: parts[0] || "General",
          question: parts[1] || "",
          answer: parts.slice(2).join(" | ") || "",
        };
      })
      .filter((f) => f.question);

    const stdItems = inTheBoxStandardInput
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((title) => {
        const existing = (editingProduct?.inTheBoxVariants?.standard || []).find(
          (it: any) => (typeof it === "string" ? it : it.title) === title
        );
        return {
          title,
          image: (existing && typeof existing === "object" ? existing.image : "") || formData.mainImage || "",
        };
      });

    const creatorItems = inTheBoxCreatorInput
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((title) => {
        const existing = (editingProduct?.inTheBoxVariants?.creator || []).find(
          (it: any) => (typeof it === "string" ? it : it.title) === title
        );
        return {
          title,
          image: (existing && typeof existing === "object" ? existing.image : "") || formData.mainImage || "",
        };
      });

    const payload: Partial<IProduct> = {
      ...formData,
      slug: autoSlug,
      features: parsedFeatures,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stockCount: Number(formData.stockCount || 0),
      inStock: Number(formData.stockCount || 0) > 0,
      images: formData.mainImage ? [formData.mainImage] : [],
      overviewBanner: {
        badge: overviewKicker || "OFFICIAL DJI INNOVATION",
        title: overviewTitle || formData.name || "",
        description: overviewDesc || formData.description || "",
        bgImage: overviewBgImage || formData.mainImage || "",
        videoUrl: overviewVideoUrl || "",
        stats: overviewStats.map(([label, value]) => ({ label, value })),
      },
      featureCards: featureCards.filter((c) => c.title),
      inTheBoxVariants: {
        standard: stdItems,
        creator: creatorItems,
      },
      rawSpecs: parsedRawSpecs,
      faqs: parsedFaqs,
    };

    setIsSubmitting(true);
    try {
      if (editingProduct && (editingProduct._id || editingProduct.slug)) {
        const id = editingProduct._id || editingProduct.slug;
        await updateProductApi(id, payload);
      } else {
        await createProductApi(payload);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      console.error("Save error:", err);
      setModalError("Failed to save product. Ensure slug and sku are unique.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStock = async (p: IProduct) => {
    const id = p._id || p.slug;
    const newInStock = !p.inStock;
    const newStockCount = newInStock ? Math.max(p.stockCount, 5) : 0;
    try {
      await updateProductApi(id, { inStock: newInStock, stockCount: newStockCount });
      setProducts((prev) =>
        prev.map((item) =>
          item._id === p._id ? { ...item, inStock: newInStock, stockCount: newStockCount } : item
        )
      );
    } catch (err) {
      console.error("Failed to update stock:", err);
    }
  };

  const handleUpdateStockCount = async (p: IProduct, delta: number) => {
    const id = p._id || p.slug;
    const newCount = Math.max(0, p.stockCount + delta);
    const newInStock = newCount > 0;
    try {
      await updateProductApi(id, { stockCount: newCount, inStock: newInStock });
      setProducts((prev) =>
        prev.map((item) =>
          item._id === p._id ? { ...item, stockCount: newCount, inStock: newInStock } : item
        )
      );
    } catch (err) {
      console.error("Failed to update stock count:", err);
    }
  };

  const handleDeleteProduct = async (p: IProduct) => {
    if (!confirm(`Are you sure you want to permanently delete "${p.name}"?`)) return;
    const id = p._id || p.slug;
    try {
      await deleteProductApi(id);
      setProducts((prev) => prev.filter((item) => item._id !== p._id && item.slug !== p.slug));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleToggleNewArrival = async (p: IProduct) => {
    const id = p._id || p.slug;
    const newStatus = !p.isNewArrival;
    try {
      await updateProductApi(id, { isNewArrival: newStatus });
      setProducts((prev) =>
        prev.map((item) =>
          item._id === p._id || item.slug === p.slug ? { ...item, isNewArrival: newStatus } : item
        )
      );
    } catch (err) {
      console.error("Failed to update new arrival status:", err);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      p.categorySlug === selectedCategory ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesTier =
      filterTier === "all" ||
      (filterTier === "new_arrival" && p.isNewArrival) ||
      (filterTier === "low_stock" && (p.stockCount <= 5 || !p.inStock)) ||
      (filterTier === "product" && (p.tier === "product" || !p.tier)) ||
      (filterTier === "bundle" && p.tier === "bundle") ||
      (filterTier === "accessory" && p.tier === "accessory");

    return matchesSearch && matchesCategory && matchesTier;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Product Catalog</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your store inventory, pricing, stock levels, and technical specifications
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col gap-4">
        {/* Tier & Classification Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "all", label: "All Items", count: products.length },
            { id: "product", label: "Standard Products", count: products.filter((p) => p.tier === "product" || !p.tier).length },
            { id: "bundle", label: "Bundles", count: products.filter((p) => p.tier === "bundle").length },
            { id: "accessory", label: "Accessories", count: products.filter((p) => p.tier === "accessory").length },
            { id: "new_arrival", label: "✨ New Arrivals", count: products.filter((p) => p.isNewArrival).length },
            { id: "low_stock", label: "Low Stock", count: products.filter((p) => p.stockCount <= 5 || !p.inStock).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTier(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterTier === tab.id
                  ? "bg-gray-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterTier === tab.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2 border-t border-gray-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, SKU or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#0071e3]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 hidden sm:block" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white focus:outline-hidden focus:border-[#0071e3]"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-bold">Loading product database...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-xs sm:text-sm">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            No products match the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase">
                  <th className="py-3.5 px-4">Product Info</th>
                  <th className="py-3.5 px-4">SKU / Slug</th>
                  <th className="py-3.5 px-4">Category & Tier</th>
                  <th className="py-3.5 px-4">Price (AUD)</th>
                  <th className="py-3.5 px-4">Stock Level</th>
                  <th className="py-3.5 px-4">New Arrival</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => (
                  <tr key={p._id || p.slug} className="hover:bg-gray-50/60 transition-colors">
                    {/* Product Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#f8f9fa] rounded-lg p-1 border border-gray-100 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={p.mainImage || (p.images && p.images[0])}
                            alt={p.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate max-w-xs">{p.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {p.badge && (
                              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-[#0071e3]">
                                {p.badge}
                              </span>
                            )}
                            {p.isFeatured && (
                              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SKU / Slug */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-700">{p.sku}</p>
                      <p className="text-[10px] text-gray-400 font-mono truncate max-w-[130px]">{p.slug}</p>
                    </td>

                    {/* Category & Tier */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium block w-fit">
                          {p.category}
                        </span>
                        {p.tier === "bundle" ? (
                          <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Bundle Combo
                          </span>
                        ) : p.tier === "accessory" ? (
                          <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            Accessory
                          </span>
                        ) : (
                          <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            Standard
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900">${p.price.toLocaleString()} AUD</p>
                      {p.originalPrice && (
                        <p className="text-[10px] text-gray-400 line-through">
                          ${p.originalPrice.toLocaleString()} AUD
                        </p>
                      )}
                    </td>

                    {/* Inventory Level Adjuster */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateStockCount(p, -1)}
                          className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs"
                          title="Decrease stock by 1"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-gray-900">{p.stockCount}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateStockCount(p, 1)}
                          className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs"
                          title="Increase stock by 1"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* New Arrival Quick Toggle */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleNewArrival(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          p.isNewArrival
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                        title="Click to toggle New Arrival status"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{p.isNewArrival ? "New Arrival" : "Standard"}</span>
                      </button>
                    </td>

                    {/* Stock Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          p.inStock
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {p.inStock ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{p.inStock ? "In Stock" : "Out of Stock"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                          title="View on store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  {editingProduct ? `Edit: ${editingProduct.name}` : "Add New DJI Product"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure core metadata, hero banner, bento cards, in-the-box combos, specifications, and FAQs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-100 py-3 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveAdminTab("general")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeAdminTab === "general"
                    ? "bg-[#0071e3] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                1. Basic Info
              </button>
              <button
                type="button"
                onClick={() => setActiveAdminTab("overview")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeAdminTab === "overview"
                    ? "bg-[#0071e3] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                2. Overview &amp; Bento Cards
              </button>
              <button
                type="button"
                onClick={() => setActiveAdminTab("inTheBox")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeAdminTab === "inTheBox"
                    ? "bg-[#0071e3] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                3. In The Box Combos
              </button>
              <button
                type="button"
                onClick={() => setActiveAdminTab("specsFaq")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeAdminTab === "specsFaq"
                    ? "bg-[#0071e3] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                4. Specs &amp; FAQs
              </button>
            </div>

            {modalError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4 text-xs sm:text-sm">
              {/* TAB 1: BASIC INFO */}
              {activeAdminTab === "general" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Catalog Tier */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Product Classification & Tier *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: "product", label: "Standard Product", desc: "Drone, Gimbal, Camera" },
                        { id: "bundle", label: "Bundle Package", desc: "Combo kit with extra gear" },
                        { id: "accessory", label: "Accessory / Part", desc: "Battery, Propellers, Bag" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, tier: t.id as any })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            (formData.tier || "product") === t.id
                              ? "bg-blue-50/80 border-[#0071e3] text-[#0071e3] shadow-xs"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <p className="font-bold text-xs">{t.label}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Badges & Homepage Placement */}
                  <div className="sm:col-span-2 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200">
                    <p className="text-xs font-bold text-gray-800 mb-2">Display Badges & Highlights</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-gray-200 cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={!!formData.isNewArrival}
                          onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                          className="w-4 h-4 text-[#0071e3] rounded"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 block">✨ New Arrival</span>
                          <span className="text-[10px] text-gray-500">Feature in What's New</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-gray-200 cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={!!formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="w-4 h-4 text-[#0071e3] rounded"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 block">⭐ Featured</span>
                          <span className="text-[10px] text-gray-500">Frontpage showcase</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-gray-200 cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={!!formData.isBestSeller}
                          onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                          className="w-4 h-4 text-[#0071e3] rounded"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 block">🔥 Best Seller</span>
                          <span className="text-[10px] text-gray-500">Popularity badge</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. DJI Osmo Pocket 4"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      value={formData.sku || ""}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Custom Slug</label>
                    <input
                      type="text"
                      value={formData.slug || ""}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="leave blank to auto-generate"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.categorySlug || "drones"}
                      onChange={(e) => {
                        const selected = categories.find((c) => c.slug === e.target.value);
                        setFormData({
                          ...formData,
                          categorySlug: e.target.value,
                          category: selected?.name || e.target.value,
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:border-[#0071e3]"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Badge (optional)</label>
                    <input
                      type="text"
                      value={formData.badge || ""}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. Official Release, Popular"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Price (AUD) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price || ""}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Original Price (AUD)</label>
                    <input
                      type="number"
                      value={formData.originalPrice || ""}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      placeholder="for discount strikethrough"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.stockCount ?? 10}
                      onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Main Image URL</label>
                    <input
                      type="url"
                      value={formData.mainImage || ""}
                      onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Key Bullet Features (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={featuresInput}
                      onChange={(e) => setFeaturesInput(e.target.value)}
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: OVERVIEW & BENTO CARDS */}
              {activeAdminTab === "overview" && (
                <div className="space-y-6">
                  {/* Hero Card Configuration */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0071e3]">
                      Hero Overview Dark Card
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Blue Kicker Headline</label>
                        <input
                          type="text"
                          value={overviewKicker}
                          onChange={(e) => setOverviewKicker(e.target.value)}
                          placeholder="e.g. 1-INCH CMOS POCKET GIMBAL CAMERA"
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Hero Main Title</label>
                        <input
                          type="text"
                          value={overviewTitle}
                          onChange={(e) => setOverviewTitle(e.target.value)}
                          placeholder="e.g. Pocket Gimbal Power."
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Hero Subtitle</label>
                        <textarea
                          rows={2}
                          value={overviewDesc}
                          onChange={(e) => setOverviewDesc(e.target.value)}
                          placeholder="Brief description underneath the headline..."
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Background Image URL</label>
                        <input
                          type="url"
                          value={overviewBgImage}
                          onChange={(e) => setOverviewBgImage(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Video Stream URL (.mp4)</label>
                        <input
                          type="url"
                          value={overviewVideoUrl}
                          onChange={(e) => setOverviewVideoUrl(e.target.value)}
                          placeholder="https://...mp4"
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white"
                        />
                      </div>
                    </div>

                    {/* Bottom 5 Stats */}
                    <div className="pt-2 border-t border-gray-200">
                      <label className="block text-xs font-bold text-gray-700 mb-2">
                        Bottom 5 Highlight Stats (Value &amp; Label)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {overviewStats.map((st, sIdx) => (
                          <div key={sIdx} className="space-y-1">
                            <input
                              type="text"
                              value={st[1]}
                              onChange={(e) => {
                                const next = [...overviewStats] as [string, string][];
                                next[sIdx][1] = e.target.value;
                                setOverviewStats(next);
                              }}
                              placeholder="Value (e.g. 1in)"
                              className="w-full px-2 py-1.5 rounded-lg border border-gray-300 bg-white font-bold text-xs"
                            />
                            <input
                              type="text"
                              value={st[0]}
                              onChange={(e) => {
                                const next = [...overviewStats] as [string, string][];
                                next[sIdx][0] = e.target.value;
                                setOverviewStats(next);
                              }}
                              placeholder="Label (e.g. Sensor)"
                              className="w-full px-2 py-1 rounded-lg border border-gray-300 bg-white text-[11px] text-gray-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3 Bento Feature Highlight Cards */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0071e3]">
                      3 Bento Highlight Cards
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {featureCards.map((card, cIdx) => (
                        <div key={cIdx} className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                          <span className="text-[10px] font-black uppercase text-gray-400">Card {cIdx + 1}</span>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => {
                              const next = [...featureCards];
                              next[cIdx].title = e.target.value;
                              setFeatureCards(next);
                            }}
                            placeholder="Title (e.g. Rotatable Screen)"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 font-bold text-xs"
                          />
                          <textarea
                            rows={2}
                            value={card.description}
                            onChange={(e) => {
                              const next = [...featureCards];
                              next[cIdx].description = e.target.value;
                              setFeatureCards(next);
                            }}
                            placeholder="Description..."
                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs"
                          />
                          <input
                            type="url"
                            value={card.image}
                            onChange={(e) => {
                              const next = [...featureCards];
                              next[cIdx].image = e.target.value;
                              setFeatureCards(next);
                            }}
                            placeholder="Image URL https://..."
                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-[11px]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: IN THE BOX COMBOS */}
              {activeAdminTab === "inTheBox" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0071e3] mb-1">
                      Standard Combo Items (One item name per line)
                    </h3>
                    <p className="text-[11px] text-gray-500 mb-2">
                      These will appear as clean cutout cards when &quot;Standard Combo&quot; is selected.
                    </p>
                    <textarea
                      rows={6}
                      value={inTheBoxStandardInput}
                      onChange={(e) => setInTheBoxStandardInput(e.target.value)}
                      placeholder="DJI Osmo Pocket 4&#10;Protective Cover&#10;Wrist Strap&#10;USB-C Cable"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-mono text-xs"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0071e3] mb-1">
                      Creator / Vlog Combo Items (One item name per line)
                    </h3>
                    <p className="text-[11px] text-gray-500 mb-2">
                      These will appear when the user toggles to the &quot;Creator Combo&quot; pill.
                    </p>
                    <textarea
                      rows={6}
                      value={inTheBoxCreatorInput}
                      onChange={(e) => setInTheBoxCreatorInput(e.target.value)}
                      placeholder="DJI Osmo Pocket 4&#10;DJI Mic 2 Transmitter&#10;Battery Handle&#10;Mini Tripod&#10;Carrying Case"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: SPECS & FAQS */}
              {activeAdminTab === "specsFaq" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-[#0071e3]">
                        Technical Specifications Table
                      </h3>
                      <span className="text-[10px] text-gray-400 font-semibold">Format: Group | Label | Value</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mb-2">
                      Groups will automatically become filter pills (e.g. General, Gimbal, Camera, Battery, Connection).
                    </p>
                    <textarea
                      rows={8}
                      value={rawSpecsInput}
                      onChange={(e) => setRawSpecsInput(e.target.value)}
                      placeholder="General | Dimensions | 139.7 × 42.2 × 33.5 mm&#10;General | Weight | 179 g&#10;Camera | Sensor | 1-inch CMOS&#10;Battery | Operating Time | 166 mins"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-mono text-xs"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-[#0071e3]">
                        Frequently Asked Questions (FAQs)
                      </h3>
                      <span className="text-[10px] text-gray-400 font-semibold">Format: Category | Question | Answer</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mb-2">
                      Categories will create the pill filters on the product page.
                    </p>
                    <textarea
                      rows={6}
                      value={faqsInput}
                      onChange={(e) => setFaqsInput(e.target.value)}
                      placeholder="General | What are the key upgrades? | It features a 1-inch sensor, 4K/240p slow motion, and built-in storage.&#10;Battery | How long does charging take? | Reaches 80% in 16 minutes with a 65W PD charger."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    Tab: {activeAdminTab === "general" ? "1/4 Basic Info" : activeAdminTab === "overview" ? "2/4 Overview" : activeAdminTab === "inTheBox" ? "3/4 In The Box" : "4/4 Specs & FAQs"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
