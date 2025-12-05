import { ColumnDef, OnChangeFn, SortingState } from "@tanstack/react-table";

export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  isLoading?: boolean;
  className?: string;
  rowClassname?: (row: TData) => string;
  manualSorting?: boolean;
  onRowDataUsed?: (rowData: TData) => void;
  onRowClick?: (rowData: TData) => void;
  showAllColumns?: boolean;
  noBorder?: boolean;
  rowHeight?: number;
  containerClassName?: string;
  flexibleColumnId?: string;
}
