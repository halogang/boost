import React from 'react';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { route } from 'ziggy-js';
import { MenuItem, MenuPosition, MenuRole } from '@/types/admin/menus';

interface MenuColumnsOptions {
  onToggleActive: (menu: MenuItem) => void;
  onDelete: (id: number) => void;
}

export const createMenuColumns = (options: MenuColumnsOptions): ColumnDef<MenuItem>[] => [
  {
    accessorKey: 'name',
    header: 'Nama',
    cell: ({ row, getValue }) => {
      const name = getValue() as string;
      const parent = row.original.parent;
      return (
        <div>
          <span className="font-medium dark:text-gray-200">{name}</span>
          {parent && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({parent.name})</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'route',
    header: 'Route',
    cell: ({ getValue }) => {
      const value = getValue() as string | null | undefined;
      return <span className="text-sm text-gray-600 dark:text-gray-400">{value || '—'}</span>;
    },
  },
  {
    accessorKey: 'permission',
    header: 'Permission',
    cell: ({ getValue }) => {
      const value = getValue() as string | null | undefined;
      return <span className="text-sm text-gray-600 dark:text-gray-400">{value || '—'}</span>;
    },
  },
  {
    id: 'roles',
    header: 'Roles',
    cell: ({ row }) => {
      const roles = row.original.roles ?? [];
      return (
        <div className="flex flex-wrap gap-1">
          {roles.length > 0 ? (
            roles.map((role) => (
              <span
                key={role.id}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary"
              >
                {role.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">Semua Role</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'order',
    header: 'Order',
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <span className="dark:text-gray-200">
          {value !== null && value !== undefined ? String(value) : '-'}
        </span>
      );
    },
  },
  {
    accessorKey: 'active',
    header: 'Status',
    cell: ({ getValue }) => {
      const isActive = getValue() as boolean;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          {isActive ? 'Aktif' : 'Tidak Aktif'}
        </span>
      );
    },
  },
  {
    id: 'positions',
    header: 'Posisi',
    cell: ({ row }) => {
      const positions = row.original.positions ?? [];
      const labels: { key: string; label: string }[] = [
        { key: 'desktop-sidebar', label: 'Desktop Sidebar' },
        { key: 'mobile-drawer', label: 'Mobile Drawer' },
        { key: 'mobile-bottom', label: 'Mobile Bottom' },
      ];
      const active = labels.filter(({ key }) => {
        const [device, position] = key.split('-') as [string, string];
        return positions.some((p) => p.device === device && p.position === position);
      });

      return (
        <div className="flex flex-wrap gap-1">
          {active.length > 0 ? (
            active.map(({ key, label }) => (
              <span
                key={key}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary"
              >
                {label}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <button
          onClick={() => options.onToggleActive(row.original)}
          className={`text-sm font-medium ${
            row.original.active
              ? 'text-orange-600 dark:text-orange-400 hover:underline'
              : 'text-green-600 dark:text-green-400 hover:underline'
          }`}
        >
          {row.original.active ? 'Nonaktifkan' : 'Aktifkan'}
        </button>
        <Link
          href={route('menus.edit', row.original.id)}
          className="text-primary hover:underline text-sm font-medium"
        >
          Edit
        </Link>
        <Link
          href={route('menus.show', row.original.id)}
          className="text-gray-600 dark:text-gray-400 hover:underline text-sm font-medium"
        >
          View
        </Link>
        <button
          onClick={() => options.onDelete(row.original.id)}
          className="text-red-600 dark:text-red-400 hover:underline text-sm font-medium"
        >
          Hapus
        </button>
      </div>
    ),
  },
];
