import LandingPage from "@/components/landing/LandingPage";
import { RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";

export default function Component() {
  return (
    <AuthGuard type="public-only" redirectTo={RouteConfig.dashboard}>
      <LandingPage />
    </AuthGuard>
  );
}
