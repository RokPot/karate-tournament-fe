import { useRouter } from "next/router";
import { useEffect } from "react";

import { RouteConfig } from "@/config/route.config";
import { StringUtils } from "@/util/string.utils";

export namespace RoutingUtils {
  export const getCompleteUrlFromPath = (
    path: string,
    { noTrailingSlash = false }: { noTrailingSlash?: boolean } = {},
  ) => {
    // In SPA mode, window should always be available at runtime
    // This check is only needed during build/static generation
    if (typeof window === "undefined") {
      // During build, return path as-is (will be resolved at runtime)
      return path;
    }

    const url = new URL(path, window.location.origin).toString();
    if (noTrailingSlash) {
      return url.replace(/\/$/, "");
    }

    return url;
  };

  export const addQueryParams = (path: string, params: Record<string, string | number | boolean | undefined>) => {
    const sParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        sParams.append(key, value.toString());
      }
    }

    return `${path}?${sParams.toString()}`;
  };

  export const useOnPageChange = (onPageChange: () => void) => {
    const router = useRouter();

    useEffect(() => {
      router.events.on("routeChangeComplete", onPageChange);
      return () => router.events.off("routeChangeComplete", onPageChange);
    }, [router.events, onPageChange]);
  };

  export const isPathInRoutes = (path: string, routes: (keyof typeof RouteConfig)[]) => {
    const slicedPath = StringUtils.getLastCharacter(path) === "/" ? path.slice(0, -1) : path;
    const slicedRoutes = routes.map((routeKey) => {
      const route = RouteConfig[routeKey];
      return StringUtils.getLastCharacter(route) === "/" ? route.slice(0, -1) : route;
    });

    return slicedRoutes.includes(slicedPath);
  };
}
