"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchCategories,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  fetchProducts,
} from "@/lib/api";
import { ICategory, IProduct } from "@/types";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  AlertCircle,
  FolderOpen,
  Search,
  RefreshCw,
  Package,
  Image as ImageIcon,
  ImagePlus,
  Sparkles,
  Check,
} from "lucide-react";
import {
  AdminHeader,
  AdminBadge,
  AdminTableContainer,
  AdminEmptyState,
  AdminConfirmDialog,
} from "@/components/admin/AdminComponents";
import { ImagePickerModal } from "@/components/admin/ImagePickerModal";

const CATEGORY_IMAGE_PRESETS: Record<string, { label: string; url: string }[]> = {
  drones: [
    { label: "Mavic 4 Pro", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/2d431330-99da-464d-9f0a-1815ed9aa61e/005-website-categoryimages-mavic4p-fa.webp" },
    { label: "Air 3S", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/8d54172f-b19b-4754-a06e-a5561e1c0cfe/cat-thumb-air3s.webp" },
    { label: "Mini 5 Pro", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/619a4dc0-0846-4e64-9dd8-f30feb3937c5/cat-thumb-fis26-mini5pro-01-v1.webp" },
    { label: "Mini 4 Pro", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/8a80f44f-bfb5-4656-be70-75fb3979cd80/005-website-categoryimages-batch2-mini4pro-fa.webp" },
    { label: "DJI Neo", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/c8150de7-006f-4f9b-84a4-526f5b082b97/005-website-categoryimages-neo2-fa.webp" },
    { label: "Avata 2", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/6cb925f3-3d84-47a4-a3a6-50c70bf7bbde/005-website-categoryimages-avata360-fa.webp" },
    { label: "Inspire 3", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/27f4ae33-7883-41fa-84d1-e50c47aae9dd/005-website-categoryimages-inspire3-fa.webp" },
  ],
  handhelds: [
    { label: "Osmo Pocket 4P", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/2199914d-50ca-4726-83ac-36c929f5a850/005-website-categoryimages-batch2-osmopocket4p-fa.jpg" },
    { label: "Osmo Pocket 4", url: "/images/collections/osmo-pocket-4.png" },
    { label: "Osmo Action 6", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/ae4e2e01-568d-4fa0-9450-eef56b6293ce/005-website-categoryimages-osmoaction6-fa.webp" },
    { label: "Osmo Mobile 8", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/3b5ddb8e-3439-45b9-ad20-e51cc7567de7/005-website-categoryimages-mobile8p-fa.webp" },
    { label: "Mic Mini 2", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/e3fbcd72-7430-4544-a29c-70bd325df8eb/005-website-categoryimages-micmini2-fa.webp" },
    { label: "DJI Mic 2", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/a83e0892-d352-4581-9b77-cfc813f8d976/005-website-categoryimages-mic2-fa.webp" },
  ],
  "lifestyle-tech": [
    { label: "Power 1000 Mini", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/d6d7bde3-3bd2-4408-8e8a-9ee9a8175d67/power1000mini.webp" },
    { label: "Power Station", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/cb6768be-2e8b-4105-913e-9c04d779c50d/cat-thumb-power-station.webp" },
    { label: "Romo P2", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/a83e0892-d352-4581-9b77-cfc813f8d976/romo.png" },
  ],
  "enterprise-agriculture": [
    { label: "Matrice 400", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/2de6a6be-602b-4566-aba8-f2ff689b0c17/005-website-categoryimages-matrice400-fa.webp" },
    { label: "DJI Dock 3", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/8517e0cf-665b-43f8-a636-453be9903cf9/005-website-categoryimages-dock3-fa.webp" },
    { label: "FlyCart 100", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/a743ac05-d8fa-4b7b-9812-ceb184e763b9/005-website-categoryimages-flycart100-fa.webp" },
    { label: "Agras T100", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/c6d03193-125d-45e5-a9e4-826469dec05d/005-website-categoryimages-agrast100-fa.webp" },
    { label: "D-RTK 3", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/aecc0759-a91a-487b-a9db-92d141996100/005-website-categoryimages-d-rk3-fa.webp" },
  ],
  enterprise: [
    { label: "Matrice 400", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/2de6a6be-602b-4566-aba8-f2ff689b0c17/005-website-categoryimages-matrice400-fa.webp" },
    { label: "DJI Dock 3", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/8517e0cf-665b-43f8-a636-453be9903cf9/005-website-categoryimages-dock3-fa.webp" },
    { label: "FlyCart 100", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/a743ac05-d8fa-4b7b-9812-ceb184e763b9/005-website-categoryimages-flycart100-fa.webp" },
  ],
  hasselblad: [
    { label: "X2D II 100C", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/7e2a0013-bac8-48f4-a377-c2e5d562ec76/005-website-categoryimages-hb-x2dii100c-fa.webp" },
    { label: "Camera Backpack", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/1ee20ed9-8d24-4656-91af-21c65bbdb01b/005-website-categoryimages-hb-camerabackpack-fa.webp" },
  ],
  accessories: [
    { label: "Drone Accessories", url: "https://www.d1store.com.au/cdn/shop/collections/PRODUCT-THUMB-CRF-OSMOPK4P-2Y-03.jpg?v=1785739689&width=600" },
    { label: "Services & Care", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/e8b5a82c-2a32-4690-b757-cf8ad0169481/005-website-categoryimages-services-fa.webp" },
    { label: "Handheld Accessories", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/865506e2-9272-4551-9d55-841b9f8e02bf/005-website-categoryimages-handheldaccessories-fa.webp" },
  ],
  sale: [
    { label: "DJI Sale & Deals", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/77aa140a-fe95-4305-90f2-f2dad008a8d6/005-website-categoryimages-sale-v2.png" },
    { label: "DJI Bundles", url: "https://www.d1store.com.au/cdn/shop/collections/dji-bundles.jpg?v=1790046698&width=360" },
    { label: "Ex-Demo Clearance", url: "https://cdn.d1store.app/shopify/product-page-editor/assets/42db7738-65fb-4a41-a22e-f81e39db4de2/005-website-categoryimages-hb-exdemo-fa.png" },
  ],
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [formData, setFormData] = useState<Partial<ICategory>>({
    name: "",
    slug: "",
    description: "",
    image: "",
    subCategories: [],
  });
  const [subCatsInput, setSubCatsInput] = useState("");
  const [modalError, setModalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirm Modal
  const [deleteTarget, setDeleteTarget] = useState<ICategory | null>(null);

  // Image Picker Modal
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [imagePickerContext, setImagePickerContext] = useState<"modal" | ICategory>("modal");
  const [showManualUrlInput, setShowManualUrlInput] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [catsRes, prodsRes] = await Promise.all([
        fetchCategories(),
        fetchProducts({ limit: 100 }),
      ]);
      setCategories(catsRes);
      setProducts(prodsRes.products);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          fetchCategories(),
          fetchProducts({ limit: 100 }),
        ]);
        if (!active) return;
        setCategories(catsRes);
        setProducts(prodsRes.products);
      } catch (err) {
        if (!active) return;
        console.error("Failed to load categories:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "https://cdn.d1store.app/shopify/product-page-editor/assets/2d431330-99da-464d-9f0a-1815ed9aa61e/005-website-categoryimages-mavic4p-fa.webp",
      subCategories: [],
    });
    setSubCatsInput("");
    setModalError("");
    setShowManualUrlInput(false);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: ICategory) => {
    setEditingCategory(cat);
    setFormData({ ...cat });
    setSubCatsInput(
      cat.subCategories
        ? cat.subCategories
            .map((sub) => (typeof sub === "string" ? sub : sub?.name || ""))
            .filter(Boolean)
            .join(", ")
        : ""
    );
    setModalError("");
    setShowManualUrlInput(false);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!formData.name?.trim()) {
      setModalError("Category Name is required.");
      return;
    }

    const autoSlug =
      formData.slug?.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const parsedSubCats = subCatsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<ICategory> = {
      ...formData,
      slug: autoSlug,
      subCategories: parsedSubCats,
    };

    setIsSubmitting(true);
    try {
      if (editingCategory && (editingCategory._id || editingCategory.slug)) {
        const id = editingCategory._id || editingCategory.slug;
        await updateCategoryApi(id, payload);
      } else {
        await createCategoryApi(payload);
      }
      setIsModalOpen(false);
      await loadData();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("d1_categories_updated"));
      }
    } catch (err) {
      console.error("Save category error:", err);
      setModalError("Failed to save category. Ensure slug is unique.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (cat: ICategory) => {
    const id = cat._id || cat.slug;
    try {
      await deleteCategoryApi(id);
      setCategories((prev) => prev.filter((c) => c._id !== cat._id && c.slug !== cat.slug));
      setDeleteTarget(null);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("d1_categories_updated"));
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      q === "" ||
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Category Taxonomy" },
        ]}
        title="Category Management"
        description="Organize catalog collections, parent categories, and sub-categories powering storefront navigation and filtering."
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
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
        }
      />

      {/* Search and Count Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)] flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <Layers className="w-4 h-4 text-[#0071e3]" />
          <span>Showing <strong>{filteredCategories.length}</strong> of {categories.length} categories</span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search categories..."
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
      </div>

      {/* Categories Table */}
      <AdminTableContainer>
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading category taxonomy...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <AdminEmptyState
            icon={Layers}
            title={searchQuery ? "No matching categories" : "No categories configured"}
            description={
              searchQuery
                ? `No categories match "${searchQuery}". Clear your search query to view all.`
                : "Create your first category to start organizing store products."
            }
            action={
              !searchQuery ? (
                <button
                  type="button"
                  onClick={openAddModal}
                  className="px-3.5 py-2 rounded-lg bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs font-semibold cursor-pointer"
                >
                  Create Category
                </button>
              ) : undefined
            }
          />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-5">Category Name</th>
                <th className="py-3.5 px-4">Slug Identifier</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Sub-Categories</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Products Linked</th>
                <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredCategories.map((cat) => {
                const linkedProductsCount = products.filter(
                  (p) =>
                    p.categorySlug === cat.slug ||
                    p.category?.toLowerCase() === cat.name.toLowerCase()
                ).length;

                return (
                  <tr key={cat._id || cat.slug} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name + Thumbnail */}
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => {
                            setEditingCategory(cat);
                            setImagePickerContext(cat);
                            setIsImagePickerOpen(true);
                          }}
                          title="Click to view or change cover image"
                          className="group/thumb relative w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer hover:border-[#0070e0] transition-all shadow-2xs"
                        >
                          {cat.image || (cat.subCategories?.[0] && typeof cat.subCategories[0] !== "string" && cat.subCategories[0]?.thumbnail) ? (
                            <img
                              src={cat.image || (cat.subCategories?.[0] as any)?.thumbnail}
                              alt={cat.name}
                              className="w-full h-full object-cover transition-transform group-hover/thumb:scale-105"
                            />
                          ) : (
                            <FolderOpen className="w-4 h-4 text-slate-400" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                            <ImagePlus className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{cat.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {cat.description || "No description specified"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                      /{cat.slug}
                    </td>

                    {/* Subcategories */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      {cat.subCategories && cat.subCategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {cat.subCategories.slice(0, 3).map((sub, i) => {
                            const subName = typeof sub === "string" ? sub : sub.name;
                            return (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-medium"
                              >
                                {subName}
                              </span>
                            );
                          })}
                          {cat.subCategories.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-xs font-bold">
                              +{cat.subCategories.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Products Count */}
                    <td className="py-3.5 px-4 hidden lg:table-cell whitespace-nowrap">
                      <AdminBadge variant="neutral" icon={Package}>
                        {linkedProductsCount} products
                      </AdminBadge>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <Link
                          href={`/collections/${cat.slug}`}
                          target="_blank"
                          title="View on storefront"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          title="Edit Category"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0071e3] hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(cat)}
                          title="Delete Category"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </AdminTableContainer>

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="py-4 space-y-4">
              {modalError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DJI Drones"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Slug (URL identifier)
                </label>
                <input
                  type="text"
                  placeholder="e.g. drones (auto-generated if blank)"
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description for collection pages..."
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                />
              </div>

              {/* Category Cover Image Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Category Cover Image
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePickerContext("modal");
                      setIsImagePickerOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-[#0070e0] hover:text-[#0058b8] font-semibold cursor-pointer"
                  >
                    <ImagePlus className="w-3.5 h-3.5" />
                    <span>Browse Media Library</span>
                  </button>
                </div>

                {/* Selected Image Preview Card */}
                {formData.image ? (
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
                        <img
                          src={formData.image}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Active Cover Image</span>
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono truncate max-w-xs" title={formData.image}>
                          {formData.image}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setImagePickerContext("modal");
                          setIsImagePickerOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: "" })}
                        className="px-2 py-1 text-xs font-semibold rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Remove image"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setImagePickerContext("modal");
                      setIsImagePickerOpen(true);
                    }}
                    className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#0070e0] bg-slate-50/50 hover:bg-sky-50/20 flex flex-col items-center justify-center cursor-pointer transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-sky-50 text-[#0070e0] flex items-center justify-center mb-1.5 border border-sky-100">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800">No cover image selected</p>
                    <p className="text-[11px] text-slate-500">Click to choose from website product & category images</p>
                  </div>
                )}

                {/* Quick-Pick Suggestions */}
                {(() => {
                  const currentSlug = formData.slug?.toLowerCase() || formData.name?.toLowerCase() || "";
                  const matchedKey = Object.keys(CATEGORY_IMAGE_PRESETS).find((k) =>
                    currentSlug.includes(k)
                  ) || "drones";
                  const presets = CATEGORY_IMAGE_PRESETS[matchedKey] || CATEGORY_IMAGE_PRESETS["drones"];

                  return (
                    <div className="pt-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Suggested Website Images:
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowManualUrlInput(!showManualUrlInput)}
                          className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                        >
                          {showManualUrlInput ? "Hide custom URL" : "Edit URL directly"}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                        {presets.map((preset) => {
                          const isCur = formData.image === preset.url;
                          return (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => setFormData({ ...formData, image: preset.url })}
                              title={preset.label}
                              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                                isCur
                                  ? "border-[#0070e0] bg-sky-50 text-[#0070e0] font-semibold"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              <img
                                src={preset.url}
                                alt={preset.label}
                                className="w-4 h-4 object-cover rounded shrink-0"
                              />
                              <span className="truncate max-w-[90px]">{preset.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Optional manual URL input if toggled */}
                {showManualUrlInput && (
                  <div className="pt-2 animate-in fade-in duration-150">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.image || ""}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0070e0]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sub-Categories (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mini Series, Air Series, Mavic Series"
                  value={subCatsInput}
                  onChange={(e) => setSubCatsInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
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
                  className="px-4 py-2 rounded-lg bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDeleteCategory(deleteTarget)}
        title="Delete Category?"
        description={
          deleteTarget ? (
            <>
              Are you sure you want to delete category <span className="font-semibold text-slate-900">{deleteTarget.name}</span>? Products assigned to this category will not be deleted, but may need recategorization.
            </>
          ) : null
        }
        confirmLabel="Delete Category"
        confirmVariant="danger"
        icon={Trash2}
      />

      {/* Website Image Picker Modal */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        title={
          imagePickerContext === "modal"
            ? `Select Image for ${formData.name || "Category"}`
            : `Update Image for ${(imagePickerContext as ICategory)?.name || "Category"}`
        }
        currentImage={imagePickerContext === "modal" ? formData.image : (imagePickerContext as ICategory)?.image}
        categoryFilterHint={
          imagePickerContext === "modal"
            ? formData.slug || formData.name
            : (imagePickerContext as ICategory)?.slug || (imagePickerContext as ICategory)?.name
        }
        onSelect={async (newUrl) => {
          if (imagePickerContext === "modal") {
            setFormData((prev) => ({ ...prev, image: newUrl }));
          } else {
            // direct update from table
            const cat = imagePickerContext as ICategory;
            const id = cat._id || cat.slug;
            try {
              await updateCategoryApi(id, { image: newUrl });
              await loadData();
              if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("d1_categories_updated"));
              }
            } catch (err) {
              console.error("Failed to update category image:", err);
            }
          }
        }}
      />
    </div>
  );
}
