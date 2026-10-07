import React from "react";
import Header from "./Header";
import Footer from "@/components/footer/Footer";

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#121212] w-full max-w-full overflow-x-clip">
      <Header />
      <main className="flex-1 w-full max-w-full overflow-x-clip">{children}</main>
      <Footer />
    </div>
  );
}
