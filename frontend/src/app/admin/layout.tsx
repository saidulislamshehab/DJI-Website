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
  ArrowLeft,
  Lock,
  Store,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
} from "lucide-react";
import { fetchAuthMeApi } from "@/lib/api";
import { IUser } from "@/types";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [authState, setAuthState] = useState<"checking" | "authorized" | "unauthorized" | "unauthenticated">("checking");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [sidebarOpen]);

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
      } catch {
        if (!isMounted) return;
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
    { label: "Site Links & Media", href: "/admin/links", icon: Globe },
  ];

  // 1. Loading / Verification State
  if (authState === "checking") {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white px-4">
        <div className="relative flex items-center justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#0071e3]/20 flex items-center justify-center animate-pulse">
            <ShieldCheck className="w-7 h-7 text-[#0071e3]" />
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-[#0071e3] border-t-transparent animate-spin" />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-white mb-1.5">Verifying Admin Credentials</h2>
        <p className="text-xs text-slate-400 text-center max-w-sm">
          Securing access to D1 Store administration platform...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State (redirecting)
  if (authState === "unauthenticated") {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white px-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-amber-500" />
        </div>
        <h2 className="text-lg font-bold text-white mb-1.5">Sign-In Required</h2>
        <p className="text-xs text-slate-400 mb-5 text-center">
          Redirecting to authentication portal...
        </p>
        <Link
          href="/login?redirect=/admin"
          className="px-4 py-2 rounded-lg bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs font-semibold transition-all shadow-xs"
        >
          Proceed to Login
        </Link>
      </div>
    );
  }

  // 3. Unauthorized State (Logged in, but role !== 'admin')
  if (authState === "unauthorized") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-7 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />
          
          <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7 text-red-500" />
          </div>

          <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider mb-2.5">
            403 Forbidden Access
          </span>

          <h1 className="text-xl font-bold text-white mb-2">Admin Privileges Required</h1>
          
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
            You are logged in as <span className="font-semibold text-white underline decoration-slate-600">{currentUser?.email || "User"}</span>, but this account does not possess administrator permissions.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-left mb-6">
            <p className="text-xs text-slate-300">
              Only authorized staff and verified administrator accounts can access the D1 Store control dashboard.
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log in with Admin Account</span>
            </button>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Current section title for top bar breadcrumb/title
  const currentNav = navItems.find((item) =>
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(item.href)
  ) || { label: "Admin Console", href: "/admin" };

  return (
    <div className="admin-console min-h-screen bg-[#F5F6F8] text-slate-900 flex flex-col lg:flex-row antialiased">
      {/* Mobile Top App Bar */}
      <div className="lg:hidden bg-white text-slate-900 px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Link href="/admin" className="flex items-center shrink-0">
            <img
              src="/dji-d1-logo.png"
              alt="DJI Authorised Retail Store - D1 Store"
              className="h-6 w-auto object-contain"
              width={160}
              height={24}
            />
          </Link>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-[#0070e0] border border-blue-200/60">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="View Store"
          >
            <Store className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop & Tablet Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-50 bg-white text-slate-900 flex flex-col justify-between transition-all duration-200 ease-in-out h-screen border-r border-slate-200/90 shadow-lg lg:shadow-none ${
          sidebarCollapsed ? "lg:w-20" : "lg:w-64"
        } w-64 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
            {sidebarCollapsed ? (
              <Link href="/admin" className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs shadow-xs mx-auto" title="D1 Store Admin">
                DJI
              </Link>
            ) : (
              <div className="flex items-center gap-2.5 min-w-0">
                <Link href="/admin" className="flex items-center shrink-0">
                  <img
                    src="/dji-d1-logo.png"
                    alt="DJI Authorised Retail Store - D1 Store"
                    className="h-7 w-auto object-contain"
                    width={180}
                    height={28}
                  />
                </Link>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-[#0070e0] border border-blue-200/60 shrink-0">
                  Admin
                </span>
              </div>
            )}

            {/* Collapse toggle (Desktop) / Close button (Mobile) */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Links (Scrollable area) */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            <div>
              {!sidebarCollapsed && (
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                  Management
                </div>
              )}
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
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-[13px] font-medium transition-all ${
                        isActive
                          ? "bg-[#0070e0] text-white shadow-xs font-semibold"
                          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                      } ${sidebarCollapsed ? "justify-center px-2" : ""}`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                      {!sidebarCollapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}
                      {!sidebarCollapsed && isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div>
              {!sidebarCollapsed && (
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                  Quick Links
                </div>
              )}
              <div className="space-y-1">
                <Link
                  href="/"
                  target="_blank"
                  title={sidebarCollapsed ? "View Live Store" : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-colors ${
                    sidebarCollapsed ? "justify-center px-2" : ""
                  }`}
                >
                  <Store className="w-4 h-4 text-slate-400 shrink-0" />
                  {!sidebarCollapsed && <span className="flex-1 truncate">View Live Store</span>}
                  {!sidebarCollapsed && <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                </Link>
              </div>
            </div>
          </div>

          {/* User Account / Footer */}
          <div className="p-3.5 border-t border-slate-100 bg-slate-50/80 shrink-0">
            <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"} gap-2`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0070e0] border border-blue-200/60 flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser?.name?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || "A"}
                </div>
                {!sidebarCollapsed && (
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {currentUser?.name || currentUser?.email?.split("@")[0]}
                    </p>
                    <span className="text-[11px] font-medium text-emerald-600 block truncate">
                      Administrator
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Admin Content Body */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Desktop Context Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/admin" className="hover:text-slate-900 font-medium transition-colors">
              Admin
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">{currentNav.label}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-slate-500" />
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium truncate max-w-[180px]">{currentUser?.email}</span>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
