import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { breadcrumbPresets } from '@/lib/page-utils';
import { DataTable, DataTableServerResponse } from '@/Components/DataTable';
import { userColumns, User } from './columns';
import { Button } from '@/Components/Button';

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
  const { flash } = usePage().props as any;
  const [isLoading, setIsLoading] = useState(false);

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setIsLoading(true);
    router.get(
      '/admin/users',
      {
        page: pageIndex,
        per_page: pageSize,
        search: filters?.search,
        role: filters?.role,
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
        search: search,
        per_page: filters?.per_page || 10,
        role: filters?.role,
      },
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setIsLoading(false),
      }
    );
  };

  const handleFilterChange = (filterValues: Record<string, any>) => {
    setIsLoading(true);
    router.get(
      '/users',
      {
        search: filters?.search,
        per_page: filters?.per_page || 10,
        role: filterValues.role,
      },
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setIsLoading(false),
      }
    );
  };

  return (
    <AdminLayout title="Kelola User">
      <div className="space-y-6">
        {/* Page Header with Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <PageHeader
            title="Kelola User"
            description="Manajemen pengguna dan akun sistem"
            breadcrumbs={breadcrumbPresets.adminUsers()}
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

        {/* Success Message */}
        {flash?.success && (
          <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg shadow-sm">
            {flash.success}
          </div>
        )}

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
        onPaginationChange={handlePaginationChange}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        filters={[
          {
            key: 'role',
            label: 'Role',
            value: filters?.role,
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
