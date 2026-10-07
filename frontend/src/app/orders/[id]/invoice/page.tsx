"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchOrderById } from "@/lib/api";
import { IOrder } from "@/types";
import { Printer, ArrowLeft, Download, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function OrderInvoicePage() {
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
        console.error("Failed to load invoice order:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-600">Generating Tax Invoice...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center shadow-md">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">Could not locate an invoice for order #{id}.</p>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-[#0071e3] text-white font-bold text-sm inline-block"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const invoiceDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subtotalExGst = Math.round((order.subtotal / 1.1) * 100) / 100;
  const gstAmount = Math.round((order.subtotal - subtotalExGst) * 100) / 100;

  return (
    <div className="min-h-screen bg-[#eaedf0] py-6 sm:py-12 print:bg-white print:py-0 text-[#121212]">
      {/* Top Action Bar (Hidden on print) */}
      <div className="max-w-4xl mx-auto px-4 mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/orders/${order._id || order.orderNumber}/confirmation`}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-[#0071e3] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Confirmation</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Invoice Card (A4 Printable Layout) */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:shadow-lg border border-gray-200 print:border-none print:shadow-none print:rounded-none overflow-hidden">
        {/* Inner Padding */}
        <div className="p-8 sm:p-14 space-y-10">
          {/* Header: Company & Tax Invoice Title */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b-2 border-gray-900">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="//www.d1store.com.au/cdn/shop/files/DJIxD1STORE-ARS-PNG.png?v=1768876884&width=360"
                  alt="D1 Store - DJI Authorised Retail Store"
                  className="h-9 w-auto object-contain"
                />
              </div>
              <p className="text-xs font-black text-gray-800">D1 STORE PTY LTD</p>
              <p className="text-xs text-gray-600">ABN: 88 623 456 789</p>
              <p className="text-xs text-gray-600">Official DJI Authorised Retailer — Australia</p>
              <p className="text-xs text-gray-600">Unit 3, 102 D1 Business Park, VIC 3148, Australia</p>
              <p className="text-xs text-gray-600">Phone: 1300 000 354 | Email: orders@d1store.com.au</p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 rounded text-xs font-black uppercase tracking-wider bg-gray-900 text-white mb-2">
                Tax Invoice
              </span>
              <h1 className="text-2xl font-black text-gray-900">INV-{order.orderNumber}</h1>
              <p className="text-xs text-gray-500 mt-1">Order Ref: #{order.orderNumber}</p>
              <p className="text-xs text-gray-500">Date: {invoiceDate}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>PAID IN FULL</span>
              </div>
            </div>
          </div>

          {/* Customer & Billing Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs sm:text-sm">
            <div>
              <h3 className="font-black text-gray-400 text-xs uppercase tracking-wider mb-2">
                Sold / Billed To:
              </h3>
              <p className="font-bold text-gray-900 text-base">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="text-gray-600">{order.customer.address}</p>
              {order.customer.apartment && <p className="text-gray-600">{order.customer.apartment}</p>}
              <p className="text-gray-600">
                {order.customer.city}, {order.customer.state} {order.customer.postcode}
              </p>
              <p className="text-gray-600">{order.customer.country}</p>
              <p className="text-gray-600 mt-2 font-medium">{order.customer.email}</p>
              <p className="text-gray-600">{order.customer.phone}</p>
            </div>

            <div className="sm:text-right">
              <h3 className="font-black text-gray-400 text-xs uppercase tracking-wider mb-2">
                Dispatch & Payment Details:
              </h3>
              <p className="text-gray-700">
                <span className="font-bold text-gray-900">Shipping: </span>
                {order.shippingMethod}
              </p>
              <p className="text-gray-700 mt-1">
                <span className="font-bold text-gray-900">Payment: </span>
                {order.paymentMethod}
              </p>
              <p className="text-gray-700 mt-1">
                <span className="font-bold text-gray-900">Status: </span>
                {order.paymentStatus}
              </p>
              {order.notes && (
                <p className="text-gray-500 mt-2 italic text-xs">
                  "Special instructions: {order.notes}"
                </p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-gray-900 text-[11px] font-black uppercase text-gray-600">
                  <th className="py-3">Item / Description</th>
                  <th className="py-3 text-center">Qty</th>
                  <th className="py-3 text-right">Unit Price (Inc GST)</th>
                  <th className="py-3 text-right">Total (AUD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <tr key={index} className="text-gray-800">
                    <td className="py-4 pr-4">
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Product ID: {item.productId}</p>
                    </td>
                    <td className="py-4 text-center font-bold">{item.quantity}</td>
                    <td className="py-4 text-right">${item.price.toLocaleString()}.00</td>
                    <td className="py-4 text-right font-bold text-gray-900">
                      ${(item.price * item.quantity).toLocaleString()}.00
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown */}
          <div className="pt-4 border-t-2 border-gray-900 flex flex-col sm:flex-row justify-between gap-6">
            <div className="sm:max-w-xs text-xs text-gray-500 space-y-1">
              <p className="font-bold text-gray-700">Australian GST Information:</p>
              <p>
                All prices quoted in AUD and inclusive of 10% Australian Goods and Services Tax (GST).
              </p>
              <p>
                This document is an official Tax Invoice under Australian Taxation Office (ATO) regulations.
              </p>
            </div>

            <div className="sm:w-72 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal (Excl. GST):</span>
                <span>${subtotalExGst.toLocaleString()} AUD</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>GST (10%):</span>
                <span>${gstAmount.toLocaleString()} AUD</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Subtotal (Incl. GST):</span>
                <span className="font-bold">${order.subtotal.toLocaleString()}.00 AUD</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping & Handling:</span>
                <span className="font-bold">
                  {order.shippingFee === 0 ? "FREE" : `$${order.shippingFee}.00 AUD`}
                </span>
              </div>

              <div className="pt-3 border-t-2 border-gray-900 flex justify-between text-base sm:text-lg font-black text-gray-900">
                <span>Total AUD (Inc. GST):</span>
                <span>${order.total.toLocaleString()}.00</span>
              </div>

              <div className="pt-2 text-right text-[11px] font-bold text-emerald-700">
                Amount Paid: ${order.total.toLocaleString()}.00 AUD ({order.paymentMethod})
              </div>
            </div>
          </div>

          {/* Footer Terms & Warranty */}
          <div className="pt-8 border-t border-gray-200 text-center sm:text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-gray-500">
            <div>
              <p className="font-bold text-gray-700 mb-1">Official DJI Australia Warranty</p>
              <p>
                All DJI products sold by D1 Store come with full local Australian warranty support and DJI Care Enterprise options. Keep this invoice for warranty verification.
              </p>
            </div>
            <div className="sm:text-right">
              <p className="font-bold text-gray-700 mb-1">Customer Support & Inquiries</p>
              <p>
                Visit d1store.com.au or contact our customer team at support@d1store.com.au or 1300 000 354.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
