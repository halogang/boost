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
  const [expandedRole, setExpandedRole] = useState<number | null>(
    roles[0]?.id || null
  );
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
      const response = await fetch('/api/permissions/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN':
            document
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
      }
    } catch (error) {
      console.error('Error toggling permission:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <AdminLayout title="Role & Permission Management">
      <div className="mb-8">
        <p className="text-gray-600">
          Kelola hak akses berdasarkan role. Pilih role untuk melihat dan
          mengedit permissions.
        </p>
      </div>

      {/* Success Message */}
      {flash?.success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg flex items-center gap-2">
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
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> Permissions akan disimpan otomatis saat
          {/* checkbox di-klik. Tidak perlu klik tombol Save. */}
        </p>
      </div>
    </AdminLayout>
  );
}
