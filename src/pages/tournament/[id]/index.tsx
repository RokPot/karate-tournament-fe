import { Button, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import AddOrCreateCategoryModal from "@/components/categories/AddOrCreateCategoryModal";
import { CategoryList } from "@/components/categories/CategoryList";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { CategoryRegistrationsAccordion } from "@/components/tournaments/CategoryRegistrationsAccordion";
import { DeclineTournamentDialog } from "@/components/tournaments/DeclineTournamentDialog";
import { TournamentBracketsPanel } from "@/components/tournaments/TournamentBracketsPanel";
import { TournamentDetailShell } from "@/components/tournaments/TournamentDetailShell";
import {
  getTournamentRegistrationClosedCopy,
  isTournamentApproved,
  isTournamentDeclined,
  isTournamentEnded,
  isTournamentInProgress,
  isTournamentPending,
  isTournamentRegistrationOpen,
} from "@/components/tournaments/tournament-status";
import { useTournamentLifecycle } from "@/components/tournaments/useTournamentLifecycle";
import { useTournamentReview } from "@/components/tournaments/useTournamentReview";
import Pill from "@/components/ui/Pill";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { Link } from "@/components/ui/text/Link/Link";
import { Typography } from "@/components/ui/text/Typography/Typography";
import {
  getTournamentDetailRoute,
  getTournamentRegistrationRoute,
} from "@/config/route.config";
import { CategoriesQueries } from "@/data/categories/categories.queries";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { useAuthRoles } from "@/hooks/useAuthRoles";
import { useAuthUser } from "@/hooks/useAuthUser";
import { faAdd, faLink, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cx } from "class-variance-authority";
import { useTranslation } from "react-i18next";

const TOURNAMENT_DETAIL_TABS = [
  "overview",
  "registrations",
  "brackets",
] as const;

type TournamentDetailTab = (typeof TOURNAMENT_DETAIL_TABS)[number];

const parseTournamentDetailTab = (
  value: string | string[] | undefined,
): TournamentDetailTab | undefined => {
  const raw = Array.isArray(value) ? value[0] : value;
  return TOURNAMENT_DETAIL_TABS.includes(raw as TournamentDetailTab)
    ? (raw as TournamentDetailTab)
    : undefined;
};

const getDefaultTournamentDetailTab = (
  status?: string | null,
): TournamentDetailTab =>
  status === "in_progress" ? "brackets" : "overview";

const getTournamentDetailTabHref = (id: string, tab: TournamentDetailTab) =>
  `${getTournamentDetailRoute(id)}?tab=${tab}`;

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
  const { start, end, isLifecyclePending } = useTournamentLifecycle();

  const tournamentClubId = tournament?.clubId ?? undefined;
  const { data: allCategories } = CategoriesQueries.useFindAll(
    tournamentClubId
      ? { clubId: tournamentClubId, includeGlobal: true }
      : {},
    { enabled: !!tournamentId && (isAdmin || !!tournamentClubId) },
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
  const canManageSetup = Boolean(isAdmin || isOwningClubStaff);
  const registrationOpen = isTournamentRegistrationOpen(tournament);
  const registrationClosedCopy = getTournamentRegistrationClosedCopy(
    tournament,
    t,
  );
  const canReview = isAdmin && isTournamentPending(tournament);
  const canResubmit = isOwningClubStaff && isTournamentDeclined(tournament);
  const canStart = canManageSetup && isTournamentApproved(tournament);
  const canEnd = canManageSetup && isTournamentInProgress(tournament);
  const registrationPath = getTournamentRegistrationRoute(tournamentId);
  const activeTab =
    parseTournamentDetailTab(router.query.tab) ??
    getDefaultTournamentDetailTab(tournament.status);
  const bracketsUnlocked =
    isTournamentInProgress(tournament) || isTournamentEnded(tournament);

  const handleCopyRegistrationLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}${registrationPath}`).then(
      () => successToast({ text: t("tournaments.registration.copyLinkSuccess") }),
      () => undefined,
    );
  };

  const handleStart = () => {
    start.mutate(
      { id: tournamentId },
      {
        onSuccess: () => {
          router.replace(
            getTournamentDetailTabHref(tournamentId, "brackets"),
            undefined,
            { shallow: true },
          ).then(
            () => undefined,
            () => undefined,
          );
        },
      },
    );
  };

  return (
    <TournamentDetailShell
      activeTab={activeTab}
      tabs={TOURNAMENT_DETAIL_TABS.map((tab) => ({
        id: tab,
        href: getTournamentDetailTabHref(tournamentId, tab),
      }))}
      header={
        <section className="flex flex-col gap-3 rounded-m bg-secondary-200 p-4 shadow-1">
          <div className="flex flex-row flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-row items-center gap-2">
              <Button variant="outlined" onClick={() => router.back()}>
                {t("shared.back")}
              </Button>
              <Typography size="h2" className="truncate">
                {tournament.name}
              </Typography>
              {isClubOwner && (
                <IconButton className="h-10 w-10">
                  <FontAwesomeIcon
                    icon={faPencil}
                    className="text-primary-300"
                    size="xs"
                  />
                </IconButton>
              )}
            </div>
            <div className="flex flex-row flex-wrap items-center gap-2">
              {registrationOpen && (
                <>
                  <Link href={registrationPath} className="no-underline!">
                    <Button variant="contained">{t("shared.registration")}</Button>
                  </Link>
                  <Button variant="outlined" onClick={handleCopyRegistrationLink}>
                    <span className="flex flex-row items-center justify-center gap-2">
                      <FontAwesomeIcon icon={faLink} />
                      {t("tournaments.registration.copyLink")}
                    </span>
                  </Button>
                </>
              )}

              {canReview && (
                <>
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
                </>
              )}
              {canResubmit && (
                <Button
                  variant="contained"
                  disabled={isReviewPending}
                  onClick={() => resubmit.mutate({ id: tournamentId, data: {} })}
                >
                  {t("tournaments.review.resubmit")}
                </Button>
              )}
              {canStart && (
                <Button
                  variant="contained"
                  disabled={isLifecyclePending}
                  onClick={handleStart}
                >
                  {t("tournaments.lifecycle.start")}
                </Button>
              )}
              {canEnd && (
                <Button
                  variant="contained"
                  disabled={isLifecyclePending}
                  onClick={() => end.mutate({ id: tournamentId })}
                >
                  {t("tournaments.lifecycle.end")}
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-row flex-wrap gap-1">
            <Pill>
              <Typography size="body-paragraph-s" className="text-neutral-200">
                {t("tournaments.status.label")}:
              </Typography>
              <Typography size="body-paragraph-s" className="font-weight-500">
                {t(`tournaments.status.${tournament.status}`)}
              </Typography>
            </Pill>
            <Pill>
              <Typography size="body-paragraph-s" className="text-neutral-200">
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
              <Typography size="body-paragraph-s" className="text-neutral-200">
                {t("shared.registrationDeadline")}:
              </Typography>
              <Typography size="body-paragraph-s" className="font-weight-500">
                {new Date(tournament.registrationDeadline).toLocaleDateString()}
              </Typography>
            </Pill>
          </div>
          {!registrationOpen && (
            <Typography size="body-paragraph-s" className="text-neutral-200">
              {registrationClosedCopy?.body ??
                t("tournaments.registration.locked")}
            </Typography>
          )}
          {isTournamentDeclined(tournament) && tournament.reviewNote && (
            <Typography size="body-paragraph-s" className="text-neutral-200">
              {tournament.reviewNote}
            </Typography>
          )}
        </section>
      }
    >
      <div
        className={cx(
          "flex flex-col gap-5",
          activeTab !== "overview" && "hidden",
        )}
      >
        <div className="flex items-center justify-between">
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
        <CategoryList categories={tournamentCategories} />
      </div>

      <div className={cx(activeTab !== "registrations" && "hidden")}>
        <CategoryRegistrationsAccordion
          categories={tournamentCategories}
          tournamentId={tournamentId}
        />
      </div>

      <div
        className={cx(
          "flex min-h-0 flex-1 flex-col",
          activeTab !== "brackets" && "hidden",
        )}
      >
        <TournamentBracketsPanel
          tournamentId={tournamentId}
          categories={tournamentCategories}
          canManageSetup={canManageSetup}
          isUnlocked={bracketsUnlocked}
        />
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
    </TournamentDetailShell>
  );
};

export default TournamentDetailPage;
