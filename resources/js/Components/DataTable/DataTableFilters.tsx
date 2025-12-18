import React from 'react';
import { DataTableFilter } from './types';

interface DataTableFiltersProps {
  filters: DataTableFilter[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export function DataTableFilters({
  filters,
  values,
  onChange,
}: DataTableFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium whitespace-nowrap">
            {filter.label}:
          </label>
          <select
            value={values[filter.key] || ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm min-w-[150px]"
          >
            <option value="">{filter.placeholder || 'Semua'}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
