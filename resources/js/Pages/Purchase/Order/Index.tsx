import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { DataTable, DataTableServerResponse } from '@/Components/DataTable';
import { createPurchaseOrderColumns, PurchaseOrder } from './columns';
import { Button } from '@/Components/Button';
import { useCrudActions } from '@/hooks/useCrudActions';
import { HintGuide } from '@/Components/HintGuide';

interface PaginatedResponse extends DataTableServerResponse<PurchaseOrder> {}

interface Props {
  orders: PaginatedResponse;
  filters?: {
    search?: string;
    per_page?: number;
    type?: string;
    state?: string;
    year?: string;
    month?: string;
  };
  availableYears?: number[];
}

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

export default function Index({ orders, filters, availableYears = [] }: Props) {
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
      '/purchase-orders',
      {
        page: 1,
        per_page: filters?.per_page || 10,
        search: search || '',
        type: filters?.type || '',
        state: filters?.state || '',
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
      '/purchase-orders',
      {
        page: 1,
        per_page: filters?.per_page || 10,
        search: filters?.search || '',
        type: filterValues.type || '',
        state: filterValues.state || '',
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
    <AdminLayout title="RFQ & Purchase Order">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-3 md:p-4 lg:p-6">
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

        <HintGuide
          title="Panduan RFQ & Purchase Order"
          items={[
            {
              number: 1,
              title: 'Filter & Pencarian',
              description: 'Gunakan filter Tipe (RFQ/PO), Status, Tahun, dan Bulan untuk menemukan data dengan cepat. Gunakan search untuk mencari berdasarkan nomor atau vendor.',
            },
            {
              number: 2,
              title: 'Status RFQ/PO',
              description: 'Draft (baru dibuat), Sent (terkirim ke vendor), To Approve (menunggu persetujuan), Purchase (PO dikonfirmasi), Done (selesai), atau Cancel (dibatalkan).',
            },
            {
              number: 3,
              title: 'Konfirmasi RFQ ke PO',
              description: 'RFQ yang sudah disetujui dapat dikonfirmasi menjadi PO. Setelah dikonfirmasi, sistem akan otomatis membuat Receipt untuk produk storable.',
            },
            {
              number: 4,
              title: 'Edit & Hapus',
              description: 'RFQ dengan status "Draft" atau "Sent" dapat diedit. RFQ "Draft" dapat dihapus. PO yang sudah dikonfirmasi tidak dapat diubah.',
            },
          ]}
          tips="Pastikan semua detail produk dan harga sudah benar sebelum mengkonfirmasi RFQ menjadi PO, karena akan mempengaruhi Receipt dan Vendor Bill."
        />

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
          ]}
          searchPlaceholder="Cari berdasarkan nomor RFQ/PO atau vendor..."
          isLoading={isLoading}
          emptyMessage="Tidak ada RFQ/PO yang ditemukan"
        />
      </div>
    </AdminLayout>
  );
}

