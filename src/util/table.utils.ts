import { Column, RowSelectionState } from "@tanstack/react-table";

export namespace TableUtils {
  export const getSelectedRows = <T>(rowSelection: RowSelectionState, data?: T[]) => {
    if (!data) {
      return [];
    }

    const selectedIndexes = Object.keys(rowSelection)
      .filter((index) => rowSelection[index])
      .map((index) => parseInt(index, 10));

    return selectedIndexes.map((index) => data?.[index]).filter(Boolean);
  };

  export const getColumnWidth = (column: Column<any>, isColWidthDisabled?: boolean) => {
    if (isColWidthDisabled) {
      return undefined;
    }
    if (column.columnDef.size) {
      return column.columnDef.size;
    }
    return undefined;
  };

  export const isColumnFlexible = (column: Column<any>, flexibleColumnId?: string) => {
    return !!flexibleColumnId && (column.columnDef as any).accessorKey === flexibleColumnId;
  };
}
