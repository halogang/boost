import { ColumnDef } from '@tanstack/react-table';
import { Link } from '@inertiajs/react';

export interface User {
  id: number;
  name: string;
  email: string;
  roles: Array<{ id: number; name: string }>;
  created_at: string;
}

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
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
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.roles.map((role) => (
          <span
            key={role.id}
            className="inline-block bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-semibold"
          >
            {role.name}
          </span>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Dibuat',
    cell: ({ getValue }) => (
      <span className="text-gray-600 dark:text-gray-300 text-sm">
        {new Date(getValue() as string).toLocaleDateString('id-ID')}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/users/${row.original.id}/edit`}
          className="text-primary hover:opacity-80 transition text-sm font-medium"
        >
          Edit
        </Link>
        <button
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
              // Delete action will be implemented later
              // router.delete(`/admin/users/${row.original.id}`);
            }
          }}
          className="text-red-600 hover:text-red-800 transition text-sm font-medium"
        >
          Hapus
        </button>
      </div>
    ),
  },
];
