import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { DataTable, DataTableServerResponse } from '@/Components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/Components/Button';

interface AccountMove {
  id: number;
  name: string;
  partner: {
    id: number;
    name: string;
  };
  purchaseOrder: {
    id: number;
    name: string;
  } | null;
  invoice_date: string;
  invoice_date_due?: string;
  state: 'draft' | 'posted' | 'cancel';
  payment_state: 'not_paid' | 'partial' | 'paid' | 'invoicing_legacy';
  amount_total: number;
  amount_residual: number;
  ref?: string;
}

interface PaginatedResponse extends DataTableServerResponse<AccountMove> {}

interface Props {
  bills: PaginatedResponse;
  filters?: {
    search?: string;
    per_page?: number;
    state?: string;
    payment_state?: string;
    year?: string;
    month?: string;
  };
  availableYears?: number[];
}

const createVendorBillColumns = (): ColumnDef<AccountMove>[] => [
  {
    accessorKey: 'name',
    header: 'Nomor Invoice',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center font-semibold text-sm text-purple-600 dark:text-purple-400">
          BILL
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.original.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(row.original.invoice_date).toLocaleDateString('id-ID')}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'partner.name',
    header: 'Vendor',
    cell: ({ row }) => (
      <span className="font-medium text-gray-900 dark:text-white">
        {row.original.partner.name}
      </span>
    ),
  },
  {
    accessorKey: 'purchaseOrder.name',
    header: 'Purchase Order',
    cell: ({ row }) => (
      <span className="text-gray-900 dark:text-white">
        {row.original.purchaseOrder?.name || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'state',
    header: 'Status',
    cell: ({ getValue }) => {
      const state = getValue() as string;
      const stateLabels: Record<string, { label: string; color: string }> = {
        draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
        posted: { label: 'Posted', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
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
    accessorKey: 'payment_state',
    header: 'Payment',
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const statusLabels: Record<string, { label: string; color: string }> = {
        not_paid: { label: 'Not Paid', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
        partial: { label: 'Partial', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
        paid: { label: 'Paid', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
        invoicing_legacy: { label: 'Legacy', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
      };
      const statusInfo = statusLabels[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
      return (
        <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      );
    },
  },
  {
    accessorKey: 'amount_total',
    header: 'Total',
    cell: ({ row }) => (
      <div className="text-right">
        <div className="font-semibold text-gray-900 dark:text-white">
          Rp {row.original.amount_total.toLocaleString('id-ID')}
        </div>
        {row.original.amount_residual > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Sisa: Rp {row.original.amount_residual.toLocaleString('id-ID')}
          </div>
        )}
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/vendor-bills/${row.original.id}`}
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

const monthOptions = [
  { value: '1', label: 'Januari' },
  { value: '2', label: 'Februari' },
  { value: '3', label: 'Maret' },
  { value: '4', label: 'April' },
  { value: '5', label: 'Mei' },
  { value: '6', label: 'Juni' },
  { value: '7', label: 'Juli' },
  { value: '8', label: 'Agustus' },
  { value: '9', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

export default function Index({ bills, filters, availableYears = [] }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const billColumns = createVendorBillColumns();

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setIsLoading(true);
    router.get(
      '/vendor-bills',
      {
        page: pageIndex,
        per_page: pageSize,
        search: filters?.search || '',
        state: filters?.state || '',
        payment_state: filters?.payment_state || '',
        year: filters?.year || '',
        month: filters?.month || '',
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
      '/vendor-bills',
      {
        page: 1,
        per_page: filters?.per_page || 10,
        search: search || '',
        state: filters?.state || '',
        payment_state: filters?.payment_state || '',
        year: filters?.year || '',
        month: filters?.month || '',
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
      '/vendor-bills',
      {
        page: 1,
        per_page: filters?.per_page || 10,
        search: filters?.search || '',
        state: filterValues.state || '',
        payment_state: filterValues.payment_state || '',
        year: filterValues.year || '',
        month: filterValues.month || '',
      },
      {
        preserveState: true,
        preserveScroll: false,
        onFinish: () => setIsLoading(false),
      }
    );
  };

  return (
    <AdminLayout title="Vendor Bill">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-3 md:p-4 lg:p-6">
          <PageHeader
            title="Vendor Bill"
            description="Kelola invoice pembelian dari vendor"
            actions={
              <Button onClick={() => router.visit('/vendor-bills/create')}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Buat Vendor Bill
              </Button>
            }
          />
        </div>

        <DataTable
          data={bills.data}
          columns={billColumns}
          pagination={{
            current_page: bills.current_page,
            per_page: bills.per_page,
            total: bills.total,
            last_page: bills.last_page,
            from: bills.from,
            to: bills.to,
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
                { value: 'posted', label: 'Posted' },
              ],
            },
            {
              key: 'year',
              label: 'Tahun',
              value: filters?.year || '',
              placeholder: 'Semua Tahun',
              options: availableYears.map((year) => ({
                value: year.toString(),
                label: year.toString(),
              })),
            },
            {
              key: 'month',
              label: 'Bulan',
              value: filters?.month || '',
              placeholder: 'Semua Bulan',
              options: monthOptions,
            },
            {
              key: 'payment_state',
              label: 'Payment',
              value: filters?.payment_state || '',
              placeholder: 'Semua Payment',
              options: [
                { value: 'not_paid', label: 'Not Paid' },
                { value: 'partial', label: 'Partial' },
                { value: 'paid', label: 'Paid' },
              ],
            },
          ]}
          searchPlaceholder="Cari berdasarkan nomor invoice, vendor, atau PO..."
          isLoading={isLoading}
          emptyMessage="Tidak ada vendor bill yang ditemukan"
        />
      </div>
    </AdminLayout>
  );
}

