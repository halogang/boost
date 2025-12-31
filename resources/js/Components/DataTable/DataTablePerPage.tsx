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
    <div className="flex items-center gap-1.5 md:gap-2">
      <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Tampilkan</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition text-xs md:text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">per halaman</span>
    </div>
  );
}
