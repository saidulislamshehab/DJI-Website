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
  inTheBox?: { title: string; qty?: number; image?: string }[] | string[];
  compatibility?: string[];
  highlights?: string[];
  bundleInclusions?: {
    title: string;
    slug?: string;
    rrp?: number;
    qty?: number;
    image?: string;
    description?: string;
  }[];
  bundleMainProduct?: {
    title: string;
    slug?: string;
    rrp?: number;
    image?: string;
    description?: string;
  };
  faqs?: { question: string; answer: string; category?: string; group?: string }[];
  storyBlocks?: {
    title: string;
    subtitle?: string;
    description: string;
    image?: string;
    tag?: string;
  }[];
  variants?: {
    id?: string;
    name: string;
    slug?: string;
    price: number;
    originalPrice?: number;
    badge?: string;
    variantId?: string;
    sku?: string;
    inStock?: boolean;
    stockCount?: number;
    image?: string;
  }[];
  inTheBoxVariants?: Record<string, { title: string; qty?: number; image?: string }[]>;
  videoShowcases?: {
    id: string;
    title: string;
    videoUrl: string;
    description: string;
    subcards?: { title: string; description: string }[];
    modes?: string[];
  }[];
  rawSpecs?: { group: string; label: string; value: string }[];
  overviewBanner?: {
    title?: string;
    tagline?: string;
    description?: string;
    badge?: string;
    bgImage?: string;
    videoUrl?: string;
    features?: string[];
    stats?: { label: string; value: string; sublabel?: string }[];
  };
  featureCards?: {
    title: string;
    description: string;
    image: string;
    tag?: string;
  }[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
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
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IOrderItem {
  productId: string;
  name: string;
  slug: string;
  variantId?: string;
  variantName?: string;
  sku?: string;
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
  company?: string;
}

export interface IOrderBillingAddress {
  sameAsShipping: boolean;
  firstName?: string;
  lastName?: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface IOrderHistoryEvent {
  status: string;
  note: string;
  timestamp: string | Date;
}

export interface IOrder {
  _id?: string;
  orderNumber: string;
  invoiceNumber?: string;
  userId?: string | null;
  customer: IOrderCustomer;
  billingAddress?: IOrderBillingAddress;
  items: IOrderItem[];
  subtotal: number;
  discountCode?: string | null;
  discountAmount?: number;
  shippingFee: number;
  shippingMethod: string;
  tax: number;
  total: number;
  currency?: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending" | "Failed" | "Refunded";
  paymentDetails?: {
    transactionId?: string;
    paidAt?: string | Date;
    cardBrand?: string;
    cardLast4?: string;
  };
  fulfillmentStatus?: "Unfulfilled" | "Partial" | "Fulfilled";
  trackingNumber?: string | null;
  trackingCompany?: string | null;
  notes?: string;
  history?: IOrderHistoryEvent[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ICartItem {
  productId: string;
  name: string;
  slug: string;
  variantId?: string;
  variantName?: string;
  sku?: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

export interface ICart {
  _id?: string;
  userId?: string;
  sessionId?: string;
  items: ICartItem[];
  couponCode?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IInvoice {
  invoiceNumber: string;
  orderNumber: string;
  date: string | Date;
  customer: IOrderCustomer;
  billingAddress?: IOrderBillingAddress;
  items: IOrderItem[];
  subtotal: number;
  subtotalExGst: number;
  gstAmount: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  company: {
    name: string;
    tradingAs: string;
    abn: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
}

export interface IHomepageSpotlight {
  title: string;
  eyebrow?: string;
  price?: string;
  btnText?: string;
  btnHref?: string;
  img: string;
  video?: string | null;
}

export interface IHomepageSection {
  _id?: string;
  sectionKey: string;
  title: string;
  subtitle: string;
  productIds: string[];
  isEnabled: boolean;
  order: number;
  spotlight?: IHomepageSpotlight;
  featured?: IHomepageSpotlight;
  products?: IProduct[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
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
  publishedAt?: string | Date;
  updatedAt?: string | Date;
  category?: string;
  categoryGroup?: string;
  isCategoryListing?: boolean;
  dataTitle?: string;
}

export interface IStoreLocation {
  _id?: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  postcode: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  isFlagship?: boolean;
  lat?: number;
  lng?: number;
  image?: string;
}

export interface IArticle {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  author: string;
  publishedAt: string | Date;
  image?: string;
  category: string;
  readTime?: string;
  tags?: string[];
}

export interface IUserAddress {
  _id?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zip?: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface IUser {
  _id?: string;
  email: string;
  name?: string;
  role?: "customer" | "admin";
  isVerified?: boolean;
  marketingConsent?: boolean;
  addresses?: IUserAddress[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IReview {
  _id?: string;
  productId?: string;
  productSlug: string;
  userName: string;
  userEmail: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  status: "approved" | "pending" | "rejected";
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  percentages: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ISupportMessage {
  _id?: string;
  sender: "customer" | "agent";
  senderName: string;
  message: string;
  createdAt: string | Date;
}

export interface ISupportTicket {
  _id?: string;
  ticketNumber: string;
  name: string;
  email: string;
  subject?: string;
  status: "open" | "in-progress" | "resolved";
  priority?: "low" | "normal" | "high";
  messages: ISupportMessage[];
  userId?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

