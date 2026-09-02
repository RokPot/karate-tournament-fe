import { ClubDetailView } from "@/components/clubs/ClubDetailView";
import { RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";
import { useRouter } from "next/router";

const ClubDetailPage = () => {
  const router = useRouter();
  const clubId = typeof router.query.id === "string" ? router.query.id : "";

  return <ClubDetailView clubId={clubId} />;
};

export default function Component() {
  return (
    <AuthGuard type="private" redirectTo={RouteConfig.signin}>
      <ClubDetailPage />
    </AuthGuard>
  );
}
