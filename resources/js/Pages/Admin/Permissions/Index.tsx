import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface GroupedPermission {
  [resource: string]: Permission[];
}

interface Props {
  roles: Role[];
  groupedPermissions: GroupedPermission;
}

export default function PermissionMatrix({ roles, groupedPermissions }: Props) {
  const { flash } = usePage().props as any;
  const [loading, setLoading] = useState<string | null>(null);
  const [checkedPermissions, setCheckedPermissions] = useState<{
    [key: string]: boolean;
  }>(() => {
    const initial: { [key: string]: boolean } = {};
    roles.forEach((role) => {
      role.permissions.forEach((perm) => {
        initial[`${role.id}-${perm.id}`] = true;
      });
    });
    return initial;
  });

  const handleToggle = async (roleId: number, permissionId: number) => {
    const key = `${roleId}-${permissionId}`;
    setLoading(key);

    try {
      const response = await fetch('/api/permissions/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          role_id: roleId,
          permission_id: permissionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCheckedPermissions((prev) => ({
          ...prev,
          [key]: data.hasPermission,
        }));
      }
    } catch (error) {
      console.error('Error toggling permission:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <AdminLayout title="Permission Management">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gray-600">Manajemen hak akses berdasarkan role</p>
        </div>
      </div>

      {/* Success Message */}
      {flash?.success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
          {flash.success}
        </div>
      )}

      {/* Permission Matrix */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 w-64">
                Permission
              </th>
              {roles.map((role) => (
                <th
                  key={role.id}
                  className="px-6 py-3 text-center text-sm font-semibold text-gray-900"
                >
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {role.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Object.entries(groupedPermissions).map(
              ([resource, permissions]) => (
                <React.Fragment key={resource}>
                  {/* Resource Header */}
                  <tr className="bg-gray-100">
                    <td
                      colSpan={roles.length + 1}
                      className="px-6 py-2 text-sm font-semibold text-gray-700 uppercase"
                    >
                      {resource}
                    </td>
                  </tr>

                  {/* Permission Rows */}
                  {permissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {permission.name}
                      </td>
                      {roles.map((role) => {
                        const key = `${role.id}-${permission.id}`;
                        const isChecked = checkedPermissions[key] || false;
                        const isLoading = loading === key;

                        return (
                          <td
                            key={key}
                            className="px-6 py-4 text-center"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() =>
                                handleToggle(role.id, permission.id)
                              }
                              disabled={isLoading}
                              className="rounded w-4 h-4 cursor-pointer disabled:opacity-50"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Catatan:</strong> Centang untuk memberikan permission kepada role. Perubahan
          akan disimpan otomatis.
        </p>
      </div>
    </AdminLayout>
  );
}
