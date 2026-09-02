import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { ProfilePreferences } from "@/components/profile/ProfilePreferences";
import { RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";

export default function ProfilePreferencesPage() {
  return (
    <AuthGuard type="private" redirectTo={RouteConfig.signin}>
      <ProfileLayout>
        <ProfilePreferences />
      </ProfileLayout>
    </AuthGuard>
  );
}
