import { HeaderCell, TextCell } from "@/components/categories/CategoryList";
import { AddMemberModal } from "@/components/clubs/AddMemberModal";
import { Table } from "@/components/ui/table/Table";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { ClubsQueries } from "@/data/clubs/clubs.queries";
import { CommonModels } from "@/data/common/common.models";
import { DateUtils } from "@/util/date.utils";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
    clubId: string;
}

const ClubMembersSection = ({ clubId }: IProps) => {
    const { t } = useTranslation();
    const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: members, isLoading: isMembersLoading } = ClubsQueries.useGetMembers({ id: clubId }, { enabled: !!clubId });

    const columns: ColumnDef<CommonModels.UserResponseDto>[] = useMemo(() => {
        return [
            {
                header: ({ header }) => HeaderCell(header, t("shared.name")),
                accessorKey: "firstName",
                cell: ({ row }) => {
                    return TextCell([row.original.firstName, row.original.lastName].filter(Boolean).join(" ") || "—");
                },
            },
            {
                header: ({ header }) => HeaderCell(header, t("shared.belt")),
                accessorKey: "belt",
                cell: ({ row }) => {
                    return TextCell(
                        row.original.beltLevel ? t(`belt.${row.original.beltLevel}`) : "—",
                    );
                },
            },
            {
                header: ({ header }) => HeaderCell(header, t("shared.gender")),
                accessorKey: "gender",
                cell: ({ row }) => {
                    return TextCell(row.original.gender?.toString() || "—");
                },
            },
            {
                header: ({ header }) => HeaderCell(header, t("shared.birthday")),
                accessorKey: "dateOfBirth",
                cell: ({ row }) => {
                    return TextCell(DateUtils.parseAndFormatDateToLocaleShort(row.original.dateOfBirth));
                },
            },
        ]
    }, [t])

    return (
        <div>
            <div className="flex flex-row items-center justify-between mb-3">
                <Typography size="h2">{t("members.title")}</Typography>
                <Button variant="contained" onClick={() => setAddMemberModalOpen(true)}>
                    <div className="flex flex-row items-center gap-0-5">
                        <FontAwesomeIcon icon={faAdd} />
                        {t("members.addMember")}
                    </div>
                </Button>
            </div>
            <Table
                data={members || []}
                columns={columns}
                isLoading={isMembersLoading}
            />
            <AddMemberModal
                clubId={clubId}
                open={addMemberModalOpen}
                onClose={(newMember) => {
                    setAddMemberModalOpen(false);
                    if (newMember) {
                        queryClient.invalidateQueries({
                            queryKey: ClubsQueries.keys.getMembers(clubId),
                        });
                    }
                }}
            />
        </div>
    )
}

export default ClubMembersSection;