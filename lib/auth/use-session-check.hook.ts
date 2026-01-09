import useSWR from "swr";
import request from "../api/client";
import { useAuthStore } from "./auth.store";
import type { AuthUser } from "./auth.types";

export function useSessionCheck() {
  const { token, setAuthData, clearAuthData, setLoadingSession, setAuthError } =
    useAuthStore();

  return useSWR(
    token ? "/api/me" : null,
    async (url) => {
      const currentUser = await request<AuthUser>({
        url,
        method: "GET",
      });
      return currentUser;
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      onSuccess: (data) => {
        if (data && token) {
          setAuthData(data, token);
        } else {
          clearAuthData();
        }
        setLoadingSession(false);
        setAuthError(null);
      },
      onError: (err) => {
        console.error("Session check API failed:", err);
        clearAuthData();
        setLoadingSession(false);
        setAuthError(err.message || "Session expired. Please log in again.");
      },
      dedupingInterval: 5000, // Debounce rapid re-fetches
    },
  );
}
