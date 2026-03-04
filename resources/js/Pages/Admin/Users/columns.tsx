import { ColumnDef } from '@tanstack/react-table';
import { Link } from '@inertiajs/react';
import { User } from '@/types/admin/users';

interface UserColumnsOptions {
  onDelete?: (id: number, name: string) => void;
}

export const createUserColumns = (options?: UserColumnsOptions): ColumnDef<User>[] => [
  {
    accessorKey: 'name',
    header: 'Nama',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
          {row.original.name.charAt(0).toUpperCase()}
        </div>
        <span className="font-medium text-gray-900 dark:text-white">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ getValue }) => (
      <span className="text-gray-600 dark:text-gray-300">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'roles',
    header: 'Role',
    cell: ({ row }) => {
      if (!row.original.roles || row.original.roles.length === 0) {
        return <span className="text-gray-400 text-sm">-</span>;
      }
      return (
        <div className="flex gap-1 flex-wrap">
          {row.original.roles.map((role) => (
            <span
              key={role.id}
              className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-3 py-1 rounded-full font-medium"
            >
              {role.name}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Dibuat',
    cell: ({ getValue }) => (
      <span className="text-gray-600 dark:text-gray-300 text-sm">
        {new Date(getValue() as string).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/users/${row.original.id}/edit`}
          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          title="Edit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
        <button
          onClick={() => {
            if (options?.onDelete) {
              options.onDelete(row.original.id, row.original.name);
            }
          }}
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          title="Hapus"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    ),
  },
];


