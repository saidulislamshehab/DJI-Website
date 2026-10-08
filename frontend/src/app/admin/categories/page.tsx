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
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
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
    loadData();
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
    setSubCatsInput(cat.subCategories ? cat.subCategories.join(", ") : "");
    setModalError("");
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!formData.name) {
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
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    const id = cat._id || cat.slug;
    try {
      await deleteCategoryApi(id);
      setCategories((prev) => prev.filter((c) => c._id !== cat._id && c.slug !== cat.slug));
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Category Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Organize product collections and sub-categories across the storefront
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500 font-bold">Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-16 text-center text-gray-500 text-xs sm:text-sm bg-white rounded-2xl border border-gray-200">
          <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          No categories found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const catProds = products.filter(
              (p) =>
                p.categorySlug === cat.slug ||
                p.category?.toLowerCase() === cat.name.toLowerCase()
            );

            return (
              <div
                key={cat._id || cat.slug}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-gray-300 transition-all"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0071e3] flex items-center justify-center font-black flex-shrink-0">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/collections/${cat.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                        title="View collection"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                        title="Edit category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-base text-gray-900">{cat.name}</h3>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">/collections/{cat.slug}</p>
                    {cat.description && (
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">{cat.description}</p>
                    )}
                  </div>

                  {/* Subcategories list pills */}
                  {cat.subCategories && cat.subCategories.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">Sub-categories:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.subCategories.map((sub, i) => {
                          const subName = typeof sub === "string" ? sub : sub.name;
                          return (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[10px] font-semibold"
                            >
                              {subName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="font-semibold">{catProds.length} products listed</span>
                  <Link
                    href={`/collections/${cat.slug}`}
                    target="_blank"
                    className="font-bold text-[#0071e3] hover:underline flex items-center gap-1"
                  >
                    <span>View Storefront</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Handheld & Gimbals"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. handhelds (leave empty to auto-generate)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Sub-categories (comma-separated)
                </label>
                <input
                  type="text"
                  value={subCatsInput}
                  onChange={(e) => setSubCatsInput(e.target.value)}
                  placeholder="Osmo Pocket, Osmo Action, Ronin Gimbals"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#0071e3]"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
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
                  className="px-6 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white font-bold transition-all shadow-sm"
                >
                  {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
