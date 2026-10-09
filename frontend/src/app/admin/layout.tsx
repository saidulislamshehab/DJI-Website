"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  Users,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  LogOut,
  UserCheck,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { fetchAuthMeApi } from "@/lib/api";
import { IUser } from "@/types";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [authState, setAuthState] = useState<"checking" | "authorized" | "unauthorized" | "unauthenticated">("checking");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAdminAuth() {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("d1_token");
      const storedUserStr = localStorage.getItem("d1_user");

      if (!token) {
        if (isMounted) {
          setAuthState("unauthenticated");
          router.replace("/login?redirect=/admin");
        }
        return;
      }

      // Check stored user cache first for instant feedback
      let cachedRole: string | undefined;
      if (storedUserStr) {
        try {
          const parsed = JSON.parse(storedUserStr);
          cachedRole = parsed.role;
          if (parsed && isMounted) {
            setCurrentUser(parsed);
          }
        } catch {
          // ignore cache parse error
        }
      }

      // Verify token with backend
      try {
        const liveUser = await fetchAuthMeApi();
        if (!isMounted) return;

        if (!liveUser) {
          localStorage.removeItem("d1_token");
          localStorage.removeItem("d1_user");
          setAuthState("unauthenticated");
          router.replace("/login?redirect=/admin");
          return;
        }

        setCurrentUser(liveUser);
        localStorage.setItem("d1_user", JSON.stringify(liveUser));

        if (liveUser.role === "admin") {
          setAuthState("authorized");
        } else {
          setAuthState("unauthorized");
        }
      } catch (err) {
        if (!isMounted) return;
        // If network error but cached role is admin, allow offline tolerance
        if (cachedRole === "admin") {
          setAuthState("authorized");
        } else {
          setAuthState("unauthorized");
        }
      }
    }

    checkAdminAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("d1_token");
    localStorage.removeItem("d1_user");
    router.push("/login?redirect=/admin");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products Catalog", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Customer Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Homepage Sections", href: "/admin/homepage-sections", icon: Sliders },
    { label: "Users & Roles", href: "/admin/users", icon: Users },
  ];

  // 1. Loading / Verification State
  if (authState === "checking") {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white px-4">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0071e3]/20 flex items-center justify-center animate-pulse">
            <ShieldCheck className="w-8 h-8 text-[#0071e3]" />
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-[#0071e3] border-t-transparent animate-spin" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white mb-2">Verifying Admin Credentials</h2>
        <p className="text-xs sm:text-sm text-slate-400 text-center max-w-sm">
          Securing access to DJI Store management console...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State (redirecting)
  if (authState === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white px-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
          <Lock className="w-7 h-7 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Sign-In Required</h2>
        <p className="text-sm text-slate-400 mb-6 text-center">
          Redirecting to authentication portal...
        </p>
        <Link
          href="/login?redirect=/admin"
          className="px-5 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs font-bold transition-all shadow-md"
        >
          Proceed to Login
        </Link>
      </div>
    );
  }

  // 3. Unauthorized State (Logged in, but role !== 'admin')
  if (authState === "unauthorized") {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111827] border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />
          
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-extrabold uppercase tracking-wider mb-3">
            403 Forbidden Access
          </span>

          <h1 className="text-2xl font-black text-white mb-2">Admin Privileges Required</h1>
          
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
            You are logged in as <span className="font-semibold text-white underline decoration-slate-600">{currentUser?.email || "User"}</span>, but this account does not possess administrator permissions.
          </p>

          <div className="p-4 rounded-2xl bg-[#1f2937]/60 border border-gray-800 text-left mb-6">
            <p className="text-xs text-slate-300">
              Only authorized staff and verified administrator accounts can access the D1 Store control dashboard.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-[#0071e3]/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Log in with Admin Account</span>
            </button>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs sm:text-sm font-bold transition-all border border-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized State -> Render Admin Console
  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#121212] flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-gray-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-gray-800 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#0071e3] flex items-center justify-center font-black text-white text-xs">
            D1
          </div>
          <div>
            <span className="font-black text-xs tracking-wider uppercase block">D1 Admin</span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {currentUser?.email?.split("@")[0]}
            </span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-50 w-72 bg-[#0d131f] text-white flex flex-col justify-between transition-transform duration-200 ease-in-out h-screen border-r border-gray-800/80 shadow-2xl lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 overflow-y-auto">
          {/* Logo / Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0071e3] to-blue-700 flex items-center justify-center font-black text-white text-base shadow-lg shadow-[#0071e3]/30">
                D1
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-black text-sm tracking-wide text-white">D1 STORE ADMIN</h1>
                </div>
                <p className="text-[10px] text-gray-400 font-medium">DJI Authorised Console</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Admin Account Card */}
          <div className="my-5 p-3 rounded-2xl bg-[#162032] border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#0071e3]/20 text-[#0071e3] border border-[#0071e3]/30 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.name?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {currentUser?.name || currentUser?.email?.split("@")[0]}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Super Admin
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 px-1">
            Management
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#0071e3] text-white shadow-lg shadow-[#0071e3]/25"
                      : "text-gray-300 hover:bg-gray-800/60 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Return to Storefront */}
        <div className="p-5 border-t border-gray-800/80 bg-[#0a0f19]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#162032] hover:bg-[#1e2b42] text-gray-200 text-xs font-semibold transition-all border border-gray-800"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>View Live Store</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </Link>
          <div className="mt-3 text-[10px] text-gray-500 text-center flex items-center justify-center gap-1.5">
            <UserCheck className="w-3 h-3 text-emerald-400" />
            <span>Admin Active: {currentUser?.email}</span>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Admin Content Body */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
