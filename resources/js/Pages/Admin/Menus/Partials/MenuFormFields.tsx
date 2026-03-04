import React from 'react';
import TextInput from '@/Components/TextInput';
import { MenuFormData, MenuParent, MenuRole } from '@/types/admin/menus';

interface Props {
  data: MenuFormData;
  errors: Partial<Record<string, string>>;
  setData: <K extends keyof MenuFormData>(key: K, value: MenuFormData[K]) => void;
  parents: MenuParent[];
  roles: MenuRole[];
}

const checkboxClass =
  'w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600';

const selectClass =
  'block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm transition-colors duration-200 placeholder:text-gray-400 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-primary dark:focus:ring-primary';

export default function MenuFormFields({ data, errors, setData, parents, roles }: Props) {
  return (
    <>
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
            value={data.name}
            onChange={(e) => setData('name', e.currentTarget.value)}
            className="w-full"
            placeholder="Contoh: Dashboard"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Icon
          </label>
          <TextInput
            value={data.icon}
            onChange={(e) => setData('icon', e.currentTarget.value)}
            className="w-full"
            placeholder="Contoh: home, users, settings"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Nama icon dari lucide-react (lihat{' '}
            <a
              href="https://lucide.dev/icons/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
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
            value={data.route}
            onChange={(e) => setData('route', e.currentTarget.value)}
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
            value={data.permission}
            onChange={(e) => setData('permission', e.currentTarget.value)}
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
              value={data.parent_id ?? ''}
              onChange={(e) => {
                const val = e.currentTarget.value;
                setData('parent_id', val === '' ? null : Number(val));
              }}
              className={selectClass}
            >
              <option value="">-- Pilih Parent (opsional) --</option>
              {parents.map((p) => (
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
              value={data.order}
              onChange={(e) => setData('order', Number(e.currentTarget.value))}
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
            checked={data.active}
            onChange={(e) => setData('active', e.currentTarget.checked)}
            className={checkboxClass}
          />
          <label htmlFor="active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Aktif
          </label>
        </div>
      </div>

      {/* Role Assignment */}
      <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          Role Assignment
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Pilih role yang dapat mengakses menu ini (kosongkan untuk semua role)
        </p>

        <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
          {roles.length > 0 ? (
            roles.map((role) => (
              <div key={role.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`role-${role.id}`}
                  checked={data.roles.includes(role.id)}
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      setData('roles', [...data.roles, role.id]);
                    } else {
                      setData('roles', data.roles.filter((id) => id !== role.id));
                    }
                  }}
                  className={checkboxClass}
                />
                <label
                  htmlFor={`role-${role.id}`}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
                >
                  {role.name}
                </label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada role tersedia</p>
          )}
        </div>
        {errors.roles && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.roles}</p>
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
          {(
            [
              {
                key: 'desktop_sidebar' as const,
                label: 'Desktop Sidebar',
                description: 'Tampilkan di sidebar desktop',
              },
              {
                key: 'mobile_drawer' as const,
                label: 'Mobile Drawer',
                description: 'Tampilkan di drawer menu mobile',
              },
              {
                key: 'mobile_bottom' as const,
                label: 'Mobile Bottom Navigation',
                description: 'Tampilkan di bottom navigation mobile (maks 5 menu)',
              },
            ] as const
          ).map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
            >
              <input
                type="checkbox"
                id={key}
                checked={data.positions[key]}
                onChange={(e) =>
                  setData('positions', { ...data.positions, [key]: e.currentTarget.checked })
                }
                className={checkboxClass}
              />
              <label htmlFor={key} className="flex-1 cursor-pointer">
                <div className="font-medium text-gray-900 dark:text-white">{label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
