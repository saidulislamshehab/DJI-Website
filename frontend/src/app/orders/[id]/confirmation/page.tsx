"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fetchOrderById } from "@/lib/api";
import { IOrder } from "@/types";
import {
  CheckCircle2,
  Package,
  Printer,
  ShoppingBag,
  Truck,
  MapPin,
  CreditCard,
  Mail,
  Phone,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function OrderConfirmationPage() {
  const params = useParams();
  const id = (Array.isArray(params.id) ? params.id[0] : params.id) || "";

  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
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
    }
    loadOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfbfd]">
        <Header />
        <div className="flex-1 page-width py-24 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 font-bold">Retrieving order details...</p>
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
            We couldn't locate order reference '{id}'. If you just placed this order, please check your confirmation email.
          </p>
          <Link
            href="/collections/all"
            className="px-6 py-2.5 rounded-full bg-[#0071e3] text-white font-bold text-sm hover:bg-[#0058b8] transition-colors"
          >
            Continue Shopping &rarr;
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] text-[#121212]">
      <Header />

      <main className="flex-1 page-width py-10 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Success Banner */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xs text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
              Payment Confirmed
            </span>

            <h1 className="text-2xl sm:text-4xl font-black text-[#121212] mb-2">
              Thank You for Your Order, {order.customer.firstName}!
            </h1>

            <p className="text-sm text-gray-500 max-w-lg mx-auto mb-6">
              Your order <span className="font-bold text-[#121212]">#{order.orderNumber}</span> has been received and is being prepared for dispatch from our Australian warehouse.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/orders/${order._id || order.orderNumber}/invoice`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-bold transition-all shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>View & Print Tax Invoice</span>
              </Link>

              <Link
                href="/collections/all"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-[#121212] text-xs sm:text-sm font-bold transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Details */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
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
              </div>

              <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{order.customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{order.customer.phone}</span>
                </div>
              </div>
            </div>

            {/* Delivery & Payment Method */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#121212] flex items-center gap-2 pb-3 border-b border-gray-100">
                <Truck className="w-4 h-4 text-[#0071e3]" />
                <span>Shipping & Payment Info</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Shipping Method</p>
                  <p className="font-bold text-[#121212] mt-0.5">{order.shippingMethod}</p>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Payment Method</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    <span className="font-bold text-[#121212]">{order.paymentMethod}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Order Status</p>
                  <span className="inline-block mt-0.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0071e3]">
                    {order.status}
                  </span>
                </div>
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
              <span className="text-xs text-gray-500">
                Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString("en-AU", { dateStyle: "medium" })}
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items.map((item, index) => (
                <div key={index} className="p-6 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#f8f9fa] rounded-xl p-2 border border-gray-100 flex-shrink-0 flex items-center justify-center">
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

            {/* Price Calculations */}
            <div className="bg-gray-50/50 p-6 border-t border-gray-100 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-[#121212]">${order.subtotal.toLocaleString()} AUD</span>
              </div>

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
                <span>Total Paid</span>
                <span className="text-[#0071e3]">${order.total.toLocaleString()}.00 AUD</span>
              </div>
            </div>
          </div>

          {/* Support and Assurance */}
          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#0071e3] flex-shrink-0" />
              <div>
                <p className="font-bold text-[#121212]">Questions about your order?</p>
                <p className="text-gray-600 text-xs">
                  Contact our Australian DJI Specialist team at <span className="font-bold">support@d1store.com.au</span> or call <span className="font-bold">1300 000 354</span>.
                </p>
              </div>
            </div>

            <Link
              href={`/orders/${order._id || order.orderNumber}/invoice`}
              className="inline-flex items-center gap-1.5 font-bold text-[#0071e3] hover:underline flex-shrink-0"
            >
              <span>Download Tax Invoice</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
