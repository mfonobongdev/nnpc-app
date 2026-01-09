import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { setAuthTokenResolver } from "@/lib/api/client";
import type { AuthUser } from "./auth.types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  authError: string | null;

  setAuthData: (user: AuthUser, token: string) => void;
  clearAuthData: () => void;
  setLoadingSession: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoadingSession: true,
      authError: null,

      setAuthData: (user, token) => {
        set({ user, token, isAuthenticated: true, authError: null });
        setAuthTokenResolver(() => token);
      },
      clearAuthData: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          authError: null,
        });
        setAuthTokenResolver(() => null);
      },
      setLoadingSession: (loading) => set({ isLoadingSession: loading }),
      setAuthError: (error) => set({ authError: error }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: (state) => {
        if (state?.token) {
          setAuthTokenResolver(() => state.token);
        }
        state?.setLoadingSession(true);
        return (s, error) => {
          if (error) {
            console.error("Failed to rehydrate auth store", error);
            s?.clearAuthData();
          }
        };
      },
    },
  ),
);

// Immediately set the token resolver on initial load (before any rehydration)
// This ensures that if localStorage is empty, the resolver is null initially.
// It will be updated by persist's onRehydrateStorage if a token exists.
setAuthTokenResolver(() => useAuthStore.getState().token);
