import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { DataTable } from '@/Components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { route } from 'ziggy-js';
import Modal from '@/Components/Modal';
import { Button } from '@/Components/Button';

interface MenuPosition {
  id: number;
  menu_id: number;
  device: 'desktop' | 'mobile';
  position: 'sidebar' | 'bottom' | 'drawer';
}

interface Role {
  id: number;
  name: string;
}

interface MenuItem {
  id: number;
  name: string;
  icon?: string | null;
  route?: string | null;
  permission?: string | null;
  parent_id?: number | null;
  order?: number;
  active?: boolean;
  children?: MenuItem[];
  parent?: {
    id: number;
    name: string;
  } | null;
  positions?: MenuPosition[];
  roles?: Role[];
}

export default function Index() {
  const { props } = usePage<{ menus: MenuItem[]; auth: any }>();
  const menus = props.menus || [];
  const [isLoading, setIsLoading] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  const handleDelete = (id: number) => {
    if (!confirm('Hapus menu ini?')) return;
    setIsLoading(true);
    router.post(route('menus.destroy', id), { _method: 'DELETE' }, { onFinish: () => setIsLoading(false) });
  };

  const handleToggleActive = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setShowToggleModal(true);
  };

  const confirmToggleActive = () => {
    if (!selectedMenu) return;
    setIsLoading(true);
    router.post(
      route('menus.toggle-active', selectedMenu.id),
      {},
      {
        preserveScroll: true,
        onFinish: () => {
          setIsLoading(false);
          setShowToggleModal(false);
          setSelectedMenu(null);
        },
      }
    );
  };

  const columns: ColumnDef<MenuItem>[] = [
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
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                ({parent.name})
              </span>
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
        const roles = row.original.roles || [];
        return (
          <div className="flex flex-wrap gap-1">
            {roles.length > 0 ? (
              roles.map((role: Role) => (
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
        return <span className="dark:text-gray-200">{value !== null && value !== undefined ? String(value) : '-'}</span>;
      },
    },
    {
      accessorKey: 'active',
      header: 'Status',
      cell: ({ row, getValue }) => {
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
        const positions = row.original.positions || [];
        const positionLabels: string[] = [];
        
        if (positions.some(p => p.device === 'desktop' && p.position === 'sidebar')) {
          positionLabels.push('Desktop Sidebar');
        }
        if (positions.some(p => p.device === 'mobile' && p.position === 'drawer')) {
          positionLabels.push('Mobile Drawer');
        }
        if (positions.some(p => p.device === 'mobile' && p.position === 'bottom')) {
          positionLabels.push('Mobile Bottom');
        }
        
        return (
          <div className="flex flex-wrap gap-1">
            {positionLabels.length > 0 ? (
              positionLabels.map((label, idx) => (
                <span
                  key={idx}
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
            onClick={() => handleToggleActive(row.original)}
            className={`text-sm font-medium ${
              row.original.active
                ? 'text-orange-600 dark:text-orange-400 hover:underline'
                : 'text-green-600 dark:text-green-400 hover:underline'
            }`}
          >
            {row.original.active ? 'Nonaktifkan' : 'Aktifkan'}
          </button>
          <Link href={route('menus.edit', row.original.id)} className="text-primary hover:underline text-sm font-medium">
            Edit
          </Link>
          <Link href={route('menus.show', row.original.id)} className="text-gray-600 dark:text-gray-400 hover:underline text-sm font-medium">
            View
          </Link>
          <button onClick={() => handleDelete(row.original.id)} className="text-red-600 dark:text-red-400 hover:underline text-sm font-medium">
            Hapus
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Kelola Menu">
      <div className="space-y-6">
        {/* Page Header with Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <PageHeader title="Kelola Menu" description="Manajemen menu aplikasi" />
            </div>
            <Link href={route('menus.create')}>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition shadow-sm">
                Buat Menu
              </button>
            </Link>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          data={menus}
          columns={columns}
          isLoading={isLoading}
          showPagination={false}
          showPerPage={false}
          searchPlaceholder="Cari menu..."
          emptyMessage="Tidak ada menu"
        />

        {/* Toggle Active Modal */}
        <Modal show={showToggleModal} onClose={() => setShowToggleModal(false)} maxWidth="md">
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {selectedMenu?.active ? 'Nonaktifkan Menu' : 'Aktifkan Menu'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Apakah Anda yakin ingin {selectedMenu?.active ? 'menonaktifkan' : 'mengaktifkan'} menu{' '}
                <span className="font-semibold text-gray-900 dark:text-white">"{selectedMenu?.name}"</span>?
              </p>
              {selectedMenu?.active && (
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                  ⚠️ Menu yang dinonaktifkan tidak akan muncul di sidebar.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowToggleModal(false);
                  setSelectedMenu(null);
                }}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                variant={selectedMenu?.active ? 'default' : 'default'}
                onClick={confirmToggleActive}
                isLoading={isLoading}
              >
                {selectedMenu?.active ? 'Nonaktifkan' : 'Aktifkan'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
