import { useEffect, useRef } from "react";

import { LoadingState } from "@/components/shared/layout/LoadingState";
import { AuthContext } from "@/data/auth/auth.context";
import { markPendingProfileSetup } from "@/data/auth/auth-onboarding";

const SignUpPage = () => {
  const { useRegister } = AuthContext.useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      markPendingProfileSetup();
      useRegister.mutate();
    }
  }, []);

  return <LoadingState />;
};

export default SignUpPage;
