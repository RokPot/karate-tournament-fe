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
    useLoginForInvite: AuthAction<{ token: string }, void>;
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

    const {
      data: user,
      isLoading: isUserLoading,
      refetch: refetchProfile,
    } = UsersQueries.useGetProfile({ enabled: false });

    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

    // todo rokpot setup sync if its needed
    // const useSync = UsersQueries.useSync();
    // const performSync = useSync.mutate;

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
        return;
      }

      if (shouldPerformSync) {
        // todo rokpot setup sync if its needed
        // performSync(header, {
        //   onSuccess: () => {
        //     applyAccessToken();
        //     refetchProfile();
        //     setIsLoggedIn(true);
        //   },
        //   onError: (e) => {
        //     logger.error("Failed to sync user data", e);
        //     if (e?.code === "CANCELED_ERROR") {
        //       logger.debug("User cancelled sync");
        //       return;
        //     }
        //     performLogoutAsync();
        //   },
        // });
        try {
          applyAccessToken();
          await refetchProfile();
          setIsLoggedIn(true);
        } catch (e) {
          logger.error("Failed to sync user data", e);
        }
      } else {
        applyAccessToken();
        refetchProfile();
        setIsLoggedIn(true);
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

        if (wasLoggedOut) {
          // handle logout
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
          isLoggedIn === undefined || isUserLoading /* || useSync.isPending */,
        shouldPerformSync,
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
