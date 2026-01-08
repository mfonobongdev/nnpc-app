import { createResource } from "@/lib/api/createResourceHandler";
import { accountsApi } from "@/lib/api/handlers/accounts";
import { ordersApi } from "@/lib/api/handlers/orders";
import { productsApi } from "@/lib/api/handlers/products";
import type { Account, Order, Product } from "@/types/resourceTypes";

export const { useStore: useOrdersStore, useResource: useOrders } =
  createResource<Order>("orders", ordersApi);

export const { useStore: useAccountsStore, useResource: useAccounts } =
  createResource<Account>("accounts", accountsApi);

export const { useStore: useProductsStore, useResource: useProducts } =
  createResource<Product>("products", productsApi);
