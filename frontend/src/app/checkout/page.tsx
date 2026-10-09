"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createOrderApi, validateCheckoutApi } from "@/lib/api";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import MobileOrderSummaryToggle from "@/components/checkout/MobileOrderSummaryToggle";
import ExpressPaymentSection from "@/components/checkout/ExpressPaymentSection";
import ContactSection from "@/components/checkout/ContactSection";
import ShippingAddressSection, { AddressData } from "@/components/checkout/ShippingAddressSection";
import ShippingMethodSection, { ShippingMethodType } from "@/components/checkout/ShippingMethodSection";
import PaymentMethodSection, { PaymentMethodType, CardDetails } from "@/components/checkout/PaymentMethodSection";
import BillingAddressSection, { BillingAddressData } from "@/components/checkout/BillingAddressSection";
import OrderSummarySidebar from "@/components/checkout/OrderSummarySidebar";
import CheckoutFooter from "@/components/checkout/CheckoutFooter";
import {
  Lock,
  ShieldCheck,
  AlertCircle,
  Truck,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart, appliedCoupon, applyCoupon, removeCoupon } = useCart();

  // Authentication state
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [subscribeNews, setSubscribeNews] = useState(true);

  const [address, setAddress] = useState<AddressData>({
    country: "Australia",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "NSW",
    postcode: "",
    phone: "",
    deliveryType: "ship",
    pickupStore: "sydney-flagship",
    saveInfo: true,
  });

  const [shippingMethod, setShippingMethod] = useState<ShippingMethodType>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("card");

  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const [billing, setBilling] = useState<BillingAddressData>({
    sameAsShipping: true,
    country: "Australia",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "NSW",
    postcode: "",
  });

  const [orderNotes, setOrderNotes] = useState("");

  // Live calculations from server
  const [isCalculating, setIsCalculating] = useState(false);
  const [serverCalculation, setServerCalculation] = useState<{
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    tax: number;
    total: number;
  } | null>(null);

  // Submission & Validation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Auto-fill logged in user info if present
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("d1_user");
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.email) {
          setUserEmail(u.email);
          setEmail(u.email);
        }
        if (u.name) {
          const parts = u.name.trim().split(" ");
          setAddress((prev) => ({
            ...prev,
            firstName: parts[0] || prev.firstName,
            lastName: parts.length > 1 ? parts.slice(1).join(" ") : prev.lastName,
          }));
        }
        if (u.phone) {
          setAddress((prev) => ({ ...prev, phone: u.phone }));
        }
        if (u.addresses && u.addresses.length > 0) {
          const def = u.addresses.find((a: any) => a.isDefault) || u.addresses[0];
          if (def) {
            setAddress((prev) => ({
              ...prev,
              address: def.address1 || prev.address,
              city: def.city || prev.city,
              state: def.province || prev.state,
              postcode: def.zip || prev.postcode,
              company: def.company || prev.company,
            }));
          }
        }
      }
    } catch (e) {}
  }, []);

  const handleSignOut = () => {
    try {
      localStorage.removeItem("d1_token");
      localStorage.removeItem("d1_user");
      setUserEmail(null);
    } catch (e) {}
  };

  // Revalidate prices and calculate totals with the backend
  useEffect(() => {
    if (cart.length === 0) return;

    const shippingLabel =
      address.deliveryType === "pickup"
        ? "Click & Collect"
        : shippingMethod === "express"
        ? "Express Courier"
        : "Standard Courier";

    setIsCalculating(true);
    validateCheckoutApi({
      items: cart.map((it) => ({
        productId: it.productId || String(it.id),
        quantity: it.quantity,
        variantId: it.variantId,
        name: it.title,
        price: it.price,
      })),
      shippingMethod: shippingLabel,
      couponCode: appliedCoupon?.code,
    })
      .then((calc) => {
        if (calc) {
          setServerCalculation({
            subtotal: calc.subtotal,
            discountAmount: calc.discountAmount,
            shippingFee: calc.shippingFee,
            tax: calc.tax,
            total: calc.total,
          });
        }
      })
      .catch((err) => {
        console.warn("Server checkout calculation note:", err.message);
      })
      .finally(() => {
        setIsCalculating(false);
      });
  }, [cart, shippingMethod, address.deliveryType, appliedCoupon?.code]);

  // Fallback calculations for zero-delay UX while waiting for server response
  const standardFee = subtotal >= 99 || appliedCoupon?.freeShipping ? 0 : 15;
  const localShippingFee =
    address.deliveryType === "pickup"
      ? 0
      : shippingMethod === "express"
      ? 25
      : standardFee;
  const localDiscount = appliedCoupon?.discountAmount || 0;
  const localNetSubtotal = Math.max(0, subtotal - localDiscount);

  const finalSubtotal = serverCalculation ? serverCalculation.subtotal : subtotal;
  const finalDiscount = serverCalculation ? serverCalculation.discountAmount : localDiscount;
  const finalShippingFee = serverCalculation ? serverCalculation.shippingFee : localShippingFee;
  const finalTotal = serverCalculation ? serverCalculation.total : localNetSubtotal + localShippingFee;
  const finalGst = serverCalculation ? serverCalculation.tax : Math.round((finalTotal / 11) * 100) / 100;

  // Shipping Method Label
  const shippingMethodLabel = useMemo(() => {
    if (address.deliveryType === "pickup") return "Click & Collect (Free store pickup)";
    if (shippingMethod === "express") return "StarTrack Express Priority";
    return finalShippingFee === 0 ? "Standard Courier (Free Delivery)" : "Standard Courier ($15.00 AUD)";
  }, [address.deliveryType, shippingMethod, finalShippingFee]);

  // Form field change handlers
  const handleAddressChange = useCallback((field: keyof AddressData, value: any) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
  }, []);

  const handleBillingChange = useCallback((field: keyof BillingAddressData, value: any) => {
    setBilling((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      if (prev[`billing${String(field).charAt(0).toUpperCase() + String(field).slice(1)}`]) {
        const next = { ...prev };
        delete next[`billing${String(field).charAt(0).toUpperCase() + String(field).slice(1)}`];
        return next;
      }
      return prev;
    });
  }, []);

  const handleCardChange = useCallback((field: keyof CardDetails, value: string) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
  }, []);

  // Validation function
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // 1. Email
    if (!email.trim()) {
      errors.email = "Please enter an email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address (e.g. name@example.com)";
    }

    // 2. Shipping Address
    if (!address.firstName.trim()) errors.firstName = "Enter a first name";
    if (!address.lastName.trim()) errors.lastName = "Enter a last name";
    if (!address.phone.trim()) errors.phone = "Enter a mobile phone for delivery tracking";

    if (address.deliveryType === "ship") {
      if (!address.address.trim()) errors.address = "Enter an address";
      if (!address.city.trim()) errors.city = "Enter a city / suburb";
      if (!address.postcode.trim()) errors.postcode = "Enter a postcode";
    }

    // 3. Payment
    if (paymentMethod === "card") {
      const cleanNum = cardDetails.number.replace(/\s/g, "");
      if (!cleanNum || cleanNum.length < 15) {
        errors.number = "Enter a valid card number";
      }
      if (!cardDetails.expiry || cardDetails.expiry.length < 4) {
        errors.expiry = "Enter a valid expiry date (MM/YY)";
      }
      if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
        errors.cvc = "Enter the 3 or 4 digit card security code";
      }
      if (!cardDetails.name.trim()) {
        errors.name = "Enter the name as it appears on your card";
      }
    }

    // 4. Billing Address (if separate)
    if (!billing.sameAsShipping) {
      if (!billing.firstName.trim()) errors.billingFirstName = "Enter billing first name";
      if (!billing.lastName.trim()) errors.billingLastName = "Enter billing last name";
      if (!billing.address.trim()) errors.billingAddress = "Enter billing address";
      if (!billing.city.trim()) errors.billingCity = "Enter billing suburb / city";
      if (!billing.postcode.trim()) errors.billingPostcode = "Enter billing postcode";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Scroll to the first error smoothly
      const firstField = Object.keys(errors)[0];
      const el = document.getElementById(firstField) || document.getElementById(`checkout-${firstField}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
      return false;
    }

    return true;
  };

  // Submit Order
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (cart.length === 0) {
      setErrorMessage("Your cart is empty. Please add products before checking out.");
      return;
    }

    if (!validateForm()) {
      setErrorMessage("Please complete all required fields highlighted in red below.");
      return;
    }

    setIsSubmitting(true);

    try {
      const shippingMethodLabelFinal =
        address.deliveryType === "pickup"
          ? "Click & Collect (D1 Store Retail Outlets)"
          : shippingMethod === "express"
          ? "Express Courier (StarTrack Express Priority)"
          : `Standard Courier (${finalShippingFee === 0 ? "Free Delivery" : "$15.00 AUD"})`;

      const paymentMethodLabelFinal =
        paymentMethod === "card"
          ? "Credit Card (Visa/Mastercard/Amex)"
          : paymentMethod === "paypal"
          ? "PayPal Express"
          : paymentMethod === "afterpay"
          ? "Afterpay (4 Installments)"
          : "Direct Bank Transfer (PayID)";

      const orderPayload = {
        customer: {
          firstName: address.firstName.trim(),
          lastName: address.lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: address.phone.trim(),
          address: address.deliveryType === "pickup" ? `[Click & Collect: ${address.pickupStore}]` : address.address.trim(),
          apartment: address.apartment?.trim() || undefined,
          city: address.deliveryType === "pickup" ? "Sydney" : address.city.trim(),
          state: address.state,
          postcode: address.deliveryType === "pickup" ? "2000" : address.postcode.trim(),
          country: address.country,
          company: address.company?.trim() || undefined,
        },
        billingAddress: {
          sameAsShipping: billing.sameAsShipping,
          firstName: billing.sameAsShipping ? address.firstName.trim() : billing.firstName.trim(),
          lastName: billing.sameAsShipping ? address.lastName.trim() : billing.lastName.trim(),
          address: billing.sameAsShipping ? address.address.trim() : billing.address.trim(),
          apartment: billing.sameAsShipping ? address.apartment?.trim() : billing.apartment?.trim(),
          city: billing.sameAsShipping ? address.city.trim() : billing.city.trim(),
          state: billing.sameAsShipping ? address.state : billing.state,
          postcode: billing.sameAsShipping ? address.postcode.trim() : billing.postcode.trim(),
          country: billing.sameAsShipping ? address.country : billing.country,
        },
        items: cart.map((item) => ({
          productId: String(item.productId || item.id),
          name: item.title,
          slug: item.slug || String(item.id),
          variantId: item.variantId,
          variantName: item.variantTitle,
          sku: item.sku,
          image: item.img,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
        shippingMethod: shippingMethodLabelFinal,
        couponCode: appliedCoupon?.code,
        paymentMethod: paymentMethodLabelFinal,
        paymentDetails:
          paymentMethod === "card"
            ? {
                cardBrand: "Visa / Mastercard",
                cardLast4: cardDetails.number.replace(/\s/g, "").slice(-4) || "4242",
                paidAt: new Date().toISOString(),
                transactionId: `TXN-${Date.now()}`,
              }
            : undefined,
        notes: orderNotes.trim() || undefined,
      };

      const createdOrder = await createOrderApi(orderPayload);

      if (createdOrder && (createdOrder._id || createdOrder.orderNumber)) {
        clearCart();
        const targetId = createdOrder._id || createdOrder.orderNumber;
        router.push(`/orders/${targetId}/confirmation`);
      } else {
        setErrorMessage("Failed to process your order. Please verify your details and try again.");
      }
    } catch (err: any) {
      console.error("Checkout order placement error:", err);
      const msg = err.response?.data?.message || err.message || "An unexpected error occurred during checkout.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827]">
      {/* 1. Dedicated Minimal Distraction-Free Checkout Header */}
      <CheckoutHeader itemCount={totalCartCount} />

      {/* 2. Mobile Collapsible Order Summary Accordion (< lg screens) */}
      {cart.length > 0 && (
        <MobileOrderSummaryToggle
          items={cart}
          subtotal={finalSubtotal}
          discountAmount={finalDiscount}
          appliedCoupon={appliedCoupon}
          shippingFee={finalShippingFee}
          tax={finalGst}
          total={finalTotal}
          onApplyCoupon={applyCoupon}
          onRemoveCoupon={removeCoupon}
          shippingMethodLabel={shippingMethodLabel}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="max-w-md mx-auto py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center mx-auto mb-2">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              There are no products in your checkout session. Browse our official DJI catalog to get started.
            </p>
            <div className="pt-2">
              <Link
                href="/collections/all"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[#0071e3] hover:bg-[#0058b8] text-white font-semibold text-sm transition-all shadow-xs"
              >
                <span>Continue shopping</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        ) : (
          /* ================= TWO-COLUMN CHECKOUT LAYOUT ================= */
          <form onSubmit={handleSubmitOrder} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
              {/* LEFT COLUMN: Customer Information, Shipping & Payment Forms */}
              <div className="lg:col-span-7 space-y-8">
                {/* Global Error Banner if submission fails */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 shadow-xs"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1 font-medium">{errorMessage}</div>
                  </div>
                )}

                {/* 1. Express Checkout Shortcuts */}
                <ExpressPaymentSection
                  onSelectExpressMethod={(method) => {
                    setPaymentMethod(method);
                    const el = document.getElementById("payment-heading");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                />

                {/* 2. Contact Information */}
                <ContactSection
                  email={email}
                  onChangeEmail={setEmail}
                  subscribeNews={subscribeNews}
                  onChangeSubscribeNews={setSubscribeNews}
                  error={fieldErrors.email}
                  userEmail={userEmail}
                  onSignOut={handleSignOut}
                />

                {/* 3. Delivery / Shipping Address */}
                <ShippingAddressSection
                  address={address}
                  onChange={handleAddressChange}
                  errors={fieldErrors}
                />

                {/* 4. Shipping Method Selector */}
                <ShippingMethodSection
                  selectedMethod={shippingMethod}
                  onSelectMethod={setShippingMethod}
                  subtotal={finalSubtotal}
                  freeShippingUnlocked={appliedCoupon?.freeShipping || false}
                  deliveryType={address.deliveryType}
                />

                {/* 5. Payment Method Selector */}
                <PaymentMethodSection
                  selectedMethod={paymentMethod}
                  onSelectMethod={setPaymentMethod}
                  cardDetails={cardDetails}
                  onChangeCardDetails={handleCardChange}
                  grandTotal={finalTotal}
                  errors={fieldErrors}
                />

                {/* 6. Billing Address Selector */}
                <BillingAddressSection
                  billing={billing}
                  onChange={handleBillingChange}
                  errors={fieldErrors}
                />

                {/* 7. Special Delivery Instructions */}
                <div>
                  <label
                    htmlFor="orderNotes"
                    className="block text-xs font-semibold text-gray-700 mb-1"
                  >
                    Delivery notes or special instructions (Optional)
                  </label>
                  <textarea
                    id="orderNotes"
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Leave at front door if no answer, ring apartment bell 14"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all"
                  />
                </div>

                {/* 8. Primary "Pay now" Submission Action */}
                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || isCalculating}
                    className="w-full h-14 rounded-lg bg-[#0071e3] hover:bg-[#005bb5] text-white font-bold text-base transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                    aria-label={`Pay now $${finalTotal.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AUD`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing order securely...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>
                          Pay now &bull; ${finalTotal.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AUD
                        </span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>256-Bit Bank Grade Encryption</span>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Official DJI Australia Warranty</span>
                    </span>
                  </div>
                </div>

                {/* 9. Policies & Footer Links */}
                <CheckoutFooter />
              </div>

              {/* RIGHT COLUMN: Order Summary Desktop Sticky Panel */}
              <div className="hidden lg:block lg:col-span-5">
                <div className="sticky top-28 bg-[#f9fafb] border border-gray-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
                  <OrderSummarySidebar
                    items={cart}
                    subtotal={finalSubtotal}
                    discountAmount={finalDiscount}
                    appliedCoupon={appliedCoupon}
                    shippingFee={finalShippingFee}
                    tax={finalGst}
                    total={finalTotal}
                    onApplyCoupon={applyCoupon}
                    onRemoveCoupon={removeCoupon}
                    shippingMethodLabel={shippingMethodLabel}
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
