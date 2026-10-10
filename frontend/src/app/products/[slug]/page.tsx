import React from "react";
import { Metadata } from "next";
import { fetchProductBySlug, fetchProductReviewsApi } from "@/lib/api";
import ProductDetailClient from "@/components/product/ProductDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | D1 Store Australia",
      description: "The requested product is not available in our catalog.",
    };
  }

  const title = `${product.name} | DJI Authorised Retailer Australia - D1 Store`;
  const description =
    product.description ||
    `Shop the official ${product.name} with 100% Australian Warranty and local support at D1 Store.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.mainImage,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
      siteName: "D1 Store Australia",
      locale: "en_AU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.mainImage],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Server-side pre-fetching for instant SSR & SEO
  const [product, reviewsData] = await Promise.all([
    fetchProductBySlug(slug).catch(() => null),
    fetchProductReviewsApi(slug).catch(() => null),
  ]);

  const initialProduct = product || null;

  // JSON-LD structured data for Google Product Schema
  const jsonLd = initialProduct
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: initialProduct.name,
        image: initialProduct.images || [initialProduct.mainImage],
        description: initialProduct.description,
        sku: initialProduct.sku,
        brand: {
          "@type": "Brand",
          name: "DJI",
        },
        offers: {
          "@type": "Offer",
          url: `https://www.d1store.com.au/products/${initialProduct.slug}`,
          priceCurrency: "AUD",
          price: initialProduct.price,
          availability: initialProduct.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        },
        aggregateRating: initialProduct.reviewCount
          ? {
              "@type": "AggregateRating",
              ratingValue: initialProduct.rating || 4.9,
              reviewCount: initialProduct.reviewCount,
            }
          : undefined,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient
        slug={slug}
        initialProduct={initialProduct}
        initialReviews={reviewsData?.reviews || []}
        initialReviewSummary={reviewsData?.summary}
      />
    </>
  );
}
