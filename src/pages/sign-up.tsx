import { useEffect, useRef } from "react";

import { LoadingState } from "@/components/shared/layout/LoadingState";
import { AuthContext } from "@/data/auth/auth.context";

const SignUpPage = () => {
  const { useRegister } = AuthContext.useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      useRegister.mutate();
    }
  }, []);

  return <LoadingState />;
};

export default SignUpPage;
