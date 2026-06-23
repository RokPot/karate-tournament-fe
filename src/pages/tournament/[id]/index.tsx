import { Button, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import AddOrCreateCategoryModal from "@/components/categories/AddOrCreateCategoryModal";
import { CategoryList } from "@/components/categories/CategoryList";
import RegistrationList from "@/components/registrations/RegistrationList";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import Pill from "@/components/ui/Pill";
import { Link } from "@/components/ui/text/Link/Link";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CategoriesQueries } from "@/data/categories/categories.queries";
import { CommonModels } from "@/data/common/common.models";
import { RegistrationsQueries } from "@/data/registrations/registrations.queries";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { useAuthRoles } from "@/hooks/useAuthRoles";
import { faAdd, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

const TournamentDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const tournamentId = id as string;
  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] = useState(false);
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<CommonModels.CategoryResponseDto | null>(null);
  const {
    data: tournament,
    isLoading: isTournamentLoading,
    error: tournamentError,
    refetch: refetchTournament,
  } = TournamentsQueries.useFindOne({ id: tournamentId, }, { enabled: !!tournamentId });

  const { isClubOwner, isAdmin } = useAuthRoles();

  const { data: allCategories } = CategoriesQueries.useFindAll();

  const { data: registrations } = RegistrationsQueries.useFindByTournament({ tournamentId, categoryId: selectedCategory?.id }, { enabled: !!tournamentId });
  // Filter categories that belong to this tournament
  const tournamentCategories = useMemo(() => {
    if (!tournament || !allCategories) return [];

    const categoriesById = new Map(allCategories.map((category) => [category.id, category]));
    return tournament.categoryIds.flatMap((categoryId) => {
      const category = categoriesById.get(categoryId);
      return category ? [category] : [];
    });
  }, [tournament, allCategories]);



  if (isTournamentLoading) {
    return <LoadingState />;
  }

  if (tournamentError || !tournament) {
    return <ErrorState error={tournamentError} onRetry={() => refetchTournament()} />;
  }

  return (
    <div className="flex flex-row flex-1">
      <div className="flex flex-col gap-2 border-r border-primary-300 bg-primary-75 p-4 min-w-[300px] max-w-[300px]">
        <div className="flex flex-row items-center justify-between">
          <Typography size="h2" >
            {tournament.name}
          </Typography>
          {isClubOwner && <IconButton className="h-10 w-10">
            <FontAwesomeIcon icon={faPencil} className="text-tertiary-300" size="xs" />
          </IconButton>}
        </div>
        <div className="flex flex-row gap-1 flex-wrap">
          <Pill>
            <Typography size="body-paragraph-s" className="text-secondary-200">
              {t("shared.location")}:
            </Typography>
            <Typography size="body-paragraph-s" className="font-weight-500">
              {tournament.location}
            </Typography>
          </Pill>
          <Pill>
            <Typography size="body-paragraph-s" className="font-weight-500">
              {new Date(tournament.startDate).toLocaleDateString()}
            </Typography>
          </Pill>
          <Pill>
            <Typography size="body-paragraph-s" className="text-secondary-200">
              {t("shared.registrationDeadline")}:
            </Typography>
            <Typography size="body-paragraph-s" className="font-weight-500">
              {new Date(tournament.registrationDeadline).toLocaleDateString()}
            </Typography>
          </Pill>
        </div>

        <Link href={`/tournament/${tournamentId}/registration`} >
          <Button variant="contained" className="w-full">
            {t("shared.registration")}
          </Button>
        </Link>

      </div>
      <div className="flex flex-col flex-1 p-4">
        <div>
          <Button variant="outlined" onClick={() => router.back()} className="mb-4!">
            {t("shared.back")}
          </Button>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <Typography size="h3">{t("categories.title")} ({tournamentCategories.length})</Typography>
          {(isClubOwner || isAdmin) && <Button variant="contained" onClick={() => setCreateCategoryDialogOpen(true)} >
            <div className="flex flex-row items-center gap-0-5">
              <FontAwesomeIcon icon={faAdd} />
              {t("categories.addCategory")}
            </div>
          </Button>}
        </div>
        <div className="max-w-[calc(100vw-330px)] pb-5">
          <CategoryList categories={tournamentCategories} setSelectedCategory={setSelectedCategory} />
        </div>
        <div className="mb-5 flex items-center">
          <Typography size="h3" className="mr-2">{t("registrations.attendees")} {selectedCategory ? " -" : ""}</Typography>
          {
            selectedCategory && <Typography size="h5" as="span" className="leading-none">{selectedCategory?.name} <span className="text-tertiary-300">({registrations?.length || 0})</span></Typography>
          }
        </div>
        <div className="max-w-[calc(100vw-300px)]">
          <RegistrationList registrations={registrations || []} />
        </div>

      </div>

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
