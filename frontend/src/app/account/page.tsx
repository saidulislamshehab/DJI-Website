"use client";

import React, { useState } from "react";
import Link from "next/link";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { toast } from "sonner";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success(mode === "login" ? "Signed in (demo)." : "Account created (demo).");
  }

  return (
    <StorefrontShell>
      <section className="page-width py-16 max-w-md mx-auto">
        <h1 className="text-3xl font-black mb-2">{mode === "login" ? "Log in" : "Create account"}</h1>
        <p className="text-sm text-[#6e6e73] mb-8">
          Track orders, save addresses, and reorder DJI gear. This demo stores nothing on a real identity provider.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "register" && (
            <input required placeholder="Full name" className="w-full h-12 px-4 rounded-xl border border-[#e5e5ea] bg-[#fbfbfd] outline-none focus:border-[#0071e3]" />
          )}
          <input required type="email" placeholder="Email" className="w-full h-12 px-4 rounded-xl border border-[#e5e5ea] bg-[#fbfbfd] outline-none focus:border-[#0071e3]" />
          <input required type="password" placeholder="Password" className="w-full h-12 px-4 rounded-xl border border-[#e5e5ea] bg-[#fbfbfd] outline-none focus:border-[#0071e3]" />
          <button type="submit" className="w-full h-12 rounded-full bg-[#121212] text-white font-semibold text-sm hover:bg-black">
            {mode === "login" ? "Sign in" : "Register"}
          </button>
        </form>
        <button
          type="button"
          className="mt-6 text-sm text-[#0071e3] font-medium"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Create an account" : "Already have an account? Log in"}
        </button>
        <p className="mt-8 text-xs text-[#8e8e93]">
          Need help with an order? <Link href="/pages/contact" className="underline">Contact us</Link>
        </p>
      </section>
    </StorefrontShell>
  );
}
