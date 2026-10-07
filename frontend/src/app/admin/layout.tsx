"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products Catalog", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Customer Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Homepage Sections", href: "/admin/homepage-sections", icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#121212] flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#0071e3]" />
          <span className="font-bold text-sm tracking-wide">D1 Store Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-50 w-64 bg-gray-900 text-white flex flex-col justify-between transition-transform duration-200 ease-in-out h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 pb-6 border-b border-gray-800">
            <div className="w-8 h-8 rounded-lg bg-[#0071e3] flex items-center justify-center font-black text-white text-base">
              D1
            </div>
            <div>
              <h1 className="font-black text-sm tracking-wide">D1 STORE ADMIN</h1>
              <p className="text-[10px] text-gray-400">DJI Authorised Retail Store</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
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
                      ? "bg-[#0071e3] text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Return to Storefront */}
        <div className="p-6 border-t border-gray-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Store</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </Link>
          <div className="mt-4 text-[10px] text-gray-500 text-center">
            D1 Store Management System v2.0
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Main Admin Content Body */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
