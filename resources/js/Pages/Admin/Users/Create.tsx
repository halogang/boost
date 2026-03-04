import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { Button } from '@/Components/Button';
import { useFlashToast } from '@/hooks/useFlashToast';
import UserFormFields from './Partials/UserFormFields';
import { UserFormData, UserRole } from '@/types/admin/users';

interface Props {
  roles: UserRole[];
}

export default function Create({ roles }: Props) {
  useFlashToast();

  const form = useForm<UserFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: [],
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.post('/users');
  }

  return (
    <AdminLayout title="Tambah User">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <PageHeader title="Tambah User" description="Tambah user baru ke sistem" />
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <form onSubmit={submit} className="space-y-6">
            <UserFormFields
              data={form.data}
              errors={form.errors}
              setData={form.setData}
              roles={roles}
              mode="create"
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="/users">
                <Button variant="outline" type="button">Batal</Button>
              </Link>
              <Button type="submit" isLoading={form.processing}>
                Simpan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

