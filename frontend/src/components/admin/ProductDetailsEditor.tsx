"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Package,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Check,
  X,
  Layers,
  Sparkles,
  HelpCircle,
  Video,
  Box,
  Sliders,
  DollarSign,
  Tag,
  Eye,
  RefreshCw,
  Copy,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  MoveLeft,
  MoveRight,
  ListPlus,
  Info,
} from "lucide-react";
import {
  fetchProductBySlug,
  fetchCategories,
  createProductApi,
  updateProductApi,
} from "@/lib/api";
import { IProduct, ICategory } from "@/types";

interface ProductDetailsEditorProps {
  mode: "create" | "edit";
  initialSlugOrId?: string;
}

type EditorTab =
  | "general"
  | "media"
  | "variants"
  | "overview"
  | "inTheBox"
  | "specs"
  | "faqs"
  | "videos";

export default function ProductDetailsEditor({
  mode,
  initialSlugOrId,
}: ProductDetailsEditorProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<EditorTab>("general");
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  // Core product form state
  const [formData, setFormData] = useState<Partial<IProduct>>({
    name: "",
    slug: "",
    sku: "",
    category: "DJI Drones",
    categorySlug: "drones",
    subCategory: "Air Series",
    tier: "product",
    price: 1699,
    originalPrice: 1899,
    discountPercentage: 11,
    badge: "DUAL CAMERA",
    tagline: "Dual-Camera Flagship • Wide & 3x Medium Telephoto",
    description: "",
    features: [],
    inStock: true,
    stockCount: 20,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isProfessional: false,
    isEnterprise: false,
    mainImage: "",
    images: [],
  });

  // Features list
  const [featureItemInput, setFeatureItemInput] = useState("");

  // Media Gallery image URL form
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState("");
  const [bulkGalleryImagesInput, setBulkGalleryImagesInput] = useState("");
  const [showBulkImageModal, setShowBulkImageModal] = useState(false);

  // Variants list
  const [variantsList, setVariantsList] = useState<
    {
      id?: string;
      variantId?: string;
      name: string;
      sku: string;
      price: number;
      originalPrice?: number;
      badge?: string;
      image?: string;
      inStock?: boolean;
      stockCount?: number;
    }[]
  >([]);

  // Overview Banner state
  const [overviewKicker, setOverviewKicker] = useState("DUAL-CAMERA TRAVEL DRONE");
  const [overviewTitle, setOverviewTitle] = useState("Chase the Scene.");
  const [overviewDesc, setOverviewDesc] = useState(
    "Dual-primary cameras, nightscape omnidirectional sensing with forward LiDAR, and 45-minute flight time."
  );
  const [overviewBgImage, setOverviewBgImage] = useState("");
  const [overviewVideoUrl, setOverviewVideoUrl] = useState("");
  const [overviewStats, setOverviewStats] = useState<[string, string][]>([
    ["Primary Camera", "1-Inch CMOS (50MP)"],
    ["Telephoto Camera", "70mm (48MP)"],
    ["Flight Time", "45 Minutes"],
    ["Night Sensing", "LiDAR Omnidirectional"],
    ["Internal Storage", "42 GB Built-in"],
  ]);

  // Bento feature cards
  const [featureCards, setFeatureCards] = useState<
    { title: string; tag?: string; description: string; image: string }[]
  >([
    {
      title: "1-Inch CMOS Dual-Camera",
      tag: "Imaging Master",
      description: "Large 1-inch primary camera paired with a 70mm telephoto lens delivers cinematic depth.",
      image: "",
    },
    {
      title: "Nightscape Sensing with LiDAR",
      tag: "Night Flight Safety",
      description: "Pioneering forward-facing LiDAR sensor and vision sensors detect low-light obstacles.",
      image: "",
    },
    {
      title: "Next-Gen Smart RTH",
      tag: "Advanced Navigation",
      description: "Returns safely to home even without GPS satellite reception.",
      image: "",
    },
  ]);

  // In the Box packages
  const [inTheBoxPackages, setInTheBoxPackages] = useState<
    Record<string, { title: string; qty: number; image: string }[]>
  >({
    standard: [
      { title: "DJI Air 3S Aircraft", qty: 1, image: "" },
      { title: "DJI RC-N3 Remote Controller", qty: 1, image: "" },
      { title: "Intelligent Flight Battery", qty: 1, image: "" },
      { title: "Spare Propellers (Pair)", qty: 3, image: "" },
      { title: "Gimbal Protector", qty: 1, image: "" },
      { title: "Type-C to Type-C PD Cable", qty: 1, image: "" },
    ],
    "fly-more-rc-n3": [
      { title: "DJI Air 3S Aircraft", qty: 1, image: "" },
      { title: "DJI RC-N3 Remote Controller", qty: 1, image: "" },
      { title: "Intelligent Flight Battery", qty: 3, image: "" },
      { title: "Battery Charging Hub", qty: 1, image: "" },
      { title: "ND Filter Set (ND8/32/128)", qty: 1, image: "" },
      { title: "DJI Shoulder Bag", qty: 1, image: "" },
      { title: "Spare Propellers (Pair)", qty: 6, image: "" },
      { title: "Gimbal Protector", qty: 1, image: "" },
    ],
    "fly-more-rc-2": [
      { title: "DJI Air 3S Aircraft", qty: 1, image: "" },
      { title: "DJI RC 2 Remote Controller (Built-in Screen)", qty: 1, image: "" },
      { title: "Intelligent Flight Battery", qty: 3, image: "" },
      { title: "Battery Charging Hub", qty: 1, image: "" },
      { title: "ND Filter Set (ND8/32/128)", qty: 1, image: "" },
      { title: "DJI Shoulder Bag", qty: 1, image: "" },
      { title: "Spare Propellers (Pair)", qty: 6, image: "" },
      { title: "Gimbal Protector", qty: 1, image: "" },
    ],
  });
  const [activePackageKey, setActivePackageKey] = useState("standard");
  const [newPackageKeyInput, setNewPackageKeyInput] = useState("");

  // Technical Specs
  const [specsList, setSpecsList] = useState<{ group: string; label: string; value: string }[]>([]);
  const [bulkSpecsText, setBulkSpecsText] = useState("");
  const [isBulkSpecsOpen, setIsBulkSpecsOpen] = useState(false);

  // FAQs
  const [faqsList, setFaqsList] = useState<
    { group: string; question: string; answer: string; category?: string }[]
  >([]);
  const [bulkFaqsText, setBulkFaqsText] = useState("");
  const [isBulkFaqsOpen, setIsBulkFaqsOpen] = useState(false);

  // Video Showcases
  const [videoShowcasesList, setVideoShowcasesList] = useState<
    { id: string; title: string; videoUrl: string; description: string }[]
  >([]);

  // Load product & categories
  useEffect(() => {
    let isMounted = true;

    async function initData() {
      try {
        const cats = await fetchCategories();
        if (isMounted) setCategories(cats);

        if (mode === "edit" && initialSlugOrId) {
          setIsLoading(true);
          const prod = await fetchProductBySlug(initialSlugOrId);
          if (prod && isMounted) {
            setFormData({
              ...prod,
              tier: prod.tier || "product",
              isFeatured: !!prod.isFeatured,
              isNewArrival: !!prod.isNewArrival,
              isBestSeller: !!prod.isBestSeller,
              isProfessional: !!prod.isProfessional,
              isEnterprise: !!prod.isEnterprise,
            });

            // Variants
            if (prod.variants && prod.variants.length > 0) {
              setVariantsList(
                prod.variants.map((v) => ({
                  id: v.id || v.variantId || v.name,
                  variantId: v.variantId || v.id,
                  name: v.name,
                  sku: v.sku || prod.sku,
                  price: Number(v.price),
                  originalPrice: v.originalPrice ? Number(v.originalPrice) : undefined,
                  badge: v.badge || "",
                  image: v.image || prod.mainImage,
                  inStock: v.inStock !== false,
                  stockCount: v.stockCount ?? 15,
                }))
              );
            }

            // Overview banner
            if (prod.overviewBanner) {
              setOverviewKicker(prod.overviewBanner.badge || "");
              setOverviewTitle(prod.overviewBanner.title || prod.name);
              setOverviewDesc(prod.overviewBanner.description || prod.description);
              setOverviewBgImage(prod.overviewBanner.bgImage || "");
              setOverviewVideoUrl(prod.overviewBanner.videoUrl || "");
              if (prod.overviewBanner.stats && prod.overviewBanner.stats.length > 0) {
                setOverviewStats(
                  prod.overviewBanner.stats.map((s) => [s.label, s.value] as [string, string])
                );
              }
            }

            // Feature cards
            if (prod.featureCards && prod.featureCards.length > 0) {
              setFeatureCards(prod.featureCards);
            }

            // In the Box
            if (prod.inTheBoxVariants && typeof prod.inTheBoxVariants === "object") {
              const mapped: Record<string, { title: string; qty: number; image: string }[]> = {};
              Object.entries(prod.inTheBoxVariants).forEach(([k, items]) => {
                mapped[k] = (items || []).map((it) => ({
                  title: typeof it === "string" ? it : it.title,
                  qty: typeof it === "object" && it.qty ? Number(it.qty) : 1,
                  image: typeof it === "object" && it.image ? it.image : "",
                }));
              });
              setInTheBoxPackages(mapped);
              const firstKey = Object.keys(mapped)[0];
              if (firstKey) setActivePackageKey(firstKey);
            }

            // Specs
            if (prod.rawSpecs && prod.rawSpecs.length > 0) {
              setSpecsList(prod.rawSpecs);
            } else if (prod.specs && typeof prod.specs === "object") {
              const list: { group: string; label: string; value: string }[] = [];
              Object.entries(prod.specs).forEach(([k, v]) => {
                list.push({ group: "General", label: k, value: String(v) });
              });
              setSpecsList(list);
            }

            // FAQs
            if (prod.faqs && prod.faqs.length > 0) {
              setFaqsList(
                prod.faqs.map((f: any) => ({
                  group: f.group || f.category || "General",
                  category: f.category || f.group || "General",
                  question: f.question,
                  answer: f.answer,
                }))
              );
            }

            // Video showcases
            if (prod.videoShowcases && prod.videoShowcases.length > 0) {
              setVideoShowcasesList(prod.videoShowcases);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
        toast.error("Failed to load product details.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initData();
    return () => {
      isMounted = false;
    };
  }, [mode, initialSlugOrId]);

  // Handle auto slug generator
  const handleAutoSlug = () => {
    if (!formData.name) return;
    const generated = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, slug: generated }));
    setIsDirty(true);
  };

  // Add gallery image
  const handleAddGalleryImage = (urlToAdd?: string) => {
    const url = (urlToAdd || newGalleryImageUrl).trim();
    if (!url) return;
    if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
      toast.error("Please enter a valid HTTP(S) image URL.");
      return;
    }

    const currentImages = formData.images || [];
    if (!currentImages.includes(url)) {
      const updated = [...currentImages, url];
      setFormData((prev) => ({
        ...prev,
        images: updated,
        mainImage: prev.mainImage || url,
      }));
      setIsDirty(true);
    }
    if (!urlToAdd) setNewGalleryImageUrl("");
    toast.success("Image added to gallery!");
  };

  // Set gallery image as main
  const handleSetAsMainImage = (url: string) => {
    setFormData((prev) => ({ ...prev, mainImage: url }));
    setIsDirty(true);
    toast.success("Main product image updated!");
  };

  // Remove gallery image
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    const current = formData.images || [];
    const removedUrl = current[indexToRemove];
    const updated = current.filter((_, idx) => idx !== indexToRemove);
    setFormData((prev) => ({
      ...prev,
      images: updated,
      mainImage: prev.mainImage === removedUrl ? updated[0] || "" : prev.mainImage,
    }));
    setIsDirty(true);
  };

  // Move gallery image order
  const handleMoveGalleryImage = (index: number, direction: "left" | "right") => {
    const current = [...(formData.images || [])];
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;

    const temp = current[index];
    current[index] = current[targetIndex];
    current[targetIndex] = temp;

    setFormData((prev) => ({ ...prev, images: current }));
    setIsDirty(true);
  };

  // Bulk add gallery images
  const handleApplyBulkImages = () => {
    const lines = bulkGalleryImagesInput
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("http://") || l.startsWith("https://") || l.startsWith("/"));

    if (lines.length === 0) {
      toast.error("No valid image URLs found in text.");
      return;
    }

    const current = formData.images || [];
    const combined = Array.from(new Set([...current, ...lines]));
    setFormData((prev) => ({
      ...prev,
      images: combined,
      mainImage: prev.mainImage || combined[0],
    }));
    setBulkGalleryImagesInput("");
    setShowBulkImageModal(false);
    setIsDirty(true);
    toast.success(`Added ${lines.length} images to gallery!`);
  };

  // Add bullet feature
  const handleAddFeature = () => {
    if (!featureItemInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), featureItemInput.trim()],
    }));
    setFeatureItemInput("");
    setIsDirty(true);
  };

  // Remove bullet feature
  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }));
    setIsDirty(true);
  };

  // Add Variant
  const handleAddVariant = () => {
    const newVar = {
      id: `var_${Date.now()}`,
      variantId: `${Date.now()}`,
      name: `${formData.name || "Product"} Combo`,
      sku: `${formData.sku || "DJI"}-COMBO-${variantsList.length + 1}`,
      price: Number(formData.price || 999),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      badge: "Combo",
      image: formData.mainImage || "",
      inStock: true,
      stockCount: 15,
    };
    setVariantsList((prev) => [...prev, newVar]);
    setIsDirty(true);
  };

  // Remove Variant
  const handleRemoveVariant = (index: number) => {
    setVariantsList((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  // Add In The Box Item
  const handleAddInTheBoxItem = () => {
    const current = inTheBoxPackages[activePackageKey] || [];
    const updated = [
      ...current,
      { title: "Included Accessory", qty: 1, image: formData.mainImage || "" },
    ];
    setInTheBoxPackages((prev) => ({ ...prev, [activePackageKey]: updated }));
    setIsDirty(true);
  };

  // Remove In The Box Item
  const handleRemoveInTheBoxItem = (itemIndex: number) => {
    const current = inTheBoxPackages[activePackageKey] || [];
    const updated = current.filter((_, i) => i !== itemIndex);
    setInTheBoxPackages((prev) => ({ ...prev, [activePackageKey]: updated }));
    setIsDirty(true);
  };

  // Add Package Tab
  const handleAddPackageTab = () => {
    const key = newPackageKeyInput
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!key) return;
    if (inTheBoxPackages[key]) {
      toast.error("Package with this key already exists.");
      return;
    }
    setInTheBoxPackages((prev) => ({
      ...prev,
      [key]: [
        {
          title: formData.name || "Main Aircraft Unit",
          qty: 1,
          image: formData.mainImage || "",
        },
      ],
    }));
    setActivePackageKey(key);
    setNewPackageKeyInput("");
    setIsDirty(true);
  };

  // Save changes to backend
  const handleSaveProduct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.name?.trim()) {
      toast.error("Please provide a product name.");
      setActiveTab("general");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast.error("Please enter a valid product price.");
      setActiveTab("general");
      return;
    }

    const slug =
      formData.slug?.trim() ||
      formData.name
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const sku = formData.sku?.trim() || `DJI-${slug.toUpperCase()}`;

    // Ensure images has at least mainImage
    const mainImg =
      formData.mainImage?.trim() ||
      (formData.images && formData.images[0]) ||
      "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-DJIAIR3S-09_d1f6a795-631f-43e3-a655-8d37b54f65ff.jpg?v=1783478497";

    const allImages = Array.from(new Set([mainImg, ...(formData.images || [])])).filter(Boolean);

    // Build payload
    const payload: Partial<IProduct> = {
      ...formData,
      name: formData.name.trim(),
      slug,
      sku,
      mainImage: mainImg,
      images: allImages,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stockCount: Number(formData.stockCount || 0),
      inStock: Number(formData.stockCount || 0) > 0,
      variants: variantsList,
      overviewBanner: {
        badge: overviewKicker || "OFFICIAL DJI INNOVATION",
        title: overviewTitle || formData.name || "",
        description: overviewDesc || formData.description || "",
        bgImage: overviewBgImage || mainImg,
        videoUrl: overviewVideoUrl || "",
        stats: overviewStats.map(([label, value]) => ({ label, value })),
      },
      featureCards: featureCards.filter((c) => c.title),
      inTheBoxVariants: inTheBoxPackages,
      rawSpecs: specsList.filter((s) => s.label),
      faqs: faqsList.filter((f) => f.question),
      videoShowcases: videoShowcasesList,
    };

    setIsSubmitting(true);
    try {
      if (mode === "edit") {
        const idOrSlug = initialSlugOrId || formData._id || slug;
        await updateProductApi(idOrSlug, payload);
        toast.success(`Product "${formData.name}" successfully updated!`, {
          description: "All changes are now live on the store.",
        });
      } else {
        await createProductApi(payload);
        toast.success(`Product "${formData.name}" successfully created!`, {
          description: "New product is now available in your catalog.",
        });
        router.push(`/admin/products/edit/${slug}`);
      }
      setIsDirty(false);
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error("Failed to save product. Check required fields or unique slug/SKU.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard shortcut Ctrl+S / Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveProduct();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [formData, variantsList, inTheBoxPackages, specsList, faqsList, overviewStats, featureCards]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] py-16">
        <div className="w-10 h-10 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-base font-bold text-slate-800">Loading Product Studio...</h3>
        <p className="text-xs text-slate-500 mt-1">Retrieving all product parameters and media assets.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 pb-20">
      {/* 1. TOP STICKY HEADER & ACTION BAR */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            title="Back to Products"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0071e3]">
                {mode === "create" ? "New Product Studio" : "Product Editor Studio"}
              </span>
              {isDirty && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                  Unsaved Changes
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 truncate">
              {formData.name || "Untitled Product"}
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          {formData.slug && (
            <Link
              href={`/products/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 bg-white text-xs font-semibold shadow-xs transition-all"
              title="Open product detail page in new tab"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => handleSaveProduct()}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#0071e3] hover:bg-[#005bb5] active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. TAB NAVIGATION BAR */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-2 pt-2 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {[
          { id: "general", label: "Core & Pricing", icon: Package },
          { id: "media", label: "Media & Images", icon: ImageIcon, badge: formData.images?.length || 0 },
          { id: "variants", label: "Combos & Variants", icon: Layers, badge: variantsList.length },
          { id: "overview", label: "Overview & Bento", icon: Sparkles },
          { id: "inTheBox", label: "What's in the Box", icon: Box },
          { id: "specs", label: "Specifications", icon: Sliders, badge: specsList.length },
          { id: "faqs", label: "FAQs", icon: HelpCircle, badge: faqsList.length },
          { id: "videos", label: "Videos", icon: Video },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as EditorTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-[13px] font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-[#0071e3] text-[#0071e3] bg-blue-50/50"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.badge === "number" && tab.badge > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                    isActive ? "bg-blue-200/70 text-blue-800" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT CONTAINERS */}
      <div className="bg-white rounded-b-xl border border-t-0 border-slate-200/90 p-5 sm:p-7 shadow-xs">
        {/* ============================================================== */}
        {/* TAB 1: CORE & PRICING                                          */}
        {/* ============================================================== */}
        {activeTab === "general" && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Section 1: Basic Identity */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#0071e3]" />
                Product Identity &amp; Categorization
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Product Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="e.g. DJI Air 3S"
                    className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    SKU Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sku || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, sku: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="e.g. DJIAIR3S"
                    className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]"
                  />
                </div>

                {/* Slug with Auto Generate Button */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      URL Slug <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoSlug}
                      className="text-[11px] font-bold text-[#0071e3] hover:underline cursor-pointer"
                    >
                      Generate from name
                    </button>
                  </div>
                  <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0071e3] focus-within:ring-1 focus-within:ring-[#0071e3]">
                    <span className="px-3 bg-slate-50 border-r border-slate-200 text-xs text-slate-500 select-none py-2.5">
                      /products/
                    </span>
                    <input
                      type="text"
                      value={formData.slug || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, slug: e.target.value });
                        setIsDirty(true);
                      }}
                      placeholder="dji-air-3s"
                      className="flex-1 h-10 px-3 text-sm font-medium text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Category</label>
                  <select
                    value={formData.categorySlug || "drones"}
                    onChange={(e) => {
                      const selectedSlug = e.target.value;
                      const matched = categories.find((c) => c.slug === selectedSlug);
                      setFormData({
                        ...formData,
                        categorySlug: selectedSlug,
                        category: matched ? matched.name : formData.category,
                      });
                      setIsDirty(true);
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 bg-white focus:outline-none focus:border-[#0071e3]"
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="drones">DJI Drones</option>
                        <option value="handhelds">Osmo &amp; Handhelds</option>
                        <option value="enterprise-agriculture">Enterprise &amp; Agriculture</option>
                        <option value="accessories">Accessories</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Sub-Category */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Sub-Series</label>
                  <input
                    type="text"
                    value={formData.subCategory || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, subCategory: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="e.g. Air Series, Pocket Series"
                    className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* Product Tier */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Product Type Tier</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "product", label: "Product" },
                      { id: "bundle", label: "Bundle" },
                      { id: "accessory", label: "Accessory" },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, tier: tier.id as any });
                          setIsDirty(true);
                        }}
                        className={`h-10 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          formData.tier === tier.id
                            ? "bg-[#0071e3] text-white border-[#0071e3] shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Promotional Badge */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Marketing Badge</label>
                  <input
                    type="text"
                    value={formData.badge || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, badge: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="e.g. DUAL CAMERA, NEW, BESTSELLER"
                    className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Inventory */}
            <div className="pt-6 border-t border-slate-200/80">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Pricing &amp; Inventory Management
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Selling Price */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Selling Price ($ AUD) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      step="1"
                      value={formData.price ?? 999}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, price: val });
                        setIsDirty(true);
                      }}
                      className="w-full h-10 pl-8 pr-3.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>
                </div>

                {/* Compare at / Original Price */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    RRP / Compare-At Price ($ AUD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      step="1"
                      value={formData.originalPrice || ""}
                      onChange={(e) => {
                        const val = e.target.value ? parseFloat(e.target.value) : undefined;
                        setFormData({ ...formData, originalPrice: val });
                        setIsDirty(true);
                      }}
                      placeholder="e.g. 1899"
                      className="w-full h-10 pl-8 pr-3.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0071e3]"
                    />
                  </div>
                </div>

                {/* Stock Count */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Available Units</label>
                  <input
                    type="number"
                    value={formData.stockCount ?? 15}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setFormData({
                        ...formData,
                        stockCount: val,
                        inStock: val > 0,
                      });
                      setIsDirty(true);
                    }}
                    className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                {/* In Stock Toggle */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Storefront Stock State</label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, inStock: !formData.inStock });
                      setIsDirty(true);
                    }}
                    className={`w-full h-10 rounded-lg border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formData.inStock
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-rose-50 text-rose-800 border-rose-300"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        formData.inStock ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    {formData.inStock ? "Currently In Stock" : "Marked Out of Stock"}
                  </button>
                </div>
              </div>

              {/* Badges / Visibility checkboxes */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6">
                {[
                  { key: "isFeatured", label: "Featured on Homepage" },
                  { key: "isNewArrival", label: "New Arrival Badge" },
                  { key: "isBestSeller", label: "Best Seller Badge" },
                  { key: "isProfessional", label: "Professional Tier" },
                  { key: "isEnterprise", label: "Enterprise Tier" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={!!(formData as any)[item.key]}
                      onChange={(e) => {
                        setFormData({ ...formData, [item.key]: e.target.checked });
                        setIsDirty(true);
                      }}
                      className="w-4 h-4 rounded text-[#0071e3] border-slate-300 focus:ring-[#0071e3]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 3: Tagline, Description & Key Bullet Highlights */}
            <div className="pt-6 border-t border-slate-200/80 space-y-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                Editorial Copy &amp; Highlights
              </h2>

              {/* Tagline */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Tagline / Subheading</label>
                <input
                  type="text"
                  value={formData.tagline || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, tagline: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="e.g. Dual-Camera Flagship • Wide & 3x Medium Telephoto"
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Product Description</label>
                <textarea
                  rows={4}
                  value={formData.description || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="Comprehensive description of the product..."
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              {/* Key Bullet Features */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Key Features / Bullet Points</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={featureItemInput}
                    onChange={(e) => setFeatureItemInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="e.g. 1-inch CMOS Primary + 70mm Medium Telephoto Camera"
                    className="flex-1 h-10 px-3.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0071e3]"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 h-10 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Add Bullet
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.features || []).map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
                        <span>{feat}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: MEDIA & IMAGE GALLERY FORM                              */}
        {/* ============================================================== */}
        {activeTab === "media" && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Primary Main Image Form */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#0071e3]" />
                  Main Display Image Form
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0071e3]">
                  Primary Hero Thumbnail
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Image URL Form Input */}
                <div className="md:col-span-8 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Direct Image URL <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.mainImage || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, mainImage: e.target.value });
                        setIsDirty(true);
                      }}
                      placeholder="https://cdn.shopify.com/.../PRODUCT-THUMB.jpg"
                      className="flex-1 h-10 px-3.5 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0071e3]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.mainImage) {
                          handleAddGalleryImage(formData.mainImage);
                        }
                      }}
                      className="px-3 h-10 rounded-lg border border-slate-300 hover:bg-white text-xs font-bold text-slate-700 transition-colors cursor-pointer shrink-0"
                      title="Also add main image to gallery"
                    >
                      Sync to Gallery
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    This image is shown across category collections, Google product searches, cart drawer, and hero banner.
                  </p>
                </div>

                {/* Live Preview Box */}
                <div className="md:col-span-4 flex justify-center">
                  <div className="w-36 h-36 rounded-xl border border-slate-200 bg-white p-2 flex items-center justify-center shadow-xs overflow-hidden relative group">
                    {formData.mainImage ? (
                      <img
                        src={formData.mainImage}
                        alt="Main Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.opacity = "0.3";
                        }}
                      />
                    ) : (
                      <div className="text-center p-3 text-slate-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 stroke-1" />
                        <span className="text-[11px]">No Main Image</span>
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/75 text-white">
                      Hero
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Images Manager */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Product Image Gallery ({formData.images?.length || 0} Images)
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-resolution photographs displayed in the interactive customer gallery carousel.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBulkImageModal(!showBulkImageModal)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <ListPlus className="w-4 h-4 text-[#0071e3]" />
                  <span>Bulk Paste URLs</span>
                </button>
              </div>

              {/* Bulk Image Paste Card */}
              {showBulkImageModal && (
                <div className="p-4 mb-5 rounded-xl bg-blue-50/60 border border-blue-200 animate-in fade-in duration-150">
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Paste Image URLs (One URL per line):
                  </label>
                  <textarea
                    rows={4}
                    value={bulkGalleryImagesInput}
                    onChange={(e) => setBulkGalleryImagesInput(e.target.value)}
                    placeholder="https://...&#10;https://...&#10;https://..."
                    className="w-full p-2.5 rounded-lg border border-blue-200 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0071e3]"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setShowBulkImageModal(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyBulkImages}
                      className="px-4 py-1.5 rounded-lg bg-[#0071e3] text-white text-xs font-bold hover:bg-[#005bb5]"
                    >
                      Add All to Gallery
                    </button>
                  </div>
                </div>
              )}

              {/* Add Single Gallery Image Form */}
              <div className="flex gap-2 mb-6">
                <input
                  type="url"
                  value={newGalleryImageUrl}
                  onChange={(e) => setNewGalleryImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGalleryImage();
                    }
                  }}
                  placeholder="Enter full image URL (https://cdn.shopify.com/s/files/...)"
                  className="flex-1 h-11 px-3.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0071e3]"
                />
                <button
                  type="button"
                  onClick={() => handleAddGalleryImage()}
                  className="px-5 h-11 rounded-lg bg-[#0071e3] hover:bg-[#005bb5] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Image</span>
                </button>
              </div>

              {/* Image Grid */}
              {formData.images && formData.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {formData.images.map((imgUrl, idx) => {
                    const isMain = formData.mainImage === imgUrl;
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border p-2 bg-white flex flex-col justify-between shadow-xs transition-all relative group ${
                          isMain
                            ? "border-[#0071e3] ring-2 ring-[#0071e3]/20"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {/* Image Preview Box */}
                        <div className="w-full aspect-square rounded-lg bg-slate-50 flex items-center justify-center p-2 overflow-hidden mb-2 relative">
                          <img
                            src={imgUrl}
                            alt={`Gallery item ${idx + 1}`}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                          {isMain && (
                            <span className="absolute top-1 left-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0071e3] text-white shadow-xs">
                              Main
                            </span>
                          )}
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Action Toolbar on Card */}
                        <div className="space-y-1.5 pt-1 border-t border-slate-100">
                          <div className="flex items-center justify-between text-[11px]">
                            <button
                              type="button"
                              onClick={() => handleSetAsMainImage(imgUrl)}
                              disabled={isMain}
                              className={`text-[11px] font-bold transition-colors cursor-pointer ${
                                isMain
                                  ? "text-emerald-600 cursor-default"
                                  : "text-[#0071e3] hover:underline"
                              }`}
                            >
                              {isMain ? "✓ Selected Hero" : "Make Hero"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              title="Delete from gallery"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-slate-400">
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(idx, "left")}
                              disabled={idx === 0}
                              className="p-1 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                              title="Move Left"
                            >
                              <MoveLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[90px]">
                              {imgUrl.split("/").pop()?.split("?")[0]}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(idx, "right")}
                              disabled={idx === (formData.images?.length || 0) - 1}
                              className="p-1 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                              title="Move Right"
                            >
                              <MoveRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-500">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 text-slate-400 stroke-1" />
                  <p className="text-sm font-bold text-slate-700">No Gallery Images Added Yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter an image URL above or use the bulk paste tool to populate the product image gallery.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: COMBOS & VARIANTS                                       */}
        {/* ============================================================== */}
        {activeTab === "variants" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Product Configurations &amp; Combos ({variantsList.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Allow customers to choose between controller types (RC-N3 vs RC 2) and packages (Standard vs Fly More).
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0071e3] hover:bg-[#005bb5] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Combo Option</span>
              </button>
            </div>

            <div className="space-y-4">
              {variantsList.map((variant, idx) => (
                <div
                  key={variant.id || idx}
                  className="p-4 sm:p-5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {variant.name || `Configuration #${idx + 1}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove combo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-start">
                    {/* Variant Title */}
                    <div className="lg:col-span-4">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Combo Title / Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => {
                          const updated = [...variantsList];
                          updated[idx].name = e.target.value;
                          setVariantsList(updated);
                          setIsDirty(true);
                        }}
                        placeholder="e.g. Fly More Combo (DJI RC 2)"
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0071e3]"
                      />
                    </div>

                    {/* SKU */}
                    <div className="lg:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">SKU</label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => {
                          const updated = [...variantsList];
                          updated[idx].sku = e.target.value;
                          setVariantsList(updated);
                          setIsDirty(true);
                        }}
                        placeholder="DJIAIR3SRC2C"
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0071e3]"
                      />
                    </div>

                    {/* Price */}
                    <div className="lg:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Price ($ AUD) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => {
                          const updated = [...variantsList];
                          updated[idx].price = parseFloat(e.target.value) || 0;
                          setVariantsList(updated);
                          setIsDirty(true);
                        }}
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0071e3]"
                      />
                    </div>

                    {/* Compare at */}
                    <div className="lg:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Compare-At ($)</label>
                      <input
                        type="number"
                        value={variant.originalPrice || ""}
                        onChange={(e) => {
                          const updated = [...variantsList];
                          updated[idx].originalPrice = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined;
                          setVariantsList(updated);
                          setIsDirty(true);
                        }}
                        placeholder="2599"
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0071e3]"
                      />
                    </div>

                    {/* Badge */}
                    <div className="lg:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={variant.badge || ""}
                        onChange={(e) => {
                          const updated = [...variantsList];
                          updated[idx].badge = e.target.value;
                          setVariantsList(updated);
                          setIsDirty(true);
                        }}
                        placeholder="e.g. Best Value"
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0071e3]"
                      />
                    </div>

                    {/* Combo Specific Image URL Form */}
                    <div className="lg:col-span-12 pt-2 border-t border-slate-200/50 flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex-1 w-full">
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          Combo Image URL (Shows when user clicks this combo pill):
                        </label>
                        <input
                          type="url"
                          value={variant.image || ""}
                          onChange={(e) => {
                            const updated = [...variantsList];
                            updated[idx].image = e.target.value;
                            setVariantsList(updated);
                            setIsDirty(true);
                          }}
                          placeholder="https://cdn.shopify.com/.../combo-image.jpg"
                          className="w-full h-8 px-3 rounded border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#0071e3]"
                        />
                      </div>
                      {/* Thumbnail Preview */}
                      <div className="w-10 h-10 rounded border border-slate-200 bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        {variant.image ? (
                          <img src={variant.image} alt={variant.name} className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: OVERVIEW & BENTO HIGHLIGHTS                             */}
        {/* ============================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Overview Hero Banner */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0071e3]" />
                Cinematic Overview Hero Banner
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kicker / Eyebrow Badge</label>
                  <input
                    type="text"
                    value={overviewKicker}
                    onChange={(e) => {
                      setOverviewKicker(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="e.g. 1-INCH CMOS DUAL-CAMERA"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Headline Title</label>
                  <input
                    type="text"
                    value={overviewTitle}
                    onChange={(e) => {
                      setOverviewTitle(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="e.g. Chase the Scene."
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subtitle Narrative</label>
                  <textarea
                    rows={2}
                    value={overviewDesc}
                    onChange={(e) => {
                      setOverviewDesc(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Narrative explanation of the flagship design and capabilities..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Background Media Image URL</label>
                  <input
                    type="url"
                    value={overviewBgImage}
                    onChange={(e) => {
                      setOverviewBgImage(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="https://.../background.jpg"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Overview Video URL (YouTube or MP4)</label>
                  <input
                    type="url"
                    value={overviewVideoUrl}
                    onChange={(e) => {
                      setOverviewVideoUrl(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="https://www.youtube.com/watch?v=... or direct .mp4"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>
            </div>

            {/* 5-Column Stats Ribbon */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Key Performance Metrics Ribbon (5 Highlights)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {overviewStats.map(([label, value], idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <span className="text-[10px] font-bold text-[#0071e3] uppercase tracking-wider block">
                      Stat #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={label}
                      onChange={(e) => {
                        const updated = [...overviewStats];
                        updated[idx][0] = e.target.value;
                        setOverviewStats(updated);
                        setIsDirty(true);
                      }}
                      placeholder="Label (e.g. Sensor)"
                      className="w-full h-8 px-2 text-xs font-medium border border-slate-200 bg-white rounded focus:outline-none"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        const updated = [...overviewStats];
                        updated[idx][1] = e.target.value;
                        setOverviewStats(updated);
                        setIsDirty(true);
                      }}
                      placeholder="Value (e.g. 1-Inch CMOS)"
                      className="w-full h-8 px-2 text-xs font-bold border border-slate-200 bg-white rounded focus:outline-none text-[#0071e3]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bento Feature Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Bento Highlights Grid Cards ({featureCards.length})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setFeatureCards((prev) => [
                      ...prev,
                      {
                        title: "New Highlight Feature",
                        tag: "Flagship Feature",
                        description: "Feature description explaining the technology and benefit.",
                        image: formData.mainImage || "",
                      },
                    ]);
                    setIsDirty(true);
                  }}
                  className="text-xs font-bold text-[#0071e3] hover:underline cursor-pointer"
                >
                  + Add Feature Card
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featureCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2.5 relative flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={card.tag || ""}
                          onChange={(e) => {
                            const updated = [...featureCards];
                            updated[idx].tag = e.target.value;
                            setFeatureCards(updated);
                            setIsDirty(true);
                          }}
                          placeholder="Tag (e.g. Pure Optics)"
                          className="h-6 px-2 text-[10px] font-bold text-blue-700 bg-blue-50 rounded border border-blue-100 uppercase tracking-wider"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFeatureCards((prev) => prev.filter((_, i) => i !== idx));
                            setIsDirty(true);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const updated = [...featureCards];
                          updated[idx].title = e.target.value;
                          setFeatureCards(updated);
                          setIsDirty(true);
                        }}
                        placeholder="Feature Card Title"
                        className="w-full h-8 px-2 text-xs font-bold text-slate-900 border border-slate-200 rounded focus:outline-none"
                      />

                      <textarea
                        rows={3}
                        value={card.description}
                        onChange={(e) => {
                          const updated = [...featureCards];
                          updated[idx].description = e.target.value;
                          setFeatureCards(updated);
                          setIsDirty(true);
                        }}
                        placeholder="Card explanation..."
                        className="w-full p-2 text-xs text-slate-600 border border-slate-200 rounded focus:outline-none"
                      />
                    </div>

                    {/* Image URL Form with Thumbnail */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <input
                        type="url"
                        value={card.image}
                        onChange={(e) => {
                          const updated = [...featureCards];
                          updated[idx].image = e.target.value;
                          setFeatureCards(updated);
                          setIsDirty(true);
                        }}
                        placeholder="Card image URL..."
                        className="flex-1 h-7 px-2 text-[11px] border border-slate-200 rounded focus:outline-none"
                      />
                      <div className="w-7 h-7 rounded border border-slate-200 p-0.5 shrink-0 overflow-hidden bg-slate-50 flex items-center justify-center">
                        {card.image ? (
                          <img src={card.image} alt={card.title} className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon className="w-3 h-3 text-slate-300" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: WHAT'S IN THE BOX                                       */}
        {/* ============================================================== */}
        {activeTab === "inTheBox" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Package Tabs Manager */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">What&apos;s in the Box Packages</h3>
                <p className="text-xs text-slate-500">
                  Configure unboxing inclusions for each combo (Standard, Fly More, etc.) with title, quantity, and image URL.
                </p>
              </div>

              {/* Add New Package Tab */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <input
                  type="text"
                  value={newPackageKeyInput}
                  onChange={(e) => setNewPackageKeyInput(e.target.value)}
                  placeholder="New Package Key (e.g. enterprise)"
                  className="h-8 px-2.5 text-xs rounded border border-slate-200 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddPackageTab}
                  className="px-3 h-8 rounded bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                >
                  + Add Package
                </button>
              </div>
            </div>

            {/* Package Tab Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {Object.keys(inTheBoxPackages).map((pkgKey) => (
                <button
                  key={pkgKey}
                  type="button"
                  onClick={() => setActivePackageKey(pkgKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                    activePackageKey === pkgKey
                      ? "bg-[#0071e3] text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {pkgKey.replace(/[-_]/g, " ")} ({inTheBoxPackages[pkgKey]?.length || 0})
                </button>
              ))}
            </div>

            {/* In the box items list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Inclusions for &quot;{activePackageKey}&quot;
                </span>
                <button
                  type="button"
                  onClick={handleAddInTheBoxItem}
                  className="text-xs font-bold text-[#0071e3] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add In-the-Box Item
                </button>
              </div>

              {(inTheBoxPackages[activePackageKey] || []).map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row items-start md:items-center gap-3 shadow-xs"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {itemIdx + 1}
                  </span>

                  {/* Title */}
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const current = [...(inTheBoxPackages[activePackageKey] || [])];
                        current[itemIdx].title = e.target.value;
                        setInTheBoxPackages((prev) => ({ ...prev, [activePackageKey]: current }));
                        setIsDirty(true);
                      }}
                      placeholder="Item Title (e.g. DJI Air 3S Aircraft)"
                      className="w-full h-8 px-2.5 text-xs font-bold text-slate-900 border border-slate-200 rounded focus:outline-none"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="w-24 shrink-0">
                    <input
                      type="number"
                      min={1}
                      value={item.qty || 1}
                      onChange={(e) => {
                        const current = [...(inTheBoxPackages[activePackageKey] || [])];
                        current[itemIdx].qty = parseInt(e.target.value, 10) || 1;
                        setInTheBoxPackages((prev) => ({ ...prev, [activePackageKey]: current }));
                        setIsDirty(true);
                      }}
                      placeholder="Qty"
                      className="w-full h-8 px-2.5 text-xs font-bold text-slate-900 border border-slate-200 rounded focus:outline-none"
                    />
                  </div>

                  {/* Image URL Form */}
                  <div className="flex-1 w-full flex items-center gap-2">
                    <input
                      type="url"
                      value={item.image || ""}
                      onChange={(e) => {
                        const current = [...(inTheBoxPackages[activePackageKey] || [])];
                        current[itemIdx].image = e.target.value;
                        setInTheBoxPackages((prev) => ({ ...prev, [activePackageKey]: current }));
                        setIsDirty(true);
                      }}
                      placeholder="Image URL for this item..."
                      className="flex-1 h-8 px-2.5 text-xs text-slate-900 border border-slate-200 rounded focus:outline-none"
                    />
                    {/* Live Preview Box */}
                    <div className="w-8 h-8 rounded border border-slate-200 p-0.5 shrink-0 bg-slate-50 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => handleRemoveInTheBoxItem(itemIdx)}
                    className="text-slate-400 hover:text-rose-600 p-1 shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: SPECIFICATIONS                                          */}
        {/* ============================================================== */}
        {activeTab === "specs" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Technical Specifications ({specsList.length})</h3>
                <p className="text-xs text-slate-500">
                  Full engineering parameters grouped by category (Aircraft, Camera, Sensing, Battery, etc.).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkSpecsOpen(!isBulkSpecsOpen)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  Bulk Edit Text
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSpecsList((prev) => [
                      ...prev,
                      { group: "Aircraft", label: "Parameter Name", value: "Value" },
                    ]);
                    setIsDirty(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0071e3] hover:bg-[#005bb5] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  + Add Spec Row
                </button>
              </div>
            </div>

            {/* Bulk Specs Editor Modal */}
            {isBulkSpecsOpen && (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  Bulk Paste Specs in Format: <code>Group | Parameter | Value</code>
                </label>
                <textarea
                  rows={6}
                  value={
                    bulkSpecsText ||
                    specsList.map((s) => `${s.group} | ${s.label} | ${s.value}`).join("\n")
                  }
                  onChange={(e) => setBulkSpecsText(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-blue-200 bg-white text-xs font-mono text-slate-900 focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBulkSpecsOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const lines = (bulkSpecsText || "")
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
                      setSpecsList(lines);
                      setIsBulkSpecsOpen(false);
                      setIsDirty(true);
                      toast.success(`Updated ${lines.length} specifications!`);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-[#0071e3] text-white text-xs font-bold hover:bg-[#005bb5]"
                  >
                    Apply Bulk Specs
                  </button>
                </div>
              </div>
            )}

            {/* Specs Table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-3 w-1/4">Category / Group</th>
                    <th className="p-3 w-1/3">Parameter Name</th>
                    <th className="p-3">Specification Value</th>
                    <th className="p-3 w-10 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {specsList.map((spec, sIdx) => (
                    <tr key={sIdx} className="hover:bg-slate-50/60">
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={spec.group}
                          onChange={(e) => {
                            const updated = [...specsList];
                            updated[sIdx].group = e.target.value;
                            setSpecsList(updated);
                            setIsDirty(true);
                          }}
                          placeholder="e.g. Camera"
                          className="w-full h-8 px-2 font-bold text-slate-700 rounded border border-slate-200 bg-white"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => {
                            const updated = [...specsList];
                            updated[sIdx].label = e.target.value;
                            setSpecsList(updated);
                            setIsDirty(true);
                          }}
                          placeholder="e.g. Max Flight Time"
                          className="w-full h-8 px-2 font-medium text-slate-900 rounded border border-slate-200 bg-white"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const updated = [...specsList];
                            updated[sIdx].value = e.target.value;
                            setSpecsList(updated);
                            setIsDirty(true);
                          }}
                          placeholder="e.g. 45 minutes"
                          className="w-full h-8 px-2 text-slate-800 rounded border border-slate-200 bg-white"
                        />
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSpecsList((prev) => prev.filter((_, i) => i !== sIdx));
                            setIsDirty(true);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: FAQS                                                    */}
        {/* ============================================================== */}
        {activeTab === "faqs" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Frequently Asked Questions ({faqsList.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Help prospective Australian customers answer common product, warranty, and compatibility queries.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkFaqsOpen(!isBulkFaqsOpen)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  Bulk Edit Text
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFaqsList((prev) => [
                      ...prev,
                      {
                        group: "General",
                        question: "What is included with official warranty?",
                        answer: "All units include 2-Year Official Australian Manufacturer Warranty.",
                      },
                    ]);
                    setIsDirty(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0071e3] hover:bg-[#005bb5] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  + Add FAQ
                </button>
              </div>
            </div>

            {/* Bulk FAQs Editor Modal */}
            {isBulkFaqsOpen && (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  Bulk Paste FAQs in Format: <code>Category | Question | Answer</code>
                </label>
                <textarea
                  rows={6}
                  value={
                    bulkFaqsText ||
                    faqsList.map((f) => `${f.group} | ${f.question} | ${f.answer}`).join("\n")
                  }
                  onChange={(e) => setBulkFaqsText(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-blue-200 bg-white text-xs font-mono text-slate-900 focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBulkFaqsOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const lines = (bulkFaqsText || "")
                        .split("\n")
                        .map((l) => l.trim())
                        .filter(Boolean)
                        .map((l) => {
                          const parts = l.split("|").map((p) => p.trim());
                          return {
                            group: parts[0] || "General",
                            category: parts[0] || "General",
                            question: parts[1] || "",
                            answer: parts.slice(2).join(" | ") || "",
                          };
                        })
                        .filter((f) => f.question);
                      setFaqsList(lines);
                      setIsBulkFaqsOpen(false);
                      setIsDirty(true);
                      toast.success(`Updated ${lines.length} FAQs!`);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-[#0071e3] text-white text-xs font-bold hover:bg-[#005bb5]"
                  >
                    Apply Bulk FAQs
                  </button>
                </div>
              </div>
            )}

            {/* FAQs Cards */}
            <div className="space-y-4">
              {faqsList.map((faq, fIdx) => (
                <div
                  key={fIdx}
                  className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={faq.group || faq.category || "General"}
                      onChange={(e) => {
                        const updated = [...faqsList];
                        updated[fIdx].group = e.target.value;
                        updated[fIdx].category = e.target.value;
                        setFaqsList(updated);
                        setIsDirty(true);
                      }}
                      placeholder="Category Tag (e.g. General, Camera, Battery)"
                      className="h-6 px-2 text-[10px] font-bold text-blue-700 bg-blue-50 rounded border border-blue-100 uppercase tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFaqsList((prev) => prev.filter((_, i) => i !== fIdx));
                        setIsDirty(true);
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [...faqsList];
                      updated[fIdx].question = e.target.value;
                      setFaqsList(updated);
                      setIsDirty(true);
                    }}
                    placeholder="Enter question here..."
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0071e3]"
                  />

                  <textarea
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...faqsList];
                      updated[fIdx].answer = e.target.value;
                      setFaqsList(updated);
                      setIsDirty(true);
                    }}
                    placeholder="Provide detailed, helpful answer..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: VIDEOS                                                  */}
        {/* ============================================================== */}
        {activeTab === "videos" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Video Showcases &amp; Demonstrations
                </h3>
                <p className="text-xs text-slate-500">
                  Add video review links, tutorial showcases, or YouTube demonstration embeds.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setVideoShowcasesList((prev) => [
                    ...prev,
                    {
                      id: `vid_${Date.now()}`,
                      title: "Product Showcase Video",
                      videoUrl: "https://www.youtube.com/watch?v=kYJvM9d150c",
                      description: "Official demonstration of flight and video features.",
                    },
                  ]);
                  setIsDirty(true);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#0071e3] hover:bg-[#005bb5] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                + Add Video
              </button>
            </div>

            <div className="space-y-4">
              {videoShowcasesList.map((vid, vIdx) => (
                <div key={vIdx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Video #{vIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoShowcasesList((prev) => prev.filter((_, i) => i !== vIdx));
                        setIsDirty(true);
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={vid.title}
                    onChange={(e) => {
                      const updated = [...videoShowcasesList];
                      updated[vIdx].title = e.target.value;
                      setVideoShowcasesList(updated);
                      setIsDirty(true);
                    }}
                    placeholder="Video Title"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-900"
                  />
                  <input
                    type="url"
                    value={vid.videoUrl}
                    onChange={(e) => {
                      const updated = [...videoShowcasesList];
                      updated[vIdx].videoUrl = e.target.value;
                      setVideoShowcasesList(updated);
                      setIsDirty(true);
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-900"
                  />
                  <textarea
                    rows={2}
                    value={vid.description}
                    onChange={(e) => {
                      const updated = [...videoShowcasesList];
                      updated[vIdx].description = e.target.value;
                      setVideoShowcasesList(updated);
                      setIsDirty(true);
                    }}
                    placeholder="Video description..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. BOTTOM FLOATING SAVE BAR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.25)] flex items-center gap-4 border border-slate-700/60">
        <div className="flex items-center gap-2">
          {isDirty ? (
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span className="text-xs font-medium text-slate-300">
            {isDirty ? "You have unsaved changes" : "All changes saved to database"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleSaveProduct()}
          disabled={isSubmitting}
          className="px-4 py-1.5 rounded-xl bg-[#0071e3] hover:bg-[#005bb5] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
        >
          {isSubmitting ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>Save Changes (Ctrl+S)</span>
        </button>
      </div>
    </div>
  );
}
