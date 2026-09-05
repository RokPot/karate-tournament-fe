import { TournamentsList } from "@/components/tournaments/TournamentsList";
import { ClubsQueries } from "@/data/clubs/clubs.queries";
import { useAuthRoles } from "@/hooks/useAuthRoles";

interface IProps {
  clubId: string;
}

const ClubTournamentSection = ({ clubId }: IProps) => {
  const { isClubOwner, isClubCoach, isAdmin } = useAuthRoles();
  const canCreate = isClubOwner || isClubCoach || isAdmin;
  const { data, isLoading, error, refetch } = ClubsQueries.useGetTournaments(
    { id: clubId },
    { enabled: !!clubId },
  );

  return (
    <TournamentsList
      tournaments={data}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      showCreateButton={canCreate}
      createClubId={clubId}
      titleSize="h2"
      showClubColumn={false}
    />
  );
};

export default ClubTournamentSection;
