import { HeaderCell, TextCell } from "@/components/categories/CategoryList";
import { CreateClubModal } from "@/components/clubs/CreateClubModal";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { Table } from "@/components/ui/table/Table";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { ClubsQueries } from "@/data/clubs/clubs.queries";
import { CommonModels } from "@/data/common/common.models";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const ClubsPage = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const { data: clubs, isError, isLoading, error, refetch } = ClubsQueries.useFindAll();

    const { t } = useTranslation();
    const columns: ColumnDef<CommonModels.ClubResponseDto>[] = useMemo(() => {
        return [
            {
                header: ({ header }) => HeaderCell(header, t("shared.name")),
                accessorKey: "name",
                cell: ({ row }) => TextCell(row.original.name),
            },
            {
                header: ({ header }) => HeaderCell(header, t("shared.address")),
                accessorKey: "address",
                cell: ({ row }) => TextCell(row.original.address || ""),
            },
            {
                header: ({ header }) => HeaderCell(header, t("shared.country")),
                accessorKey: "country",
                cell: ({ row }) => TextCell(row.original.country || ""),
            },
            {
                header: ({ header }) => HeaderCell(header, t("shared.membersCount")),
                accessorKey: "membersCount",
                cell: ({ row }) => TextCell(row.original.membersCount.toString()),
            }
        ]
    }, [t])

    if (isLoading) {
        return <LoadingState />;
    }

    if (isError) {
        return <ErrorState error={error} onRetry={() => refetch()} />;
    }

    return (
        <div className="p-5">
            <div className="flex items-center justify-between pb-4 h-14">
                <Typography size="h3" >{t("clubs.title")}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    className="flex items-center gap-2"
                    onClick={() => setCreateModalOpen(true)}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    {t("clubs.createNew")}
                </Button>
            </div>
            <Table
                data={clubs || []}
                columns={columns}
                sorting={[]}
                onSortingChange={() => { }}
                rowSelection={{}}
            />
            <CreateClubModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
        </div>
    );
};

export default ClubsPage;