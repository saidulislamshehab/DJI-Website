import Link from "next/link";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { posts } from "./posts";

export default function NewsIndexPage() {
  return (
    <StorefrontShell>
      <section className="bg-[#f5f5f7] border-b border-[#e5e5ea]">
        <div className="page-width py-12">
          <h1 className="text-4xl font-black">Guides & news</h1>
          <p className="mt-3 text-[#6e6e73] max-w-2xl">
            Practical notes for flying, filming, and looking after DJI gear in Australia.
          </p>
        </div>
      </section>
      <section className="page-width py-12 grid md:grid-cols-3 gap-6">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blogs/news/${p.slug}`} className="rounded-2xl border border-[#e5e5ea] p-6 hover:border-[#0071e3] transition-colors">
            <p className="text-xs font-bold uppercase tracking-wide text-[#0071e3] mb-2">{p.tag}</p>
            <h2 className="font-bold text-lg mb-2">{p.title}</h2>
            <p className="text-sm text-[#6e6e73]">{p.excerpt}</p>
          </Link>
        ))}
      </section>
    </StorefrontShell>
  );
}
