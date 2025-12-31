import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { Button } from '@/Components/Button';
import { useToast } from '@/hooks/useToast';
import { formatQuantity } from '@/lib/utils';

interface PurchaseOrderLine {
  id: number;
  product: {
    id: number;
    name: string;
    default_code: string;
    type: string;
  };
  uom: {
    id: number;
    name: string;
  } | null;
  name: string;
  product_qty: number;
  qty_received: number;
  qty_invoiced: number;
  price_unit: number;
  price_subtotal: number;
  price_tax: number;
  price_total: number;
  tax_rate: number;
  date_planned: string;
  receipt_status: string;
}

interface PurchaseOrder {
  id: number;
  name: string;
  partner: {
    id: number;
    name: string;
  };
  date_order: string;
  date_planned?: string;
  state: string;
  order_type: string;
  amount_untaxed: number;
  amount_tax: number;
  amount_total: number;
  receipt_status: string;
  invoice_status: string;
  notes?: string;
  terms?: string;
  orderLines?: PurchaseOrderLine[];
  order_lines?: PurchaseOrderLine[]; // Laravel sends snake_case
  pickings?: any[];
  vendorBills?: any[];
}

interface Props {
  order: PurchaseOrder;
}

export default function Show({ order }: Props) {
  const { success, error } = useToast();

  // Normalize orderLines - Laravel sends snake_case, convert to camelCase
  const orderLines = order.orderLines || order.order_lines || [];

  const handleConfirm = () => {
    if (!confirm('Apakah Anda yakin ingin mengonfirmasi RFQ ini menjadi PO?')) {
      return;
    }

    router.post(`/purchase-orders/${order.id}/confirm`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        success('RFQ berhasil dikonfirmasi menjadi PO');
      },
      onError: () => {
        error('Gagal mengonfirmasi RFQ');
      },
    });
  };

  const canEdit = ['draft', 'sent', 'to approve'].includes(order.state);
  const canConfirm = ['draft', 'sent'].includes(order.state) && order.order_type === 'rfq';
  const canDelete = order.state === 'draft';

  const handleDownloadPdf = () => {
    window.open(`/purchase-orders/${order.id}/pdf`, '_blank');
  };

  return (
    <AdminLayout title={`${order.name} - ${order.order_type.toUpperCase()}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <PageHeader
                title={`${order.name} - ${order.order_type.toUpperCase()}`}
                description={`Vendor: ${order.partner.name}`}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleDownloadPdf}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </Button>
              {canConfirm && (
                <Button onClick={handleConfirm}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Konfirmasi menjadi PO
                </Button>
              )}
              {canEdit && (
                <Link href={`/purchase-orders/${order.id}/edit`}>
                  <Button variant="outline">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                </Link>
              )}
              <Link href="/purchase-orders">
                <Button variant="outline">
                  Kembali
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {order.state === 'draft' && 'Draft'}
              {order.state === 'sent' && 'Sent'}
              {order.state === 'to approve' && 'To Approve'}
              {order.state === 'purchase' && 'PO Confirmed'}
              {order.state === 'done' && 'Done'}
              {order.state === 'cancel' && 'Cancelled'}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Receipt Status</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {order.receipt_status === 'no' && '-'}
              {order.receipt_status === 'to receive' && 'To Receive'}
              {order.receipt_status === 'partial' && 'Partial'}
              {order.receipt_status === 'full' && 'Received'}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Invoice Status</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {order.invoice_status === 'no' && '-'}
              {order.invoice_status === 'to invoice' && 'To Invoice'}
              {order.invoice_status === 'invoiced' && 'Invoiced'}
              {order.invoice_status === 'paid' && 'Paid'}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              Rp {order.amount_total.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Order Lines */}
        {orderLines && orderLines.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detail Produk</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Produk</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Qty</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Received</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Harga/Unit</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Pajak</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderLines.map((line) => (
                  <tr key={line.id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{line.product.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {line.product.default_code} • {line.uom?.name || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                      {formatQuantity(line.product_qty)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                      {formatQuantity(line.qty_received)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                      Rp {line.price_unit.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                      {line.tax_rate}%
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                      Rp {line.price_total.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <td colSpan={5} className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                    Subtotal:
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                    Rp {order.amount_untaxed.toLocaleString('id-ID')}
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <td colSpan={5} className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                    Pajak:
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                    Rp {order.amount_tax.toLocaleString('id-ID')}
                  </td>
                </tr>
                <tr className="bg-primary/10 dark:bg-primary/20">
                  <td colSpan={5} className="py-3 px-4 text-right font-bold text-lg text-gray-900 dark:text-white">
                    Total:
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-lg text-gray-900 dark:text-white">
                    Rp {order.amount_total.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <p className="text-gray-500 dark:text-gray-400 text-center">Tidak ada produk dalam order ini</p>
          </div>
        )}

        {/* Notes & Terms */}
        {(order.notes || order.terms) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.notes && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Catatan Internal</h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{order.notes}</p>
              </div>
            )}
            {order.terms && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Terms & Conditions</h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{order.terms}</p>
              </div>
            )}
          </div>
        )}

        {/* Receipts & Bills */}
        {order.pickings && order.pickings.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Receipts</h3>
            <div className="space-y-2">
              {order.pickings.map((picking) => (
                <Link
                  key={picking.id}
                  href={`/receipts/${picking.id}`}
                  className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{picking.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{picking.state}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {order.vendorBills && order.vendorBills.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vendor Bills</h3>
            <div className="space-y-2">
              {order.vendorBills.map((bill) => (
                <Link
                  key={bill.id}
                  href={`/vendor-bills/${bill.id}`}
                  className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{bill.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {bill.payment_state === 'paid' ? 'Paid' : bill.state}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

