export class MockStorage<T extends { id: string }> {
  private storageKey: string;

  constructor(resourceName: string) {
    this.storageKey = `mock_${resourceName}`;
  }

  getAll(): T[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  getById(id: string): T | undefined {
    return this.getAll().find((item) => item.id === id);
  }

  create(item: T): T {
    const items = this.getAll();
    items.push(item);
    this.save(items);
    return item;
  }

  update(id: string, updates: Partial<T>): T | null {
    const items = this.getAll();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    this.save(items);
    return items[index];
  }

  delete(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter((item) => item.id !== id);

    if (filtered.length === items.length) return false;

    this.save(filtered);
    return true;
  }

  clear(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.storageKey);
    }
  }

  private save(items: T[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
  }

  // Initialize with seed data if empty
  seed(data: T[]): void {
    if (this.getAll().length === 0) {
      this.save(data);
    }
  }
}
