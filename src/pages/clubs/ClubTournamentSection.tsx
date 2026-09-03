import { HeaderCell, TextCell } from "@/components/categories/CategoryList";
import { CreateTournamentModal } from "@/components/tournaments/CreateTournamentModal";
import { TournamentStatusCell } from "@/components/tournaments/TournamentStatusCell";
import { Table } from "@/components/ui/table/Table";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { getTournamentDetailRoute } from "@/config/route.config";
import { ClubsQueries } from "@/data/clubs/clubs.queries";
import { CommonModels } from "@/data/common/common.models";
import { useAuthRoles } from "@/hooks/useAuthRoles";
import { DateUtils } from "@/util/date.utils";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
    clubId: string;
}

const ClubTournamentSection = ({ clubId }: IProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { isClubOwner, isClubCoach, isAdmin } = useAuthRoles();
    const canCreate = isClubOwner || isClubCoach || isAdmin;
    const [createTournamentModalOpen, setCreateTournamentModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const { data: tournaments, isLoading: isTournamentsLoading } = ClubsQueries.useGetTournaments({ id: clubId });

    const columns: ColumnDef<CommonModels.TournamentResponseDto>[] = useMemo(() => {
        return [
            {
                header: ({ header }) => HeaderCell(header, t("shared.name")),
                accessorKey: "name",
                cell: ({ row }) => {
                    return TextCell(row.original.name);
                },
            },
            {
                header: ({ header }) => HeaderCell(header, t("shared.location")),
                accessorKey: "location",
                cell: ({ row }) => {
                    return TextCell(row.original.location || "—");
                },
            },
            {
                header: ({ header }) => HeaderCell(header, t("shared.registrationDeadline")),
                accessorKey: "registrationDeadline",
                cell: ({ row }) => {
                    return TextCell(DateUtils.parseAndFormatDateTimeToLocaleShort(row.original.registrationDeadline));
                },

            },
            {
                header: ({ header }) => HeaderCell(header, t("shared.startDate")),
                accessorKey: "startDate",
                cell: ({ row }) => {
                    return TextCell(DateUtils.parseAndFormatDateTimeToLocaleShort(row.original.startDate));
                },
            },
            {
                header: ({ header }) => HeaderCell(header, t("shared.categories")),
                accessorKey: "categories",
                cell: ({ row }) => {
                    return TextCell(String(row.original.categoryIds?.length ?? 0));
                },
            },
            {
                header: ({ header }) => HeaderCell(header, t("tournaments.status.label")),
                accessorKey: "status",
                cell: ({ row }) => <TournamentStatusCell status={row.original.status} />,
            },
            {
                header: ({ header }) => HeaderCell(header, t("shared.registrationsCount")),
                accessorKey: "registrationsCount",
                cell: () => {
                    return TextCell("0");
                },
            }

        ]
    }, [t])

    return (
        <div>
            <div className="flex flex-row items-center justify-between mb-3">
                <Typography size="h2">{t("shared.tournaments")}</Typography>
                {canCreate && (
                    <Button variant="contained" onClick={() => { setCreateTournamentModalOpen(true); }}>
                        <div className="flex flex-row items-center gap-0-5">
                            <FontAwesomeIcon icon={faAdd} />
                            {t("tournaments.addTournament")}
                        </div>
                    </Button>
                )}
            </div>
            <Table
                data={tournaments || []}
                columns={columns}
                isLoading={isTournamentsLoading}
                tableLayout="auto"
                onRowClick={(row) => router.push(getTournamentDetailRoute(row.id))}
            />
            {canCreate && (
                <CreateTournamentModal
                    clubId={clubId}
                    open={createTournamentModalOpen}
                    onClose={(newTournament) => {
                        setCreateTournamentModalOpen(false);
                        if (newTournament) {
                            queryClient.invalidateQueries({ queryKey: ClubsQueries.keys.getTournaments(clubId) });
                        }
                    }} />
            )}
        </div>
    )
}

export default ClubTournamentSection;
