# COMPONENT LIBRARY

Komponen standar untuk project Aqua Galon dengan tema air.

---

## PAGE HEADER COMPONENT

### Basic Page Header
```typescript
import { PageHeader } from '@/Components/PageHeader';
import { Button } from '@/Components/ui/button';
import { Plus } from 'lucide-react';

<PageHeader
  title="Users"
  description="Manage all users in the system"
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Users', current: true }
  ]}
  actions={
    <Button onClick={() => router.visit(route('admin.users.create'))}>
      <Plus className="mr-2 h-4 w-4" />
      Add User
    </Button>
  }
/>
```

### Simple Page Header (No Breadcrumbs)
```typescript
import { SimplePageHeader } from '@/Components/PageHeader';

<SimplePageHeader
  title="Dashboard"
  description="Welcome back! Here's what's happening today."
  actions={
    <div className="flex gap-2">
      <Button variant="outline">Export</Button>
      <Button>Refresh</Button>
    </div>
  }
/>
```

### Compact Page Header
```typescript
import { CompactPageHeader } from '@/Components/PageHeader';

<CompactPageHeader
  title="Settings"
  description="Manage your account settings"
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', current: true }
  ]}
/>
```

### Page Header with Tabs
```typescript
import { PageHeaderWithTabs } from '@/Components/PageHeader';

<PageHeaderWithTabs
  title="User Profile"
  description="Manage user information and settings"
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Users', href: '/admin/users' },
    { label: 'John Doe', current: true }
  ]}
  tabs={[
    { label: 'Overview', href: '/admin/users/1', active: true },
    { label: 'Activity', href: '/admin/users/1/activity' },
    { label: 'Settings', href: '/admin/users/1/settings' }
  ]}
  actions={
    <Button variant="outline">
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </Button>
  }
/>
```

### Using Breadcrumb Utilities
```typescript
import { buildAdminBreadcrumb, breadcrumbPresets } from '@/lib/page-utils';

// Build breadcrumb for admin module
const breadcrumbs = buildAdminBreadcrumb('users', 'create', {
  users: 'Pengguna',
  create: 'Tambah Baru'
});

// Or use presets
const breadcrumbs = breadcrumbPresets.adminUsersEdit('John Doe');

<PageHeader
  title="Edit User"
  description="Update user information"
  breadcrumbs={breadcrumbs}
  actions={<Button>Save Changes</Button>}
/>
```

### Page Header with Multiple Actions
```typescript
<PageHeader
  title="Products"
  description="Manage your product catalog"
  breadcrumbs={breadcrumbPresets.adminProducts()}
  actions={
    <>
      <Button variant="outline" onClick={() => exportToCSV(products, 'products', columns)}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button variant="outline" onClick={() => window.print()}>
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
      <Button onClick={() => router.visit(route('admin.products.create'))}>
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </>
  }
/>
```

---

## BREADCRUMB COMPONENT

### Basic Breadcrumb
```typescript
import { Breadcrumb } from '@/Components/Breadcrumb';

<Breadcrumb
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Create', current: true }
  ]}
/>
```

### Simple Breadcrumb (No Icons)
```typescript
import { SimpleBreadcrumb } from '@/Components/Breadcrumb';

<SimpleBreadcrumb
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', href: '/settings' },
    { label: 'Profile', current: true }
  ]}
/>
```

### Dynamic Breadcrumb from Route
```typescript
import { breadcrumbFromRoute, translate } from '@/lib/page-utils';

// For route: admin.users.edit
const breadcrumbs = breadcrumbFromRoute('admin.users.edit', user.name);

<Breadcrumb items={breadcrumbs} />
```

### Breadcrumb Presets
```typescript
import { breadcrumbPresets } from '@/lib/page-utils';

// Dashboard
<Breadcrumb items={breadcrumbPresets.dashboard()} />

// Admin Users
<Breadcrumb items={breadcrumbPresets.adminUsers()} />

// Admin Users Create
<Breadcrumb items={breadcrumbPresets.adminUsersCreate()} />

// Admin Users Edit
<Breadcrumb items={breadcrumbPresets.adminUsersEdit('John Doe')} />

// Settings Profile
<Breadcrumb items={breadcrumbPresets.settingsProfile()} />
```

---

## COMPLETE PAGE LAYOUT EXAMPLE

### Index Page (List)
```typescript
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageHeader } from '@/Components/PageHeader';
import { breadcrumbPresets } from '@/lib/page-utils';
import { Button } from '@/Components/ui/button';
import { Plus, Download } from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/Components/ui/table';
import { Pagination } from '@/Components/Pagination';

export default function UserIndex({ auth, users }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Users" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Page Header */}
            <PageHeader
              title="Users"
              description="Manage all users in the system"
              breadcrumbs={breadcrumbPresets.adminUsers()}
              actions={
                <>
                  <Button
                    variant="outline"
                    onClick={() => exportToCSV(users.data, 'users', columns)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button onClick={() => router.visit(route('admin.users.create'))}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </>
              }
            />

            {/* Content */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  {/* Table content */}
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            <Pagination links={users.links} meta={users.meta} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
```

### Create/Edit Page (Form)
```typescript
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageHeader } from '@/Components/PageHeader';
import { breadcrumbPresets } from '@/lib/page-utils';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { useForm } from '@inertiajs/react';

export default function UserCreate({ auth }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.users.store'));
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Create User" />

      <div className="py-12">
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Page Header */}
            <PageHeader
              title="Create User"
              description="Add a new user to the system"
              breadcrumbs={breadcrumbPresets.adminUsersCreate()}
            />

            {/* Form Card */}
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Form fields */}

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.visit(route('admin.users.index'))}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                      {processing ? 'Saving...' : 'Create User'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
```

### Detail Page with Tabs
```typescript
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageHeaderWithTabs } from '@/Components/PageHeader';
import { breadcrumbPresets } from '@/lib/page-utils';
import { Button } from '@/Components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

export default function UserShow({ auth, user }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={user.name} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Page Header with Tabs */}
            <PageHeaderWithTabs
              title={user.name}
              description={user.email}
              breadcrumbs={breadcrumbPresets.adminUsersEdit(user.name)}
              tabs={[
                { label: 'Overview', href: route('admin.users.show', user.id), active: true },
                { label: 'Activity', href: route('admin.users.activity', user.id) },
                { label: 'Settings', href: route('admin.users.settings', user.id) }
              ]}
              actions={
                <>
                  <Button
                    variant="outline"
                    onClick={() => router.visit(route('admin.users.edit', user.id))}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </>
              }
            />

            {/* Tab Content */}
            <Card>
              <CardContent className="p-6">
                {/* Content based on active tab */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
```

---

## TABLE COMPONENT

### Basic Table
```typescript
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/Components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nama</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Aksi</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.data.map((user) => (
      <TableRow key={user.id}>
        <TableCell className="font-medium">{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <StatusBadge status={user.status} />
        </TableCell>
        <TableCell className="text-right">
          <TableActions user={user} />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Sortable Table
```typescript
import { useState } from 'react';
import { sortTableData } from '@/lib/component-utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function SortableTable({ data }: { data: User[] }) {
  const [sortColumn, setSortColumn] = useState<keyof User>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = sortTableData(data, sortColumn, sortDirection);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <button
              onClick={() => handleSort('name')}
              className="flex items-center gap-1 hover:text-primary"
            >
              Nama
              {sortColumn === 'name' && (
                sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </TableHead>
        </TableRow>
      </TableHeader>
      {/* ... */}
    </Table>
  );
}
```

### Table with Search
```typescript
import { useState } from 'react';
import { filterBySearch } from '@/lib/component-utils';
import { Input } from '@/Components/ui/input';
import { Search } from 'lucide-react';

export function SearchableTable({ data }: { data: User[] }) {
  const [search, setSearch] = useState('');

  const filteredData = filterBySearch(data, search, ['name', 'email']);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Table>
        {/* Table content */}
      </Table>

      {filteredData.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          Tidak ada data ditemukan
        </div>
      )}
    </div>
  );
}
```

### Table Actions
```typescript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Button } from '@/Components/ui/button';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { router } from '@inertiajs/react';

export function TableActions({ user }: { user: User }) {
  const handleEdit = () => {
    router.visit(route('admin.users.edit', user.id));
  };

  const handleDelete = () => {
    if (confirm('Yakin ingin menghapus user ini?')) {
      router.delete(route('admin.users.destroy', user.id));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.visit(route('admin.users.show', user.id))}>
          <Eye className="mr-2 h-4 w-4" />
          Lihat Detail
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## PAGINATION COMPONENT

### Basic Pagination
```typescript
import { Button } from '@/Components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { getPaginationRange, getPaginationInfo } from '@/lib/component-utils';

interface PaginationProps {
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  meta: {
    current_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

export function Pagination({ links, meta }: PaginationProps) {
  const pageNumbers = getPaginationRange(meta.current_page, meta.last_page);

  return (
    <div className="flex items-center justify-between">
      {/* Info */}
      <div className="text-sm text-muted-foreground">
        {getPaginationInfo(meta.current_page, meta.per_page, meta.total)}
      </div>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => links[0].url && router.visit(links[0].url)}
          disabled={!links[0].url}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Numbers */}
        {pageNumbers.map((page, index) => (
          page === null ? (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={page === meta.current_page ? 'default' : 'outline'}
              size="icon"
              onClick={() => {
                const link = links.find(l => l.label === String(page));
                if (link?.url) router.visit(link.url);
              }}
            >
              {page}
            </Button>
          )
        ))}

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => links[links.length - 1].url && router.visit(links[links.length - 1].url)}
          disabled={!links[links.length - 1].url}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```

### Simple Pagination
```typescript
export function SimplePagination({ meta }: { meta: PaginationProps['meta'] }) {
  const hasNext = meta.current_page < meta.last_page;
  const hasPrev = meta.current_page > 1;

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        onClick={() => router.visit(route(route().current()!, { page: meta.current_page - 1 }))}
        disabled={!hasPrev}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Sebelumnya
      </Button>

      <span className="text-sm text-muted-foreground">
        Halaman {meta.current_page} dari {meta.last_page}
      </span>

      <Button
        variant="outline"
        onClick={() => router.visit(route(route().current()!, { page: meta.current_page + 1 }))}
        disabled={!hasNext}
      >
        Selanjutnya
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
```

---

## BUTTON VARIANTS

### Button Styles
```typescript
import { Button } from '@/Components/ui/button';
import { Plus, Download, Upload, Trash2 } from 'lucide-react';

// Primary Button (Water Blue)
<Button variant="default">
  <Plus className="mr-2 h-4 w-4" />
  Tambah Data
</Button>

// Secondary Button
<Button variant="secondary">
  Batal
</Button>

// Destructive Button
<Button variant="destructive">
  <Trash2 className="mr-2 h-4 w-4" />
  Hapus
</Button>

// Outline Button
<Button variant="outline">
  <Download className="mr-2 h-4 w-4" />
  Export
</Button>

// Ghost Button
<Button variant="ghost">
  Detail
</Button>

// Link Button
<Button variant="link">
  Lihat Semua
</Button>
```

### Button Sizes
```typescript
// Small
<Button size="sm">Small</Button>

// Default
<Button>Default</Button>

// Large
<Button size="lg">Large</Button>

// Icon Only
<Button size="icon">
  <Plus className="h-4 w-4" />
</Button>
```

### Loading Button
```typescript
import { Loader2 } from 'lucide-react';

<Button disabled={processing}>
  {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {processing ? 'Menyimpan...' : 'Simpan'}
</Button>
```

---

## STATUS BADGE

```typescript
import { Badge } from '@/Components/ui/badge';
import { getStatusVariant, getStatusColor } from '@/lib/component-utils';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = getStatusVariant(status);
  const colorClass = getStatusColor(variant);

  return (
    <Badge className={cn('border', colorClass, className)}>
      {status}
    </Badge>
  );
}

// Usage
<StatusBadge status="aktif" />
<StatusBadge status="pending" />
<StatusBadge status="ditolak" />
```

---

## CARD LAYOUT

### Basic Card
```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/Components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Judul Card</CardTitle>
    <CardDescription>Deskripsi singkat</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    <Button>Aksi</Button>
  </CardFooter>
</Card>
```

### Stats Card
```typescript
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}

export function StatsCard({ title, value, change, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={cn(
                'text-xs font-medium',
                trend === 'up' ? 'text-success' : 'text-destructive'
              )}>
                {change}
              </p>
            )}
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Usage
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <StatsCard
    title="Total Users"
    value={1234}
    change="+12.5%"
    trend="up"
    icon={<Users className="h-4 w-4 text-primary" />}
  />
  <StatsCard
    title="Total Products"
    value={567}
    change="+8.2%"
    trend="up"
    icon={<Package className="h-4 w-4 text-primary" />}
  />
</div>
```

---

## FILTER COMPONENT

```typescript
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface FilterProps {
  filters: {
    search?: string;
    status?: string;
    role?: string;
  };
}

export function TableFilter({ filters }: FilterProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilter = () => {
    router.get(route(route().current()!), localFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleReset = () => {
    setLocalFilters({ search: '', status: '', role: '' });
    router.get(route(route().current()!), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="text-sm font-medium">Cari</label>
        <div className="relative mt-1.5">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau email..."
            value={localFilters.search}
            onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>

      <div className="w-full sm:w-48">
        <label className="text-sm font-medium">Status</label>
        <Select
          value={localFilters.status}
          onValueChange={(value) => setLocalFilters({ ...localFilters, status: value })}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Nonaktif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleFilter}>
          Terapkan
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
```

---

## EMPTY STATE

```typescript
import { FileX, Plus } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 py-12">
      <div className="rounded-full bg-muted p-4">
        <FileX className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          <Plus className="mr-2 h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Usage
{users.data.length === 0 && (
  <EmptyState
    title="Belum ada data"
    description="Mulai tambahkan data pertama Anda"
    action={{
      label: 'Tambah User',
      onClick: () => router.visit(route('admin.users.create'))
    }}
  />
)}
```

---

## LOADING STATE

```typescript
import { Skeleton } from '@/Components/ui/skeleton';

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b p-4 last:border-0">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[150px]" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-10" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## DIALOG/MODAL

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Usage
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState<User | null>(null);

<ConfirmDialog
  open={deleteDialogOpen}
  onOpenChange={setDeleteDialogOpen}
  title="Hapus User"
  description="Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan."
  onConfirm={() => {
    if (selectedUser) {
      router.delete(route('admin.users.destroy', selectedUser.id));
    }
  }}
  confirmText="Hapus"
  cancelText="Batal"
  variant="destructive"
/>
```

---

## BEST PRACTICES

### Component Organization
```typescript
// ✅ Good: Organized imports
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { formatDate } from '@/lib/utils';
import type { User } from '@/types/models';

// ✅ Good: Extract complex logic
const filteredData = filterBySearch(users, search, ['name', 'email']);
const sortedData = sortTableData(filteredData, sortColumn, sortDirection);

// ✅ Good: Reusable components
<TableActions user={user} />
<StatusBadge status={user.status} />
<Pagination links={users.links} meta={users.meta} />
```

### Performance
```typescript
// ✅ Use useMemo for expensive calculations
const sortedData = useMemo(() => 
  sortTableData(data, sortColumn, sortDirection),
  [data, sortColumn, sortDirection]
);

// ✅ Use useCallback for event handlers
const handleSort = useCallback((column: string) => {
  // Sort logic
}, [sortColumn, sortDirection]);

// ✅ Virtualize long lists
import { useVirtualizer } from '@tanstack/react-virtual';
```

### Error Handling
```typescript
// ✅ Show error states
{error && (
  <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}

// ✅ Handle loading states
{loading ? <TableSkeleton /> : <Table data={data} />}
```
