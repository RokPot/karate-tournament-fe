import { ProfileAccount } from "@/components/profile/ProfileAccount";
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";

export default function ProfileAccountPage() {
  return (
    <AuthGuard type="private" redirectTo={RouteConfig.signin}>
      <ProfileLayout>
        <ProfileAccount />
      </ProfileLayout>
    </AuthGuard>
  );
}
