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
  searchPlaceholder = 'Cari...',
  isLoading = false,
  showSearch = true,
  showPagination = true,
  showPerPage = true,
  perPageOptions = [10, 25, 50, 100],
  emptyMessage = 'Tidak ada data yang ditemukan',
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>(
    filters.reduce((acc, filter) => ({ ...acc, [filter.key]: filter.value || '' }), {})
  );

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<T>[],
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination?.last_page ?? -1,
  });

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1">
          {showSearch && (
            <DataTableSearch
              value={searchValue}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
            />
          )}
          {filters.length > 0 && (
            <DataTableFilters
              filters={filters}
              values={filterValues}
              onChange={handleFilterChange}
            />
          )}
        </div>
        {showPerPage && pagination && (
          <DataTablePerPage
            value={pagination.per_page}
            options={perPageOptions}
            onChange={handlePerPageChange}
          />
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
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
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-gray-500"
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
                  <tr key={row.id} className="hover:bg-gray-50 transition">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
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
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
