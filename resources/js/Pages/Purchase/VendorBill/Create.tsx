import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { Button } from '@/Components/Button';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { useToast } from '@/hooks/useToast';
import { formatQuantity } from '@/lib/utils';

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
  partner: {
    id: number;
    name: string;
  };
  orderLines?: PurchaseOrderLine[];
  order_lines?: PurchaseOrderLine[]; // Laravel sends snake_case
}

interface Props {
  purchaseOrder?: PurchaseOrder;
  purchaseOrders?: PurchaseOrder[];
}

export default function Create({ purchaseOrder, purchaseOrders }: Props) {
  const { success, error } = useToast();

  // Normalize orderLines - Laravel sends snake_case, convert to camelCase
  const orderLines = purchaseOrder ? (purchaseOrder.orderLines || purchaseOrder.order_lines || []) : [];

  // If no PO selected, show selection page
  if (!purchaseOrder) {
    return (
      <AdminLayout title="Buat Vendor Bill">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <PageHeader
              title="Buat Vendor Bill"
              description="Pilih Purchase Order untuk dibuatkan invoice"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pilih Purchase Order</h3>
            <div className="space-y-2">
              {(!purchaseOrders || purchaseOrders.length === 0) ? (
                <p className="text-gray-500 dark:text-gray-400">Tidak ada PO yang dapat di-invoice</p>
              ) : (
                purchaseOrders.map((po) => (
                  <Link
                    key={po.id}
                    href={`/vendor-bills/create?purchase_id=${po.id}`}
                    className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{po.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{po.partner.name}</div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {(po.orderLines || po.order_lines || []).length} item
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <PageHeader
            title="Buat Vendor Bill"
            description={`Dari PO: ${purchaseOrder.name} • ${purchaseOrder.partner.name}`}
          />
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-6">
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

