import { Button, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useState, useMemo } from "react";

import { CategoryList } from "@/components/categories/CategoryList";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { CategoriesQueries } from "@/data/categories/categories.queries";
import { useTranslation } from "react-i18next";
import RegistrationList from "@/components/registrations/RegistrationList";
import { CategoriesModels } from "@/data/categories/categories.models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faPencil } from "@fortawesome/free-solid-svg-icons";
import AddOrCreateCategoryModal from "@/components/categories/AddOrCreateCategoryModal";

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
      <div className="flex flex-col gap-2 p-4 border-r border-secondary-200 min-w-[300px] max-w-[300px]">
        <div className="flex flex-row items-center justify-between">
          <Typography size="h2" >
            {tournament.name}
          </Typography>
          <IconButton className="h-10 w-10">
            <FontAwesomeIcon icon={faPencil} className="text-primary-200" size="xs" />
          </IconButton>
        </div>
        <div className="flex flex-row gap-1 flex-wrap">
          <div className="flex flex-row flex-wrap items-center gap-0-5 rounded-[22px] bg-secondary-100 border border-elevation-outline-1 px-3 py-1-5 w-fit">
            <Typography size="body-paragraph-s" className="text-text-inverted-secondary">
              {t("shared.location")}:
            </Typography>
            <Typography size="body-paragraph-s" className="font-weight-500">
              {tournament.location}
            </Typography>
          </div>
          <div className="flex flex-row flex-wrap items-center gap-0-5 rounded-[22px] bg-secondary-100 border border-elevation-outline-1 px-3 py-1-5 w-fit">
            <Typography size="body-paragraph-s" className="font-weight-500">
              {new Date(tournament.startDate).toLocaleDateString()}
            </Typography>
          </div>
          <div className="flex flex-row flex-wrap items-center gap-0-5 rounded-[22px] bg-secondary-100 border border-elevation-outline-1 px-3 py-1-5 w-fit">
            <Typography size="body-paragraph-s" className="text-text-inverted-secondary">
              {t("shared.registrationDeadline")}:
            </Typography>
            <Typography size="body-paragraph-s" className="font-weight-500">
              {new Date(tournament.registrationDeadline).toLocaleDateString()}
            </Typography>
          </div>
        </div>

      </div>
      <div className="flex flex-col flex-1 p-4">
        <div>
          <Button variant="outlined" onClick={() => router.back()} className="mb-4!">
            {t("shared.back")}
          </Button>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <Typography size="h3">{t("categories.title")} ({tournamentCategories.length})</Typography>
          <Button variant="contained" onClick={() => setCreateCategoryDialogOpen(true)}>
            <div className="flex flex-row items-center gap-0-5">
              <FontAwesomeIcon icon={faAdd} />
              {t("categories.addCategory")}
            </div>
          </Button>
        </div>
        <div className="max-w-[calc(100vw-330px)] pb-5">
          <CategoryList categories={tournamentCategories} setSelectedCategory={setSelectedCategory} />
        </div>
        <div className="mb-5 flex items-center">
          <Typography size="h3" className="mr-2">{t("registrations.attendees")} {selectedCategory ? " -" : ""}</Typography>
          {
            selectedCategory && <Typography size="h5" as="span" className="leading-none">{selectedCategory?.name} <span className="text-primary-500">({[].length})</span></Typography>
          }
        </div>
        <div className="max-w-[calc(100vw-300px)]">
          <RegistrationList registrations={[]} />
        </div>

      </div>

      {/* <CreateCategoryForm
        open={createCategoryDialogOpen}
        onClose={() => setCreateCategoryDialogOpen(false)}
        tournamentId={tournamentId}
        currentCategoryIds={tournament.categoryIds}
      /> */}

      <AddOrCreateCategoryModal
        open={createCategoryDialogOpen}
        onClose={() => setCreateCategoryDialogOpen(false)}
        tournamentId={tournamentId}
        currentCategoryNames={tournament.categoryIds}
      />
    </div >
  );
};

export default TournamentDetailPage;
