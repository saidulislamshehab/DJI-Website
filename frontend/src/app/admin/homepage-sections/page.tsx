"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchHomepageSections,
  fetchProducts,
  updateHomepageSectionApi,
} from "@/lib/api";
import { IHomepageSection, IProduct } from "@/types";
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
} from "lucide-react";
import {
  AdminHeader,
} from "@/components/admin/AdminComponents";

export default function AdminHomepageSectionsPage() {
  const [sections, setSections] = useState<IHomepageSection[]>([]);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [activeKey, setActiveKey] = useState<string>("new_arrivals");
  const [isLoading, setIsLoading] = useState(true);

  // Editable fields for current section
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [currentProductIds, setCurrentProductIds] = useState<string[]>([]);
  const [isSectionEnabled, setIsSectionEnabled] = useState(true);

  // Product picker search
  const [pickerSearch, setPickerSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [secRes, prodRes] = await Promise.all([
        fetchHomepageSections(),
        fetchProducts({ limit: 100 }),
      ]);
      setSections(secRes);
      setAllProducts(prodRes.products);

      const initialSec = secRes.find((s) => s.sectionKey === activeKey) || secRes[0];
      if (initialSec) {
        setActiveKey(initialSec.sectionKey);
        setCurrentTitle(initialSec.title);
        setCurrentSubtitle(initialSec.subtitle);
        setCurrentProductIds(initialSec.productIds);
        setIsSectionEnabled(initialSec.isEnabled);
      }
    } catch (err) {
      console.error("Failed to load homepage sections:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [secRes, prodRes] = await Promise.all([
          fetchHomepageSections(),
          fetchProducts({ limit: 100 }),
        ]);
        if (!active) return;
        setSections(secRes);
        setAllProducts(prodRes.products);

        const initialSec = secRes.find((s) => s.sectionKey === activeKey) || secRes[0];
        if (initialSec) {
          setActiveKey(initialSec.sectionKey);
          setCurrentTitle(initialSec.title);
          setCurrentSubtitle(initialSec.subtitle);
          setCurrentProductIds(initialSec.productIds);
          setIsSectionEnabled(initialSec.isEnabled);
        }
      } catch (err) {
        if (!active) return;
        console.error("Failed to load homepage sections:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleSelectSectionTab = (key: string) => {
    setActiveKey(key);
    setSaveSuccess(false);
    const sec = sections.find((s) => s.sectionKey === key);
    if (sec) {
      setCurrentTitle(sec.title);
      setCurrentSubtitle(sec.subtitle);
      setCurrentProductIds(sec.productIds);
      setIsSectionEnabled(sec.isEnabled);
    }
  };

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

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await updateHomepageSectionApi(activeKey, {
        title: currentTitle,
        subtitle: currentSubtitle,
        productIds: currentProductIds,
        isEnabled: isSectionEnabled,
      });

      if (updated) {
        setSections((prev) =>
          prev.map((s) => (s.sectionKey === activeKey ? { ...s, ...updated } : s))
        );
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save homepage section:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Get hydrated product objects for currently selected section
  const currentAssignedProducts = currentProductIds
    .map((id) => allProducts.find((p) => p._id === id || p.slug === id))
    .filter(Boolean) as IProduct[];

  // Candidate products available to add (not yet in section)
  const availableCandidates = allProducts.filter((p) => {
    const isAlreadyAssigned = currentProductIds.includes(p._id!) || currentProductIds.includes(p.slug);
    const matchesSearch =
      pickerSearch === "" ||
      p.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(pickerSearch.toLowerCase());
    return !isAlreadyAssigned && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Homepage Sections" },
        ]}
        title="Homepage Section Manager"
        description="Curate featured product carousels, bento highlights, and new release showcases displayed on the storefront landing page."
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
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        }
      />

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Homepage section successfully updated and published to storefront.</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="font-bold underline text-emerald-700 hover:text-emerald-900"
          >
            Preview Live
          </Link>
        </div>
      )}

      {/* Section Selection Tabs */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
          Select Landing Page Section to Edit
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {sections.map((sec) => {
            const isActive = activeKey === sec.sectionKey;
            return (
              <button
                key={sec.sectionKey}
                type="button"
                onClick={() => handleSelectSectionTab(sec.sectionKey)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                <span>{sec.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {sec.productIds.length} items
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Settings Configuration */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subtitle / Caption
            </label>
            <input
              type="text"
              value={currentSubtitle}
              onChange={(e) => setCurrentSubtitle(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isEnabledCheckbox"
              checked={isSectionEnabled}
              onChange={(e) => setIsSectionEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-[#0071e3] focus:ring-[#0071e3] cursor-pointer"
            />
            <label htmlFor="isEnabledCheckbox" className="text-xs font-semibold text-slate-800 cursor-pointer">
              Enable section on public storefront
            </label>
          </div>
          <span className="text-xs text-slate-500">
            Section Key: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono text-[11px]">{activeKey}</code>
          </span>
        </div>
      </div>

      {/* Dual Panel: Assigned Products vs Available Product Picker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Assigned Products (with reordering) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Assigned Products ({currentAssignedProducts.length})
            </h3>
            <span className="text-xs text-slate-500">Drag or use arrows to rearrange display order</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-[0_1px_3px_rgba(16,24,40,0.04)] min-h-[360px]">
            {currentAssignedProducts.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-xs">
                <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No products assigned yet</p>
                <p className="text-slate-400 mt-0.5">Click &ldquo;Add to Section&rdquo; from the catalog on the right.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {currentAssignedProducts.map((p, idx) => (
                  <div
                    key={p._id || p.slug}
                    className="p-3 flex items-center justify-between gap-3 bg-white hover:bg-slate-50/70 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="w-10 h-10 rounded-md border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <Package className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-slate-900 truncate">{p.name}</p>
                        <p className="text-[11px] text-slate-500">
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
                        className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === currentAssignedProducts.length - 1}
                        onClick={() => handleMoveProduct(idx, "down")}
                        title="Move Down"
                        className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(p._id || p.slug)}
                        title="Remove from section"
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
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

        {/* Right: Available Products Picker */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Product Catalog Picker</h3>
            <span className="text-xs text-slate-500">{availableCandidates.length} available</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-[0_1px_3px_rgba(16,24,40,0.04)] min-h-[360px] flex flex-col">
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products to add..."
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#0071e3]"
              />
            </div>

            <div className="flex-1 overflow-y-auto max-h-[420px] divide-y divide-slate-100">
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
                      <div className="w-8 h-8 rounded-md border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-contain p-0.5"
                          />
                        ) : (
                          <Package className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-slate-900 truncate">{p.name}</p>
                        <p className="text-[11px] text-slate-500">${(p.price || 0).toLocaleString()} AUD</p>
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
  );
}
