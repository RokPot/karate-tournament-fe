import { useEffect, useRef } from "react";

import { LoadingState } from "@/components/shared/layout/LoadingState";
import { markPendingProfileSetup } from "@/data/auth/auth-onboarding";
import { AuthContext } from "@/data/auth/auth.context";

const SignUpPage = () => {
  const { useRegister } = AuthContext.useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      markPendingProfileSetup();
      useRegister.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoadingState />;
};

export default Object.assign(SignUpPage, { shell: { sidebar: false } });
