import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Inject auth token or custom headers here if needed in future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const errorMsg =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "An unexpected error occurred while communicating with the server.";
    console.error(`[API Error] [${error.config?.method?.toUpperCase()}] ${error.config?.url}:`, errorMsg);
    return Promise.reject(error);
  }
);

export default apiClient;
