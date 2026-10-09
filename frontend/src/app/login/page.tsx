"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { sendVerificationCodeApi, verifyCodeApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"email" | "code">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If already logged in, redirect directly to /account
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("d1_token");
      const storedUser = localStorage.getItem("d1_user");
      if (storedToken && storedUser) {
        router.replace("/account");
      }
    } catch {}
  }, [router]);

  // Cooldown countdown timer for resending OTP code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // STEP 1: Handle Send Verification Code
  const handleEmailSubmit = async (e?: React.FormEvent) => {
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
        setStep("code");
        setResendCooldown(60);
        setCode(["", "", "", "", "", ""]);
        setTimeout(() => {
          codeInputRefs.current[0]?.focus();
        }, 150);
      } else {
        toast.error(res.message || "Failed to send verification code");
      }
    } catch (err: any) {
      console.error("Send code error:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to send verification code. Please check your email and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Resend code to same email
  const handleResendCode = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await sendVerificationCodeApi(cleanEmail);
      if (res.success) {
        toast.success("A new verification code has been sent!");
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

  // STEP 2: Handle 6-Digit Code Inputs
  const handleDigitChange = (index: number, val: string) => {
    // If user pastes multiple digits
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
        handleVerifyCodeSubmit(newCode.join(""));
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
      handleVerifyCodeSubmit(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Verify Code Form Submit
  const handleVerifyCodeSubmit = async (fullCode?: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const verificationCode = fullCode || code.join("");

    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await verifyCodeApi(email.trim().toLowerCase(), verificationCode);
      if (res.success && res.token) {
        localStorage.setItem("d1_token", res.token);
        localStorage.setItem("d1_user", JSON.stringify(res.user));

        toast.success(
          res.isNewUser
            ? "Account created & verified! Welcome."
            : "Welcome back!"
        );
        router.push("/account");
      } else {
        toast.error(res.message || "Invalid verification code");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      toast.error(
        err.response?.data?.message ||
          "Invalid or expired verification code. Please request a new code."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex flex-col justify-between items-center px-4 py-8 sm:py-12 selection:bg-[#0071e3] selection:text-white font-sans">
      {/* Top Header with Centered Official Logo */}
      <header className="w-full flex justify-center pt-2 sm:pt-6">
        <Link href="/" className="inline-block transition-opacity hover:opacity-85" aria-label="Home">
          <img
            src="//www.d1store.com.au/cdn/shop/files/DJIxD1STORE-ARS-PNG.png?v=1768876884&width=360"
            alt="DJI Authorised Retail Store - D1 Store"
            className="h-[28px] sm:h-[32px] w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/dji-d1-logo.png";
            }}
          />
        </Link>
      </header>

      {/* Main Centered Sign-In Box */}
      <main className="w-full max-w-[400px] mx-auto my-auto py-6">
        <div className="bg-white border border-[#e5e5ea] rounded-2xl p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          {step === "email" ? (
            /* STEP 1: ENTER EMAIL */
            <div>
              <h1 className="text-[26px] font-bold text-[#1d1d1f] tracking-tight text-center">
                Sign in
              </h1>
              <p className="text-[14px] text-[#86868b] text-center mt-1.5 mb-8">
                Enter your email to receive a verification code
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#1d1d1f] mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full h-[48px] px-4 rounded-xl text-[15px] text-[#1d1d1f] placeholder:text-[#a1a1a6] bg-[#fbfbfd] transition-all border border-[#d2d2d7] focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 disabled:opacity-50 outline-none"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full h-[48px] bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] text-white font-medium text-[15px] rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending code...</span>
                    </div>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* STEP 2: ENTER VERIFICATION CODE */
            <div>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="inline-flex items-center gap-1.5 text-[13px] text-[#86868b] hover:text-[#1d1d1f] mb-5 transition-colors cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change email</span>
              </button>

              <h1 className="text-[24px] font-bold text-[#1d1d1f] tracking-tight">
                Enter verification code
              </h1>
              <p className="text-[14px] text-[#86868b] mt-1.5 mb-7 leading-relaxed">
                We sent a 6-digit code to <strong className="text-[#1d1d1f] font-semibold">{email}</strong>
              </p>

              <form onSubmit={(e) => handleVerifyCodeSubmit(undefined, e)} className="space-y-6">
                {/* 6 Individual Code Digit Boxes */}
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
                      className="w-[48px] h-[54px] sm:w-[50px] sm:h-[58px] text-center text-2xl font-semibold text-[#1d1d1f] bg-[#fbfbfd] border border-[#d2d2d7] rounded-xl focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                {/* Submit / Verify Button */}
                <button
                  type="submit"
                  disabled={isVerifying || code.some((d) => !d)}
                  className="w-full h-[48px] bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] text-white font-medium text-[15px] rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>

                {/* Resend Code Section */}
                <div className="text-center pt-1">
                  {resendCooldown > 0 ? (
                    <p className="text-[13px] text-[#86868b]">
                      Resend code in <span className="font-semibold text-[#1d1d1f]">{resendCooldown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0071e3] hover:underline cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                      <span>Resend code</span>
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
