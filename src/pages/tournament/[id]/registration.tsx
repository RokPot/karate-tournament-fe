import { useRouter } from "next/router";

import {
  PublicRegistrationWizard,
  RegistrationPageHeader,
} from "@/components/registrations/public";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";

const RegistrationPage = () => {
  const router = useRouter();
  const tournamentId = router.query.id as string;

  const {
    data:
    tournament,
    isLoading,
    error,
    refetch,
  } = TournamentsQueries.useFindOnePublic(
    { id: tournamentId },
    { enabled: !!tournamentId },
  );

  if (!tournamentId || isLoading) {
    return <LoadingState />;
  }

  if (error || !tournament) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col ">
      <RegistrationPageHeader tournament={tournament} />
      <PublicRegistrationWizard tournamentId={tournamentId} />
    </div>
  );
};

export default RegistrationPage;
