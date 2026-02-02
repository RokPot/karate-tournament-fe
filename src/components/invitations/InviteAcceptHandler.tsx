import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/components/ui/status/Toast/useToast";
import { RouteConfig } from "@/config/route.config";
import { AuthContext } from "@/data/auth/auth.context";
import { QueryModule } from "@/data/invalidateQueries";
import { InvitationsQueries } from "@/data/invitations/invitations.queries";

const PENDING_INVITE_TOKEN_KEY = "pending_invite_token";

/** After login: if a pending invite token is in localStorage (set from invite page), accept it and redirect. */
export const InviteAcceptHandler = () => {
  const { user, isLoggedIn } = AuthContext.useAuth();
  const router = useRouter();
  const { successToast, errorToast } = useToast();
  const { t } = useTranslation();
  const acceptMutation = InvitationsQueries.useAccept({
    invalidateModules: [QueryModule.Users, QueryModule.Clubs],
    onSuccess: () => {
      successToast({ text: t("invitations.acceptSuccess") });
      router.replace(RouteConfig.myClub);
    },
    onError: () => {
      errorToast({ text: t("invitations.acceptInvalid") });
      router.replace(RouteConfig.home);
    },
  });

  useEffect(() => {
    if (!isLoggedIn || !user) return;
    const token = localStorage.getItem(PENDING_INVITE_TOKEN_KEY);
    if (!token) return;
    localStorage.removeItem(PENDING_INVITE_TOKEN_KEY);
    acceptMutation.mutate({ token });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- acceptMutation stable, token consumed by removeItem
  }, [isLoggedIn, user]);

  return null;
};
