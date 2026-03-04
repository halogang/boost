import React from 'react';
import { ChevronDown, ChevronRight, Shield } from 'lucide-react';
import PermissionGroup from './PermissionGroup';

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
      'super admin': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
      admin: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
      staff: 'bg-primary/10 text-primary border-primary/30',
      manager: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
      owner: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
    };
    return colors[roleName.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Role Header - compact */}
      <button
        onClick={onToggleExpand}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white capitalize">
            {role.name}
          </h3>
          <span
            className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${getRoleBadgeColor(
              role.name
            )}`}
          >
            {permissionCount}/{allPermissionsCount}
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Permissions grouped by module */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="space-y-4">
            {Object.entries(groupedPermissions)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([module, perms]) => (
                <PermissionGroup
                  key={module}
                  module={module}
                  permissions={[...perms].sort((a, b) => a.name.localeCompare(b.name))}
                  roleId={role.id}
                  selectedPermissions={permissions}
                  loading={loading}
                  onToggle={onTogglePermission}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
