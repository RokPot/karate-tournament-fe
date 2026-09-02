import { useRouter } from "next/router";
import {
  createContext,
  use,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/components/ui/status/Toast/useToast";
import { RouteConfig } from "@/config/route.config";
import { AuthContext } from "@/data/auth/auth.context";
import {
  clearPendingInviteToken,
  getPendingInviteToken,
} from "@/data/auth/auth-onboarding";
import { QueryModule } from "@/data/invalidateQueries";
import { InvitationsQueries } from "@/data/invitations/invitations.queries";

type InviteAcceptStatus = {
  isAccepting: boolean;
};

const InviteAcceptContext = createContext<InviteAcceptStatus>({
  isAccepting: false,
});

export const useInviteAcceptStatus = () => use(InviteAcceptContext);

/** After login: if a pending invite token is in localStorage (set from invite page), accept it and redirect. */
export const InviteAcceptHandler = ({
  children,
}: React.PropsWithChildren) => {
  const { user, isLoggedIn } = AuthContext.useAuth();
  const router = useRouter();
  const { successToast, errorToast } = useToast();
  const { t } = useTranslation();
  const [phase, setPhase] = useState<"checking" | "accepting" | "idle">(
    "checking",
  );

  const acceptMutation = InvitationsQueries.useAccept({
    invalidateModules: [QueryModule.Users, QueryModule.Clubs],
    onSuccess: () => {
      successToast({ text: t("invitations.acceptSuccess") });
      router.replace(RouteConfig.myClub);
    },
    onError: () => {
      errorToast({ text: t("invitations.acceptInvalid") });
      router.replace(RouteConfig.dashboard);
    },
  });

  useEffect(() => {
    if (!isLoggedIn || !user) {
      return;
    }
    const token = getPendingInviteToken();
    if (!token) {
      setPhase("idle");
      return;
    }
    clearPendingInviteToken();
    setPhase("accepting");
    acceptMutation.mutate(
      { token },
      {
        onSettled: () => setPhase("idle"),
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- accept once per login when token is present
  }, [isLoggedIn, user]);

  const isAccepting =
    acceptMutation.isPending ||
    phase === "accepting" ||
    (phase === "checking" && isLoggedIn && !!user);

  const value = useMemo((): InviteAcceptStatus => ({ isAccepting }), [isAccepting]);

  return (
    <InviteAcceptContext.Provider value={value}>
      {children}
    </InviteAcceptContext.Provider>
  );
};
