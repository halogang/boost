import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { DataTable, DataTableServerResponse } from '@/Components/DataTable';
import { createProductColumns, ProductProduct } from './columns';
import { Button } from '@/Components/Button';
import { useCrudActions } from '@/hooks/useCrudActions';

interface PaginatedResponse extends DataTableServerResponse<ProductProduct> {}

interface Props {
  products: PaginatedResponse;
  categories: string[];
  types: Record<string, string>;
  filters?: {
    search?: string;
    per_page?: number;
    type?: string;
    category?: string;
    active?: string;
  };
}

export default function Index({ products, categories, types, filters }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { handleDelete } = useCrudActions({
    resourceName: 'Produk',
    baseRoute: '/products',
  });

  // Create columns with delete handler
  const productColumns = createProductColumns({
    onDelete: (id, name) => handleDelete(id, name),
  });

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setIsLoading(true);
    router.get(
      '/products',
      {
        page: pageIndex,
        per_page: pageSize,
        search: filters?.search || '',
        type: filters?.type || '',
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
      '/products',
      {
        page: 1,
        per_page: filters?.per_page || 10,
        search: search || '',
        type: filters?.type || '',
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
      '/products',
      {
        page: 1,
        per_page: filters?.per_page || 10,
        search: filters?.search || '',
        type: filterValues.type || '',
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
    <AdminLayout title="Master Data Produk">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <PageHeader
            title="Master Data Produk"
            description="Kelola data produk untuk pembelian dan inventori"
            actions={
              <Link href="/products/create">
                <Button>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Produk
                </Button>
              </Link>
            }
          />
        </div>

        {/* DataTable */}
        <DataTable
          data={products.data}
          columns={productColumns}
          pagination={{
            current_page: products.current_page,
            per_page: products.per_page,
            total: products.total,
            last_page: products.last_page,
            from: products.from,
            to: products.to,
          }}
          searchValue={filters?.search || ''}
          onPaginationChange={handlePaginationChange}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          filters={[
            {
              key: 'type',
              label: 'Tipe',
              value: filters?.type || '',
              placeholder: 'Semua Tipe',
              options: Object.entries(types).map(([value, label]) => ({
                value,
                label,
              })),
            },
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
          searchPlaceholder="Cari produk berdasarkan nama, SKU, atau barcode..."
          isLoading={isLoading}
          emptyMessage="Tidak ada produk yang ditemukan"
        />
      </div>
    </AdminLayout>
  );
}

