import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { DataTable, DataTableServerResponse } from '@/Components/DataTable';
import { ColumnDef } from '@tanstack/react-table';

interface StockPicking {
  id: number;
  name: string;
  purchaseOrder: {
    id: number;
    name: string;
    partner: {
      name: string;
    };
  } | null;
  state: 'draft' | 'waiting' | 'confirmed' | 'assigned' | 'done' | 'cancel';
  scheduled_date: string;
  date_done?: string;
  created_at: string;
}

interface PaginatedResponse extends DataTableServerResponse<StockPicking> {}

interface Props {
  pickings: PaginatedResponse;
  filters?: {
    search?: string;
    per_page?: number;
    state?: string;
  };
}

const createReceiptColumns = (): ColumnDef<StockPicking>[] => [
  {
    accessorKey: 'name',
    header: 'Nomor Receipt',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center font-semibold text-sm text-green-600 dark:text-green-400">
          RC
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.original.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(row.original.scheduled_date).toLocaleDateString('id-ID')}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'purchaseOrder.name',
    header: 'Purchase Order',
    cell: ({ row }) => {
      const purchaseOrder = row.original.purchaseOrder;
      if (!purchaseOrder || !purchaseOrder.name) {
        return <span className="text-gray-400">-</span>;
      }
      return (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {purchaseOrder.name}
          </div>
          {purchaseOrder.partner && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {purchaseOrder.partner.name}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'state',
    header: 'Status',
    cell: ({ getValue }) => {
      const state = getValue() as string;
      const stateLabels: Record<string, { label: string; color: string }> = {
        draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
        waiting: { label: 'Waiting', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
        confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
        assigned: { label: 'Assigned', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
        done: { label: 'Received', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
        cancel: { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      };
      const stateInfo = stateLabels[state] || { label: state, color: 'bg-gray-100 text-gray-700' };
      return (
        <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${stateInfo.color}`}>
          {stateInfo.label}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/receipts/${row.original.id}`}
          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          title="Lihat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </Link>
      </div>
    ),
  },
];

export default function Index({ pickings, filters }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const receiptColumns = createReceiptColumns();

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setIsLoading(true);
    router.get(
      '/receipts',
      {
        page: pageIndex,
        per_page: pageSize,
        search: filters?.search || '',
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
      '/receipts',
      {
        page: 1,
        per_page: filters?.per_page || 10,
        search: search || '',
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
      '/receipts',
      {
        page: 1,
        per_page: filters?.per_page || 10,
        search: filters?.search || '',
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
    <AdminLayout title="Receipt (Goods Receipt)">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <PageHeader
            title="Receipt (Goods Receipt)"
            description="Kelola penerimaan barang dari Purchase Order"
          />
        </div>

        <DataTable
          data={pickings.data}
          columns={receiptColumns}
          pagination={{
            current_page: pickings.current_page,
            per_page: pickings.per_page,
            total: pickings.total,
            last_page: pickings.last_page,
            from: pickings.from,
            to: pickings.to,
          }}
          searchValue={filters?.search || ''}
          onPaginationChange={handlePaginationChange}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          filters={[
            {
              key: 'state',
              label: 'Status',
              value: filters?.state || '',
              placeholder: 'Semua Status',
              options: [
                { value: 'draft', label: 'Draft' },
                { value: 'waiting', label: 'Waiting' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'assigned', label: 'Assigned' },
                { value: 'done', label: 'Received' },
              ],
            },
          ]}
          searchPlaceholder="Cari berdasarkan nomor receipt atau PO..."
          isLoading={isLoading}
          emptyMessage="Tidak ada receipt yang ditemukan"
        />
      </div>
    </AdminLayout>
  );
}

