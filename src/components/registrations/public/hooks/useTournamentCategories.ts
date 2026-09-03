import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";

export function useTournamentCategories(tournamentId: string) {
  const {
    data: tournament,
    isLoading,
    error,
  } = TournamentsQueries.useFindOnePublic(
    { id: tournamentId },
    { enabled: !!tournamentId },
  );

  return {
    tournament,
    categories: tournament?.categories ?? [],
    isLoading,
    error,
  };
}
