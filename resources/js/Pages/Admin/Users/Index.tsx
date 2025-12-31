import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { DataTable, DataTableServerResponse } from '@/Components/DataTable';
import { createUserColumns, User } from './columns';
import { Button } from '@/Components/Button';
import { useCrudActions } from '@/hooks/useCrudActions';
import { useConfirmationModal } from '@/Components/ConfirmationProvider';

interface PaginatedResponse extends DataTableServerResponse<User> {}

interface Role {
  id: number;
  name: string;
}

interface Props {
  users: PaginatedResponse;
  roles: Role[];
  filters?: {
    search?: string;
    per_page?: number;
    role?: string;
  };
}

export default function Index({ users, roles, filters }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const confirmationModal = useConfirmationModal();
  const { handleDelete } = useCrudActions({
    resourceName: 'User',
    baseRoute: '/users',
  });

  // Create columns with delete handler
  const userColumns = createUserColumns({
    onDelete: (id, name) => handleDelete(id, name, {
      confirmationModal,
    }),
  });

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setIsLoading(true);
    router.get(
      '/users',
      {
        page: pageIndex,
        per_page: pageSize,
        search: filters?.search || '',
        role: filters?.role || '',
      },
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setIsLoading(false),
      }
    );
  };

  const handleSearchChange = (search: string) => {
    setIsLoading(true);
    router.get(
      '/users',
      {
        page: 1,
        per_page: filters?.per_page || 10,
        search: search || '',
        role: filters?.role || '',
      },
      {
        preserveState: true,
        preserveScroll: false,
        onFinish: () => setIsLoading(false),
      }
    );
  };

  const handleFilterChange = (filterValues: Record<string, any>) => {
    setIsLoading(true);
    router.get(
      '/users',
      {
        page: 1,
        per_page: filters?.per_page || 10,
        search: filters?.search || '',
        role: filterValues.role || '',
      },
      {
        preserveState: true,
        preserveScroll: false,
        onFinish: () => setIsLoading(false),
      }
    );
  };

  return (
    <AdminLayout title="Kelola User">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <PageHeader
            title="Kelola User"
            description="Manajemen pengguna dan akun sistem"
            actions={
              <Link href="/users/create">
                <Button>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah User
                </Button>
              </Link>
            }
          />
        </div>

        {/* DataTable */}
        <DataTable
          data={users.data}
          columns={userColumns}
          pagination={{
            current_page: users.current_page,
            per_page: users.per_page,
            total: users.total,
            last_page: users.last_page,
            from: users.from,
            to: users.to,
          }}
          searchValue={filters?.search || ''}
          onPaginationChange={handlePaginationChange}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          filters={[
            {
              key: 'role',
              label: 'Role',
              value: filters?.role || '',
              placeholder: 'Semua Role',
              options: roles.map((role) => ({
                value: role.name,
                label: role.name.charAt(0).toUpperCase() + role.name.slice(1),
              })),
            },
          ]}
          searchPlaceholder="Cari user berdasarkan nama atau email..."
          isLoading={isLoading}
          emptyMessage="Tidak ada user yang ditemukan"
        />
      </div>
    </AdminLayout>
  );
}
