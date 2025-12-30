import React from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/Button';
import { useToast } from '@/hooks/useToast';

interface Props {
  categories: string[];
}

export default function Create({ categories }: Props) {
  const { success, error } = useToast();

  const form = useForm({
    name: '',
    category: '',
    ratio: 1.0,
    uom_type: 'reference' as 'reference' | 'bigger' | 'smaller',
    rounding: 0.01,
    active: true,
    description: '',
    order: 0,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.post('/uoms', {
      onSuccess: () => {
        success('Berhasil', 'UOM berhasil dibuat');
        router.visit('/uoms');
      },
      onError: (errors) => {
        const errorMessage = errors.message || 'Gagal membuat UOM. Periksa kembali data yang diinput.';
        error('Gagal', errorMessage);
      },
    });
  }

  return (
    <AdminLayout title="Tambah UOM">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <PageHeader
            title="Tambah Unit of Measure (UOM)"
            description="Tambah satuan ukur baru ke sistem"
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
                    Nama UOM <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.currentTarget.value)}
                    className="w-full"
                    placeholder="Contoh: Kilogram, Liter, Meter"
                    required
                  />
                  {form.errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.data.category}
                    onChange={(e) => form.setData('category', e.currentTarget.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-primary"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__new__">+ Tambah Kategori Baru</option>
                  </select>
                  {form.data.category === '__new__' && (
                    <TextInput
                      value={form.data.category}
                      onChange={(e) => form.setData('category', e.currentTarget.value)}
                      className="w-full mt-2"
                      placeholder="Masukkan nama kategori baru"
                    />
                  )}
                  {form.errors.category && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.category}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rasio <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    type="number"
                    step="0.000001"
                    value={form.data.ratio}
                    onChange={(e) => form.setData('ratio', parseFloat(e.currentTarget.value) || 0)}
                    className="w-full"
                    placeholder="1.0"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Rasio konversi terhadap unit referensi dalam kategori yang sama
                  </p>
                  {form.errors.ratio && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.ratio}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipe UOM <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.data.uom_type}
                    onChange={(e) => form.setData('uom_type', e.currentTarget.value as any)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-primary"
                    required
                  >
                    <option value="reference">Referensi (ratio = 1.0)</option>
                    <option value="bigger">Lebih Besar (ratio &gt; 1.0)</option>
                    <option value="smaller">Lebih Kecil (ratio &lt; 1.0)</option>
                  </select>
                  {form.errors.uom_type && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.uom_type}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pembulatan
                  </label>
                  <TextInput
                    type="number"
                    step="0.001"
                    value={form.data.rounding}
                    onChange={(e) => form.setData('rounding', parseFloat(e.currentTarget.value) || 0.01)}
                    className="w-full"
                    placeholder="0.01"
                  />
                  {form.errors.rounding && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.rounding}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Urutan
                  </label>
                  <TextInput
                    type="number"
                    value={form.data.order}
                    onChange={(e) => form.setData('order', parseInt(e.currentTarget.value) || 0)}
                    className="w-full"
                    placeholder="0"
                  />
                  {form.errors.order && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.order}</p>
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
                  placeholder="Deskripsi UOM (opsional)"
                />
                {form.errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.description}</p>
                )}
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

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="/uoms">
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

