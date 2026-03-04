import React from 'react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { Button } from '@/Components/Button';
import { useFlashToast } from '@/hooks/useFlashToast';

interface MenuItem {
  id: number;
  name: string;
  icon?: string | null;
  route?: string | null;
  permission?: string | null;
  order?: number;
  active?: boolean;
  parent?: { id: number; name: string } | null;
  children?: MenuItem[];
}

export default function Show({ menu }: { menu: MenuItem }) {
  useFlashToast();

  return (
    <AdminLayout title={`Detail Menu: ${menu.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <PageHeader title={menu.name} description="Detail informasi menu" />
            <div className="flex gap-3">
              <Link href={route('menus.edit', menu.id)}>
                <Button variant="outline">Edit</Button>
              </Link>
              <Link href={route('menus.index')}>
                <Button variant="outline">Kembali</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Detail */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
            {([
              { label: 'Nama', value: menu.name },
              { label: 'Icon', value: menu.icon || '—' },
              { label: 'Route', value: menu.route || '—' },
              { label: 'Permission', value: menu.permission || '—' },
              { label: 'Parent', value: menu.parent?.name || '—' },
              { label: 'Order', value: String(menu.order ?? 0) },
              { label: 'Status', value: menu.active ? 'Aktif' : 'Tidak Aktif' },
            ] as { label: string; value: string }[]).map(({ label, value }) => (
              <div key={label} className="py-4 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
                <dd className="text-sm text-gray-900 dark:text-white col-span-2">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Children */}
        {(menu.children?.length ?? 0) > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Sub-menu</h3>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {menu.children!.map((child) => (
                <li key={child.id} className="py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-900 dark:text-white">{child.name}</span>
                  <Link href={route('menus.show', child.id)} className="text-sm text-primary hover:underline">
                    Lihat
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
