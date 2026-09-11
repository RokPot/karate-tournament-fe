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
import { Button, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface ClubDetailViewProps {
  clubId: string;
  showTournaments?: boolean;
}

export const ClubDetailView = ({
  clubId,
  showTournaments = false,
}: ClubDetailViewProps) => {
  const { t } = useTranslation();
  const router = useRouter();
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
    <div className="flex flex-1 flex-col gap-6 bg-secondary-75 p-6">
      <section className="flex flex-col gap-3 rounded-m bg-secondary-200 p-4 shadow-1">
        <div className="flex min-w-0 flex-row flex-wrap items-center gap-2">
          <Button variant="outlined" onClick={() => router.back()}>
            {t("shared.back")}
          </Button>
          <Typography size="h2" className="truncate">
            {club.name}
          </Typography>
          <IconButton className="h-10 w-10">
            <FontAwesomeIcon
              icon={faPencil}
              className="text-primary-300"
              size="xs"
            />
          </IconButton>
        </div>
        <div className="flex flex-row flex-wrap gap-1">
          <Pill>
            <Typography size="body-paragraph-s" className="text-neutral-200">
              {t("shared.location")}:
            </Typography>
            <Typography size="body-paragraph-s" className="font-weight-500">
              {club.address}
            </Typography>
          </Pill>
          <Pill>
            <Typography size="body-paragraph-s" className="text-neutral-200">
              {t("shared.country")}:
            </Typography>
            <Typography size="body-paragraph-s" className="font-weight-500">
              {club.country}
            </Typography>
          </Pill>
          <Pill>
            <Typography size="body-paragraph-s" className="text-neutral-200">
              {t("shared.membersCount")}:
            </Typography>
            <Typography size="body-paragraph-s" className="font-weight-500">
              {club.membersCount}
            </Typography>
          </Pill>
        </div>
      </section>

      <div className="flex flex-1 flex-col gap-5">
        <ClubMembersSection clubId={clubId} />
        <ClubInvitationsSection clubId={clubId} />
        {showTournaments && <ClubTournamentSection clubId={clubId} />}
      </div>
    </div>
  );
};
