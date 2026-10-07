"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { createOrderApi } from "@/lib/api";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building2,
  Lock,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "NSW",
    postcode: "",
    country: "Australia",
    subscribe: true,
  });

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express" | "pickup">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "afterpay" | "bank">("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });
  const [orderNotes, setOrderNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Shipping calculation
  const standardFee = subtotal >= 99 ? 0 : 15;
  const shippingFee = shippingMethod === "express" ? 25 : shippingMethod === "pickup" ? 0 : standardFee;
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discount) : 0;
  const netSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(netSubtotal * 0.1 * 100) / 100;
  const grandTotal = netSubtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    if (!couponCode.trim()) return;

    if (couponCode.trim().toUpperCase() === "DJI10" || couponCode.trim().toUpperCase() === "WELCOME10") {
      setAppliedCoupon({ code: couponCode.trim().toUpperCase(), discount: 0.1 });
    } else if (couponCode.trim().toUpperCase() === "FREESHIP") {
      setAppliedCoupon({ code: "FREESHIP", discount: 0 });
      setShippingMethod("standard");
    } else {
      setCouponError("Invalid discount code. Try 'DJI10' for 10% off.");
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (cart.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      return;
    }

    // Basic Validation
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.postcode) {
      setErrorMessage("Please fill in all required shipping and contact fields.");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
        setErrorMessage("Please complete all credit card information.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const shippingMethodLabel =
        shippingMethod === "express"
          ? "Express Courier (StarTrack / AusPost Express)"
          : shippingMethod === "pickup"
          ? "Click & Collect (D1 Store Retail)"
          : `Standard Delivery (${shippingFee === 0 ? "Free" : "$15.00"})`;

      const paymentMethodLabel =
        paymentMethod === "card"
          ? "Credit Card (Visa/Mastercard)"
          : paymentMethod === "paypal"
          ? "PayPal Express"
          : paymentMethod === "afterpay"
          ? "Afterpay / Zip Pay"
          : "Direct Bank Transfer (PayID)";

      const orderPayload = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || "0400 000 000",
          address: formData.address,
          apartment: formData.apartment || "",
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
          country: formData.country,
        },
        items: cart.map((item) => ({
          productId: String(item.productId || item.id),
          name: item.title,
          slug: item.slug || String(item.id),
          image: item.img,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
        shippingMethod: shippingMethodLabel,
        shippingFee: shippingFee,
        paymentMethod: paymentMethodLabel,
        notes: orderNotes,
      };

      const createdOrder = await createOrderApi(orderPayload);

      if (createdOrder && (createdOrder._id || createdOrder.orderNumber)) {
        clearCart();
        const targetId = createdOrder._id || createdOrder.orderNumber;
        router.push(`/orders/${targetId}/confirmation`);
      } else {
        setErrorMessage("Failed to process order. Please try again or contact support.");
      }
    } catch (err: unknown) {
      console.error("Order submission error:", err);
      setErrorMessage("An error occurred during checkout. Please verify your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] text-[#121212]">
      <Header />

      {/* Checkout Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="page-width py-4 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <Link href="/cart" className="hover:text-[#0071e3] flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Cart</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-[#121212] font-bold">Secure Checkout</span>
          </div>

          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>256-bit SSL Secure Checkout</span>
          </div>
        </div>
      </div>

      <main className="flex-1 page-width py-8 md:py-12">
        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs border border-gray-100 my-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-sm text-gray-500 mb-6">
              You must have at least one product in your cart to proceed to checkout.
            </p>
            <Link
              href="/collections/all"
              className="inline-block px-6 py-2.5 rounded-full bg-[#0071e3] text-white font-bold text-sm hover:bg-[#0058b8] transition-colors"
            >
              Browse DJI Products &rarr;
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Customer, Shipping, Payment Forms */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Contact Information */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#121212] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                    <span>Contact Information</span>
                  </h2>
                  <div className="text-xs text-gray-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#0070e0] font-semibold hover:underline">
                      Log in
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address for Order Confirmation *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. john.smith@example.com.au"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Mobile Phone Number (for delivery tracking SMS) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="0400 123 456"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>

                <label className="mt-3 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="subscribe"
                    checked={formData.subscribe}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-[#0071e3] focus:ring-[#0071e3]"
                  />
                  <span className="text-xs text-gray-600">
                    Email me with exclusive DJI deals, firmware updates, and announcements.
                  </span>
                </label>
              </div>

              {/* 2. Shipping Address */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#121212] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white text-xs flex items-center justify-center font-bold">
                      2
                    </span>
                    <span>Shipping Address</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="Smith"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-[#0071e3]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="e.g. 123 George Street"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-[#0071e3]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Apartment, suite, unit (optional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      placeholder="e.g. Unit 4B"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-[#0071e3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City / Suburb *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Sydney"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-[#0071e3]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-hidden focus:border-[#0071e3]"
                      >
                        <option value="NSW">NSW</option>
                        <option value="VIC">VIC</option>
                        <option value="QLD">QLD</option>
                        <option value="WA">WA</option>
                        <option value="SA">SA</option>
                        <option value="TAS">TAS</option>
                        <option value="ACT">ACT</option>
                        <option value="NT">NT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Postcode *</label>
                      <input
                        type="text"
                        name="postcode"
                        required
                        placeholder="2000"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-[#0071e3]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      disabled
                      value={formData.country}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Shipping Method */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs">
                <h2 className="text-lg font-bold text-[#121212] flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  <span>Shipping Method</span>
                </h2>

                <div className="space-y-3">
                  <label
                    onClick={() => setShippingMethod("standard")}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      shippingMethod === "standard"
                        ? "border-[#0071e3] bg-blue-50/30"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        className="w-4 h-4 text-[#0071e3]"
                      />
                      <div>
                        <p className="font-bold text-sm text-[#121212]">Standard Tracked Delivery</p>
                        <p className="text-xs text-gray-500">2 - 5 Business Days via Australia Post eParcel</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-[#121212]">
                      {subtotal >= 99 ? "FREE" : "$15.00 AUD"}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod("express")}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      shippingMethod === "express"
                        ? "border-[#0071e3] bg-blue-50/30"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        className="w-4 h-4 text-[#0071e3]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-[#121212]">Priority Express Courier</p>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Fastest
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">1 - 2 Business Days via StarTrack Priority</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-[#121212]">$25.00 AUD</span>
                  </label>

                  <label
                    onClick={() => setShippingMethod("pickup")}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      shippingMethod === "pickup"
                        ? "border-[#0071e3] bg-blue-50/30"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={shippingMethod === "pickup"}
                        onChange={() => setShippingMethod("pickup")}
                        className="w-4 h-4 text-[#0071e3]"
                      />
                      <div>
                        <p className="font-bold text-sm text-[#121212]">Click & Collect (Store Pickup)</p>
                        <p className="text-xs text-gray-500">Ready in 2 hours at D1 Store Melbourne / Sydney</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-emerald-600">FREE</span>
                  </label>
                </div>
              </div>

              {/* 4. Payment Method */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs">
                <h2 className="text-lg font-bold text-[#121212] flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white text-xs flex items-center justify-center font-bold">
                    4
                  </span>
                  <span>Payment Method</span>
                </h2>

                <div className="space-y-3 mb-4">
                  {/* Credit Card */}
                  <div
                    className={`rounded-xl border-2 transition-all ${
                      paymentMethod === "card" ? "border-[#0071e3] bg-blue-50/20" : "border-gray-200"
                    }`}
                  >
                    <div
                      onClick={() => setPaymentMethod("card")}
                      className="p-4 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="w-4 h-4 text-[#0071e3]"
                        />
                        <span className="font-bold text-sm text-[#121212]">Credit Card</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-gray-500">Visa / Mastercard / Amex</span>
                        <CreditCard className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>

                    {paymentMethod === "card" && (
                      <div className="px-4 pb-4 pt-2 border-t border-blue-100 space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Card Number</label>
                          <input
                            type="text"
                            name="number"
                            placeholder="4532 •••• •••• 8892"
                            value={cardDetails.number}
                            onChange={handleCardChange}
                            maxLength={19}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-hidden focus:border-[#0071e3]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Expires (MM/YY)</label>
                            <input
                              type="text"
                              name="expiry"
                              placeholder="12/28"
                              value={cardDetails.expiry}
                              onChange={handleCardChange}
                              maxLength={5}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-hidden focus:border-[#0071e3]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Security CVC</label>
                            <input
                              type="text"
                              name="cvc"
                              placeholder="123"
                              value={cardDetails.cvc}
                              onChange={handleCardChange}
                              maxLength={4}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-hidden focus:border-[#0071e3]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Name on Card</label>
                          <input
                            type="text"
                            name="name"
                            placeholder="John Smith"
                            value={cardDetails.name}
                            onChange={handleCardChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-hidden focus:border-[#0071e3]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PayPal */}
                  <label
                    onClick={() => setPaymentMethod("paypal")}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "paypal" ? "border-[#0071e3] bg-blue-50/20" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                        className="w-4 h-4 text-[#0071e3]"
                      />
                      <span className="font-bold text-sm text-[#121212]">PayPal Express</span>
                    </div>
                    <span className="text-xs font-bold text-[#003087]">PayPal</span>
                  </label>

                  {/* Afterpay */}
                  <label
                    onClick={() => setPaymentMethod("afterpay")}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "afterpay" ? "border-[#0071e3] bg-blue-50/20" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === "afterpay"}
                        onChange={() => setPaymentMethod("afterpay")}
                        className="w-4 h-4 text-[#0071e3]"
                      />
                      <span className="font-bold text-sm text-[#121212]">Afterpay / Zip Pay</span>
                    </div>
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      4 fortnightly payments
                    </span>
                  </label>

                  {/* Bank Transfer */}
                  <label
                    onClick={() => setPaymentMethod("bank")}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "bank" ? "border-[#0071e3] bg-blue-50/20" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === "bank"}
                        onChange={() => setPaymentMethod("bank")}
                        className="w-4 h-4 text-[#0071e3]"
                      />
                      <span className="font-bold text-sm text-[#121212]">Direct Bank Transfer (PayID)</span>
                    </div>
                    <Building2 className="w-4 h-4 text-gray-500" />
                  </label>
                </div>

                {/* Delivery Notes */}
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Special Delivery Instructions or Order Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Leave at front door if not home, or ring bell."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-[#0071e3]"
                  />
                </div>
              </div>

              {/* Submit Button (Mobile & Desktop) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] disabled:bg-gray-400 text-white font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Secure Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Place Order • ${grandTotal.toLocaleString()}.00 AUD</span>
                  </>
                )}
              </button>
            </div>

            {/* RIGHT COLUMN: Order Summary */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                <h3 className="text-base font-black text-[#121212] mb-4 pb-3 border-b border-gray-100">
                  Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                </h3>

                {/* Cart Items List */}
                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-14 h-14 bg-[#f8f9fa] rounded-lg p-1 border border-gray-100 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-600 text-white text-[10px] font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#121212] truncate">{item.title}</p>
                        <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-black text-[#121212]">
                          ${(item.price * item.quantity).toLocaleString()} AUD
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code (e.g. DJI10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-xs uppercase focus:outline-hidden focus:border-[#0071e3]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-black text-white text-xs font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-500 mt-1">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="mt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Code '{appliedCoupon.code}' applied!</span>
                    </div>
                  )}
                </div>

                {/* Pricing Breakdown */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#121212]">${subtotal.toLocaleString()} AUD</span>
                  </div>

                  {appliedCoupon && appliedCoupon.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount (10%)</span>
                      <span>-${discountAmount.toLocaleString()} AUD</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-bold text-[#121212]">
                      {shippingFee === 0 ? "FREE" : `$${shippingFee}.00 AUD`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>Includes 10% Australian GST</span>
                    <span>${tax.toLocaleString()} AUD</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-black text-[#121212]">
                    <span>Total Amount</span>
                    <span className="text-xl text-[#0071e3]">
                      ${grandTotal.toLocaleString()}.00 AUD
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust & Guarantee Box */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 text-xs space-y-3 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#121212]">Official DJI Authorised Retailer</p>
                    <p className="text-gray-500 text-[11px]">Genuine Australian stock with local manufacturer warranty.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-[#0071e3] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#121212]">Fast Nationwide Dispatch</p>
                    <p className="text-gray-500 text-[11px]">Dispatched from our Melbourne & Sydney warehouses.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#121212]">30-Day Change of Mind Returns</p>
                    <p className="text-gray-500 text-[11px]">Hassle-free return policy on sealed products.</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
