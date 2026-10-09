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
} from "lucide-react";
import {
  AdminHeader,
  AdminBadge,
  AdminTableContainer,
  AdminEmptyState,
  AdminConfirmDialog,
} from "@/components/admin/AdminComponents";

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
      image: "https://cdn.d1store.app/shopify/product-page-editor/assets/cc2128f7-0a63-4b8c-924b-d37d38f8b2e6/005-website-categoryimages-mavic4p-fa.webp",
      subCategories: [],
    });
    setSubCatsInput("");
    setModalError("");
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
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FolderOpen className="w-4 h-4 text-slate-400" />
                          )}
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.image || ""}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0071e3]"
                />
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
    </div>
  );
}
