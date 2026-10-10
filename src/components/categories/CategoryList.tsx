import { faCopy, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox, IconButton } from "@mui/material";
import {
  ColumnDef,
  Header,
  PaginationState,
  RowSelectionState,
  Updater,
} from "@tanstack/react-table";
import { MouseEvent, ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useCategoryFormatters } from "@/components/categories/category-formatters";
import { Table } from "@/components/ui/table/Table";
import TableCell from "@/components/ui/table/TableCell";
import TableHeaderCell from "@/components/ui/table/TableHeaderCell";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";
import { DateUtils } from "@/util/date.utils";

type Category = CommonModels.CategoryResponseDto;

interface IProps {
  categories: Category[];
  mode?: "view" | "edit";
  selectedCategoryIds?: string[];
  onSelectedCategoryIdsChange?: (categoryIds: string[]) => void;
  onEdit?: (category: Category) => void;
  onDuplicate?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  actionsDisabled?: boolean;
  initialPagination?: PaginationState;
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

const stopRowToggle = (event: MouseEvent) => {
  event.stopPropagation();
};

const renderCategoryActionsCell = ({
  category,
  disabled,
  onEdit,
  onDuplicate,
  onDelete,
  editLabel,
  duplicateLabel,
  deleteLabel,
}: {
  category: Category;
  disabled?: boolean;
  onEdit?: (category: Category) => void;
  onDuplicate?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  editLabel: string;
  duplicateLabel: string;
  deleteLabel: string;
}) => (
  <TableCell align="end">
    <div className="flex items-center gap-0-5" onClick={stopRowToggle}>
      <IconButton
        size="small"
        disabled={disabled}
        aria-label={editLabel}
        onClick={() => onEdit?.(category)}
      >
        <FontAwesomeIcon icon={faPencil} className="text-primary-300" size="xs" />
      </IconButton>
      <IconButton
        size="small"
        disabled={disabled}
        aria-label={duplicateLabel}
        onClick={() => onDuplicate?.(category)}
      >
        <FontAwesomeIcon icon={faCopy} className="text-primary-300" size="xs" />
      </IconButton>
      <IconButton
        size="small"
        disabled={disabled}
        aria-label={deleteLabel}
        onClick={() => onDelete?.(category)}
      >
        <FontAwesomeIcon icon={faTrash} className="text-danger" size="xs" />
      </IconButton>
    </div>
  </TableCell>
);

export const CategoryList = ({
  categories,
  mode = "view",
  selectedCategoryIds = [],
  onSelectedCategoryIdsChange,
  onEdit,
  onDuplicate,
  onDelete,
  actionsDisabled,
  initialPagination,
}: IProps) => {
  const { t } = useTranslation();
  const { formatAgeRange, formatBeltRange, formatTeamSize, formatWeightRange } =
    useCategoryFormatters();

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

  const rowSelection = mode === "edit" ? managementRowSelection : {};

  const columns = useMemo<ColumnDef<Category>[]>(() => {
    const categoryColumns: ColumnDef<Category>[] = [
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
        cell: ({ row }) => TextCell(formatBeltRange(row.original)),
        size: 180,
      },
      {
        header: ({ header }) =>
          HeaderCell(header, t("categories.create.teamSize")),
        accessorKey: "teamSize",
        cell: ({ row }) => TextCell(formatTeamSize(row.original)),
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
        {
          id: "actions",
          header: ({ header }) => HeaderCell(header, t("shared.actions")),
          cell: ({ row }) =>
            renderCategoryActionsCell({
              category: row.original,
              disabled: actionsDisabled,
              onEdit,
              onDuplicate,
              onDelete,
              editLabel: t("shared.edit"),
              duplicateLabel: t("shared.duplicate"),
              deleteLabel: t("shared.delete"),
            }),
          enableSorting: false,
          size: 140,
        },
      ];
    }

    return categoryColumns;
  }, [
    formatAgeRange,
    formatBeltRange,
    formatTeamSize,
    formatWeightRange,
    mode,
    onDelete,
    onDuplicate,
    onEdit,
    actionsDisabled,
    t,
  ]);

  const handleRowSelectionChange = (updater: Updater<RowSelectionState>) => {
    const nextSelection =
      typeof updater === "function" ? updater(rowSelection) : updater;

    if (mode !== "edit") {
      return;
    }

    onSelectedCategoryIdsChange?.(
      categories
        .filter((_, index) => Boolean(nextSelection[index]))
        .map((category) => category.id),
    );
  };
  const [pagination, setPagination] = useState<PaginationState | undefined>(initialPagination);
  const totalItemsCount = categories.length;
  const currentItems = useMemo(() => {
    if (!pagination) {
      return categories;
    }
    return categories.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize);
  }, [categories, pagination])

  const paginationOptions = useMemo(() => {
    if (!pagination) {
      return undefined;
    }
    return {
      rowCount: totalItemsCount,
      pageCount: Math.ceil(totalItemsCount / pagination.pageSize)
    }
  }, [pagination, totalItemsCount])


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
    <div className="flex h-fit">
      <Table
        data={currentItems}
        columns={columns}
        sorting={[]}
        onSortingChange={() => { }}
        onRowSelectionChange={
          mode === "edit" ? handleRowSelectionChange : undefined
        }
        rowSelection={rowSelection}
        pagination={pagination}
        onPaginationChange={(newPagination) => {
          if (!pagination) {
            return;
          }
          setPagination(typeof newPagination === "function" ? newPagination(pagination) : newPagination);
        }}
        tableLayout="auto"
        paginationOptions={paginationOptions}


      />
    </div>
  );
};

export const HeaderCell = (header: Header<any, unknown>, label: string) => {
  return <TableHeaderCell header={header} label={label} align="start" />;
};

export const TextCell = (label: ReactNode, align: "start" | "end" = "start") => {
  return (
    <TableCell className="flex flex-row items-center gap-2" align={align}>
      <Typography size="body-paragraph-m" >
        {label}
      </Typography>
    </TableCell>
  );
};
