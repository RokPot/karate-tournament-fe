import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import Pill from "@/components/ui/Pill";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { ClubsQueries } from "@/data/clubs/clubs.queries";
import { useTranslation } from "react-i18next";

interface ClubProfileDashboardProps {
  clubId: string;
}

export const ClubProfileDashboard = ({ clubId }: ClubProfileDashboardProps) => {
  const { t } = useTranslation();
  const { data: club, isLoading, error, refetch } = ClubsQueries.useFindOne(
    { id: clubId },
    { enabled: !!clubId },
  );

  if (!clubId) {
    return (
      <div className="p-6">
        <Typography size="body-paragraph-m">{t("dashboard.noClub")}</Typography>
      </div>
    );
  }

  if (isLoading || !club) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <Typography size="h2">{club.name}</Typography>
      <div className="flex flex-row flex-wrap gap-1">
        <Pill>
          <Typography size="body-paragraph-s" className="text-secondary-200">
            {t("shared.location")}:
          </Typography>
          <Typography size="body-paragraph-s" className="font-weight-500">
            {club.address}
          </Typography>
        </Pill>
        <Pill>
          <Typography size="body-paragraph-s" className="text-secondary-200">
            {t("shared.country")}:
          </Typography>
          <Typography size="body-paragraph-s" className="font-weight-500">
            {club.country}
          </Typography>
        </Pill>
      </div>
    </div>
  );
};
