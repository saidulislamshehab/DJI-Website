"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { posts } from "../posts";

export default function NewsPostPage() {
  const params = useParams();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";
  const post = posts.find((p) => p.slug === slug);

  return (
    <StorefrontShell>
      <article className="page-width py-14 max-w-2xl">
        <Link href="/blogs/news" className="text-sm text-[#0071e3] font-medium">
          ← All guides
        </Link>
        {post ? (
          <>
            <p className="mt-6 text-xs font-bold uppercase tracking-wide text-[#0071e3]">{post.tag}</p>
            <h1 className="mt-2 text-4xl font-black">{post.title}</h1>
            {post.body.split("\n\n").map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 text-[#444] leading-relaxed">
                {p}
              </p>
            ))}
          </>
        ) : (
          <h1 className="mt-8 text-3xl font-black">Article not found</h1>
        )}
      </article>
    </StorefrontShell>
  );
}
