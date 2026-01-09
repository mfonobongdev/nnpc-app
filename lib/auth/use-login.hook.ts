import useSWRMutation from "swr/mutation";
import request from "../api/client";
import { useAuthStore } from "./auth.store";
import type { LoginPayload, LoginResponse } from "./auth.types";

export function useLogin() {
  const { setAuthData, setAuthError } = useAuthStore();

  return useSWRMutation(
    "/api/login",
    async (url: string, { arg }: { arg: LoginPayload }) => {
      const response = await request<LoginResponse>({
        url,
        method: "POST",
        data: arg,
      });
      return response;
    },
    {
      onSuccess: (data) => {
        setAuthData(data.user, data.token);
        setAuthError(null);
      },
      onError: (err) => {
        setAuthError(err.message || "Login failed");
      },
    },
  );
}
