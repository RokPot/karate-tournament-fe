import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

import { AppConfig } from "@/config/app.config";
import { AuthContext } from "@/data/auth/auth.context";

export const AuthAuth0Provider = ({ children }: React.PropsWithChildren) => {
  return (
    <Auth0Provider
      domain={AppConfig.authAuth0.domain}
      clientId={AppConfig.authAuth0.clientId}
      useRefreshTokens
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: AppConfig.authAuth0.loginRedirectPath?.replace(/\/$/, ""),
        audience: AppConfig.authAuth0.audience,
      }}
    >
      <Auth0>{children}</Auth0>
    </Auth0Provider>
  );
};

const Auth0 = ({ children }: React.PropsWithChildren) => {
  const { loginWithRedirect, logout, getAccessTokenSilently, isLoading, isAuthenticated } = useAuth0();

  async function handleOperation<T>(req: T | null) {
    if (!req) {
      await loginWithRedirect();
    } else {
      throw new Error("Auth0 does not support on-site login");
    }
  }

  const useLogin: AuthContext.Type["useLogin"] = useMutation({
    mutationFn: handleOperation,
  });

  const useSocialLogin: AuthContext.Type["useSocialLogin"] = useMutation({
    mutationFn: handleOperation,
  });

  const useRegister: AuthContext.Type["useRegister"] = useMutation({
    mutationFn: handleOperation,
  });

  const useForgotPassword: AuthContext.Type["useForgotPassword"] = useMutation({
    mutationFn: handleOperation,
  });

  const useResetPassword: AuthContext.Type["useResetPassword"] = useMutation({
    mutationFn: handleOperation,
  });

  const useConfirm: AuthContext.Type["useConfirm"] = useMutation({
    mutationFn: handleOperation,
  });

  const useResendConfirm: AuthContext.Type["useResendConfirm"] = useMutation({
    mutationFn: handleOperation,
  });

  const useLogout: AuthContext.Type["useLogout"] = useMutation({
    mutationFn: async () => {
      await logout();
    },
  });

  const getAuthHeader = useCallback(async () => {
    return getAccessTokenSilently()
      .then((t) => {
        return `Bearer ${t}`;
      })
      .catch(() => undefined);
  }, [getAccessTokenSilently]);

  return (
    <AuthContext.Provider
      useRegister={useRegister}
      useLogin={useLogin}
      useSocialLogin={useSocialLogin}
      useForgotPassword={useForgotPassword}
      useResetPassword={useResetPassword}
      useConfirm={useConfirm}
      useResendConfirm={useResendConfirm}
      useLogout={useLogout}
      getAuthHeader={getAuthHeader}
      isLoggedIn={isAuthenticated}
      isInitializing={isLoading}
      shouldPerformSync
    >
      {children}
    </AuthContext.Provider>
  );
};
