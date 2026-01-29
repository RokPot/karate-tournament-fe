import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useState, useMemo } from "react";

import { CreateCategoryForm } from "@/components/categories/CreateCategoryForm";
import { CategoryList } from "@/components/categories/CategoryList";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { CategoriesQueries } from "@/data/categories/categories.queries";
import { useTranslation } from "react-i18next";
import RegistrationList from "@/components/registrations/RegistrationList";
import { CategoriesModels } from "@/data/categories/categories.models";

const TournamentDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const tournamentId = id as string;
  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] = useState(false);
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<CategoriesModels.CategoryResponseDto | null>(null);
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
    <div className="flex flex-row flex-1">
      <div className="flex flex-col gap-1 p-4 border-r border-secondary-200">
        <Typography size="h2" className="mb-4">
          {tournament.name}
        </Typography>
        <Typography size="body-paragraph-m" className="text-gray-600">
          <strong>{t("shared.location")}:</strong> {tournament.location}
        </Typography>
        <Typography size="body-paragraph-m" className="text-gray-600">
          <strong>{t("shared.startDate")}:</strong> {new Date(tournament.startDate).toLocaleDateString()}
        </Typography>
        <Typography size="body-paragraph-m" className="text-gray-600">
          <strong>{t("shared.registrationDeadline")}:</strong>{" "}
          {new Date(tournament.registrationDeadline).toLocaleString()}
        </Typography>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div>
          <Button variant="outlined" onClick={() => router.back()} className="mb-4!">
            Back
          </Button>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <Typography size="h3">{t("categories.title")} ({tournamentCategories.length})</Typography>
          <Button variant="contained" onClick={() => setCreateCategoryDialogOpen(true)}>
            {t("categories.create.title")}
          </Button>
        </div>
        <div className="max-w-[calc(100vw-300px)] pb-5">
          <CategoryList categories={tournamentCategories} setSelectedCategory={setSelectedCategory} />
        </div>
        <div className="mb-5 flex items-center">
          <Typography size="h3" className="mr-2">{t("registrations.attendees")} -</Typography>
          <Typography size="h5" as="span">{selectedCategory?.name} <span className="text-primary-500">({[].length})</span></Typography>
        </div>
        <div className="max-w-[calc(100vw-300px)]">
          <RegistrationList registrations={[]} />
        </div>

      </div>

      <CreateCategoryForm
        open={createCategoryDialogOpen}
        onClose={() => setCreateCategoryDialogOpen(false)}
        tournamentId={tournamentId}
        currentCategoryIds={tournament.categoryIds}
      />
    </div >
  );
};

export default TournamentDetailPage;
