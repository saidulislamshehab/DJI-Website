"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fetchOrderById, cancelOrderApi } from "@/lib/api";
import { IOrder } from "@/types";
import {
  Package,
  Printer,
  ShoppingBag,
  Truck,
  MapPin,
  CreditCard,
  Mail,
  Phone,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (Array.isArray(params.id) ? params.id[0] : params.id) || "";

  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");

  const loadOrder = async () => {
    setIsLoading(true);
    try {
      if (id) {
        const res = await fetchOrderById(id);
        setOrder(res);
      }
    } catch (err) {
      console.error("Failed to load order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleConfirmCancel = async () => {
    if (!order) return;
    setIsCancelling(true);
    setCancelError("");

    try {
      const updated = await cancelOrderApi(order._id || order.orderNumber, cancelReason);
      if (updated) {
        setOrder(updated);
        setCancelModalOpen(false);
      }
    } catch (err: any) {
      setCancelError(err.response?.data?.message || err.message || "Failed to cancel order.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfbfd]">
        <Header />
        <div className="flex-1 page-width py-24 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 font-bold">Loading order details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfbfd]">
        <Header />
        <div className="flex-1 page-width py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-[#121212] mb-2">Order Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">
            We couldn&apos;t find order reference &apos;{id}&apos;. Please check your email or order number.
          </p>
          <Link
            href="/account"
            className="px-6 py-2.5 rounded-full bg-[#0071e3] text-white font-bold text-sm hover:bg-[#0058b8] transition-colors"
          >
            Go to My Account &rarr;
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Tracking steps definition
  const steps = ["Pending", "Processing", "Shipped", "Delivered"];
  const isCancelled = order.status === "Cancelled";
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] text-[#121212]">
      <Header />

      <main className="flex-1 page-width py-8 md:py-14">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back link & Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-600 hover:text-[#0071e3] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Account Orders</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href={`/orders/${order._id || order.orderNumber}/invoice`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Tax Invoice</span>
              </Link>

              {order.status === "Pending" && (
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(true)}
                  className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Order Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Reference</span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#121212]">#{order.orderNumber}</h1>
                <p className="text-xs text-gray-500 mt-1">
                  Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString("en-AU", { dateStyle: "long" })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    isCancelled
                      ? "bg-red-100 text-red-700"
                      : order.status === "Delivered"
                      ? "bg-emerald-100 text-emerald-800"
                      : order.status === "Shipped"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-[#0071e3]"
                  }`}
                >
                  {order.status}
                </span>

                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                  Payment: {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Tracking Progress Bar */}
            {!isCancelled ? (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-700 mb-4">Order Fulfillment Status</p>
                <div className="grid grid-cols-4 gap-2 relative">
                  {steps.map((step, idx) => {
                    const isDone = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;
                    return (
                      <div key={step} className="text-center">
                        <div
                          className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-all mb-2 ${
                            isDone
                              ? "bg-emerald-600 text-white ring-4 ring-emerald-50"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-xs block font-bold ${
                            isCurrent ? "text-emerald-700" : isDone ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {order.trackingNumber && (
                  <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-[#0071e3]">
                      <Truck className="w-4 h-4" />
                      <span>
                        Shipped via {order.trackingCompany || "StarTrack Express"}:{" "}
                        <strong className="text-gray-900">{order.trackingNumber}</strong>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-center gap-3">
                <XCircle className="w-5 h-5 shrink-0" />
                <span>
                  This order was cancelled. Any reserved stock has been returned to inventory.
                </span>
              </div>
            )}
          </div>

          {/* Delivery & Payment Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#121212] flex items-center gap-2 pb-3 border-b border-gray-100">
                <MapPin className="w-4 h-4 text-[#0071e3]" />
                <span>Shipping Address</span>
              </h3>
              <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                <p className="font-bold text-[#121212]">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p>{order.customer.address}</p>
                {order.customer.apartment && <p>{order.customer.apartment}</p>}
                <p>
                  {order.customer.city}, {order.customer.state} {order.customer.postcode}
                </p>
                <p>{order.customer.country}</p>
                <p className="pt-2 text-gray-500 font-medium">{order.customer.email}</p>
                <p className="text-gray-500">{order.customer.phone}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#121212] flex items-center gap-2 pb-3 border-b border-gray-100">
                <CreditCard className="w-4 h-4 text-[#0071e3]" />
                <span>Payment & Dispatch</span>
              </h3>
              <div className="text-xs sm:text-sm text-gray-600 space-y-2">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Payment Method</p>
                  <p className="font-bold text-[#121212]">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Shipping Option</p>
                  <p className="font-bold text-[#121212]">{order.shippingMethod}</p>
                </div>
                {order.notes && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Order Instructions</p>
                    <p className="text-gray-600 italic">&ldquo;{order.notes}&rdquo;</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-base text-[#121212] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#0071e3]" />
                <span>Ordered Items ({order.items.length})</span>
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items.map((item, index) => (
                <div key={index} className="p-6 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-16 h-16 bg-[#f8f9fa] rounded-xl p-2 border border-gray-100 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-xs sm:text-sm font-bold text-[#121212] hover:text-[#0071e3] transition-colors truncate block"
                    >
                      {item.name}
                    </Link>
                    {item.variantName && (
                      <p className="text-xs text-gray-500">Option: {item.variantName}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Qty: <span className="font-bold text-gray-800">{item.quantity}</span> &times; ${item.price.toLocaleString()} AUD
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm sm:text-base font-black text-[#121212]">
                      ${(item.price * item.quantity).toLocaleString()} AUD
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="bg-gray-50/50 p-6 border-t border-gray-100 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-[#121212]">${order.subtotal.toLocaleString()} AUD</span>
              </div>

              {order.discountAmount ? (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({order.discountCode || "Promo"})</span>
                  <span>-${order.discountAmount.toLocaleString()} AUD</span>
                </div>
              ) : null}

              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span className="font-bold text-[#121212]">
                  {order.shippingFee === 0 ? "FREE" : `$${order.shippingFee}.00 AUD`}
                </span>
              </div>

              <div className="flex justify-between text-gray-500 text-xs">
                <span>Includes 10% Australian GST</span>
                <span>${order.tax.toLocaleString()} AUD</span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between text-base sm:text-lg font-black text-[#121212]">
                <span>Total Amount</span>
                <span className="text-[#0071e3]">${order.total.toLocaleString()} AUD</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Cancel Order #{order.orderNumber}?</h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Are you sure you want to cancel this order? This action will restore product quantities and cannot be undone.
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Reason for cancellation (optional):
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Changed mind, ordered wrong variant..."
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            {cancelError && (
              <p className="text-xs text-red-600 font-semibold">{cancelError}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
