"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId") || searchParams.get("id");

  useEffect(() => {
    if (orderId) {
      router.replace(`/orders/${orderId}/confirmation`);
    }
  }, [orderId, router]);

  return (
    <div className="flex-1 page-width py-24 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin mb-4" />
      <h1 className="text-xl font-bold text-[#121212] mb-2">Redirecting to your order confirmation...</h1>
      <p className="text-sm text-gray-500 mb-4">Please wait while we locate your purchase details.</p>
      {orderId && (
        <Link
          href={`/orders/${orderId}/confirmation`}
          className="text-xs font-bold text-[#0071e3] hover:underline"
        >
          Click here if not redirected automatically
        </Link>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd]">
      <Header />
      <Suspense fallback={
        <div className="flex-1 page-width py-24 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 font-bold">Loading confirmation...</p>
        </div>
      }>
        <CheckoutSuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
