import Button from "@mui/material/Button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationOptions,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

// import { Pagination } from "@/components/ui/table/Pagination";
import { Loader } from "@/components/ui/status/Loader/Loader";
import { Pagination } from "@/components/ui/table/Pagination";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { cx } from "class-variance-authority";

export type PaginationParams = PaginationState;
export type SortParams = { sortBy: `${string}.${"asc" | "desc"}` };

export type Filters<T> = Partial<T & PaginationParams & SortParams>;

export interface SeeAllData {
  totalItemsCount: number;
  onSeeAll: () => void;
  buttonText?: string;
}

export const tableClasses = {
  table: "min-h-[90px] w-full max-w-[1500px] overflow-x-auto rounded-xs border border-secondary-200",
  tableHeader: "border-b border-secondary-200 bg-secondary-200",
  tableRow: "group border-b border-secondary-200  transition-colors duration-150 hover:bg-secondary-200",
  tableCell: "min-w-11",
  tableNoData: "p-3 text-center",
  tableLoading: "flex w-full items-center justify-center",
};

interface TableProps<TData> extends PropsWithChildren {
  data: TData[];
  columns: ColumnDef<TData>[];
  pagination?: PaginationState;
  paginationOptions?: Pick<PaginationOptions, "onPaginationChange" | "rowCount" | "pageCount">;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onRowClick?: (row: TData) => void;
  onPaginationChange?: OnChangeFn<PaginationState>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  rowSelection?: RowSelectionState;
  isLoading?: boolean;
  className?: string;
  rowClassname?: (row: TData) => string;
  manualSorting?: boolean;
  seeAllData?: SeeAllData;
  tableLayout?: "fixed" | "auto";
}

export const Table = <TData,>({
  data,
  columns,
  pagination,
  paginationOptions,
  sorting,
  onSortingChange,
  children,
  manualSorting = true,
  onRowClick,
  onPaginationChange,
  onRowSelectionChange,
  isLoading,
  rowSelection,
  className,
  rowClassname,
  seeAllData,
  tableLayout = "fixed",
}: TableProps<TData>) => {
  const { t } = useTranslation();
  const table = useReactTable({
    data,
    columns,
    state: { pagination, sorting, rowSelection },
    onSortingChange,
    ...paginationOptions,
    manualFiltering: true,
    manualSorting,
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange,
    onPaginationChange,
    defaultColumn: {
      size: undefined,
    },

  });

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-3">
      {/* Filters */}
      {children}
      {/* Table */}
      <div className={clsx(tableClasses.table, className)}>
        <table className="w-full px-3" style={{ tableLayout }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={cx(tableClasses.tableHeader, "sticky top-0")}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width: header?.column.columnDef.size ? header.column.getSize() : undefined,
                        maxWidth: header?.column.columnDef.size ? header.column.getSize() : undefined,
                      }}
                      className={tableClasses.tableCell}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {!isLoading &&
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}

                  className={clsx(rowClassname?.(row.original), tableClasses.tableRow, onRowClick && "cursor-pointer", row.getIsSelected() && "bg-primary-500 hover:bg-primary-500/70!")}
                  onClick={() => { onRowClick?.(row.original); table.toggleAllRowsSelected(false); row.toggleSelected(); }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        width: cell?.column.columnDef.size ? cell.column.getSize() : undefined,
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading && seeAllData && table.getRowModel().rows.length > 0 && (
              <tr className={tableClasses.tableRow}>
                <td colSpan={columns.length} className={tableClasses.tableCell}>
                  <Button onClick={seeAllData.onSeeAll} className="w-auto p-3! text-left" variant="text">
                    {seeAllData.buttonText || t("table.seeAll", { count: seeAllData.totalItemsCount })}
                  </Button>
                </td>
              </tr>
            )}
            {!isLoading && table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className={tableClasses.tableNoData}>
                  <Typography size="body-paragraph-m" variant="default" className="text-white">
                    {t("table.noData")}
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {isLoading && (
          <div className={tableClasses.tableLoading}>
            <Loader size="l" />
          </div>
        )}
      </div>

      {pagination && <Pagination pagination={pagination} table={table} />}
    </div>
  );
};
