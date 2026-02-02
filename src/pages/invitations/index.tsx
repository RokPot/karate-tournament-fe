import { useRouter } from "next/router";
import { useEffect } from "react";

import { InvitationsPage } from "@/components/invitations/InvitationsPage";
import { RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";
import { useAuthRoles } from "@/hooks/useAuthRoles";

export default function InvitationsRoute() {
  const router = useRouter();
  const { isAdmin } = useAuthRoles();

  useEffect(() => {
    if (isAdmin === false) {
      router.replace(RouteConfig.home);
    }
  }, [isAdmin, router]);

  return (
    <AuthGuard type="private" redirectTo={RouteConfig.signin}>
      {isAdmin ? <InvitationsPage /> : null}
    </AuthGuard>
  );
}
