"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { createOrderApi, validateCheckoutApi } from "@/lib/api";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building2,
  Lock,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Tag,
  Store,
  HelpCircle,
  Check,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart, appliedCoupon } = useCart();

  // Multi-step checkout state: 1: Information & Address, 2: Shipping Method, 3: Payment Method, 4: Review & Place Order
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "NSW",
    postcode: "",
    country: "Australia",
    sameAsShipping: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingApartment: "",
    billingCity: "",
    billingState: "NSW",
    billingPostcode: "",
    billingCountry: "Australia",
    saveInfo: true,
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

  // Live calculation from server
  const [isCalculating, setIsCalculating] = useState(false);
  const [serverCalculation, setServerCalculation] = useState<{
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    tax: number;
    total: number;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Auto-fill from logged in user if available
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("d1_user");
      if (userStr) {
        const u = JSON.parse(userStr);
        setFormData((prev) => ({
          ...prev,
          email: u.email || prev.email,
          firstName: u.name ? u.name.split(" ")[0] : prev.firstName,
          lastName: u.name && u.name.split(" ").length > 1 ? u.name.split(" ").slice(1).join(" ") : prev.lastName,
          phone: u.phone || prev.phone,
        }));
      }
    } catch (e) {}
  }, []);

  // Pre-flight server price & stock validation
  useEffect(() => {
    if (cart.length === 0) return;

    const shippingLabel =
      shippingMethod === "express"
        ? "Express Courier"
        : shippingMethod === "pickup"
        ? "Click & Collect"
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
        console.warn("Server checkout calculation warning:", err.message);
      })
      .finally(() => {
        setIsCalculating(false);
      });
  }, [cart, shippingMethod, appliedCoupon?.code]);

  // Fallback local calculations if server is waiting
  const standardFee = subtotal >= 99 || appliedCoupon?.freeShipping ? 0 : 15;
  const localShippingFee = shippingMethod === "express" ? 25 : shippingMethod === "pickup" ? 0 : standardFee;
  const localDiscount = appliedCoupon?.discountAmount || 0;
  const localNetSubtotal = Math.max(0, subtotal - localDiscount);
  const finalSubtotal = serverCalculation ? serverCalculation.subtotal : subtotal;
  const finalDiscount = serverCalculation ? serverCalculation.discountAmount : localDiscount;
  const finalShippingFee = serverCalculation ? serverCalculation.shippingFee : localShippingFee;
  const finalTotal = serverCalculation ? serverCalculation.total : localNetSubtotal + localShippingFee;
  const finalGst = serverCalculation ? serverCalculation.tax : Math.round((finalTotal / 11) * 100) / 100;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (fieldErrors[name]) {
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validation before progressing steps
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Valid email is required";

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required for delivery notifications";
    if (!formData.address.trim()) errors.address = "Street address is required";
    if (!formData.city.trim()) errors.city = "Suburb/City is required";
    if (!formData.postcode.trim()) errors.postcode = "Postcode is required";

    if (!formData.sameAsShipping) {
      if (!formData.billingFirstName.trim()) errors.billingFirstName = "Billing first name is required";
      if (!formData.billingLastName.trim()) errors.billingLastName = "Billing last name is required";
      if (!formData.billingAddress.trim()) errors.billingAddress = "Billing street address is required";
      if (!formData.billingCity.trim()) errors.billingCity = "Billing suburb/city is required";
      if (!formData.billingPostcode.trim()) errors.billingPostcode = "Billing postcode is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    if (paymentMethod === "card") {
      if (!cardDetails.number.trim() || cardDetails.number.replace(/\s/g, "").length < 15) {
        errors.number = "Valid 16-digit card number required";
      }
      if (!cardDetails.name.trim()) errors.name = "Name on card is required";
      if (!cardDetails.expiry.trim()) errors.expiry = "MM/YY expiry required";
      if (!cardDetails.cvc.trim() || cardDetails.cvc.length < 3) errors.cvc = "3 or 4-digit CVC required";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    setErrorMessage("");
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (cart.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      return;
    }

    if (!validateStep1()) {
      setCurrentStep(1);
      setErrorMessage("Please complete all required customer & address details.");
      return;
    }

    if (!validateStep3()) {
      setCurrentStep(3);
      setErrorMessage("Please verify your payment details.");
      return;
    }

    setIsSubmitting(true);

    try {
      const shippingMethodLabel =
        shippingMethod === "express"
          ? "Express Courier (StarTrack Express)"
          : shippingMethod === "pickup"
          ? "Click & Collect (D1 Store Retail)"
          : `Standard Courier (${finalShippingFee === 0 ? "Free" : "$15.00"})`;

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
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          apartment: formData.apartment.trim() || undefined,
          city: formData.city.trim(),
          state: formData.state,
          postcode: formData.postcode.trim(),
          country: formData.country,
          company: formData.company.trim() || undefined,
        },
        billingAddress: {
          sameAsShipping: formData.sameAsShipping,
          firstName: formData.sameAsShipping ? formData.firstName.trim() : formData.billingFirstName.trim(),
          lastName: formData.sameAsShipping ? formData.lastName.trim() : formData.billingLastName.trim(),
          address: formData.sameAsShipping ? formData.address.trim() : formData.billingAddress.trim(),
          apartment: formData.sameAsShipping ? formData.apartment.trim() : formData.billingApartment.trim(),
          city: formData.sameAsShipping ? formData.city.trim() : formData.billingCity.trim(),
          state: formData.sameAsShipping ? formData.state : formData.billingState,
          postcode: formData.sameAsShipping ? formData.postcode.trim() : formData.billingPostcode.trim(),
          country: formData.sameAsShipping ? formData.country : formData.billingCountry,
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
        shippingMethod: shippingMethodLabel,
        couponCode: appliedCoupon?.code,
        paymentMethod: paymentMethodLabel,
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
        setErrorMessage("Failed to process order. Please try again or contact support.");
      }
    } catch (err: any) {
      console.error("Order submission error:", err);
      const msg = err.response?.data?.message || err.message || "An unexpected error occurred during checkout.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] text-[#121212]">
      <Header />

      {/* Checkout Breadcrumb / Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="page-width py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center space-x-2 text-gray-500 overflow-x-auto pb-1 sm:pb-0">
            <Link href="/cart" className="hover:text-[#0071e3] flex items-center gap-1 font-medium shrink-0">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cart</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`font-semibold shrink-0 ${currentStep === 1 ? "text-[#0071e3]" : "text-gray-600 hover:text-black"}`}
            >
              1. Customer & Address
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
            <button
              type="button"
              onClick={() => validateStep1() && setCurrentStep(2)}
              className={`font-semibold shrink-0 ${currentStep === 2 ? "text-[#0071e3]" : "text-gray-600 hover:text-black"}`}
            >
              2. Shipping
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
            <button
              type="button"
              onClick={() => validateStep1() && setCurrentStep(3)}
              className={`font-semibold shrink-0 ${currentStep === 3 ? "text-[#0071e3]" : "text-gray-600 hover:text-black"}`}
            >
              3. Payment
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
            <span className={`font-semibold shrink-0 ${currentStep === 4 ? "text-[#0071e3]" : "text-gray-400"}`}>
              4. Review
            </span>
          </div>

          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs shrink-0">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Checkout</span>
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
            {/* LEFT COLUMN: Multi-Step Forms */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* STEP 1: Customer Contact & Shipping Address */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#0071e3] text-white text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-lg font-black text-[#121212]">Contact & Shipping Address</h2>
                  </div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-bold text-[#0071e3] hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {currentStep === 1 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. yourname@example.com"
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none ${
                            fieldErrors.email ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#0071e3]"
                          }`}
                        />
                        {fieldErrors.email && (
                          <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Phone Number (for StarTrack delivery) *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. 0400 000 000"
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none ${
                            fieldErrors.phone ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#0071e3]"
                          }`}
                        />
                        {fieldErrors.phone && (
                          <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="First Name"
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none ${
                            fieldErrors.firstName ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#0071e3]"
                          }`}
                        />
                        {fieldErrors.firstName && (
                          <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Last Name"
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none ${
                            fieldErrors.lastName ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#0071e3]"
                          }`}
                        />
                        {fieldErrors.lastName && (
                          <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Company Name (Optional)
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Company Pty Ltd"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#0071e3]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="e.g. 123 George Street"
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none ${
                          fieldErrors.address ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#0071e3]"
                        }`}
                      />
                      {fieldErrors.address && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Apartment, suite, unit (optional)
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        placeholder="Apartment, suite, unit, etc."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#0071e3]"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Suburb / City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none ${
                            fieldErrors.city ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#0071e3]"
                          }`}
                        />
                        {fieldErrors.city && (
                          <p className="text-xs text-red-500 mt-1">{fieldErrors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          State / Territory *
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#0071e3] bg-white"
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

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Postcode *
                        </label>
                        <input
                          type="text"
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleInputChange}
                          placeholder="2000"
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none ${
                            fieldErrors.postcode ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#0071e3]"
                          }`}
                        />
                        {fieldErrors.postcode && (
                          <p className="text-xs text-red-500 mt-1">{fieldErrors.postcode}</p>
                        )}
                      </div>
                    </div>

                    {/* Billing address same as shipping checkbox */}
                    <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          name="sameAsShipping"
                          checked={formData.sameAsShipping}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[#0071e3] rounded border-gray-300 focus:ring-0"
                        />
                        <span>Billing address is same as shipping address</span>
                      </label>
                    </div>

                    {/* Custom billing address if unchecked */}
                    {!formData.sameAsShipping && (
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 mt-3">
                        <h4 className="text-xs font-bold text-gray-900 uppercase">Billing Address</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <input
                              type="text"
                              name="billingFirstName"
                              value={formData.billingFirstName}
                              onChange={handleInputChange}
                              placeholder="Billing First Name"
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                            />
                            {fieldErrors.billingFirstName && (
                              <p className="text-xs text-red-500 mt-1">{fieldErrors.billingFirstName}</p>
                            )}
                          </div>
                          <div>
                            <input
                              type="text"
                              name="billingLastName"
                              value={formData.billingLastName}
                              onChange={handleInputChange}
                              placeholder="Billing Last Name"
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                            />
                            {fieldErrors.billingLastName && (
                              <p className="text-xs text-red-500 mt-1">{fieldErrors.billingLastName}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <input
                            type="text"
                            name="billingAddress"
                            value={formData.billingAddress}
                            onChange={handleInputChange}
                            placeholder="Billing Street Address"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                          />
                          {fieldErrors.billingAddress && (
                            <p className="text-xs text-red-500 mt-1">{fieldErrors.billingAddress}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input
                              type="text"
                              name="billingCity"
                              value={formData.billingCity}
                              onChange={handleInputChange}
                              placeholder="City"
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                            />
                            {fieldErrors.billingCity && (
                              <p className="text-xs text-red-500 mt-1">{fieldErrors.billingCity}</p>
                            )}
                          </div>
                          <div>
                            <input
                              type="text"
                              name="billingPostcode"
                              value={formData.billingPostcode}
                              onChange={handleInputChange}
                              placeholder="Postcode"
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                            />
                            {fieldErrors.billingPostcode && (
                              <p className="text-xs text-red-500 mt-1">{fieldErrors.billingPostcode}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-6 py-3 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                      >
                        <span>Continue to Shipping</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <p className="font-bold text-[#121212]">
                      {formData.firstName} {formData.lastName} &bull; {formData.email} &bull; {formData.phone}
                    </p>
                    <p>
                      {formData.address}
                      {formData.apartment ? `, ${formData.apartment}` : ""}, {formData.city} {formData.state} {formData.postcode}, {formData.country}
                    </p>
                  </div>
                )}
              </div>

              {/* STEP 2: Shipping Method */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center ${
                        currentStep >= 2 ? "bg-[#0071e3] text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      2
                    </span>
                    <h2 className="text-lg font-black text-[#121212]">Shipping Method</h2>
                  </div>
                  {currentStep > 2 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-bold text-[#0071e3] hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {currentStep === 2 ? (
                  <div className="space-y-3">
                    {/* Standard Courier */}
                    <label
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        shippingMethod === "standard"
                          ? "border-[#0071e3] bg-blue-50/30 ring-2 ring-[#0071e3]/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === "standard"}
                          onChange={() => setShippingMethod("standard")}
                          className="w-4 h-4 text-[#0071e3] focus:ring-0"
                        />
                        <div>
                          <p className="font-bold text-sm text-[#121212] flex items-center gap-2">
                            <span>Standard Courier (StarTrack / Australia Post)</span>
                            {standardFee === 0 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                FREE
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">2 - 5 business days Australia-wide</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#121212]">
                        {standardFee === 0 ? "FREE" : "$15.00 AUD"}
                      </span>
                    </label>

                    {/* Express Courier */}
                    <label
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        shippingMethod === "express"
                          ? "border-[#0071e3] bg-blue-50/30 ring-2 ring-[#0071e3]/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === "express"}
                          onChange={() => setShippingMethod("express")}
                          className="w-4 h-4 text-[#0071e3] focus:ring-0"
                        />
                        <div>
                          <p className="font-bold text-sm text-[#121212] flex items-center gap-2">
                            <span>StarTrack Express Priority</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-[#0071e3]">
                              PRIORITY
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">1 - 2 business days guaranteed dispatch</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#121212]">$25.00 AUD</span>
                    </label>

                    {/* Click & Collect */}
                    <label
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        shippingMethod === "pickup"
                          ? "border-[#0071e3] bg-blue-50/30 ring-2 ring-[#0071e3]/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === "pickup"}
                          onChange={() => setShippingMethod("pickup")}
                          className="w-4 h-4 text-[#0071e3] focus:ring-0"
                        />
                        <div>
                          <p className="font-bold text-sm text-[#121212] flex items-center gap-2">
                            <span>Click & Collect (D1 Store Retail Outlets)</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                              STORE PICKUP
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">Available at Sydney, Melbourne, Brisbane stores</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">FREE</span>
                    </label>

                    <div className="pt-4 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-xs sm:text-sm font-bold text-gray-600 hover:text-black"
                      >
                        &larr; Return to Address
                      </button>

                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-6 py-3 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                      >
                        <span>Continue to Payment</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-between">
                    <span>
                      {shippingMethod === "express"
                        ? "StarTrack Express Priority ($25.00 AUD)"
                        : shippingMethod === "pickup"
                        ? "Click & Collect (FREE)"
                        : `Standard Courier (${finalShippingFee === 0 ? "FREE" : "$15.00 AUD"})`}
                    </span>
                    <span className="font-bold text-[#121212]">
                      {finalShippingFee === 0 ? "FREE" : `$${finalShippingFee}.00 AUD`}
                    </span>
                  </div>
                )}
              </div>

              {/* STEP 3: Payment Method */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center ${
                        currentStep >= 3 ? "bg-[#0071e3] text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      3
                    </span>
                    <h2 className="text-lg font-black text-[#121212]">Payment Method</h2>
                  </div>
                  {currentStep > 3 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs font-bold text-[#0071e3] hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {currentStep === 3 ? (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500">
                      All transactions are secure and 256-bit SSL encrypted. Select your preferred payment method:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          paymentMethod === "card"
                            ? "border-[#0071e3] bg-blue-50/40 font-bold text-[#0071e3] ring-2 ring-[#0071e3]/20"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#0071e3]" />
                        <span className="text-xs font-bold block">Credit Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("paypal")}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          paymentMethod === "paypal"
                            ? "border-[#0071e3] bg-blue-50/40 font-bold text-[#0071e3] ring-2 ring-[#0071e3]/20"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        <span className="w-5 h-5 mx-auto mb-1 font-black text-[#003087] flex items-center justify-center text-sm">
                          P
                        </span>
                        <span className="text-xs font-bold block">PayPal</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("afterpay")}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          paymentMethod === "afterpay"
                            ? "border-[#0071e3] bg-blue-50/40 font-bold text-[#0071e3] ring-2 ring-[#0071e3]/20"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        <span className="w-5 h-5 mx-auto mb-1 font-black text-black flex items-center justify-center text-xs">
                          4x
                        </span>
                        <span className="text-xs font-bold block">Afterpay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("bank")}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          paymentMethod === "bank"
                            ? "border-[#0071e3] bg-blue-50/40 font-bold text-[#0071e3] ring-2 ring-[#0071e3]/20"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        <Building2 className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                        <span className="text-xs font-bold block">PayID / Bank</span>
                      </button>
                    </div>

                    {/* Card fields */}
                    {paymentMethod === "card" && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            name="number"
                            maxLength={19}
                            value={cardDetails.number}
                            onChange={handleCardChange}
                            placeholder="4532 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 8921"
                            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none bg-white ${
                              fieldErrors.number ? "border-red-500" : "border-gray-300 focus:border-[#0071e3]"
                            }`}
                          />
                          {fieldErrors.number && (
                            <p className="text-xs text-red-500 mt-1">{fieldErrors.number}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Name on Card *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={cardDetails.name}
                            onChange={handleCardChange}
                            placeholder="e.g. JOHN CITIZEN"
                            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none bg-white ${
                              fieldErrors.name ? "border-red-500" : "border-gray-300 focus:border-[#0071e3]"
                            }`}
                          />
                          {fieldErrors.name && (
                            <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              Expiry Date (MM/YY) *
                            </label>
                            <input
                              type="text"
                              name="expiry"
                              maxLength={5}
                              value={cardDetails.expiry}
                              onChange={handleCardChange}
                              placeholder="MM/YY"
                              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none bg-white ${
                                fieldErrors.expiry ? "border-red-500" : "border-gray-300 focus:border-[#0071e3]"
                              }`}
                            />
                            {fieldErrors.expiry && (
                              <p className="text-xs text-red-500 mt-1">{fieldErrors.expiry}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              CVC / CVV *
                            </label>
                            <input
                              type="password"
                              name="cvc"
                              maxLength={4}
                              value={cardDetails.cvc}
                              onChange={handleCardChange}
                              placeholder="123"
                              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none bg-white ${
                                fieldErrors.cvc ? "border-red-500" : "border-gray-300 focus:border-[#0071e3]"
                              }`}
                            />
                            {fieldErrors.cvc && (
                              <p className="text-xs text-red-500 mt-1">{fieldErrors.cvc}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "paypal" && (
                      <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 text-xs sm:text-sm text-gray-700 space-y-2">
                        <p className="font-bold text-[#003087]">PayPal Express Checkout</p>
                        <p>You will be directed to PayPal to complete your purchase safely.</p>
                      </div>
                    )}

                    {paymentMethod === "afterpay" && (
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-700 space-y-2">
                        <p className="font-bold text-black">Pay in 4 Interest-Free Installments</p>
                        <p>
                          Pay 4 payments of ${(finalTotal / 4).toFixed(2)} AUD every 2 weeks with Afterpay or Zip Pay.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "bank" && (
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-700 space-y-2">
                        <p className="font-bold text-gray-900">Direct Bank Deposit / PayID</p>
                        <p className="text-xs text-gray-600">
                          Account: D1 Store Pty Ltd &bull; BSB: 082-001 &bull; Acc: 12-345-6789 &bull; PayID: sales@d1store.com.au
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Your order will be reserved and dispatched immediately once transfer cleared.
                        </p>
                      </div>
                    )}

                    {/* Order Notes */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Delivery Notes or Special Instructions (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="e.g. Leave at front door if not home, buzz unit 12"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#0071e3]"
                      />
                    </div>

                    <div className="pt-4 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-xs sm:text-sm font-bold text-gray-600 hover:text-black"
                      >
                        &larr; Return to Shipping
                      </button>

                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-6 py-3 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                      >
                        <span>Review Order</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="font-bold text-[#121212]">
                      {paymentMethod === "card"
                        ? "Credit Card ending in " + (cardDetails.number.slice(-4) || "••••")
                        : paymentMethod === "paypal"
                        ? "PayPal Express"
                        : paymentMethod === "afterpay"
                        ? "Afterpay (4 Installments)"
                        : "Direct Bank Transfer / PayID"}
                    </span>
                  </div>
                )}
              </div>

              {/* STEP 4: Review and Submit Order */}
              {currentStep === 4 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <span className="w-7 h-7 rounded-full bg-[#0071e3] text-white text-xs font-black flex items-center justify-center">
                      4
                    </span>
                    <h2 className="text-lg font-black text-[#121212]">Final Review & Place Order</h2>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Recipient:</span>
                      <span className="font-bold text-gray-900">
                        {formData.firstName} {formData.lastName} ({formData.email})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping to:</span>
                      <span className="font-medium text-gray-800">
                        {formData.address}, {formData.city} {formData.state} {formData.postcode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Method:</span>
                      <span className="font-medium text-gray-800">
                        {shippingMethod === "express" ? "StarTrack Express" : "Standard Courier"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment:</span>
                      <span className="font-bold text-[#0071e3] uppercase">{paymentMethod}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white font-black text-base transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Authorize & Place Order (${finalTotal.toLocaleString()} AUD)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Order Review Sticky Summary */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-xs sticky top-24">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h2 className="text-lg font-black text-[#121212]">Order Items ({cart.length})</h2>
                  <Link href="/cart" className="text-xs font-bold text-[#0071e3] hover:underline">
                    Edit Cart
                  </Link>
                </div>

                {/* Items preview list */}
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-2">
                  {cart.map((item) => (
                    <div key={String(item.id)} className="pt-2 pb-2 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-gray-50 p-1 flex-shrink-0 border border-gray-100 relative">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#121212] truncate">{item.title}</p>
                        {item.variantTitle && (
                          <p className="text-[11px] text-gray-500">{item.variantTitle}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          ${item.price.toLocaleString()} AUD each
                        </p>
                      </div>
                      <div className="text-xs font-black text-[#121212]">
                        ${(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculation Details */}
                <div className="space-y-3 text-xs sm:text-sm pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#121212]">${finalSubtotal.toLocaleString()} AUD</span>
                  </div>

                  {finalDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Discount ({appliedCoupon?.code})</span>
                      </span>
                      <span>-${finalDiscount.toLocaleString()} AUD</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={`font-bold ${finalShippingFee === 0 ? "text-emerald-600" : "text-[#121212]"}`}>
                      {finalShippingFee === 0 ? "FREE" : `$${finalShippingFee}.00 AUD`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>Estimated 10% Australian GST</span>
                    <span>${finalGst.toLocaleString()} AUD</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-black text-[#121212]">
                    <span>Total Amount</span>
                    <span className="text-xl text-[#0071e3]">${finalTotal.toLocaleString()} AUD</span>
                  </div>
                </div>

                {/* Safety Guarantee */}
                <div className="pt-2 text-xs text-gray-500 space-y-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Official DJI Australia Authorized Retailer</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-400">
                    Tax invoice with ABN 84 624 487 186 and full Australian warranty issued immediately upon checkout.
                  </p>
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
