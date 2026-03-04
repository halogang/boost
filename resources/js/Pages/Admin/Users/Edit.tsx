import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { Button } from '@/Components/Button';
import { User, UserFormData, UserRole } from '@/types/admin/users';
import { useFlashToast } from '@/hooks/useFlashToast';
import UserFormFields from './Partials/UserFormFields';

interface Props {
  user: User;
  roles: UserRole[];
}

export default function Edit({ user, roles }: Props) {
  useFlashToast();

  const form = useForm<UserFormData>({
    name: user.name || '',
    email: user.email || '',
    password: '',
    password_confirmation: '',
    roles: user.roles?.map((r) => r.name) ?? [],
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Only send password fields if the user has entered a new password
    const data: Partial<UserFormData> = {
      name: form.data.name,
      email: form.data.email,
      roles: form.data.roles,
    };
    if (form.data.password) {
      data.password = form.data.password;
      data.password_confirmation = form.data.password_confirmation;
    }
    form.transform(() => data as UserFormData);
    form.put(`/users/${user.id}`);
  }

  return (
    <AdminLayout title="Edit User">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <PageHeader title="Edit User" description="Edit informasi user" />
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <form onSubmit={submit} className="space-y-6">
            <UserFormFields
              data={form.data}
              errors={form.errors}
              setData={form.setData}
              roles={roles}
              mode="edit"
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="/users">
                <Button variant="outline" type="button">Batal</Button>
              </Link>
              <Button type="submit" isLoading={form.processing}>
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

