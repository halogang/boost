import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { DataTableProps } from './types';
import { DataTablePerPage } from './DataTablePerPage';
import { DataTableSearch } from './DataTableSearch';
import { DataTablePagination } from './DataTablePagination';
import { DataTableFilters } from './DataTableFilters';

export function DataTable<T>({
  data,
  columns,
  pagination,
  onPaginationChange,
  onSearchChange,
  onFilterChange,
  filters = [],
  searchValue: initialSearchValue = '',
  searchPlaceholder = 'Cari...',
  isLoading = false,
  showSearch = true,
  showPagination = true,
  showPerPage = true,
  perPageOptions = [10, 25, 50, 100],
  emptyMessage = 'Tidak ada data yang ditemukan',
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastSentSearchRef = React.useRef<string>(initialSearchValue);
  const isSyncingFromServerRef = React.useRef<boolean>(false);
  
  // Initialize filter values from filters prop
  const initialFilterValues = filters.reduce((acc, filter) => {
    acc[filter.key] = filter.value || '';
    return acc;
  }, {} as Record<string, any>);
  const [filterValues, setFilterValues] = useState<Record<string, any>>(initialFilterValues);

  // Sync state with props when they change (only if different from what we sent)
  useEffect(() => {
    // Only sync if server response matches what we sent (confirmation from server)
    if (initialSearchValue === lastSentSearchRef.current) {
      // Server response matches what we sent - update state if needed
      if (initialSearchValue !== searchValue) {
        isSyncingFromServerRef.current = true;
        setSearchValue(initialSearchValue);
        // Reset flag after state update
        setTimeout(() => {
          isSyncingFromServerRef.current = false;
        }, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearchValue]);

  useEffect(() => {
    const newFilterValues = filters.reduce((acc, filter) => {
      acc[filter.key] = filter.value || '';
      return acc;
    }, {} as Record<string, any>);
    
    // Only update if values actually changed
    const hasChanged = Object.keys(newFilterValues).some(
      key => newFilterValues[key] !== filterValues[key]
    );
    if (hasChanged) {
      setFilterValues(newFilterValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<T>[],
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination?.last_page ?? -1,
  });

  // Debounce search to avoid too many requests
  useEffect(() => {
    // Skip if syncing from server (don't trigger search on server response)
    if (isSyncingFromServerRef.current) {
      return;
    }

    // Skip if value is same as last sent value (no need to search again)
    if (searchValue === lastSentSearchRef.current) {
      return;
    }

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search - wait 500ms after user stops typing
    searchTimeoutRef.current = setTimeout(() => {
      if (onSearchChange && searchValue !== lastSentSearchRef.current) {
        lastSentSearchRef.current = searchValue;
        onSearchChange(searchValue);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // Don't call onSearchChange immediately - let debounce handle it
  };

  const handlePerPageChange = (perPage: number) => {
    if (onPaginationChange) {
      onPaginationChange(1, perPage);
    }
  };

  const handlePageChange = (page: number) => {
    if (onPaginationChange && pagination) {
      onPaginationChange(page, pagination.per_page);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1 min-w-0">
          {showSearch && (
            <div className="w-full md:flex-1 md:max-w-sm">
              <DataTableSearch
                value={searchValue}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
              />
            </div>
          )}
          {filters.length > 0 && (
            <div className="w-full md:w-auto overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <DataTableFilters
                filters={filters}
                values={filterValues}
                onChange={handleFilterChange}
              />
            </div>
          )}
        </div>
        {showPerPage && pagination && (
          <div className="flex-shrink-0">
            <DataTablePerPage
              value={pagination.per_page}
              options={perPageOptions}
              onChange={handlePerPageChange}
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto -mx-3 md:mx-0">
          <div className="inline-block min-w-full align-middle px-3 md:px-0">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm dark:text-gray-200">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {showPagination && pagination && pagination.last_page > 1 && (
        <DataTablePagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          total={pagination.total}
          from={pagination.from}
          to={pagination.to}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
