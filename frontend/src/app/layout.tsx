import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { SupportWidget } from "@/components/support/SupportWidget";
import BackendKeepAlive from "@/components/layout/BackendKeepAlive";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "D1 Store | Australia's Home of DJI",
  description:
    "D1 Store was founded with a single vision: to bring world-class drone and camera technology to Australian shores with unmatched local expertise and support. Today, we operate a nationwide network of physical retail stores, an enterprise consultancy division, and Australia's leading DJI-certified repair infrastructure.",
  icons: {
    icon: "//www.d1store.com.au/cdn/shop/files/D1_Favicon.jpg?crop=center&height=32&v=1786691112&width=32",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white text-[#121212] font-sans antialiased">
        <CartProvider>
          <BackendKeepAlive />
          {children}
          <Toaster position="top-right" richColors />
          <SupportWidget />
        </CartProvider>
      </body>
    </html>
  );
}
