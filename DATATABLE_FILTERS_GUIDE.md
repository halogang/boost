# DataTable Filters - Quick Guide

## 🎯 Cara Menambahkan Filter

### 1. Update Props Interface

```tsx
interface Props {
  data: DataTableServerResponse<YourType>;
  filterOptions: Array<{ id: number; name: string }>; // Data untuk dropdown
  filters?: {
    search?: string;
    per_page?: number;
    your_filter?: string; // Tambahkan filter baru
  };
}
```

### 2. Tambahkan Handler Filter

```tsx
const handleFilterChange = (filterValues: Record<string, any>) => {
  setIsLoading(true);
  router.get(
    '/your-route',
    {
      search: filters?.search,
      per_page: filters?.per_page || 10,
      your_filter: filterValues.your_filter, // Filter baru
    },
    {
      preserveState: true,
      preserveScroll: true,
      onFinish: () => setIsLoading(false),
    }
  );
};
```

### 3. Pass Filters ke DataTable

```tsx
<DataTable
  // ... props lainnya
  onFilterChange={handleFilterChange}
  filters={[
    {
      key: 'your_filter',
      label: 'Label Filter',
      value: filters?.your_filter,
      placeholder: 'Semua',
      options: filterOptions.map((item) => ({
        value: item.id, // atau item.name
        label: item.name,
      })),
    },
  ]}
/>
```

### 4. Update Backend Controller

```php
public function index(Request $request)
{
    $perPage = $request->input('per_page', 10);
    $search = $request->input('search', '');
    $yourFilter = $request->input('your_filter', '');

    $data = YourModel::query()
        ->when($search, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%");
        })
        ->when($yourFilter, function ($query, $filter) {
            return $query->where('column', $filter);
            // Atau untuk relationship:
            // return $query->whereHas('relation', function ($q) use ($filter) {
            //     $q->where('name', $filter);
            // });
        })
        ->orderBy('created_at', 'desc')
        ->paginate($perPage)
        ->withQueryString();

    $filterOptions = FilterModel::all(['id', 'name']);

    return Inertia::render('YourPage', [
        'data' => $data,
        'filterOptions' => $filterOptions,
        'filters' => [
            'search' => $search,
            'per_page' => (int) $perPage,
            'your_filter' => $yourFilter,
        ],
    ]);
}
```

## 📋 Contoh Multiple Filters

```tsx
<DataTable
  // ... props lainnya
  onFilterChange={handleFilterChange}
  filters={[
    {
      key: 'role',
      label: 'Role',
      value: filters?.role,
      placeholder: 'Semua Role',
      options: roles.map((role) => ({
        value: role.name,
        label: role.name,
      })),
    },
    {
      key: 'status',
      label: 'Status',
      value: filters?.status,
      placeholder: 'Semua Status',
      options: [
        { value: 'active', label: 'Aktif' },
        { value: 'inactive', label: 'Tidak Aktif' },
      ],
    },
    {
      key: 'category',
      label: 'Kategori',
      value: filters?.category,
      placeholder: 'Semua Kategori',
      options: categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    },
  ]}
/>
```

## 🎨 Filter Types

### Static Options (Hardcoded)
```tsx
{
  key: 'status',
  label: 'Status',
  value: filters?.status,
  options: [
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Tidak Aktif' },
    { value: 'pending', label: 'Pending' },
  ],
}
```

### Dynamic Options (From Backend)
```tsx
{
  key: 'category',
  label: 'Kategori',
  value: filters?.category,
  options: categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  })),
}
```

### Relationship Filter
```tsx
// Frontend
{
  key: 'supplier',
  label: 'Supplier',
  value: filters?.supplier,
  options: suppliers.map((s) => ({
    value: s.id,
    label: s.company_name,
  })),
}

// Backend
->when($supplierFilter, function ($query, $filter) {
    return $query->where('supplier_id', $filter);
})
```

## 🔍 Backend Filter Examples

### Simple Where
```php
->when($statusFilter, function ($query, $filter) {
    return $query->where('status', $filter);
})
```

### Relationship Where
```php
->when($roleFilter, function ($query, $filter) {
    return $query->whereHas('roles', function ($q) use ($filter) {
        $q->where('name', $filter);
    });
})
```

### Multiple Conditions
```php
->when($categoryFilter, function ($query, $filter) {
    return $query->where('category_id', $filter)
                 ->orWhere('sub_category_id', $filter);
})
```

### Date Range Filter
```php
// Filter structure
{
  key: 'date_range',
  label: 'Periode',
  value: filters?.date_range,
  options: [
    { value: 'today', label: 'Hari Ini' },
    { value: 'week', label: 'Minggu Ini' },
    { value: 'month', label: 'Bulan Ini' },
  ],
}

// Backend
->when($dateRange, function ($query, $range) {
    switch($range) {
        case 'today':
            return $query->whereDate('created_at', today());
        case 'week':
            return $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
        case 'month':
            return $query->whereMonth('created_at', now()->month);
    }
})
```

## 💡 Tips

1. **Preserve Filters**: Pastikan semua filter di-pass ke semua handler (pagination, search, filter)
2. **URL Query String**: Gunakan `withQueryString()` di Laravel untuk maintain filters di URL
3. **Default Values**: Set default value kosong ('') untuk optional filters
4. **Loading State**: Selalu set loading state untuk UX yang baik
5. **Clear Filters**: Bisa tambahkan button "Reset Filter" yang redirect ke route tanpa query params

## 🚀 Complete Example

Lihat implementasi lengkap di:
- [Users Index Page](./resources/js/Pages/Admin/Users/Index.tsx)
- [User Controller](./app/Http/Controllers/UserController.php)
