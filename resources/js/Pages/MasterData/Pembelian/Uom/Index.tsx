import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { DataTable, DataTableServerResponse } from '@/Components/DataTable';
import { createUomColumns, Uom } from './columns';
import { Button } from '@/Components/Button';
import { useCrudActions } from '@/hooks/useCrudActions';

interface PaginatedResponse extends DataTableServerResponse<Uom> {}

interface Props {
  uoms: PaginatedResponse;
  categories: string[];
  filters?: {
    search?: string;
    per_page?: number;
    category?: string;
    active?: string;
  };
}

export default function Index({ uoms, categories, filters }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { handleDelete } = useCrudActions({
    resourceName: 'UOM',
    baseRoute: '/uoms',
  });

  // Create columns with delete handler
  const uomColumns = createUomColumns({
    onDelete: (id, name) => handleDelete(id, name),
  });

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setIsLoading(true);
    router.get(
      '/uoms',
      {
        page: pageIndex,
        per_page: pageSize,
        search: filters?.search || '',
        category: filters?.category || '',
        active: filters?.active || '',
      },
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setIsLoading(false),
      }
    );
  };

  const handleSearchChange = (search: string) => {
    setIsLoading(true);
    router.get(
      '/uoms',
      {
        page: 1, // Reset to first page on search
        per_page: filters?.per_page || 10,
        search: search || '',
        category: filters?.category || '',
        active: filters?.active || '',
      },
      {
        preserveState: true,
        preserveScroll: false,
        onFinish: () => setIsLoading(false),
      }
    );
  };

  const handleFilterChange = (filterValues: Record<string, any>) => {
    setIsLoading(true);
    router.get(
      '/uoms',
      {
        page: 1, // Reset to first page on filter change
        per_page: filters?.per_page || 10,
        search: filters?.search || '',
        category: filterValues.category || '',
        active: filterValues.active || '',
      },
      {
        preserveState: true,
        preserveScroll: false,
        onFinish: () => setIsLoading(false),
      }
    );
  };

  return (
    <AdminLayout title="Unit of Measure (UOM)">
      <div className="space-y-6">
        {/* Page Header with Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <PageHeader
            title="Unit of Measure (UOM)"
            description="Kelola satuan ukur untuk produk dan inventori"
            actions={
              <Link href="/uoms/create">
                <Button>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah UOM
                </Button>
              </Link>
            }
          />
        </div>

        {/* DataTable */}
        <DataTable
          data={uoms.data}
          columns={uomColumns}
          pagination={{
            current_page: uoms.current_page,
            per_page: uoms.per_page,
            total: uoms.total,
            last_page: uoms.last_page,
            from: uoms.from,
            to: uoms.to,
          }}
          searchValue={filters?.search || ''}
          onPaginationChange={handlePaginationChange}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          filters={[
            {
              key: 'category',
              label: 'Kategori',
              value: filters?.category || '',
              placeholder: 'Semua Kategori',
              options: categories.map((cat) => ({
                value: cat,
                label: cat,
              })),
            },
            {
              key: 'active',
              label: 'Status',
              value: filters?.active || '',
              placeholder: 'Semua Status',
              options: [
                { value: '1', label: 'Aktif' },
                { value: '0', label: 'Nonaktif' },
              ],
            },
          ]}
          searchPlaceholder="Cari UOM berdasarkan nama atau deskripsi..."
          isLoading={isLoading}
          emptyMessage="Tidak ada UOM yang ditemukan"
        />
      </div>
    </AdminLayout>
  );
}

