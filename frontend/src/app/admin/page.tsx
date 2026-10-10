"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProducts, fetchOrders, fetchCategories, fetchUserStatsApi, fetchProductStatsApi, IProductStats } from "@/lib/api";
import { IProduct, IOrder, ICategory } from "@/types";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Sliders,
  Users,
  ShieldCheck,
  Layers,
  CheckCircle2,
  RefreshCw,
  Eye,
} from "lucide-react";
import {
  AdminHeader,
  AdminStatCard,
  AdminBadge,
  AdminTableContainer,
  AdminEmptyState,
} from "@/components/admin/AdminComponents";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productStats, setProductStats] = useState<IProductStats | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [userStats, setUserStats] = useState<{ totalUsers: number; totalAdmins: number; totalCustomers: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [prodsRes, pStatsRes, ordsRes, catsRes, statsRes] = await Promise.all([
        fetchProducts({ limit: 100 }),
        fetchProductStatsApi().catch(() => null),
        fetchOrders(),
        fetchCategories(),
        fetchUserStatsApi(),
      ]);
      setProducts(prodsRes.products);
      if (pStatsRes) setProductStats(pStatsRes);
      setOrders(ordsRes);
      setCategories(catsRes);
      setUserStats(statsRes);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [prodsRes, pStatsRes, ordsRes, catsRes, statsRes] = await Promise.all([
          fetchProducts({ limit: 100 }),
          fetchProductStatsApi().catch(() => null),
          fetchOrders(),
          fetchCategories(),
          fetchUserStatsApi(),
        ]);
        if (!active) return;
        setProducts(prodsRes.products);
        if (pStatsRes) setProductStats(pStatsRes);
        setOrders(ordsRes);
        setCategories(catsRes);
        setUserStats(statsRes);
      } catch (err) {
        if (!active) return;
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // Compute metrics from genuine database data
  const validOrders = orders.filter((o) => o.status !== "Cancelled" && o.paymentStatus !== "Failed");
  const totalRevenue = validOrders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const lowStockProducts = products.filter((p) => (p.stockCount ?? 0) <= 5 || !p.inStock);
  const lowStockCount = productStats?.lowStock ?? lowStockProducts.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "Processing");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Dashboard Overview" },
        ]}
        title="Admin Dashboard"
        description="Comprehensive overview of D1 Store sales performance, active catalog inventory, real-time orders, and system accounts."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadDashboardData}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 ${isLoading ? "animate-spin text-[#0071e3]" : ""}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Manage Products</span>
            </Link>
          </div>
        }
      />

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AdminStatCard
          title="Total Sales"
          value={`$${totalRevenue.toLocaleString()}`}
          subtitle={`${orders.length} orders recorded`}
          icon={DollarSign}
          iconColor="emerald"
        />
        <AdminStatCard
          title="Customer Orders"
          value={orders.length}
          subtitle={`${pendingOrders.length} pending / processing`}
          icon={ShoppingBag}
          iconColor="blue"
          href="/admin/orders"
        />
        <AdminStatCard
          title="Active Catalog"
          value={productStats?.total ?? products.length}
          subtitle={`Across ${categories.length} categories`}
          icon={Package}
          iconColor="purple"
          href="/admin/products"
        />
        <AdminStatCard
          title="Users & Roles"
          value={userStats?.totalUsers ?? "—"}
          subtitle={`${userStats?.totalAdmins ?? 0} Admins • ${userStats?.totalCustomers ?? 0} Users`}
          icon={Users}
          iconColor="indigo"
          href="/admin/users"
        />
        <AdminStatCard
          title="Low Stock"
          value={lowStockCount}
          subtitle={lowStockCount > 0 ? "Requires restock attention" : "All items well stocked"}
          icon={AlertTriangle}
          iconColor="amber"
          href="/admin/products"
        />
      </div>

      {/* Management Navigation Modules */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3.5">
          Management Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Link
            href="/admin/products"
            className="p-4 rounded-lg bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 transition-all group block"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0071e3] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
            <p className="font-semibold text-xs text-slate-900 group-hover:text-[#0071e3] transition-colors">
              Products Catalog
            </p>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">
              Add drones, accessories, combos, and manage specs
            </p>
          </Link>

          <Link
            href="/admin/categories"
            className="p-4 rounded-lg bg-slate-50 hover:bg-purple-50/50 border border-slate-200/80 hover:border-purple-200 transition-all group block"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <p className="font-semibold text-xs text-slate-900 group-hover:text-purple-600 transition-colors">
              Category Taxonomy
            </p>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">
              Organize catalog collections and sub-categories
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="p-4 rounded-lg bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-200 transition-all group block"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <p className="font-semibold text-xs text-slate-900 group-hover:text-emerald-600 transition-colors">
              Customer Orders
            </p>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">
              Fulfill items, update statuses, print ATO tax invoices
            </p>
          </Link>

          <Link
            href="/admin/homepage-sections"
            className="p-4 rounded-lg bg-slate-50 hover:bg-amber-50/50 border border-slate-200/80 hover:border-amber-200 transition-all group block"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Sliders className="w-4 h-4" />
            </div>
            <p className="font-semibold text-xs text-slate-900 group-hover:text-amber-600 transition-colors">
              Homepage Layout
            </p>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">
              Curate and order featured carousels &amp; bento grids
            </p>
          </Link>

          <Link
            href="/admin/users"
            className="p-4 rounded-lg bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 transition-all group block sm:col-span-2 lg:col-span-1"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="font-semibold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
              Users &amp; Roles
            </p>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">
              Grant administrator privileges &amp; account permissions
            </p>
          </Link>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Low Stock Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Section */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Customer Orders</h2>
              <p className="text-xs text-slate-500">Real-time incoming store transactions</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#0071e3] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <AdminTableContainer>
            {isLoading ? (
              <div className="py-16 text-center text-slate-400 text-xs">Loading orders...</div>
            ) : orders.length === 0 ? (
              <AdminEmptyState
                icon={ShoppingBag}
                title="No customer orders yet"
                description="Orders placed on the storefront will appear here."
              />
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-5">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 sm:px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {orders.slice(0, 5).map((order) => {
                    const statusVariant =
                      order.status === "Delivered"
                        ? "success"
                        : order.status === "Shipped"
                        ? "info"
                        : order.status === "Cancelled"
                        ? "danger"
                        : "warning";

                    return (
                      <tr key={order._id || order.orderNumber} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 sm:px-5 font-mono text-xs font-bold text-slate-900">
                          #{order.orderNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-900 truncate">
                            {order.customer.firstName} {order.customer.lastName}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{order.customer.email}</p>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                          ${(order.total || 0).toLocaleString()} AUD
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <AdminBadge variant={statusVariant}>
                            {order.status || "Processing"}
                          </AdminBadge>
                        </td>
                        <td className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                          <Link
                            href="/admin/orders"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </AdminTableContainer>
        </div>

        {/* Low Stock Monitor */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Inventory Watch</h2>
              <p className="text-xs text-slate-500">Products with critical stock level</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-[#0071e3] hover:underline"
            >
              Catalog
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">Inventory Healthy</p>
                <p className="text-xs text-slate-500 mt-0.5">All active catalog products have adequate inventory.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {lowStockProducts.slice(0, 5).map((prod) => (
                  <div key={prod._id || prod.slug} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-slate-900 truncate">{prod.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">SKU: {prod.sku || "N/A"}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                        prod.stockCount === 0 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {prod.stockCount} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
