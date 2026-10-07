"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newsletterChecked, setNewsletterChecked] = useState(true);
  const [step, setStep] = useState<"email" | "password">("email");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinueWithShop = () => {
    setIsLoading(true);
    toast.info("Connecting to Shop Pay...");
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Signed in with Shop Pay!");
      try {
        localStorage.setItem("d1_user", JSON.stringify({ email: "user@shop.app", name: "Shop User" }));
      } catch (e) {}
      router.push("/");
    }, 1200);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setStep("password");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Welcome back, ${email}!`);
      try {
        localStorage.setItem("d1_user", JSON.stringify({ email, name: email.split("@")[0] }));
      } catch (e) {}
      router.push("/");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between items-center px-4 py-8 sm:py-12 selection:bg-[#0070e0] selection:text-white">
      {/* Top Header with Centered Official Logo */}
      <header className="w-full flex justify-center pt-4 sm:pt-8">
        <Link href="/" className="inline-block transition-opacity hover:opacity-85" aria-label="Home">
          <img
            src="//www.d1store.com.au/cdn/shop/files/DJIxD1STORE-ARS-PNG.png?v=1768876884&width=360"
            alt="DJI Authorised Retail Store - D1 Store"
            className="h-[26px] sm:h-[30px] w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/dji-d1-logo.png";
            }}
          />
        </Link>
      </header>

      {/* Main Centered Sign In Form Box */}
      <main className="w-full max-w-[370px] sm:max-w-[390px] mx-auto my-auto py-8">
        {step === "email" ? (
          <div>
            {/* Title & Subtitle */}
            <h1 className="text-[26px] font-bold text-[#111827] tracking-tight text-left">
              Sign in
            </h1>
            <p className="text-[14px] text-[#6b7280] text-left mt-1 mb-6">
              Sign in or create an account
            </p>

            {/* Shop Pay Button */}
            <button
              type="button"
              onClick={handleContinueWithShop}
              disabled={isLoading}
              className="w-full h-[48px] bg-[#5a31f4] hover:bg-[#4d27dc] active:bg-[#431fc5] text-white font-medium text-[15px] rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-xs disabled:opacity-75"
            >
              Continue with shop
            </button>

            {/* "or" Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e5e7eb]" />
              </div>
              <span className="relative bg-white px-3 text-[12px] text-[#9ca3af] lowercase">
                or
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {/* Single Input Box with Embedded Submit Arrow */}
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[48px] pl-4 pr-12 rounded-xl text-[15px] text-[#111827] placeholder:text-[#9ca3af] bg-white transition border border-gray-300 focus:border-[#5a31f4] focus:ring-1 focus:ring-[#5a31f4]"
                  style={{
                    border: "1px solid #d1d5db",
                    outline: "none",
                    boxShadow: "none",
                  }}
                  autoFocus
                />
                <button
                  type="submit"
                  aria-label="Continue with email"
                  className="absolute right-2 w-8 h-8 rounded-lg flex items-center justify-center text-[#111827] hover:bg-gray-100 transition cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>

              {/* Newsletter / Deals Checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={newsletterChecked}
                  onChange={(e) => setNewsletterChecked(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-[18px] h-[18px] rounded-full border border-gray-300 peer-checked:bg-[#0070e0] peer-checked:border-[#0070e0] flex items-center justify-center transition-colors shrink-0">
                  {newsletterChecked && (
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  )}
                </div>
                <span className="text-[13px] text-[#111827]">
                  Email me with news and offers
                </span>
              </label>

              {/* Terms of Service Disclaimer */}
              <p className="text-[11px] text-[#6b7280] text-center pt-2 leading-relaxed">
                By continuing, you agree to our{" "}
                <Link
                  href="/policies/terms-of-service"
                  className="underline text-[#4b5563] hover:text-[#111827]"
                >
                  Terms of service
                </Link>
              </p>
            </form>
          </div>
        ) : (
          /* Step 2: Password / Verification */
          <div>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-black mb-4 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <h1 className="text-[26px] font-bold text-[#111827] tracking-tight text-left">
              Enter your password
            </h1>
            <p className="text-[14px] text-[#6b7280] text-left mt-1 mb-6">
              Signing in as <strong className="text-[#111827]">{email}</strong>
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[48px] px-4 rounded-xl text-[15px] text-[#111827] placeholder:text-[#9ca3af] bg-white transition border border-gray-300 focus:border-[#5a31f4] focus:ring-1 focus:ring-[#5a31f4]"
                style={{
                  border: "1px solid #d1d5db",
                  outline: "none",
                  boxShadow: "none",
                }}
                autoFocus
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[48px] bg-[#0070e0] hover:bg-[#005bb5] text-white font-semibold text-[15px] rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-xs disabled:opacity-75"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => toast.info(`A password reset link was sent to ${email}`)}
                  className="text-[13px] text-[#0070e0] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Pinned Bottom Footer */}
      <footer className="w-full text-center pb-6 pt-8">
        <Link
          href="/policies/privacy-policy"
          className="text-[12px] text-[#0070e0] hover:underline transition-colors font-normal"
        >
          Privacy policy
        </Link>
      </footer>
    </div>
  );
}
