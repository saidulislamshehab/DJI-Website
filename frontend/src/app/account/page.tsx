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
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Package,
  Clock,
  Sparkles,
  LogOut,
  Sliders,
  Phone,
  Shield,
  Truck,
  Wrench,
  Check,
  ChevronRight,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { IUser, IOrder, IUserAddress, IProduct } from "@/types";
import { fetchAuthMeApi, updateAuthProfileApi, fetchOrders, fetchProducts } from "@/lib/api";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses" | "invoices">("orders");
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

        // Fetch fresh profile from backend
        const [me, prodsRes] = await Promise.all([
          fetchAuthMeApi(),
          fetchProducts({ limit: 6 }).catch(() => ({ products: [] })),
        ]);

        if (prodsRes?.products) {
          setFeaturedProducts(prodsRes.products);
        }

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
      toast.error("Please fill in street address, city/suburb, and postcode");
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
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center text-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center mb-4">
          <Loader2 className="w-6 h-6 animate-spin text-[#0071e3]" />
        </div>
        <p className="text-sm font-bold text-gray-700">Loading your D1 Store account...</p>
        <p className="text-xs text-gray-400 mt-1">Fetching order history and profile settings</p>
      </div>
    );
  }

  const userEmail = user?.email || "customer@example.com";
  const displayName = user?.name || userEmail.split("@")[0] || "Valued Customer";
  const isAdmin = user?.role === "admin";
  const activeOrdersCount = orders.filter((o) => o.status === "Processing" || o.status === "Shipped").length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1d1d1f] flex flex-col justify-between font-sans selection:bg-[#0071e3] selection:text-white">
      {/* 1. Sleek Top Navigation Bar */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 hover:opacity-85 transition-opacity"
              aria-label="D1 Store Home"
            >
              <img
                src="//www.d1store.com.au/cdn/shop/files/DJIxD1STORE-ARS-PNG.png?v=1768876884&width=360"
                alt="DJI Authorised Retail Store - D1 Store"
                className="h-6 sm:h-7 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/dji-d1-logo.png";
                }}
              />
            </Link>

            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#0071e3] transition-colors py-1 px-2.5 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Admin Console Shortcut */}
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">Admin Console</span>
              </Link>
            )}

            {/* User Greeting Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-gray-700 truncate max-w-[140px]">{userEmail}</span>
            </div>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors"
              title="Sign out of account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Portal Container */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">
        {/* Hero Greeting & Account Overview Banner */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#0071e3] to-blue-700 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shadow-[#0071e3]/20 shrink-0">
                {displayName[0]?.toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    Welcome, {displayName}!
                  </h1>
                  {isAdmin && (
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider border border-purple-200">
                      Administrator
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-gray-500">
                  {userEmail} &bull; Official DJI Authorised Customer Portal
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified D1 Member</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <Shield className="w-3 h-3 text-amber-600" />
                    <span>2-Year Australian Warranty</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#0071e3] border border-blue-200">
                    <Truck className="w-3 h-3 text-[#0071e3]" />
                    <span>Express Dispatch Eligible</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/collections"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#0071e3]/20"
              >
                <Store className="w-4 h-4" />
                <span>Shop DJI Catalog</span>
              </Link>
            </div>
          </div>

          {/* Admin Announcement Bar if user is an admin */}
          {isAdmin && (
            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-purple-900">
                    Full Administrator Privileges Active
                  </p>
                  <p className="text-[11px] text-purple-700">
                    You have master control to add products, stock, categories, orders, and manage staff roles.
                  </p>
                </div>
              </div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
              >
                <span>Launch Admin Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab("orders")}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs cursor-pointer hover:border-[#0071e3]/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Orders</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0071e3] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">{orders.length}</p>
            <p className="text-[11px] text-[#0071e3] font-semibold mt-1">Placed with D1 Store</p>
          </div>

          <div
            onClick={() => setActiveTab("orders")}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs cursor-pointer hover:border-amber-400/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Active Deliveries</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">{activeOrdersCount}</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">
              {activeOrdersCount > 0 ? "In processing or transit" : "All orders fulfilled"}
            </p>
          </div>

          <div
            onClick={() => setActiveTab("addresses")}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs cursor-pointer hover:border-emerald-400/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Saved Addresses</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">{user?.addresses?.length || 0}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Australian shipping destinations</p>
          </div>

          <div
            onClick={() => setActiveTab("invoices")}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs cursor-pointer hover:border-indigo-400/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">ATO Invoices</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">{orders.length}</p>
            <p className="text-[11px] text-indigo-600 font-semibold mt-1">Official GST tax records</p>
          </div>
        </div>

        {/* 3. Main Workspace: Segmented Sidebar & Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Segmented Navigation Menu */}
          <aside className="md:col-span-4 lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-3 shadow-xs space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#0071e3] text-white shadow-md shadow-[#0071e3]/20"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Orders &amp; History</span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                  activeTab === "orders" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#0071e3] text-white shadow-md shadow-[#0071e3]/20"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 shrink-0" />
                <span>Personal Profile</span>
              </div>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "addresses"
                  ? "bg-[#0071e3] text-white shadow-md shadow-[#0071e3]/20"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Delivery Addresses</span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                  activeTab === "addresses" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {user?.addresses?.length || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("invoices")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "invoices"
                  ? "bg-[#0071e3] text-white shadow-md shadow-[#0071e3]/20"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4 shrink-0" />
                <span>Tax Invoices</span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                  activeTab === "invoices" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {orders.length}
              </span>
            </button>

            {isAdmin && (
              <div className="pt-2 border-t border-gray-100">
                <Link
                  href="/admin"
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-purple-700 bg-purple-50/70 hover:bg-purple-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Admin Console</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                </Link>
              </div>
            )}
          </aside>

          {/* Right Content Area */}
          <section className="md:col-span-8 lg:col-span-9 space-y-6">
            {/* TAB 1: ORDERS & SHOPPING */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                {/* Welcome & Featured Gear Showcase */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                        Explore Authentic DJI Innovations
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Curated drones, handheld gimbals, and genuine accessories backed by Australia&apos;s 2-Year Warranty.
                      </p>
                    </div>

                    <Link
                      href="/collections"
                      className="inline-flex items-center justify-center bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs self-start sm:self-auto shrink-0"
                    >
                      <span>Shop Now</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </div>

                  {/* High Quality Product Carousel Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {/* 2 Year Warranty Highlight Badge */}
                    <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-xs border border-gray-800">
                      <span className="text-2xl sm:text-3xl font-black text-amber-400 leading-none">2</span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 mt-0.5">YEAR</span>
                      <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tight mt-1">
                        OFFICIAL D1 WARRANTY
                      </span>
                    </div>

                    {/* Featured items */}
                    {(featuredProducts.length > 0 ? featuredProducts.slice(0, 5) : [
                      {
                        name: "DJI Mini 4 Pro",
                        slug: "dji-mini-4-pro",
                        image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-OSMOPK4P-SC-W-07.jpg?v=1783925871",
                      },
                      {
                        name: "Osmo Pocket 3",
                        slug: "osmo-pocket-3",
                        image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-CRFMINI3PRO2Y-01.jpg?v=1785987040",
                      },
                      {
                        name: "Avata 2 Case",
                        slug: "pgytech-safety-carrying-case-for-dji-avata-2",
                        image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-P-54C-010-01.jpg?v=1790665646",
                      },
                      {
                        name: "Low-Noise Propellers",
                        slug: "sunnylife-low-noise-propellers-for-dji-mini-3-4-pro",
                        image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-SL-6030F-01.jpg?v=1790826992",
                      },
                      {
                        name: "DJI Care Refresh",
                        slug: "dji-care-refresh-dji-mini-3-pro",
                        image: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-CRFMINI3PRO2Y-01.jpg?v=1785987040",
                      },
                    ]).map((prod, idx) => (
                      <Link
                        key={idx}
                        href={prod.slug ? `/products/${prod.slug}` : "/collections"}
                        className="bg-gray-50 hover:bg-blue-50/50 border border-gray-200/80 hover:border-blue-200 rounded-2xl p-2.5 flex flex-col items-center justify-between text-center transition-all group"
                      >
                        <div className="w-16 h-16 sm:w-18 sm:h-18 p-1 flex items-center justify-center">
                          <img
                            src={(prod as any).mainImage || (prod as any).image}
                            alt={prod.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <p className="text-[11px] font-bold text-gray-800 line-clamp-1 mt-1 group-hover:text-[#0071e3]">
                          {prod.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Orders History Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-gray-900">Your Purchases &amp; Orders</h3>
                    <span className="text-xs font-semibold text-gray-500">{orders.length} order(s) found</span>
                  </div>

                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order._id || order.orderNumber}
                          className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-xs hover:border-gray-300 transition-all space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                            <div>
                              <div className="flex items-center gap-2.5">
                                <span className="text-base font-black text-gray-900">
                                  Order #{order.orderNumber}
                                </span>
                                <span
                                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                    order.status === "Delivered"
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                      : order.status === "Shipped"
                                      ? "bg-blue-50 text-blue-800 border-blue-200"
                                      : order.status === "Processing"
                                      ? "bg-amber-50 text-amber-800 border-amber-200"
                                      : "bg-gray-100 text-gray-700 border-gray-200"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString("en-AU", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })} &bull; Payment Method: {order.paymentMethod}
                              </p>
                            </div>

                            <div className="text-left sm:text-right">
                              <p className="text-lg font-black text-gray-900">
                                ${(order.total || 0).toLocaleString()} AUD
                              </p>
                              <span className="inline-block text-[11px] font-semibold text-emerald-700">
                                {order.paymentStatus || "Paid"}
                              </span>
                            </div>
                          </div>

                          {/* Items Ordered */}
                          <div className="divide-y divide-gray-100">
                            {order.items?.map((it, idx) => (
                              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={it.image}
                                    alt={it.name}
                                    className="w-10 h-10 object-contain rounded-lg bg-gray-50 border border-gray-100 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-bold text-gray-800 truncate">{it.name}</p>
                                    <p className="text-gray-500 text-[11px]">Qty: {it.quantity}</p>
                                  </div>
                                </div>
                                <span className="font-bold text-gray-900 shrink-0">
                                  ${((it.price || 0) * (it.quantity || 1)).toLocaleString()} AUD
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Footer Actions */}
                          <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-gray-100">
                            <Link
                              href={`/orders/${order._id || order.orderNumber}/invoice`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
                            >
                              <Receipt className="w-3.5 h-3.5 text-gray-600" />
                              <span>View ATO Tax Invoice</span>
                              <ExternalLink className="w-3 h-3 text-gray-400" />
                            </Link>

                            <Link
                              href={`/orders/${order._id || order.orderNumber}/confirmation`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs font-bold transition-colors shadow-xs"
                            >
                              <span>Order Confirmation</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Clean Empty State */
                    <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center space-y-4 shadow-xs">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0071e3] flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-7 h-7" />
                      </div>
                      <h4 className="text-lg font-black text-gray-900">No Orders Yet</h4>
                      <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                        When you place an order with D1 Store, your real-time tracking, warranty registrations, and ATO tax invoices will appear here.
                      </p>

                      <div className="pt-2 flex flex-wrap justify-center gap-2">
                        <Link
                          href="/collections/dji-drones"
                          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
                        >
                          DJI Drones
                        </Link>
                        <Link
                          href="/collections/osmo-action"
                          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
                        >
                          Handheld Gimbals
                        </Link>
                        <Link
                          href="/collections/accessories"
                          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
                        >
                          Accessories
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: PERSONAL PROFILE */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">Personal Information</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Manage your identity and authentication preferences</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingContact(!isEditingContact)}
                      className="text-xs font-bold text-[#0071e3] hover:underline"
                    >
                      {isEditingContact ? "Cancel" : "Edit Profile"}
                    </button>
                  </div>

                  {isEditingContact ? (
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Your Full Name</label>
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full h-11 px-3.5 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:border-[#0071e3]"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleSaveContact}
                          className="bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Account Name</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{displayName}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Verified Email</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm font-bold text-gray-900">{userEmail}</p>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Marketing Preferences */}
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Email Notifications &amp; Promotions</h4>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-xs font-bold text-gray-800">New Product Announcements &amp; Firmware Updates</p>
                          <p className="text-[11px] text-gray-500">Receive priority access to DJI launches and promotions</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={marketingEmail}
                        onClick={handleToggleMarketing}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                          marketingEmail ? "bg-[#0071e3]" : "bg-gray-300"
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

                  {/* Sign Out Section */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Session Management</p>
                      <p className="text-[11px] text-gray-500">Sign out of your active browser session</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DELIVERY ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">Saved Delivery Addresses</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Manage Australian shipping and billing destinations</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(!isAddingAddress)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0071e3] text-white text-xs font-bold hover:bg-[#0058b8] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddingAddress ? "Cancel" : "Add Address"}</span>
                    </button>
                  </div>

                  {isAddingAddress && (
                    <form onSubmit={handleSaveAddress} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3.5">
                      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">New Address Details</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="First Name"
                          value={newAddress.firstName}
                          onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                          className="h-10 px-3 bg-white border border-gray-300 rounded-xl text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={newAddress.lastName}
                          onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                          className="h-10 px-3 bg-white border border-gray-300 rounded-xl text-xs"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Street Address *"
                        required
                        value={newAddress.address1}
                        onChange={(e) => setNewAddress({ ...newAddress, address1: e.target.value })}
                        className="w-full h-10 px-3 bg-white border border-gray-300 rounded-xl text-xs"
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="City / Suburb *"
                          required
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="h-10 px-3 bg-white border border-gray-300 rounded-xl text-xs"
                        />
                        <input
                          type="text"
                          placeholder="State (e.g. VIC)"
                          value={newAddress.province}
                          onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                          className="h-10 px-3 bg-white border border-gray-300 rounded-xl text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Postcode *"
                          required
                          value={newAddress.zip}
                          onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                          className="h-10 px-3 bg-white border border-gray-300 rounded-xl text-xs"
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#0071e3] text-white text-xs font-bold hover:bg-[#0058b8]"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  )}

                  {user?.addresses && user.addresses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user.addresses.map((addr, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-gray-50 border border-gray-200 relative group flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-xs text-gray-900">
                                {addr.firstName || addr.lastName ? `${addr.firstName || ""} ${addr.lastName || ""}` : "Primary Address"}
                              </span>
                              {addr.isDefault && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0071e3] text-[10px] font-bold">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{addr.address1} {addr.address2}</p>
                            <p className="text-xs text-gray-600">
                              {addr.city}, {addr.province} {addr.zip}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{addr.country || "Australia"}</p>
                          </div>

                          <div className="pt-3 mt-3 border-t border-gray-200 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(idx)}
                              className="text-xs text-red-600 hover:underline inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 text-gray-500 text-xs">
                      <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="font-bold text-gray-700">No saved delivery addresses</p>
                      <p className="text-gray-400 mt-0.5">Add your Australian address for faster checkout dispatch.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: TAX INVOICES */}
            {activeTab === "invoices" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-black text-gray-900">Official ATO Tax Invoices</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Compliant with Australian Taxation Office requirements. Suitable for business tax deductions and GST refunds.
                    </p>
                  </div>

                  {orders.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {orders.map((o) => (
                        <div
                          key={o._id || o.orderNumber}
                          className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                              <Receipt className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">
                                Tax Invoice #{o.orderNumber}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Issued: {new Date(o.createdAt || Date.now()).toLocaleDateString("en-AU")} &bull; Total: ${(o.total || 0).toLocaleString()} AUD
                              </p>
                            </div>
                          </div>

                          <Link
                            href={`/orders/${o._id || o.orderNumber}/invoice`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors shrink-0"
                          >
                            <span>Print / Download PDF</span>
                            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 text-gray-500 text-xs">
                      <Receipt className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="font-bold text-gray-700">No invoices generated yet</p>
                      <p className="text-gray-400 mt-0.5">Once you place an order, your official tax invoices will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* 4. Official DJI Authorised Benefits Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-gray-900">2-Year Official Warranty</p>
              <p className="text-[11px] text-gray-500">Double local protection for Australian consumers.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0071e3] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-gray-900">Fast Express Dispatch</p>
              <p className="text-[11px] text-gray-500">Direct courier shipping from Australian hubs.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-gray-900">Certified Repair Labs</p>
              <p className="text-[11px] text-gray-500">National maintenance facilities across major capitals.</p>
            </div>
          </div>
        </div>
      </main>

      {/* 5. Refined Bottom Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-8 mt-12 text-center text-xs text-gray-500 space-y-3">
        <div className="max-w-[1280px] mx-auto px-4 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 font-medium">
          <Link href="/policies/refund-policy" className="hover:text-[#0071e3] transition-colors">
            Refund policy
          </Link>
          <Link href="/policies/shipping-policy" className="hover:text-[#0071e3] transition-colors">
            Shipping &amp; Delivery
          </Link>
          <Link href="/policies/privacy-policy" className="hover:text-[#0071e3] transition-colors">
            Privacy policy
          </Link>
          <Link href="/policies/terms-of-service" className="hover:text-[#0071e3] transition-colors">
            Terms of service
          </Link>
          <Link href="/pages/contact" className="hover:text-[#0071e3] transition-colors">
            Contact Support (1300 312 888)
          </Link>
        </div>
        <p className="text-[11px] text-gray-400">
          &copy; 2026 D1 Store. Australia&apos;s DJI Authorised Retail Store &bull; ABN 34 612 809 824
        </p>
      </footer>
    </div>
  );
}
