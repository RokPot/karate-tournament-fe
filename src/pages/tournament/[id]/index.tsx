import { Button, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import AddOrCreateCategoryModal from "@/components/categories/AddOrCreateCategoryModal";
import { CategoryList } from "@/components/categories/CategoryList";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { CategoryRegistrationsAccordion } from "@/components/tournaments/CategoryRegistrationsAccordion";
import { DeclineTournamentDialog } from "@/components/tournaments/DeclineTournamentDialog";
import {
  getRegistrationClosedI18nKeys,
  getRegistrationWindowState,
  isRegistrationWindowOpen,
  isTournamentApproved,
  isTournamentDeclined,
  isTournamentPending,
  TOURNAMENT_STATUS_I18N_KEYS,
} from "@/components/tournaments/tournament-status";
import { useTournamentReview } from "@/components/tournaments/useTournamentReview";
import Pill from "@/components/ui/Pill";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { Link } from "@/components/ui/text/Link/Link";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { getTournamentRegistrationRoute } from "@/config/route.config";
import { CategoriesQueries } from "@/data/categories/categories.queries";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { useAuthRoles } from "@/hooks/useAuthRoles";
import { useAuthUser } from "@/hooks/useAuthUser";
import { faAdd, faLink, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

const TournamentDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const tournamentId = id as string;
  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] =
    useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const { t } = useTranslation();
  const { successToast } = useToast();
  const authUser = useAuthUser();
  const {
    data: tournament,
    isLoading: isTournamentLoading,
    error: tournamentError,
    refetch: refetchTournament,
  } = TournamentsQueries.useFindOne(
    { id: tournamentId },
    { enabled: !!tournamentId },
  );

  const { isClubOwner, isClubCoach, isAdmin } = useAuthRoles();
  const { approve, decline, resubmit, isReviewPending } = useTournamentReview();

  const { data: allCategories } = CategoriesQueries.useFindAll(
    { clubId: isAdmin ? undefined : (tournament?.clubId ?? undefined) },
    { enabled: !!tournamentId && (isAdmin || !!tournament?.clubId) },
  );

  const tournamentCategories = useMemo(() => {
    if (!tournament || !allCategories) return [];

    const categoriesById = new Map(
      allCategories.map((category) => [category.id, category]),
    );
    return tournament.categoryIds.flatMap((categoryId) => {
      const category = categoriesById.get(categoryId);
      return category ? [category] : [];
    });
  }, [tournament, allCategories]);

  if (isTournamentLoading) {
    return <LoadingState />;
  }

  if (tournamentError || !tournament) {
    return (
      <ErrorState error={tournamentError} onRetry={() => refetchTournament()} />
    );
  }

  const isOwningClubStaff =
    (isClubOwner || isClubCoach) &&
    !!authUser?.clubId &&
    authUser.clubId === tournament.clubId;
  const canManageSetup = isAdmin || isOwningClubStaff;
  const windowState = getRegistrationWindowState(tournament);
  const registrationOpen =
    isTournamentApproved(tournament) && isRegistrationWindowOpen(tournament);
  const registrationClosedCopy =
    windowState === "open"
      ? null
      : getRegistrationClosedI18nKeys(windowState);
  const canReview = isAdmin && isTournamentPending(tournament);
  const canResubmit = isOwningClubStaff && isTournamentDeclined(tournament);
  const registrationPath = getTournamentRegistrationRoute(tournamentId);

  const handleCopyRegistrationLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}${registrationPath}`).then(
      () => successToast({ text: t("tournaments.registration.copyLinkSuccess") }),
      () => undefined,
    );
  };

  return (
    <div className="flex flex-row flex-1">
      <div className="flex flex-col gap-2 border-r border-primary-300 bg-primary-75 p-4 min-w-[300px] max-w-[300px]">
        <div className="flex flex-row items-center justify-between">
          <Typography size="h2">{tournament.name}</Typography>
          {isClubOwner && (
            <IconButton className="h-10 w-10">
              <FontAwesomeIcon
                icon={faPencil}
                className="text-tertiary-300"
                size="xs"
              />
            </IconButton>
          )}
        </div>
        <div className="flex flex-row gap-1 flex-wrap">
          <Pill>
            <Typography size="body-paragraph-s" className="text-secondary-200">
              {t("tournaments.status.label")}:
            </Typography>
            <Typography size="body-paragraph-s" className="font-weight-500">
              {t(TOURNAMENT_STATUS_I18N_KEYS[tournament.status])}
            </Typography>
          </Pill>
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
        {isTournamentDeclined(tournament) && tournament.reviewNote && (
          <Typography size="body-paragraph-s" className="text-secondary-200">
            {tournament.reviewNote}
          </Typography>
        )}

        {registrationOpen ? (
          <Link href={registrationPath}>
            <Button variant="contained" className="w-full">
              {t("shared.registration")}
            </Button>
          </Link>
        ) : (
          <>
            <Button variant="contained" className="w-full" disabled>
              {t("shared.registration")}
            </Button>
            <Typography size="body-paragraph-s" className="text-secondary-200">
              {registrationClosedCopy && isTournamentApproved(tournament)
                ? t(registrationClosedCopy.body)
                : t("tournaments.registration.locked")}
            </Typography>
          </>
        )}

        <Button
          variant="outlined"
          className="w-full"
          onClick={handleCopyRegistrationLink}
        >
          <span className="flex flex-row items-center justify-center gap-2">
            <FontAwesomeIcon icon={faLink} />
            {t("tournaments.registration.copyLink")}
          </span>
        </Button>

        {canReview && (
          <div className="flex flex-col gap-2 mt-2">
            <Button
              variant="contained"
              disabled={isReviewPending}
              onClick={() => approve.mutate({ id: tournamentId })}
            >
              {t("tournaments.review.approve")}
            </Button>
            <Button
              variant="outlined"
              color="error"
              disabled={isReviewPending}
              onClick={() => setDeclineOpen(true)}
            >
              {t("tournaments.review.decline")}
            </Button>
          </div>
        )}

        {canResubmit && (
          <Button
            variant="contained"
            className="mt-2"
            disabled={isReviewPending}
            onClick={() => resubmit.mutate({ id: tournamentId, data: {} })}
          >
            {t("tournaments.review.resubmit")}
          </Button>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div>
          <Button
            variant="outlined"
            onClick={() => router.back()}
            className="mb-4!"
          >
            {t("shared.back")}
          </Button>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <Typography size="h3">
            {t("categories.title")} ({tournamentCategories.length})
          </Typography>
          {canManageSetup && (
            <Button
              variant="contained"
              onClick={() => setCreateCategoryDialogOpen(true)}
            >
              <div className="flex flex-row items-center gap-0-5">
                <FontAwesomeIcon icon={faAdd} />
                {t("categories.addCategory")}
              </div>
            </Button>
          )}
        </div>
        <div className="max-w-[calc(100vw-330px)] pb-5">
          <CategoryList categories={tournamentCategories} />
        </div>
        <div className="mb-5 flex items-center">
          <Typography size="h3">{t("registrations.title")}</Typography>
        </div>
        <div className="max-w-[calc(100vw-330px)] pb-5">
          <CategoryRegistrationsAccordion
            categories={tournamentCategories}
            tournamentId={tournamentId}
          />
        </div>
      </div>

      <AddOrCreateCategoryModal
        open={createCategoryDialogOpen}
        onClose={() => setCreateCategoryDialogOpen(false)}
        tournamentId={tournamentId}
        currentCategoryNames={tournament.categoryIds}
      />
      <DeclineTournamentDialog
        open={declineOpen}
        isPending={decline.isPending}
        onClose={() => setDeclineOpen(false)}
        onConfirm={(reason) => {
          decline.mutate(
            { id: tournamentId, data: reason ? { reason } : {} },
            { onSuccess: () => setDeclineOpen(false) },
          );
        }}
      />
    </div>
  );
};

export default TournamentDetailPage;
