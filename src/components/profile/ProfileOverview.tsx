import Pill from "@/components/ui/Pill";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { useAuthUser } from "@/hooks/useAuthUser";
import { DateUtils } from "@/util/date.utils";
import { Button } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CompleteProfileModal } from "./CompleteProfileModal";
import { ProfileField } from "./ProfileField";

export const ProfileOverview = () => {
  const { t } = useTranslation();
  const user = useAuthUser();
  const [isEditing, setIsEditing] = useState(false);

  const displayName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");
  const empty = t("shared.none");

  return (
    <div className="flex max-w-xl flex-col gap-5">
      <div className="flex flex-row items-center justify-between gap-4">
        <Typography size="h2">{t("profile.overview.title")}</Typography>
        {user && (
          <Button variant="outlined" onClick={() => setIsEditing(true)}>
            {t("profile.complete.edit")}
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <ProfileField label={t("profile.overview.name")}>
          <Typography size="body-paragraph-m">
            {displayName || empty}
          </Typography>
        </ProfileField>
        <ProfileField label={t("profile.overview.email")}>
          <Typography size="body-paragraph-m">
            {user?.email || empty}
          </Typography>
        </ProfileField>
        <ProfileField label={t("profile.overview.roles")}>
          <div className="flex flex-row flex-wrap gap-1">
            {user?.roles.length ? (
              user.roles.map((role) => (
                <Pill key={role}>
                  <Typography
                    size="body-paragraph-s"
                    className="font-weight-500"
                  >
                    {t(`profile.roles.${role}`)}
                  </Typography>
                </Pill>
              ))
            ) : (
              <Typography size="body-paragraph-m">{empty}</Typography>
            )}
          </div>
        </ProfileField>
        <ProfileField label={t("shared.gender")}>
          <Typography size="body-paragraph-m">
            {user?.gender ? t(`profile.gender.${user.gender}`) : empty}
          </Typography>
        </ProfileField>
        <ProfileField label={t("shared.birthday")}>
          <Typography size="body-paragraph-m">
            {user?.dateOfBirth
              ? DateUtils.parseAndFormatDateToLocaleShort(user.dateOfBirth)
              : empty}
          </Typography>
        </ProfileField>
        <ProfileField label={t("shared.weight")}>
          <Typography size="body-paragraph-m">
            {user?.weight != null
              ? t("profile.overview.weightUnit", { weight: user.weight })
              : empty}
          </Typography>
        </ProfileField>
        <ProfileField label={t("shared.belt")}>
          <Typography size="body-paragraph-m">
            {user?.beltLevel ? t(`belt.${user.beltLevel}`) : empty}
          </Typography>
        </ProfileField>
        <ProfileField label={t("profile.overview.memberSince")}>
          <Typography size="body-paragraph-m">
            {user?.createdAt
              ? DateUtils.parseAndFormatDateToLocaleShort(user.createdAt)
              : empty}
          </Typography>
        </ProfileField>
      </div>
      {user && (
        <CompleteProfileModal
          open={isEditing}
          user={user}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};
