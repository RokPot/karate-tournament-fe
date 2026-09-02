import { ProfileField } from "@/components/profile/ProfileField";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { AuthContext } from "@/data/auth/auth.context";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

export const ProfileAccount = () => {
  const { t } = useTranslation();
  const user = useAuthUser();
  const { useLogout } = AuthContext.useAuth();
  const empty = t("shared.none");

  return (
    <div className="flex max-w-xl flex-col gap-5">
      <Typography size="h2">{t("profile.account.title")}</Typography>
      <div className="flex flex-col gap-4">
        <ProfileField label={t("profile.account.email")}>
          <Typography size="body-paragraph-m">
            {user?.email || empty}
          </Typography>
        </ProfileField>
        <ProfileField label={t("profile.account.password")}>
          <div className="flex flex-col items-start gap-2">
            <Button variant="outlined" disabled>
              {t("profile.account.changePassword")}
            </Button>
            <Typography size="body-paragraph-s" className="text-secondary-200">
              {t("profile.account.passwordManagedByAuth0")}
            </Typography>
          </div>
        </ProfileField>
        <ProfileField label={t("profile.account.sessions")}>
          <div className="flex flex-col gap-2">
            <Typography size="body-paragraph-m">
              {t("profile.account.currentSession")}
            </Typography>
            <Typography size="body-paragraph-s" className="text-secondary-200">
              {t("profile.account.sessionsPlaceholder")}
            </Typography>
          </div>
        </ProfileField>
        <div>
          <Button
            variant="contained"
            color="error"
            onClick={() => useLogout.mutate()}
            disabled={useLogout.isPending}
          >
            {t("profile.signOut")}
          </Button>
        </div>
      </div>
    </div>
  );
};
