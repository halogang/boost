# Toast Notification System

Sistem notifikasi toast yang reusable untuk menampilkan pesan sukses, error, warning, dan info di seluruh aplikasi.

## Instalasi

Sistem toast sudah terintegrasi di aplikasi melalui `ToastProvider` di `app.tsx`. Tidak perlu instalasi tambahan.

## Penggunaan Dasar

### 1. Menggunakan Hook `useToast`

```tsx
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const { success, error, warning, info } = useToast();

  const handleSave = () => {
    // ... save logic
    success('Data berhasil disimpan', 'Perubahan telah disimpan ke database');
  };

  const handleDelete = () => {
    // ... delete logic
    error('Gagal menghapus data', 'Terjadi kesalahan saat menghapus');
  };

  return (
    <div>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

### 2. Integrasi dengan Inertia Router

```tsx
import { router } from '@inertiajs/react';
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const { success, error } = useToast();

  const handleSubmit = (data) => {
    router.post('/users', data, {
      onSuccess: () => {
        success('User berhasil dibuat');
      },
      onError: () => {
        error('Gagal membuat user');
      },
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 3. Otomatis dari Flash Messages (Laravel)

Gunakan hook `useFlashToast` untuk menampilkan toast secara otomatis dari flash messages Laravel:

```tsx
import { useFlashToast } from '@/hooks/useFlashToast';

function MyComponent() {
  // Automatically shows toast for flash.success, flash.error, etc.
  useFlashToast();

  return <div>...</div>;
}
```

Di Laravel Controller:

```php
return redirect()->route('users.index')
    ->with('success', 'User berhasil dibuat');

// or
return back()->with('error', 'Gagal menyimpan data');
return back()->with('warning', 'Perhatian: Data akan dihapus');
return back()->with('info', 'Informasi: Proses sedang berjalan');
```

### 4. Custom Duration

```tsx
const { success } = useToast();

// Toast akan hilang setelah 10 detik (default: 5 detik)
success('Data berhasil disimpan', 'Perubahan telah disimpan', 10000);

// Toast tidak akan hilang otomatis (duration: 0)
success('Penting!', 'Harap baca pesan ini', 0);
```

## Tipe Toast

### Success
```tsx
success('Berhasil!', 'Operasi berhasil dilakukan');
```

### Error
```tsx
error('Error!', 'Terjadi kesalahan saat memproses');
```

### Warning
```tsx
warning('Peringatan!', 'Harap periksa kembali data Anda');
```

### Info
```tsx
info('Informasi', 'Proses sedang berjalan di background');
```

## API Reference

### `useToast()`

Hook untuk menampilkan toast notification.

**Returns:**
- `success(title: string, message?: string, duration?: number)` - Tampilkan toast success
- `error(title: string, message?: string, duration?: number)` - Tampilkan toast error
- `warning(title: string, message?: string, duration?: number)` - Tampilkan toast warning
- `info(title: string, message?: string, duration?: number)` - Tampilkan toast info
- `showToast(type: ToastType, title: string, message?: string, duration?: number)` - Tampilkan toast dengan tipe custom

**Parameters:**
- `title` (required): Judul toast
- `message` (optional): Pesan tambahan
- `duration` (optional): Durasi dalam milliseconds (default: 5000ms, 0 = tidak hilang otomatis)

### `useFlashToast()`

Hook untuk menampilkan toast secara otomatis dari Inertia flash messages.

**Usage:**
```tsx
useFlashToast(); // Call once in component
```

**Supported Flash Keys:**
- `flash.success` - Menampilkan toast success
- `flash.error` - Menampilkan toast error
- `flash.warning` - Menampilkan toast warning
- `flash.info` - Menampilkan toast info

## Best Practices

1. **Gunakan di Layout atau Page Level**
   ```tsx
   // Di AdminLayout.tsx atau page utama
   export default function AdminLayout({ children }) {
     useFlashToast(); // Auto-show flash messages
     return <div>{children}</div>;
   }
   ```

2. **Gunakan untuk Feedback User**
   ```tsx
   const handleAction = async () => {
     try {
       await saveData();
       success('Berhasil', 'Data telah disimpan');
     } catch (err) {
       error('Gagal', 'Terjadi kesalahan saat menyimpan');
     }
   };
   ```

3. **Kombinasi dengan Inertia**
   ```tsx
   router.post('/api/data', formData, {
     onSuccess: () => success('Data berhasil disimpan'),
     onError: (errors) => {
       if (errors.message) {
         error('Error', errors.message);
       }
     },
   });
   ```

4. **Pesan yang Jelas dan Informatif**
   ```tsx
   // ✅ Good
   success('User berhasil dibuat', 'User dengan email user@example.com telah ditambahkan');
   
   // ❌ Bad
   success('OK');
   ```

## Styling

Toast menggunakan Tailwind CSS dengan dukungan dark mode. Styling dapat disesuaikan di:
- `resources/js/Components/Toast/Toast.tsx` - Komponen toast individual
- `resources/js/Components/Toast/ToastContainer.tsx` - Container untuk semua toast

## Lokasi File

- `resources/js/Components/Toast/Toast.tsx` - Komponen toast
- `resources/js/Components/Toast/ToastContainer.tsx` - Container toast
- `resources/js/Contexts/ToastContext.tsx` - Context dan provider
- `resources/js/hooks/useToast.ts` - Hook utama
- `resources/js/hooks/useFlashToast.ts` - Hook untuk flash messages
- `resources/js/hooks/index.ts` - Export semua hooks

