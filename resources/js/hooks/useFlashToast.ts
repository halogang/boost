import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useToast } from '../Contexts/ToastContext';

/**
 * Hook untuk menampilkan toast dari Inertia flash messages
 * 
 * Hook ini secara otomatis menampilkan toast notification berdasarkan
 * flash messages yang dikirim dari Laravel backend.
 * 
 * @example
 * ```tsx
 * import { useFlashToast } from '@/hooks/useFlashToast';
 * 
 * function MyComponent() {
 *   // Automatically shows toast for flash.success, flash.error, etc.
 *   useFlashToast();
 * 
 *   return <div>...</div>;
 * }
 * ```
 * 
 * @example In Laravel Controller
 * ```php
 * return redirect()->route('users.index')
 *     ->with('success', 'User berhasil dibuat');
 * 
 * // or
 * return back()->with('error', 'Gagal menyimpan data');
 * ```
 */
export function useFlashToast() {
  const { flash } = usePage().props as any;
  const { success, error, warning, info } = useToast();

  useEffect(() => {
    if (flash?.success) {
      success(flash.success);
    }
    if (flash?.error) {
      error(flash.error);
    }
    if (flash?.warning) {
      warning(flash.warning);
    }
    if (flash?.info) {
      info(flash.info);
    }
  }, [flash, success, error, warning, info]);
}

