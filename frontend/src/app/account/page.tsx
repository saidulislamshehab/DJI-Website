"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { IUser, IOrder, IUserAddress } from "@/types";
import { fetchAuthMeApi, updateAuthProfileApi, fetchOrders } from "@/lib/api";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "invoices">("orders");
  const [isLoading, setIsLoading] = useState(true);
  const [marketingEmail, setMarketingEmail] = useState(true);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactName, setContactName] = useState("");
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<IUserAddress>({
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    province: "",
    zip: "",
    phone: "",
    country: "Australia",
  });

  // Verify authentication and load user data
  useEffect(() => {
    async function initUser() {
      try {
        const storedToken = localStorage.getItem("d1_token");
        const storedUser = localStorage.getItem("d1_user");

        if (!storedToken && !storedUser) {
          router.replace("/login");
          return;
        }

        if (storedUser) {
          try {
            const parsed: IUser = JSON.parse(storedUser);
            setUser(parsed);
            setContactName(parsed.name || "");
            setMarketingEmail(parsed.marketingConsent !== false);
          } catch {
            // ignore JSON error
          }
        }

        // Fetch profile
        const me = await fetchAuthMeApi().catch(() => null);
        if (me) {
          setUser(me);
          setContactName(me.name || "");
          setMarketingEmail(me.marketingConsent !== false);
          localStorage.setItem("d1_user", JSON.stringify(me));
        }

        // Fetch orders
        const emailToSearch = me?.email || (storedUser ? JSON.parse(storedUser).email : "");
        if (emailToSearch) {
          try {
            const allOrders = await fetchOrders();
            const userOrders = allOrders.filter(
              (o) => o.customer?.email?.toLowerCase() === emailToSearch.toLowerCase()
            );
            setOrders(userOrders);
          } catch (e) {
            console.warn("Could not load user orders:", e);
          }
        }
      } catch (err) {
        console.error("Account initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    initUser();
  }, [router]);

  // Handle Sign Out
  const handleSignOut = () => {
    localStorage.removeItem("d1_token");
    localStorage.removeItem("d1_user");
    toast.success("Signed out successfully");
    router.push("/login");
  };

  // Toggle Marketing Consent
  const handleToggleMarketing = async () => {
    const newValue = !marketingEmail;
    setMarketingEmail(newValue);
    try {
      await updateAuthProfileApi({ marketingConsent: newValue });
      if (user) {
        const updated = { ...user, marketingConsent: newValue };
        setUser(updated);
        localStorage.setItem("d1_user", JSON.stringify(updated));
      }
      toast.success(newValue ? "Subscribed to updates" : "Unsubscribed from updates");
    } catch {
      setMarketingEmail(!newValue);
      toast.error("Failed to update preferences");
    }
  };

  // Update Contact Name
  const handleSaveContact = async () => {
    try {
      await updateAuthProfileApi({ name: contactName });
      if (user) {
        const updated = { ...user, name: contactName };
        setUser(updated);
        localStorage.setItem("d1_user", JSON.stringify(updated));
      }
      setIsEditingContact(false);
      toast.success("Contact details updated");
    } catch {
      toast.error("Failed to update contact");
    }
  };

  // Add Address
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.address1 || !newAddress.city || !newAddress.zip) {
      toast.error("Please fill in street address, city, and postcode");
      return;
    }

    const currentAddresses = user?.addresses || [];
    const updatedAddresses = [
      ...currentAddresses,
      { ...newAddress, isDefault: currentAddresses.length === 0 },
    ];

    try {
      await updateAuthProfileApi({ addresses: updatedAddresses });
      if (user) {
        const updated = { ...user, addresses: updatedAddresses };
        setUser(updated);
        localStorage.setItem("d1_user", JSON.stringify(updated));
      }
      setIsAddingAddress(false);
      setNewAddress({
        firstName: "",
        lastName: "",
        address1: "",
        city: "",
        province: "",
        zip: "",
        phone: "",
        country: "Australia",
      });
      toast.success("Address saved");
    } catch {
      toast.error("Failed to save address");
    }
  };

  // Delete Address
  const handleDeleteAddress = async (indexToDelete: number) => {
    const currentAddresses = user?.addresses || [];
    const updatedAddresses = currentAddresses.filter((_, i) => i !== indexToDelete);

    try {
      await updateAuthProfileApi({ addresses: updatedAddresses });
      if (user) {
        const updated = { ...user, addresses: updatedAddresses };
        setUser(updated);
        localStorage.setItem("d1_user", JSON.stringify(updated));
      }
      toast.success("Address removed");
    } catch {
      toast.error("Failed to remove address");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-[#0066cc]" />
      </div>
    );
  }

  const userEmail = user?.email || "customer@example.com";
  const displayName = user?.name || userEmail.split("@")[0] || "Customer";

  return (
    <div className="min-h-screen bg-white text-[#121212] flex flex-col justify-between font-sans selection:bg-[#0066cc] selection:text-white">
      {/* 1. Clean Top Header */}
      <header className="w-full bg-white">
        <div className="max-w-[1140px] mx-auto px-6 sm:px-10 h-20 sm:h-24 flex items-center justify-between">
          <Link href="/" className="inline-block hover:opacity-85 transition-opacity">
            <img
              src="//www.d1store.com.au/cdn/shop/files/DJIxD1STORE-ARS-PNG.png?v=1768876884&width=360"
              alt="DJI Authorised Retail Store"
              className="h-8 sm:h-9 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/dji-d1-logo.png";
              }}
            />
          </Link>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "profile" ? "orders" : "profile")}
            className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:border-black transition-colors cursor-pointer"
            aria-label="User Account"
          >
            <User className="w-5 h-5 text-gray-700 stroke-[1.25]" />
          </button>
        </div>
      </header>

      {/* 2. Main Account Workspace */}
      <main className="flex-1 w-full max-w-[1140px] mx-auto px-6 sm:px-10 pt-4 sm:pt-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8 md:gap-14 items-start">
          {/* Left Navigation */}
          <nav className="flex flex-col space-y-3 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`text-left transition-colors cursor-pointer ${
                activeTab === "orders"
                  ? "text-[20px] font-bold text-[#121212]"
                  : "text-[16px] text-gray-500 hover:text-black"
              }`}
            >
              Orders
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`text-left transition-colors cursor-pointer ${
                activeTab === "profile"
                  ? "text-[20px] font-bold text-[#121212]"
                  : "text-[16px] text-gray-500 hover:text-black"
              }`}
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("invoices")}
              className={`text-left transition-colors cursor-pointer ${
                activeTab === "invoices"
                  ? "text-[20px] font-bold text-[#121212]"
                  : "text-[16px] text-gray-500 hover:text-black"
              }`}
            >
              Show Invoices
            </button>
          </nav>

          {/* Right Content Area */}
          <section className="w-full">
            {/* VIEW 1: ORDERS */}
            {activeTab === "orders" && (
              <div className="space-y-8">
                {/* Clean Welcome Card matching image */}
                <div className="bg-white rounded-[26px] border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 sm:p-9 max-w-[660px]">
                  <div className="flex items-start justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-[20px] sm:text-[22px] font-bold text-[#121212] tracking-tight">
                        Welcome
                      </h2>
                      <p className="text-[15px] sm:text-[16px] text-[#4a4a4a] mt-0.5">
                        Ready to shop?
                      </p>
                    </div>

                    <Link
                      href="/collections"
                      className="bg-[#0066cc] hover:bg-[#0055b3] text-white text-[14px] font-semibold px-5 py-2 rounded-full transition-colors inline-flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
                    >
                      Shop now
                    </Link>
                  </div>

                  {/* Product Thumbnails Row */}
                  <div className="flex items-center justify-start gap-4 sm:gap-6 pt-2 pb-1 overflow-x-auto select-none">
                    {/* Item 1: Suction mount */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                      <img
                        src="https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOA3P9-01.jpg?v=1781493574"
                        alt="Suction Cup Mount"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Item 2: 2 Year Warranty Card Badge */}
                    <div className="w-[68px] h-[68px] sm:w-[78px] sm:h-[78px] bg-[#16274e] text-white rounded-[14px] shadow-xs flex flex-col items-center justify-center p-2 text-center select-none shrink-0 border border-[#213a73]">
                      <span className="text-xl sm:text-2xl font-black text-[#f5a623] leading-none">2</span>
                      <span className="text-[9px] font-bold text-[#f5a623] tracking-widest leading-none mt-0.5">YEAR</span>
                      <span className="text-[6.5px] font-bold text-gray-200 tracking-tight leading-tight mt-1 uppercase">
                        Second Year<br />Extended Warranty
                      </span>
                    </div>

                    {/* Item 3: Wrist Strap / Lanyard */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                      <img
                        src="https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4-P6-01.jpg?v=1785999790"
                        alt="Wrist Strap"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Item 4: Osmo Pocket 3 */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                      <img
                        src="https://cdn.shopify.com/s/files/1/0693/6448/2209/files/5de2d0c3de62857a561d16b431a7e5a8_ultra.webp?v=1787120614"
                        alt="Osmo Pocket 3"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* If user has placed orders */}
                {orders.length > 0 && (
                  <div className="max-w-[660px] pt-4">
                    <h3 className="text-[17px] font-bold text-[#121212] mb-4">Past Orders</h3>
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order._id || order.orderNumber}
                          className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-semibold text-sm text-[#121212]">
                              Order #{order.orderNumber || order._id?.slice(-6)}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent"} &bull; {order.status || "Processing"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm text-[#121212]">
                              AUD ${(order.total || 0).toFixed(2)}
                            </p>
                            <Link
                              href={`/orders/${order._id || order.orderNumber}`}
                              className="text-xs text-[#0066cc] hover:underline font-medium inline-block mt-0.5"
                            >
                              View details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: PROFILE */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-[26px] border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 sm:p-9 max-w-[660px] space-y-6">
                <h2 className="text-[20px] sm:text-[22px] font-bold text-[#121212] tracking-tight">
                  Profile
                </h2>

                {/* Contact Section */}
                <div className="border-b border-gray-100 pb-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs uppercase font-semibold tracking-wider text-gray-400">
                      Contact
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsEditingContact(!isEditingContact)}
                      className="text-xs text-[#0066cc] hover:underline font-medium cursor-pointer"
                    >
                      {isEditingContact ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#121212]">{userEmail}</p>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </div>

                  {isEditingContact ? (
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your full name"
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#0066cc]"
                      />
                      <button
                        type="button"
                        onClick={handleSaveContact}
                        className="px-3 py-1.5 text-xs font-semibold bg-[#0066cc] text-white rounded-lg hover:bg-[#0055b3] cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">{displayName}</p>
                  )}
                </div>

                {/* Addresses Section */}
                <div className="border-b border-gray-100 pb-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs uppercase font-semibold tracking-wider text-gray-400">
                      Addresses
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(!isAddingAddress)}
                      className="text-xs text-[#0066cc] hover:underline font-medium cursor-pointer"
                    >
                      {isAddingAddress ? "Cancel" : "+ Add address"}
                    </button>
                  </div>

                  {isAddingAddress ? (
                    <form onSubmit={handleSaveAddress} className="mt-3 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="First name"
                          value={newAddress.firstName}
                          onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Last name"
                          value={newAddress.lastName}
                          onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Street address *"
                        value={newAddress.address1}
                        onChange={(e) => setNewAddress({ ...newAddress, address1: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none"
                        required
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="City / Suburb *"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none"
                          required
                        />
                        <input
                          type="text"
                          placeholder="State (e.g. NSW)"
                          value={newAddress.province}
                          onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Postcode *"
                          value={newAddress.zip}
                          onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold bg-[#0066cc] text-white rounded-lg hover:bg-[#0055b3] cursor-pointer"
                      >
                        Save Address
                      </button>
                    </form>
                  ) : user?.addresses && user.addresses.length > 0 ? (
                    <div className="space-y-2 mt-2">
                      {user.addresses.map((addr, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm text-gray-700 py-1">
                          <p>
                            {addr.address1}, {addr.city} {addr.province} {addr.zip}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(idx)}
                            className="text-xs text-red-500 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">No addresses saved yet.</p>
                  )}
                </div>

                {/* Marketing Preferences */}
                <div className="border-b border-gray-100 pb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#121212]">Marketing emails</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Receive product releases, special offers, and store news
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={marketingEmail}
                    onChange={handleToggleMarketing}
                    className="w-4 h-4 text-[#0066cc] rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                </div>

                {/* Sign Out */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-[#0066cc] hover:underline text-sm font-semibold cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 3: INVOICES */}
            {activeTab === "invoices" && (
              <div className="bg-white rounded-[26px] border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 sm:p-9 max-w-[660px] space-y-6">
                <h2 className="text-[20px] sm:text-[22px] font-bold text-[#121212] tracking-tight">
                  Show Invoices
                </h2>
                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div
                        key={order._id || order.orderNumber}
                        className="border border-gray-200 rounded-xl p-4 flex items-center justify-between text-sm"
                      >
                        <div>
                          <p className="font-semibold text-[#121212]">
                            Tax Invoice #{order.orderNumber || order._id?.slice(-6)}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent"} &bull; AUD ${(order.total || 0).toFixed(2)}
                          </p>
                        </div>
                        <Link
                          href={`/orders/${order._id || order.orderNumber}/invoice`}
                          className="text-xs text-[#0066cc] hover:underline font-semibold"
                        >
                          Download Invoice
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No invoices available.</p>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 3. Simple Bottom Policy Links (Matching Screenshot) */}
      <div className="w-full max-w-[1140px] mx-auto px-6 sm:px-10 py-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] sm:text-[13px] text-[#0066cc]">
          <Link href="/policies/refund-policy" className="hover:underline !text-[#0066cc]">
            Refund policy
          </Link>
          <Link href="/policies/shipping-policy" className="hover:underline !text-[#0066cc]">
            Shipping
          </Link>
          <Link href="/policies/privacy-policy" className="hover:underline !text-[#0066cc]">
            Privacy policy
          </Link>
          <Link href="/policies/terms-of-service" className="hover:underline !text-[#0066cc]">
            Terms of service
          </Link>
          <Link href="/policies/legal-notice" className="hover:underline !text-[#0066cc]">
            Legal notice
          </Link>
          <Link href="/policies/contact-information" className="hover:underline !text-[#0066cc]">
            Contact information
          </Link>
        </div>
      </div>
    </div>
  );
}
