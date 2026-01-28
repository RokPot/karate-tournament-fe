import { Button, Card, CardContent } from "@mui/material";
import { useRouter } from "next/router";
import { useState, useMemo } from "react";

import { CreateCategoryForm } from "@/components/categories/CreateCategoryForm";
import { CategoryList } from "@/components/categories/CategoryList";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { CategoriesQueries } from "@/data/categories/categories.queries";

const TournamentDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const tournamentId = id as string;
  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] = useState(false);

  const {
    data: tournament,
    isLoading: isTournamentLoading,
    error: tournamentError,
    refetch: refetchTournament,
  } = TournamentsQueries.useFindOne({ id: tournamentId }, { enabled: !!tournamentId });

  const { data: allCategories } = CategoriesQueries.useFindAll();

  // Filter categories that belong to this tournament
  const tournamentCategories = useMemo(() => {
    if (!tournament || !allCategories) return [];
    return allCategories.filter((category) => tournament.categoryIds.includes(category.id));
  }, [tournament, allCategories]);

  if (isTournamentLoading) {
    return <LoadingState />;
  }

  if (tournamentError || !tournament) {
    return <ErrorState error={tournamentError} onRetry={() => refetchTournament()} />;
  }

  return (
    <div className="container mx-auto p-6">
      <Button variant="outlined" onClick={() => router.back()} className="mb-4!">
        Back
      </Button>

      <Card className="mb-6 shadow-card!">
        <CardContent>
          <Typography size="h2" className="mb-4">
            {tournament.name}
          </Typography>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Typography size="body-paragraph-m" className="text-gray-600">
              <strong>Location:</strong> {tournament.location}
            </Typography>
            <Typography size="body-paragraph-m" className="text-gray-600">
              <strong>Date:</strong> {new Date(tournament.startDate).toLocaleDateString()}
            </Typography>
            <Typography size="body-paragraph-m" className="text-gray-600">
              <strong>Start Time:</strong> {new Date(tournament.startDate).toLocaleTimeString()}
            </Typography>
            <Typography size="body-paragraph-m" className="text-gray-600">
              <strong>Registration Deadline:</strong>{" "}
              {new Date(tournament.registrationDeadline).toLocaleString()}
            </Typography>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex items-center justify-between">
        <Typography size="h3">Categories ({tournamentCategories.length})</Typography>
        <Button variant="contained" onClick={() => setCreateCategoryDialogOpen(true)}>
          Create Category
        </Button>
      </div>

      <CategoryList categories={tournamentCategories} />

      <CreateCategoryForm
        open={createCategoryDialogOpen}
        onClose={() => setCreateCategoryDialogOpen(false)}
        tournamentId={tournamentId}
        currentCategoryIds={tournament.categoryIds}
      />
    </div>
  );
};

export default TournamentDetailPage;
