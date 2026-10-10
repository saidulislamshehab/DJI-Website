"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  fetchHomepageSections,
  fetchProducts,
  updateHomepageSectionApi,
  createHomepageSectionApi,
  deleteHomepageSectionApi,
  reorderHomepageSectionsApi,
} from "@/lib/api";
import { IHomepageSection, IProduct, IHomepageSpotlight } from "@/types";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  CheckCircle2,
  Search,
  Package,
  RefreshCw,
  Eye,
  EyeOff,
  Video,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Check,
  AlertTriangle,
  ExternalLink,
  Film,
  Sliders,
  ChevronRight,
  X,
} from "lucide-react";
import {
  AdminHeader,
  AdminStatCard,
  AdminBadge,
  AdminConfirmDialog,
} from "@/components/admin/AdminComponents";

export default function AdminHomepageSectionsPage() {
  const [sections, setSections] = useState<IHomepageSection[]>([]);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [activeKey, setActiveKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Editable fields for currently active section
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [currentProductIds, setCurrentProductIds] = useState<string[]>([]);
  const [isSectionEnabled, setIsSectionEnabled] = useState(true);
  const [currentOrder, setCurrentOrder] = useState<number>(1);

  // Spotlight editing fields
  const [hasSpotlight, setHasSpotlight] = useState(false);
  const [spotlightTitle, setSpotlightTitle] = useState("");
  const [spotlightEyebrow, setSpotlightEyebrow] = useState("");
  const [spotlightPrice, setSpotlightPrice] = useState("");
  const [spotlightBtnText, setSpotlightBtnText] = useState("Shop now");
  const [spotlightBtnHref, setSpotlightBtnHref] = useState("");
  const [spotlightImg, setSpotlightImg] = useState("");
  const [spotlightVideo, setSpotlightVideo] = useState("");

  // Product picker filter & search
  const [pickerSearch, setPickerSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Status and feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Add Section Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSectionKey, setNewSectionKey] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newIsEnabled, setNewIsEnabled] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Delete Section Confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<IHomepageSection | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load data from database
  const loadData = async (preferredKey?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [secRes, prodRes] = await Promise.all([
        fetchHomepageSections(),
        fetchProducts({ limit: 200 }),
      ]);

      const sortedSections = [...secRes].sort((a, b) => (a.order || 0) - (b.order || 0));
      setSections(sortedSections);
      setAllProducts(prodRes?.products || []);

      const targetKey = preferredKey || activeKey;
      const initialSec =
        sortedSections.find((s) => s.sectionKey === targetKey) || sortedSections[0];

      if (initialSec) {
        populateForm(initialSec);
      } else {
        setActiveKey("");
      }
    } catch (err: any) {
      console.error("Failed to load homepage sections:", err);
      setErrorMessage("Could not load homepage sections from database. Check backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const populateForm = (sec: IHomepageSection) => {
    setActiveKey(sec.sectionKey);
    setCurrentTitle(sec.title || "");
    setCurrentSubtitle(sec.subtitle || "");
    setCurrentProductIds(sec.productIds || []);
    setIsSectionEnabled(sec.isEnabled !== false);
    setCurrentOrder(sec.order || 1);

    const spot = sec.spotlight || sec.featured;
    if (spot && (spot.title || spot.img || spot.video)) {
      setHasSpotlight(true);
      setSpotlightTitle(spot.title || "");
      setSpotlightEyebrow(spot.eyebrow || "");
      setSpotlightPrice(spot.price || "");
      setSpotlightBtnText(spot.btnText || "Shop now");
      setSpotlightBtnHref(spot.btnHref || "");
      setSpotlightImg(spot.img || "");
      setSpotlightVideo(spot.video || "");
    } else {
      setHasSpotlight(false);
      setSpotlightTitle("");
      setSpotlightEyebrow("");
      setSpotlightPrice("");
      setSpotlightBtnText("Shop now");
      setSpotlightBtnHref("");
      setSpotlightImg("");
      setSpotlightVideo("");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectSectionTab = (key: string) => {
    setSaveSuccess(null);
    setErrorMessage(null);
    const sec = sections.find((s) => s.sectionKey === key);
    if (sec) {
      populateForm(sec);
    }
  };

  // Reordering products in section
  const handleMoveProduct = (index: number, direction: "up" | "down") => {
    const newIds = [...currentProductIds];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newIds.length) return;

    const temp = newIds[index];
    newIds[index] = newIds[targetIndex];
    newIds[targetIndex] = temp;
    setCurrentProductIds(newIds);
  };

  const handleRemoveProduct = (id: string) => {
    setCurrentProductIds((prev) => prev.filter((pid) => pid !== id));
  };

  const handleAddProduct = (id: string) => {
    if (!currentProductIds.includes(id)) {
      setCurrentProductIds((prev) => [...prev, id]);
    }
  };

  // Reorder whole sections up / down
  const handleReorderSection = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Update orders sequentially
    const ordersPayload = newSections.map((sec, idx) => ({
      sectionKey: sec.sectionKey,
      order: idx + 1,
    }));

    setSections(newSections.map((sec, idx) => ({ ...sec, order: idx + 1 })));

    try {
      await reorderHomepageSectionsApi(ordersPayload);
      setSaveSuccess("Sections display order updated!");
      setTimeout(() => setSaveSuccess(null), 2500);
    } catch (err) {
      console.error("Failed to reorder sections:", err);
      loadData();
    }
  };

  // Quick toggle section enabled/disabled
  const handleQuickToggleEnabled = async (sec: IHomepageSection, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = !sec.isEnabled;
    try {
      const updated = await updateHomepageSectionApi(sec.sectionKey, {
        isEnabled: newStatus,
      });
      if (updated) {
        setSections((prev) =>
          prev.map((s) => (s.sectionKey === sec.sectionKey ? { ...s, isEnabled: newStatus } : s))
        );
        if (sec.sectionKey === activeKey) {
          setIsSectionEnabled(newStatus);
        }
      }
    } catch (err) {
      console.error("Failed to toggle section status:", err);
    }
  };

  // Save current active section
  const handleSave = async () => {
    if (!activeKey) return;
    setIsSaving(true);
    setSaveSuccess(null);
    setErrorMessage(null);

    const spotlightData: IHomepageSpotlight | undefined = hasSpotlight
      ? {
          title: spotlightTitle.trim() || currentTitle,
          eyebrow: spotlightEyebrow.trim(),
          price: spotlightPrice.trim(),
          btnText: spotlightBtnText.trim() || "Shop now",
          btnHref: spotlightBtnHref.trim() || "/collections",
          img: spotlightImg.trim(),
          video: spotlightVideo.trim() || null,
        }
      : undefined;

    try {
      const updated = await updateHomepageSectionApi(activeKey, {
        title: currentTitle.trim(),
        subtitle: currentSubtitle.trim(),
        productIds: currentProductIds,
        isEnabled: isSectionEnabled,
        order: Number(currentOrder) || 1,
        spotlight: spotlightData,
      });

      if (updated) {
        setSections((prev) =>
          prev.map((s) => (s.sectionKey === activeKey ? { ...s, ...updated } : s))
        );
        setSaveSuccess(`"${currentTitle}" updated and saved to database!`);
        setTimeout(() => setSaveSuccess(null), 3500);
      }
    } catch (err: any) {
      console.error("Failed to save homepage section:", err);
      setErrorMessage(err?.response?.data?.message || "Failed to save section changes to database.");
    } finally {
      setIsSaving(false);
    }
  };

  // Create new section
  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert("Please provide a title for the new section.");
      return;
    }

    setIsCreating(true);
    setErrorMessage(null);

    const key = (newSectionKey || newTitle)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    try {
      const created = await createHomepageSectionApi({
        title: newTitle.trim(),
        sectionKey: key,
        subtitle: newSubtitle.trim(),
        isEnabled: newIsEnabled,
        order: sections.length + 1,
        productIds: [],
      });

      if (created) {
        setIsAddModalOpen(false);
        setNewTitle("");
        setNewSectionKey("");
        setNewSubtitle("");
        setNewIsEnabled(true);
        await loadData(created.sectionKey);
        setSaveSuccess(`New section "${created.title}" created successfully!`);
        setTimeout(() => setSaveSuccess(null), 3500);
      }
    } catch (err: any) {
      console.error("Failed to create section:", err);
      alert(err?.response?.data?.message || "Failed to create new section. Ensure the key is unique.");
    } finally {
      setIsCreating(false);
    }
  };

  // Delete section
  const handleDeleteSection = async () => {
    if (!sectionToDelete) return;
    setIsDeleting(true);
    try {
      const ok = await deleteHomepageSectionApi(sectionToDelete.sectionKey);
      if (ok) {
        setIsDeleteDialogOpen(false);
        const remaining = sections.filter((s) => s.sectionKey !== sectionToDelete.sectionKey);
        setSections(remaining);
        setSectionToDelete(null);
        setSaveSuccess("Section deleted from database.");
        setTimeout(() => setSaveSuccess(null), 3000);

        if (remaining.length > 0) {
          populateForm(remaining[0]);
        } else {
          setActiveKey("");
        }
      }
    } catch (err: any) {
      console.error("Failed to delete section:", err);
      alert(err?.response?.data?.message || "Failed to delete section from database.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Hydrate assigned products
  const currentAssignedProducts = useMemo(() => {
    return currentProductIds
      .map((id) => allProducts.find((p) => p._id === id || p.slug === id || p.sku === id))
      .filter(Boolean) as IProduct[];
  }, [currentProductIds, allProducts]);

  // Categories list for filtering picker
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    allProducts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [allProducts]);

  // Filter available candidate products
  const availableCandidates = useMemo(() => {
    return allProducts.filter((p) => {
      const isAlreadyAssigned =
        Boolean(p._id && currentProductIds.includes(p._id)) ||
        Boolean(p.slug && currentProductIds.includes(p.slug)) ||
        Boolean(p.sku && currentProductIds.includes(p.sku));

      const matchesSearch =
        pickerSearch === "" ||
        p.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(pickerSearch.toLowerCase())) ||
        (p.sku && p.sku.toLowerCase().includes(pickerSearch.toLowerCase()));

      const matchesCategory =
        selectedCategoryFilter === "all" || p.category === selectedCategoryFilter;

      return !isAlreadyAssigned && matchesSearch && matchesCategory;
    });
  }, [allProducts, currentProductIds, pickerSearch, selectedCategoryFilter]);

  // Statistics KPIs
  const totalSections = sections.length;
  const activeSections = sections.filter((s) => s.isEnabled !== false).length;
  const totalAssignedProducts = sections.reduce(
    (acc, curr) => acc + (curr.productIds ? curr.productIds.length : 0),
    0
  );
  const sectionsWithSpotlight = sections.filter((s) => {
    const spot = s.spotlight || s.featured;
    return spot && (spot.video || spot.img);
  }).length;

  const currentSection = sections.find((s) => s.sectionKey === activeKey);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. Header with Breadcrumbs & Top Actions */}
      <AdminHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Homepage Sections" },
        ]}
        title="Homepage Section Manager"
        description="Create, configure, reorder, and manage database-driven product carousels and spotlight banners on the storefront."
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => loadData(activeKey)}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 text-slate-500 ${isLoading ? "animate-spin text-[#0071e3]" : ""}`}
              />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Section</span>
            </button>
          </div>
        }
      />

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          title="Total Sections"
          value={totalSections}
          subtitle="Configured in database"
          icon={Layers}
          iconColor="blue"
        />
        <AdminStatCard
          title="Live on Storefront"
          value={activeSections}
          subtitle="Currently active & visible"
          icon={Eye}
          iconColor="emerald"
        />
        <AdminStatCard
          title="Featured Products"
          value={totalAssignedProducts}
          subtitle="Total product slots assigned"
          icon={Package}
          iconColor="purple"
        />
        <AdminStatCard
          title="Spotlight Banners"
          value={sectionsWithSpotlight}
          subtitle="Hero media cards enabled"
          icon={Film}
          iconColor="indigo"
        />
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 font-bold underline text-emerald-700 hover:text-emerald-900"
          >
            <span>Preview on Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 3. Section Manager: Section Tabs & Order Controls */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Database Sections ({sections.length})
            </h2>
            <p className="text-xs text-slate-400">
              Click a section to edit its settings, spotlight banner, and assigned products.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0071e3] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create another section</span>
          </button>
        </div>

        {sections.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Layers className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No homepage sections in database</p>
            <p className="text-xs text-slate-400 mt-1">
              Click &quot;Add New Section&quot; above to create your first homepage carousel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {sections.map((sec, idx) => {
              const isSelected = activeKey === sec.sectionKey;
              const prodCount = sec.productIds ? sec.productIds.length : 0;
              const hasVideo = Boolean(sec.spotlight?.video || sec.featured?.video);

              return (
                <div
                  key={sec.sectionKey}
                  onClick={() => handleSelectSectionTab(sec.sectionKey)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-left ${
                    isSelected
                      ? "border-[#0071e3] bg-blue-50/40 shadow-xs ring-2 ring-[#0071e3]/20"
                      : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {sec.title}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {sec.subtitle || "No subtitle provided"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickToggleEnabled(sec, e)}
                      title={sec.isEnabled !== false ? "Visible on storefront" : "Hidden from storefront"}
                      className={`p-1 rounded-md transition-colors ${
                        sec.isEnabled !== false
                          ? "text-emerald-600 hover:bg-emerald-50"
                          : "text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {sec.isEnabled !== false ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {prodCount} products
                      </span>
                      {hasVideo && (
                        <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600 flex items-center gap-0.5">
                          <Film className="w-2.5 h-2.5" />
                          <span>Video</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReorderSection(idx, "up");
                        }}
                        title="Move Section Up"
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sections.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReorderSection(idx, "down");
                        }}
                        title="Move Section Down"
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSectionToDelete(sec);
                          setIsDeleteDialogOpen(true);
                        }}
                        title="Delete Section"
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Active Section Editor */}
      {currentSection && (
        <div className="space-y-6">
          {/* Editor Header Bar with Save & Delete buttons */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#0071e3] font-bold text-sm flex items-center justify-center shrink-0">
                #{currentOrder}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    Editing: {currentTitle || activeKey}
                  </h2>
                  <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    key: {activeKey}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Changes save directly to MongoDB Atlas and update the live storefront.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSectionToDelete(currentSection);
                  setIsDeleteDialogOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Section</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving to Database..." : "Save Changes"}</span>
              </button>
            </div>
          </div>

          {/* Section Core Settings */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0071e3]" />
                <span>General Section Settings</span>
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isEnabledCheckboxMain"
                  checked={isSectionEnabled}
                  onChange={(e) => setIsSectionEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0071e3] focus:ring-[#0071e3] cursor-pointer"
                />
                <label
                  htmlFor="isEnabledCheckboxMain"
                  className="text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  Active on storefront
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  placeholder="e.g. DJI Drones"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={currentSubtitle}
                  onChange={(e) => setCurrentSubtitle(e.target.value)}
                  placeholder="e.g. Consumer & camera drones engineered for creators"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={currentOrder}
                  onChange={(e) => setCurrentOrder(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                />
              </div>
            </div>
          </div>

          {/* Spotlight Banner Studio (Hero Video & Image) */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Spotlight Showcase Banner Studio
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasSpotlightToggle"
                  checked={hasSpotlight}
                  onChange={(e) => setHasSpotlight(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0071e3] focus:ring-[#0071e3] cursor-pointer"
                />
                <label
                  htmlFor="hasSpotlightToggle"
                  className="text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  Enable Spotlight Media Banner
                </label>
              </div>
            </div>

            {hasSpotlight ? (
              <div className="space-y-5">
                {/* Visual Live Preview Banner */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Live Banner Preview (Storefront Rendering)
                  </label>
                  <div className="relative rounded-2xl overflow-hidden aspect-[21/9] sm:aspect-[3/1] max-h-[300px] bg-slate-900 border border-slate-800 flex items-center p-6 sm:p-10 text-white shadow-md">
                    {/* Background Media */}
                    {spotlightImg && (
                      <img
                        src={spotlightImg}
                        alt="Spotlight preview"
                        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://www.d1store.com.au/cdn/shop/files/Lito_X1_Homepage.jpg?v=1783910988&width=2400";
                        }}
                      />
                    )}

                    {spotlightVideo && (
                      <video
                        src={spotlightVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-[1] opacity-90"
                      />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-[2]" />

                    {/* Content Overlay */}
                    <div className="relative z-[3] max-w-md space-y-1.5">
                      {spotlightEyebrow && (
                        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                          {spotlightEyebrow}
                        </p>
                      )}
                      <h4 className="text-xl sm:text-3xl font-black text-white">
                        {spotlightTitle || currentTitle}
                      </h4>
                      {spotlightPrice && (
                        <p className="text-xs sm:text-sm font-semibold text-slate-200">
                          {spotlightPrice}
                        </p>
                      )}
                      <div className="pt-2">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white text-black font-bold text-xs shadow-sm">
                          {spotlightBtnText || "Shop now"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spotlight Form Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Banner Heading / Title
                    </label>
                    <input
                      type="text"
                      value={spotlightTitle}
                      onChange={(e) => setSpotlightTitle(e.target.value)}
                      placeholder="e.g. DJI Air 3S"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Eyebrow / Badge Text
                    </label>
                    <input
                      type="text"
                      value={spotlightEyebrow}
                      onChange={(e) => setSpotlightEyebrow(e.target.value)}
                      placeholder="e.g. DUAL-CAMERA FLAGSHIP"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Starting Price Text
                    </label>
                    <input
                      type="text"
                      value={spotlightPrice}
                      onChange={(e) => setSpotlightPrice(e.target.value)}
                      placeholder="e.g. From $1,699"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Button CTA Text
                    </label>
                    <input
                      type="text"
                      value={spotlightBtnText}
                      onChange={(e) => setSpotlightBtnText(e.target.value)}
                      placeholder="e.g. Shop now"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Button Link URL
                    </label>
                    <input
                      type="text"
                      value={spotlightBtnHref}
                      onChange={(e) => setSpotlightBtnHref(e.target.value)}
                      placeholder="e.g. /products/dji-air-3s"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Background Poster Image URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={spotlightImg}
                      onChange={(e) => setSpotlightImg(e.target.value)}
                      placeholder="https://...jpg or webp"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-purple-600" />
                        <span>Background Video URL (.mp4 optional)</span>
                      </span>
                      <span className="text-slate-400 font-normal">
                        Plays seamlessly in loop behind text
                      </span>
                    </label>
                    <input
                      type="url"
                      value={spotlightVideo}
                      onChange={(e) => setSpotlightVideo(e.target.value)}
                      placeholder="https://...mp4"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Sparkles className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">
                  Spotlight Media Banner is disabled for this section.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Only the product carousel cards will be displayed. Toggle above to add a hero video banner.
                </p>
              </div>
            )}
          </div>

          {/* 5. Product Assignment Dual Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Assigned Products (with reordering) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#0071e3]" />
                    <span>Assigned Carousel Products ({currentAssignedProducts.length})</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    Arranged left-to-right as displayed on the storefront
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs min-h-[400px]">
                {currentAssignedProducts.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 text-xs">
                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No products assigned yet</p>
                    <p className="text-slate-400 mt-0.5">
                      Click &ldquo;Add to Section&rdquo; from the catalog on the right.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {currentAssignedProducts.map((p, idx) => (
                      <div
                        key={p._id || p.slug || idx}
                        className="p-3 flex items-center justify-between gap-3 bg-white hover:bg-slate-50/70 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div className="w-11 h-11 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                            {p.images?.[0] || p.mainImage ? (
                              <img
                                src={p.images?.[0] || p.mainImage}
                                alt={p.name}
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <Package className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                              {p.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              ${(p.price || 0).toLocaleString()} AUD &bull; {p.category || "Drones"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveProduct(idx, "up")}
                            title="Move Up"
                            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === currentAssignedProducts.length - 1}
                            onClick={() => handleMoveProduct(idx, "down")}
                            title="Move Down"
                            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(p._id || p.slug)}
                            title="Remove from section"
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Available Products Picker */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Add Products from Catalog</h3>
                <span className="text-xs font-semibold text-slate-500">
                  {availableCandidates.length} available
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs min-h-[400px] flex flex-col space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by product name, SKU, or model..."
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                  />
                  {pickerSearch && (
                    <button
                      type="button"
                      onClick={() => setPickerSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                {availableCategories.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedCategoryFilter("all")}
                      className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                        selectedCategoryFilter === "all"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      All
                    </button>
                    {availableCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                          selectedCategoryFilter === cat
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                {/* Candidates Scroll List */}
                <div className="flex-1 overflow-y-auto max-h-[460px] divide-y divide-slate-100">
                  {availableCandidates.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-xs">
                      No matching unassigned products found.
                    </div>
                  ) : (
                    availableCandidates.map((p) => (
                      <div
                        key={p._id || p.slug}
                        className="p-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-50/80 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-md border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                            {p.images?.[0] || p.mainImage ? (
                              <img
                                src={p.images?.[0] || p.mainImage}
                                alt={p.name}
                                className="w-full h-full object-contain p-0.5"
                              />
                            ) : (
                              <Package className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-slate-900 truncate">{p.name}</p>
                            <p className="text-[11px] text-slate-500">
                              ${(p.price || 0).toLocaleString()} AUD &bull; {p.category || "Drones"}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddProduct(p._id || p.slug)}
                          className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-[#0071e3] text-[#0071e3] hover:text-white border border-blue-200 hover:border-[#0071e3] text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal: Create New Homepage Section */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0071e3] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Create New Homepage Section
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add a custom carousel section to the database
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSectionKey || newSectionKey === newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_")) {
                      setNewSectionKey(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "_")
                          .replace(/^_+|_+$/g, "")
                      );
                    }
                  }}
                  placeholder="e.g. Action & Handhelds"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Key (Unique identifier)
                </label>
                <input
                  type="text"
                  value={newSectionKey}
                  onChange={(e) => setNewSectionKey(e.target.value)}
                  placeholder="e.g. action_handhelds"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Used internally for routing and anchoring.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtitle / Tagline (Optional)
                </label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="e.g. Cinema-grade handheld stabilizers and action cameras"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="newIsEnabledCheckbox"
                  checked={newIsEnabled}
                  onChange={(e) => setNewIsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0071e3] focus:ring-[#0071e3] cursor-pointer"
                />
                <label
                  htmlFor="newIsEnabledCheckbox"
                  className="text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  Enable immediately on storefront homepage
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isCreating ? "Creating in DB..." : "Create Section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Modal: Confirm Delete Section */}
      <AdminConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSectionToDelete(null);
        }}
        onConfirm={handleDeleteSection}
        isLoading={isDeleting}
        title={`Delete "${sectionToDelete?.title || "Section"}"?`}
        description={
          <span>
            Are you sure you want to delete this section from MongoDB Atlas?
            <br />
            <strong>Section Key:</strong> <code>{sectionToDelete?.sectionKey}</code>
            <br />
            This will permanently remove the carousel and its spotlight banner from the homepage.
          </span>
        }
        confirmLabel="Yes, Delete Section"
        confirmVariant="danger"
        icon={Trash2}
      />
    </div>
  );
}
