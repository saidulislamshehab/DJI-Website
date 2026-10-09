"use client";

import React from "react";
import { Truck, Store, MapPin, Check } from "lucide-react";

export interface AddressData {
  country: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  deliveryType: "ship" | "pickup";
  pickupStore?: string;
  saveInfo?: boolean;
}

interface ShippingAddressSectionProps {
  address: AddressData;
  onChange: (field: keyof AddressData, value: any) => void;
  errors: Record<string, string>;
}

const PICKUP_STORES = [
  {
    id: "sydney-flagship",
    name: "D1 Store Sydney (World Square)",
    address: "Shop 9.07, World Square Shopping Centre, 644 George St, Sydney NSW 2000",
    phone: "(02) 9283 2341",
    readyTime: "Usually ready in 2 hours",
  },
  {
    id: "melbourne-central",
    name: "D1 Store Melbourne (Chadstone)",
    address: "Shop B053, Chadstone Shopping Centre, 1341 Dandenong Rd, Chadstone VIC 3148",
    phone: "(03) 9569 8221",
    readyTime: "Usually ready in 2 hours",
  },
  {
    id: "brisbane-indooroopilly",
    name: "D1 Store Brisbane (Indooroopilly)",
    address: "Shop 2088, Indooroopilly Shopping Centre, 322 Moggill Rd, Indooroopilly QLD 4068",
    phone: "(07) 3878 1209",
    readyTime: "Usually ready in 4 hours",
  },
];

export default function ShippingAddressSection({
  address,
  onChange,
  errors,
}: ShippingAddressSectionProps) {
  return (
    <section className="space-y-4" aria-labelledby="delivery-heading">
      <div className="flex items-center justify-between">
        <h2 id="delivery-heading" className="text-xl sm:text-[22px] font-bold text-gray-900">
          Delivery
        </h2>
      </div>

      {/* Segmented Delivery Mode Selector */}
      <div className="grid grid-cols-2 p-1.5 bg-gray-100 rounded-xl gap-1.5 border border-gray-200/80">
        <button
          type="button"
          onClick={() => onChange("deliveryType", "ship")}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            address.deliveryType === "ship"
              ? "bg-white text-gray-900 shadow-xs border border-gray-200/60"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Truck className="w-4.5 h-4.5 text-[#0071e3]" />
          <span>Ship to address</span>
        </button>

        <button
          type="button"
          onClick={() => onChange("deliveryType", "pickup")}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            address.deliveryType === "pickup"
              ? "bg-white text-gray-900 shadow-xs border border-gray-200/60"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Store className="w-4.5 h-4.5 text-[#0071e3]" />
          <span>Pick up in store</span>
        </button>
      </div>

      {address.deliveryType === "ship" ? (
        /* ================= SHIP TO ADDRESS FIELDS ================= */
        <div className="space-y-3.5 pt-1">
          {/* Country / Region */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1.5">
              Country / Region
            </label>
            <select
              id="country"
              name="country"
              value={address.country}
              onChange={(e) => onChange("country", e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 text-[15px] text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all cursor-pointer"
            >
              <option value="Australia">Australia</option>
              <option value="New Zealand">New Zealand</option>
            </select>
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="sr-only">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                autoComplete="given-name"
                value={address.firstName}
                onChange={(e) => onChange("firstName", e.target.value)}
                placeholder="First name"
                className={`w-full h-12 px-4 rounded-lg border text-[15px] text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all ${
                  errors.firstName
                    ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500"
                    : "border-gray-300 focus:border-[#0071e3]"
                }`}
                aria-invalid={!!errors.firstName}
                required
              />
              {errors.firstName && (
                <p className="text-sm text-red-600 mt-1 font-medium">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="sr-only">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                autoComplete="family-name"
                value={address.lastName}
                onChange={(e) => onChange("lastName", e.target.value)}
                placeholder="Last name"
                className={`w-full h-12 px-4 rounded-lg border text-[15px] text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all ${
                  errors.lastName
                    ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500"
                    : "border-gray-300 focus:border-[#0071e3]"
                }`}
                aria-invalid={!!errors.lastName}
                required
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 mt-1 font-medium">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Company (Optional) */}
          <div>
            <label htmlFor="company" className="sr-only">
              Company (optional)
            </label>
            <input
              id="company"
              type="text"
              name="company"
              autoComplete="organization"
              value={address.company}
              onChange={(e) => onChange("company", e.target.value)}
              placeholder="Company (optional)"
              className="w-full h-12 px-4 rounded-lg border border-gray-300 text-[15px] text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all"
            />
          </div>

          {/* Street Address */}
          <div>
            <label htmlFor="address" className="sr-only">
              Street address
            </label>
            <input
              id="address"
              type="text"
              name="address"
              autoComplete="street-address"
              value={address.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Address"
              className={`w-full h-12 px-4 rounded-lg border text-[15px] text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all ${
                errors.address
                  ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500"
                  : "border-gray-300 focus:border-[#0071e3]"
              }`}
              aria-invalid={!!errors.address}
              required
            />
            {errors.address && (
              <p className="text-sm text-red-600 mt-1 font-medium">{errors.address}</p>
            )}
          </div>

          {/* Apartment, Suite, etc. */}
          <div>
            <label htmlFor="apartment" className="sr-only">
              Apartment, suite, etc. (optional)
            </label>
            <input
              id="apartment"
              type="text"
              name="apartment"
              autoComplete="address-line2"
              value={address.apartment}
              onChange={(e) => onChange("apartment", e.target.value)}
              placeholder="Apartment, suite, unit, etc. (optional)"
              className="w-full h-12 px-4 rounded-lg border border-gray-300 text-[15px] text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all"
            />
          </div>

          {/* Suburb / City, State, Postcode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="city" className="sr-only">
                Suburb / City
              </label>
              <input
                id="city"
                type="text"
                name="city"
                autoComplete="address-level2"
                value={address.city}
                onChange={(e) => onChange("city", e.target.value)}
                placeholder="Suburb / City"
                className={`w-full h-12 px-4 rounded-lg border text-[15px] text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all ${
                  errors.city
                    ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500"
                    : "border-gray-300 focus:border-[#0071e3]"
                }`}
                aria-invalid={!!errors.city}
                required
              />
              {errors.city && (
                <p className="text-sm text-red-600 mt-1 font-medium">{errors.city}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="sr-only">
                State
              </label>
              <select
                id="state"
                name="state"
                value={address.state}
                onChange={(e) => onChange("state", e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 text-[15px] text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all cursor-pointer"
              >
                <option value="NSW">New South Wales (NSW)</option>
                <option value="VIC">Victoria (VIC)</option>
                <option value="QLD">Queensland (QLD)</option>
                <option value="WA">Western Australia (WA)</option>
                <option value="SA">South Australia (SA)</option>
                <option value="TAS">Tasmania (TAS)</option>
                <option value="ACT">Australian Capital Territory (ACT)</option>
                <option value="NT">Northern Territory (NT)</option>
              </select>
            </div>

            <div>
              <label htmlFor="postcode" className="sr-only">
                Postcode
              </label>
              <input
                id="postcode"
                type="text"
                name="postcode"
                autoComplete="postal-code"
                maxLength={6}
                value={address.postcode}
                onChange={(e) => onChange("postcode", e.target.value)}
                placeholder="Postcode"
                className={`w-full h-12 px-4 rounded-lg border text-[15px] text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all ${
                  errors.postcode
                    ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500"
                    : "border-gray-300 focus:border-[#0071e3]"
                }`}
                aria-invalid={!!errors.postcode}
                required
              />
              {errors.postcode && (
                <p className="text-sm text-red-600 mt-1 font-medium">{errors.postcode}</p>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="sr-only">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              autoComplete="tel"
              value={address.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="Phone number (for delivery SMS)"
              className={`w-full h-12 px-4 rounded-lg border text-[15px] text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all ${
                errors.phone
                  ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500"
                  : "border-gray-300 focus:border-[#0071e3]"
              }`}
              aria-invalid={!!errors.phone}
              required
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.phone ? (
                <p className="text-sm text-red-600 font-medium">{errors.phone}</p>
              ) : (
                <p className="text-xs sm:text-[13px] text-gray-500">
                  Required for StarTrack Express SMS dispatch notifications
                </p>
              )}
            </div>
          </div>

          {/* Save Info Checkbox */}
          <div className="pt-1.5">
            <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 select-none">
              <input
                type="checkbox"
                checked={address.saveInfo ?? true}
                onChange={(e) => onChange("saveInfo", e.target.checked)}
                className="w-4.5 h-4.5 rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3] focus:ring-offset-0 cursor-pointer"
              />
              <span>Save this information for next time</span>
            </label>
          </div>
        </div>
      ) : (
        /* ================= CLICK & COLLECT PICKUP STORES ================= */
        <div className="space-y-3.5 pt-1">
          <p className="text-sm text-gray-600 font-medium">
            Select an official D1 Store retail location for free same-day click &amp; collect:
          </p>

          <div className="space-y-3">
            {PICKUP_STORES.map((store) => {
              const isSelected = (address.pickupStore || PICKUP_STORES[0].id) === store.id;
              return (
                <div
                  key={store.id}
                  onClick={() => onChange("pickupStore", store.id)}
                  className={`p-4 sm:p-4.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#0071e3] bg-blue-50/20 ring-2 ring-[#0071e3]/20 shadow-xs"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                          isSelected ? "border-[#0071e3] bg-[#0071e3] text-white" : "border-gray-300"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-gray-900">{store.name}</p>
                        <p className="text-sm text-gray-600 mt-0.5 leading-snug">{store.address}</p>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Ph: {store.phone}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0 border border-emerald-200/60">
                      {store.readyTime}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact details for pickup notification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label htmlFor="pickupFirstName" className="sr-only">
                Collector First Name
              </label>
              <input
                id="pickupFirstName"
                type="text"
                value={address.firstName}
                onChange={(e) => onChange("firstName", e.target.value)}
                placeholder="Collector first name"
                className="w-full h-12 px-4 rounded-lg border border-gray-300 text-[15px] text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-[#0071e3]"
                required
              />
            </div>
            <div>
              <label htmlFor="pickupLastName" className="sr-only">
                Collector Last Name
              </label>
              <input
                id="pickupLastName"
                type="text"
                value={address.lastName}
                onChange={(e) => onChange("lastName", e.target.value)}
                placeholder="Collector last name"
                className="w-full h-12 px-4 rounded-lg border border-gray-300 text-[15px] text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-[#0071e3]"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="pickupPhone" className="sr-only">
              Mobile Phone
            </label>
            <input
              id="pickupPhone"
              type="tel"
              value={address.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="Mobile phone for collection SMS"
              className="w-full h-12 px-4 rounded-lg border border-gray-300 text-[15px] text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-[#0071e3]"
              required
            />
            {errors.phone && <p className="text-sm text-red-600 mt-1 font-medium">{errors.phone}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
