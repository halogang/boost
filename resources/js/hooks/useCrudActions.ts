import { router } from '@inertiajs/react';
import { useToast } from '../Contexts/ToastContext';

interface UseCrudActionsOptions {
  resourceName: string; // e.g., 'UOM', 'User', 'Product'
  baseRoute: string; // e.g., '/uoms', '/users'
  onSuccess?: (action: string, data?: any) => void;
  onError?: (action: string, error?: any) => void;
}

/**
 * Hook reusable untuk aksi CRUD dengan toast notification
 * 
 * @example
 * ```tsx
 * const { handleCreate, handleUpdate, handleDelete } = useCrudActions({
 *   resourceName: 'UOM',
 *   baseRoute: '/uoms',
 * });
 * 
 * // Create
 * handleCreate(formData, {
 *   onSuccess: () => {
 *     // Custom success handler
 *   }
 * });
 * 
 * // Update
 * handleUpdate(id, formData);
 * 
 * // Delete
 * handleDelete(id, 'Nama UOM');
 * ```
 */
export function useCrudActions(options: UseCrudActionsOptions) {
  const { resourceName, baseRoute, onSuccess, onError } = options;
  const { success, error, warning } = useToast();

  /**
   * Handle create action
   */
  const handleCreate = (
    data: any,
    customOptions?: {
      onSuccess?: () => void;
      onError?: (errors: any) => void;
      successMessage?: string;
    }
  ) => {
    router.post(baseRoute, data, {
      preserveScroll: true,
      onSuccess: () => {
        const message = customOptions?.successMessage || `${resourceName} berhasil dibuat`;
        success('Berhasil', message);
        customOptions?.onSuccess?.();
        onSuccess?.('create', data);
      },
      onError: (errors) => {
        const errorMessage = errors.message || `Gagal membuat ${resourceName}`;
        error('Gagal', errorMessage);
        customOptions?.onError?.(errors);
        onError?.('create', errors);
      },
    });
  };

  /**
   * Handle update action
   */
  const handleUpdate = (
    id: number | string,
    data: any,
    customOptions?: {
      onSuccess?: () => void;
      onError?: (errors: any) => void;
      successMessage?: string;
    }
  ) => {
    router.put(`${baseRoute}/${id}`, data, {
      preserveScroll: true,
      onSuccess: () => {
        const message = customOptions?.successMessage || `${resourceName} berhasil diperbarui`;
        success('Berhasil', message);
        customOptions?.onSuccess?.();
        onSuccess?.('update', { id, data });
      },
      onError: (errors) => {
        const errorMessage = errors.message || `Gagal memperbarui ${resourceName}`;
        error('Gagal', errorMessage);
        customOptions?.onError?.(errors);
        onError?.('update', errors);
      },
    });
  };

  /**
   * Handle delete action with confirmation
   */
  const handleDelete = (
    id: number | string,
    itemName?: string,
    customOptions?: {
      onSuccess?: () => void;
      onError?: (error: any) => void;
      confirmMessage?: string;
      successMessage?: string;
      confirmationModal?: ReturnType<typeof import('@/Components/ConfirmationProvider').useConfirmationModal>;
    }
  ) => {
    const confirmMessage =
      customOptions?.confirmMessage ||
      `Apakah Anda yakin ingin menghapus ${itemName ? `"${itemName}"` : resourceName}?`;
    
    const performDelete = () => {
      router.delete(`${baseRoute}/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          const message = customOptions?.successMessage || `${resourceName} berhasil dihapus`;
          success('Berhasil', message);
          customOptions?.onSuccess?.();
          onSuccess?.('delete', { id });
        },
        onError: (errors) => {
          const errorMessage = errors.message || `Gagal menghapus ${resourceName}`;
          error('Gagal', errorMessage);
          customOptions?.onError?.(errors);
          onError?.('delete', errors);
        },
      });
    };

    // Use confirmation modal if provided, otherwise use browser confirm (fallback)
    if (customOptions?.confirmationModal) {
      customOptions.confirmationModal.confirm({
        title: 'Hapus Data',
        message: confirmMessage,
        variant: 'danger',
        confirmText: 'Ya, Hapus',
        cancelText: 'Batal',
        onConfirm: performDelete,
      });
    } else {
      // Fallback to browser confirm for backward compatibility
      if (window.confirm(confirmMessage)) {
        performDelete();
      }
    }
  };

  /**
   * Handle delete with warning toast first
   */
  const handleDeleteWithWarning = (
    id: number | string,
    itemName?: string,
    customOptions?: {
      onSuccess?: () => void;
      onError?: (error: any) => void;
      warningMessage?: string;
      confirmMessage?: string;
      successMessage?: string;
    }
  ) => {
    const warningMessage =
      customOptions?.warningMessage ||
      `Anda akan menghapus ${itemName ? `"${itemName}"` : resourceName}. Tindakan ini tidak dapat dibatalkan.`;
    
    warning('Peringatan', warningMessage);
    
    // Wait a bit before showing confirmation
    setTimeout(() => {
      handleDelete(id, itemName, customOptions);
    }, 500);
  };

  /**
   * Handle toggle active/inactive
   */
  const handleToggleActive = (
    id: number | string,
    currentStatus: boolean,
    data?: any,
    customOptions?: {
      onSuccess?: () => void;
      onError?: (errors: any) => void;
    }
  ) => {
    const newStatus = !currentStatus;
    const statusText = newStatus ? 'diaktifkan' : 'dinonaktifkan';
    
    router.put(`${baseRoute}/${id}`, { ...data, active: newStatus }, {
      preserveScroll: true,
      onSuccess: () => {
        success('Berhasil', `${resourceName} berhasil ${statusText}`);
        customOptions?.onSuccess?.();
        onSuccess?.('toggle', { id, status: newStatus });
      },
      onError: (errors) => {
        error('Gagal', `Gagal ${statusText} ${resourceName}`);
        customOptions?.onError?.(errors);
        onError?.('toggle', errors);
      },
    });
  };

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    handleDeleteWithWarning,
    handleToggleActive,
  };
}

