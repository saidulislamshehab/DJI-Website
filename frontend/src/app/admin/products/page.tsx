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
  AlertCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  AdminHeader,
  AdminBadge,
  AdminTableContainer,
  AdminEmptyState,
  AdminConfirmDialog,
} from "@/components/admin/AdminComponents";

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

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<IProduct | null>(null);

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
    let active = true;
    (async () => {
      try {
        const [prodsRes, catsRes] = await Promise.all([
          fetchProducts({ limit: 100 }),
          fetchCategories(),
        ]);
        if (!active) return;
        setProducts(prodsRes.products);
        setCategories(catsRes);
      } catch (err) {
        if (!active) return;
        console.error("Failed to load products:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
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
      (it: { title?: string } | string) => (typeof it === "string" ? it : it.title || "")
    );
    setInTheBoxStandardInput(stdItems.join("\n"));

    const creatorItems = (p.inTheBoxVariants?.creator || p.inTheBoxVariants?.vlog || []).map(
      (it: { title?: string } | string) => (typeof it === "string" ? it : it.title || "")
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
      setFaqsInput(
        p.faqs
          .map(
            (f: { group?: string; category?: string; question?: string; answer?: string }) =>
              `${f.group || f.category || "General"} | ${f.question || ""} | ${f.answer || ""}`
          )
          .join("\n")
      );
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
          (it: { title?: string; image?: string } | string) =>
            (typeof it === "string" ? it : it?.title) === title
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
          (it: { title?: string; image?: string } | string) =>
            (typeof it === "string" ? it : it?.title) === title
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
    const id = p._id || p.slug;
    try {
      await deleteProductApi(id);
      setProducts((prev) => prev.filter((item) => item._id !== p._id && item.slug !== p.slug));
      setDeleteTarget(null);
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
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q);

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
      {/* Page Header */}
      <AdminHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products Catalog" },
        ]}
        title="Products Catalog"
        description="Manage your store inventory, pricing, stock levels, bundle combos, accessories, technical specifications, and in-the-box contents."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 ${isLoading ? "animate-spin text-[#0071e3]" : ""}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)] space-y-3">
        {/* Tier Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Items", count: products.length },
            { id: "product", label: "Standard Products", count: products.filter((p) => p.tier === "product" || !p.tier).length },
            { id: "bundle", label: "Bundles", count: products.filter((p) => p.tier === "bundle").length },
            { id: "accessory", label: "Accessories", count: products.filter((p) => p.tier === "accessory").length },
            { id: "new_arrival", label: "✨ New Arrivals", count: products.filter((p) => p.isNewArrival).length },
            { id: "low_stock", label: "Low Stock", count: products.filter((p) => p.stockCount <= 5 || !p.inStock).length },
          ].map((tab) => {
            const isActive = filterTier === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTier(tab.id as typeof filterTier)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white font-bold" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2.5 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, SKU or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-[#0071e3]"
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
      <AdminTableContainer>
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading catalog items...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <AdminEmptyState
            icon={Package}
            title={searchQuery ? "No matching products found" : "No products in this view"}
            description={
              searchQuery
                ? `No products matched "${searchQuery}". Clear your search or change the filters.`
                : "Create a new product using the button above to begin populating your store."
            }
            action={
              !searchQuery ? (
                <button
                  type="button"
                  onClick={openAddModal}
                  className="px-3.5 py-2 rounded-lg bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs font-semibold cursor-pointer"
                >
                  Add First Product
                </button>
              ) : undefined
            }
          />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-5">Product Info</th>
                <th className="py-3.5 px-4">SKU / Slug</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Category &amp; Tier</th>
                <th className="py-3.5 px-4">Price (AUD)</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">New Release</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredProducts.map((p) => (
                <tr key={p._id || p.slug} className="hover:bg-slate-50/60 transition-colors">
                  {/* Product Info */}
                  <td className="py-3 px-4 sm:px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-slate-50 rounded-lg p-1 border border-slate-200 shrink-0 flex items-center justify-center">
                        <img
                          src={p.mainImage || (p.images && p.images[0]) || "https://www1.djicdn.com/dps/2db2534575e927ff81e35d259c60eec8.png"}
                          alt={p.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://www1.djicdn.com/dps/2db2534575e927ff81e35d259c60eec8.png";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/edit/${p.slug || p._id}`}
                          className="font-semibold text-slate-900 hover:text-[#0071e3] transition-colors truncate max-w-xs block"
                        >
                          {p.name}
                        </Link>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          {p.badge && (
                            <span className="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 text-[#0071e3] border border-blue-200/60">
                              {p.badge}
                            </span>
                          )}
                          {p.isFeatured && (
                            <span className="px-1.5 py-0.2 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* SKU / Slug */}
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-700">{p.sku}</p>
                    <p className="text-xs text-slate-400 font-mono truncate max-w-[120px]">/{p.slug}</p>
                  </td>

                  {/* Category & Tier */}
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="space-y-1">
                      <span className="text-slate-700 font-medium text-xs block">
                        {p.category}
                      </span>
                      {p.tier === "bundle" ? (
                        <AdminBadge variant="warning">Bundle</AdminBadge>
                      ) : p.tier === "accessory" ? (
                        <AdminBadge variant="secondary">Accessory</AdminBadge>
                      ) : (
                        <AdminBadge variant="neutral">Standard</AdminBadge>
                      )}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <p className="font-bold text-slate-900">${(p.price || 0).toLocaleString()} AUD</p>
                    {p.originalPrice && (
                      <p className="text-xs text-slate-400 line-through">
                        ${p.originalPrice.toLocaleString()} AUD
                      </p>
                    )}
                  </td>

                  {/* Inventory Adjuster */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateStockCount(p, -1)}
                        className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer shadow-2xs"
                        title="Decrease stock"
                      >
                        -
                      </button>
                      <span className="w-7 text-center font-bold text-xs text-slate-900">{p.stockCount}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateStockCount(p, 1)}
                        className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer shadow-2xs"
                        title="Increase stock"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  {/* New Arrival Quick Toggle */}
                  <td className="py-3 px-4 whitespace-nowrap hidden lg:table-cell">
                    <button
                      type="button"
                      onClick={() => handleToggleNewArrival(p)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                        p.isNewArrival
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                      }`}
                      title="Toggle New Arrival"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{p.isNewArrival ? "New Release" : "Standard"}</span>
                    </button>
                  </td>

                  {/* Stock Status Toggle */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleToggleStock(p)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                        p.inStock
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                      }`}
                    >
                      {p.inStock ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{p.inStock ? "In Stock" : "Out of Stock"}</span>
                    </button>
                  </td>

                  {/* Row Actions */}
                  <td className="py-3 px-4 sm:px-5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        title="View on store"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/products/edit/${p.slug || p._id}`}
                        className="p-1.5 rounded-lg border border-blue-200 bg-blue-50/60 text-[#0071e3] hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
                        title="Edit Full Details Studio"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(p)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
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
        )}
      </AdminTableContainer>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {editingProduct ? `Edit: ${editingProduct.name}` : "Add New DJI Product"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure core metadata, hero banner, bento cards, in-the-box combos, specifications, and FAQs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 py-3 overflow-x-auto">
              {[
                { id: "general", label: "1. Basic Info & Pricing" },
                { id: "overview", label: "2. Hero Banner & Bento Cards" },
                { id: "inTheBox", label: "3. In The Box Combos" },
                { id: "specsFaq", label: "4. Tech Specs & FAQs" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveAdminTab(t.id as typeof activeAdminTab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeAdminTab === t.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {modalError && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4 text-xs sm:text-sm">
              {/* TAB 1: BASIC INFO */}
              {activeAdminTab === "general" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Catalog Tier */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Product Classification &amp; Tier *
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
                          onClick={() => setFormData({ ...formData, tier: t.id as "product" | "bundle" | "accessory" })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            (formData.tier || "product") === t.id
                              ? "bg-blue-50/80 border-[#0071e3] text-[#0071e3]"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <p className="font-bold text-xs">{t.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Badges & Homepage Placement */}
                  <div className="sm:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <p className="text-xs font-semibold text-slate-800 mb-2">Display Badges &amp; Highlights</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={!!formData.isNewArrival}
                          onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                          className="w-4 h-4 text-[#0071e3] rounded cursor-pointer"
                        />
                        <div className="text-xs">
                          <span className="font-semibold text-slate-900 block">✨ New Arrival</span>
                          <span className="text-xs text-slate-500">Feature in What&apos;s New</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={!!formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="w-4 h-4 text-[#0071e3] rounded cursor-pointer"
                        />
                        <div className="text-xs">
                          <span className="font-semibold text-slate-900 block">⭐ Featured</span>
                          <span className="text-xs text-slate-500">Frontpage showcase</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={!!formData.isBestSeller}
                          onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                          className="w-4 h-4 text-[#0071e3] rounded cursor-pointer"
                        />
                        <div className="text-xs">
                          <span className="font-semibold text-slate-900 block">🔥 Best Seller</span>
                          <span className="text-xs text-slate-500">Popularity badge</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. DJI Osmo Pocket 3 Creator Combo"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">SKU</label>
                    <input
                      type="text"
                      value={formData.sku || ""}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Slug</label>
                    <input
                      type="text"
                      value={formData.slug || ""}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="leave blank to auto-generate"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
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
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#0071e3]"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Badge (optional)</label>
                    <input
                      type="text"
                      value={formData.badge || ""}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. Official Release, Top Pick"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Price (AUD) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price || ""}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Original Price (AUD)</label>
                    <input
                      type="number"
                      value={formData.originalPrice || ""}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      placeholder="for discount strikethrough"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.stockCount ?? 10}
                      onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Main Image URL</label>
                    <input
                      type="url"
                      value={formData.mainImage || ""}
                      onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Key Bullet Features (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={featuresInput}
                      onChange={(e) => setFeaturesInput(e.target.value)}
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: OVERVIEW & BENTO CARDS */}
              {activeAdminTab === "overview" && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0071e3]">
                      Hero Overview Dark Card
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Blue Headline Kicker</label>
                        <input
                          type="text"
                          value={overviewKicker}
                          onChange={(e) => setOverviewKicker(e.target.value)}
                          placeholder="e.g. 1-INCH CMOS POCKET GIMBAL CAMERA"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Main Hero Title</label>
                        <input
                          type="text"
                          value={overviewTitle}
                          onChange={(e) => setOverviewTitle(e.target.value)}
                          placeholder="e.g. Pocket Gimbal Power."
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Subtitle</label>
                        <textarea
                          rows={2}
                          value={overviewDesc}
                          onChange={(e) => setOverviewDesc(e.target.value)}
                          placeholder="Brief description underneath headline..."
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Background Image URL</label>
                        <input
                          type="url"
                          value={overviewBgImage}
                          onChange={(e) => setOverviewBgImage(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Video Stream URL (.mp4)</label>
                        <input
                          type="url"
                          value={overviewVideoUrl}
                          onChange={(e) => setOverviewVideoUrl(e.target.value)}
                          placeholder="https://...mp4"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Key Highlight Metric Stats (Value &amp; Label)
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
                              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-xs"
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
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs text-slate-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3 Bento Feature Highlight Cards */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0071e3]">
                      3 Bento Feature Highlight Cards
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {featureCards.map((card, cIdx) => (
                        <div key={cIdx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                          <span className="text-xs font-bold uppercase text-slate-400">Card {cIdx + 1}</span>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => {
                              const next = [...featureCards];
                              next[cIdx].title = e.target.value;
                              setFeatureCards(next);
                            }}
                            placeholder="Title (e.g. Rotatable Screen)"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold text-xs"
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
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
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
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
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
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0071e3] mb-1">
                      Standard Combo Items (One item name per line)
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">
                      These will appear as clean item cards when &ldquo;Standard Combo&rdquo; is selected.
                    </p>
                    <textarea
                      rows={6}
                      value={inTheBoxStandardInput}
                      onChange={(e) => setInTheBoxStandardInput(e.target.value)}
                      placeholder="DJI Osmo Pocket 3&#10;Protective Cover&#10;Wrist Strap&#10;USB-C Cable"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0071e3] mb-1">
                      Creator / Vlog Combo Items (One item name per line)
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">
                      These will appear when the customer toggles to the &ldquo;Creator Combo&rdquo; pill.
                    </p>
                    <textarea
                      rows={6}
                      value={inTheBoxCreatorInput}
                      onChange={(e) => setInTheBoxCreatorInput(e.target.value)}
                      placeholder="DJI Osmo Pocket 3&#10;DJI Mic 2 Transmitter&#10;Battery Handle&#10;Mini Tripod&#10;Carrying Case"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: SPECS & FAQS */}
              {activeAdminTab === "specsFaq" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-[#0071e3]">
                        Technical Specifications Table
                      </h3>
                      <span className="text-xs text-slate-400 font-semibold">Format: Group | Label | Value</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">
                      Groups automatically organize category tabs (e.g. General, Gimbal, Camera, Battery, Connectivity).
                    </p>
                    <textarea
                      rows={7}
                      value={rawSpecsInput}
                      onChange={(e) => setRawSpecsInput(e.target.value)}
                      placeholder="General | Dimensions | 139.7 × 42.2 × 33.5 mm&#10;General | Weight | 179 g&#10;Camera | Sensor | 1-inch CMOS&#10;Battery | Operating Time | 166 mins"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-[#0071e3]">
                        Frequently Asked Questions (FAQs)
                      </h3>
                      <span className="text-xs text-slate-400 font-semibold">Format: Category | Question | Answer</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">
                      Categories will organize the interactive accordion on the product page.
                    </p>
                    <textarea
                      rows={6}
                      value={faqsInput}
                      onChange={(e) => setFaqsInput(e.target.value)}
                      placeholder="General | What are the key upgrades? | It features a 1-inch sensor, 4K/120fps video, and rotatable OLED touchscreen.&#10;Battery | How long does charging take? | Reaches 80% in 16 minutes with a 65W PD charger."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Step {activeAdminTab === "general" ? "1/4: Basic Info" : activeAdminTab === "overview" ? "2/4: Hero Overview" : activeAdminTab === "inTheBox" ? "3/4: In The Box" : "4/4: Specs & FAQs"}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDeleteProduct(deleteTarget)}
        title="Delete Product?"
        description={
          deleteTarget ? (
            <>
              Are you sure you want to delete <span className="font-semibold text-slate-900">{deleteTarget.name}</span>? This item will be permanently removed from the catalog.
            </>
          ) : null
        }
        confirmLabel="Delete Product"
        confirmVariant="danger"
        icon={Trash2}
      />
    </div>
  );
}
