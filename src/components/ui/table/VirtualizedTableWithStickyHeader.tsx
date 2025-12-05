import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { observeElementRect } from "@tanstack/virtual-core";
import { cx } from "class-variance-authority";
import clsx from "clsx";
import { throttle } from "lodash-es";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Loader } from "@/components/ui/status/Loader/Loader";
import { tableClasses } from "@/components/ui/table/Table";
import { TableProps } from "@/components/ui/table/TableProps";
import { Typography } from "@/components/ui/text/Typography/Typography";

export function VirtualizedTableWithStickyHeader<TData>({
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
  containerClassName,
}: TableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange,
    manualSorting,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    defaultColumn: {
      size: undefined,
    },
  });

  const { t } = useTranslation();

  const { rows } = table.getRowModel();

  const parentRef = useRef<HTMLDivElement>(null);

  const initialColumnWidths: number[] = columns.map((column) => {
    return column.size ?? 150;
  });
  const totalInitialColumnWidth = initialColumnWidths.reduce((acc, width) => acc + width, 0);
  const columnWeights = initialColumnWidths.map((width) => width / totalInitialColumnWidth);

  const [columnWidths, setColumnWidths] = useState(initialColumnWidths);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResize = useCallback(
    throttle(() => {
      const parent = parentRef.current;
      const parentWidth = parent?.clientWidth ?? totalInitialColumnWidth;

      const newColumnWidths = columnWeights.map((weight) => Math.floor(parentWidth * weight));

      setColumnWidths(newColumnWidths);
    }, 33) /* approx 30 fps */,
    [],
  );

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 47,
    observeElementRect: (instance, cb) => {
      observeElementRect(instance, (rect) => {
        cb(rect);
        handleResize();
      });
    },
  });

  // Schedule initial resize to set column widths
  handleResize();

  return (
    <div
      data-virtual-table="container"
      className={clsx("flex h-full w-full flex-[1_1_0] flex-col", tableClasses.table, containerClassName)}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <div data-virtual-table="header" key={headerGroup.id} className={cx(tableClasses.tableHeader)}>
          {headerGroup.headers.map((header, colIndex) => {
            return (
              <div
                key={header.id}
                style={{
                  width: `${columnWidths[colIndex]}px`,
                }}
                className={clsx("inline-block", tableClasses.tableCell)}
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
                  className={cx("cursor-pointer", rowClassname?.(row.original), tableClasses.tableRow)}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start - rowIndex * virtualRow.size}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell, colIndex) => {
                    return (
                      <div
                        className="inline-block"
                        key={cell.id}
                        style={{
                          width: `${columnWidths[colIndex]}px`,
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
              <Typography size="body-paragraph-m" variant="default" className="text-white">
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
}
