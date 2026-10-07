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
  Sliders,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Eye,
  Search,
} from "lucide-react";

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
    loadData();
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Homepage Section Manager</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Control which products are featured in each homepage carousel section in real time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-bold shadow-xs transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Storefront</span>
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] disabled:bg-gray-400 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Section</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>Section saved successfully! Changes are immediately live on the storefront.</span>
        </div>
      )}

      {/* Tabs for 4 core sections */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap gap-2">
        {[
          { key: "new_arrivals", label: "1. New Arrivals" },
          { key: "dji_drones", label: "2. DJI Drones" },
          { key: "pro_drones", label: "3. Professional Drones" },
          { key: "enterprise_agriculture", label: "4. Enterprise & Agriculture" },
        ].map((tab) => {
          const isActive = activeKey === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleSelectSectionTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0071e3] text-white shadow-sm"
                  : "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Assigned Products and Reordering */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Section Settings Box */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-base font-black text-gray-900 pb-2 border-b border-gray-100">
              Section Metadata
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Display Title</label>
                <input
                  type="text"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={currentSubtitle}
                  onChange={(e) => setCurrentSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={isSectionEnabled}
                onChange={(e) => setIsSectionEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-[#0071e3]"
              />
              <span className="text-xs font-bold text-gray-700">
                Display this section on homepage
              </span>
            </label>
          </div>

          {/* Assigned Products in this Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-gray-900">
                  Featured Products in this Carousel ({currentAssignedProducts.length})
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Reorder products or remove them from this homepage section
                </p>
              </div>
            </div>

            {currentAssignedProducts.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-500">
                <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                No products currently assigned to this section. Choose products from the right to add them!
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {currentAssignedProducts.map((p, index) => (
                  <div
                    key={p._id || p.slug}
                    className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Index badge */}
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>

                    {/* Image */}
                    <div className="w-12 h-12 bg-[#f8f9fa] rounded-lg p-1 border border-gray-100 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={p.mainImage || (p.images && p.images[0])}
                        alt={p.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">{p.name}</p>
                      <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5">
                        <span className="font-semibold text-gray-700">${p.price.toLocaleString()} AUD</span>
                        <span>•</span>
                        <span>{p.category}</span>
                        <span>•</span>
                        <span className={p.inStock ? "text-emerald-600 font-semibold" : "text-red-500 font-semibold"}>
                          {p.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>

                    {/* Reorder and Delete Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveProduct(index, "up")}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={index === currentAssignedProducts.length - 1}
                        onClick={() => handleMoveProduct(index, "down")}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(p._id || p.slug)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                        title="Remove from Section"
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

        {/* Right Column: Catalog Picker to Add Products */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-black text-gray-900">Add Products from Catalog</h2>
            <p className="text-xs text-gray-500 mt-0.5">Click + to include in {currentTitle}</p>
          </div>

          {/* Search filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search available products..."
              value={pickerSearch}
              onChange={(e) => setPickerSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs focus:outline-hidden focus:border-[#0071e3]"
            />
          </div>

          {/* Available products list */}
          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {availableCandidates.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                All matching products are already added to this section.
              </div>
            ) : (
              availableCandidates.map((p) => (
                <div
                  key={p._id || p.slug}
                  className="p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.mainImage || (p.images && p.images[0])}
                      alt={p.name}
                      className="w-10 h-10 object-contain rounded-md bg-white border border-gray-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-500">${p.price.toLocaleString()} AUD</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddProduct(p._id || p.slug)}
                    className="p-1.5 rounded-lg bg-[#0071e3] hover:bg-[#0058b8] text-white flex-shrink-0 transition-colors"
                    title="Add to section"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
