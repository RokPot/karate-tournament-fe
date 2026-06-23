import { Button } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { HeaderCell, TextCell } from "@/components/categories/CategoryList";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { CreateTournamentModal } from "@/components/tournaments/CreateTournamentModal";
import { Table } from "@/components/ui/table/Table";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { getTournamentDetailRoute, RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";
import { CommonModels } from "@/data/common/common.models";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { useAuthRoles } from "@/hooks/useAuthRoles";
import { DateUtils } from "@/util/date.utils";

const TournamentsPage = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const { data: tournaments, isLoading, error, refetch } = TournamentsQueries.useFindAll();
    const { isClubOwner, isAdmin } = useAuthRoles();

    const columns: ColumnDef<CommonModels.TournamentResponseDto>[] = useMemo(
        () => [
            {
                header: ({ header }) => HeaderCell(header, t("shared.name")),
                accessorKey: "name",
                cell: ({ row }) => TextCell(row.original.name),
            },
            {
                header: ({ header }) => HeaderCell(header, t("shared.location")),
                accessorKey: "location",
                cell: ({ row }) => TextCell(row.original.location || "—"),
            },
            {
                header: ({ header }) => HeaderCell(header, t("shared.registrationDeadline")),
                accessorKey: "registrationDeadline",
                cell: ({ row }) =>
                    TextCell(DateUtils.parseAndFormatDateTimeToLocaleShort(row.original.registrationDeadline)),
            },
            {
                header: ({ header }) => HeaderCell(header, t("shared.startDate")),
                accessorKey: "startDate",
                cell: ({ row }) =>
                    TextCell(DateUtils.parseAndFormatDateTimeToLocaleShort(row.original.startDate)),
            },
            {
                header: ({ header }) => HeaderCell(header, t("shared.categories")),
                accessorKey: "categoryIds",
                cell: ({ row }) => TextCell(String(row.original.categoryIds.length)),
            },
        ],
        [t],
    );

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
                {(isClubOwner || isAdmin) && (
                    <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
                        Create Tournament
                    </Button>
                )}
            </div>

            {!hasTournaments ? (
                <div className="flex flex-col items-center justify-center gap-4 p-10 min-h-[400px]">
                    <Typography size="body-paragraph-lg">No tournaments found</Typography>
                    <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
                        Create Your First Tournament
                    </Button>
                </div>
            ) : (
                <Table
                    data={tournaments}
                    columns={columns}
                    tableLayout="auto"
                    onRowClick={(row) => router.push(getTournamentDetailRoute(row.id))}
                />
            )}

            <CreateTournamentModal
                open={createDialogOpen}
                onClose={(newTournament) => {
                    setCreateDialogOpen(false);
                    if (newTournament) {
                        router.push(getTournamentDetailRoute(newTournament.id));
                    }
                }}
            />
        </div>
    );
}

export default function Component() {
    return (
        <AuthGuard type="private" redirectTo={RouteConfig.signin}>
            <TournamentsPage />
        </AuthGuard>
    );
}
