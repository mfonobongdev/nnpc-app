import useSWR from "swr";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { BaseResource } from "@/types/resourceTypes";

interface SingularResourceAPI<T> {
  get: () => Promise<T>;
  update: (data: Partial<T>) => Promise<T>;
  create?: (data: Omit<T, "id" | "createdAt" | "updatedAt">) => Promise<T>;
}

// Helper for merging - only update if the source value is not null/undefined
const mergeResourceData = <T extends BaseResource>(
  target: T,
  source: Partial<T>,
): T => {
  const merged: T = { ...target };
  for (const key in source) {
    if (source[key] !== undefined && source[key] !== null) {
      merged[key] = source[key] as T[Extract<keyof T, string>];
    }
  }
  return merged;
};

export function createSingularResource<T extends BaseResource>(
  resourceName: string,
  api: SingularResourceAPI<T>,
) {
  // 1. Create Zustand store for a single item
  interface StoreState {
    item: T | undefined;
    setItem: (item: T) => void;
    updateItem: (data: Partial<T>) => void;
  }

  const useStore = create<StoreState>()(
    persist(
      (set, _) => ({
        item: undefined,
        setItem: (incomingItem) => set({ item: incomingItem }),
        updateItem: (data) =>
          set((state) => ({
            item: state.item ? mergeResourceData(state.item, data) : undefined,
          })),
      }),
      {
        name: `${resourceName}-singular-storage`,
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );

  // 2. Create SWR hook for a single resource
  function useSingularResource() {
    const { setItem, updateItem } = useStore();
    const item = useStore((state) => state.item);

    const { error, isLoading, isValidating, mutate } = useSWR(
      resourceName,
      api.get,
      {
        onSuccess: (data) => setItem(data),
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      },
    );

    const update = async (data: Partial<T>) => {
      updateItem(data);
      try {
        const updated = await api.update(data);
        await mutate();
        return updated;
      } catch (error) {
        await mutate();
        throw error;
      }
    };

    const create = async (data: Omit<T, "id" | "createdAt" | "updatedAt">) => {
      if (!api.create) {
        throw new Error(
          "Create method not defined for this singular resource API.",
        );
      }
      try {
        const newItem = await api.create(data);
        setItem(newItem);
        await mutate();
        return newItem;
      } catch (error) {
        await mutate();
        throw error;
      }
    };

    return {
      item,
      isLoading,
      isValidating,
      error,
      update,
      create: api.create ? create : undefined,
      refresh: mutate,
    };
  }

  return { useStore, useSingularResource };
}
