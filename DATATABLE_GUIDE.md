# DataTable Component - Panduan Penggunaan

DataTable adalah komponen reusable berbasis TanStack Table untuk menampilkan data dalam bentuk tabel dengan fitur search, pagination, dan per page selection.

## 📦 Struktur Component

```
Components/
└── DataTable/
    ├── index.ts                    # Export utama
    ├── types.ts                    # TypeScript types & interfaces
    ├── DataTable.tsx               # Komponen utama
    ├── DataTableSearch.tsx         # Komponen search
    ├── DataTablePagination.tsx     # Komponen pagination
    └── DataTablePerPage.tsx        # Komponen per page selector
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @tanstack/react-table --legacy-peer-deps
```

### 2. Buat Column Definitions

Buat file `columns.tsx` di folder page Anda:

```tsx
import { ColumnDef } from '@tanstack/react-table';
import { Link } from '@inertiajs/react';

export interface YourDataType {
  id: number;
  name: string;
  // ... fields lainnya
}

export const yourColumns: ColumnDef<YourDataType>[] = [
  {
    accessorKey: 'name',
    header: 'Nama',
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as string}</span>
    ),
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link href={`/edit/${row.original.id}`}>Edit</Link>
        <button onClick={() => handleDelete(row.original.id)}>Hapus</button>
      </div>
    ),
  },
];
```

### 3. Setup di Page Component

```tsx
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { DataTable, DataTableServerResponse } from '@/Components/DataTable';
import { yourColumns, YourDataType } from './columns';

interface Props {
  data: DataTableServerResponse<YourDataType>;
  filters?: {
    search?: string;
    per_page?: number;
  };
}

export default function YourPage({ data, filters }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setIsLoading(true);
    router.get(
      '/your-route',
      {
        page: pageIndex,
        per_page: pageSize,
        search: filters?.search,
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
      '/your-route',
      {
        search: search,
        per_page: filters?.per_page || 10,
      },
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setIsLoading(false),
      }
    );
  };

  return (
    <DataTable
      data={data.data}
      columns={yourColumns}
      pagination={{
        current_page: data.current_page,
        per_page: data.per_page,
        total: data.total,
        last_page: data.last_page,
        from: data.from,
        to: data.to,
      }}
      onPaginationChange={handlePaginationChange}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Cari data..."
      isLoading={isLoading}
      emptyMessage="Tidak ada data"
    />
  );
}
```

### 4. Setup Backend Controller

```php
public function index(Request $request)
{
    $perPage = $request->input('per_page', 10);
    $search = $request->input('search', '');

    $data = YourModel::query()
        ->when($search, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%");
            // Tambahkan field lain yang ingin di-search
        })
        ->orderBy('created_at', 'desc')
        ->paginate($perPage)
        ->withQueryString();

    return Inertia::render('YourPage', [
        'data' => $data,
        'filters' => [
            'search' => $search,
            'per_page' => (int) $perPage,
        ],
    ]);
}
```

## 🎨 Props & Options

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | **required** | Array data yang akan ditampilkan |
| `columns` | `ColumnDef<T>[]` | **required** | Definisi kolom table |
| `pagination` | `DataTablePaginationMeta` | `undefined` | Metadata pagination |
| `onPaginationChange` | `(page, size) => void` | `undefined` | Callback saat pagination berubah |
| `onSearchChange` | `(search) => void` | `undefined` | Callback saat search berubah |
| `searchPlaceholder` | `string` | `'Cari...'` | Placeholder untuk search input |
| `isLoading` | `boolean` | `false` | Status loading |
| `showSearch` | `boolean` | `true` | Tampilkan search bar |
| `showPagination` | `boolean` | `true` | Tampilkan pagination |
| `showPerPage` | `boolean` | `true` | Tampilkan per page selector |
| `perPageOptions` | `number[]` | `[10, 25, 50, 100]` | Opsi per page |
| `emptyMessage` | `string` | `'Tidak ada data'` | Pesan saat data kosong |

### Column Definition Examples

#### Simple Text Column
```tsx
{
  accessorKey: 'name',
  header: 'Nama',
}
```

#### Custom Cell Rendering
```tsx
{
  accessorKey: 'status',
  header: 'Status',
  cell: ({ getValue }) => {
    const status = getValue() as string;
    return (
      <span className={status === 'active' ? 'text-green-600' : 'text-red-600'}>
        {status}
      </span>
    );
  },
}
```

#### Action Column
```tsx
{
  id: 'actions',
  header: 'Aksi',
  cell: ({ row }) => (
    <div className="flex gap-2">
      <Link href={`/edit/${row.original.id}`}>Edit</Link>
      <button onClick={() => handleDelete(row.original.id)}>Hapus</button>
    </div>
  ),
}
```

#### Badge/Tag Column
```tsx
{
  accessorKey: 'roles',
  header: 'Role',
  cell: ({ row }) => (
    <div className="flex gap-1">
      {row.original.roles.map((role) => (
        <span key={role.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
          {role.name}
        </span>
      ))}
    </div>
  ),
}
```

#### Date Formatting
```tsx
{
  accessorKey: 'created_at',
  header: 'Tanggal',
  cell: ({ getValue }) => (
    new Date(getValue() as string).toLocaleDateString('id-ID')
  ),
}
```

## 🎯 Use Cases

### Example: Products Table

**columns.tsx**
```tsx
export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Nama Produk',
  },
  {
    accessorKey: 'price',
    header: 'Harga',
    cell: ({ getValue }) => (
      <span>Rp {Number(getValue()).toLocaleString('id-ID')}</span>
    ),
  },
  {
    accessorKey: 'stock',
    header: 'Stok',
    cell: ({ getValue }) => {
      const stock = getValue() as number;
      return (
        <span className={stock > 0 ? 'text-green-600' : 'text-red-600'}>
          {stock}
        </span>
      );
    },
  },
];
```

### Example: Orders Table

**columns.tsx**
```tsx
export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'order_number',
    header: 'No. Order',
  },
  {
    accessorKey: 'customer_name',
    header: 'Pelanggan',
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ getValue }) => (
      <span className="font-semibold">
        Rp {Number(getValue()).toLocaleString('id-ID')}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const colors = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
      };
      return (
        <span className={`px-3 py-1 rounded-full text-xs ${colors[status]}`}>
          {status}
        </span>
      );
    },
  },
];
```

## 🔧 Advanced Features

### Disable Specific Features

```tsx
<DataTable
  // ... other props
  showSearch={false}        // Sembunyikan search
  showPagination={false}    // Sembunyikan pagination
  showPerPage={false}       // Sembunyikan per page selector
/>
```

### Custom Per Page Options

```tsx
<DataTable
  // ... other props
  perPageOptions={[5, 10, 20, 50]}
/>
```

### Custom Empty Message

```tsx
<DataTable
  // ... other props
  emptyMessage="Belum ada produk yang ditambahkan"
/>
```

## 📝 Best Practices

1. **Pisahkan Column Definitions**: Selalu buat file `columns.tsx` terpisah untuk maintainability
2. **Type Safety**: Gunakan TypeScript interface untuk data type
3. **Loading State**: Selalu implementasikan loading state untuk UX yang lebih baik
4. **Preserve State**: Gunakan `preserveState: true` dan `preserveScroll: true` di router.get
5. **Backend Optimization**: Pastikan backend support search dan pagination dengan efficient query

## 🐛 Troubleshooting

### Search tidak berfungsi
- Pastikan backend controller menerima parameter `search`
- Pastikan `onSearchChange` callback di-implement dengan benar
- Cek network tab untuk memastikan request terkirim

### Pagination tidak update
- Pastikan `withQueryString()` dipanggil di backend
- Pastikan `onPaginationChange` callback di-implement
- Cek bahwa `preserveState: true` digunakan

### TypeScript errors
- Pastikan TanStack Table terinstall: `npm install @tanstack/react-table`
- Import types dengan benar: `import { ColumnDef } from '@tanstack/react-table'`

## 📚 Resources

- [TanStack Table Docs](https://tanstack.com/table/v8)
- [Inertia.js Docs](https://inertiajs.com/)
- [Example Implementation](./Pages/Admin/Users/Index.tsx)

---

**Note**: Component ini sudah dioptimasi untuk Laravel + Inertia.js + React stack. Untuk stack lain, adjustment mungkin diperlukan.
