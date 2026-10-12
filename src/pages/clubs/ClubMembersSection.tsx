import { faAdd, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, IconButton } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import { MouseEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { HeaderCell, TextCell } from "@/components/categories/CategoryList";
import { AddMemberModal } from "@/components/clubs/AddMemberModal";
import { ConfirmRemoveMemberDialog } from "@/components/clubs/ConfirmRemoveMemberDialog";
import { EditMemberModal } from "@/components/clubs/EditMemberModal";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { Table } from "@/components/ui/table/Table";
import TableCell from "@/components/ui/table/TableCell";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { ClubsQueries } from "@/data/clubs/clubs.queries";
import { CommonModels } from "@/data/common/common.models";
import { BeltUtils } from "@/util/belt.utils";
import { DateUtils } from "@/util/date.utils";

interface IProps {
    clubId: string;
}

const GENDER_ORDER: Record<string, number> = {
    male: 0,
    female: 1,
    other: 2,
};

const DEFAULT_SORTING: SortingState = [{ id: "name", desc: false }];

const stopRowToggle = (event: MouseEvent) => {
    event.stopPropagation();
};

const ClubMembersSection = ({ clubId }: IProps) => {
    const { t } = useTranslation();
    const { successToast, errorToast } = useToast();
    const queryClient = useQueryClient();

    const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
    const [memberToEdit, setMemberToEdit] =
        useState<CommonModels.UserResponseDto | null>(null);
    const [memberToRemove, setMemberToRemove] =
        useState<CommonModels.UserResponseDto | null>(null);
    const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);

    const { data: members, isLoading: isMembersLoading } =
        ClubsQueries.useGetMembers({ id: clubId }, { enabled: !!clubId });

    const removeMemberMutation = ClubsQueries.useRemoveMember({
        onSuccess: () => {
            successToast({ text: t("members.remove.success") });
            setMemberToRemove(null);
            queryClient.invalidateQueries({
                queryKey: ClubsQueries.keys.getMembers(clubId),
            });
        },
        onError: (error) => {
            errorToast({ text: error?.message || t("members.remove.error") });
        },
    });

    const memberName = (member: CommonModels.UserResponseDto) =>
        [member.firstName, member.lastName].filter(Boolean).join(" ") || "—";

    const columns: ColumnDef<CommonModels.UserResponseDto>[] = useMemo(() => {
        return [
            {
                id: "name",
                header: ({ header }) => HeaderCell(header, t("shared.name")),
                accessorFn: (row) =>
                    [row.lastName, row.firstName].filter(Boolean).join(" "),
                sortingFn: (rowA, rowB) =>
                    BeltUtils.compareMemberName(rowA.original, rowB.original),
                cell: ({ row }) => TextCell(memberName(row.original)),
            },
            {
                id: "beltLevel",
                header: ({ header }) => HeaderCell(header, t("shared.belt")),
                accessorKey: "beltLevel",
                sortDescFirst: true,
                sortingFn: (rowA, rowB) =>
                    BeltUtils.getBeltRank(rowA.original.beltLevel) -
                    BeltUtils.getBeltRank(rowB.original.beltLevel),
                cell: ({ row }) =>
                    TextCell(
                        row.original.beltLevel
                            ? t(`belt.${row.original.beltLevel}`)
                            : "—",
                    ),
            },
            {
                id: "gender",
                header: ({ header }) => HeaderCell(header, t("shared.gender")),
                accessorKey: "gender",
                sortingFn: (rowA, rowB) => {
                    const a = GENDER_ORDER[rowA.original.gender ?? ""] ?? 99;
                    const b = GENDER_ORDER[rowB.original.gender ?? ""] ?? 99;
                    return a - b;
                },
                cell: ({ row }) =>
                    TextCell(
                        row.original.gender
                            ? t(`profile.gender.${row.original.gender}`, {
                                defaultValue: row.original.gender,
                            })
                            : "—",
                    ),
            },
            {
                id: "dateOfBirth",
                header: ({ header }) => HeaderCell(header, t("shared.birthday")),
                accessorKey: "dateOfBirth",
                sortingFn: (rowA, rowB) => {
                    const a = DateUtils.parseDate(rowA.original.dateOfBirth ?? undefined);
                    const b = DateUtils.parseDate(rowB.original.dateOfBirth ?? undefined);
                    const aTime = a?.getTime() ?? Number.POSITIVE_INFINITY;
                    const bTime = b?.getTime() ?? Number.POSITIVE_INFINITY;
                    return aTime - bTime;
                },
                cell: ({ row }) =>
                    TextCell(
                        DateUtils.parseAndFormatDateToLocaleShort(
                            row.original.dateOfBirth,
                        ),
                    ),
            },
            {
                id: "weight",
                header: ({ header }) => HeaderCell(header, t("shared.weight")),
                accessorKey: "weight",
                sortingFn: (
                    rowA: Row<CommonModels.UserResponseDto>,
                    rowB: Row<CommonModels.UserResponseDto>,
                ) => {
                    const a = rowA.original.weight;
                    const b = rowB.original.weight;
                    if (a == null && b == null) return 0;
                    if (a == null) return 1;
                    if (b == null) return -1;
                    return a - b;
                },
                cell: ({ row }) =>
                    TextCell(
                        row.original.weight != null
                            ? t("profile.overview.weightUnit", {
                                weight: row.original.weight,
                            })
                            : "—",
                    ),
            },
            {
                id: "actions",
                header: ({ header }) => HeaderCell(header, t("shared.actions")),
                enableSorting: false,
                size: 100,
                cell: ({ row }) => (
                    MemberActions({ onEdit: () => setMemberToEdit(row.original), onDelete: () => setMemberToRemove(row.original) })
                ),
            },
        ];
    }, [t]);

    const invalidateMembers = () => {
        queryClient.invalidateQueries({
            queryKey: ClubsQueries.keys.getMembers(clubId),
        });
    };

    return (
        <div>
            <div className="mb-3 flex flex-row items-center justify-between">
                <Typography size="h2">{t("members.title")}</Typography>
                <Button
                    variant="contained"
                    onClick={() => setAddMemberModalOpen(true)}
                >
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
                sorting={sorting}
                onSortingChange={setSorting}
                manualSorting={false}
            />
            <AddMemberModal
                clubId={clubId}
                open={addMemberModalOpen}
                onClose={(newMember) => {
                    setAddMemberModalOpen(false);
                    if (newMember) {
                        invalidateMembers();
                    }
                }}
            />
            <EditMemberModal
                clubId={clubId}
                open={!!memberToEdit}
                member={memberToEdit}
                onClose={(updated) => {
                    setMemberToEdit(null);
                    if (updated) {
                        invalidateMembers();
                    }
                }}
            />
            <ConfirmRemoveMemberDialog
                open={!!memberToRemove}
                name={memberToRemove ? memberName(memberToRemove) : ""}
                isPending={removeMemberMutation.isPending}
                onClose={() => setMemberToRemove(null)}
                onConfirm={() => {
                    if (!memberToRemove) return;
                    removeMemberMutation.mutate({
                        id: clubId,
                        userId: memberToRemove.id,
                    });
                }}
            />
        </div>
    );
};

const MemberActions = ({ onEdit, onDelete }: { onEdit: () => void, onDelete: () => void }) => {
    const { t } = useTranslation();

    return <TableCell align="end">
        <div className="flex items-center gap-0-5" onClick={stopRowToggle}>
            <IconButton
                size="small"
                aria-label={t("shared.edit")}
                onClick={onEdit}
            >
                <FontAwesomeIcon
                    icon={faPencil}
                    className="text-primary-300"
                    size="xs"
                />
            </IconButton>
            <IconButton
                size="small"
                aria-label={t("shared.delete")}
                onClick={onDelete}
            >
                <FontAwesomeIcon
                    icon={faTrash}
                    className="text-danger"
                    size="xs"
                />
            </IconButton>
        </div>
    </TableCell>
}

export default ClubMembersSection;
