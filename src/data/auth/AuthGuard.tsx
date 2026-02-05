import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { LoadingState } from "@/components/shared/layout/LoadingState";
import { RouteConfig } from "@/config/route.config";
import { AuthContext } from "@/data/auth/auth.context";

export interface AuthGuardProps {
  type: "public-only" | "private";
  redirectTo?: string;
}

export const AuthGuard = ({
  type,
  redirectTo,
  children,
}: React.PropsWithChildren<AuthGuardProps>) => {
  const { user, isInitializing } = AuthContext.useAuth();
  const router = useRouter();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || isInitializing) {
    return <LoadingState />;
  }

  if (type === "private" && !user) {
    router.replace(redirectTo || RouteConfig.home);
    return null;
  }

  if (type === "public-only" && user) {
    router.replace(redirectTo || RouteConfig.home);
    return null;
  }

  return children;
};
