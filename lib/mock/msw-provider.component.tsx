"use client";

import { useEffect, useState } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    async function initMocks() {
      if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
        const { worker } = await import("@/lib/mock/browser");
        await worker.start({
          onUnhandledRequest: "bypass",
        });
        console.log("🔶 MSW enabled - API requests will be mocked");
      }
      setMswReady(true);
    }

    initMocks();
  }, []);

  if (!mswReady && process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
    return null;
  }

  return <>{children}</>;
}
