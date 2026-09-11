import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ClubsList } from "@/components/clubs/ClubsList";
import {
  DashboardPanel,
  DashboardStatCard,
} from "@/components/home/DashboardPanel";
import { TournamentsList } from "@/components/tournaments/TournamentsList";
import { Link } from "@/components/ui/text/Link/Link";
import { RouteConfig } from "@/config/route.config";
import { ClubsQueries } from "@/data/clubs/clubs.queries";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";

export const AdminDashboard = () => {
  const { t } = useTranslation();
  const { data: clubs } = ClubsQueries.useFindAll();
  const {
    data: approvedTournaments,
    isLoading: isApprovedLoading,
    error: approvedError,
    refetch: refetchApproved,
  } = TournamentsQueries.useFindAll({
    status: "approved",
  });
  const {
    data: inProgressTournaments,
    isLoading: isInProgressLoading,
    error: inProgressError,
    refetch: refetchInProgress,
  } = TournamentsQueries.useFindAll({
    status: "in_progress",
  });
  const { data: pendingTournaments } = TournamentsQueries.useFindAll({
    status: "pending",
  });

  const activeTournaments = useMemo(() => {
    const merged = [
      ...(approvedTournaments ?? []),
      ...(inProgressTournaments ?? []),
    ];
    return merged.sort(
      (left, right) =>
        new Date(right.startDate).getTime() -
        new Date(left.startDate).getTime(),
    );
  }, [approvedTournaments, inProgressTournaments]);

  return (
    <div className="flex flex-col gap-6 bg-secondary-75 p-6">
      <div className="grid grid-cols-1 gap-4 t:grid-cols-3">
        <DashboardStatCard
          label={t("dashboard.stats.clubs")}
          value={clubs?.length ?? 0}
        />
        <DashboardStatCard
          label={t("dashboard.stats.activeTournaments")}
          value={activeTournaments.length}
        />
        <DashboardStatCard
          label={t("dashboard.stats.pendingRequests")}
          value={pendingTournaments?.length ?? 0}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 m:grid-cols-2">
        <DashboardPanel
          title={t("clubs.title")}
          action={
            <Link href={RouteConfig.clubs} className="no-underline!">
              {t("dashboard.viewAll")}
            </Link>
          }
        >
          <ClubsList showCreateButton={false} hideHeader />
        </DashboardPanel>
        <DashboardPanel
          title={t("shared.tournaments")}
          action={
            <Link href={RouteConfig.tournaments} className="no-underline!">
              {t("dashboard.viewAll")}
            </Link>
          }
        >
          <TournamentsList
            tournaments={activeTournaments}
            isLoading={isApprovedLoading || isInProgressLoading}
            error={approvedError || inProgressError}
            onRetry={() => {
              refetchApproved();
              refetchInProgress();
            }}
            showCreateButton={false}
            hideHeader
            showClubColumn={false}
            showStatusColumn
          />
        </DashboardPanel>
      </div>
    </div>
  );
};
