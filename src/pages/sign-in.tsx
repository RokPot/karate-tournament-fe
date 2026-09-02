import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import { LoadingState } from "@/components/shared/layout/LoadingState";
import { RouteConfig } from "@/config/route.config";
import { AuthContext } from "@/data/auth/auth.context";

const SignInPage = () => {
  const router = useRouter();
  const { useLogin, isLoggedIn } = AuthContext.useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace(RouteConfig.dashboard);
      return;
    }
    // Redirect to Auth0 login only once
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      useLogin.mutate();
    }
  }, [isLoggedIn, router, useLogin]);

  return <LoadingState />;
};

export default SignInPage;
