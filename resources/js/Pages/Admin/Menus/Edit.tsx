import React from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/Button';

type FormData = {
  name: string;
  icon: string;
  route: string;
  permission: string;
  parent_id: number | null;
  order: number;
  active: boolean;
  positions: {
    desktop_sidebar: boolean;
    mobile_drawer: boolean;
    mobile_bottom: boolean;
  };
  roles: number[];
};

interface Role {
  id: number;
  name: string;
}

export default function Edit({ menu, parents = [], positions = {}, roles = [], selectedRoles = [] }: any) {
  const { props } = usePage<any>();
  const form = useForm<FormData>({
    name: menu.name || '',
    icon: menu.icon || '',
    route: menu.route || '',
    permission: menu.permission || '',
    parent_id: menu.parent_id || null,
    order: menu.order || 0,
    active: menu.active ?? true,
    positions: {
      desktop_sidebar: positions.desktop_sidebar || false,
      mobile_drawer: positions.mobile_drawer || false,
      mobile_bottom: positions.mobile_bottom || false,
    },
    roles: selectedRoles || [],
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
          <PageHeader 
            title="Edit Menu" 
            description={`Edit menu: ${menu.name}`}
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Menu <span className="text-red-500">*</span>
                </label>
                <TextInput
                  value={form.data.name}
                  onChange={(e) => form.setData('name', e.currentTarget.value)}
                  className="w-full"
                  placeholder="Contoh: Dashboard"
                />
                {form.errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon
                </label>
                <TextInput
                  value={form.data.icon}
                  onChange={(e) => form.setData('icon', e.currentTarget.value)}
                  className="w-full"
                  placeholder="Contoh: home, users, settings"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Nama icon dari lucide-react (lihat{' '}
                  <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    lucide.dev
                  </a>
                  )
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Route (Route Name)
                </label>
                <TextInput
                  value={form.data.route}
                  onChange={(e) => form.setData('route', e.currentTarget.value)}
                  className="w-full"
                  placeholder="Contoh: dashboard, users.index"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Route name Laravel (kosongkan jika ini adalah parent menu)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Permission
                </label>
                <TextInput
                  value={form.data.permission}
                  onChange={(e) => form.setData('permission', e.currentTarget.value)}
                  className="w-full"
                  placeholder="Contoh: users.view, products.manage"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Format: resource.action (kosongkan jika tidak perlu permission check)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Parent Menu
                  </label>
                  <select
                    value={form.data.parent_id ?? ''}
                    onChange={(e) => {
                      const val = e.currentTarget.value;
                      form.setData('parent_id', val === '' ? null : Number(val));
                    }}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm transition-colors duration-200 placeholder:text-gray-400 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-primary dark:focus:ring-primary"
                  >
                    <option value="">-- Pilih Parent (opsional) --</option>
                    {parents.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Kosongkan jika ini adalah main menu
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order
                  </label>
                  <TextInput
                    type="number"
                    value={form.data.order}
                    onChange={(e) => form.setData('order', Number(e.currentTarget.value))}
                    className="w-full"
                    placeholder="0"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Urutan tampil (angka lebih kecil = lebih atas)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={form.data.active}
                  onChange={(e) => form.setData('active', e.currentTarget.checked)}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Aktif
                </label>
              </div>
            </div>

            {/* Roles */}
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Role Assignment
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pilih role yang dapat mengakses menu ini (kosongkan untuk semua role)
              </p>

              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                {roles.length > 0 ? (
                  roles.map((role: Role) => (
                    <div key={role.id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`role-${role.id}`}
                        checked={form.data.roles.includes(role.id)}
                        onChange={(e) => {
                          if (e.currentTarget.checked) {
                            form.setData('roles', [...form.data.roles, role.id]);
                          } else {
                            form.setData('roles', form.data.roles.filter((id) => id !== role.id));
                          }
                        }}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor={`role-${role.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
                        {role.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada role tersedia</p>
                )}
              </div>
              {form.errors.roles && (
                <p className="text-sm text-red-600 dark:text-red-400">{form.errors.roles}</p>
              )}
            </div>

            {/* Menu Positions */}
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Posisi Menu
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pilih di mana menu ini akan ditampilkan
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <input
                    type="checkbox"
                    id="desktop_sidebar"
                    checked={form.data.positions.desktop_sidebar}
                    onChange={(e) =>
                      form.setData('positions', {
                        ...form.data.positions,
                        desktop_sidebar: e.currentTarget.checked,
                      })
                    }
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="desktop_sidebar" className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900 dark:text-white">Desktop Sidebar</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Tampilkan di sidebar desktop</div>
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <input
                    type="checkbox"
                    id="mobile_drawer"
                    checked={form.data.positions.mobile_drawer}
                    onChange={(e) =>
                      form.setData('positions', {
                        ...form.data.positions,
                        mobile_drawer: e.currentTarget.checked,
                      })
                    }
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="mobile_drawer" className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900 dark:text-white">Mobile Drawer</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Tampilkan di drawer menu mobile</div>
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <input
                    type="checkbox"
                    id="mobile_bottom"
                    checked={form.data.positions.mobile_bottom}
                    onChange={(e) =>
                      form.setData('positions', {
                        ...form.data.positions,
                        mobile_bottom: e.currentTarget.checked,
                      })
                    }
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="mobile_bottom" className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900 dark:text-white">Mobile Bottom Navigation</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Tampilkan di bottom navigation mobile (maks 5 menu)</div>
                  </label>
                </div>
              </div>
            </div>

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
