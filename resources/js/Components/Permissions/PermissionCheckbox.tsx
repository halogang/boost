import React from 'react';

interface Permission {
  id: number;
  name: string;
}

interface Props {
  permission: Permission;
  roleId: number;
  isChecked: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export default function PermissionCheckbox({
  permission,
  isChecked,
  isLoading,
  onToggle,
}: Props) {
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
        isChecked
          ? 'bg-blue-50 border-blue-300'
          : 'bg-white border-gray-200 hover:border-gray-300'
      } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onToggle}
        disabled={isLoading}
        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50"
      />
      <span className="text-sm text-gray-700 flex-1">{permission.name}</span>
    </label>
  );
}
