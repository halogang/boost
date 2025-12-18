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
      <span className="text-sm text-gray-600">Tampilkan</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-600">per halaman</span>
    </div>
  );
}
