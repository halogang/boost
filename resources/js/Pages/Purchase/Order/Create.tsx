import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { Button } from '@/Components/Button';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { useToast } from '@/hooks/useToast';
import { HintGuide } from '@/Components/HintGuide';

interface Product {
  id: number;
  name: string;
  default_code: string;
  uom: { id: number; name: string } | null;
  uom_po: { id: number; name: string } | null;
  standard_price: number;
}

interface Vendor {
  id: number;
  name: string;
}

interface Props {
  vendors: Vendor[];
  products: Product[];
}

interface OrderLine {
  product_id: number | null;
  product_qty: number;
  price_unit: number;
  tax_rate: number;
  date_planned: string;
}

export default function Create({ vendors, products }: Props) {
  const { success, error } = useToast();
  const { data, setData, post, processing, errors } = useForm({
    partner_id: '',
    date_order: new Date().toISOString().split('T')[0],
    date_planned: new Date().toISOString().split('T')[0],
    notes: '',
    terms: '',
    lines: [{ product_id: null, product_qty: 1, price_unit: 0, tax_rate: 11, date_planned: new Date().toISOString().split('T')[0] }] as OrderLine[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/purchase-orders', {
      preserveScroll: true,
      onSuccess: () => {
        success('RFQ berhasil dibuat');
      },
      onError: () => {
        error('Gagal membuat RFQ');
      },
    });
  };

  const addLine = () => {
    setData('lines', [
      ...data.lines,
      { product_id: null, product_qty: 1, price_unit: 0, tax_rate: 11, date_planned: data.date_planned },
    ]);
  };

  const removeLine = (index: number) => {
    setData('lines', data.lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof OrderLine, value: any) => {
    const newLines = [...data.lines];
    newLines[index] = { ...newLines[index], [field]: value };
    
    // Auto-fill price from product standard_price
    if (field === 'product_id' && value) {
      const product = products.find(p => p.id === value);
      if (product) {
        newLines[index].price_unit = product.standard_price || 0;
      }
    }
    
    setData('lines', newLines);
  };

  const getSelectedProduct = (productId: number | null) => {
    return products.find(p => p.id === productId);
  };

  return (
    <AdminLayout title="Buat RFQ">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-3 md:p-4 lg:p-6">
          <PageHeader
            title="Buat Request for Quotation (RFQ)"
            description="Buat RFQ baru untuk meminta penawaran harga dari vendor"
          />
        </div>

        <HintGuide
          title="Panduan Membuat RFQ"
          items={[
            {
              number: 1,
              title: 'Pilih Vendor',
              description: 'Pilih vendor yang akan menerima RFQ. Pastikan vendor sudah terdaftar dan aktif di sistem.',
            },
            {
              number: 2,
              title: 'Tambah Produk',
              description: 'Klik "Tambah Baris" untuk menambahkan produk. Pilih produk, isi quantity, harga unit, dan tanggal rencana penerimaan.',
            },
            {
              number: 3,
              title: 'Harga & Pajak',
              description: 'Harga unit akan otomatis terisi dari standard price produk. Pajak default 11% (PPN) dapat disesuaikan per baris.',
            },
            {
              number: 4,
              title: 'Konfirmasi RFQ',
              description: 'Setelah RFQ dibuat, kirim ke vendor untuk mendapatkan penawaran. Setelah disetujui, konfirmasi menjadi PO.',
            },
          ]}
          tips="Pastikan semua detail produk, quantity, dan harga sudah benar sebelum menyimpan. RFQ dengan status Draft dapat diedit, tetapi setelah dikonfirmasi menjadi PO tidak dapat diubah."
        />

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-3 md:p-4 lg:p-6 space-y-6">
          {/* Vendor & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <InputLabel htmlFor="partner_id" value="Vendor *" />
              <select
                id="partner_id"
                value={data.partner_id}
                onChange={(e) => setData('partner_id', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Pilih Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
              {errors.partner_id && <p className="mt-1 text-sm text-red-600">{errors.partner_id}</p>}
            </div>

            <div>
              <InputLabel htmlFor="date_order" value="Tanggal Order *" />
              <TextInput
                id="date_order"
                type="date"
                value={data.date_order}
                onChange={(e) => setData('date_order', e.target.value)}
                className="mt-1"
                required
              />
              {errors.date_order && <p className="mt-1 text-sm text-red-600">{errors.date_order}</p>}
            </div>

            <div>
              <InputLabel htmlFor="date_planned" value="Tanggal Pengiriman" />
              <TextInput
                id="date_planned"
                type="date"
                value={data.date_planned}
                onChange={(e) => {
                  setData('date_planned', e.target.value);
                  // Update all lines date_planned
                  setData('lines', data.lines.map(line => ({ ...line, date_planned: e.target.value })));
                }}
                className="mt-1"
              />
              {errors.date_planned && <p className="mt-1 text-sm text-red-600">{errors.date_planned}</p>}
            </div>
          </div>

          {/* Order Lines */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <InputLabel value="Produk *" />
              <Button type="button" onClick={addLine} variant="outline" size="sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Produk
              </Button>
            </div>

            <div className="space-y-4">
              {data.lines.map((line, index) => {
                const product = getSelectedProduct(line.product_id);
                const subtotal = line.product_qty * line.price_unit;
                const tax = subtotal * (line.tax_rate / 100);
                const total = subtotal + tax;

                return (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">Line {index + 1}</h4>
                      {data.lines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLine(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <InputLabel value="Produk *" />
                        <select
                          value={line.product_id || ''}
                          onChange={(e) => updateLine(index, 'product_id', e.target.value ? parseInt(e.target.value) : null)}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white"
                          required
                        >
                          <option value="">Pilih Produk</option>
                          {products.map((prod) => (
                            <option key={prod.id} value={prod.id}>
                              {prod.name} ({prod.default_code})
                            </option>
                          ))}
                        </select>
                        {errors[`lines.${index}.product_id`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`lines.${index}.product_id`]}</p>
                        )}
                      </div>

                      <div>
                        <InputLabel value="Qty *" />
                        <TextInput
                          type="number"
                          step="0.001"
                          min="0.001"
                          value={line.product_qty > 0 ? line.product_qty.toString() : ''}
                          onChange={(e) => updateLine(index, 'product_qty', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                          required
                        />
                        {product && (
                          <p className="mt-1 text-xs text-gray-500">
                            UOM: {product.uom_po?.name || product.uom?.name || '-'}
                          </p>
                        )}
                        {errors[`lines.${index}.product_qty`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`lines.${index}.product_qty`]}</p>
                        )}
                      </div>

                      <div>
                        <InputLabel value="Harga/Unit *" />
                        <TextInput
                          type="number"
                          step="0.01"
                          min="0"
                          value={line.price_unit.toString()}
                          onChange={(e) => updateLine(index, 'price_unit', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                          required
                        />
                        {errors[`lines.${index}.price_unit`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`lines.${index}.price_unit`]}</p>
                        )}
                      </div>

                      <div>
                        <InputLabel value="Pajak (%)" />
                        <TextInput
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={line.tax_rate.toString()}
                          onChange={(e) => updateLine(index, 'tax_rate', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end text-sm">
                      <div className="text-right">
                        <div className="text-gray-600 dark:text-gray-400">
                          Subtotal: Rp {subtotal.toLocaleString('id-ID')}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Pajak: Rp {tax.toLocaleString('id-ID')}
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          Total: Rp {total.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.lines && <p className="mt-1 text-sm text-red-600">{errors.lines}</p>}
          </div>

          {/* Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="notes" value="Catatan Internal" />
              <textarea
                id="notes"
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <InputLabel htmlFor="terms" value="Terms & Conditions" />
              <textarea
                id="terms"
                value={data.terms}
                onChange={(e) => setData('terms', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href="/purchase-orders">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={processing}>
              {processing ? 'Menyimpan...' : 'Simpan RFQ'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

