import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { Button } from '@/Components/Button';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { useToast } from '@/hooks/useToast';
import { useConfirmationModal } from '@/Components/ConfirmationProvider';
import { formatQuantity } from '@/lib/utils';
import { HintGuide } from '@/Components/HintGuide';

interface AccountMoveLine {
  id: number;
  product: {
    id: number;
    name: string;
    default_code: string;
  } | null;
  name: string;
  quantity: number;
  price_unit: number;
  price_subtotal: number;
  price_total: number;
  tax_rate: number;
}

interface AccountPayment {
  id: number;
  name: string;
  payment_method: 'bank' | 'cash' | 'giro';
  amount: number;
  payment_date: string;
  ref?: string;
  state: 'draft' | 'posted' | 'sent' | 'reconciled' | 'cancelled';
  user?: {
    id: number;
    name: string;
  } | null;
}

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
  amount_untaxed: number;
  amount_tax: number;
  amount_total: number;
  amount_residual: number;
  ref?: string;
  narration?: string;
  moveLines?: AccountMoveLine[];
  move_lines?: AccountMoveLine[]; // Laravel sends snake_case
  payments?: AccountPayment[];
}

interface Props {
  bill: AccountMove;
}

export default function Show({ bill }: Props) {
  const { success, error } = useToast();
  const { confirm } = useConfirmationModal();

  // Normalize moveLines - Laravel sends snake_case, convert to camelCase
  const moveLines = bill.moveLines || bill.move_lines || [];
  
  // Normalize payments - Laravel sends snake_case, convert to camelCase
  const payments = bill.payments || [];
  const { data, setData, post, processing } = useForm({
    amount: bill.amount_residual,
    payment_method: 'bank' as 'bank' | 'cash' | 'giro',
    payment_date: new Date().toISOString().split('T')[0],
    reference: '',
  });

  const handlePost = () => {
    confirm({
      title: 'Post Vendor Bill',
      message: 'Apakah Anda yakin ingin mem-post vendor bill ini?',
      variant: 'default',
      confirmText: 'Ya, Post',
      cancelText: 'Batal',
      onConfirm: () => {
        router.post(`/vendor-bills/${bill.id}/post`, {}, {
          preserveScroll: true,
          onSuccess: () => {
            success('Vendor Bill berhasil di-post');
          },
          onError: () => {
            error('Gagal mem-post Vendor Bill');
          },
        });
      },
    });
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/vendor-bills/${bill.id}/payment`, {
      preserveScroll: true,
      onSuccess: () => {
        success('Pembayaran berhasil diregistrasi');
      },
      onError: () => {
        error('Gagal meregistrasi pembayaran');
      },
    });
  };

  const canPost = bill.state === 'draft';
  const canPay = bill.state === 'posted' && bill.amount_residual > 0;
  const isPaid = bill.payment_state === 'paid';

  const handleDownloadPdf = () => {
    window.open(`/vendor-bills/${bill.id}/pdf`, '_blank');
  };

  return (
    <AdminLayout title={`Vendor Bill - ${bill.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <PageHeader
                title={`Vendor Bill - ${bill.name}`}
                description={`Vendor: ${bill.partner.name}${bill.purchaseOrder ? ` • PO: ${bill.purchaseOrder.name}` : ''}`}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleDownloadPdf}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </Button>
              {canPost && (
                <Button onClick={handlePost}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Post Invoice
                </Button>
              )}
              <Link href="/vendor-bills">
                <Button variant="outline">
                  Kembali
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <HintGuide
          title="Panduan Vendor Bill"
          items={[
            {
              number: 1,
              title: 'Post Invoice',
              description: 'Invoice dengan status "Draft" harus di-post terlebih dahulu sebelum dapat diregistrasi pembayaran. Invoice yang sudah Posted akan masuk ke sistem akuntansi.',
            },
            {
              number: 2,
              title: 'Registrasi Pembayaran',
              description: 'Setelah invoice di-post, gunakan form "Registrasi Pembayaran" untuk mencatat pembayaran. Dapat dilakukan pembayaran partial atau full sesuai dengan jumlah yang dibayar.',
            },
            {
              number: 3,
              title: 'Payment Status',
              description: 'Status akan otomatis update: "Not Paid" (belum ada pembayaran), "Partial" (sebagian dibayar), atau "Paid" (lunas). Sisa tagihan akan otomatis terhitung.',
            },
            {
              number: 4,
              title: 'Download PDF',
              description: 'Gunakan tombol "Download PDF" untuk mencetak atau menyimpan dokumen invoice. PDF dapat digunakan untuk keperluan arsip atau pembayaran.',
            },
          ]}
          tips="Pastikan invoice sudah sesuai dengan dokumen dari vendor sebelum di-post. Invoice yang sudah Posted tidak dapat diubah. Catat pembayaran segera setelah invoice diterima untuk menjaga akurasi keuangan."
        />

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {bill.state === 'draft' && 'Draft'}
              {bill.state === 'posted' && 'Posted'}
              {bill.state === 'cancel' && 'Cancelled'}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Payment Status</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {bill.payment_state === 'not_paid' && 'Not Paid'}
              {bill.payment_state === 'partial' && 'Partial'}
              {bill.payment_state === 'paid' && 'Paid'}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              Rp {bill.amount_total.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Sisa Tagihan</div>
            <div className={`text-lg font-semibold mt-1 ${
              bill.amount_residual > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
            }`}>
              Rp {bill.amount_residual.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Invoice Lines */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detail Invoice</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Produk</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Qty</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Harga/Unit</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Pajak</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
                </tr>
              </thead>
              <tbody>
                {moveLines.map((line) => (
                  <tr key={line.id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{line.name}</div>
                        {line.product && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {line.product.default_code}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                      {formatQuantity(line.quantity)}
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
                  <td colSpan={4} className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                    Subtotal:
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                    Rp {bill.amount_untaxed.toLocaleString('id-ID')}
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <td colSpan={4} className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                    Pajak:
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                    Rp {bill.amount_tax.toLocaleString('id-ID')}
                  </td>
                </tr>
                <tr className="bg-primary/10 dark:bg-primary/20">
                  <td colSpan={4} className="py-3 px-4 text-right font-bold text-lg text-gray-900 dark:text-white">
                    Total:
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-lg text-gray-900 dark:text-white">
                    Rp {bill.amount_total.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Payment History */}
        {payments && payments.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Riwayat Pembayaran</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Tanggal</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">No. Payment</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Metode</th>
                    <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Jumlah</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Reference</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Oleh</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {new Date(payment.payment_date).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{payment.name}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {payment.payment_method === 'bank' && 'Bank Transfer'}
                          {payment.payment_method === 'cash' && 'Cash'}
                          {payment.payment_method === 'giro' && 'Giro'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                        Rp {payment.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {payment.ref || '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {payment.user?.name || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <td colSpan={3} className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                      Total Dibayar:
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-lg text-gray-900 dark:text-white">
                      Rp {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('id-ID')}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Payment Form */}
        {canPay && !isPaid && (
          <form onSubmit={handlePayment} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Registrasi Pembayaran</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputLabel htmlFor="amount" value="Jumlah Pembayaran *" />
                <TextInput
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={bill.amount_residual}
                  value={data.amount.toString()}
                  onChange={(e) => setData('amount', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Maksimal: Rp {bill.amount_residual.toLocaleString('id-ID')}
                </p>
              </div>

              <div>
                <InputLabel htmlFor="payment_method" value="Metode Pembayaran *" />
                <select
                  id="payment_method"
                  value={data.payment_method}
                  onChange={(e) => setData('payment_method', e.target.value as 'bank' | 'cash' | 'giro')}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="giro">Giro</option>
                </select>
              </div>

              <div>
                <InputLabel htmlFor="payment_date" value="Tanggal Pembayaran *" />
                <TextInput
                  id="payment_date"
                  type="date"
                  value={data.payment_date}
                  onChange={(e) => setData('payment_date', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <InputLabel htmlFor="reference" value="Reference / No. Bukti" />
                <TextInput
                  id="reference"
                  type="text"
                  value={data.reference}
                  onChange={(e) => setData('reference', e.target.value)}
                  className="mt-1"
                  placeholder="Nomor bukti pembayaran"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button type="submit" disabled={processing}>
                {processing ? 'Menyimpan...' : 'Registrasi Pembayaran'}
              </Button>
            </div>
          </form>
        )}

        {/* Payment History (if paid) */}
        {isPaid && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="font-semibold text-green-900 dark:text-green-100">Invoice Sudah Dibayar</div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Total pembayaran: Rp {bill.amount_total.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        {(bill.ref || bill.narration) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bill.ref && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Reference</h3>
                <p className="text-gray-600 dark:text-gray-400">{bill.ref}</p>
              </div>
            )}
            {bill.narration && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Narration</h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{bill.narration}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

