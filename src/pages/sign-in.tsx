import { useEffect, useRef } from "react";

import { LoadingState } from "@/components/shared/layout/LoadingState";
import { AuthContext } from "@/data/auth/auth.context";

const SignInPage = () => {
  const { useLogin, isLoggedIn } = AuthContext.useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoggedIn) {
      return;
    }
    // Redirect to Auth0 login only once
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      useLogin.mutate();
    }
  }, [isLoggedIn]); // Empty dependency array - only run once on mount

  return <LoadingState />;
};

export default SignInPage;
