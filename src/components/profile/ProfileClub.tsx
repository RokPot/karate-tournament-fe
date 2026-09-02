import Pill from "@/components/ui/Pill";
import { Link } from "@/components/ui/text/Link/Link";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { RouteConfig } from "@/config/route.config";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useTranslation } from "react-i18next";

export const ProfileClub = () => {
  const { t } = useTranslation();
  const user = useAuthUser();
  const club = user?.club;

  return (
    <div className="flex max-w-xl flex-col gap-5">
      <Typography size="h2">{t("profile.club.title")}</Typography>
      {!club ? (
        <Typography size="body-paragraph-m">{t("dashboard.noClub")}</Typography>
      ) : (
        <div className="flex flex-col gap-4">
          <Typography size="h3">{club.name}</Typography>
          <div className="flex flex-row flex-wrap gap-1">
            <Pill>
              <Typography
                size="body-paragraph-s"
                className="text-secondary-200"
              >
                {t("shared.location")}:
              </Typography>
              <Typography size="body-paragraph-s" className="font-weight-500">
                {club.address}
              </Typography>
            </Pill>
            <Pill>
              <Typography
                size="body-paragraph-s"
                className="text-secondary-200"
              >
                {t("shared.country")}:
              </Typography>
              <Typography size="body-paragraph-s" className="font-weight-500">
                {club.country}
              </Typography>
            </Pill>
            <Pill>
              <Typography
                size="body-paragraph-s"
                className="text-secondary-200"
              >
                {t("shared.membersCount")}:
              </Typography>
              <Typography size="body-paragraph-s" className="font-weight-500">
                {club.membersCount}
              </Typography>
            </Pill>
          </div>
          <Link href={RouteConfig.myClub}>{t("profile.club.viewClub")}</Link>
        </div>
      )}
    </div>
  );
};
