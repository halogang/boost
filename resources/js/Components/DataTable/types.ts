export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface DataTablePaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from?: number;
  to?: number;
}

export interface DataTableServerResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from?: number;
  to?: number;
}

export interface DataTableFilter {
  key: string;
  label: string;
  options: Array<{ value: string | number; label: string }>;
  value?: string | number;
  placeholder?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: any[];
  pagination?: DataTablePaginationMeta;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
  onSearchChange?: (search: string) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  filters?: DataTableFilter[];
  searchPlaceholder?: string;
  isLoading?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  showPerPage?: boolean;
  perPageOptions?: number[];
  emptyMessage?: string;
}
