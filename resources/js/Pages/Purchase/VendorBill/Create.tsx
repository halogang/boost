import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { Button } from '@/Components/Button';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { useToast } from '@/hooks/useToast';
import { formatQuantity } from '@/lib/utils';
import { HintGuide } from '@/Components/HintGuide';
import { DataTable, DataTableServerResponse } from '@/Components/DataTable';
import { ColumnDef } from '@tanstack/react-table';

interface PurchaseOrderLine {
  id: number;
  product: {
    id: number;
    name: string;
    default_code: string;
    type?: 'consu' | 'product' | 'service'; // Product type
  };
  product_qty: number;
  qty_received: number;
  qty_invoiced: number;
  price_unit: number;
  price_total: number;
  tax_rate: number;
}

interface PurchaseOrder {
  id: number;
  name: string;
  date_order?: string;
  state?: 'draft' | 'sent' | 'to approve' | 'purchase' | 'done' | 'cancel';
  invoice_status?: 'no' | 'to invoice' | 'invoiced' | 'paid';
  partner: {
    id: number;
    name: string;
  };
  orderLines?: PurchaseOrderLine[];
  order_lines?: PurchaseOrderLine[]; // Laravel sends snake_case
}

interface Props {
  purchaseOrder?: PurchaseOrder;
  purchaseOrders?: DataTableServerResponse<PurchaseOrder>;
  filters?: {
    search?: string;
    per_page?: number;
    state?: string;
    year?: string;
    month?: string;
  };
  availableYears?: number[];
}

const getMonthOptions = () => {
  return [
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
};

const createPurchaseOrderColumns = (): ColumnDef<PurchaseOrder>[] => [
  {
    accessorKey: 'name',
    header: 'Nomor PO',
    cell: ({ row }) => (
      <Link
        href={`/vendor-bills/create?purchase_id=${row.original.id}`}
        className="flex items-center gap-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-semibold text-sm text-blue-600 dark:text-blue-400">
          PO
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.original.name}</div>
          {row.original.date_order && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(row.original.date_order).toLocaleDateString('id-ID')}
            </div>
          )}
        </div>
      </Link>
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
    accessorKey: 'state',
    header: 'Status',
    cell: ({ row }) => {
      const state = row.original.state || 'purchase';
      const stateLabels: Record<string, { label: string; color: string }> = {
        purchase: { label: 'Purchase', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
        done: { label: 'Done', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      };
      const stateInfo = stateLabels[state] || { label: state, color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' };
      return (
        <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${stateInfo.color}`}>
          {stateInfo.label}
        </span>
      );
    },
  },
  {
    accessorKey: 'invoice_status',
    header: 'Invoice Status',
    cell: ({ row }) => {
      const status = row.original.invoice_status || 'no';
      const statusLabels: Record<string, { label: string; color: string }> = {
        no: { label: 'Belum Invoice', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
        'to invoice': { label: 'To Invoice', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
        invoiced: { label: 'Partial', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
        paid: { label: 'Paid', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      };
      const statusInfo = statusLabels[status] || { label: status, color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' };
      return (
        <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      );
    },
  },
  {
    accessorKey: 'orderLines',
    header: 'Jumlah Item',
    cell: ({ row }) => {
      const lines = row.original.orderLines || row.original.order_lines || [];
      return (
        <span className="text-gray-600 dark:text-gray-400">
          {lines.length} item
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => (
      <Link
        href={`/vendor-bills/create?purchase_id=${row.original.id}`}
        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
      >
        Pilih
      </Link>
    ),
  },
];

export default function Create({ purchaseOrder, purchaseOrders, filters, availableYears }: Props) {
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Normalize orderLines - Laravel sends snake_case, convert to camelCase
  const orderLines = purchaseOrder ? (purchaseOrder.orderLines || purchaseOrder.order_lines || []) : [];

  // If no PO selected, show selection page
  if (!purchaseOrder) {
    return (
      <AdminLayout title="Buat Vendor Bill">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-3 md:p-4 lg:p-6">
            <PageHeader
              title="Buat Vendor Bill"
              description="Pilih Purchase Order untuk dibuatkan invoice"
            />
          </div>

          <HintGuide
            title="Panduan Membuat Vendor Bill"
            items={[
              {
                number: 1,
                title: 'Pilih Purchase Order',
                description: 'Pilih PO yang sudah dikonfirmasi dan memiliki produk yang perlu di-invoice. PO dengan status "Purchase" atau "Done" dapat dibuatkan invoice.',
              },
              {
                number: 2,
                title: 'Metode Invoice',
                description: 'Pilih "Ordered" untuk invoice berdasarkan quantity yang dipesan, atau "Received" untuk invoice berdasarkan quantity yang sudah diterima (untuk produk storable).',
              },
              {
                number: 3,
                title: 'Quantity Invoiced',
                description: 'Sistem akan otomatis menghitung quantity yang belum di-invoice. Invoice partial dapat dibuat jika belum semua quantity di-invoice.',
              },
              {
                number: 4,
                title: 'Post Invoice',
                description: 'Setelah invoice dibuat, gunakan tombol "Post" untuk memposting invoice ke sistem akuntansi sebelum dapat diregistrasi pembayaran.',
              },
            ]}
            tips="Pastikan quantity dan harga sudah sesuai dengan dokumen invoice dari vendor. Invoice yang sudah di-post tidak dapat diubah."
          />

          {purchaseOrders && purchaseOrders.data && purchaseOrders.data.length > 0 ? (
            <DataTable
              data={purchaseOrders.data}
              columns={createPurchaseOrderColumns()}
              pagination={
                purchaseOrders.current_page
                  ? {
                      current_page: purchaseOrders.current_page,
                      per_page: purchaseOrders.per_page,
                      total: purchaseOrders.total,
                      last_page: purchaseOrders.last_page,
                      from: purchaseOrders.from,
                      to: purchaseOrders.to,
                    }
                  : undefined
              }
              searchValue={filters?.search || ''}
              onPaginationChange={(page) => {
                setIsLoading(true);
                router.get(
                  '/vendor-bills/create',
                  {
                    page,
                    per_page: filters?.per_page || 10,
                    search: filters?.search || '',
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
              }}
              onSearchChange={(value) => {
                setIsLoading(true);
                router.get(
                  '/vendor-bills/create',
                  {
                    page: 1,
                    per_page: filters?.per_page || 10,
                    search: value,
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
              }}
              onFilterChange={(filterValues) => {
                setIsLoading(true);
                router.get(
                  '/vendor-bills/create',
                  {
                    page: 1,
                    per_page: filters?.per_page || 10,
                    search: filters?.search || '',
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
              }}
              filters={[
                {
                  key: 'state',
                  label: 'Status',
                  value: filters?.state || '',
                  placeholder: 'Semua Status',
                  options: [
                    { value: 'purchase', label: 'Purchase' },
                    { value: 'done', label: 'Done' },
                  ],
                },
                {
                  key: 'year',
                  label: 'Tahun',
                  value: filters?.year || '',
                  placeholder: 'Semua Tahun',
                  options: (availableYears || []).map((year) => ({ value: year.toString(), label: year.toString() })),
                },
                {
                  key: 'month',
                  label: 'Bulan',
                  value: filters?.month || '',
                  placeholder: 'Semua Bulan',
                  options: getMonthOptions(),
                },
              ]}
              isLoading={isLoading}
              emptyMessage="Tidak ada PO yang dapat di-invoice"
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-3 md:p-4 lg:p-6">
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Tidak ada PO yang dapat di-invoice
              </p>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  // If PO selected, show create form
  if (!purchaseOrder) {
    return null;
  }

  const { data, setData, post, processing, errors } = useForm({
    purchase_id: purchaseOrder.id,
    invoice_date: new Date().toISOString().split('T')[0],
    invoice_date_due: '',
    ref: '',
    narration: '',
    invoice_method: 'received' as 'ordered' | 'received',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/vendor-bills', {
      preserveScroll: true,
      onSuccess: () => {
        success('Vendor Bill berhasil dibuat');
      },
      onError: () => {
        error('Gagal membuat Vendor Bill');
      },
    });
  };

  // Calculate due date (30 days from invoice date)
  const calculateDueDate = (date: string) => {
    if (!date) return '';
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + 30);
    return dueDate.toISOString().split('T')[0];
  };

  return (
    <AdminLayout title="Buat Vendor Bill">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-3 md:p-4 lg:p-6">
          <PageHeader
            title="Buat Vendor Bill"
            description={`Dari PO: ${purchaseOrder.name} • ${purchaseOrder.partner.name}`}
          />
        </div>

        <HintGuide
          title="Panduan Membuat Vendor Bill"
          items={[
            {
              number: 1,
              title: 'Metode Invoice',
              description: 'Pilih "Ordered" untuk invoice berdasarkan quantity yang dipesan, atau "Received" untuk invoice berdasarkan quantity yang sudah diterima (untuk produk storable).',
            },
            {
              number: 2,
              title: 'Quantity Invoiced',
              description: 'Sistem akan otomatis menghitung quantity yang belum di-invoice. Quantity yang sudah di-invoice sebelumnya akan dikurangi dari total.',
            },
            {
              number: 3,
              title: 'Tanggal & Due Date',
              description: 'Isi tanggal invoice sesuai dengan dokumen dari vendor. Due date akan otomatis terisi berdasarkan payment term vendor (default 30 hari).',
            },
            {
              number: 4,
              title: 'Post Invoice',
              description: 'Setelah invoice dibuat, gunakan tombol "Post" untuk memposting invoice ke sistem akuntansi sebelum dapat diregistrasi pembayaran.',
            },
          ]}
          tips="Pastikan semua detail invoice sudah sesuai dengan dokumen dari vendor sebelum menyimpan. Invoice yang sudah di-post tidak dapat diubah."
        />

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-3 md:p-4 lg:p-6 space-y-6">
          {/* Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <InputLabel htmlFor="invoice_date" value="Tanggal Invoice *" />
              <TextInput
                id="invoice_date"
                type="date"
                value={data.invoice_date}
                onChange={(e) => {
                  setData('invoice_date', e.target.value);
                  if (!data.invoice_date_due) {
                    setData('invoice_date_due', calculateDueDate(e.target.value));
                  }
                }}
                className="mt-1"
                required
              />
              {errors.invoice_date && <p className="mt-1 text-sm text-red-600">{errors.invoice_date}</p>}
            </div>

            <div>
              <InputLabel htmlFor="invoice_date_due" value="Tanggal Jatuh Tempo" />
              <TextInput
                id="invoice_date_due"
                type="date"
                value={data.invoice_date_due || calculateDueDate(data.invoice_date)}
                onChange={(e) => setData('invoice_date_due', e.target.value)}
                className="mt-1"
              />
              {errors.invoice_date_due && <p className="mt-1 text-sm text-red-600">{errors.invoice_date_due}</p>}
            </div>

            <div>
              <InputLabel htmlFor="ref" value="Reference (dari Vendor)" />
              <TextInput
                id="ref"
                type="text"
                value={data.ref}
                onChange={(e) => setData('ref', e.target.value)}
                className="mt-1"
                placeholder="Nomor invoice dari vendor"
              />
              {errors.ref && <p className="mt-1 text-sm text-red-600">{errors.ref}</p>}
            </div>
          </div>

          {/* Invoice Method */}
          <div>
            <InputLabel value="Metode Invoice *" />
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="invoice_method"
                  value="ordered"
                  checked={data.invoice_method === 'ordered'}
                  onChange={(e) => setData('invoice_method', e.target.value as 'ordered' | 'received')}
                  className="mr-2"
                />
                <span className="text-gray-700 dark:text-gray-300">Ordered Quantities (Qty yang dipesan)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="invoice_method"
                  value="received"
                  checked={data.invoice_method === 'received'}
                  onChange={(e) => setData('invoice_method', e.target.value as 'ordered' | 'received')}
                  className="mr-2"
                />
                <span className="text-gray-700 dark:text-gray-300">Received Quantities (Qty yang diterima) - Recommended</span>
              </label>
            </div>
            {errors.invoice_method && <p className="mt-1 text-sm text-red-600">{errors.invoice_method}</p>}
          </div>

          {/* Order Lines Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detail Produk</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Produk</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Qty Dipesan</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Qty Diterima</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Qty Di-invoice</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Harga/Unit</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderLines.filter(line => line.product).map((line) => {
                    // Skip lines without product
                    if (!line.product) {
                      return null;
                    }
                    
                    // Qty yang bisa di-invoice
                    // Untuk product consu: selalu pakai ordered qty (tidak ada receipt tracking)
                    // Untuk product storable: pakai metode yang dipilih (ordered atau received)
                    // Jika metode 'received' tapi qty_received = 0, fallback ke ordered qty
                    const isStorableProduct = line.product?.type === 'product';
                    const useReceivedQty = data.invoice_method === 'received' 
                      && isStorableProduct
                      && (line.qty_received ?? 0) > 0; // Hanya pakai received jika ada qty_received
                    
                    const qtyToInvoice = useReceivedQty
                      ? Math.max(0, (line.qty_received ?? 0) - (line.qty_invoiced ?? 0))
                      : Math.max(0, (line.product_qty ?? 0) - (line.qty_invoiced ?? 0));
                    
                    return (
                      <tr key={line.id} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{line.product?.name || 'N/A'}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{line.product?.default_code || '-'}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                          {formatQuantity(line.product_qty)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                          {formatQuantity(line.qty_received)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex flex-col items-end">
                            <span className={`font-medium ${
                              qtyToInvoice > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                            }`}>
                              {qtyToInvoice > 0 ? formatQuantity(qtyToInvoice) : '0'}
                            </span>
                            {line.qty_invoiced > 0 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Sudah: {formatQuantity(line.qty_invoiced)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                          Rp {line.price_unit.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                          {qtyToInvoice > 0 ? (
                            <>Rp {(qtyToInvoice * line.price_unit).toLocaleString('id-ID')}</>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Narration */}
          <div>
            <InputLabel htmlFor="narration" value="Narration / Catatan" />
            <textarea
              id="narration"
              value={data.narration}
              onChange={(e) => setData('narration', e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white"
            />
            {errors.narration && <p className="mt-1 text-sm text-red-600">{errors.narration}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href="/vendor-bills">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={processing}>
              {processing ? 'Menyimpan...' : 'Buat Vendor Bill'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

