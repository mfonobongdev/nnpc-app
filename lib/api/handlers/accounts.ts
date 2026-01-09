import request from "@/lib/api/client";
import type { Account } from "@/types/resourceTypes";

export const singularAccountApi = {
  get: () => request<Account>({ url: "/api/account", method: "GET" }),
  update: (data: Partial<Account>) =>
    request<Account>({
      url: "/api/account",
      method: "PATCH",
      data,
    }),
  create: (data: Omit<Account, "id" | "createdAt" | "updatedAt">) =>
    request<Account>({
      url: "/api/account",
      method: "POST",
      data,
    }),
};
