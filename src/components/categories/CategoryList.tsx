import { Checkbox } from "@mui/material";
import {
  ColumnDef,
  Header,
  RowSelectionState,
  Updater,
} from "@tanstack/react-table";
import { TFunction } from "i18next";
import { ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Table } from "@/components/ui/table/Table";
import TableCell from "@/components/ui/table/TableCell";
import TableHeaderCell from "@/components/ui/table/TableHeaderCell";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";
import { DateUtils } from "@/util/date.utils";


interface IProps {
  categories: CommonModels.CategoryResponseDto[];
  mode?: "view" | "edit";
  setSelectedCategory?: (category: CommonModels.CategoryResponseDto) => void;
  selectedCategoryIds?: string[];
  onSelectedCategoryIdsChange?: (categoryIds: string[]) => void;
}

const SelectionHeaderCell = ({ table }: { table: any }) => (
  <div className="flex items-center justify-center p-3">
    <Checkbox
      checked={table.getIsAllRowsSelected()}
      indeterminate={table.getIsSomeRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
      size="small"
    />
  </div>
);

const SelectionTableCell = ({ row }: { row: any }) => (
  <TableCell align="center">
    <Checkbox
      checked={row.getIsSelected()}
      onChange={row.getToggleSelectedHandler()}
      onClick={(event) => event.stopPropagation()}
      size="small"
    />
  </TableCell>
);

export const CategoryList = ({
  categories,
  mode = "view",
  setSelectedCategory,
  selectedCategoryIds = [],
  onSelectedCategoryIdsChange,
}: IProps) => {
  const { t } = useTranslation();
  const [tournamentRowSelection, setTournamentRowSelection] =
    useState<RowSelectionState>({});

  const managementRowSelection = useMemo(
    () =>
      categories.reduce<RowSelectionState>((selection, category, index) => {
        if (selectedCategoryIds.includes(category.id)) {
          return {
            ...selection,
            [index]: true,
          };
        }
        return selection;
      }, {}),
    [categories, selectedCategoryIds],
  );

  const rowSelection =
    mode === "edit" ? managementRowSelection : tournamentRowSelection;

  const columns = useMemo<ColumnDef<CommonModels.CategoryResponseDto>[]>(() => {
    const categoryColumns: ColumnDef<CommonModels.CategoryResponseDto>[] = [
      {
        header: ({ header }) => HeaderCell(header, t("categories.create.name")),
        accessorKey: "name",
        cell: ({ row }) => TextCell(row.original.name),
        size: 200,
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.discipline")),
        accessorKey: "discipline",
        cell: ({ row }) => TextCell(t(`discipline.${row.original.discipline}`)),
        size: 160,
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.subDiscipline")),
        accessorKey: "subDiscipline",
        cell: ({ row }) =>
          TextCell(
            row.original.subDiscipline
              ? t(`subDiscipline.${row.original.subDiscipline}`)
              : "—",
          ),
        size: 180,
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.gender")),
        accessorKey: "gender",
        cell: ({ row }) =>
          TextCell(
            row.original.gender
              ? t(`categories.create.${row.original.gender}`)
              : "—",
          ),
        size: 120,
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.age")),
        accessorKey: "ageMin",
        cell: ({ row }) => TextCell(formatAgeRange(row.original)),
        size: 120,
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.weight")),
        accessorKey: "weightMin",
        cell: ({ row }) => TextCell(formatWeightRange(row.original)),
        size: 140,
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.belt")),
        accessorKey: "beltMin",
        cell: ({ row }) => TextCell(formatBeltRange(row.original, t)),
        size: 180,
      },
      {
        header: ({ header }) =>
          HeaderCell(header, t("categories.create.teamSize")),
        accessorKey: "teamSize",
        cell: ({ row }) => TextCell(formatTeamSize(row.original, t)),
        size: 140,
      },
    ];

    if (mode === "edit") {
      return [
        {
          id: "select",
          header: SelectionHeaderCell,
          cell: SelectionTableCell,
          size: 64,
        },
        ...categoryColumns,
        {
          header: ({ header }) => HeaderCell(header, t("shared.updatedAt")),
          accessorKey: "updatedAt",
          cell: ({ row }) =>
            TextCell(
              DateUtils.parseAndFormatDateTimeToLocaleShort(
                row.original.updatedAt,
              ),
            ),
          size: 180,
        },
      ];
    }

    return categoryColumns;
  }, [mode, t]);

  const handleRowSelectionChange = (updater: Updater<RowSelectionState>) => {
    const nextSelection =
      typeof updater === "function" ? updater(rowSelection) : updater;

    if (mode === "edit") {
      onSelectedCategoryIdsChange?.(
        categories
          .filter((_, index) => Boolean(nextSelection[index]))
          .map((category) => category.id),
      );
      return;
    }

    setTournamentRowSelection(nextSelection);
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-10">
        <Typography size="body-paragraph-lg">
          {t("categories.noCategories")}
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex h-fit min-h-[90px] w-full flex-[1_1_0]">
      <Table
        data={categories}
        columns={columns}
        sorting={[]}
        onSortingChange={() => { }}
        onRowClick={
          mode === "view" && setSelectedCategory
            ? (row) => setSelectedCategory(row)
            : undefined
        }
        onRowSelectionChange={handleRowSelectionChange}
        rowSelection={rowSelection}
        tableLayout="auto"
      />
    </div>
  );
};

function formatAgeRange(category: CommonModels.CategoryResponseDto) {
  if (
    category.ageMin !== null &&
    category.ageMin !== undefined &&
    category.ageMin >= 0 &&
    category.ageMax !== null &&
    category.ageMax !== undefined &&
    category.ageMax >= 0
  ) {
    return `${category.ageMin} - ${category.ageMax}`;
  }
  if (category.ageMin) {
    return `${category.ageMin.toString()} years`;
  }
  if (category.ageMax) {
    return `${category.ageMax.toString()} years`;
  }
  return "—";
}

function formatWeightRange(category: CommonModels.CategoryResponseDto) {
  if (
    category.weightMin !== null &&
    category.weightMin !== undefined &&
    category.weightMin >= 0 &&
    category.weightMax !== null &&
    category.weightMax !== undefined &&
    category.weightMax >= 0
  ) {
    return `${category.weightMin} - ${category.weightMax}`;
  }
  if (category.weightMin) {
    return `${category.weightMin.toString()} kg`;
  }
  if (category.weightMax) {
    return `${category.weightMax.toString()} kg`;
  }
  return "—";
}

function formatBeltRange(
  category: CommonModels.CategoryResponseDto,
  t: TFunction,
) {
  if (category.beltMin && category.beltMax) {
    return `${t(`belt.${category.beltMin}`)} - ${t(`belt.${category.beltMax}`)}`;
  }
  if (category.beltMin) {
    return t(`belt.${category.beltMin}`);
  }
  if (category.beltMax) {
    return t(`belt.${category.beltMax}`);
  }
  return "—";
}

function formatTeamSize(
  category: CommonModels.CategoryResponseDto,
  t: TFunction,
) {
  if (category.teamSize == null) {
    return "—";
  }

  const reserves =
    category.teamReservesSize != null
      ? ` + ${category.teamReservesSize} ${t("categories.create.teamReservesShort")}`
      : "";

  return `${category.teamSize}${reserves}`;
}

export const HeaderCell = (header: Header<any, unknown>, label: string) => {
  return <TableHeaderCell header={header} label={label} align="start" />;
};

export const TextCell = (label: ReactNode) => {
  return (
    <TableCell className="flex flex-row items-center gap-2" align="start">
      <Typography size="body-paragraph-m" variant="prominent-2">
        {label}
      </Typography>
    </TableCell>
  );
};