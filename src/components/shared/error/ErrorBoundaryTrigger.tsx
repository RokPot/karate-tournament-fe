import { useEffect } from "react";

/**
 * Dev-only helper to force an error during render/effect to test ErrorBoundary fallback styling.
 * Trigger with one of:
 * - Add `?crash=1` to the URL
 * - Set `localStorage.setItem('CRASH_APP', '1')`
 * This component should be included somewhere under AppErrorBoundary in dev only.
 */
export function ErrorBoundaryTrigger() {
  // Throw during render if query flag present
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("crash") === "1") {
      throw new Error("Forced crash via ?crash=1");
    }
  }

  // Also support triggering via localStorage (throws in effect next tick)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldCrash = window.localStorage.getItem("CRASH_APP") === "1";
    if (shouldCrash) {
      // Clear flag first so we don't loop reloads
      window.localStorage.removeItem("CRASH_APP");
      // Throw async to simulate runtime error
      setTimeout(() => {
        throw new Error("Forced crash via localStorage CRASH_APP");
      }, 0);
    }
  }, []);

  return null;
}
