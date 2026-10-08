export interface IProduct {
  _id?: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  categorySlug: string;
  subCategory?: string;
  collections?: string[];
  tags?: string[];
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
  isProfessional?: boolean;
  isEnterprise?: boolean;
  tier?: "product" | "bundle" | "accessory";
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategoryOption {
  _id?: string;
  name: string;
  slug: string;
  url: string;
  badge?: string;
  categoryName?: string;
  categorySlug?: string;
  subCategoryName?: string;
  subCategorySlug?: string;
}

export interface ISubCategory {
  _id?: string;
  name: string;
  slug: string;
  url?: string;
  thumbnail?: string;
  badge?: string;
  categoryName?: string;
  categorySlug?: string;
  options: ICategoryOption[];
  productCount?: number;
}

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  url?: string;
  description?: string;
  icon?: string;
  image?: string;
  subCategories?: (string | ISubCategory)[];
  productCount?: number;
  featuredOrder?: number;
}

export interface IOrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

export interface IOrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface IOrder {
  _id?: string;
  orderNumber: string;
  customer: IOrderCustomer;
  items: IOrderItem[];
  subtotal: number;
  shippingFee: number;
  shippingMethod: string;
  tax: number;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending" | "Failed";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHomepageSection {
  _id?: string;
  sectionKey: "new_arrivals" | "dji_drones" | "pro_drones" | "enterprise_agriculture";
  title: string;
  subtitle: string;
  productIds: string[];
  isEnabled: boolean;
  order: number;
  products?: IProduct[];
  createdAt?: string;
  updatedAt?: string;
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
  id: string;
  title: string;
  price: number;
  img: string;
  subtitle?: string;
  quantity?: number;
  slug?: string;
}

export interface ICollectionTab {
  title: string;
  handle?: string;
}

export interface ICollection {
  _id?: string;
  shopifyId?: number;
  title: string;
  handle: string;
  description?: string;
  tagline?: string;
  image?: string;
  heroBannerImage?: string;
  heroMobileImage?: string;
  breadcrumbs?: string[];
  tabs?: string[];
  subTabs?: ICollectionTab[];
  productsCount: number;
  sortOrder?: string;
  publishedAt?: string;
  updatedAt?: string;
  category?: string;
  categoryGroup?: string;
  isCategoryListing?: boolean;
  dataTitle?: string;
}
