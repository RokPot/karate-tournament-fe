import { ClubInvitationsSection } from "@/components/invitations/ClubInvitationsSection";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import Pill from "@/components/ui/Pill";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { ClubsQueries } from "@/data/clubs/clubs.queries";
import ClubMembersSection from "@/pages/clubs/ClubMembersSection";
import ClubTournamentSection from "@/pages/clubs/ClubTournamentSection";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ClubDetailViewProps {
  clubId: string;
  showTournaments?: boolean;
}

export const ClubDetailView = ({ clubId, showTournaments = false }: ClubDetailViewProps) => {
  const { t } = useTranslation();
  const { data: club, isLoading, error, refetch } = ClubsQueries.useFindOne(
    { id: clubId },
    { enabled: !!clubId },
  );

  if (!clubId || isLoading || !club) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-1 flex-row">
      <div className="flex min-w-[300px] max-w-[300px] flex-col gap-2 border-r border-primary-300 bg-primary-75 p-4">
        <div className="flex flex-row items-center justify-between">
          <Typography size="h2">{club.name}</Typography>
          <IconButton className="h-10 w-10">
            <FontAwesomeIcon icon={faPencil} className="text-tertiary-300" size="xs" />
          </IconButton>
        </div>
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
          <Pill>
            <Typography size="body-paragraph-s" className="text-secondary-200">
              {t("shared.membersCount")}:
            </Typography>
            <Typography size="body-paragraph-s" className="font-weight-500">
              {club.membersCount}
            </Typography>
          </Pill>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5 px-6 py-4">
        <ClubMembersSection clubId={clubId} />
        <ClubInvitationsSection clubId={clubId} />
        {showTournaments && <ClubTournamentSection clubId={clubId} />}
      </div>
    </div>
  );
};
