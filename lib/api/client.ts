import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Optional token resolver.
 * This allows you to:
 * - inject a token from cookies (Next.js server)
 * - inject a token from localStorage (client)
 * - inject a token manually per request
 */
let getAuthToken: (() => string | null) | null = null;

export const setAuthTokenResolver = (resolver: () => string | null) => {
  getAuthToken = resolver;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to attach JWT automatically
 */
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken?.();

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

/**
 * Unified response/error handling
 */
async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<{ error?: string }>;
      throw new Error(
        err.response?.data?.error ||
          err.message ||
          `HTTP ${err.response?.status}`,
      );
    }

    throw error;
  }
}

export default request;
