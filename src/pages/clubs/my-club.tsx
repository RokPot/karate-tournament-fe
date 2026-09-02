import { ClubDetailView } from "@/components/clubs/ClubDetailView";
import { AuthContext } from "@/data/auth/auth.context";

const MyClub = () => {
  const { user: authUser } = AuthContext.useAuth();
  const clubId = authUser?.clubId ?? "";

  return <ClubDetailView clubId={clubId} showTournaments />;
};

export default MyClub;
