// lib/mock/handlers.ts
import { delay, HttpResponse, http } from "msw";
import type { Account, Order, Product } from "@/types/resourceTypes";
import { MockStorage } from "./storage";

// Initialize storage for each resource
const ordersStorage = new MockStorage<Order>("orders");
const accountsStorage = new MockStorage<Account>("accounts");
const productsStorage = new MockStorage<Product>("products");

// Seed initial data
ordersStorage.seed([
  {
    id: "1",
    customerId: "acc-1",
    items: [{ productId: "prod-1", quantity: 2, price: 29.99 }],
    total: 59.98,
    status: "completed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

accountsStorage.seed([
  {
    id: "acc-1",
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Corp",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

productsStorage.seed([
  {
    id: "prod-1",
    name: "Widget",
    description: "A great widget",
    price: 29.99,
    stock: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

export const handlers = [
  // ============ ORDERS ============

  http.get("/api/orders", async () => {
    await delay(300);
    return HttpResponse.json(ordersStorage.getAll());
  }),

  http.get("/api/orders/:id", async ({ params }) => {
    await delay(200);
    const order = ordersStorage.getById(params.id as string);

    if (!order) {
      return HttpResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return HttpResponse.json(order);
  }),

  http.post("/api/orders", async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as Omit<
      Order,
      "id" | "createdAt" | "updatedAt"
    >;

    const newOrder: Order = {
      ...body,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ordersStorage.create(newOrder);
    return HttpResponse.json(newOrder, { status: 201 });
  }),

  http.patch("/api/orders/:id", async ({ params, request }) => {
    await delay(300);
    const updates = (await request.json()) as Partial<Order>;

    const updated = ordersStorage.update(params.id as string, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) {
      return HttpResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return HttpResponse.json(updated);
  }),

  http.delete("/api/orders/:id", async ({ params }) => {
    await delay(300);
    const deleted = ordersStorage.delete(params.id as string);

    if (!deleted) {
      return HttpResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return HttpResponse.json({ success: true }, { status: 204 });
  }),

  // ============ ACCOUNTS ============

  http.get("/api/accounts", async () => {
    await delay(300);
    return HttpResponse.json(accountsStorage.getAll());
  }),

  http.get("/api/accounts/:id", async ({ params }) => {
    await delay(200);
    const account = accountsStorage.getById(params.id as string);

    if (!account) {
      return HttpResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return HttpResponse.json(account);
  }),

  http.post("/api/accounts", async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as Omit<
      Account,
      "id" | "createdAt" | "updatedAt"
    >;

    const newAccount: Account = {
      ...body,
      id: `acc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    accountsStorage.create(newAccount);
    return HttpResponse.json(newAccount, { status: 201 });
  }),

  http.patch("/api/accounts/:id", async ({ params, request }) => {
    await delay(300);
    const updates = (await request.json()) as Partial<Account>;

    const updated = accountsStorage.update(params.id as string, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) {
      return HttpResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return HttpResponse.json(updated);
  }),

  http.delete("/api/accounts/:id", async ({ params }) => {
    await delay(300);
    const deleted = accountsStorage.delete(params.id as string);

    if (!deleted) {
      return HttpResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return HttpResponse.json({ success: true }, { status: 204 });
  }),

  // ============ PRODUCTS ============

  http.get("/api/products", async () => {
    await delay(300);
    return HttpResponse.json(productsStorage.getAll());
  }),

  http.get("/api/products/:id", async ({ params }) => {
    await delay(200);
    const product = productsStorage.getById(params.id as string);

    if (!product) {
      return HttpResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return HttpResponse.json(product);
  }),

  http.post("/api/products", async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as Omit<
      Product,
      "id" | "createdAt" | "updatedAt"
    >;

    const newProduct: Product = {
      ...body,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    productsStorage.create(newProduct);
    return HttpResponse.json(newProduct, { status: 201 });
  }),

  http.patch("/api/products/:id", async ({ params, request }) => {
    await delay(300);
    const updates = (await request.json()) as Partial<Product>;

    const updated = productsStorage.update(params.id as string, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) {
      return HttpResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return HttpResponse.json(updated);
  }),

  http.delete("/api/products/:id", async ({ params }) => {
    await delay(300);
    const deleted = productsStorage.delete(params.id as string);

    if (!deleted) {
      return HttpResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return HttpResponse.json({ success: true }, { status: 204 });
  }),
];
