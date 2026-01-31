
import { CategoriesModels } from "@/data/categories/categories.models";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Table } from "@/components/ui/table/Table";
import { HeaderCell, TextCell } from "@/components/categories/CategoryList";

interface IProps {
    registrations: any[];
}

const RegistrationList = ({ registrations }: IProps) => {
    const { t } = useTranslation();

    const columns = useMemo<ColumnDef<CategoriesModels.CategoryResponseDto>[]>(() => [
        {
            header: ({ header }) => HeaderCell(header, t("categories.create.name")),
            accessorKey: "name",
            cell: ({ row }) => TextCell(row.original.name),
            size: 200,
        },
        {
            header: ({ header }) => HeaderCell(header, t("shared.discipline")),
            accessorKey: "discipline",
            cell: ({ row }) => TextCell(row.original.discipline),
            size: 200,
        },
        {
            header: ({ header }) => HeaderCell(header, t("shared.gender")),
            accessorKey: "gender",
            cell: ({ row }) => TextCell(row.original.gender.join(", ")),
            size: 200,
        },
        {
            header: ({ header }) => HeaderCell(header, t("shared.age")),
            accessorKey: "ageMin",
            cell: ({ row }) => TextCell(`${row.original.ageMin} - ${row.original.ageMax}`),
            size: 200,
        },

        {
            header: ({ header }) => HeaderCell(header, t("shared.weight")),
            accessorKey: "weightMin",
            cell: ({ row }) => TextCell(`${row.original.weightMin} - ${row.original.weightMax}`),
            size: 200,
        },
        {
            header: ({ header }) => HeaderCell(header, t("categories.create.beltMin")),
            accessorKey: "beltMin",
            cell: ({ row }) => TextCell(row.original.beltMin),
            size: 200,
        },
        {
            header: ({ header }) => HeaderCell(header, t("categories.create.beltMax")),
            accessorKey: "beltMax",
            cell: ({ row }) => TextCell(row.original.beltMax),
            size: 200,
        }

    ], [t]);

    if (registrations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 p-10">
                <Typography size="body-paragraph-lg">{t("registrations.noAttendees")}</Typography>
            </div>
        );
    }



    return (
        <div className="min-h-[400px] flex w-full flex-[1_1_0] ">
            <Table
                data={registrations}
                columns={columns}
                sorting={[]}
                onSortingChange={() => { }}
            />
        </div>
    );
};

export default RegistrationList;

