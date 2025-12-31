import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { DataTable, DataTableServerResponse } from '@/Components/DataTable';
import { createPurchaseOrderColumns, PurchaseOrder } from './columns';
import { Button } from '@/Components/Button';
import { useCrudActions } from '@/hooks/useCrudActions';

interface PaginatedResponse extends DataTableServerResponse<PurchaseOrder> {}

interface Props {
  orders: PaginatedResponse;
  filters?: {
    search?: string;
    per_page?: number;
    type?: string;
    state?: string;
  };
}

export default function Index({ orders, filters }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { handleDelete } = useCrudActions({
    resourceName: 'RFQ/PO',
    baseRoute: '/purchase-orders',
  });

  const orderColumns = createPurchaseOrderColumns({
    onDelete: (id, name) => handleDelete(id, name),
  });

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setIsLoading(true);
    router.get(
      '/purchase-orders',
      {
        page: pageIndex,
        per_page: pageSize,
        search: filters?.search || '',
        type: filters?.type || '',
        state: filters?.state || '',
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
      '/purchase-orders',
      {
        page: 1,
        per_page: filters?.per_page || 10,
        search: search || '',
        type: filters?.type || '',
        state: filters?.state || '',
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
      '/purchase-orders',
      {
        page: 1,
        per_page: filters?.per_page || 10,
        search: filters?.search || '',
        type: filterValues.type || '',
        state: filterValues.state || '',
      },
      {
        preserveState: true,
        preserveScroll: false,
        onFinish: () => setIsLoading(false),
      }
    );
  };

  return (
    <AdminLayout title="RFQ & Purchase Order">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <PageHeader
            title="RFQ & Purchase Order"
            description="Kelola Request for Quotation (RFQ) dan Purchase Order (PO)"
            actions={
              <Link href="/purchase-orders/create">
                <Button>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Buat RFQ
                </Button>
              </Link>
            }
          />
        </div>

        <DataTable
          data={orders.data}
          columns={orderColumns}
          pagination={{
            current_page: orders.current_page,
            per_page: orders.per_page,
            total: orders.total,
            last_page: orders.last_page,
            from: orders.from,
            to: orders.to,
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
              options: [
                { value: 'rfq', label: 'RFQ' },
                { value: 'po', label: 'PO' },
              ],
            },
            {
              key: 'state',
              label: 'Status',
              value: filters?.state || '',
              placeholder: 'Semua Status',
              options: [
                { value: 'draft', label: 'Draft' },
                { value: 'sent', label: 'Sent' },
                { value: 'to approve', label: 'To Approve' },
                { value: 'purchase', label: 'PO Confirmed' },
                { value: 'done', label: 'Done' },
              ],
            },
          ]}
          searchPlaceholder="Cari berdasarkan nomor RFQ/PO atau vendor..."
          isLoading={isLoading}
          emptyMessage="Tidak ada RFQ/PO yang ditemukan"
        />
      </div>
    </AdminLayout>
  );
}

