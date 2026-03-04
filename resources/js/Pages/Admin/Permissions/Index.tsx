import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import RoleCard from '@/Components/Permissions/RoleCard';
import { useToast } from '@/hooks/useToast';
import { useFlashToast } from '@/hooks/useFlashToast';

interface Permission {
  id: number;
  name: string;
  module?: string;
}

interface Role {
  id: number;
  name: string;
  permissions: number[];
  permissions_count: number;
}

interface GroupedPermission {
  [module: string]: Permission[];
}

interface Props {
  roles: Role[];
  allPermissions: Permission[];
  groupedPermissions: GroupedPermission;
}

export default function RolePermissionManagement({
  roles,
  allPermissions,
  groupedPermissions,
}: Props) {
  useFlashToast();
  const { error: showError } = useToast();
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [rolePermissions, setRolePermissions] = useState<{
    [roleId: number]: number[];
  }>(() => {
    const initial: { [roleId: number]: number[] } = {};
    roles.forEach((role) => {
      initial[role.id] = role.permissions;
    });
    return initial;
  });

  const handleToggle = async (roleId: number, permissionId: number) => {
    const key = `${roleId}-${permissionId}`;
    setLoading(key);

    try {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content') || '';

      const response = await fetch('/api/permissions/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          role_id: roleId,
          permission_id: permissionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setRolePermissions((prev) => {
          const current = prev[roleId] || [];
          if (data.hasPermission) {
            return { ...prev, [roleId]: [...current, permissionId] };
          } else {
            return {
              ...prev,
              [roleId]: current.filter((id) => id !== permissionId),
            };
          }
        });
      } else {
        showError(data.message || 'Gagal mengubah permission. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Error toggling permission:', err);
      showError('Terjadi error saat mengubah permission. Silakan coba lagi.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <AdminLayout title="Role & Permissions">
      <div className="space-y-4">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Role & Permissions
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola hak akses per role. Klik role untuk mengedit permissions.
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-3">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              isExpanded={expandedRole === role.id}
              permissions={rolePermissions[role.id] || []}
              allPermissionsCount={allPermissions.length}
              groupedPermissions={groupedPermissions}
              loading={loading}
              onToggleExpand={() =>
                setExpandedRole(expandedRole === role.id ? null : role.id)
              }
              onTogglePermission={handleToggle}
            />
          ))}
        </div>

        {/* Tip */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            <strong>Tip:</strong> Permissions disimpan otomatis saat checkbox diklik.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
