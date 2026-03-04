import React from 'react';
import PermissionCheckbox from './PermissionCheckbox';

interface Permission {
  id: number;
  name: string;
  module?: string;
}

interface Props {
  module: string;
  permissions: Permission[];
  roleId: number;
  selectedPermissions: number[];
  loading: string | null;
  onToggle: (roleId: number, permissionId: number) => void;
}

export default function PermissionGroup({
  module,
  permissions,
  roleId,
  selectedPermissions,
  loading,
  onToggle,
}: Props) {
  const checkedCount = permissions.filter((p) =>
    selectedPermissions.includes(p.id)
  ).length;

  return (
    <div className="flex flex-col gap-1.5">
      {/* Module Header */}
      <div className="flex items-center gap-2">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {module}
        </h4>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          {checkedCount}/{permissions.length}
        </span>
      </div>

      {/* Compact checkboxes in a wrap layout */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 pl-1">
        {permissions.map((permission) => (
          <PermissionCheckbox
            key={permission.id}
            permission={permission}
            isChecked={selectedPermissions.includes(permission.id)}
            isLoading={loading === `${roleId}-${permission.id}`}
            onToggle={() => onToggle(roleId, permission.id)}
          />
        ))}
      </div>
    </div>
  );
}
