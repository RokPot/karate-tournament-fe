import { Button, Card, CardContent } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { LoadingState } from "@/components/shared/layout/LoadingState";
import { ThinPageWrapper } from "@/components/shared/layout/ThinPageWrapper";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { RouteConfig } from "@/config/route.config";
import { AuthContext } from "@/data/auth/auth.context";
import { InvitationsQueries } from "@/data/invitations/invitations.queries";

const InvitePage = () => {
  const router = useRouter();
  const { token } = router.query;
  const tokenStr = typeof token === "string" ? token : "";
  const { t } = useTranslation();
  const { useLoginForInvite } = AuthContext.useAuth();

  const { data, isLoading, error, isError } = InvitationsQueries.useGetByToken(
    { token: tokenStr },
    { enabled: !!tokenStr },
  );

  const handleSignUpLogIn = () => {
    if (tokenStr) {
      useLoginForInvite.mutate({ token: tokenStr });
    }
  };

  const formatExpiresAt = (expiresAt: string) => {
    try {
      return new Date(expiresAt).toLocaleDateString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return expiresAt;
    }
  };

  if (isLoading || !tokenStr) {
    return <LoadingState />;
  }

  if (isError || error) {
    return (
      <ThinPageWrapper>
        <Card className="p-4">
          <CardContent className="flex flex-col gap-4">
            <Typography size="h2" variant="prominent-1" as="h2">
              {t("invitations.invalidOrExpired")}
            </Typography>
            <Button variant="contained" onClick={() => router.push(RouteConfig.home)}>
              {t("shared.notFound.homeBtn")}
            </Button>
            <Button onClick={() => router.push(RouteConfig.signin)}>
              {t("invitations.signUpLogIn")}
            </Button>
          </CardContent>
        </Card>
      </ThinPageWrapper>
    );
  }

  if (!data) {
    return <LoadingState />;
  }

  if (data.status !== "pending") {
    return (
      <ThinPageWrapper>
        <Card className="p-4">
          <CardContent className="flex flex-col gap-4">
            <Typography size="h2" variant="prominent-1" as="h2">
              {t("invitations.noLongerValid")}
            </Typography>
            <Button variant="contained" onClick={() => router.push(RouteConfig.home)}>
              {t("shared.notFound.homeBtn")}
            </Button>
          </CardContent>
        </Card>
      </ThinPageWrapper>
    );
  }

  // status === "pending"
  return (
    <ThinPageWrapper>
      <Card className="p-4">
        <CardContent className="flex flex-col gap-4">
          <Typography size="h2" variant="prominent-1" as="h2">
            {t("invitations.inviteHeading", { clubName: data.clubName })}
          </Typography>
          {data.expiresAt && (
            <Typography size="body-paragraph-m">
              {t("invitations.expiresOn", { date: formatExpiresAt(data.expiresAt) })}
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={handleSignUpLogIn}
            disabled={useLoginForInvite.isPending}
          >
            {useLoginForInvite.isPending ? "..." : t("invitations.signUpLogIn")}
          </Button>
          <Button onClick={() => router.push(RouteConfig.home)}>
            {t("shared.notFound.homeBtn")}
          </Button>
        </CardContent>
      </Card>
    </ThinPageWrapper>
  );
};

export default InvitePage;
