import { TournamentsList } from "@/components/tournaments/TournamentsList";
import { RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";
import { useAuthRoles } from "@/hooks/useAuthRoles";

const TournamentsPage = () => {
  const { isClubOwner, isAdmin } = useAuthRoles();

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <TournamentsList showCreateButton={isClubOwner || isAdmin} titleSize="h2" />
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
