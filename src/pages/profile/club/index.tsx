import { ProfileClub } from "@/components/profile/ProfileClub";
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";

export default function ProfileClubPage() {
  return (
    <AuthGuard type="private" redirectTo={RouteConfig.signin}>
      <ProfileLayout>
        <ProfileClub />
      </ProfileLayout>
    </AuthGuard>
  );
}
