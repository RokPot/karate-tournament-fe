import ClubsPage from "@/components/clubs/ClubsPage";
import { RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";


export default function Component() {
    return (
        <AuthGuard type="private" redirectTo={RouteConfig.signin}>
            <ClubsPage />
        </AuthGuard>
    );
}