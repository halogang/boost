# 🎯 DataTable - Contoh Implementasi

Berikut adalah contoh-contoh implementasi DataTable untuk berbagai use case yang umum digunakan.

## 📦 Example 1: Products Table

### Step 1: Buat Column Definitions

**File**: `resources/js/Pages/Admin/Products/columns.tsx`

```tsx
import { ColumnDef } from '@tanstack/react-table';
import { Link, router } from '@inertiajs/react';

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: {
    id: number;
    name: string;
  };
  status: 'active' | 'inactive';
  created_at: string;
}

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ getValue }) => (
      <span className="font-mono text-sm text-gray-600">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Nama Produk',
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-900">{row.original.name}</div>
        <div className="text-sm text-gray-500">{row.original.category.name}</div>
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: 'Harga',
    cell: ({ getValue }) => (
      <span className="font-semibold text-gray-900">
        Rp {Number(getValue()).toLocaleString('id-ID')}
      </span>
    ),
  },
  {
    accessorKey: 'stock',
    header: 'Stok',
    cell: ({ getValue }) => {
      const stock = getValue() as number;
      return (
        <span className={`font-medium ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stock} unit
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {status === 'active' ? 'Aktif' : 'Nonaktif'}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/products/${row.original.id}/edit`}
          className="text-blue-600 hover:text-blue-800 transition text-sm font-medium"
        >
          Edit
        </Link>
        <button
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
              router.delete(`/admin/products/${row.original.id}`);
            }
          }}
          className="text-red-600 hover:text-red-800 transition text-sm font-medium"
        >
          Hapus
        </button>
      </div>
    ),
  },
];
```

### Step 2: Implementasi di Page

**File**: `resources/js/Pages/Admin/Products/Index.tsx`

```tsx
import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { DataTable, DataTableServerResponse } from '@/Components/DataTable';
import { productColumns, Product } from './columns';

interface Props {
  products: DataTableServerResponse<Product>;
  filters?: {
    search?: string;
    per_page?: number;
  };
}

export default function Index({ products, filters }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setIsLoading(true);
    router.get(
      '/admin/products',
      { page: pageIndex, per_page: pageSize, search: filters?.search },
      { preserveState: true, preserveScroll: true, onFinish: () => setIsLoading(false) }
    );
  };

  const handleSearchChange = (search: string) => {
    setIsLoading(true);
    router.get(
      '/admin/products',
      { search, per_page: filters?.per_page || 10 },
      { preserveState: true, preserveScroll: true, onFinish: () => setIsLoading(false) }
    );
  };

  return (
    <AdminLayout title="Kelola Produk">
      <PageHeader
        title="Kelola Produk"
        description="Manajemen produk dan inventory"
        actions={
          <Link
            href="/admin/products/create"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Produk
          </Link>
        }
      />

      <DataTable
        data={products.data}
        columns={productColumns}
        pagination={products}
        onPaginationChange={handlePaginationChange}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari produk berdasarkan nama atau SKU..."
        isLoading={isLoading}
        emptyMessage="Belum ada produk yang ditambahkan"
      />
    </AdminLayout>
  );
}
```

### Step 3: Backend Controller

**File**: `app/Http/Controllers/ProductController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search', '');

        $products = Product::with('category')
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('sku', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
                'per_page' => (int) $perPage,
            ],
        ]);
    }
}
```

---

## 📦 Example 2: Orders Table

### Column Definitions

**File**: `resources/js/Pages/Admin/Orders/columns.tsx`

```tsx
import { ColumnDef } from '@tanstack/react-table';
import { Link } from '@inertiajs/react';

export interface Order {
  id: number;
  order_number: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  items_count: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  created_at: string;
}

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'order_number',
    header: 'No. Order',
    cell: ({ getValue }) => (
      <span className="font-mono font-semibold text-blue-600">
        #{getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'customer',
    header: 'Pelanggan',
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-900">{row.original.customer.name}</div>
        <div className="text-sm text-gray-500">{row.original.customer.email}</div>
      </div>
    ),
  },
  {
    accessorKey: 'items_count',
    header: 'Item',
    cell: ({ getValue }) => (
      <span className="text-gray-600">{getValue() as number} item</span>
    ),
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ getValue }) => (
      <span className="font-bold text-gray-900">
        Rp {Number(getValue()).toLocaleString('id-ID')}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status Order',
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
      };
      const statusLabels = {
        pending: 'Pending',
        processing: 'Diproses',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
      };
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      );
    },
  },
  {
    accessorKey: 'payment_status',
    header: 'Pembayaran',
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const statusColors = {
        unpaid: 'bg-red-100 text-red-800',
        paid: 'bg-green-100 text-green-800',
        refunded: 'bg-gray-100 text-gray-800',
      };
      const statusLabels = {
        unpaid: 'Belum Dibayar',
        paid: 'Lunas',
        refunded: 'Dikembalikan',
      };
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Tanggal',
    cell: ({ getValue }) => (
      <span className="text-sm text-gray-600">
        {new Date(getValue() as string).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => (
      <Link
        href={`/admin/orders/${row.original.id}`}
        className="text-blue-600 hover:text-blue-800 transition text-sm font-medium"
      >
        Detail
      </Link>
    ),
  },
];
```

---

## 📦 Example 3: Simple Table (Tanpa Search/Pagination)

Untuk tabel sederhana yang tidak memerlukan fitur search dan pagination:

```tsx
<DataTable
  data={items}
  columns={itemColumns}
  showSearch={false}
  showPagination={false}
  showPerPage={false}
  emptyMessage="Tidak ada item"
/>
```

---

## 📦 Example 4: Custom Per Page Options

```tsx
<DataTable
  data={data.data}
  columns={columns}
  pagination={data}
  perPageOptions={[5, 15, 30, 50, 100]}  // Custom options
  onPaginationChange={handlePaginationChange}
  onSearchChange={handleSearchChange}
/>
```

---

## 🎨 Custom Styling Examples

### Avatar Column
```tsx
{
  accessorKey: 'user',
  header: 'User',
  cell: ({ row }) => (
    <div className="flex items-center gap-3">
      {row.original.avatar ? (
        <img
          src={row.original.avatar}
          alt={row.original.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
          {row.original.name.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="font-medium">{row.original.name}</span>
    </div>
  ),
}
```

### Progress Bar Column
```tsx
{
  accessorKey: 'progress',
  header: 'Progress',
  cell: ({ getValue }) => {
    const progress = getValue() as number;
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 w-12">{progress}%</span>
      </div>
    );
  },
}
```

### Boolean Column (Icon)
```tsx
{
  accessorKey: 'is_active',
  header: 'Aktif',
  cell: ({ getValue }) => {
    const isActive = getValue() as boolean;
    return isActive ? (
      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
  },
}
```

---

## 💡 Tips & Tricks

### 1. Debounce Search untuk Performa
Gunakan debounce untuk menghindari terlalu banyak request saat user mengetik:

```tsx
import { useEffect, useRef } from 'react';

const [searchInput, setSearchInput] = useState('');
const debounceTimer = useRef<NodeJS.Timeout>();

const handleSearchChange = (search: string) => {
  setSearchInput(search);
  
  if (debounceTimer.current) {
    clearTimeout(debounceTimer.current);
  }
  
  debounceTimer.current = setTimeout(() => {
    setIsLoading(true);
    router.get('/admin/products', { search }, {
      preserveState: true,
      onFinish: () => setIsLoading(false),
    });
  }, 500); // Tunggu 500ms setelah user berhenti mengetik
};
```

### 2. Reset Pagination Saat Search
```tsx
const handleSearchChange = (search: string) => {
  router.get('/admin/products', {
    search,
    page: 1,  // Reset ke halaman 1
    per_page: filters?.per_page || 10,
  });
};
```

### 3. Multiple Search Fields
Backend support untuk multiple search fields:

```php
->when($search, function ($query, $search) {
    return $query->where(function ($q) use ($search) {
        $q->where('name', 'like', "%{$search}%")
          ->orWhere('email', 'like', "%{$search}%")
          ->orWhere('phone', 'like', "%{$search}%")
          ->orWhereHas('category', function ($q) use ($search) {
              $q->where('name', 'like', "%{$search}%");
          });
    });
})
```

---

Dokumentasi ini memberikan contoh lengkap untuk berbagai use case. Silakan disesuaikan dengan kebutuhan proyek Anda! 🚀
