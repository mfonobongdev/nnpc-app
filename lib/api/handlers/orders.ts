import request from "@/lib/api/client";
import type { Order } from "@/types/resourceTypes";

export const ordersApi = {
  getAll: () =>
    request<Order[]>({
      url: "/api/orders",
      method: "GET",
    }),

  getById: (id: string) =>
    request<Order>({
      url: `/api/orders/${id}`,
      method: "GET",
    }),

  create: (data: Omit<Order, "id" | "createdAt" | "updatedAt">) =>
    request<Order>({
      url: "/api/orders",
      method: "POST",
      data,
    }),

  update: (id: string, data: Partial<Order>) =>
    request<Order>({
      url: `/api/orders/${id}`,
      method: "PATCH",
      data,
    }),

  delete: (id: string) =>
    request<void>({
      url: `/api/orders/${id}`,
      method: "DELETE",
    }),
};
