import React from 'react';

interface Permission {
  id: number;
  name: string;
  module?: string;
}

interface Props {
  permission: Permission;
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (!isLoading) {
      onToggle();
    }
  };

  return (
    <label
      className={`inline-flex items-center gap-2 cursor-pointer select-none ${
        isLoading ? 'opacity-50 cursor-wait' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        disabled={isLoading}
        className="w-3.5 h-3.5 rounded text-primary focus:ring-primary focus:ring-offset-0 focus:ring-1 disabled:opacity-50 cursor-pointer"
      />
      <span
        className={`text-sm ${
          isChecked ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        {permission.name}
      </span>
    </label>
  );
}
