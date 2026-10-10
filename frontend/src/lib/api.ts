import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { IProduct, ICategory, ISubCategory, ICategoryOption, IOrder, IHomepageSection, IApiResponse, ICollection, IUser, IReview, IReviewSummary, ISupportTicket, ISupportMessage } from "@/types";

const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl) return "http://localhost:5000/api";
  const clean = envUrl.trim().replace(/\/+$/, "");
  return clean.endsWith("/api") ? clean : `${clean}/api`;
};

const API_BASE_URL = getBaseUrl();

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90s timeout to tolerate cloud cold starts
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("d1_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor with automatic cold-start retry
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const config = error.config as any;
    const isNetworkOrTimeout =
      error.code === "ECONNABORTED" ||
      error.message === "Network Error" ||
      !error.response;

    // Retry up to 2 times for GET requests on cold starts
    if (config && isNetworkOrTimeout && (!config.retryCount || config.retryCount < 2) && config.method?.toLowerCase() === "get") {
      config.retryCount = (config.retryCount || 0) + 1;
      console.warn(`[Cold-Start Retry ${config.retryCount}/2] Waking up cloud backend for ${config.url}...`);
      await new Promise((r) => setTimeout(r, 2500));
      return apiClient(config);
    }

    const status = error.response?.status;
    const errorMsg =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "An unexpected error occurred.";
    if (error.message === "Network Error") {
      console.warn(`[API Notice] Backend server unreachable at ${API_BASE_URL} for [${error.config?.method?.toUpperCase()}] ${error.config?.url}. Using fallback data.`);
    } else if (status !== 404) {
      console.error(`[API Error] [${error.config?.method?.toUpperCase()}] ${error.config?.url}:`, errorMsg);
    }
    return Promise.reject(error);
  }
);

// Background warm-up trigger for cloud backends
export const warmUpBackend = (): void => {
  if (typeof window === "undefined") return;
  try {
    const healthUrl = `${API_BASE_URL.replace(/\/api\/?$/, "")}/health`;
    fetch(healthUrl, { method: "GET", mode: "cors", cache: "no-store" }).catch(() => {});
  } catch {}
};

// --- PRODUCTS API ---
export const fetchProducts = async (params?: {
  category?: string;
  subCategory?: string;
  collection?: string;
  tag?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isProfessional?: boolean;
  isEnterprise?: boolean;
  tier?: string;
  inStock?: boolean;
  lowStock?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: IProduct[]; total: number; totalPages: number }> => {
  try {
    const res = await apiClient.get<IApiResponse<IProduct[]>>("/products", { params });
    return {
      products: res.data.data || [],
      total: res.data.pagination?.total || 0,
      totalPages: res.data.pagination?.totalPages || 1,
    };
  } catch {
    return { products: [], total: 0, totalPages: 1 };
  }
};

export interface IProductStats {
  total: number;
  standard: number;
  bundles: number;
  accessories: number;
  newArrivals: number;
  lowStock: number;
}

export const fetchProductStatsApi = async (): Promise<IProductStats> => {
  try {
    const res = await apiClient.get<IApiResponse<IProductStats>>("/products/stats");
    return res.data.data || { total: 0, standard: 0, bundles: 0, accessories: 0, newArrivals: 0, lowStock: 0 };
  } catch {
    return { total: 0, standard: 0, bundles: 0, accessories: 0, newArrivals: 0, lowStock: 0 };
  }
};

export const fetchProductBySlug = async (slug: string): Promise<IProduct | null> => {
  try {
    const res = await apiClient.get<IApiResponse<IProduct>>(`/products/${slug}`);
    return res.data.data || null;
  } catch {
    return null;
  }
};

export const createProductApi = async (data: Partial<IProduct>): Promise<IProduct | null> => {
  const res = await apiClient.post<IApiResponse<IProduct>>("/products", data);
  return res.data.data || null;
};

export const updateProductApi = async (id: string, data: Partial<IProduct>): Promise<IProduct | null> => {
  const res = await apiClient.put<IApiResponse<IProduct>>(`/products/${id}`, data);
  return res.data.data || null;
};

export const updateProductStockApi = async (
  id: string,
  payload: { stockCount?: number; delta?: number; inStock?: boolean }
): Promise<IProduct | null> => {
  const res = await apiClient.patch<IApiResponse<IProduct>>(`/products/${id}/stock`, payload);
  return res.data.data || null;
};

export const deleteProductApi = async (id: string): Promise<boolean> => {
  const res = await apiClient.delete<IApiResponse<{ id: string }>>(`/products/${id}`);
  return res.data.success;
};

// --- CATEGORIES API ---
export const fetchCategories = async (): Promise<ICategory[]> => {
  try {
    const res = await apiClient.get<IApiResponse<ICategory[]>>("/categories");
    return res.data.data || [];
  } catch {
    return [];
  }
};

export const fetchCategoryBySlug = async (slug: string): Promise<ICategory | null> => {
  try {
    const res = await apiClient.get<IApiResponse<ICategory>>(`/categories/${slug}`);
    return res.data.data || null;
  } catch {
    return null;
  }
};

export const fetchSubCategories = async (categorySlug?: string): Promise<ISubCategory[]> => {
  try {
    const params = categorySlug ? { category: categorySlug } : {};
    const res = await apiClient.get<IApiResponse<ISubCategory[]>>("/categories/subcategories", { params });
    return res.data.data || [];
  } catch {
    return [];
  }
};

export const fetchSubCategoryBySlug = async (slug: string): Promise<ISubCategory | null> => {
  try {
    const res = await apiClient.get<IApiResponse<ISubCategory>>(`/categories/subcategories/${slug}`);
    return res.data.data || null;
  } catch {
    return null;
  }
};

export const fetchCategoryOptions = async (params?: {
  category?: string;
  subcategory?: string;
}): Promise<ICategoryOption[]> => {
  try {
    const res = await apiClient.get<IApiResponse<ICategoryOption[]>>("/categories/options", { params });
    return res.data.data || [];
  } catch {
    return [];
  }
};

export const createCategoryApi = async (data: Partial<ICategory>): Promise<ICategory | null> => {
  const res = await apiClient.post<IApiResponse<ICategory>>("/categories", data);
  return res.data.data || null;
};

export const updateCategoryApi = async (id: string, data: Partial<ICategory>): Promise<ICategory | null> => {
  const res = await apiClient.put<IApiResponse<ICategory>>(`/categories/${id}`, data);
  return res.data.data || null;
};

export const deleteCategoryApi = async (id: string): Promise<boolean> => {
  const res = await apiClient.delete<IApiResponse<{ id: string }>>(`/categories/${id}`);
  return res.data.success;
};

// --- HOMEPAGE SECTIONS API ---
export const fetchHomepageSections = async (): Promise<IHomepageSection[]> => {
  try {
    const res = await apiClient.get<IApiResponse<IHomepageSection[]>>("/homepage-sections");
    return res.data.data || [];
  } catch {
    return [];
  }
};

export const fetchHomepageSectionByKey = async (key: string): Promise<IHomepageSection | null> => {
  try {
    const res = await apiClient.get<IApiResponse<IHomepageSection>>(`/homepage-sections/${key}`);
    return res.data.data || null;
  } catch {
    return null;
  }
};

export const createHomepageSectionApi = async (
  data: Partial<IHomepageSection>
): Promise<IHomepageSection | null> => {
  const res = await apiClient.post<IApiResponse<IHomepageSection>>("/homepage-sections", data);
  return res.data.data || null;
};

export const updateHomepageSectionApi = async (
  key: string,
  data: Partial<IHomepageSection>
): Promise<IHomepageSection | null> => {
  const res = await apiClient.put<IApiResponse<IHomepageSection>>(`/homepage-sections/${key}`, data);
  return res.data.data || null;
};

export const deleteHomepageSectionApi = async (key: string): Promise<boolean> => {
  const res = await apiClient.delete<IApiResponse<{ deletedKey: string }>>(`/homepage-sections/${key}`);
  return res.data.success;
};

export const reorderHomepageSectionsApi = async (
  orders: { sectionKey: string; order: number }[]
): Promise<IHomepageSection[] | null> => {
  const res = await apiClient.put<IApiResponse<IHomepageSection[]>>("/homepage-sections/reorder", { orders });
  return res.data.data || null;
};

// --- ORDERS API ---
export const fetchOrders = async (params?: { email?: string; orderNumber?: string }): Promise<IOrder[]> => {
  try {
    const res = await apiClient.get<IApiResponse<IOrder[]>>("/orders", { params });
    return res.data.data || [];
  } catch {
    return [];
  }
};

export const fetchOrderById = async (id: string): Promise<IOrder | null> => {
  try {
    const res = await apiClient.get<IApiResponse<IOrder>>(`/orders/${id}`);
    return res.data.data || null;
  } catch {
    return null;
  }
};

export const validateCheckoutApi = async (data: {
  items: Array<{ productId: string; quantity: number; variantId?: string; name?: string; price?: number; slug?: string; image?: string }>;
  shippingMethod?: string;
  couponCode?: string;
}): Promise<{
  items: Array<any>;
  subtotal: number;
  discountAmount: number;
  discountCode: string | null;
  couponMessage?: string;
  shippingFee: number;
  shippingMethod: string;
  tax: number;
  total: number;
  currency: string;
} | null> => {
  try {
    const res = await apiClient.post<IApiResponse<any>>("/orders/validate", data);
    return res.data.data || null;
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || "Checkout validation failed";
    throw new Error(msg);
  }
};

export const createOrderApi = async (data: {
  customer: IOrder["customer"];
  billingAddress?: IOrder["billingAddress"];
  items: Array<{
    productId: string;
    name: string;
    slug: string;
    variantId?: string;
    variantName?: string;
    sku?: string;
    image: string;
    price: number;
    quantity: number;
    total?: number;
  }>;
  shippingMethod?: string;
  couponCode?: string;
  paymentMethod?: string;
  paymentDetails?: {
    transactionId?: string;
    paidAt?: string;
    cardBrand?: string;
    cardLast4?: string;
  };
  notes?: string;
}): Promise<IOrder | null> => {
  const res = await apiClient.post<IApiResponse<IOrder>>("/orders", data);
  return res.data.data || null;
};

export const cancelOrderApi = async (id: string, reason?: string): Promise<IOrder | null> => {
  const res = await apiClient.post<IApiResponse<IOrder>>(`/orders/${id}/cancel`, { reason });
  return res.data.data || null;
};

export const fetchOrderInvoiceApi = async (id: string): Promise<any | null> => {
  try {
    const res = await apiClient.get<IApiResponse<any>>(`/orders/${id}/invoice`);
    return res.data.data || null;
  } catch {
    return null;
  }
};

export const updateOrderStatusApi = async (
  id: string,
  status: IOrder["status"],
  paymentStatus?: IOrder["paymentStatus"]
): Promise<IOrder | null> => {
  const res = await apiClient.patch<IApiResponse<IOrder>>(`/orders/${id}/status`, { status, paymentStatus });
  return res.data.data || null;
};

export const deleteOrderApi = async (id: string): Promise<boolean> => {
  try {
    const res = await apiClient.delete<IApiResponse<{ id: string }>>(`/orders/${id}`);
    return res.data.success;
  } catch {
    return false;
  }
};

// --- CART API ---
export const fetchCartApi = async (): Promise<{ items: any[] }> => {
  try {
    const res = await apiClient.get<IApiResponse<{ items: any[] }>>("/cart");
    return res.data.data || { items: [] };
  } catch {
    return { items: [] };
  }
};

export const syncCartApi = async (items: any[]): Promise<{ items: any[] }> => {
  try {
    const res = await apiClient.post<IApiResponse<{ items: any[] }>>("/cart/sync", { items });
    return res.data.data || { items: [] };
  } catch {
    return { items: [] };
  }
};

export const clearCartApi = async (): Promise<void> => {
  try {
    await apiClient.delete("/cart");
  } catch {}
};

export const validateCartApi = async (
  items: any[]
): Promise<{ valid: boolean; items: any[]; subtotal: number; errors: string[] }> => {
  const res = await apiClient.post<IApiResponse<any>>("/cart/validate", { items });
  return res.data.data;
};

export const applyCouponApi = async (
  code: string,
  subtotal: number
): Promise<{ valid: boolean; code: string; discountAmount: number; message: string; freeShipping: boolean }> => {
  const res = await apiClient.post<IApiResponse<any>>("/cart/coupon", { code, subtotal });
  return res.data.data;
};

// --- COLLECTIONS API ---
export const fetchCollections = async (params?: {
  search?: string;
  sortBy?: string;
  category?: string;
  isCategoryListing?: boolean | string;
  limit?: number;
  page?: number;
}): Promise<{ collections: ICollection[]; total: number; totalPages: number }> => {
  try {
    const res = await apiClient.get<IApiResponse<ICollection[]>>("/collections", { params });
    return {
      collections: res.data.data || [],
      total: res.data.pagination?.total || 0,
      totalPages: res.data.pagination?.totalPages || 1,
    };
  } catch {
    return { collections: [], total: 0, totalPages: 1 };
  }
};

export const fetchCollectionByHandle = async (handle: string): Promise<ICollection | null> => {
  try {
    const res = await apiClient.get<IApiResponse<ICollection>>(`/collections/${handle}`);
    return res.data.data || null;
  } catch {
    return null;
  }
};

// --- AUTH API ---
export const sendVerificationCodeApi = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await apiClient.post<IApiResponse<{ email: string; expiresInMinutes: number }>>(
      "/auth/send-code",
      { email },
      { timeout: 35000 }
    );
    return { success: res.data.success, message: res.data.message || "Verification code sent" };
  } catch (error: any) {
    const isTimeout = error.code === "ECONNABORTED" || error.message?.includes("timeout");
    const msg =
      error.response?.data?.message ||
      (isTimeout
        ? "The server took too long to respond. It may be waking up from sleep, please try again in a few moments."
        : error.message === "Network Error"
        ? "Network error connecting to backend API. Please check your internet or try again."
        : error.message || "Failed to send verification code");
    return { success: false, message: msg };
  }
};

export const verifyCodeApi = async (
  email: string,
  code: string
): Promise<{ success: boolean; user?: IUser; token?: string; isNewUser?: boolean; message: string }> => {
  try {
    const res = await apiClient.post<IApiResponse<{ user: IUser; token: string; isNewUser?: boolean }>>(
      "/auth/verify-code",
      { email, code },
      { timeout: 25000 }
    );
    return {
      success: res.data.success,
      user: res.data.data?.user,
      token: res.data.data?.token,
      isNewUser: res.data.data?.isNewUser,
      message: res.data.message || "Verified successfully",
    };
  } catch (error: any) {
    const msg =
      error.response?.data?.message ||
      (error.code === "ECONNABORTED"
        ? "Verification request timed out. Please try again."
        : error.message || "Verification failed");
    return { success: false, message: msg };
  }
};

export const loginApi = async (
  email: string,
  password: string
): Promise<{ success: boolean; user: IUser; token: string; message: string }> => {
  const res = await apiClient.post<IApiResponse<{ user: IUser; token: string }>>("/auth/login", {
    email,
    password,
  });
  return {
    success: res.data.success,
    user: res.data.data!.user,
    token: res.data.data!.token,
    message: res.data.message || "Signed in successfully",
  };
};

export const registerApi = async (
  email: string,
  password: string,
  name?: string
): Promise<{ success: boolean; user: IUser; token: string; message: string; isNewUser?: boolean }> => {
  const res = await apiClient.post<IApiResponse<{ user: IUser; token: string; isNewUser?: boolean }>>("/auth/register", {
    email,
    password,
    name,
  });
  return {
    success: res.data.success,
    user: res.data.data!.user,
    token: res.data.data!.token,
    isNewUser: res.data.data?.isNewUser,
    message: res.data.message || "Account created successfully",
  };
};

export const changePasswordApi = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; token?: string; message: string }> => {
  const res = await apiClient.post<IApiResponse<{ token: string }>>("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return {
    success: res.data.success,
    token: res.data.data?.token,
    message: res.data.message || "Password changed successfully",
  };
};

export const verifyTokenApi = async (token?: string): Promise<{ valid: boolean; user?: IUser }> => {
  try {
    const res = await apiClient.post<IApiResponse<{ valid: boolean; user: IUser }>>("/auth/verify-token", { token });
    return {
      valid: res.data.data?.valid || false,
      user: res.data.data?.user,
    };
  } catch {
    return { valid: false };
  }
};

export const fetchAuthMeApi = async (): Promise<IUser | null> => {
  try {
    const res = await apiClient.get<IApiResponse<{ user: IUser }>>("/auth/me");
    return res.data.data?.user || null;
  } catch {
    return null;
  }
};

export const updateAuthProfileApi = async (data: {
  name?: string;
  marketingConsent?: boolean;
  addresses?: any[];
}): Promise<IUser | null> => {
  try {
    const res = await apiClient.put<IApiResponse<{ user: IUser }>>("/auth/profile", data);
    return res.data.data?.user || null;
  } catch {
    return null;
  }
};

// --- USERS MANAGEMENT API (ADMIN ONLY) ---
export const fetchUsersApi = async (params?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}): Promise<{ users: IUser[]; total: number; totalPages: number }> => {
  try {
    const res = await apiClient.get<IApiResponse<IUser[]>>("/users", { params });
    return {
      users: res.data.data || [],
      total: res.data.pagination?.total || 0,
      totalPages: res.data.pagination?.totalPages || 1,
    };
  } catch {
    return { users: [], total: 0, totalPages: 1 };
  }
};

export const fetchUserStatsApi = async (): Promise<{
  totalUsers: number;
  totalAdmins: number;
  totalCustomers: number;
} | null> => {
  try {
    const res = await apiClient.get<
      IApiResponse<{ totalUsers: number; totalAdmins: number; totalCustomers: number }>
    >("/users/stats");
    return res.data.data || null;
  } catch {
    return null;
  }
};

export const updateUserRoleApi = async (
  id: string,
  role: "admin" | "customer"
): Promise<{ success: boolean; message: string; user?: IUser }> => {
  try {
    const res = await apiClient.patch<IApiResponse<IUser>>(`/users/${id}/role`, { role });
    return {
      success: res.data.success,
      message: res.data.message || "Role updated",
      user: res.data.data,
    };
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || "Failed to update role";
    return { success: false, message: msg };
  }
};

export const deleteUserApi = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await apiClient.delete<IApiResponse<{ id: string }>>(`/users/${id}`);
    return { success: res.data.success, message: res.data.message || "User deleted" };
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || "Failed to delete user";
    return { success: false, message: msg };
  }
};

export const createUserApi = async (data: {
  email: string;
  name?: string;
  password?: string;
  role?: "customer" | "admin";
}): Promise<{ success: boolean; message: string; user?: IUser }> => {
  try {
    const res = await apiClient.post<IApiResponse<IUser>>("/users", data);
    return {
      success: res.data.success,
      message: res.data.message || "User created successfully",
      user: res.data.data,
    };
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || "Failed to create user";
    return { success: false, message: msg };
  }
};

export const fetchProductReviewsApi = async (
  slug: string
): Promise<{ reviews: IReview[]; summary: IReviewSummary }> => {
  try {
    const res = await apiClient.get<IApiResponse<{ reviews: IReview[]; summary: IReviewSummary }>>(
      `/products/${slug}/reviews`
    );
    return (
      res.data.data || {
        reviews: [],
        summary: {
          averageRating: 0,
          totalReviews: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      }
    );
  } catch {
    return {
      reviews: [],
      summary: {
        averageRating: 0,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      },
    };
  }
};

export const createProductReviewApi = async (
  slug: string,
  data: {
    userName: string;
    userEmail: string;
    rating: number;
    title?: string;
    comment: string;
  }
): Promise<{ success: boolean; message: string; review?: IReview }> => {
  try {
    const res = await apiClient.post<IApiResponse<IReview>>(`/products/${slug}/reviews`, data);
    return {
      success: res.data.success,
      message: res.data.message || "Review submitted successfully!",
      review: res.data.data,
    };
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || "Failed to submit review";
    return { success: false, message: msg };
  }
};

export const voteReviewHelpfulApi = async (
  slug: string,
  reviewId: string
): Promise<boolean> => {
  try {
    const res = await apiClient.post<IApiResponse<{ success: boolean }>>(
      `/products/${slug}/reviews/${reviewId}/helpful`
    );
    return res.data.success;
  } catch {
    return false;
  }
};

// --- CUSTOMER SUPPORT & CHAT API ---
export const createSupportTicketApi = async (data: {
  name: string;
  email: string;
  message: string;
  subject?: string;
}): Promise<{ success: boolean; message: string; ticket?: ISupportTicket }> => {
  try {
    const res = await apiClient.post<IApiResponse<ISupportTicket>>("/support/tickets", data);
    return {
      success: res.data.success,
      message: res.data.message || "Message sent successfully!",
      ticket: res.data.data,
    };
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || "Failed to submit message";
    return { success: false, message: msg };
  }
};

export const fetchSupportTicketsApi = async (
  email?: string
): Promise<ISupportTicket[]> => {
  try {
    const res = await apiClient.get<IApiResponse<ISupportTicket[]>>("/support/tickets", {
      params: email ? { email } : undefined,
    });
    return res.data.data || [];
  } catch {
    return [];
  }
};

export const fetchSupportTicketDetailApi = async (
  id: string
): Promise<ISupportTicket | null> => {
  try {
    const res = await apiClient.get<IApiResponse<ISupportTicket>>(`/support/tickets/${id}`);
    return res.data.data || null;
  } catch {
    return null;
  }
};

export const addSupportReplyApi = async (
  ticketId: string,
  message: string,
  senderName?: string
): Promise<{ success: boolean; message: string; ticket?: ISupportTicket }> => {
  try {
    const res = await apiClient.post<IApiResponse<ISupportTicket>>(
      `/support/tickets/${ticketId}/replies`,
      { message, senderName }
    );
    return {
      success: res.data.success,
      message: res.data.message || "Reply sent successfully",
      ticket: res.data.data,
    };
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || "Failed to send reply";
    return { success: false, message: msg };
  }
};

export interface IMediaAsset {
  id: string;
  url: string;
  title: string;
  category: string;
  type: "Category Cover" | "Subcategory" | "Product Image" | "Hero Banner" | "Brand Logo" | "Video" | "Graphic";
  source: string;
  format?: string;
}

export interface ISiteLink {
  id: string;
  title: string;
  url: string;
  type: "Collection" | "Product" | "Storefront" | "Policy" | "Support" | "Admin";
  category?: string;
  description?: string;
  external?: boolean;
}

export interface ISiteAssetsResponse {
  media: IMediaAsset[];
  links: ISiteLink[];
  stats: {
    totalMedia: number;
    totalLinks: number;
    categoryImages: number;
    productImages: number;
    collections: number;
    products: number;
    storePages: number;
  };
}

export const fetchSiteAssetsApi = async (): Promise<ISiteAssetsResponse> => {
  try {
    const res = await apiClient.get<IApiResponse<ISiteAssetsResponse>>("/media/all");
    return (
      res.data.data || {
        media: [],
        links: [],
        stats: {
          totalMedia: 0,
          totalLinks: 0,
          categoryImages: 0,
          productImages: 0,
          collections: 0,
          products: 0,
          storePages: 0,
        },
      }
    );
  } catch (error) {
    console.warn("Failed to fetch site assets via API, using fallback:", error);
    return {
      media: [],
      links: [],
      stats: {
        totalMedia: 0,
        totalLinks: 0,
        categoryImages: 0,
        productImages: 0,
        collections: 0,
        products: 0,
        storePages: 0,
      },
    };
  }
};

export default apiClient;


