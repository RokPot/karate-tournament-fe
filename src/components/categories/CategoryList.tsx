import { faCopy, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox, IconButton } from "@mui/material";
import {
  ColumnDef,
  Header,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import { MouseEvent, ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useCategoryFormatters } from "@/components/categories/category-formatters";
import { compareCategoryNames } from "@/components/categories/category-name-sort";
import { Table } from "@/components/ui/table/Table";
import TableCell from "@/components/ui/table/TableCell";
import TableHeaderCell from "@/components/ui/table/TableHeaderCell";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";
import { BeltUtils } from "@/util/belt.utils";
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

const DEFAULT_SORTING: SortingState = [{ id: "name", desc: false }];

const withDirection = (comparison: number, desc: boolean) =>
  desc ? -comparison : comparison;

const compareOptionalNumber = (
  left: number | null | undefined,
  right: number | null | undefined,
  desc: boolean,
) => {
  const leftEmpty = left == null;
  const rightEmpty = right == null;
  if (leftEmpty || rightEmpty) {
    if (leftEmpty && rightEmpty) {
      return 0;
    }
    return leftEmpty ? 1 : -1;
  }
  return withDirection(left - right, desc);
};

const compareText = (left: string, right: string, desc: boolean) => {
  const leftEmpty = left.trim() === "" || left === "—";
  const rightEmpty = right.trim() === "" || right === "—";
  if (leftEmpty || rightEmpty) {
    if (leftEmpty && rightEmpty) {
      return 0;
    }
    return leftEmpty ? 1 : -1;
  }
  return withDirection(
    left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }),
    desc,
  );
};

const compareRange = (
  leftMin: number | null | undefined,
  leftMax: number | null | undefined,
  rightMin: number | null | undefined,
  rightMax: number | null | undefined,
  desc: boolean,
) => {
  const byMin = compareOptionalNumber(leftMin, rightMin, desc);
  if (byMin !== 0) {
    return byMin;
  }
  return compareOptionalNumber(leftMax, rightMax, desc);
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
  const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);

  const compareCategories = (left: Category, right: Category) => {
    const sort = sorting[0] ?? DEFAULT_SORTING[0];
    const { desc } = sort;

    switch (sort.id) {
      case "discipline":
        return compareText(
          t(`discipline.${left.discipline}`),
          t(`discipline.${right.discipline}`),
          desc,
        );
      case "subDiscipline":
        return compareText(
          left.subDiscipline ? t(`subDiscipline.${left.subDiscipline}`) : "",
          right.subDiscipline ? t(`subDiscipline.${right.subDiscipline}`) : "",
          desc,
        );
      case "gender":
        return compareText(
          left.gender ? t(`categories.create.${left.gender}`) : "",
          right.gender ? t(`categories.create.${right.gender}`) : "",
          desc,
        );
      case "ageMin":
        return compareRange(left.ageMin, left.ageMax, right.ageMin, right.ageMax, desc);
      case "weightMin":
        return compareRange(
          left.weightMin,
          left.weightMax,
          right.weightMin,
          right.weightMax,
          desc,
        );
      case "beltMin": {
        const beltRank = (belt: Category["beltMin"]) => {
          const rank = BeltUtils.getBeltRank(belt);
          return rank < 0 ? null : rank;
        };
        return compareRange(
          beltRank(left.beltMin),
          beltRank(left.beltMax),
          beltRank(right.beltMin),
          beltRank(right.beltMax),
          desc,
        );
      }
      case "teamSize":
        return compareRange(
          left.teamSize,
          left.teamReservesSize,
          right.teamSize,
          right.teamReservesSize,
          desc,
        );
      case "updatedAt":
        return compareOptionalNumber(
          Date.parse(left.updatedAt),
          Date.parse(right.updatedAt),
          desc,
        );
      case "name":
      default:
        return withDirection(compareCategoryNames(left.name, right.name), desc);
    }
  };

  const sortedCategories = useMemo(
    () => [...categories].sort(compareCategories),
    // compareCategories closes over the active sort and translators.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categories, sorting, t],
  );

  const [pagination, setPagination] = useState<PaginationState | undefined>(initialPagination);

  const currentItems = useMemo(() => {
    if (!pagination) {
      return sortedCategories;
    }
    const start = pagination.pageIndex * pagination.pageSize;
    return sortedCategories.slice(start, start + pagination.pageSize);
  }, [pagination, sortedCategories]);

  const managementRowSelection = useMemo(
    () =>
      currentItems.reduce<RowSelectionState>((selection, category, index) => {
        if (selectedCategoryIds.includes(category.id)) {
          return {
            ...selection,
            [index]: true,
          };
        }
        return selection;
      }, {}),
    [currentItems, selectedCategoryIds],
  );

  const rowSelection = mode === "edit" ? managementRowSelection : {};

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      return next.length === 0 ? DEFAULT_SORTING : next;
    });
    setPagination((current) =>
      current ? { ...current, pageIndex: 0 } : current,
    );
  };

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
          enableSorting: false,
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

    const visibleIds = new Set(currentItems.map((category) => category.id));
    const hiddenSelection = selectedCategoryIds.filter((id) => !visibleIds.has(id));
    const visibleSelection = currentItems
      .filter((_, index) => Boolean(nextSelection[index]))
      .map((category) => category.id);

    onSelectedCategoryIdsChange?.([...hiddenSelection, ...visibleSelection]);
  };
  const totalItemsCount = categories.length;

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
        sorting={sorting}
        onSortingChange={handleSortingChange}
        manualSorting
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
