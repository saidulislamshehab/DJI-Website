import React from "react";
import ProductDetailsEditor from "@/components/admin/ProductDetailsEditor";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Product Details | D1 Store Admin",
};

export default async function AdminEditProductPage({ params }: EditPageProps) {
  const { id } = await params;
  return <ProductDetailsEditor mode="edit" initialSlugOrId={id} />;
}
