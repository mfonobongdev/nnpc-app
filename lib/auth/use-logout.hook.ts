import useSWRMutation from "swr/mutation";
import request from "../api/client";
import { useAuthStore } from "./auth.store";

export function useLogout() {
  const { clearAuthData, setAuthError } = useAuthStore();

  return useSWRMutation(
    "/api/logout",
    async (url: string) => {
      await request<void>({
        url,
        method: "POST",
      });
      return true;
    },
    {
      onSuccess: () => {
        clearAuthData();
        setAuthError(null);
      },
      onError: (err) => {
        setAuthError(err.message || "Logout failed");
        clearAuthData();
      },
    },
  );
}
