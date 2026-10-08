"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fetchCollections } from "@/lib/api";
import { ICollection } from "@/types";
import localCollectionsData from "@/data/d1_collections.json";

// Filter chips matching https://www.d1store.com.au/collections
const CATEGORY_CHIPS = [
  { id: "all", label: "All" },
  { id: "products", label: "Products" },
  { id: "accessories", label: "Accessories" },
  { id: "enterprise", label: "Enterprise" },
  { id: "services", label: "Services" },
] as const;

export default function CollectionsPage() {
  // Pre-seed with local database export of isCategoryListing items for instant render & SSR
  const initialData = useMemo(() => {
    return (localCollectionsData as unknown as ICollection[])
      .filter((c) => c.isCategoryListing)
      .sort((a, b) => a.title.localeCompare(b.title));
  }, []);

  const [collections, setCollections] = useState<ICollection[]>(initialData);
  const [activeChip, setActiveChip] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch live collections directly from MongoDB database on mount
  useEffect(() => {
    let isMounted = true;
    async function loadDbCollections() {
      try {
        const response = await fetchCollections({
          isCategoryListing: true,
          sortBy: "title-asc",
          limit: 500,
        });

        if (isMounted && response.collections && response.collections.length > 0) {
          const sorted = [...response.collections].sort((a, b) =>
            a.title.localeCompare(b.title)
          );
          setCollections(sorted);
        }
      } catch (err) {
        console.warn("[Collections] Failed to fetch live collections from DB, using cached dataset:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDbCollections();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter collections by chip and search term
  const filteredCollections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return collections.filter((item) => {
      const cat = (item.category || item.categoryGroup || "products").toLowerCase();
      const matchFilter = activeChip === "all" || cat === activeChip;
      const title = (item.dataTitle || item.title || "").toLowerCase();
      const matchSearch = !q || title.includes(q);
      return matchFilter && matchSearch;
    });
  }, [collections, activeChip, searchQuery]);

  const totalCount = collections.length;
  const visibleCount = filteredCollections.length;

  return (
    <div className="min-h-screen bg-white text-[#121212] flex flex-col font-sans">
      <Header />

      <main id="MainContent" className="content-for-layout focus-none flex-grow" role="main" tabIndex={-1}>
        <div className="d1-lc">
          <div className="page-width d1-lc__inner mx-auto max-w-[1600px] px-4 sm:px-8 md:px-12">
            {/* Main Title */}
            <h1 className="title title--primary inline-richtext d1-lc__title">
              Shop All Categories
            </h1>

            {/* Toolbar: Search Bar + Category Chips */}
            <div className="d1-lc__toolbar">
              <div className="d1-lc__search">
                <span className="d1-lc__search-icon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    className="icon icon-search"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="6.25" />
                    <path d="m20 20-4.4-4.4" />
                  </svg>
                </span>
                <label className="visually-hidden" htmlFor="D1LcSearch">
                  Search categories
                </label>
                <input
                  id="D1LcSearch"
                  className="d1-lc__search-input"
                  type="search"
                  data-d1-lc-search
                  placeholder="Find a category…"
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="d1-lc__chips" role="group" aria-label="Filter categories">
                {CATEGORY_CHIPS.map((chip) => {
                  const isActive = activeChip === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      className={`d1-lc__chip ${isActive ? "is-active" : ""}`}
                      data-d1-lc-chip={chip.id}
                      aria-pressed={isActive}
                      onClick={() => setActiveChip(chip.id)}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Count Meta */}
            <p className="d1-lc__meta" data-d1-lc-meta>
              {activeChip === "all" && !searchQuery.trim()
                ? `${totalCount} categories`
                : `${visibleCount} of ${totalCount} categories`}
            </p>

            {/* Clean Simple Grid of Categories */}
            <ul
              className="grid grid-cols-2 md:grid-cols-4 gap-x-3 sm:gap-x-5 gap-y-5 sm:gap-y-7 list-none p-0 m-0"
              role="list"
            >
              {filteredCollections.map((item) => {
                const cat = (item.category || item.categoryGroup || "products").toLowerCase();
                return (
                  <li
                    key={item.handle || item._id}
                    className="w-full list-none"
                    data-title={(item.dataTitle || item.title).toLowerCase()}
                    data-category={cat}
                  >
                    <Link
                      href={`/collections/${item.handle}`}
                      className="d1-lc-card group"
                    >
                      {/* Simple Image Box: Rounded #f5f5f7 Background, Smooth Zoom */}
                      <div className="d1-lc-card__thumb">
                        <img
                          src={item.image || "/images/placeholder.png"}
                          alt={item.title}
                          loading="lazy"
                          className="d1-lc-card__img"
                          width={600}
                          height={600}
                        />
                      </div>

                      {/* Fixed Text: Title & Arrow in strictly fixed position */}
                      <div className="d1-lc-card__text">
                        <span className="d1-lc-card__title">{item.title}</span>
                        <svg
                          className="d1-lc-card__arrow"
                          fill="none"
                          viewBox="0 0 14 10"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M8.537.808a.5.5 0 0 1 .817-.162l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 1 1-.708-.708L11.793 5.5H1a.5.5 0 0 1 0-1h10.793L8.646 1.354a.5.5 0 0 1-.109-.546"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Empty Search Feedback */}
            <p
              className={`d1-lc__empty ${visibleCount === 0 ? "is-visible" : ""}`}
              data-d1-lc-empty
            >
              No categories match your search.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
