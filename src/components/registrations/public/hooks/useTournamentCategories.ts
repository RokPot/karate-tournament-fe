import { useMemo } from "react";

import { CategoriesQueries } from "@/data/categories/categories.queries";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";

export function useTournamentCategories(tournamentId: string) {
  const {
    data: tournament,
    isLoading: isTournamentLoading,
    error: tournamentError,
  } = TournamentsQueries.useFindOne(
    { id: tournamentId },
    { enabled: !!tournamentId },
  );

  const {
    data: allCategories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = CategoriesQueries.useFindAll({ enabled: !!tournamentId });

  const categories = useMemo(() => {
    if (!tournament || !allCategories) {
      return [];
    }
    const categoryIdSet = new Set(tournament.categoryIds);
    return allCategories.filter((category) => categoryIdSet.has(category.id));
  }, [tournament, allCategories]);

  return {
    tournament,
    categories,
    isLoading: isTournamentLoading || isCategoriesLoading,
    error: tournamentError ?? categoriesError,
  };
}
