import React from "react";
import Header from "./Header";
import Footer from "@/components/footer/Footer";

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#121212]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
