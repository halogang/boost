import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { Button } from '@/Components/Button';
import { useFlashToast } from '@/hooks/useFlashToast';
import MenuFormFields from './Partials/MenuFormFields';
import { MenuFormData, MenuParent, MenuRole } from '@/types/admin/menus';

interface MenuRecord {
  id: number;
  name: string;
  icon?: string;
  route?: string;
  permission?: string;
  parent_id?: number | null;
  order?: number;
  active?: boolean;
}

interface Positions {
  desktop_sidebar?: boolean;
  mobile_drawer?: boolean;
  mobile_bottom?: boolean;
}

interface Props {
  menu: MenuRecord;
  parents?: MenuParent[];
  positions?: Positions;
  roles?: MenuRole[];
  selectedRoles?: number[];
}

export default function Edit({ menu, parents = [], positions = {}, roles = [], selectedRoles = [] }: Props) {
  useFlashToast();

  const form = useForm<MenuFormData>({
    name: menu.name || '',
    icon: menu.icon || '',
    route: menu.route || '',
    permission: menu.permission || '',
    parent_id: menu.parent_id ?? null,
    order: menu.order ?? 0,
    active: menu.active ?? true,
    positions: {
      desktop_sidebar: positions.desktop_sidebar ?? false,
      mobile_drawer: positions.mobile_drawer ?? false,
      mobile_bottom: positions.mobile_bottom ?? false,
    },
    roles: selectedRoles,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.put(route('menus.update', menu.id));
  }

  return (
    <AdminLayout title="Edit Menu">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <PageHeader title="Edit Menu" description={`Edit menu: ${menu.name}`} />
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
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
