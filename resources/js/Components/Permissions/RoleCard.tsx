import React from 'react';
import { ChevronDown, ChevronRight, Shield } from 'lucide-react';
import PermissionGroup from './PermissionGroup';

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
  role: Role;
  isExpanded: boolean;
  permissions: number[];
  allPermissionsCount: number;
  groupedPermissions: GroupedPermission;
  loading: string | null;
  onToggleExpand: () => void;
  onTogglePermission: (roleId: number, permissionId: number) => void;
}

export default function RoleCard({
  role,
  isExpanded,
  permissions,
  allPermissionsCount,
  groupedPermissions,
  loading,
  onToggleExpand,
  onTogglePermission,
}: Props) {
  const permissionCount = permissions.length;

  const getRoleBadgeColor = (roleName: string) => {
    const colors: { [key: string]: string } = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      staff: 'bg-primary/10 text-primary border-primary/30',
      manager: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[roleName.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {/* Role Header */}
      <button
        onClick={onToggleExpand}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <Shield className="w-6 h-6 text-gray-600" />
          <div className="text-left">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {role.name}
              </h3>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(
                  role.name
                )}`}
              >
                {permissionCount} Permissions
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Klik untuk melihat dan mengedit permissions untuk role ini
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Permissions List (Expanded) */}
      {isExpanded && (
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([resource, perms]) => (
              <PermissionGroup
                key={resource}
                resource={resource}
                permissions={perms}
                roleId={role.id}
                selectedPermissions={permissions}
                loading={loading}
                onToggle={onTogglePermission}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Permissions:</span>
              <span className="font-semibold text-gray-900">
                {permissionCount} / {allPermissionsCount}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
