import { useAuthUser } from "@/hooks/useAuthUser";

export const useAuthRoles = () => {
  const authUser = useAuthUser();
  const isAdmin = authUser?.roles.includes("admin");
  const isClubCoach = authUser?.roles.includes("club_coach");
  const isClubCompetitor = authUser?.roles.includes("club_member");
  const isClubOwner = authUser?.roles.includes("club_owner");
  const isFreeCompetitor = authUser?.roles.includes("free_member");
  const isJudge = authUser?.roles.includes("judge");
  return {
    isAdmin,
    isClubCoach,
    isClubCompetitor,
    isClubOwner,
    isFreeCompetitor,
    isJudge,
  };
};
