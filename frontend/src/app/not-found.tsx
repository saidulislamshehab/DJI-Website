import Link from "next/link";
import StorefrontShell from "@/components/layout/StorefrontShell";

export default function NotFound() {
  return (
    <StorefrontShell>
      <section className="page-width py-24 text-center">
        <p className="text-sm font-bold text-[#0071e3] mb-2">404</p>
        <h1 className="text-4xl font-black mb-3">This page flew out of range.</h1>
        <p className="text-[#6e6e73] mb-8">The URL does not match a product, collection, or page on this store.</p>
        <Link href="/" className="inline-flex px-8 h-12 items-center rounded-full bg-[#0071e3] text-white font-semibold text-sm">
          Return home
        </Link>
      </section>
    </StorefrontShell>
  );
}
