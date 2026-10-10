import React from "react";
import ProductDetailsEditor from "@/components/admin/ProductDetailsEditor";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Product Details Studio | D1 Store Admin",
};

export default async function AdminProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  return <ProductDetailsEditor mode="edit" initialSlugOrId={id} />;
}
