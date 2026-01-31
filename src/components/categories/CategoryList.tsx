
import { CategoriesModels } from "@/data/categories/categories.models";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import TableHeaderCell from "@/components/ui/table/TableHeaderCell";
import { ColumnDef, Header, RowSelectionState } from "@tanstack/react-table";
import TableCell from "@/components/ui/table/TableCell";
import { Table } from "@/components/ui/table/Table";

interface IProps {
  categories: CategoriesModels.CategoryResponseDto[];
  setSelectedCategory: (category: CategoriesModels.CategoryResponseDto) => void;
}

export const CategoryList = ({ categories, setSelectedCategory }: IProps) => {
  const { t } = useTranslation();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-10">
        <Typography size="body-paragraph-lg">{t("categories.noCategories")}</Typography>
      </div>
    );
  }



  return (
    <div className="max-h-[400px] min-h-[90px] h-fit flex w-full flex-[1_1_0]">
      <Table
        data={[...categories, ...categories, ...categories, ...categories]}
        columns={columns}
        sorting={[]}
        onSortingChange={() => { }}
        onRowClick={(row) => {
          setSelectedCategory(row);
        }}

        onRowSelectionChange={(newRowSelection) => {
          setRowSelection(newRowSelection);
        }}
        rowSelection={rowSelection}
      />
    </div>
  );
};

export const HeaderCell = (header: Header<any, unknown>, label: string) => {
  return <TableHeaderCell header={header} label={label} align="start" />;
};

export const TextCell = (label: string) => {
  return (
    <TableCell className="flex flex-row items-center gap-2" align="start">
      <Typography size="body-paragraph-m" variant="prominent-2">
        {label}
      </Typography>
    </TableCell>
  );
};