import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { CommonModels } from "@/data/common/common.models";
import { UsersQueries } from "@/data/users/users.queries";
import { useStateAndRef } from "@/hooks/useStateAndRef";
import { AppRestClient } from "@/util/rest/clients/app-rest-client";
import { AuthorizationHeaderInterceptor } from "@/util/rest/interceptors/authorization-header.interceptor";
import { TokenExpiredInterceptor } from "@/util/rest/interceptors/token-expired.interceptor";
import { RoutingUtils } from "@/util/routing.utils";
import {
  ApplicationException,
  GeneralErrorCodes,
} from "@/util/vendor/error-handling";

import { logger } from "@/util/logger";
import { AuthErrors } from "./auth.errors";
import { AuthModels } from "./auth.models";

export namespace AuthContext {
  export interface Type {
    useLogin: AuthAction<
      AuthModels.LoginRequest | void,
      void,
      AuthErrors.LoginErrorCodes
    >;
    useSocialLogin: AuthAction<AuthModels.SocialLoginCallbackRequest, void>;
    useRegister: AuthAction<
      AuthModels.RegisterRequest | void,
      AuthModels.RegisterResult | void,
      AuthErrors.RegisterErrorCodes
    >;
    useLoginForInvite: AuthAction<{ token: string; email?: string }, void>;
    useResendConfirm: AuthAction<AuthModels.ResendConfirmRequest>;
    useForgotPassword: AuthAction<AuthModels.ForgotPasswordRequest>;
    useResetPassword: AuthAction<
      AuthModels.ResetPasswordRequest,
      void,
      AuthErrors.ResetPasswordErrorCodes
    >;
    useConfirm: AuthAction<AuthModels.ConfirmRequest>;
    useLogout: AuthAction<void>;
    useRefresh?: AuthAction<
      AuthModels.RefreshRequest | void,
      void,
      AuthErrors.LoginErrorCodes
    >;
    useSocialCredentials?: AuthAction<
      AuthModels.SocialLoginProviderRequest,
      AuthModels.SocialCredentialsResponse,
      AuthErrors.RegisterErrorCodes
    >;
    isLoggedIn: boolean;
    user: CommonModels.UserResponseDto | undefined;
    isInitializing: boolean;
    shouldPerformSync: boolean;
    profileSyncError: unknown | null;
    retryProfileSync: () => void;
  }

  const Context = createContext<Type>({} as never);

  type AuthAction<
    I,
    O = void,
    ECodes extends string = GeneralErrorCodes,
  > = UseMutationResult<
    O,
    ApplicationException<ECodes | GeneralErrorCodes> | null,
    I
  >;

  interface IProps {
    useLogin: Type["useLogin"];
    useSocialLogin: Type["useSocialLogin"];
    useRegister: Type["useRegister"];
    useLoginForInvite: Type["useLoginForInvite"];
    useLogout: Type["useLogout"];
    useResendConfirm: Type["useResendConfirm"];
    useForgotPassword: Type["useForgotPassword"];
    useResetPassword: Type["useResetPassword"];
    useConfirm: Type["useConfirm"];
    useRefresh?: Type["useRefresh"];
    useSocialCredentials?: Type["useSocialCredentials"];
    isInitializing: boolean;
    isLoggedIn: boolean;
    getAuthHeader: () => Promise<string | null | undefined>;
    shouldPerformSync: boolean;
  }

  export const Provider = ({
    useLogin,
    useSocialLogin,
    useRegister,
    useLoginForInvite,
    useResendConfirm,
    useConfirm,
    useForgotPassword,
    useResetPassword,
    useLogout,
    useSocialCredentials,
    useRefresh,
    isInitializing,
    isLoggedIn: authIsLoggedIn,
    getAuthHeader,
    children,
    shouldPerformSync,
  }: React.PropsWithChildren<IProps>) => {
    const [isLoggedIn, isLoggedInRef, setIsLoggedIn] = useStateAndRef<
      boolean | undefined
    >(undefined);

    // this is done because mutations are shared in the context;
    // and if we navigate away from the page and come back, we don't want to keep the old mutation state
    const resetAllAuthMutations = useCallback(() => {
      useLogin.reset();
      useRegister.reset();
      useLoginForInvite.reset();
      useResendConfirm.reset();
      useConfirm.reset();
      useLogout.reset();
      useRefresh?.reset();
      useSocialCredentials?.reset();
    }, [
      useLogin,
      useRegister,
      useLoginForInvite,
      useResendConfirm,
      useConfirm,
      useLogout,
      useRefresh,
      useSocialCredentials,
    ]);

    RoutingUtils.useOnPageChange(resetAllAuthMutations);

    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const [isSyncingProfile, setIsSyncingProfile] = useState(false);
    const [profileSyncError, setProfileSyncError] = useState<unknown | null>(
      null,
    );
    const [profileQueryEnabled, setProfileQueryEnabled] = useState(false);

    const {
      data: user,
      isLoading: isUserLoading,
      refetch: refetchProfile,
    } = UsersQueries.useGetProfile({ enabled: profileQueryEnabled });

    const performLogoutAsync = useLogout.mutateAsync;
    const performRefreshAsync = useRefresh?.mutateAsync;

    useEffect(() => {
      if (!isInitialLoading) {
        return;
      }

      setIsInitialLoading(isUserLoading || isInitializing);
    }, [isInitialLoading, isUserLoading, isInitializing]);

    const queryClient = useQueryClient();

    const onAccessTokenExpired = useCallback(async () => {
      if (performRefreshAsync) {
        await performRefreshAsync();
      } else {
        await performLogoutAsync();
      }
    }, [performLogoutAsync, performRefreshAsync]);

    const applyAccessToken = useCallback(() => {
      AppRestClient.attachInterceptor(
        AuthorizationHeaderInterceptor,
        getAuthHeader,
      );
      AppRestClient.attachInterceptor(
        TokenExpiredInterceptor,
        onAccessTokenExpired,
      );
    }, [getAuthHeader, onAccessTokenExpired]);

    const unapplyAccessToken = useCallback(() => {
      AppRestClient.ejectInterceptor(AuthorizationHeaderInterceptor);
      AppRestClient.ejectInterceptor(TokenExpiredInterceptor);
    }, []);

    const syncProfile = useCallback(async () => {
      const header = await getAuthHeader();
      if (!header) {
        await performLogoutAsync();
        setIsLoggedIn(false);
        setProfileSyncError(null);
        return;
      }

      applyAccessToken();
      setIsSyncingProfile(true);
      setProfileSyncError(null);

      const maxAttempts = shouldPerformSync ? 4 : 1;
      const delayMs = 800;

      try {
        let lastError: unknown = null;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          try {
            const result = await refetchProfile();
            if (result.data) {
              setProfileQueryEnabled(true);
              setIsLoggedIn(true);
              setProfileSyncError(null);
              return;
            }
            lastError = result.error;
          } catch (e) {
            lastError = e;
          }

          if (attempt < maxAttempts - 1) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        }

        logger.error("Failed to sync user data", lastError);
        setProfileSyncError(lastError);
        setIsLoggedIn(false);
      } finally {
        setIsSyncingProfile(false);
      }
    }, [
      applyAccessToken,
      setIsLoggedIn,
      getAuthHeader,
      performLogoutAsync,
      refetchProfile,
      shouldPerformSync,
    ]);

    useEffect(() => {
      if (isInitializing) {
        return undefined;
      }

      if (!authIsLoggedIn) {
        unapplyAccessToken();

        const wasLoggedOut = isLoggedInRef.current;
        setIsLoggedIn(false);
        setProfileSyncError(null);
        setProfileQueryEnabled(false);

        if (wasLoggedOut) {
          queryClient.clear();
        }
      } else {
        syncProfile();
      }

      return () => {
        unapplyAccessToken();
      };
    }, [
      syncProfile,
      isLoggedInRef,
      unapplyAccessToken,
      authIsLoggedIn,
      queryClient,
      setIsLoggedIn,
      isInitializing,
    ]);

    const value = useMemo(
      (): Type => ({
        isLoggedIn: !!isLoggedIn,
        useLogin,
        useSocialLogin,
        useRegister,
        useLoginForInvite,
        useResendConfirm,
        useForgotPassword,
        useResetPassword,
        useConfirm,
        useLogout,
        useSocialCredentials,
        user,
        isInitializing:
          isLoggedIn === undefined || isUserLoading || isSyncingProfile,
        shouldPerformSync,
        profileSyncError,
        retryProfileSync: syncProfile,
      }),
      [
        isUserLoading,
        useLogin,
        useSocialLogin,
        useRegister,
        useLoginForInvite,
        useResendConfirm,
        useForgotPassword,
        useResetPassword,
        useConfirm,
        useLogout,
        useSocialCredentials,
        isLoggedIn,
        user,
        shouldPerformSync,
        isSyncingProfile,
        profileSyncError,
        syncProfile,
      ],
    );

    let content = null;
    if (!isInitialLoading) {
      content = children;
    }

    return <Context.Provider value={value}>{content}</Context.Provider>;
  };

  export const useAuth = () => {
    const auth = use(Context);
    return auth;
  };
}
