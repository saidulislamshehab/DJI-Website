"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, RefreshCw, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { sendVerificationCodeApi, verifyCodeApi } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/account";

  // Single passwordless verification flow
  const [email, setEmail] = useState("");
  const [otpStep, setOtpStep] = useState<"email" | "code">("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If already logged in, redirect directly to account or redirectTarget
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("d1_token");
      const storedUser = localStorage.getItem("d1_user");
      if (storedToken && storedUser) {
        router.replace(redirectTarget);
      }
    } catch {}
  }, [router, redirectTarget]);

  // Cooldown countdown timer for resending OTP code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // 1. Send Verification Code to Email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendVerificationCodeApi(cleanEmail);
      if (res.success) {
        toast.success(`Verification code sent to ${cleanEmail}`);
        setOtpStep("code");
        setResendCooldown(60);
        setCode(["", "", "", "", "", ""]);
        setTimeout(() => {
          codeInputRefs.current[0]?.focus();
        }, 150);
      } else {
        toast.error(res.message || "Failed to send verification code");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Failed to send verification code. Please check your email address and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Resend Code
  const handleResendCode = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await sendVerificationCodeApi(cleanEmail);
      if (res.success) {
        toast.success("A fresh 6-digit code has been sent!");
        setResendCooldown(60);
        setCode(["", "", "", "", "", ""]);
        setTimeout(() => {
          codeInputRefs.current[0]?.focus();
        }, 150);
      } else {
        toast.error(res.message || "Failed to resend code");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Digit Input (handles typing and multi-digit paste)
  const handleDigitChange = (index: number, val: string) => {
    // Handle paste of full code
    if (val.length > 1) {
      const digits = val.replace(/[^0-9]/g, "").slice(0, 6).split("");
      const newCode = [...code];
      digits.forEach((d, i) => {
        if (index + i < 6) newCode[index + i] = d;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      codeInputRefs.current[nextIndex]?.focus();
      if (newCode.every((d) => d !== "")) {
        handleVerifyOtp(newCode.join(""));
      }
      return;
    }

    const cleanDigit = val.replace(/[^0-9]/g, "");
    const newCode = [...code];
    newCode[index] = cleanDigit;
    setCode(newCode);

    if (cleanDigit && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((d) => d !== "")) {
      handleVerifyOtp(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  // 4. Verify Code Submit
  const handleVerifyOtp = async (fullCode?: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const verificationCode = fullCode || code.join("");

    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await verifyCodeApi(email.trim().toLowerCase(), verificationCode);
      if (res.success && res.token && res.user) {
        localStorage.setItem("d1_token", res.token);
        localStorage.setItem("d1_user", JSON.stringify(res.user));

        toast.success(
          res.isNewUser
            ? "Account created & verified! Welcome to DJI D1 Store."
            : "Welcome back!"
        );
        const target = res.user.role === "admin" && redirectTarget === "/account" ? "/admin" : redirectTarget;
        router.push(target);
      } else {
        toast.error(res.message || "Invalid verification code");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid or expired verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col justify-between items-center px-4 font-sans selection:bg-[#0070e0] selection:text-white">
      {/* Top Header / Store Brand Link */}
      <header className="w-full max-w-[480px] pt-8 sm:pt-14 pb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[14px] text-[#86868b] hover:text-[#121212] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to store</span>
        </Link>
      </header>

      {/* Main Authentication Card */}
      <main className="w-full max-w-[440px] my-auto py-6">
        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#d2d2d7]/60">
          {/* Brand Logo */}
          <div className="flex justify-center mb-6">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <img
                src="//www.d1store.com.au/cdn/shop/files/DJIxD1STORE-ARS-PNG.png?v=1768876884&width=360"
                alt="DJI Authorised Retail Store"
                className="h-8 sm:h-9 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/dji-d1-logo.png";
                }}
              />
            </Link>
          </div>

          {/* STEP 1: EMAIL ENTRY */}
          {otpStep === "email" ? (
            <div>
              <h1
                style={{ fontSize: "24px", lineHeight: "1.25" }}
                className="font-bold text-[#121212] text-center tracking-tight"
              >
                Sign In or Register
              </h1>
              <p
                style={{ fontSize: "14px", lineHeight: "1.4" }}
                className="text-gray-500 text-center mt-2 mb-6"
              >
                Enter your email to receive a 6-digit verification code
              </p>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label
                    style={{ fontSize: "13px" }}
                    className="block font-medium text-[#121212] mb-1.5"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      autoFocus
                      className="w-full h-[46px] pl-10 pr-4 rounded-xl text-[15px] text-[#121212] placeholder:text-gray-400 bg-[#fbfbfd] border border-[#d2d2d7] focus:bg-white focus:border-[#0070e0] focus:ring-4 focus:ring-[#0070e0]/10 disabled:opacity-50 outline-none transition-all"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full h-[46px] mt-2 bg-[#0070e0] hover:bg-[#005bb8] active:bg-[#004ea3] text-white font-semibold text-[15px] rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending code...</span>
                    </div>
                  ) : (
                    <span>Send Verification Code</span>
                  )}
                </button>
              </form>

              <div className="text-center mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <p style={{ fontSize: "12.5px" }} className="leading-relaxed">
                  Fast &amp; passwordless. Your account will be created upon code verification.
                </p>
              </div>
            </div>
          ) : (
            /* STEP 2: 6-DIGIT CODE VERIFICATION */
            <div>
              <button
                type="button"
                onClick={() => {
                  setOtpStep("email");
                  setCode(["", "", "", "", "", ""]);
                }}
                className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-[#121212] mb-5 transition-colors cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change email</span>
              </button>

              <h1
                style={{ fontSize: "24px", lineHeight: "1.25" }}
                className="font-bold text-[#121212] tracking-tight text-center"
              >
                Enter verification code
              </h1>
              <p
                style={{ fontSize: "14px", lineHeight: "1.4" }}
                className="text-gray-500 mt-2 mb-6 text-center leading-relaxed"
              >
                We sent a 6-digit code to <strong className="text-[#121212] font-semibold">{email}</strong>
              </p>

              <form onSubmit={(e) => handleVerifyOtp(undefined, e)} className="space-y-6">
                <div className="flex items-center justify-between gap-2">
                  {code.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        codeInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={idx === 0 ? 6 : 1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      disabled={isVerifying}
                      className="w-[44px] h-[50px] sm:w-[48px] sm:h-[54px] text-center text-xl sm:text-2xl font-bold text-[#121212] bg-[#fbfbfd] border border-[#d2d2d7] rounded-xl focus:bg-white focus:border-[#0070e0] focus:ring-4 focus:ring-[#0070e0]/10 transition-all outline-none"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || code.some((d) => !d)}
                  className="w-full h-[46px] bg-[#0070e0] hover:bg-[#005bb8] active:bg-[#004ea3] text-white font-semibold text-[15px] rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <span>Verify &amp; Continue</span>
                  )}
                </button>

                <div className="text-center pt-1">
                  {resendCooldown > 0 ? (
                    <p style={{ fontSize: "13px" }} className="text-gray-500">
                      Resend code in <span className="font-semibold text-[#121212]">{resendCooldown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-[13px] font-semibold text-[#0070e0] hover:underline cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                      <span>Didn&apos;t get the code? Resend</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Pinned Bottom Footer Links */}
      <footer className="w-full text-center pb-6 pt-6">
        <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-[12px] text-[#0070e0]">
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
          <Link href="/pages/contact" className="hover:underline">
            Contact information
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#0070e0]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
