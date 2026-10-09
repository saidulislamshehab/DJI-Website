import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { IProduct, ICategory, ISubCategory, ICategoryOption, IOrder, IHomepageSection, IApiResponse, ICollection, IUser, IReview, IReviewSummary, ISupportTicket, ISupportMessage } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
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

export const updateHomepageSectionApi = async (
  key: string,
  data: { productIds?: string[]; title?: string; subtitle?: string; isEnabled?: boolean }
): Promise<IHomepageSection | null> => {
  const res = await apiClient.put<IApiResponse<IHomepageSection>>(`/homepage-sections/${key}`, data);
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
  const res = await apiClient.post<IApiResponse<{ email: string; expiresInMinutes: number }>>("/auth/send-code", { email });
  return { success: res.data.success, message: res.data.message || "Verification code sent" };
};

export const verifyCodeApi = async (
  email: string,
  code: string
): Promise<{ success: boolean; user: IUser; token: string; isNewUser?: boolean; message: string }> => {
  const res = await apiClient.post<IApiResponse<{ user: IUser; token: string; isNewUser?: boolean }>>("/auth/verify-code", {
    email,
    code,
  });
  return {
    success: res.data.success,
    user: res.data.data!.user,
    token: res.data.data!.token,
    isNewUser: res.data.data?.isNewUser,
    message: res.data.message || "Verified successfully",
  };
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

export default apiClient;


