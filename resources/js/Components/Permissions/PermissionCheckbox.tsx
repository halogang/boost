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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (!isLoading) {
      onToggle();
    }
  };

  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
        isChecked
          ? 'bg-primary/10 border-primary/30'
          : 'bg-white border-gray-200 hover:border-gray-300'
      } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        onClick={(e) => {
          e.stopPropagation();
        }}
        disabled={isLoading}
        className="w-4 h-4 rounded text-primary focus:ring-primary disabled:opacity-50 cursor-pointer"
      />
      <span className="text-sm text-gray-700 flex-1">{permission.name}</span>
    </label>
  );
}
