
import { RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";
import HomePage from "@/components/home/HomePage";

export default function Component() {
  return (
    <AuthGuard type="private" redirectTo={RouteConfig.signin}>
      <HomePage />
    </AuthGuard>
  );
}
