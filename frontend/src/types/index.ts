export interface IProduct {
  _id?: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  badge?: string;
  tagline?: string;
  description: string;
  features: string[];
  specs: Record<string, string | number>;
  images: string[];
  mainImage: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  productCount?: number;
}

export interface IApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
  selectedOption?: string;
}
