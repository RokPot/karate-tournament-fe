import { ClubsList } from "@/components/clubs/ClubsList";
import { TournamentsList } from "@/components/tournaments/TournamentsList";

export const AdminDashboard = () => {
  return (
    <div className="flex flex-col gap-8 p-6">
      <ClubsList showCreateButton={false} titleSize="h3" />
      <TournamentsList showCreateButton={false} titleSize="h3" />
    </div>
  );
};
