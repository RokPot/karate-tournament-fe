import { Button, Card, CardContent } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

import { CreateTournamentForm } from "@/components/tournaments/CreateTournamentForm";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { getTournamentDetailRoute, RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";

const TournamentsPage = () => {
    const router = useRouter();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const { data: tournaments, isLoading, error, refetch } = TournamentsQueries.useFindAll();

    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={() => refetch()} />;
    }

    const hasTournaments = tournaments && Array.isArray(tournaments) && tournaments.length > 0;

    return (
        <div className="w-full max-w-7xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <Typography size="h2">Tournaments</Typography>
                <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
                    Create Tournament
                </Button>
            </div>

            {!hasTournaments ? (
                <div className="flex flex-col items-center justify-center gap-4 p-10 min-h-[400px]">
                    <Typography size="body-paragraph-lg">No tournaments found</Typography>
                    <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
                        Create Your First Tournament
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tournaments.map((tournament) => (
                        <Card
                            key={tournament.id}
                            className="cursor-pointer transition-shadow hover:shadow-lg"
                            onClick={() => router.push(getTournamentDetailRoute(tournament.id))}
                        >
                            <CardContent>
                                <Typography size="h5" className="mb-2">
                                    {tournament.name}
                                </Typography>
                                <Typography size="body-paragraph-m" className="mb-1 text-gray-600">
                                    Location: {tournament.location}
                                </Typography>
                                <Typography size="body-paragraph-m" className="mb-1 text-gray-600">
                                    Date: {new Date(tournament.date).toLocaleDateString()}
                                </Typography>
                                <Typography size="body-paragraph-m" className="mb-1 text-gray-600">
                                    Start Time: {new Date(tournament.startDate).toLocaleTimeString()}
                                </Typography>
                                <Typography size="body-paragraph-s" className="text-gray-500">
                                    Categories: {tournament.categoryIds.length}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <CreateTournamentForm open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} />
        </div>
    );
};

export default function Component() {
    return (
        <AuthGuard type="private" redirectTo={RouteConfig.signin}>
            <TournamentsPage />
        </AuthGuard>
    );
}
