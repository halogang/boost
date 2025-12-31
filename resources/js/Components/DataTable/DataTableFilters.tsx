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
    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center gap-1 md:gap-2">
          <label className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
            {filter.label}:
          </label>
          <select
            value={values[filter.key] || ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
            className="px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition text-xs md:text-sm min-w-[100px] md:min-w-[150px]"
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
