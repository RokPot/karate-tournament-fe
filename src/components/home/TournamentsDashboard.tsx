import { TournamentsList } from "@/components/tournaments/TournamentsList";

interface TournamentsDashboardProps {
  source?: "all" | "registered";
}

export const TournamentsDashboard = ({
  source = "all",
}: TournamentsDashboardProps) => {
  return (
    <div className="p-6">
      <TournamentsList
        showCreateButton={false}
        titleSize="h2"
        source={source}
      />
    </div>
  );
};
