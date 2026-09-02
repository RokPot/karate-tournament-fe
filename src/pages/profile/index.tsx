import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { ProfileOverview } from "@/components/profile/ProfileOverview";
import { RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";

export default function ProfilePage() {
  return (
    <AuthGuard type="private" redirectTo={RouteConfig.signin}>
      <ProfileLayout>
        <ProfileOverview />
      </ProfileLayout>
    </AuthGuard>
  );
}
