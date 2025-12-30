/**
 * Toast Notification Hook
 * 
 * Reusable hook for displaying toast notifications throughout the application.
 * This hook provides methods to show success, error, warning, and info toasts.
 * 
 * @example
 * ```tsx
 * import { useToast } from '@/hooks/useToast';
 * 
 * function MyComponent() {
 *   const { success, error, warning, info } = useToast();
 * 
 *   const handleSave = () => {
 *     // ... save logic
 *     success('Data berhasil disimpan', 'Perubahan telah disimpan ke database');
 *   };
 * 
 *   const handleDelete = () => {
 *     // ... delete logic
 *     error('Gagal menghapus data', 'Terjadi kesalahan saat menghapus');
 *   };
 * }
 * ```
 * 
 * @example With Inertia router
 * ```tsx
 * import { router } from '@inertiajs/react';
 * import { useToast } from '@/hooks/useToast';
 * 
 * function MyComponent() {
 *   const { success, error } = useToast();
 * 
 *   const handleSubmit = (data) => {
 *     router.post('/users', data, {
 *       onSuccess: () => {
 *         success('User berhasil dibuat');
 *       },
 *       onError: () => {
 *         error('Gagal membuat user');
 *       },
 *     });
 *   };
 * }
 * ```
 */

export { useToast } from '../Contexts/ToastContext';

