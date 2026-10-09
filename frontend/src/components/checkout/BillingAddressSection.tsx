"use client";

import React from "react";
import { Check } from "lucide-react";

export interface BillingAddressData {
  sameAsShipping: boolean;
  country: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  postcode: string;
}

interface BillingAddressSectionProps {
  billing: BillingAddressData;
  onChange: (field: keyof BillingAddressData, value: any) => void;
  errors: Record<string, string>;
}

export default function BillingAddressSection({
  billing,
  onChange,
  errors,
}: BillingAddressSectionProps) {
  return (
    <section className="space-y-3" aria-labelledby="billing-heading">
      <div>
        <h2 id="billing-heading" className="text-lg sm:text-[19px] font-bold text-[#111827]">
          Billing address
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Select the address that matches your card or payment method.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-200 bg-white shadow-xs">
        {/* Same as shipping option */}
        <label
          onClick={() => onChange("sameAsShipping", true)}
          className={`flex items-center gap-3.5 p-4 cursor-pointer transition-colors ${
            billing.sameAsShipping ? "bg-blue-50/15" : "hover:bg-gray-50/60"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
              billing.sameAsShipping
                ? "border-[#0071e3] bg-[#0071e3] text-white"
                : "border-gray-300 bg-white"
            }`}
          >
            {billing.sameAsShipping && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span className="text-sm font-semibold text-gray-900">
            Same as shipping address
          </span>
        </label>

        {/* Different billing address option */}
        <div>
          <label
            onClick={() => onChange("sameAsShipping", false)}
            className={`flex items-center gap-3.5 p-4 cursor-pointer transition-colors ${
              !billing.sameAsShipping ? "bg-blue-50/15" : "hover:bg-gray-50/60"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                !billing.sameAsShipping
                  ? "border-[#0071e3] bg-[#0071e3] text-white"
                  : "border-gray-300 bg-white"
              }`}
            >
              {!billing.sameAsShipping && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span className="text-sm font-semibold text-gray-900">
              Use a different billing address
            </span>
          </label>

          {/* Expanded Billing Address Fields */}
          {!billing.sameAsShipping && (
            <div className="p-4 bg-gray-50/70 border-t border-gray-200 space-y-3">
              {/* Country */}
              <div>
                <label htmlFor="billingCountry" className="block text-xs font-semibold text-gray-700 mb-1">
                  Country / Region
                </label>
                <select
                  id="billingCountry"
                  value={billing.country}
                  onChange={(e) => onChange("country", e.target.value)}
                  className="w-full h-12 px-3.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#0071e3]"
                >
                  <option value="Australia">Australia</option>
                  <option value="New Zealand">New Zealand</option>
                </select>
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={billing.firstName}
                    onChange={(e) => onChange("firstName", e.target.value)}
                    placeholder="First name"
                    className="w-full h-12 px-3.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-[#0071e3]"
                    required
                  />
                  {errors.billingFirstName && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.billingFirstName}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    value={billing.lastName}
                    onChange={(e) => onChange("lastName", e.target.value)}
                    placeholder="Last name"
                    className="w-full h-12 px-3.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-[#0071e3]"
                    required
                  />
                  {errors.billingLastName && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.billingLastName}</p>
                  )}
                </div>
              </div>

              {/* Company */}
              <div>
                <input
                  type="text"
                  value={billing.company}
                  onChange={(e) => onChange("company", e.target.value)}
                  placeholder="Company (optional)"
                  className="w-full h-12 px-3.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              {/* Address */}
              <div>
                <input
                  type="text"
                  value={billing.address}
                  onChange={(e) => onChange("address", e.target.value)}
                  placeholder="Address"
                  className="w-full h-12 px-3.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-[#0071e3]"
                  required
                />
                {errors.billingAddress && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.billingAddress}</p>
                )}
              </div>

              {/* Apartment */}
              <div>
                <input
                  type="text"
                  value={billing.apartment}
                  onChange={(e) => onChange("apartment", e.target.value)}
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  className="w-full h-12 px-3.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              {/* City, State, Postcode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    value={billing.city}
                    onChange={(e) => onChange("city", e.target.value)}
                    placeholder="Suburb / City"
                    className="w-full h-12 px-3.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-[#0071e3]"
                    required
                  />
                  {errors.billingCity && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.billingCity}</p>
                  )}
                </div>

                <div>
                  <select
                    value={billing.state}
                    onChange={(e) => onChange("state", e.target.value)}
                    className="w-full h-12 px-3.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#0071e3]"
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
                  <input
                    type="text"
                    maxLength={6}
                    value={billing.postcode}
                    onChange={(e) => onChange("postcode", e.target.value)}
                    placeholder="Postcode"
                    className="w-full h-12 px-3.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-[#0071e3]"
                    required
                  />
                  {errors.billingPostcode && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.billingPostcode}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
