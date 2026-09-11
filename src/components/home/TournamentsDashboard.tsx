import { DashboardPanel } from "@/components/home/DashboardPanel";
import { TournamentsList } from "@/components/tournaments/TournamentsList";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { useTranslation } from "react-i18next";

interface TournamentsDashboardProps {
  source?: "all" | "registered";
}

export const TournamentsDashboard = ({
  source = "all",
}: TournamentsDashboardProps) => {
  if (source === "registered") {
    return <RegisteredTournamentsDashboard />;
  }

  return <AllTournamentsDashboard />;
};

const AllTournamentsDashboard = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = TournamentsQueries.useFindAll({});

  return (
    <div className="bg-secondary-75 p-6">
      <DashboardPanel title={t("shared.tournaments")}>
        <TournamentsList
          tournaments={data}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          showCreateButton={false}
          hideHeader
          showClubColumn={false}
          showStatusColumn
        />
      </DashboardPanel>
    </div>
  );
};

const RegisteredTournamentsDashboard = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } =
    TournamentsQueries.useFindRegistered();

  return (
    <div className="bg-secondary-75 p-6">
      <DashboardPanel title={t("shared.tournaments")}>
        <TournamentsList
          tournaments={data}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          showCreateButton={false}
          hideHeader
          showClubColumn={false}
          showStatusColumn={false}
        />
      </DashboardPanel>
    </div>
  );
};
