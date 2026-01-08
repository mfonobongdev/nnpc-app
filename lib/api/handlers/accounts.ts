import request from "@/lib/api/client";
import type { Account } from "@/types/resourceTypes";

export const accountsApi = {
  getAll: () => request<Account[]>({ url: "/api/accounts", method: "GET" }),
  getById: (id: string) =>
    request<Account>({ url: `/api/accounts/${id}`, method: "GET" }),

  create: (data: Omit<Account, "id" | "createdAt" | "updatedAt">) =>
    request<Account>({
      url: "/api/accounts",
      method: "POST",
      data,
    }),

  update: (id: string, data: Partial<Account>) =>
    request<Account>({
      url: `/api/accounts/${id}`,
      method: "PATCH",
      data,
    }),

  delete: (id: string) =>
    request<void>({
      url: `/api/accounts/${id}`,
      method: "DELETE",
    }),
};
