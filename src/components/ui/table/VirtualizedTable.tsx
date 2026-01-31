import { ColumnOrderState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { observeElementRect, useVirtualizer } from "@tanstack/react-virtual";
import { cx } from "class-variance-authority";
import clsx from "clsx";
import { throttle } from "lodash-es";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Loader } from "@/components/ui/status/Loader/Loader";
import { tableClasses } from "@/components/ui/table/Table";
import { TableProps } from "@/components/ui/table/TableProps";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { TableUtils } from "@/util/table.utils";

export const VirtualizedTable = <TData,>({
  data,
  columns,
  sorting,
  onSortingChange,
  isLoading,
  className,
  rowClassname,
  manualSorting,
  onRowDataUsed,
  onRowClick,
  noBorder,
  showAllColumns = false, // 👈 NEW PROP WITH DEFAULT VALUE
  rowHeight = 47,
  flexibleColumnId, // Column that should grow to fill remaining space
  emptyState,
}: TableProps<TData>) => {
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnOrder,
    },
    onSortingChange,
    manualSorting,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    defaultColumn: {
      size: undefined,
    },
  });

  const { t } = useTranslation();

  const { rows } = table.getRowModel();

  const parentRef = useRef<HTMLDivElement>(null);

  const calculateVisibleColumns = useCallback(
    (parentWidth: number) => {
      // 👈 NEW: If showAllColumns is true, return all column IDs
      if (showAllColumns) {
        return table.getAllColumns().map((col) => col.id);
      }

      let cumulativeWidth = 0;
      const visibleColumns: string[] = [];
      let allColumns = table.getAllColumns();

      if (table?.getState().columnOrder.length > 0) {
        const orderedColumns = [];
        for (const columnId of table.getState().columnOrder) {
          const column = allColumns.find((col) => col.id === columnId);
          if (column) {
            orderedColumns.push(column);
          }
        }
        // Add any remaining columns that might not be in the order array
        allColumns.forEach((column) => {
          if (!table?.getState().columnOrder.includes(column.id)) {
            orderedColumns.push(column);
          }
        });
        allColumns = orderedColumns;
      }

      const widthBuffer = 15;
      const availableWidth = parentWidth - widthBuffer;

      if (availableWidth <= 0) {
        return allColumns.length > 0 ? [allColumns[0].id] : [];
      }

      const columnWidths = allColumns.map((column) => column.getSize());
      if (columnWidths.every((width) => !width)) {
        return allColumns.map((col) => col.id);
      }

      for (let i = 0; i < allColumns.length; i++) {
        const column = allColumns[i];
        const columnWidth = columnWidths[i] || 0;

        if (!columnWidth) {
          continue;
        }

        if (cumulativeWidth + columnWidth < availableWidth) {
          cumulativeWidth += columnWidth;
          visibleColumns.push(column.id);
        } else {
          break;
        }
      }

      if (visibleColumns.length === 0 && allColumns.length > 0) {
        visibleColumns.push(allColumns[0].id);
      }
      return visibleColumns;
    },
    [table, showAllColumns], // 👈 ADDED showAllColumns TO DEPENDENCIES
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResize = useCallback(
    throttle((parentWidth: number) => {
      // 👈 NEW: Skip resize handling if showAllColumns is true
      if (showAllColumns) {
        const allColumns = table.getAllColumns();
        const newVisibility: Record<string, boolean> = {};
        allColumns.forEach((column) => {
          newVisibility[column.id] = true; // Show all columns
        });
        setColumnVisibility(newVisibility);
        return;
      }

      const allColumns = table.getAllColumns();
      const visibleColumnIds = calculateVisibleColumns(parentWidth);
      const newVisibility: Record<string, boolean> = {};
      allColumns.forEach((column) => {
        newVisibility[column.id] = visibleColumnIds.includes(column.id);
      });

      setColumnVisibility(newVisibility);
    }, 30),
    [table, calculateVisibleColumns, showAllColumns], // 👈 ADDED showAllColumns TO DEPENDENCIES
  );



  useEffect(() => {
    const timer = setTimeout(() => {
      handleResize(parentRef.current?.clientWidth ?? 0);
    }, 100);

    return () => clearTimeout(timer);
  }, [handleResize]);

  useEffect(() => {
    const handleWindowResize = () => {
      handleResize(parentRef.current?.clientWidth ?? 0);
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [handleResize]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    observeElementRect: (instance, cb) => {
      observeElementRect(instance, (rect) => {


        cb(rect);
        handleResize(rect.width);
      });
    },
  });

  if (data.length === 0 && !isLoading) {
    return (
      emptyState ?? (
        <Typography size="body-paragraph-m" variant="default" className="text-text-default-primary">
          {t("table.noData")}
        </Typography>
      )
    );
  }

  return (
    <div
      data-virtual-table="container"
      className={clsx("flex w-full flex-[1_1_0] flex-col", tableClasses.table, noBorder && "!rounded-none border-0")}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <div
          data-virtual-table="header"
          key={headerGroup.id}
          className={cx(tableClasses.tableHeader, flexibleColumnId && "flex")}
        >
          {headerGroup.headers.map((header) => {
            const isFlexibleColumn = TableUtils.isColumnFlexible(header.column, flexibleColumnId);

            return (
              <div
                key={header.id}
                style={{
                  width: TableUtils.getColumnWidth(header.column, isFlexibleColumn),
                }}
                className={clsx(isFlexibleColumn ? "min-w-0 flex-1" : "inline-block", tableClasses.tableCell)}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            );
          })}
        </div>
      ))}
      <div data-virtual-table="scroll-pane" ref={parentRef} className="flex-[1_1_0] gap-3 overflow-y-auto">
        <div
          data-virtual-table="rows"
          className={clsx("overflow-y-hidden", className)}
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {!isLoading &&
            virtualizer.getVirtualItems().map((virtualRow, rowIndex) => {
              const row = rows[virtualRow.index];
              onRowDataUsed?.(row.original);
              return (
                <div
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cx(
                    "cursor-pointer",
                    rowClassname?.(row.original),
                    tableClasses.tableRow,
                    flexibleColumnId && "flex",
                  )}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start - rowIndex * virtualRow.size}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isFlexibleColumn = TableUtils.isColumnFlexible(cell.column, flexibleColumnId);

                    return (
                      <div
                        className={isFlexibleColumn ? "min-w-0 flex-1" : "inline-block"}
                        key={cell.id}
                        style={{
                          width: TableUtils.getColumnWidth(cell.column, isFlexibleColumn),
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          {!isLoading && table.getRowModel().rows.length === 0 && (
            <div>
              <Typography size="body-paragraph-m" variant="default" className="text-text-default-primary">
                {t("table.noData")}
              </Typography>
            </div>
          )}
          {isLoading && (
            <div className={tableClasses.tableLoading}>
              <Loader size="l" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
