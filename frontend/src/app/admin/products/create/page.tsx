import React from "react";
import ProductDetailsEditor from "@/components/admin/ProductDetailsEditor";

export const metadata = {
  title: "Create Product | D1 Store Admin",
  description: "Create and publish a new DJI product or accessory in the catalog.",
};

export default function AdminCreateProductPage() {
  return <ProductDetailsEditor mode="create" />;
}
