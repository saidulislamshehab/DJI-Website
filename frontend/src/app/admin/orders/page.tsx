"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchOrders, updateOrderStatusApi } from "@/lib/api";
import { IOrder } from "@/types";
import {
  ShoppingBag,
  Search,
  ExternalLink,
  Printer,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";

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
    loadOrders();
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
    const matchesSearch =
      searchQuery === "" ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Customer Orders</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track order fulfillment, update delivery status, and view customer tax invoices
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-bold shadow-xs transition-colors"
        >
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => {
            const count = st === "All" ? orders.length : orders.filter((o) => o.status === st).length;
            const isActive = statusFilter === st;

            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#0071e3] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{st}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search order #, customer, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs focus:outline-hidden focus:border-[#0071e3]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-bold">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-xs sm:text-sm">
            <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            No customer orders found matching this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase">
                  <th className="py-3.5 px-4">Order Details</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items Ordered</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Fulfillment Status</th>
                  <th className="py-3.5 px-4 text-right">Invoice & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const orderKey = order._id || order.orderNumber;
                  const isUpdating = updatingId === orderKey;

                  return (
                    <tr key={orderKey} className="hover:bg-gray-50/60 transition-colors">
                      {/* Order Details */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-gray-900 text-sm">#{order.orderNumber}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {new Date(order.createdAt || Date.now()).toLocaleDateString("en-AU", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-gray-900">
                          {order.customer.firstName} {order.customer.lastName}
                        </p>
                        <p className="text-[11px] text-gray-500">{order.customer.email}</p>
                        <p className="text-[11px] text-gray-400">
                          {order.customer.city}, {order.customer.state}
                        </p>
                      </td>

                      {/* Items Ordered */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 max-w-xs">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-[11px]">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-6 h-6 object-contain rounded bg-gray-50 border border-gray-100 flex-shrink-0"
                              />
                              <span className="text-gray-800 font-medium truncate">
                                {item.quantity}x {item.name}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-[10px] text-gray-400 italic">
                              + {order.items.length - 2} more item(s)
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4">
                        <p className="font-black text-gray-900 text-sm">
                          ${order.total.toLocaleString()} AUD
                        </p>
                        <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5">
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          disabled={isUpdating}
                          onChange={(e) =>
                            handleStatusChange(orderKey, e.target.value as IOrder["status"])
                          }
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all focus:outline-hidden ${
                            order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : order.status === "Shipped"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : order.status === "Processing"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-red-50 text-red-800 border-red-200"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Action Links */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold transition-colors cursor-pointer"
                            title="View full order details"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Details</span>
                          </button>
                          <Link
                            href={`/orders/${orderKey}/invoice`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0071e3] hover:bg-[#0058b8] text-white text-[11px] font-bold transition-colors shadow-xs"
                            title="View official ATO tax invoice"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Invoice</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-gray-900">
                    Order #{selectedOrder.orderNumber}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      selectedOrder.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : selectedOrder.status === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : selectedOrder.status === "Processing"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt || Date.now()).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6 text-xs sm:text-sm">
              {/* Order Status & Payment Status Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-bold text-xs focus:outline-hidden focus:border-[#0071e3]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-bold text-xs focus:outline-hidden focus:border-[#0071e3]"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Customer Info</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                  </p>
                  <p className="text-gray-600 mt-1">{selectedOrder.customer.email}</p>
                  {selectedOrder.customer.phone && (
                    <p className="text-gray-500 mt-0.5">{selectedOrder.customer.phone}</p>
                  )}
                </div>

                <div className="p-4 rounded-2xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Delivery Address</p>
                  <p className="text-gray-800">{selectedOrder.customer.address}</p>
                  {selectedOrder.customer.apartment && (
                    <p className="text-gray-600">{selectedOrder.customer.apartment}</p>
                  )}
                  <p className="text-gray-600">
                    {selectedOrder.customer.city}, {selectedOrder.customer.state} {selectedOrder.customer.postcode}
                  </p>
                  <p className="text-gray-500">{selectedOrder.customer.country || "Australia"}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 text-xs font-bold text-gray-700">
                  Ordered Items ({selectedOrder.items.length})
                </div>
                <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-10 h-10 object-contain rounded-lg bg-gray-50 border border-gray-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">{it.name}</p>
                          <p className="text-gray-500 text-[11px]">
                            Qty: {it.quantity} &times; ${it.price.toLocaleString()} AUD
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-gray-900 shrink-0">
                        ${(it.price * it.quantity).toLocaleString()} AUD
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${selectedOrder.subtotal?.toLocaleString() || selectedOrder.total.toLocaleString()} AUD</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping ({selectedOrder.shippingMethod || "Standard"})</span>
                  <span>${(selectedOrder.shippingFee || 0).toLocaleString()} AUD</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Included GST (10%)</span>
                  <span>${((selectedOrder.total * 0.1) / 1.1).toFixed(2)} AUD</span>
                </div>
                <div className="flex justify-between font-black text-sm text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-[#0071e3]">${selectedOrder.total.toLocaleString()} AUD</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  href={`/orders/${selectedOrder._id || selectedOrder.orderNumber}/invoice`}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Tax Invoice</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
