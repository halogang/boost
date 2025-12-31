import React from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/Button';
import { useToast } from '@/hooks/useToast';

interface Role {
  id: number;
  name: string;
}

interface Props {
  roles: Role[];
}

interface FormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  roles: string[];
}

export default function Create({ roles }: Props) {
  const { success, error } = useToast();

  const form = useForm<FormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: [],
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.post('/users', {
      onSuccess: () => {
        success('Berhasil', 'User berhasil dibuat');
        router.visit('/users');
      },
      onError: (errors) => {
        const errorMessage = errors.message || 'Gagal membuat user. Periksa kembali data yang diinput.';
        error('Gagal', errorMessage);
      },
    });
  }

  const handleRoleChange = (roleName: string, checked: boolean) => {
    if (checked) {
      form.setData('roles', [...form.data.roles, roleName]);
    } else {
      form.setData('roles', form.data.roles.filter((r) => r !== roleName));
    }
  };

  return (
    <AdminLayout title="Tambah User">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <PageHeader
            title="Tambah User"
            description="Tambah user baru ke sistem"
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
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.currentTarget.value)}
                    className="w-full"
                    placeholder="Nama lengkap"
                    required
                  />
                  {form.errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    type="email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.currentTarget.value)}
                    className="w-full"
                    placeholder="email@example.com"
                    required
                  />
                  {form.errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    type="password"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.currentTarget.value)}
                    className="w-full"
                    placeholder="Minimal 8 karakter"
                    required
                  />
                  {form.errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Konfirmasi Password <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    type="password"
                    value={form.data.password_confirmation}
                    onChange={(e) => form.setData('password_confirmation', e.currentTarget.value)}
                    className="w-full"
                    placeholder="Ulangi password"
                    required
                  />
                  {form.errors.password_confirmation && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.password_confirmation}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Roles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Role
              </h3>

              <div className="space-y-2">
                {roles.map((role) => (
                  <label key={role.id} className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.data.roles.includes(role.name)}
                      onChange={(e) => handleRoleChange(role.name, e.currentTarget.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                    </span>
                  </label>
                ))}
                {roles.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada role yang tersedia</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="/users">
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

