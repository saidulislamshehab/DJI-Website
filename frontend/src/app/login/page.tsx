"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, RefreshCw, Lock, Mail, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { sendVerificationCodeApi, verifyCodeApi, loginApi, registerApi } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/account";

  // Tab mode: 'login' | 'register' | 'otp'
  const [authMode, setAuthMode] = useState<"login" | "register" | "otp">("login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP states
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [otpStep, setOtpStep] = useState<"email" | "code">("email");
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

  // 1. Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginApi(cleanEmail, password);
      if (res.success && res.token) {
        localStorage.setItem("d1_token", res.token);
        localStorage.setItem("d1_user", JSON.stringify(res.user));
        toast.success(res.message || "Welcome back!");

        const target = res.user.role === "admin" && redirectTarget === "/account" ? "/admin" : redirectTarget;
        router.push(target);
      } else {
        toast.error(res.message || "Failed to sign in");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Register Account
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerApi(cleanEmail, password, name.trim());
      if (res.success && res.token) {
        localStorage.setItem("d1_token", res.token);
        localStorage.setItem("d1_user", JSON.stringify(res.user));
        toast.success(res.message || "Account created successfully!");
        router.push(redirectTarget);
      } else {
        toast.error(res.message || "Failed to create account");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. OTP: Send Verification Code
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
          "Failed to send verification code. Please check your email or use password login."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 4. OTP: Resend Code
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

  // 5. OTP: Handle Digit Input
  const handleDigitChange = (index: number, val: string) => {
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

  // 6. OTP: Verify Code Submit
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
      if (res.success && res.token) {
        localStorage.setItem("d1_token", res.token);
        localStorage.setItem("d1_user", JSON.stringify(res.user));

        toast.success(
          res.isNewUser
            ? "Account created & verified! Welcome."
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
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col justify-between items-center px-4 font-sans selection:bg-[#0071e3] selection:text-white">
      {/* Top Header / Store Brand Link */}
      <header className="w-full max-w-[500px] pt-8 sm:pt-14 pb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[14px] text-[#86868b] hover:text-[#1d1d1f] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to store</span>
        </Link>
      </header>

      {/* Main Authentication Card */}
      <main className="w-full max-w-[460px] my-auto py-6">
        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#d2d2d7]/50">
          {/* Brand Logo */}
          <div className="flex justify-center mb-6">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <img
                src="//www.d1store.com.au/cdn/shop/files/DJIxD1STORE-ARS-PNG.png?v=1768876884&width=360"
                alt="DJI Authorised Retail Store"
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/dji-d1-logo.png";
                }}
              />
            </Link>
          </div>

          {/* Navigation Tabs */}
          {otpStep !== "code" && (
            <div className="flex p-1 bg-[#f5f5f7] rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all cursor-pointer ${
                  authMode === "login"
                    ? "bg-white text-[#1d1d1f] shadow-xs"
                    : "text-[#86868b] hover:text-[#1d1d1f]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all cursor-pointer ${
                  authMode === "register"
                    ? "bg-white text-[#1d1d1f] shadow-xs"
                    : "text-[#86868b] hover:text-[#1d1d1f]"
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("otp")}
                className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all cursor-pointer ${
                  authMode === "otp"
                    ? "bg-white text-[#1d1d1f] shadow-xs"
                    : "text-[#86868b] hover:text-[#1d1d1f]"
                }`}
              >
                Email Code
              </button>
            </div>
          )}

          {/* MODE 1: PASSWORD SIGN IN */}
          {authMode === "login" && (
            <div>
              <h1 className="text-[24px] font-bold text-[#1d1d1f] text-center tracking-tight">
                Sign in with Password
              </h1>
              <p className="text-[14px] text-[#86868b] text-center mt-1.5 mb-6">
                Enter your account credentials to continue
              </p>

              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
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
                      className="w-full h-[46px] pl-10 pr-4 rounded-xl text-[15px] text-[#1d1d1f] placeholder:text-[#a1a1a6] bg-[#fbfbfd] border border-[#d2d2d7] focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 disabled:opacity-50 outline-none transition-all"
                    />
                    <Mail className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full h-[46px] pl-10 pr-11 rounded-xl text-[15px] text-[#1d1d1f] placeholder:text-[#a1a1a6] bg-[#fbfbfd] border border-[#d2d2d7] focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 disabled:opacity-50 outline-none transition-all"
                    />
                    <Lock className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full h-[46px] mt-2 bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] text-white font-medium text-[15px] rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>

              <div className="text-center mt-6 pt-4 border-t border-[#f5f5f7]">
                <p className="text-[13px] text-[#86868b]">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthMode("register")}
                    className="font-semibold text-[#0071e3] hover:underline cursor-pointer"
                  >
                    Create one
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* MODE 2: REGISTER ACCOUNT */}
          {authMode === "register" && (
            <div>
              <h1 className="text-[24px] font-bold text-[#1d1d1f] text-center tracking-tight">
                Create Your Account
              </h1>
              <p className="text-[14px] text-[#86868b] text-center mt-1.5 mb-6">
                Register to track orders and manage warranties
              </p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                    Full name (optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="w-full h-[46px] pl-10 pr-4 rounded-xl text-[15px] text-[#1d1d1f] placeholder:text-[#a1a1a6] bg-[#fbfbfd] border border-[#d2d2d7] focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 disabled:opacity-50 outline-none transition-all"
                    />
                    <UserIcon className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
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
                      className="w-full h-[46px] pl-10 pr-4 rounded-xl text-[15px] text-[#1d1d1f] placeholder:text-[#a1a1a6] bg-[#fbfbfd] border border-[#d2d2d7] focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 disabled:opacity-50 outline-none transition-all"
                    />
                    <Mail className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                    Password (min. 6 characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full h-[46px] pl-10 pr-11 rounded-xl text-[15px] text-[#1d1d1f] placeholder:text-[#a1a1a6] bg-[#fbfbfd] border border-[#d2d2d7] focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 disabled:opacity-50 outline-none transition-all"
                    />
                    <Lock className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full h-[46px] mt-2 bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] text-white font-medium text-[15px] rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </form>

              <div className="text-center mt-6 pt-4 border-t border-[#f5f5f7]">
                <p className="text-[13px] text-[#86868b]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthMode("login")}
                    className="font-semibold text-[#0071e3] hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* MODE 3: EMAIL OTP CODE */}
          {authMode === "otp" && (
            <div>
              {otpStep === "email" ? (
                <div>
                  <h1 className="text-[24px] font-bold text-[#1d1d1f] text-center tracking-tight">
                    Sign in with Email Code
                  </h1>
                  <p className="text-[14px] text-[#86868b] text-center mt-1.5 mb-6">
                    Enter your email to receive a 6-digit login code
                  </p>

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
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
                          className="w-full h-[46px] pl-10 pr-4 rounded-xl text-[15px] text-[#1d1d1f] placeholder:text-[#a1a1a6] bg-[#fbfbfd] border border-[#d2d2d7] focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 disabled:opacity-50 outline-none transition-all"
                        />
                        <Mail className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full h-[46px] mt-2 bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] text-white font-medium text-[15px] rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Sending code...</span>
                        </div>
                      ) : (
                        <span>Send Login Code</span>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => setOtpStep("email")}
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
                          className="w-[46px] h-[52px] sm:w-[50px] sm:h-[56px] text-center text-2xl font-semibold text-[#1d1d1f] bg-[#fbfbfd] border border-[#d2d2d7] rounded-xl focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none"
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifying || code.some((d) => !d)}
                      className="w-full h-[46px] bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] text-white font-medium text-[15px] rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
                    >
                      {isVerifying ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        <span>Verify & Sign In</span>
                      )}
                    </button>

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
          <Loader2 className="w-6 h-6 animate-spin text-[#0071e3]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
