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

**For Laravel flash messages**, use `useFlashToast`:
```tsx
import { useFlashToast } from '@/hooks/useFlashToast';

function MyComponent() {
  useFlashToast(); // Auto-shows toast from Laravel flash messages
  return <div>...</div>;
}
```

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

// Flash Messages
import { useFlashToast } from '@/hooks/useFlashToast';
useFlashToast();
```

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
├── MenuAccess/                     # Menu & Permissions per Modul
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

### Deployment Guidelines

```bash
# Core Seeders (WAJIB untuk Production)
php artisan db:seed

# MenuAccess Seeders (Sesuai modul aktif)
php artisan db:seed --class=Database\Seeders\MenuAccess\{Module}\{Module}MenuPermissionSeeder

# SampleData Seeders → JANGAN jalankan di Production
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

## Response Style

- Provide code solutions that fit the existing project patterns.
- When creating new features, always suggest the Service layer implementation first.
- Provide code examples that use existing components and utilities.
- Follow the Model → Controller → Service architecture strictly.
