import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { TournamentsList } from "@/components/tournaments/TournamentsList";
import { RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";
import { ClubsQueries } from "@/data/clubs/clubs.queries";
import { TournamentsModels } from "@/data/tournaments/tournaments.models";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { useAuthRoles } from "@/hooks/useAuthRoles";
import { useAuthUser } from "@/hooks/useAuthUser";

const TournamentsPage = () => {
  const { isClubOwner, isClubCoach, isAdmin } = useAuthRoles();
  const authUser = useAuthUser();

  if (isAdmin) {
    return <AdminTournamentsView />;
  }

  if (isClubOwner || isClubCoach) {
    return <ClubTournamentsView clubId={authUser?.clubId ?? ""} />;
  }

  return <AllTournamentsView />;
};

type AdminTournamentTab = Extract<
  TournamentsModels.TournamentsFindAllStatusParam,
  "approved" | "pending" | "in_progress" | "ended"
>;

const AdminTournamentsView = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<AdminTournamentTab>("approved");
  const { data, isLoading, error, refetch } = TournamentsQueries.useFindAll({
    status: tab,
  });

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <Tabs
        value={tab}
        onChange={(_event, value: AdminTournamentTab) => setTab(value)}
        className="mb-4"
      >
        <Tab value="approved" label={t("tournaments.tabs.active")} />
        <Tab value="in_progress" label={t("tournaments.tabs.inProgress")} />
        <Tab value="ended" label={t("tournaments.tabs.ended")} />
        <Tab value="pending" label={t("tournaments.tabs.pending")} />
      </Tabs>
      <TournamentsList
        tournaments={data}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        showCreateButton={tab === "approved"}
        titleSize="h2"
        showApprovalActions={tab === "pending"}
        showStatusColumn={tab === "pending"}
        showClubColumn
        emptyLabel={
          tab === "approved" ? undefined : t(`tournaments.empty.${tab}`)
        }
      />
    </div>
  );
};

const ClubTournamentsView = ({ clubId }: { clubId: string }) => {
  const { data, isLoading, error, refetch } = ClubsQueries.useGetTournaments(
    { id: clubId },
    { enabled: !!clubId },
  );

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <TournamentsList
        tournaments={data}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        showCreateButton
        createClubId={clubId || undefined}
        titleSize="h2"
        showClubColumn={false}
      />
    </div>
  );
};

const AllTournamentsView = () => {
  const { data, isLoading, error, refetch } = TournamentsQueries.useFindAll({});

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <TournamentsList
        tournaments={data}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        titleSize="h2"
      />
    </div>
  );
};

export default function Component() {
  return (
    <AuthGuard type="private" redirectTo={RouteConfig.signin}>
      <TournamentsPage />
    </AuthGuard>
  );
}
