"use client";

import React from "react";
import { CreditCard, Lock, Check, Building2, HelpCircle } from "lucide-react";

export type PaymentMethodType = "card" | "paypal" | "afterpay" | "bank";

export interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

interface PaymentMethodSectionProps {
  selectedMethod: PaymentMethodType;
  onSelectMethod: (method: PaymentMethodType) => void;
  cardDetails: CardDetails;
  onChangeCardDetails: (field: keyof CardDetails, value: string) => void;
  grandTotal: number;
  errors: Record<string, string>;
}

export default function PaymentMethodSection({
  selectedMethod,
  onSelectMethod,
  cardDetails,
  onChangeCardDetails,
  grandTotal,
  errors,
}: PaymentMethodSectionProps) {
  const afterpayInstallment = (grandTotal / 4).toFixed(2);

  return (
    <section className="space-y-3" aria-labelledby="payment-heading">
      <div>
        <h2 id="payment-heading" className="text-lg sm:text-[19px] font-bold text-[#111827]">
          Payment
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          All transactions are secure and 256-bit SSL encrypted.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-200 bg-white shadow-xs">
        {/* ================= OPTION 1: CREDIT CARD ================= */}
        <div>
          <label
            onClick={() => onSelectMethod("card")}
            className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
              selectedMethod === "card" ? "bg-blue-50/15" : "hover:bg-gray-50/60"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  selectedMethod === "card"
                    ? "border-[#0071e3] bg-[#0071e3] text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selectedMethod === "card" && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-sm font-bold text-gray-900">Credit card</span>
            </div>

            {/* Credit Card Logos */}
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
                VISA
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-red-50 text-red-800 border border-red-200">
                MC
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-cyan-50 text-cyan-800 border border-cyan-200">
                AMEX
              </span>
            </div>
          </label>

          {/* Expanded Credit Card Form */}
          {selectedMethod === "card" && (
            <div className="p-4 bg-gray-50/70 border-t border-gray-200 space-y-3">
              {/* Card Number */}
              <div>
                <label htmlFor="cardNumber" className="sr-only">
                  Card number
                </label>
                <div className="relative">
                  <input
                    id="cardNumber"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    maxLength={19}
                    value={cardDetails.number}
                    onChange={(e) => {
                      // format with spaces every 4 digits
                      const clean = e.target.value.replace(/\D/g, "").slice(0, 16);
                      const formatted = clean.match(/.{1,4}/g)?.join(" ") || clean;
                      onChangeCardDetails("number", formatted);
                    }}
                    placeholder="Card number"
                    className={`w-full h-12 pl-3.5 pr-10 rounded-lg border text-base sm:text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all font-mono tracking-wider ${
                      errors.number
                        ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500"
                        : "border-gray-300 focus:border-[#0071e3]"
                    }`}
                    aria-invalid={!!errors.number}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
                {errors.number && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.number}</p>
                )}
              </div>

              {/* Expiry and Security Code */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cardExpiry" className="sr-only">
                    Expiration date (MM / YY)
                  </label>
                  <input
                    id="cardExpiry"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    maxLength={5}
                    value={cardDetails.expiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      if (val.length >= 3) {
                        val = val.slice(0, 2) + "/" + val.slice(2);
                      }
                      onChangeCardDetails("expiry", val);
                    }}
                    placeholder="Expiration date (MM / YY)"
                    className={`w-full h-12 px-3.5 rounded-lg border text-base sm:text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all font-mono ${
                      errors.expiry
                        ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500"
                        : "border-gray-300 focus:border-[#0071e3]"
                    }`}
                    aria-invalid={!!errors.expiry}
                  />
                  {errors.expiry && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.expiry}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cardCvc" className="sr-only">
                    Security code (CVV)
                  </label>
                  <div className="relative">
                    <input
                      id="cardCvc"
                      type="password"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      maxLength={4}
                      value={cardDetails.cvc}
                      onChange={(e) => onChangeCardDetails("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="Security code (CVV)"
                      className={`w-full h-12 pl-3.5 pr-10 rounded-lg border text-base sm:text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all font-mono ${
                        errors.cvc
                          ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500"
                          : "border-gray-300 focus:border-[#0071e3]"
                      }`}
                      aria-invalid={!!errors.cvc}
                    />
                    <div
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-help"
                      title="3-digit security code usually found on the back of your card"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </div>
                  </div>
                  {errors.cvc && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.cvc}</p>
                  )}
                </div>
              </div>

              {/* Name on Card */}
              <div>
                <label htmlFor="cardName" className="sr-only">
                  Name on card
                </label>
                <input
                  id="cardName"
                  type="text"
                  autoComplete="cc-name"
                  value={cardDetails.name}
                  onChange={(e) => onChangeCardDetails("name", e.target.value)}
                  placeholder="Name on card"
                  className={`w-full h-12 px-3.5 rounded-lg border text-base sm:text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all ${
                    errors.name
                      ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500"
                      : "border-gray-300 focus:border-[#0071e3]"
                  }`}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= OPTION 2: PAYPAL ================= */}
        <div>
          <label
            onClick={() => onSelectMethod("paypal")}
            className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
              selectedMethod === "paypal" ? "bg-blue-50/15" : "hover:bg-gray-50/60"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  selectedMethod === "paypal"
                    ? "border-[#0071e3] bg-[#0071e3] text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selectedMethod === "paypal" && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-sm font-bold text-gray-900">PayPal</span>
            </div>

            <span className="italic font-extrabold text-sm text-[#003087]">
              Pay<span className="text-[#0079c1]">Pal</span>
            </span>
          </label>

          {selectedMethod === "paypal" && (
            <div className="p-4 bg-gray-50/70 border-t border-gray-200 text-center space-y-2">
              <p className="text-xs sm:text-sm text-gray-600">
                After clicking &ldquo;Pay now&rdquo;, you will be directed to PayPal to complete your purchase securely.
              </p>
            </div>
          )}
        </div>

        {/* ================= OPTION 3: AFTERPAY ================= */}
        <div>
          <label
            onClick={() => onSelectMethod("afterpay")}
            className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
              selectedMethod === "afterpay" ? "bg-blue-50/15" : "hover:bg-gray-50/60"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  selectedMethod === "afterpay"
                    ? "border-[#0071e3] bg-[#0071e3] text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selectedMethod === "afterpay" && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900">Afterpay</span>
                <span className="text-xs text-gray-500 block sm:inline sm:ml-2">
                  (4 x ${afterpayInstallment} AUD)
                </span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-100 text-emerald-800">
              afterpay&#x25C7;
            </span>
          </label>

          {selectedMethod === "afterpay" && (
            <div className="p-4 bg-gray-50/70 border-t border-gray-200 text-center space-y-1.5">
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                Pay 4 interest-free installments of <strong className="text-gray-900">${afterpayInstallment} AUD</strong> every 2 weeks.
              </p>
              <p className="text-[11px] text-gray-500">
                You will be redirected to Afterpay to authorize your payment schedule.
              </p>
            </div>
          )}
        </div>

        {/* ================= OPTION 4: DIRECT BANK TRANSFER / PAYID ================= */}
        <div>
          <label
            onClick={() => onSelectMethod("bank")}
            className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
              selectedMethod === "bank" ? "bg-blue-50/15" : "hover:bg-gray-50/60"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  selectedMethod === "bank"
                    ? "border-[#0071e3] bg-[#0071e3] text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selectedMethod === "bank" && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-sm font-bold text-gray-900">Direct Bank Deposit / PayID</span>
            </div>

            <Building2 className="w-4 h-4 text-gray-500" />
          </label>

          {selectedMethod === "bank" && (
            <div className="p-4 bg-gray-50/70 border-t border-gray-200 text-xs sm:text-sm text-gray-700 space-y-2">
              <p className="font-bold text-gray-900">D1 Store Pty Ltd Bank Details:</p>
              <div className="p-3 bg-white rounded-lg border border-gray-200 font-mono text-xs space-y-1">
                <p><strong>Account Name:</strong> D1 Store Pty Ltd</p>
                <p><strong>BSB:</strong> 082-001</p>
                <p><strong>Account Number:</strong> 12-345-6789</p>
                <p><strong>PayID:</strong> payments@d1store.com.au</p>
              </div>
              <p className="text-[11px] text-gray-500">
                Please use your order number as the deposit reference. Stock is reserved and dispatched immediately upon receipt.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
