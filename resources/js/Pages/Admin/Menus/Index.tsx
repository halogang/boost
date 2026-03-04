import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { DataTable } from '@/Components/DataTable';
import { route } from 'ziggy-js';
import { Button } from '@/Components/Button';
import { useConfirmationModal } from '@/Components/ConfirmationProvider';
import { useFlashToast } from '@/hooks/useFlashToast';
import { createMenuColumns } from './columns';
import { MenuItem } from '@/types/admin/menus';

interface Props {
  menus: MenuItem[];
}

export default function Index({ menus }: Props) {
  useFlashToast();
  const [isLoading, setIsLoading] = useState(false);
  const { confirm } = useConfirmationModal();

  const handleDelete = (id: number) => {
    confirm({
      title: 'Hapus Menu',
      message: 'Apakah Anda yakin ingin menghapus menu ini? Tindakan ini tidak dapat dibatalkan.',
      variant: 'danger',
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      onConfirm: () => {
        setIsLoading(true);
        router.delete(route('menus.destroy', id), { onFinish: () => setIsLoading(false) });
      },
    });
  };

  const handleToggleActive = (menu: MenuItem) => {
    confirm({
      title: menu.active ? 'Nonaktifkan Menu' : 'Aktifkan Menu',
      message: menu.active
        ? `Nonaktifkan menu "${menu.name}"? Menu tidak akan muncul di sidebar.`
        : `Aktifkan menu "${menu.name}"?`,
      variant: menu.active ? 'warning' : 'default',
      confirmText: menu.active ? 'Nonaktifkan' : 'Aktifkan',
      cancelText: 'Batal',
      onConfirm: () => {
        setIsLoading(true);
        router.post(
          route('menus.toggle-active', menu.id),
          {},
          { preserveScroll: true, onFinish: () => setIsLoading(false) }
        );
      },
    });
  };

  const columns = createMenuColumns({
    onToggleActive: handleToggleActive,
    onDelete: handleDelete,
  });

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
              <Button>Buat Menu</Button>
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


      </div>
    </AdminLayout>
  );
}
