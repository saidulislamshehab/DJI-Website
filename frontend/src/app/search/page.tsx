"use client";

import React, { useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { searchStaticCatalog } from "@/lib/catalog";

function SearchInner() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") || "";
  const results = useMemo(() => searchStaticCatalog(q), [q]);

  return (
    <section className="page-width py-10">
      <h1 className="text-3xl font-black mb-6">Search</h1>
      <form
        className="mb-8"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          router.push(`/search?q=${encodeURIComponent(String(fd.get("q") || ""))}`);
        }}
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products, brands & more"
          className="w-full max-w-xl h-12 px-5 rounded-full bg-[#f2f2f4] outline-none border-none border-0 ring-0 focus:ring-2 focus:ring-[#0071e3] shadow-none appearance-none"
          style={{ border: "none", outline: "none", boxShadow: "none" }}
        />
      </form>
      <p className="text-sm text-[#6e6e73] mb-6">
        {q ? `${results.length} results for “${q}”` : "Try Mini 5 Pro, Pocket 4P, or Hasselblad."}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="rounded-2xl border border-[#e5e5ea] p-4 hover:shadow-md transition-shadow">
            <div className="aspect-square bg-[#f5f5f7] rounded-xl mb-3 p-3">
              {p.mainImage && <img src={p.mainImage} alt="" className="w-full h-full object-contain" />}
            </div>
            <h2 className="text-sm font-bold line-clamp-2">{p.name}</h2>
            {p.price > 0 && (
              <p className="text-sm font-extrabold mt-1">From ${p.price.toLocaleString()}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function SearchPage() {
  return (
    <StorefrontShell>
      <Suspense fallback={<div className="page-width py-20 text-sm text-gray-500">Loading search…</div>}>
        <SearchInner />
      </Suspense>
    </StorefrontShell>
  );
}
