import request from "@/lib/api/client";
import type { Product } from "@/types/resourceTypes";

export const productsApi = {
  getAll: () => request<Product[]>({ url: "/api/products", method: "GET" }),
  getById: (id: string) =>
    request<Product>({ url: `/api/products/${id}`, method: "GET" }),

  create: (data: Omit<Product, "id" | "createdAt" | "updatedAt">) =>
    request<Product>({
      url: "/api/products",
      method: "POST",
      data,
    }),

  update: (id: string, data: Partial<Product>) =>
    request<Product>({
      url: `/api/products/${id}`,
      method: "PATCH",
      data,
    }),

  delete: (id: string) =>
    request<void>({
      url: `/api/products/${id}`,
      method: "DELETE",
    }),
};
