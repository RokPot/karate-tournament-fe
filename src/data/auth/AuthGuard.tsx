import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ErrorState } from "@/components/shared/layout/ErrorState";
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
  const {
    user,
    isInitializing,
    profileSyncError,
    retryProfileSync,
    useLogout,
  } = AuthContext.useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || isInitializing) {
    return <LoadingState />;
  }

  if (profileSyncError) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 p-8">
        <ErrorState error={profileSyncError} onRetry={retryProfileSync} />
        <Button
          variant="outlined"
          color="error"
          onClick={() => useLogout.mutate()}
          disabled={useLogout.isPending}
        >
          {t("profile.signOut")}
        </Button>
      </div>
    );
  }

  if (type === "private" && !user) {
    router.replace(redirectTo || RouteConfig.home);
    return null;
  }

  if (type === "public-only" && user) {
    router.replace(redirectTo || RouteConfig.dashboard);
    return null;
  }

  return children;
};
