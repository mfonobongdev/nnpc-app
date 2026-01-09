"use client";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useAuthStore } from "./auth.store";
import { useSessionCheck } from "./use-session-check.hook";

interface AuthProviderProps {
  children: ReactNode;
}

const PUBLIC_PATHS = ["/login", "/register"];

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { isValidating: isCheckingSession } = useSessionCheck();

  const { isAuthenticated, isLoadingSession } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoadingSession: state.isLoadingSession,
  }));

  const isLoadingApp = isLoadingSession || isCheckingSession;

  useEffect(() => {
    useAuthStore.getState().setLoadingSession(isCheckingSession);
  }, [isCheckingSession]);

  useEffect(() => {
    if (!isLoadingApp) {
      const isPublicPath = PUBLIC_PATHS.includes(pathname);
      const isPrivatePath = !isPublicPath;
      const isUnauthenticated = !isAuthenticated;

      if (isAuthenticated && isPublicPath) {
        router.push("/");
      } else if (isUnauthenticated && isPrivatePath) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoadingApp, router, pathname]);

  if (isLoadingApp) {
    return <div>Loading application...</div>;
  }

  return <>{children}</>;
}
