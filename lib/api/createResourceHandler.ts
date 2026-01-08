import useSWR from "swr";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BaseResource {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface ResourceAPI<T> {
  getAll: () => Promise<T[]>;
  getById: (id: string) => Promise<T>;
  create: (data: Omit<T, "id" | "createdAt" | "updatedAt">) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

// Helper for merging - only update if the source value is not null/undefined
// or if the target value is already null/undefined (meaning it's missing data)
const mergeResourceData = <T extends BaseResource>(
  target: T,
  source: Partial<T>,
): T => {
  const merged: T = { ...target };
  for (const key in source) {
    // We only update the merged object's field if the source has a defined value for it.
    // This prevents partial data (null/undefined) from overwriting full data.
    if (source[key] !== undefined && source[key] !== null) {
      merged[key] = source[key] as T[Extract<keyof T, string>];
    }
  }
  return merged;
};

export function createResource<T extends BaseResource>(
  resourceName: string,
  api: ResourceAPI<T>,
) {
  // 1. Create Zustand store
  interface StoreState {
    items: T[];
    setItems: (items: T[]) => void;
    addItem: (item: T) => void;
    updateItem: (id: string, data: Partial<T>) => void;
    removeItem: (id: string) => void;
    getItemById: (id: string) => T | undefined;
  }

  const useStore = create<StoreState>()(
    persist(
      (set, get) => ({
        items: [],
        setItems: (incomingItems) => {
          set((state) => {
            // Start with all current items in a map for easy lookup and updates
            const updatedItemsMap = new Map(
              state.items.map((item) => [item.id, item]),
            );

            incomingItems.forEach((incomingItem) => {
              const existingItem = updatedItemsMap.get(incomingItem.id);
              if (existingItem) {
                // If it exists, merge incoming (potentially partial) data into existing item
                updatedItemsMap.set(
                  incomingItem.id,
                  mergeResourceData(existingItem, incomingItem),
                );
              } else {
                // If it's new, add it to the map
                updatedItemsMap.set(incomingItem.id, incomingItem);
              }
            });

            // Convert the map back to an array to update the store state.
            // This preserves items that were in the store but not returned by getAll,
            // and integrates new/updated items.
            return { items: Array.from(updatedItemsMap.values()) };
          });
        },
        addItem: (item) => set((state) => ({ items: [...state.items, item] })),
        updateItem: (id, data) =>
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? mergeResourceData(item, data) : item,
            ),
          })),
        removeItem: (id) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          })),
        getItemById: (id) => get().items.find((item) => item.id === id),
      }),
      {
        name: `${resourceName}-storage`,
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );

  // 2. Create SWR hook
  function useResource() {
    const { setItems, addItem, updateItem, removeItem } = useStore();
    const items = useStore((state) => state.items);

    const { error, isLoading, isValidating, mutate } = useSWR(
      resourceName,
      api.getAll,
      {
        onSuccess: (data) => setItems(data),
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      },
    );

    const create = async (data: Omit<T, "id" | "createdAt" | "updatedAt">) => {
      try {
        const newItem = await api.create(data);
        addItem(newItem);
        await mutate();
        return newItem;
      } catch (error) {
        await mutate();
        throw error;
      }
    };

    const update = async (id: string, data: Partial<T>) => {
      updateItem(id, data);
      try {
        const updated = await api.update(id, data);
        await mutate();
        return updated;
      } catch (error) {
        await mutate();
        throw error;
      }
    };

    const deleteItem = async (id: string) => {
      removeItem(id);
      try {
        await api.delete(id);
        await mutate();
      } catch (error) {
        await mutate();
        throw error;
      }
    };

    const getOne = async (id: string) => {
      try {
        const fullItem = await api.getById(id);
        updateItem(id, fullItem);
        await mutate();

        return fullItem;
      } catch (error) {
        console.error(`Failed to fetch full resource for ID ${id}:`, error);
        await mutate();
        throw error;
      }
    };

    return {
      items,
      isLoading,
      isValidating,
      error,
      create,
      update,
      delete: deleteItem,
      getOne,
      refresh: mutate,
    };
  }

  return { useStore, useResource };
}
