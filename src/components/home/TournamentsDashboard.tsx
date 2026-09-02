import { TournamentsList } from "@/components/tournaments/TournamentsList";

export const TournamentsDashboard = () => {
  return (
    <div className="p-6">
      <TournamentsList showCreateButton={false} titleSize="h2" />
    </div>
  );
};
