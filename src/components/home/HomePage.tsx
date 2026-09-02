import { AdminDashboard } from "@/components/home/AdminDashboard";
import { ClubProfileDashboard } from "@/components/home/ClubProfileDashboard";
import { ClubStaffDashboard } from "@/components/home/ClubStaffDashboard";
import { TournamentsDashboard } from "@/components/home/TournamentsDashboard";
import { useAuthRoles } from "@/hooks/useAuthRoles";
import { useAuthUser } from "@/hooks/useAuthUser";

const HomePage = () => {
  const authUser = useAuthUser();
  const { isAdmin, isClubOwner, isClubCoach, isClubCompetitor, isJudge, isFreeCompetitor } = useAuthRoles();
  const clubId = authUser?.clubId ?? "";

  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isClubOwner || isClubCoach) {
    return <ClubStaffDashboard clubId={clubId} />;
  }

  if (isClubCompetitor) {
    return <ClubProfileDashboard clubId={clubId} />;
  }

  if (isJudge || isFreeCompetitor) {
    return <TournamentsDashboard />;
  }

  return <TournamentsDashboard />;
};

export default HomePage;
