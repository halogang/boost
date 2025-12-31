import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { CheckCircle } from 'lucide-react';
import RoleCard from '@/Components/Permissions/RoleCard';

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions: number[];
  permissions_count: number;
}

interface GroupedPermission {
  [resource: string]: Permission[];
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
  const { flash } = usePage().props as any;
  const { error } = useToast();
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
      // Get CSRF token from meta tag or use router helper
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
        console.error('Toggle failed:', data.message || 'Unknown error');
        error(data.message || 'Gagal mengubah permission. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error toggling permission:', error);
      error('Terjadi error saat mengubah permission. Silakan coba lagi.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <AdminLayout title="Role & Permission Management">
      <div className="space-y-6">
        {/* Page Header with Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            Role & Permission Management
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Kelola hak akses berdasarkan role. Pilih role untuk melihat dan
            mengedit permissions.
          </p>
        </div>

        {/* Success Message */}
        {flash?.success && (
          <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg shadow-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {flash.success}
          </div>
        )}

        {/* Role Cards */}
        <div className="space-y-4">
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

        {/* Info Box */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>💡 Tip:</strong> Permissions akan disimpan otomatis saat
            checkbox di-klik. Tidak perlu klik tombol Save.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
