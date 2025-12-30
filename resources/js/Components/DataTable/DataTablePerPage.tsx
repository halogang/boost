import React from 'react';

interface DataTablePerPageProps {
  value: number;
  options?: number[];
  onChange: (value: number) => void;
}

export function DataTablePerPage({
  value,
  options = [10, 25, 50, 100],
  onChange,
}: DataTablePerPageProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">Tampilkan</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-600 dark:text-gray-400">per halaman</span>
    </div>
  );
}
