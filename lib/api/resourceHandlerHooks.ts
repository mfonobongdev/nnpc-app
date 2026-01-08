import { createResource } from "@/lib/api/createResourceHandler";
import { createSingularResource } from "@/lib/api/createSingularResourceHandler";
import { singularAccountApi } from "@/lib/api/handlers/accounts";
import { ordersApi } from "@/lib/api/handlers/orders";
import { productsApi } from "@/lib/api/handlers/products";
import type { Account, Order, Product } from "@/types/resourceTypes";

export const { useStore: useOrdersStore, useResource: useOrders } =
  createResource<Order>("orders", ordersApi);

export const {
  useStore: useSingularAccountStore,
  useSingularResource: useSingularAccount,
} = createSingularResource<Account>("singularAccount", singularAccountApi);

export const { useStore: useProductsStore, useResource: useProducts } =
  createResource<Product>("products", productsApi);
