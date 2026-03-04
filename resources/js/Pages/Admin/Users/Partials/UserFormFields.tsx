import TextInput from '@/Components/TextInput';
import { UserRole, UserFormData } from '@/types/admin/users';

interface Props {
  data: UserFormData;
  errors: Partial<Record<keyof UserFormData, string>>;
  setData: <K extends keyof UserFormData>(key: K, value: UserFormData[K]) => void;
  roles: UserRole[];
  mode: 'create' | 'edit';
}

export default function UserFormFields({ data, errors, setData, roles, mode }: Props) {
  const handleRoleChange = (roleName: string, checked: boolean) => {
    if (checked) {
      setData('roles', [...data.roles, roleName]);
    } else {
      setData('roles', data.roles.filter((r) => r !== roleName));
    }
  };

  return (
    <>
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
              value={data.name}
              onChange={(e) => setData('name', e.currentTarget.value)}
              className="w-full"
              placeholder="Nama lengkap"
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <TextInput
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.currentTarget.value)}
              className="w-full"
              placeholder="email@example.com"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          Password
        </h3>
        {mode === 'edit' && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kosongkan jika tidak ingin mengubah password
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mode === 'create' ? (
                <>Password <span className="text-red-500">*</span></>
              ) : (
                'Password Baru'
              )}
            </label>
            <TextInput
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.currentTarget.value)}
              className="w-full"
              placeholder={mode === 'create' ? 'Minimal 8 karakter' : 'Minimal 8 karakter (opsional)'}
              required={mode === 'create'}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mode === 'create' ? (
                <>Konfirmasi Password <span className="text-red-500">*</span></>
              ) : (
                'Konfirmasi Password Baru'
              )}
            </label>
            <TextInput
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.currentTarget.value)}
              className="w-full"
              placeholder={mode === 'create' ? 'Ulangi password' : 'Ulangi password baru'}
              required={mode === 'create'}
            />
            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.password_confirmation}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Roles */}
      <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          Role
        </h3>

        <div className="space-y-2">
          {roles.length > 0 ? (
            roles.map((role) => (
              <label
                key={role.id}
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={data.roles.includes(role.name)}
                  onChange={(e) => handleRoleChange(role.name, e.currentTarget.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada role yang tersedia</p>
          )}
          {errors.roles && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.roles}</p>
          )}
        </div>
      </div>
    </>
  );
}
