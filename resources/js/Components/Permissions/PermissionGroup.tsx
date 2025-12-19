import React from 'react';
import PermissionCheckbox from './PermissionCheckbox';

interface Permission {
  id: number;
  name: string;
}

interface Props {
  resource: string;
  permissions: Permission[];
  roleId: number;
  selectedPermissions: number[];
  loading: string | null;
  onToggle: (roleId: number, permissionId: number) => void;
}

export default function PermissionGroup({
  resource,
  permissions,
  roleId,
  selectedPermissions,
  loading,
  onToggle,
}: Props) {
  return (
    <div>
      {/* Resource Header */}
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          📦 {resource}
        </h4>
        <div className="mt-2 h-px bg-gray-200" />
      </div>

      {/* Permission Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {permissions.map((permission) => (
          <PermissionCheckbox
            key={permission.id}
            permission={permission}
            roleId={roleId}
            isChecked={selectedPermissions.includes(permission.id)}
            isLoading={loading === `${roleId}-${permission.id}`}
            onToggle={() => onToggle(roleId, permission.id)}
          />
        ))}
      </div>
    </div>
  );
}
