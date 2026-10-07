"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, freeShippingThreshold, amountLeftForFreeShipping } = useCart();

  const shippingFee = subtotal >= 99 || subtotal === 0 ? 0 : 15;
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#121212]">
      <Header />

      <main className="flex-1 page-width py-8 md:py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#121212]">Your Shopping Cart</h1>
            <p className="text-sm text-gray-500 mt-1">Review your DJI gear before proceeding to secure checkout</p>
          </div>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-lg mx-auto shadow-xs my-8">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#121212] mb-2">Your cart is currently empty</h2>
            <p className="text-sm text-gray-500 mb-6">
              Looks like you haven't added any drones or accessories yet.
            </p>
            <Link
              href="/collections/all"
              className="inline-flex px-8 py-3 rounded-full bg-[#0071e3] text-white font-bold text-sm hover:bg-[#0058b8] transition-all shadow-md"
            >
              Start Shopping &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Alert Banner */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between text-xs sm:text-sm font-bold text-[#0071e3]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>
                    {amountLeftForFreeShipping > 0
                      ? `Add $${amountLeftForFreeShipping.toFixed(2)} more for FREE Express Delivery!`
                      : "You've unlocked FREE Express Courier Delivery!"}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden divide-y divide-gray-100 shadow-xs">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    {/* Item Image */}
                    <div className="w-24 h-24 rounded-2xl bg-[#f8f8fa] p-2 flex items-center justify-center flex-shrink-0">
                      <img src={item.img} alt={item.title} className="w-full h-full object-contain" />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <h3 className="text-base font-bold text-[#121212]">{item.title}</h3>
                      {item.subtitle && <p className="text-xs text-gray-500">{item.subtitle}</p>}
                      <div className="text-sm font-black text-[#121212] sm:hidden pt-1">
                        ${item.price.toLocaleString()} AUD
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-xl bg-white p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-black text-[#121212]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price Total for line */}
                    <div className="hidden sm:block text-right w-28">
                      <div className="text-base font-black text-[#121212]">
                        ${(item.price * item.quantity).toLocaleString()} AUD
                      </div>
                      <div className="text-xs text-gray-400">
                        ${item.price.toLocaleString()} each
                      </div>
                    </div>

                    {/* Remove Action */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-xs sticky top-24">
                <h2 className="text-xl font-black text-[#121212]">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#121212]">${subtotal.toLocaleString()}.00 AUD</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Shipping</span>
                    <span className="font-bold text-emerald-600">
                      {shippingFee === 0 ? "FREE" : `$${shippingFee}.00`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Estimated GST (10% included)</span>
                    <span className="font-bold text-[#121212]">${tax.toLocaleString()} AUD</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-black text-[#121212]">
                    <span>Total Amount</span>
                    <span className="text-xl">${total.toLocaleString()}.00 AUD</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white font-black text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="pt-2 text-xs text-gray-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>256-Bit SSL Encrypted Checkout</span>
                  </div>
                  <p>Tax invoice with Australian Business Number (ABN) provided on completion.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
