# Global Project Instructions

You are an expert developer working on a Laravel + Inertia.js (React) project.
Your responses must adhere to the following architectural and stylistic constraints.

---

## Architecture Pattern: Model → Controller → Service

When working on this Laravel project, follow these strict rules:

### 1. Controller Rules
- Controllers MUST be thin - only handle HTTP request/response
- NEVER write business logic in controllers
- ALWAYS delegate business logic to Service classes
- Use `authorize()` method for permission checks
- Use Form Request classes for validation (StoreXxxRequest, UpdateXxxRequest)
- Inject Services via constructor dependency injection
- Return Inertia responses or redirects only

### 2. Service Rules
- ALL business logic MUST be in Service classes
- Services handle database operations and data transformations
- Services throw exceptions with clear error messages
- Services return formatted data (models, collections, arrays)
- Services can inject other Services if needed
- NEVER handle HTTP request/response in Services

### 3. Model Rules
- Models contain ONLY: fillable, casts, relationships, scopes
- NO business logic in models
- Use scopes for reusable query logic
- Define relationships clearly

### 4. Policy Rules
- Use Policies for ALL authorization checks
- Policies return boolean (true/false)
- Check permissions using `hasPermissionTo()`
- Register policies following Laravel conventions (auto-discovery)

### 5. Request Rules
- Create Form Request classes for validation
- Use `authorize()` method in Request classes
- Define validation rules in `rules()` method
- Naming: `Store{Resource}Request`, `Update{Resource}Request`

### 6. File Structure
```
app/
├── Constants/
│   └── Permissions.php      # Permission constants
├── Http/
│   ├── Controllers/          # Thin controllers, HTTP only
│   ├── Requests/             # Validation classes
├── Models/                   # Database layer only
├── Policies/                 # Authorization classes
└── Services/                 # Business logic
```

### 7. When Creating New Features
1. Create Model (if needed) - relationships, scopes only
2. Create Policy - authorization rules
3. Create Service - business logic
4. Create Request classes - validation
5. Create Controller - thin layer, delegate to Service

### 8. Code Examples

**Controller (DO):**
```php
class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    public function store(StoreProductRequest $request)
    {
        $this->productService->createProduct($request->validated());
        return redirect()->route('products.index');
    }
}
```

**Controller (DON'T):**
```php
// ❌ BAD - Business logic in controller
public function store(Request $request)
{
    $validated = $request->validate([...]);
    Product::create($validated); // ❌ Direct model access
    // Business logic here... // ❌
}
```

**Service (DO):**
```php
class ProductService
{
    public function createProduct(array $data): Product
    {
        // Business logic here
        return Product::create($data);
    }
}
```

### 9. Exception Handling
- Services throw exceptions with clear messages
- Controllers catch and display to users
- Never expose internal errors to users

### 10. Testing
- Services are easily testable (no HTTP dependencies)
- Controllers are thin and easy to test
- Models are simple and focused

## Remember
- **Controller = HTTP Layer (Thin)**
- **Service = Business Logic (Thick)**
- **Model = Data Layer (Simple)**
- **Policy = Authorization**
- **Request = Validation**

Always ask: "Is this business logic?" → If yes, it goes in Service, NOT Controller.

## Critical "DO NOT" Rules
1. **NEVER** write business logic in Controllers.
2. **NEVER** hardcode permission strings (always use `App\Constants\Permissions`).
3. **NEVER** modify existing seeders for data updates (always create new `Update...Seeder`).
4. **NEVER** create custom Notification logic or components unless explicitly requested.
5. **NEVER** inline permission/menu assignment directly in `Core/` seeders for new roles — always create a dedicated `Authorization/{RoleName}AuthorizationSeeder.php`.
6. **NEVER** call `useFlashToast()` inside layout components (e.g. `AdminLayout`). Always call it **manually in each page component** that needs it — calling it globally in a layout causes **duplicate toasts**.

---

## Frontend Reusable Components

### IMPORTANT: Use Existing Reusable Components

This project has **ALREADY BUILT** reusable components. **ALWAYS USE THEM** instead of creating new ones.

### 1. Toast Notification System ✅

**Location**: `resources/js/Components/Toast/` and `resources/js/hooks/useToast.ts`

**ALWAYS use the existing toast system** for notifications:

```tsx
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const { success, error, warning, info } = useToast();

  const handleSave = () => {
    success('Data berhasil disimpan', 'Perubahan telah disimpan ke database');
  };

  const handleError = () => {
    error('Gagal menyimpan', 'Terjadi kesalahan saat menyimpan data');
  };
}
```

**For Laravel flash messages**, use `useFlashToast` **per page** (NOT in layout):
```tsx
import { useFlashToast } from '@/hooks/useFlashToast';

function MyPage() {
  useFlashToast(); // Auto-shows toast from Laravel flash messages
  return <div>...</div>;
}
```

> ⚠️ **CRITICAL**: NEVER call `useFlashToast()` inside layout components (e.g. `AdminLayout`). It must be called **manually in each page component** that needs it. Placing it globally in the layout causes **duplicate toasts** when a page also calls it.

**DO NOT** create custom notification components. Use the existing toast system.

### 2. DataTable Component ✅

**Location**: `resources/js/Components/DataTable/`

**ALWAYS use the existing DataTable component** for displaying tabular data:

```tsx
import { DataTable, DataTableServerResponse } from '@/Components/DataTable';

interface Props {
  data: DataTableServerResponse<YourType>;
  filters?: {
    search?: string;
    per_page?: number;
  };
}

export default function YourPage({ data, filters }: Props) {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Nama',
    },
    // ... more columns
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      searchValue={filters?.search || ''}
      onSearchChange={(value) => {
        router.get(route('your.route'), { search: value }, { preserveState: true });
      }}
    />
  );
}
```

**DO NOT** create custom table components. Use the existing DataTable.

#### DataTable Columns — Separate File Rule

**ALWAYS extract `ColumnDef` arrays into a separate `columns.tsx` file** in the same folder as the page. Never define columns inline inside the page component.

**Pattern** — `columns.tsx` next to `Index.tsx`:
```tsx
// Pages/Admin/{Module}/columns.tsx
import { ColumnDef } from '@tanstack/react-table';

export interface MyEntity { /* ... */ }

interface MyColumnsOptions {
  onDelete: (id: number) => void;
}

export const createMyColumns = (options: MyColumnsOptions): ColumnDef<MyEntity>[] => [
  { accessorKey: 'name', header: 'Nama', cell: ({ getValue }) => <span>{getValue() as string}</span> },
  // ...
];
```

```tsx
// Pages/Admin/{Module}/Index.tsx
import { createMyColumns, MyEntity } from './columns';

const columns = createMyColumns({ onDelete: handleDelete });
```

**Rules:**
- File name: `columns.tsx` (same folder as `Index.tsx`)
- Export a `create{Module}Columns(options)` factory function — use a factory so handlers can be injected
- Export all type interfaces (`MyEntity`, etc.) from `columns.tsx` so `Index.tsx` can import them
- `Index.tsx` must NOT import `ColumnDef` directly — that belongs in `columns.tsx`

### 3. Utils & Helpers ✅

**Location**: `resources/js/lib/` and `resources/js/utils/`

```tsx
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { breadcrumbPresets } from '@/lib/page-utils';
```

**DO NOT** duplicate utility functions. Check existing utils first.

### 4. Frontend File Structure

```
resources/js/
├── Components/
│   ├── Toast/              ✅ Use for notifications
│   ├── DataTable/          ✅ Use for tables
│   ├── ui/                 # shadcn/ui components
│   └── ...
├── hooks/
│   ├── useToast.ts         ✅ Use for toast notifications
│   ├── useFlashToast.ts    ✅ Use for Laravel flash messages
│   └── ...
├── lib/
│   ├── utils.ts            ✅ General utilities
│   ├── page-utils.ts       ✅ Page utilities
│   └── ...
├── utils/
│   └── theme.ts            ✅ Theme utilities
└── Pages/
    ├── Admin/              # Admin pages (Dashboard, Users, Menus, etc.)
    ├── ManagementData/     # Management Data pages
    └── {Module}/           # Module transaction pages
```

**IMPORTANT: Folder Structure Rules**

- **Management Data Pages** → `resources/js/Pages/ManagementData/{Module}/{Resource}/`
- **Transaction Pages** → `resources/js/Pages/{Module}/{Resource}/`

- **Controller Inertia Path** → Must match folder structure:
  ```php
  Inertia::render('ManagementData/{Module}/{Resource}/Index')
  Inertia::render('{Module}/{Resource}/Index')
  ```

### 5. Quick Reference

```tsx
// Toast Notifications
import { useToast } from '@/hooks/useToast';
const { success, error, warning, info } = useToast();

// DataTable
import { DataTable, DataTableServerResponse } from '@/Components/DataTable';

// Utils
import { cn, formatCurrency } from '@/lib/utils';
import { breadcrumbPresets } from '@/lib/page-utils';

// Flash Messages — call per page, NOT in layout
import { useFlashToast } from '@/hooks/useFlashToast';
useFlashToast(); // Add this in individual page components only
```

---

## React & TypeScript Standards

### File Size Limits

| File Type | Max Lines | Action if Exceeded |
|---|---|---|
| Page component (`Index/Create/Edit/Show.tsx`) | **150 lines** | Extract form → `Partials/`, logic → custom hook |
| `columns.tsx` | **200 lines** | Split into multiple column groups or helper files |
| `Partials/*.tsx` (form fields, sections) | **200 lines** | Split by logical section |
| Hook (`use*.ts`) | **100 lines** | Split into focused single-responsibility hooks |
| Shared component (`Components/**`) | **250 lines** | Break into sub-components |
| `lib/*.ts` / `utils/*.ts` utility file | **150 lines** | Split by domain |

> **Rule**: If a file exceeds its limit, **stop and extract** before adding more code.

---

### TypeScript — No `any`

- **NEVER use `any`**. Always define explicit types.
- Prefer `unknown` over `any` when type is truly unknown, then narrow with type guards.
- Use `Record<string, never>` for empty objects, not `{}`.

```tsx
// ❌ BAD
const handleFilter = (values: Record<string, any>) => { ... }
const { auth } = usePage<any>().props;

// ✅ GOOD
interface FilterValues { role?: string; search?: string; }
const handleFilter = (values: FilterValues) => { ... }

interface PageSharedProps { auth: { user: User }; notifications?: { unread_count: number }; flash?: FlashMessages; }
const { auth } = usePage<PageSharedProps>().props;
```

---

### Types & Interfaces — Where to Define Them

Use **pragmatic judgment**, not a rigid rule. The guiding question is: "**is this type used in more than one file?**"

| Kondisi | Taruh di mana |
|---|---|
| Tipe dipakai di **≥2 file berbeda** (misal `User` di Index, Edit, Create) | `types/admin/{module}.ts` |
| Tipe hanya di pakai di **`columns.tsx`** saja | tetap inline di `columns.tsx` |
| Tipe hanya dipakai di **satu `Partials/`** saja | tetap inline di file `Partials/` itu |
| Shared Inertia props (`auth`, `flash`, `notifications`) | `types/index.d.ts` — extend `PageProps` |
| Props page (local, tidak dishare) | top of the same file — `interface Props {}` |

> **Jangan paksa** membuat `types/admin/{module}.ts` kalau type-nya cuma dipakai di satu tempat. Itu over-engineering.

#### `types/` Folder Structure

```
resources/js/types/
├── index.d.ts            # Global Inertia shared props (PageProps, User, FlashMessages, dll.)
├── global.d.ts           # Window, Ziggy global declarations — DO NOT EDIT
├── vite-env.d.ts         # Vite env declarations — DO NOT EDIT
└── admin/
    ├── users.ts          # User, UserRole, UserFormData   ← shared di 3+ files
    ├── menus.ts          # MenuItem, MenuPosition, MenuRole, MenuParent, MenuFormData
    └── {module}.ts       # Buat hanya kalau ada tipe yang dishare antar file
```

#### Contoh keputusan

```
✅ Buat types/admin/users.ts
   → User dipakai di Index.tsx, Edit.tsx, Create.tsx, columns.tsx

✅ Buat types/admin/menus.ts
   → MenuItem dipakai di Index.tsx, Edit.tsx, Create.tsx, Show.tsx, columns.tsx

❌ JANGAN buat types/admin/permissions.ts  (dulu)
   → PermissionItem hanya dipakai di columns.tsx saja
   → Kalau nanti Edit.tsx juga butuh, baru pindahkan

✅ Tetap inline di columns.tsx
   interface PermissionItem { id: number; name: string; }
```

#### Adding Types for a New Module

1. **Mulai inline** di `columns.tsx` atau `Partials/` dulu
2. **Kalau ada file kedua yang butuh tipe yang sama** → pindahkan ke `types/admin/{module}.ts`
3. Update semua consumer untuk import dari `@/types/admin/{module}`

Consumer pages import langsung dari canonical source:

```tsx
// ✅ CORRECT — import dari canonical types file (karena dishare)
import { User, UserFormData, UserRole } from '@/types/admin/users';
import { createUserColumns } from './columns';   // factory function dari columns
import UserFormFields from './Partials/UserFormFields'; // component dari Partials

// ✅ CORRECT — inline kalau hanya dipakai di satu file
// columns.tsx:
interface PermissionItem { id: number; name: string; group: string; }

// ❌ WRONG — re-export boilerplate yang tidak perlu
// columns.tsx:
export type { User } from '@/types/admin/users';  // ← tidak perlu, page langsung import dari source
```

#### Extending `PageProps` (Inertia shared props)

Add shared Inertia props to `resources/js/types/index.d.ts` so `usePage()` is typed without casting:

```ts
// types/index.d.ts
export interface FlashMessages {
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  roles?: Array<{ id: number; name: string }> | string[];
  permissions?: string[];
}

export interface NavigationMenuItem {
  id: number;
  name: string;
  icon?: string | null;
  route?: string | null;
  children?: NavigationMenuItem[];
}

export interface NavigationProps {
  sidebar: NavigationMenuItem[];
  bottom: NavigationMenuItem[];
  drawer: NavigationMenuItem[];
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: { user: User };
  flash?: FlashMessages;
  notifications?: { unread_count: number };
  navigation?: NavigationProps;
  settings?: { primary_color?: string };
};
```

Then use it without casting:
```tsx
// ✅ GOOD — fully typed, no `any`
const { auth, flash, notifications } = usePage<PageProps>().props;
```

---

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Component file | `PascalCase.tsx` | `UserFormFields.tsx` |
| Hook file | `camelCase.ts` | `useNotifications.ts` |
| Utility file | `kebab-case.ts` | `page-utils.ts` |
| Interface / Type | `PascalCase` | `UserFormData`, `PageProps` |
| Props interface | `Props` (local to file) | `interface Props { ... }` |
| Component function | `PascalCase`, default export | `export default function Index(...)` |
| Hook function | `camelCase`, named export | `export function useNotifications(...)` |
| Column factory | `create{Module}Columns` | `createUserColumns(options)` |
| Form partial component | `{Resource}FormFields` | `UserFormFields` |
| Module types file | `{module}.ts` (in `types/admin/`) | `users.ts`, `menus.ts` |

---

### Page Component Structure

Every page file must follow this order:

```tsx
// 1. React import
import React from 'react';
// 2. Inertia imports
import { useForm, Link, router } from '@inertiajs/react';
// 3. Layout
import AdminLayout from '@/Layouts/AdminLayout';
// 4. Shared components
import { PageHeader } from '@/Components/PageHeader';
import { Button } from '@/Components/Button';
// 5. Module-local component imports (factory fn from columns, component from Partials)
import { createUserColumns } from './columns';
import UserFormFields from './Partials/UserFormFields';
// 6. Hooks
import { useFlashToast } from '@/hooks/useFlashToast';
// 7. Types — dari @/types/admin/ kalau dishare antar file, atau inline di sini kalau local
import { User, UserFormData, UserRole } from '@/types/admin/users';

// 8. Local types (Props only)
interface Props {
  users: DataTableServerResponse<User>;
  filters?: { search?: string; per_page?: number };
}

// 9. Component (default export, ONE per file)
export default function Index({ users, filters }: Props) {
  useFlashToast(); // Always first line in page components (if needed)
  // ...
}
```

**Rules:**
- **ONE default export per file** — no named component exports from page files.
- `useFlashToast()` is always the **first hook call** in page components that need it.
- No inline styles — use Tailwind classes only.
- No magic strings — use `route()` helper or constants for URLs/route names.

---

### Props Rules

- Always define `interface Props {}` at the top of the file (before the component).
- Never use inline object types for props: `function Foo({ x }: { x: string })` → only for trivially small one-liners.
- Export `Props` only if another file needs to reference it; otherwise keep it local.
- Prefer `?` for optional props over union with `undefined`.

```tsx
// ❌ BAD
export default function Create({ roles }: { roles: any[] }) { ... }

// ✅ GOOD
interface Props {
  roles: UserRole[];
  initialValues?: Partial<UserFormData>;
}
export default function Create({ roles, initialValues }: Props) { ... }
```

---

### Imports — Rules

- Use `@/` path alias for everything under `resources/js/` — never use relative `../../`.
- Exception: **same-folder imports** (e.g. `./columns`, `./Partials/UserFormFields`) use relative `./`.
- Group imports in this order, separated by blank lines:
  1. `react` / framework (`@inertiajs/react`)
  2. Layout (`@/Layouts/...`)
  3. Shared components (`@/Components/...`)
  4. Hooks (`@/hooks/...`)
  5. Lib/utils (`@/lib/...`, `@/utils/...`)
  6. Local / module-relative — **components only** (`./columns`, `./Partials/...`) — NOT types
  7. Types (`@/types/admin/{module}`) — always from canonical types folder, last

---

### Hooks — Rules

- One concern per hook — a hook that does more than one thing should be split.
- Hooks live in `resources/js/hooks/` and are exported from `resources/js/hooks/index.ts`.
- Hook files are plain `.ts` unless they return JSX (rare), then `.tsx`.
- Always define explicit return types:

```ts
// ✅
export function useNotifications(initialUnreadCount = 0): UseNotificationsReturn { ... }
```

- **Never** call hooks conditionally or inside loops.
- `useState` initial value must match the declared type — no type widening via `any`.

---

### Component Extraction Triggers (when to split)

Extract into a sub-component or `Partials/` file when **any** of the following is true:

1. The JSX block is used in more than one page.
2. The JSX block exceeds **~40 lines**.
3. The JSX block has its own local state.
4. The logic in a handler function exceeds **~15 lines** → extract to a custom hook.

---

## AI-Generated Documentation Rules

**ALL AI-generated markdown documentation files MUST be placed in the `ai-generated/` folder.**

- ✅ **DO**: Create all AI-generated `.md` files in `ai-generated/` folder
- ❌ **DON'T**: Create documentation files in project root
- ✅ **DO**: Use sequential numbering with descriptive, kebab-case file names (e.g., `01-architecture.md`, `02-coding-standards.md`, `03-database-schema.md`)

---

## Seeder Organization

### Struktur Seeder yang Terorganisir

```
database/seeders/
│
├── Core/                           # ⚠️ WAJIB - Data dasar aplikasi
│   ├── UserSeeder.php
│   ├── RolePermissionSeeder.php
│   ├── SettingsSeeder.php
│   ├── MenuSeeder.php
│   └── MenuPositionSeeder.php
│
├── Authorization/                  # ⚠️ WAJIB - Assign permissions, menus & positions per role
│   ├── AllAuthorizationSeeder.php              # Runner - memanggil semua seeder di bawah
│   ├── SuperAdminAuthorizationSeeder.php
│   ├── OwnerAuthorizationSeeder.php
│   ├── ManagerAuthorizationSeeder.php
│   ├── AdminAuthorizationSeeder.php
│   └── {RoleName}AuthorizationSeeder.php       # Tambah seeder baru saat ada role baru
│
├── MenuAccess/                     # Menu & Permissions per Modul fitur baru
│   └── {Module}/{Module}MenuPermissionSeeder.php
│
├── MasterData/                     # Data master (Optional)
│   └── ...
│
├── SampleData/                     # Data sample (HANYA Development)
│   └── ...
│
└── Fix/                            # Seeder untuk fix/update data
    └── ...
```

### Authorization Seeders - POLA WAJIB

Setiap role memiliki seeder sendiri di `Authorization/` yang bertanggung jawab atas:
1. **Permissions** — `syncPermissions([...])` dengan konstanta dari `Permissions::`
2. **Menus** — `syncWithoutDetaching([$role->id])` ke tiap menu yang diizinkan
3. **Menu Positions** — `MenuRolePosition::firstOrCreate([...])` per device/position

**Template `{RoleName}AuthorizationSeeder.php`:**
```php
namespace Database\Seeders\Authorization;

use App\Constants\Permissions;
use App\Models\Menu;
use App\Models\MenuRolePosition;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class {RoleName}AuthorizationSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $role = Role::where('name', '{Role Name}')->first();
        if (!$role) { $this->command->error('{Role Name} role not found!'); return; }

        // STEP 1: Permissions
        $permissions = [Permissions::READ_DASHBOARD, /* ... */];
        foreach ($permissions as $p) { Permission::firstOrCreate(['name' => $p, 'guard_name' => 'web']); }
        $role->syncPermissions($permissions);

        // STEP 2: Menus
        $menus = Menu::whereIn('name', ['Dashboard', /* ... */])->get();
        foreach ($menus as $menu) { $menu->roles()->syncWithoutDetaching([$role->id]); }

        // STEP 3: Menu Positions
        $desktopMenus = Menu::whereNull('parent_id')->whereIn('name', ['Dashboard'])->get();
        foreach ($desktopMenus as $menu) {
            MenuRolePosition::firstOrCreate([
                'menu_id' => $menu->id, 'role_id' => $role->id,
                'device' => 'desktop', 'position' => 'sidebar',
            ]);
        }
    }
}
```

**Tambahkan ke `AllAuthorizationSeeder`:**
```php
$this->call([
    SuperAdminAuthorizationSeeder::class,
    OwnerAuthorizationSeeder::class,
    ManagerAuthorizationSeeder::class,
    AdminAuthorizationSeeder::class,
    {RoleName}AuthorizationSeeder::class, // ← tambahkan di sini
]);
```

### Deployment Guidelines

```bash
# Core + Authorization Seeders (WAJIB untuk Production)
php artisan db:seed

# Hanya Authorization Seeders (re-assign permissions/menus)
php artisan db:seed --class=Database\\Seeders\\Authorization\\AllAuthorizationSeeder

# Authorization untuk role tertentu saja
php artisan db:seed --class=Database\\Seeders\\Authorization\\AdminAuthorizationSeeder

# MenuAccess Seeders (Sesuai modul aktif)
php artisan db:seed --class=Database\\Seeders\\MenuAccess\\{Module}\\{Module}MenuPermissionSeeder

# SampleData Seeders → JANGAN jalankan di Production
```

### Urutan Eksekusi di DatabaseSeeder

```php
// 1. Core - Roles and permissions
$this->call(RolePermissionSeeder::class);
// 2. Core - Menus
$this->call(MenuSeeder::class);
// 3. Core - Menu positions
$this->call(MenuPositionSeeder::class);
// 4. Core - Users with roles
$this->call(UserSeeder::class);
// 5. Core - Default settings
$this->call(SettingsSeeder::class);
// 6. Authorization - Assign permissions, menus & positions per role  ← WAJIB SETELAH CORE
$this->call(AllAuthorizationSeeder::class);
```

---

## Seeder Update Pattern - CRITICAL RULE

### ⚠️ NEVER Modify Existing Seeders for Updates

1. **NEVER modify existing seeders** to add/update fields for existing data
2. **ALWAYS create new seeder** in `Fix/` folder for updates
3. **Make it idempotent** - Safe to run multiple times
4. **Use unique identifiers** (not IDs) to find records

---

## Menu & Permission Management

### Adding New Menu with Permissions

**IMPORTANT**: Create a **separate seeder** for each new feature in `MenuAccess/{Module}/` folder. Don't modify `Core/RolePermissionSeeder` or `Core/MenuSeeder` directly.

#### Checklist for New Menu

- [ ] Add permission constants to `app/Constants/Permissions.php`
- [ ] Create seeder: `MenuAccess/{Module}/{Module}MenuPermissionSeeder.php`
- [ ] Create permissions using `Permission::firstOrCreate()`
- [ ] Assign permissions using `givePermissionTo()` (NOT `syncPermissions()`)
- [ ] Create menu using `Menu::firstOrCreate()`
- [ ] Assign menu to roles using `roles()->sync()`
- [ ] Create/update Policy using `Permissions` constants
- [ ] Update Controller with `authorize()` checks
- [ ] Add route to `web.php`
- [ ] Run seeder and clear cache

### Adding New Role

**IMPORTANT**: Setiap role baru HARUS memiliki `Authorization` seeder tersendiri.

#### Checklist for New Role

- [ ] Tambahkan role di `Core/RolePermissionSeeder.php` (`Role::firstOrCreate(...)`)
- [ ] Buat file baru: `Authorization/{RoleName}AuthorizationSeeder.php`
  - Tentukan permissions yang sesuai dengan `Permissions::*` constants
  - Tentukan menus yang bisa diakses
  - Tentukan menu positions (desktop sidebar, mobile bottom, mobile drawer)
- [ ] Daftarkan seeder ke `Authorization/AllAuthorizationSeeder.php`
- [ ] Buat Policy jika diperlukan aturan otorisasi khusus
- [ ] Run seeder: `php artisan db:seed --class=Database\\Seeders\\Authorization\\{RoleName}AuthorizationSeeder`

---

## Permission Constants - CRITICAL RULE

### ⚠️ NEVER Hardcode Permission Strings

**ALWAYS use `App\Constants\Permissions` constants instead of hardcoded permission strings.**

**File**: `app/Constants/Permissions.php`

### Adding New Permissions

```php
// 1. Add to app/Constants/Permissions.php
public const CREATE_NEW_FEATURE = 'create new feature';
public const READ_NEW_FEATURE = 'read new feature';
public const UPDATE_NEW_FEATURE = 'update new feature';
public const DELETE_NEW_FEATURE = 'delete new feature';

// 2. Add to all() method
public static function all(): array
{
    return [
        // ... existing ...
        self::CREATE_NEW_FEATURE,
        self::READ_NEW_FEATURE,
        self::UPDATE_NEW_FEATURE,
        self::DELETE_NEW_FEATURE,
    ];
}

// 3. Use constants everywhere
Permissions::READ_NEW_FEATURE
```

---

## Change Notes & Deployment Documentation

When making changes that require migrations, seeders, or deployment steps, **ALWAYS create a change note** in `changenotes/`.

**Format**: `{number}-{short-description}.md` (3-digit numbers, kebab-case)

---

## In-App Notification System ✅

This project has a **database-backed notification system** (bell icon dropdown). This is separate from toast notifications.

### When to use what

| Concern | Use |
|---|---|
| Form success / flash messages | `useFlashToast()` → toast |
| Inline user feedback | `useToast()` → toast |
| Persistent in-app alerts, events | **NotificationService** → bell dropdown |

### Backend Usage

**ALWAYS use `NotificationService`** — never call `$user->notify()` directly.

```php
use App\Services\NotificationService;

// Single user
$notificationService->send($user, 'Judul', 'Pesan...', 'success');

// Multiple users
$notificationService->sendToMany($users, 'Judul', 'Pesan...', 'warning');

// All users (broadcast)
$notificationService->broadcast('Judul', 'Pesan penting', 'info');

// With action button
$notificationService->send($user, 'Pesanan Baru', '#1024 masuk', 'info', '/orders/1024', 'Lihat Pesanan');
```

**Types**: `info` | `success` | `warning` | `danger`

**`GeneralNotification`** is the standard notification class — do NOT create new Notification classes unless the use case requires different channels (e.g. email, SMS).

### Frontend Usage

The `NotificationDropdown` component is wired into `AdminLayout` and reads `notifications.unread_count` from Inertia shared props (auto-injected by `HandleInertiaRequests`).

```tsx
// DO NOT import/use NotificationDropdown manually in pages.
// It's already rendered in AdminLayout.
```

**`useNotifications` hook** (used internally by `NotificationDropdown`):
```ts
import { useNotifications } from '@/hooks/useNotifications';
const { notifications, unreadCount, fetchRecent, markRead, markAllRead, remove } = useNotifications(initialCount);
```

### File Locations

```
app/
├── Notifications/GeneralNotification.php      # Standard notification class
├── Services/NotificationService.php           # Business logic (ALWAYS use this)
└── Http/Controllers/Admin/NotificationController.php  # JSON API endpoints

resources/js/
├── Components/Notifications/NotificationDropdown.tsx  # Bell dropdown UI
└── hooks/useNotifications.ts                          # Fetch + mutate logic
```

### Routes (auth-protected)

```
GET    /notifications/recent
POST   /notifications/mark-all-read
POST   /notifications/{id}/read
DELETE /notifications/{id}
```

---

## Response Style

- Provide code solutions that fit the existing project patterns.
- When creating new features, always suggest the Service layer implementation first.
- Provide code examples that use existing components and utilities.
- Follow the Model → Controller → Service architecture strictly.
