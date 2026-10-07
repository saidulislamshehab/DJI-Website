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
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
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
    badge: "",
    mainImage: "",
    description: "",
    features: [],
  });
  const [featuresInput, setFeaturesInput] = useState("");
  const [modalError, setModalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      badge: "New",
      mainImage: "https://cdn.d1store.app/shopify/product-page-editor/assets/cc2128f7-0a63-4b8c-924b-d37d38f8b2e6/005-website-categoryimages-mavic4p-fa.webp",
      description: "High-performance authentic DJI product with local Australian warranty.",
      features: ["Advanced 4K Camera", "Omnidirectional Obstacle Sensing", "Up to 45 Mins Flight Time"],
    });
    setFeaturesInput("Advanced 4K Camera\nOmnidirectional Obstacle Sensing\nUp to 45 Mins Flight Time");
    setModalError("");
    setIsModalOpen(true);
  };

  const openEditModal = (p: IProduct) => {
    setEditingProduct(p);
    setFormData({
      ...p,
    });
    setFeaturesInput(p.features ? p.features.join("\n") : "");
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

    const payload: Partial<IProduct> = {
      ...formData,
      slug: autoSlug,
      features: parsedFeatures,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stockCount: Number(formData.stockCount || 0),
      inStock: Number(formData.stockCount || 0) > 0,
      images: formData.mainImage ? [formData.mainImage] : [],
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

    return matchesSearch && matchesCategory;
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
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
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
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price (AUD)</th>
                  <th className="py-3.5 px-4">Inventory Level</th>
                  <th className="py-3.5 px-4">Stock Status</th>
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
                          {p.badge && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-[#0071e3] mt-0.5">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* SKU / Slug */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-700">{p.sku}</p>
                      <p className="text-[10px] text-gray-400 font-mono truncate max-w-[130px]">{p.slug}</p>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium">
                        {p.category}
                      </span>
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
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">
                {editingProduct ? "Edit Product" : "Add New DJI Product"}
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

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. DJI Mavic 4 Pro Fly More Combo"
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
                    placeholder="e.g. Sale, New, Hot"
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
                    Key Features (one per line)
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
                  className="px-6 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
