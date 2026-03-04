import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { Button } from '@/Components/Button';
import { useFlashToast } from '@/hooks/useFlashToast';
import MenuFormFields from './Partials/MenuFormFields';
import { MenuFormData, MenuParent, MenuRole } from '@/types/admin/menus';

interface Props {
  parents?: MenuParent[];
  roles?: MenuRole[];
}

export default function Create({ parents = [], roles = [] }: Props) {
  useFlashToast();

  const form = useForm<MenuFormData>({
    name: '',
    icon: '',
    route: '',
    permission: '',
    parent_id: null,
    order: 0,
    active: true,
    positions: {
      desktop_sidebar: false,
      mobile_drawer: false,
      mobile_bottom: false,
    },
    roles: [],
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('menus.store'));
  }

  return (
    <AdminLayout title="Buat Menu">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <PageHeader title="Buat Menu" description="Tambah menu baru ke sistem" />
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <form onSubmit={submit} className="space-y-6">
            <MenuFormFields
              data={form.data}
              errors={form.errors}
              setData={form.setData}
              parents={parents}
              roles={roles}
            />

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href={route('menus.index')}>
                <Button variant="outline" type="button">
                  Batal
                </Button>
              </Link>
              <Button type="submit" isLoading={form.processing}>
                Simpan Menu
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
