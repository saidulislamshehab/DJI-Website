"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Mail,
  Loader2,
  ExternalLink,
  Receipt,
  CheckCircle2,
  ShieldCheck,
  Plus,
  Trash2,
} from "lucide-react";
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
          const parsed: IUser = JSON.parse(storedUser);
          setUser(parsed);
          setContactName(parsed.name || "");
          setMarketingEmail(parsed.marketingConsent !== false);
        }

        // Fetch fresh profile from backend
        const me = await fetchAuthMeApi();
        if (me) {
          setUser(me);
          setContactName(me.name || "");
          setMarketingEmail(me.marketingConsent !== false);
          localStorage.setItem("d1_user", JSON.stringify(me));
        }

        // Fetch user's orders
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
      toast.success(newValue ? "Subscribed to email updates" : "Unsubscribed from email updates");
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
      toast.error("Failed to update contact details");
    }
  };

  // Add Address
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.address1 || !newAddress.city || !newAddress.zip) {
      toast.error("Please fill in address, city and postcode");
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
      toast.success("Address saved successfully");
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
      <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0071e3]" />
      </div>
    );
  }

  const userEmail = user?.email || "customer@example.com";
  const isVerified = user?.isVerified ?? true;

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] flex flex-col justify-between font-sans selection:bg-[#0071e3] selection:text-white">
      {/* 1. Header with Official DJI | D1 Store Logo & User Status */}
      <header className="w-full bg-white border-b border-[#e5e5ea]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-[68px] sm:h-[72px] flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 hover:opacity-85 transition-opacity"
            aria-label="D1 Store Home"
          >
            <img
              src="//www.d1store.com.au/cdn/shop/files/DJIxD1STORE-ARS-PNG.png?v=1768876884&width=360"
              alt="DJI Authorised Retail Store - D1 Store"
              className="h-[26px] sm:h-[28px] w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/dji-d1-logo.png";
              }}
            />
          </Link>

          <div className="flex items-center gap-3">
            {isVerified && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Account</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#1d1d1f] hover:text-[#0071e3] hover:bg-[#f5f5f7] transition-colors border border-[#e5e5ea]"
              aria-label="User Account Profile"
            >
              <User className="w-[20px] h-[20px] stroke-[1.8]" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Portal Container (Exact layout from user screenshots) */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-14 items-start">
          {/* Left Navigation Sidebar */}
          <nav className="w-full md:w-[180px] lg:w-[200px] shrink-0 flex md:flex-col gap-4 md:gap-3 border-b md:border-b-0 pb-4 md:pb-0 border-[#e5e5ea]">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`text-left text-[17px] transition-colors cursor-pointer ${
                activeTab === "orders"
                  ? "font-bold text-[#1d1d1f]"
                  : "text-[#86868b] hover:text-[#1d1d1f] font-medium"
              }`}
            >
              Orders
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`text-left text-[17px] transition-colors cursor-pointer ${
                activeTab === "profile"
                  ? "font-bold text-[#1d1d1f]"
                  : "text-[#86868b] hover:text-[#1d1d1f] font-medium"
              }`}
            >
              Profile
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("invoices")}
              className={`text-left text-[17px] transition-colors cursor-pointer ${
                activeTab === "invoices"
                  ? "font-bold text-[#1d1d1f]"
                  : "text-[#86868b] hover:text-[#1d1d1f] font-medium"
              }`}
            >
              Show Invoices
            </button>
          </nav>

          {/* Right Main Content Area */}
          <div className="flex-1 w-full">
            {/* TAB 1: ORDERS */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                {/* Welcome & Shop Now Card (Exact matching screenshot 1) */}
                <div className="bg-white border border-[#e5e5ea] rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                      <h1 className="text-[24px] sm:text-[26px] font-bold text-[#1d1d1f] tracking-tight">
                        Welcome
                      </h1>
                      <p className="text-[15px] text-[#86868b] mt-0.5">
                        Ready to shop?
                      </p>
                    </div>

                    <Link
                      href="/collections"
                      className="inline-flex items-center justify-center bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] text-white text-[14px] font-medium px-5 py-2.5 rounded-full transition-colors self-start sm:self-auto shadow-xs"
                    >
                      Shop now
                    </Link>
                  </div>

                  {/* Horizontal Product Showcase Row matching Screenshot 1 */}
                  <div className="pt-2 flex items-center justify-center sm:justify-start gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2">
                    {/* Item 1: Mount */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#fbfbfd] rounded-xl p-2 shrink-0 flex items-center justify-center hover:scale-105 transition-transform border border-[#f0f0f2]">
                      <img
                        src="https://cdn.shopify.com/s/files/1/0693/6448/2209/files/dji-osmo-action-suction-cup-mount.png?v=1710375828"
                        alt="DJI Mount"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://www-cdn.djiits.com/dji/image/default-product.png";
                        }}
                      />
                    </div>

                    {/* Item 2: 2 Year Warranty Card */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#1d1d1f] text-white rounded-xl p-2 shrink-0 flex flex-col items-center justify-center text-center shadow-xs">
                      <span className="text-xl sm:text-2xl font-black text-amber-400 leading-none">
                        2
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300">
                        YEAR
                      </span>
                      <span className="text-[7px] text-gray-300 uppercase tracking-tighter mt-0.5">
                        SECOND YEAR WARRANTY
                      </span>
                    </div>

                    {/* Item 3: Lanyard Clip */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#fbfbfd] rounded-xl p-2 shrink-0 flex items-center justify-center hover:scale-105 transition-transform border border-[#f0f0f2]">
                      <img
                        src="https://cdn.shopify.com/s/files/1/0693/6448/2209/files/d1-labs-heavy-duty-lanyard-01.png?v=1710375828"
                        alt="Lanyard clip"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://www-cdn.djiits.com/dji/image/default-product.png";
                        }}
                      />
                    </div>

                    {/* Item 4: Osmo Pocket 3 */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#fbfbfd] rounded-xl p-2 shrink-0 flex items-center justify-center hover:scale-105 transition-transform border border-[#f0f0f2]">
                      <img
                        src="https://cdn.shopify.com/s/files/1/0693/6448/2209/files/osmo-pocket-3-product-thumb.png?v=1710375828"
                        alt="Osmo Pocket 3"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://www-cdn.djiits.com/dji/image/default-product.png";
                        }}
                      />
                    </div>

                    {/* Item 5: Shoulder Bag */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#fbfbfd] rounded-xl p-2 shrink-0 flex items-center justify-center hover:scale-105 transition-transform border border-[#f0f0f2]">
                      <img
                        src="https://cdn.shopify.com/s/files/1/0693/6448/2209/files/dji-mini-3-pro-shoulder-bag.png?v=1710375828"
                        alt="DJI Shoulder Bag"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://www-cdn.djiits.com/dji/image/default-product.png";
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Orders History Section */}
                {orders.length > 0 ? (
                  <div className="space-y-4 pt-2">
                    <h2 className="text-[18px] font-bold text-[#1d1d1f]">Your Orders</h2>
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order._id || order.orderNumber}
                          className="bg-white border border-[#e5e5ea] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-300 transition-colors shadow-2xs"
                        >
                          <div>
                            <div className="flex items-center gap-2.5">
                              <Link
                                href={`/orders/${order._id || order.orderNumber}`}
                                className="font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
                              >
                                Order #{order.orderNumber}
                              </Link>
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                  order.status === "Delivered"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : order.status === "Cancelled"
                                    ? "bg-red-50 text-red-700 border border-red-200"
                                    : "bg-blue-50 text-[#0071e3] border border-blue-200"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <p className="text-[13px] text-[#86868b] mt-1">
                              {order.items?.length || 1} item(s) &bull; Placed on{" "}
                              {new Date(order.createdAt || Date.now()).toLocaleDateString("en-AU")}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-[16px] font-extrabold text-[#1d1d1f]">
                              ${order.total?.toLocaleString() || "0"} AUD
                            </span>
                            <Link
                              href={`/orders/${order._id || order.orderNumber}`}
                              className="text-[13px] text-gray-600 font-medium hover:text-black hover:underline"
                            >
                              Track
                            </Link>
                            <Link
                              href={`/orders/${order._id || order.orderNumber}/invoice`}
                              className="text-[13px] text-[#0071e3] font-medium hover:underline flex items-center gap-1"
                            >
                              <span>Tax Invoice</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* TAB 2: PROFILE (Upgraded UI matching user screenshots) */}
            {activeTab === "profile" && (
              <div className="space-y-8 max-w-[680px]">
                {/* 1. Contact Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-[16px] font-bold text-[#1d1d1f]">Contact</h2>
                    <button
                      type="button"
                      onClick={() => setIsEditingContact(!isEditingContact)}
                      className="text-[14px] text-[#0071e3] font-medium hover:underline cursor-pointer"
                    >
                      {isEditingContact ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  <div className="bg-white border border-[#e5e5ea] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                    {isEditingContact ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-[12px] text-[#86868b] font-medium block mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full h-11 px-3.5 border border-[#d2d2d7] rounded-xl text-sm text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10"
                          />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[13px] text-[#86868b]">{userEmail}</span>
                          <button
                            type="button"
                            onClick={handleSaveContact}
                            className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-[13px] font-semibold px-4 py-2 rounded-xl shadow-xs cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] text-[#86868b]">Email</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-medium text-[#1d1d1f]">{userEmail}</span>
                          {isVerified && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Addresses Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-[16px] font-bold text-[#1d1d1f]">Addresses</h2>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(!isAddingAddress)}
                      className="text-[14px] text-[#0071e3] font-medium hover:underline cursor-pointer"
                    >
                      {isAddingAddress ? "Cancel" : "Add"}
                    </button>
                  </div>

                  {isAddingAddress ? (
                    <form
                      onSubmit={handleSaveAddress}
                      className="bg-white border border-[#e5e5ea] rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="First Name"
                          value={newAddress.firstName}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, firstName: e.target.value })
                          }
                          className="h-11 px-3.5 border border-[#d2d2d7] rounded-xl text-sm text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={newAddress.lastName}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, lastName: e.target.value })
                          }
                          className="h-11 px-3.5 border border-[#d2d2d7] rounded-xl text-sm text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Street Address"
                        required
                        value={newAddress.address1}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, address1: e.target.value })
                        }
                        className="w-full h-11 px-3.5 border border-[#d2d2d7] rounded-xl text-sm text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="City / Suburb"
                          required
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                          }
                          className="h-11 px-3.5 border border-[#d2d2d7] rounded-xl text-sm text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                        />
                        <input
                          type="text"
                          placeholder="State (e.g. NSW)"
                          value={newAddress.province}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, province: e.target.value })
                          }
                          className="h-11 px-3.5 border border-[#d2d2d7] rounded-xl text-sm text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                        />
                        <input
                          type="text"
                          placeholder="Postcode"
                          required
                          value={newAddress.zip}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, zip: e.target.value })
                          }
                          className="h-11 px-3.5 border border-[#d2d2d7] rounded-xl text-sm text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-[13px] font-semibold px-5 py-2 rounded-xl shadow-xs cursor-pointer"
                        >
                          Save address
                        </button>
                      </div>
                    </form>
                  ) : user?.addresses && user.addresses.length > 0 ? (
                    <div className="space-y-3">
                      {user.addresses.map((addr, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-[#e5e5ea] rounded-2xl p-5 flex items-start justify-between gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                        >
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-[#86868b] mt-0.5 shrink-0" />
                            <div className="text-[14px] text-[#1d1d1f]">
                              <p className="font-semibold">
                                {addr.firstName} {addr.lastName}
                              </p>
                              <p className="text-[#86868b]">{addr.address1} {addr.address2}</p>
                              <p className="text-[#86868b]">
                                {addr.city}, {addr.province} {addr.zip}, {addr.country || "Australia"}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(idx)}
                            className="text-[#86868b] hover:text-red-500 p-1 transition-colors"
                            title="Remove address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Default state matching Screenshot 2 */
                    <div className="bg-white border border-[#e5e5ea] rounded-2xl p-5 sm:p-6 flex items-center gap-3.5 text-[#86868b] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                      <div className="w-9 h-9 rounded-full bg-[#f5f5f7] flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-[#86868b]" />
                      </div>
                      <span className="text-[14px]">No addresses added</span>
                    </div>
                  )}
                </div>

                {/* 3. Marketing Preferences Section (Exact matching Screenshot 2) */}
                <div>
                  <h2 className="text-[16px] font-bold text-[#1d1d1f] mb-2">
                    Marketing preferences
                  </h2>
                  <div className="bg-white border border-[#e5e5ea] rounded-2xl p-5 sm:p-6 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-3.5">
                      <Mail className="w-5 h-5 text-[#86868b]" />
                      <span className="text-[14px] font-medium text-[#1d1d1f]">Email</span>
                    </div>

                    {/* iOS / Shopify Toggle Switch matching Screenshot 2 */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={marketingEmail}
                      onClick={handleToggleMarketing}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        marketingEmail ? "bg-[#0071e3]" : "bg-[#d2d2d7]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          marketingEmail ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 4. Action Buttons matching Screenshot 2 */}
                <div className="pt-2 flex items-center gap-5">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="bg-white border border-[#d2d2d7] hover:bg-gray-50 active:bg-gray-100 text-[#1d1d1f] font-semibold text-[14px] px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
                  >
                    Sign out
                  </button>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-[14px] font-medium text-[#0071e3] hover:underline transition-colors cursor-pointer"
                  >
                    Sign out of all devices
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: SHOW INVOICES */}
            {activeTab === "invoices" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-[24px] font-bold text-[#1d1d1f] tracking-tight mb-2">
                    Tax Invoices
                  </h1>
                  <p className="text-[14px] text-[#86868b]">
                    Download and view official CASA / ATO compliant tax invoices for your orders.
                  </p>
                </div>

                {orders.length > 0 ? (
                  <div className="bg-white border border-[#e5e5ea] rounded-2xl overflow-hidden divide-y divide-[#e5e5ea] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                    {orders.map((o) => (
                      <div
                        key={o._id || o.orderNumber}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0071e3] flex items-center justify-center shrink-0">
                            <Receipt className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-[#1d1d1f] text-[15px]">
                              Tax Invoice #{o.orderNumber}
                            </p>
                            <p className="text-[13px] text-[#86868b]">
                              Issued: {new Date(o.createdAt || Date.now()).toLocaleDateString("en-AU")} &bull; Total: ${o.total?.toLocaleString()} AUD
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/orders/${o._id || o.orderNumber}/invoice`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] text-[13px] font-semibold transition-colors"
                        >
                          <span>View Invoice</span>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-[#e5e5ea] rounded-2xl p-10 text-center space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                    <Receipt className="w-10 h-10 text-gray-300 mx-auto" />
                    <h3 className="font-bold text-[#1d1d1f] text-[16px]">No tax invoices yet</h3>
                    <p className="text-sm text-[#86868b] max-w-sm mx-auto">
                      Once you place an order with D1 Store, your tax invoices will appear here for download and bookkeeping.
                    </p>
                    <Link
                      href="/collections"
                      className="inline-block mt-2 bg-[#0071e3] text-white text-[13px] font-semibold px-5 py-2 rounded-full hover:bg-[#0077ed] transition-colors"
                    >
                      Browse Store
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. Pinned Bottom Footer Links matching Screenshots */}
      <footer className="w-full text-center pb-8 pt-10 border-t border-[#e5e5ea] mt-12">
        <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-[12px] text-[#0071e3]">
          <Link href="/policies/refund-policy" className="hover:underline">
            Refund policy
          </Link>
          <Link href="/policies/shipping-policy" className="hover:underline">
            Shipping
          </Link>
          <Link href="/policies/privacy-policy" className="hover:underline">
            Privacy policy
          </Link>
          <Link href="/policies/terms-of-service" className="hover:underline">
            Terms of service
          </Link>
          <Link href="/policies/terms-of-service" className="hover:underline">
            Legal notice
          </Link>
          <Link href="/pages/contact" className="hover:underline">
            Contact information
          </Link>
        </div>
      </footer>
    </div>
  );
}
