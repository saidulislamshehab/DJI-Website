"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchOrders, updateOrderStatusApi } from "@/lib/api";
import { IOrder } from "@/types";
import {
  ShoppingBag,
  Search,
  Printer,
  Eye,
  RefreshCw,
  X,
  User,
  MapPin,
} from "lucide-react";
import {
  AdminHeader,
  AdminBadge,
  AdminTableContainer,
  AdminEmptyState,
} from "@/components/admin/AdminComponents";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetchOrders();
      setOrders(res);
      if (selectedOrder) {
        const refreshed = res.find((o) => o._id === selectedOrder._id || o.orderNumber === selectedOrder.orderNumber);
        if (refreshed) setSelectedOrder(refreshed);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetchOrders();
        if (!active) return;
        setOrders(res);
      } catch (err) {
        if (!active) return;
        console.error("Failed to load orders:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: IOrder["status"]) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatusApi(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId || o.orderNumber === orderId ? { ...o, status: newStatus } : o
        )
      );
      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderNumber === orderId)) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newPaymentStatus: IOrder["paymentStatus"]) => {
    setUpdatingId(orderId);
    try {
      const currentOrder = orders.find((o) => o._id === orderId || o.orderNumber === orderId);
      const currentStatus = currentOrder?.status || "Processing";
      await updateOrderStatusApi(orderId, currentStatus, newPaymentStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId || o.orderNumber === orderId ? { ...o, paymentStatus: newPaymentStatus } : o
        )
      );
      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderNumber === orderId)) {
        setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus: newPaymentStatus } : null));
      }
    } catch (err) {
      console.error("Failed to update payment status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.firstName.toLowerCase().includes(q) ||
      o.customer.lastName.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const getPaymentBadgeVariant = (pst: string) => {
    switch (pst) {
      case "Paid":
        return "success";
      case "Failed":
        return "danger";
      default:
        return "warning";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Customer Orders" },
        ]}
        title="Customer Orders"
        description="Monitor transactions, update fulfillment and shipping workflows, view detailed order contents, and access official ATO tax invoices."
        actions={
          <button
            type="button"
            onClick={loadOrders}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${isLoading ? "animate-spin text-[#0071e3]" : ""}`} />
            <span>Refresh</span>
          </button>
        }
      />

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)] flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => {
            const count = st === "All" ? orders.length : orders.filter((o) => o.status === st).length;
            const isActive = statusFilter === st;

            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                <span>{st}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-xs ${
                    isActive ? "bg-white/20 text-white font-bold" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search order #, customer, email..."
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

      {/* Orders Table */}
      <AdminTableContainer>
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading customer orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <AdminEmptyState
            icon={ShoppingBag}
            title={searchQuery ? "No matching orders found" : "No orders found in this view"}
            description={
              searchQuery
                ? `No orders matched "${searchQuery}". Clear your search or change the status filter.`
                : "Customer orders will appear here once purchases are completed."
            }
          />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-5">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Date</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Fulfillment</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Payment</th>
                <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredOrders.map((order) => {
                const orderKey = order._id || order.orderNumber;
                const isUpdating = updatingId === orderKey;

                return (
                  <tr key={orderKey} className="hover:bg-slate-50/60 transition-colors">
                    {/* Order ID */}
                    <td className="py-3.5 px-4 sm:px-5 font-mono text-xs font-bold text-slate-900">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="hover:text-[#0071e3] hover:underline cursor-pointer text-left"
                      >
                        #{order.orderNumber}
                      </button>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900 truncate">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{order.customer.email}</p>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap hidden md:table-cell">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-AU", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Recent"}
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      ${(order.total || 0).toLocaleString()} AUD
                    </td>

                    {/* Fulfillment Status Select */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        disabled={isUpdating}
                        onChange={(e) =>
                          handleStatusChange(orderKey, e.target.value as IOrder["status"])
                        }
                        className="text-xs font-semibold px-2 py-1 rounded-md border border-slate-200 bg-white text-slate-800 cursor-pointer focus:outline-none focus:border-[#0071e3]"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap hidden lg:table-cell">
                      <AdminBadge variant={getPaymentBadgeVariant(order.paymentStatus)}>
                        {order.paymentStatus || "Paid"}
                      </AdminBadge>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                        <Link
                          href={`/orders/${order._id || order.orderNumber}/invoice`}
                          target="_blank"
                          title="Print ATO Tax Invoice"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </AdminTableContainer>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0071e3] flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Placed on {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString("en-AU") : "Recent"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-5">
              {/* Customer and Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Customer Information</span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                  </p>
                  <p className="text-slate-600">{selectedOrder.customer.email}</p>
                  <p className="text-slate-600">{selectedOrder.customer.phone || "No phone provided"}</p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Shipping Address</span>
                  </div>
                  <p className="font-semibold text-slate-800">
                    {selectedOrder.customer?.address || "No street address provided"}
                    {selectedOrder.customer?.apartment ? `, ${selectedOrder.customer.apartment}` : ""}
                  </p>
                  <p className="text-slate-600">
                    {selectedOrder.customer?.city || "Sydney"}, {selectedOrder.customer?.state || "NSW"} {selectedOrder.customer?.postcode || ""}
                  </p>
                  <p className="text-slate-500">{selectedOrder.customer?.country || "Australia"}</p>
                </div>
              </div>

              {/* Status Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Fulfillment Status
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedOrder._id || selectedOrder.orderNumber,
                        e.target.value as IOrder["status"]
                      )
                    }
                    className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Payment Status
                  </label>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) =>
                      handlePaymentStatusChange(
                        selectedOrder._id || selectedOrder.orderNumber,
                        e.target.value as IOrder["paymentStatus"]
                      )
                    }
                    className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Ordered Items List */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                  Ordered Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {selectedOrder.items?.map((item, idx) => {
                    const itemName = item.name || (item as { title?: string }).title || "DJI Product";
                    return (
                      <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs bg-white">
                        <div className="flex items-center gap-3 min-w-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={itemName}
                              className="w-10 h-10 object-contain rounded-md border border-slate-100 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                              <ShoppingBag className="w-4 h-4 text-slate-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{itemName}</p>
                            <p className="text-slate-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-slate-900">
                            ${((item.price || 0) * item.quantity).toLocaleString()} AUD
                          </p>
                          <p className="text-xs text-slate-400">
                            ${(item.price || 0).toLocaleString()} ea
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Financials */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${(selectedOrder.subtotal || selectedOrder.total || 0).toLocaleString()} AUD</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Standard Express Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                  <span>Total (Inc. GST)</span>
                  <span>${(selectedOrder.total || 0).toLocaleString()} AUD</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <Link
                href={`/orders/${selectedOrder._id || selectedOrder.orderNumber}/invoice`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View ATO Tax Invoice</span>
              </Link>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
