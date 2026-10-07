"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProducts, fetchOrders, fetchCategories } from "@/lib/api";
import { IProduct, IOrder, ICategory } from "@/types";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  Sliders,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [prodsRes, ordsRes, catsRes] = await Promise.all([
          fetchProducts({ limit: 100 }),
          fetchOrders(),
          fetchCategories(),
        ]);
        setProducts(prodsRes.products);
        setOrders(ordsRes);
        setCategories(catsRes);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Compute metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const lowStockProducts = products.filter((p) => p.stockCount <= 5 || !p.inStock);
  const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "Processing");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-10 h-10 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-bold text-gray-500">Loading admin metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Overview of D1 Store sales, inventory status, and order operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-bold transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
          <Link
            href="/admin/homepage-sections"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-bold transition-all shadow-sm"
          >
            <Sliders className="w-4 h-4" />
            <span>Homepage Layout</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Sales</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            ${totalRevenue.toLocaleString()} AUD
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>From {orders.length} placed orders</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Orders</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0071e3] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">{orders.length}</div>
          <p className="text-xs text-blue-600 font-semibold mt-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingOrders.length} currently active/processing</span>
          </p>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Catalog</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">{products.length}</div>
          <p className="text-xs text-purple-600 font-semibold mt-2">
            Across {categories.length} categories
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Inventory Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">{lowStockProducts.length}</div>
          <p className="text-xs text-amber-600 font-semibold mt-2">
            {lowStockProducts.length > 0 ? "Items require restocking" : "All products well stocked"}
          </p>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Low Stock Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-gray-900">Recent Customer Orders</h2>
              <p className="text-xs text-gray-500 mt-0.5">Latest real-time customer transactions</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#0071e3] hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">No customer orders recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase">
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id || order.orderNumber} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">#{order.orderNumber}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-gray-900">
                          {order.customer.firstName} {order.customer.lastName}
                        </p>
                        <p className="text-[11px] text-gray-400">{order.customer.email}</p>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </td>
                      <td className="py-3.5 px-4 font-black text-gray-900">
                        ${order.total.toLocaleString()} AUD
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/orders/${order._id || order.orderNumber}/invoice`}
                          target="_blank"
                          className="inline-flex items-center gap-1 font-bold text-[#0071e3] hover:underline text-[11px]"
                        >
                          <span>Invoice</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Watch */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-black text-gray-900">Inventory Status</h2>
              <p className="text-xs text-gray-500 mt-0.5">Products with low stock</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-[#0071e3] hover:underline"
            >
              Manage &rarr;
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All items are sufficiently stocked!
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((p) => (
                <div
                  key={p._id || p.slug}
                  className="p-3 rounded-xl bg-amber-50/40 border border-amber-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.mainImage || (p.images && p.images[0])}
                      alt={p.name}
                      className="w-10 h-10 object-contain rounded-md bg-white border border-gray-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-500">SKU: {p.sku}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${
                      p.stockCount === 0 ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {p.stockCount === 0 ? "Out of Stock" : `${p.stockCount} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
