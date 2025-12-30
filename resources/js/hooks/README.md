# Reusable Hooks

Koleksi hooks yang dapat digunakan kembali di seluruh aplikasi.

## useCrudActions

Hook untuk menangani aksi CRUD dengan toast notification otomatis.

### Penggunaan

```tsx
import { useCrudActions } from '@/hooks/useCrudActions';

const { handleCreate, handleUpdate, handleDelete } = useCrudActions({
  resourceName: 'UOM',
  baseRoute: '/uoms',
});

// Create
handleCreate(formData, {
  onSuccess: () => {
    router.visit('/uoms');
  }
});

// Update
handleUpdate(id, formData);

// Delete
handleDelete(id, 'Nama Item');
```

### API

- `handleCreate(data, options?)` - Handle create action
- `handleUpdate(id, data, options?)` - Handle update action
- `handleDelete(id, itemName?, options?)` - Handle delete with confirmation
- `handleDeleteWithWarning(id, itemName?, options?)` - Handle delete with warning toast first
- `handleToggleActive(id, currentStatus, data?, options?)` - Handle toggle active/inactive

## useToast

Hook untuk menampilkan toast notification.

```tsx
import { useToast } from '@/hooks/useToast';

const { success, error, warning, info } = useToast();

success('Berhasil', 'Data berhasil disimpan');
error('Gagal', 'Terjadi kesalahan');
```

## useFlashToast

Hook untuk menampilkan toast secara otomatis dari Laravel flash messages.

```tsx
import { useFlashToast } from '@/hooks/useFlashToast';

// Di component atau layout
useFlashToast(); // Auto-show flash messages
```

Sudah digunakan di `AdminLayout`, jadi tidak perlu dipanggil lagi di setiap page.

