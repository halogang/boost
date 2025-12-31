import React from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/Button';
import { useToast } from '@/hooks/useToast';

interface Uom {
  id: number;
  name: string;
}

interface Props {
  uoms: Uom[];
}

interface FormData {
  name: string;
  default_code: string;
  barcode: string;
  description: string;
  description_purchase: string;
  description_sale: string;
  type: 'consu' | 'service' | 'product';
  purchase_method: 'purchase' | 'make_to_order' | 'receive';
  purchase_ok: boolean;
  sale_ok: boolean;
  active: boolean;
  uom_id: string;
  uom_po_id: string;
  list_price: string;
  standard_price: string;
  categ_name: string;
  order: string | number;
}

export default function Create({ uoms }: Props) {
  const { success, error } = useToast();

  const form = useForm<FormData>({
    name: '',
    default_code: '',
    barcode: '',
    description: '',
    description_purchase: '',
    description_sale: '',
    type: 'product',
    purchase_method: 'purchase',
    purchase_ok: true,
    sale_ok: true,
    active: true,
    uom_id: '',
    uom_po_id: '',
    list_price: '',
    standard_price: '',
    categ_name: '',
    order: 0,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const formData = {
      name: form.data.name,
      default_code: form.data.default_code,
      barcode: form.data.barcode,
      description: form.data.description,
      description_purchase: form.data.description_purchase,
      description_sale: form.data.description_sale,
      type: form.data.type,
      purchase_method: form.data.purchase_method,
      purchase_ok: form.data.purchase_ok,
      sale_ok: form.data.sale_ok,
      active: form.data.active,
      uom_id: form.data.uom_id ? parseInt(form.data.uom_id) : null,
      uom_po_id: form.data.uom_po_id ? parseInt(form.data.uom_po_id) : null,
      list_price: form.data.list_price ? parseFloat(form.data.list_price) : null,
      standard_price: form.data.standard_price ? parseFloat(form.data.standard_price) : null,
      categ_name: form.data.categ_name,
      order: typeof form.data.order === 'string' ? parseInt(form.data.order) || 0 : form.data.order,
    };
    
    form.post('/products', {
      onSuccess: () => {
        success('Berhasil', 'Produk berhasil ditambahkan');
        router.visit('/products');
      },
      onError: (errors) => {
        const errorMessage = errors.message || 'Gagal menambahkan produk. Periksa kembali data yang diinput.';
        error('Gagal', errorMessage);
      },
    });
  }

  return (
    <AdminLayout title="Tambah Produk">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <PageHeader
            title="Tambah Produk"
            description="Tambah produk baru ke sistem"
          />
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <form onSubmit={submit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Informasi Dasar
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama Produk <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.currentTarget.value)}
                    className="w-full"
                    placeholder="Nama produk"
                    required
                  />
                  {form.errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kode Produk (SKU)
                  </label>
                  <TextInput
                    value={form.data.default_code}
                    onChange={(e) => form.setData('default_code', e.currentTarget.value)}
                    className="w-full"
                    placeholder="SKU-001"
                  />
                  {form.errors.default_code && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.default_code}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Barcode
                  </label>
                  <TextInput
                    value={form.data.barcode}
                    onChange={(e) => form.setData('barcode', e.currentTarget.value)}
                    className="w-full"
                    placeholder="1234567890123"
                  />
                  {form.errors.barcode && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.barcode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategori
                  </label>
                  <TextInput
                    value={form.data.categ_name}
                    onChange={(e) => form.setData('categ_name', e.currentTarget.value)}
                    className="w-full"
                    placeholder="Kategori produk"
                  />
                  {form.errors.categ_name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.categ_name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipe Produk <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.data.type}
                    onChange={(e) => form.setData('type', e.currentTarget.value as any)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-primary"
                    required
                  >
                    <option value="consu">Consumable (ATK)</option>
                    <option value="service">Service (Jasa)</option>
                    <option value="product">Storable Product (Inventori)</option>
                  </select>
                  {form.errors.type && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Metode Pembelian <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.data.purchase_method}
                    onChange={(e) => form.setData('purchase_method', e.currentTarget.value as any)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-primary"
                    required
                  >
                    <option value="purchase">Purchase (Beli)</option>
                    <option value="make_to_order">Make to Order</option>
                    <option value="receive">Receive (Terima)</option>
                  </select>
                  {form.errors.purchase_method && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.purchase_method}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={form.data.description}
                  onChange={(e) => form.setData('description', e.currentTarget.value)}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-primary"
                  rows={3}
                  placeholder="Deskripsi produk"
                />
                {form.errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.description}</p>
                )}
              </div>
            </div>

            {/* Unit of Measure */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Satuan Ukur
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit of Measure (UOM)
                  </label>
                  <select
                    value={form.data.uom_id}
                    onChange={(e) => form.setData('uom_id', e.currentTarget.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-primary"
                  >
                    <option value="">Pilih UOM</option>
                    {uoms.map((uom) => (
                      <option key={uom.id} value={uom.id}>
                        {uom.name}
                      </option>
                    ))}
                  </select>
                  {form.errors.uom_id && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.uom_id}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    UOM Pembelian
                  </label>
                  <select
                    value={form.data.uom_po_id}
                    onChange={(e) => form.setData('uom_po_id', e.currentTarget.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-primary"
                  >
                    <option value="">Pilih UOM Pembelian</option>
                    {uoms.map((uom) => (
                      <option key={uom.id} value={uom.id}>
                        {uom.name}
                      </option>
                    ))}
                  </select>
                  {form.errors.uom_po_id && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.uom_po_id}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Harga
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Harga Jual
                  </label>
                  <TextInput
                    type="number"
                    step="0.01"
                    value={form.data.list_price}
                    onChange={(e) => form.setData('list_price', e.currentTarget.value)}
                    className="w-full"
                    placeholder="0.00"
                  />
                  {form.errors.list_price && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.list_price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Harga Standar
                  </label>
                  <TextInput
                    type="number"
                    step="0.01"
                    value={form.data.standard_price}
                    onChange={(e) => form.setData('standard_price', e.currentTarget.value)}
                    className="w-full"
                    placeholder="0.00"
                  />
                  {form.errors.standard_price && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.standard_price}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Informasi Tambahan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Deskripsi Pembelian
                  </label>
                  <textarea
                    value={form.data.description_purchase}
                    onChange={(e) => form.setData('description_purchase', e.currentTarget.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-primary"
                    rows={2}
                    placeholder="Deskripsi untuk pembelian"
                  />
                  {form.errors.description_purchase && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.description_purchase}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Deskripsi Penjualan
                  </label>
                  <textarea
                    value={form.data.description_sale}
                    onChange={(e) => form.setData('description_sale', e.currentTarget.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-primary"
                    rows={2}
                    placeholder="Deskripsi untuk penjualan"
                  />
                  {form.errors.description_sale && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.description_sale}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.data.purchase_ok}
                      onChange={(e) => form.setData('purchase_ok', e.currentTarget.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dapat Dibeli</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.data.sale_ok}
                      onChange={(e) => form.setData('sale_ok', e.currentTarget.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dapat Dijual</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.data.active}
                      onChange={(e) => form.setData('active', e.currentTarget.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktif</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Urutan
                </label>
                <TextInput
                  type="number"
                  value={form.data.order}
                  onChange={(e) => form.setData('order', e.currentTarget.value)}
                  className="w-full"
                  placeholder="0"
                />
                {form.errors.order && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.order}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="/products">
                <Button variant="outline" type="button">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={form.processing}>
                {form.processing ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

