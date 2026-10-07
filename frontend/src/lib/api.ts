import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { IProduct, ICategory, IOrder, IHomepageSection, IApiResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const errorMsg =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "An unexpected error occurred.";
    console.error(`[API Error] [${error.config?.method?.toUpperCase()}] ${error.config?.url}:`, errorMsg);
    return Promise.reject(error);
  }
);

// --- PRODUCTS API ---
export const fetchProducts = async (params?: {
  category?: string;
  subCategory?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isProfessional?: boolean;
  isEnterprise?: boolean;
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
export const fetchOrders = async (): Promise<IOrder[]> => {
  try {
    const res = await apiClient.get<IApiResponse<IOrder[]>>("/orders");
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

export const createOrderApi = async (data: {
  customer: IOrder["customer"];
  items: IOrder["items"];
  shippingMethod?: string;
  shippingFee?: number;
  paymentMethod?: string;
  notes?: string;
}): Promise<IOrder | null> => {
  const res = await apiClient.post<IApiResponse<IOrder>>("/orders", data);
  return res.data.data || null;
};

export const updateOrderStatusApi = async (
  id: string,
  status: IOrder["status"],
  paymentStatus?: IOrder["paymentStatus"]
): Promise<IOrder | null> => {
  const res = await apiClient.patch<IApiResponse<IOrder>>(`/orders/${id}/status`, { status, paymentStatus });
  return res.data.data || null;
};

export default apiClient;
