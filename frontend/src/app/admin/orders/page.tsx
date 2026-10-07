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

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetchOrders();
      setOrders(res);
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
    } catch (err) {
      console.error("Failed to update status:", err);
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
                          <Link
                            href={`/orders/${orderKey}/confirmation`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold transition-colors"
                            title="View customer confirmation"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Details</span>
                          </Link>
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
    </div>
  );
}
