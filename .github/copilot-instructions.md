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
├── Http/
│   ├── Controllers/     # Thin controllers, HTTP only
│   ├── Requests/        # Validation classes
│   └── Policies/        # Authorization classes
├── Services/            # Business logic
└── Models/              # Database layer only
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
3. **NEVER** hardcode Indonesia Region names (always use `App\Models\IndonesiaRegion`).
4. **NEVER** modify existing seeders for data updates (always create new `Update...Seeder`).
5. **NEVER** create custom Notification logic or components unless explicitly requested.

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

**Features included**:
- Search functionality
- Pagination
- Per page selector
- Filters
- Server-side data handling
- Loading states

**DO NOT** create custom table components. Use the existing DataTable.

### 3. Utils & Helpers ✅

**Location**: `resources/js/lib/` and `resources/js/utils/`

**ALWAYS check existing utils** before creating new helper functions:

- `resources/js/lib/utils.ts` - General utilities (cn, formatCurrency, etc.)
- `resources/js/lib/page-utils.ts` - Page utilities (breadcrumbs, etc.)
- `resources/js/utils/theme.ts` - Theme utilities

```tsx
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { breadcrumbPresets } from '@/lib/page-utils';
```

**DO NOT** duplicate utility functions. Check existing utils first.

### 4. Component Structure

When creating new components:

1. **Check if similar component exists** in `resources/js/Components/`
2. **Use existing reusable components** (Toast, DataTable, etc.)
3. **Follow existing patterns** from similar pages
4. **Import from correct paths**:
   - Components: `@/Components/...`
   - Hooks: `@/hooks/...`
   - Utils: `@/lib/...` or `@/utils/...`
   - Types: `@/types/...`

### 5. Frontend File Structure

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
    ├── ManagementData/     ✅ Management Data pages
    └── Purchase/           ✅ Purchase transaction pages
```

**IMPORTANT: Folder Structure Rules**

- **Management Data Pages** → `resources/js/Pages/ManagementData/{Module}/`
  - Product, UOM, Supplier → `ManagementData/Pembelian/{Resource}/`
  - Other management data → `ManagementData/{Module}/{Resource}/`

- **Transaction Pages** → `resources/js/Pages/{Module}/`
  - Purchase Order, Receipt, Vendor Bill → `Purchase/{Resource}/`
  - Sales Order, Invoice → `Sales/{Resource}/`
  - Manufacturing Order → `Manufacturing/{Resource}/`

- **Controller Inertia Path** → Must match folder structure:
  ```php
  // Management Data (under Management Data menu)
  Inertia::render('ManagementData/Pembelian/Supplier/Index')
  Inertia::render('ManagementData/Pembelian/Product/Index')

  // Transaction (under main module menu)
  Inertia::render('Purchase/Order/Index')
  Inertia::render('Sales/Order/Index')
  ```

- **Menu Structure Mapping**:
  - **Management Data** → `ManagementData/` folder
  - **Main Module Menu** (Pembelian, Penjualan, etc.) → `{Module}/` folder

### 6. Best Practices

**DO:**
- ✅ Use existing Toast system for all notifications
- ✅ Use existing DataTable for all tables
- ✅ Check existing utils before creating new ones
- ✅ Follow existing component patterns
- ✅ Import from correct paths using `@/` alias

**DON'T:**
- ❌ Create custom notification components
- ❌ Create custom table components
- ❌ Duplicate existing utility functions
- ❌ Create components that already exist
- ❌ Use absolute paths instead of `@/` alias

### 7. Quick Reference

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

### IMPORTANT: Documentation File Location

**ALL AI-generated markdown documentation files MUST be placed in the `ai-generated/` folder.**

### Rules:

1. **Location**:
   - ✅ **DO**: Create all AI-generated `.md` files in `ai-generated/` folder
   - ❌ **DON'T**: Create documentation files in project root

2. **File Naming**:
   - Use descriptive, kebab-case names
   - Examples: `employee-relationship-guide.md`, `courier-salary-structure.md`

3. **When to Use `ai-generated/` folder**:
   - ✅ Documentation generated by AI assistant
   - ✅ Architecture guides and best practices
   - ✅ Database structure documentation
   - ✅ Refactoring summaries
   - ✅ Any `.md` file created by AI for reference/guidance

4. **When NOT to Use `ai-generated/` folder**:
   - ❌ `README.md` (project root)
   - ❌ `CHANGELOG.md` (project root)
   - ❌ Component-specific README (keep in component folder)

---

## Seeder Organization

### IMPORTANT: Struktur Seeder yang Terorganisir

Seeder diorganisir ke dalam folder berdasarkan kategori:

```
database/seeders/
│
├── Core/                           # ⚠️ WAJIB - Data dasar aplikasi
│   ├── UserSeeder.php
│   ├── RolePermissionSeeder.php
│   ├── ResCompanySeeder.php
│   ├── UomSeeder.php
│   ├── SettingsSeeder.php
│   ├── MenuSeeder.php
│   ├── MenuPositionSeeder.php
│   └── MenuRolePositionSeeder.php
│
├── MenuAccess/                     # Menu & Permissions per Modul
│   ├── Manufacturing/ManufacturingMenuPermissionSeeder.php
│   ├── Inventory/GalonTrackingMenuPermissionSeeder.php
│   ├── Purchase/ProductMenuPermissionSeeder.php
│   ├── HR/AttendanceMenuSeeder.php
│   ├── Fleet/FleetMenuSeeder.php
│   └── ...
│
├── MasterData/                     # Data master (Optional)
│   ├── ProductProductSeeder.php
│   ├── ResPartnerSeeder.php
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

# MasterData Seeders (Opsional)
php artisan db:seed --class=Database\Seeders\MasterData\ProductProductSeeder

# SampleData Seeders → JANGAN jalankan di Production
```

---

## Seeder Update Pattern - CRITICAL RULE

### ⚠️ IMPORTANT: NEVER Modify Existing Seeders for Updates

When you need to **UPDATE existing data**, **ALWAYS create a NEW seeder**. This follows the same pattern as migrations.

### Rules

1. **NEVER modify existing seeders** to add/update fields for existing data
2. **ALWAYS create new seeder** for updates (similar to migrations)
3. **Use descriptive names** - `Update{Resource}{Field}Seeder` or `Update{Description}Seeder`
4. **Place in root seeders folder** - `database/seeders/UpdateXxxSeeder.php`
5. **Make it idempotent** - Safe to run multiple times

### When to Create Update Seeder

**✅ DO create update seeder when:**
- Adding new field to existing records
- Updating values for existing records
- Fixing data inconsistencies
- Adding relationships to existing records

**❌ DON'T create update seeder when:**
- Creating new records (use regular seeder)
- Initial data seeding (use regular seeder)
- Sample/test data (use SampleData seeder)

### Template

```php
<?php

namespace Database\Seeders;

use App\Models\{Model};
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class Update{Description}Seeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->command->info('🔄 Updating {Description}...');

        $updates = [
            'identifier1' => 'new_value1',
            'identifier2' => 'new_value2',
        ];

        foreach ($updates as $identifier => $newValue) {
            $record = Model::where('unique_field', $identifier)->first();

            if ($record) {
                $record->update(['field' => $newValue]);
                $this->command->info("      ✅ Updated {$record->name}");
            } else {
                $this->command->warn("      ⚠️  Record {$identifier} not found, skipping...");
            }
        }

        $this->command->info('✅ Update completed!');
    }
}
```

### Best Practices

**DO:**
- ✅ Create separate seeder for each update operation
- ✅ Check if record exists before updating
- ✅ Log what was updated (use `$this->command->info()`)
- ✅ Handle missing records gracefully (warn, don't fail)
- ✅ Use unique identifiers (default_code, SKU, etc.) to find records

**DON'T:**
- ❌ Modify existing seeders to add update logic
- ❌ Mix create and update logic in same seeder
- ❌ Fail when record not found (warn instead)
- ❌ Hardcode IDs (use unique fields like default_code, SKU, etc.)

---

## Menu & Permission Management

### IMPORTANT: Use Seeders for Menu and Permission Management

**NEVER hardcode menus or permissions in controllers, policies, or other files.** Always use seeders.

### Adding New Menu with Permissions

**IMPORTANT**: Create a **separate seeder** for each new feature in `MenuAccess/{Module}/` folder. Don't modify `Core/RolePermissionSeeder` or `Core/MenuSeeder` directly.

#### Step-by-Step

**1. Create Seeder File**: `database/seeders/MenuAccess/{Module}/{Module}MenuPermissionSeeder.php`

```php
<?php

namespace Database\Seeders\MenuAccess\{Module};

use App\Constants\Permissions;
use App\Models\Menu;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class {Module}MenuPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Create Permissions (use constants!)
        $permissions = [
            Permissions::CREATE_PRODUCT,
            Permissions::READ_PRODUCT,
            Permissions::UPDATE_PRODUCT,
            Permissions::DELETE_PRODUCT,
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Get Roles
        $superAdminRole = Role::where('name', 'Super Admin')->first();
        $ownerRole = Role::where('name', 'Owner')->first();
        $managerRole = Role::where('name', 'Manager')->first();
        $adminRole = Role::where('name', 'Admin')->first();

        // 3. Assign Permissions (use givePermissionTo, NOT syncPermissions)
        if ($superAdminRole) {
            $superAdminRole->givePermissionTo($permissions);
        }
        if ($managerRole) {
            $managerRole->givePermissionTo($permissions);
        }

        // 4. Create Menu
        $menu = Menu::firstOrCreate(
            ['route' => 'products.index'],
            [
                'name' => 'Produk',
                'icon' => 'box',
                'permission' => Permissions::READ_PRODUCT,
                'parent_id' => null,
                'order' => 2,
                'active' => true,
            ]
        );

        // 5. Assign Menu to Roles
        $rolesToAssign = array_filter([
            $superAdminRole?->id,
            $ownerRole?->id,
            $managerRole?->id,
            $adminRole?->id,
        ]);
        if (!empty($rolesToAssign)) {
            $menu->roles()->sync($rolesToAssign);
        }

        $this->command->info('✅ Menu and permissions seeded!');
    }
}
```

**2. Create Policy**:
```php
use App\Constants\Permissions;

class ProductProductPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo(Permissions::READ_PRODUCT);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo(Permissions::CREATE_PRODUCT);
    }

    public function update(User $user, ProductProduct $product): bool
    {
        return $user->hasPermissionTo(Permissions::UPDATE_PRODUCT);
    }

    public function delete(User $user, ProductProduct $product): bool
    {
        return $user->hasPermissionTo(Permissions::DELETE_PRODUCT);
    }
}
```

**3. Run Seeder**:
```bash
php artisan db:seed --class=Database\Seeders\MenuAccess\{Module}\{Module}MenuPermissionSeeder
php artisan optimize:clear
php artisan permission:cache-reset
```

### Permission Naming Convention

**Format**: `{action} {resource}` (lowercase, singular resource)

- ✅ `read product`, `create employees`, `update inventory`
- ❌ `view product` (use 'read'), `product.read` (action first)

### Menu Structure Understanding

- **Main Menu "Pembelian"** (parent_id = null): Transaction menu (RFQ & PO, Receipt, Vendor Bill)
- **Submenu "Pembelian"** under "Management Data" (parent_id != null): Management data (UOM, Produk, Vendor/Supplier)
- Management data menu: `Menu::where('name', 'Pembelian')->whereNotNull('parent_id')->first()`
- Transaction menu: `Menu::where('name', 'Pembelian')->whereNull('parent_id')->first()`

### Icon Reference (lucide-react)

- `home` - Dashboard/Home
- `box` - Products/Inventory
- `users` - Users/Employees
- `shopping-cart` - Purchasing
- `truck` - Distribution/Delivery
- `clock` - Attendance/Time
- `settings` - Settings
- `database` - Management Data
- `shield` - Permissions/Roles
- `dollar-sign` - Finance
- `file-text` - Reports/Documents

### Role Assignment Strategy

- **Super Admin**: Full access to everything
- **Owner**: Read access to all, limited write
- **Manager**: Full access to operational modules
- **Admin**: Full access, usually no delete
- **Spv/Staff**: Limited read/write access

**IMPORTANT**: Always use `givePermissionTo()` (adds permissions), NOT `syncPermissions()` (replaces all).

### Key Points

- ✅ Use `Permission::firstOrCreate()` - idempotent
- ✅ Use `Menu::firstOrCreate()` - idempotent
- ✅ Use `givePermissionTo()` - ADDS permissions
- ✅ Use `roles()->sync()` - syncs menu roles
- ✅ Always reset permission cache at start

### Checklist for New Menu

- [ ] Create seeder: `MenuAccess/{Module}/{Module}MenuPermissionSeeder.php`
- [ ] Use `App\Constants\Permissions` constants
- [ ] Create permissions using `Permission::firstOrCreate()`
- [ ] Assign permissions using `givePermissionTo()`
- [ ] Create menu using `Menu::firstOrCreate()`
- [ ] Assign menu to roles using `roles()->sync()`
- [ ] Create/update Policy
- [ ] Update Controller with `authorize()` checks
- [ ] Add route to `web.php`
- [ ] Run seeder and clear cache

---

## Permission Constants - CRITICAL RULE

### ⚠️ NEVER Hardcode Permission Strings

**ALWAYS use `App\Constants\Permissions` constants instead of hardcoded permission strings.**

**File**: `app/Constants/Permissions.php`

### Rules

1. **NEVER** hardcode `'read product'` or `'create user'`
2. **ALWAYS** use `Permissions::READ_PRODUCT` or `Permissions::CREATE_USER`
3. **If permission doesn't exist**, add it to `Permissions.php` first
4. **Use constants in ALL places**: Controllers, Policies, Seeders, Menus

### Usage Examples

**In Seeders:**
```php
use App\Constants\Permissions;

// ✅ CORRECT
$permissions = [Permissions::READ_PRODUCT, Permissions::CREATE_PRODUCT];

// ❌ WRONG
$permissions = ['read product', 'create product'];
```

**In Policies:**
```php
use App\Constants\Permissions;

// ✅ CORRECT
return $user->hasPermissionTo(Permissions::READ_PRODUCT);

// ❌ WRONG
return $user->hasPermissionTo('read product');
```

**In Menu Seeders:**
```php
use App\Constants\Permissions;

// ✅ CORRECT
'permission' => Permissions::READ_PRODUCT,

// ❌ WRONG
'permission' => 'read product',
```

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

## Indonesia Region (Wilayah) Usage - CRITICAL RULE

### ⚠️ ALWAYS Use IndonesiaRegion Model for Region Data

**NEVER hardcode region data or create custom region tables. ALWAYS use `App\Models\IndonesiaRegion`.**

**Model**: `app/Models/IndonesiaRegion.php`  
**Table**: `indonesia_regions`

### Rules

1. **NEVER hardcode region names** like `'Jawa Tengah'` or `'Cilacap'`
2. **ALWAYS use IndonesiaRegion model** to query regions
3. **ALWAYS use cached methods** for performance
4. **NEVER create duplicate region tables** - use `indonesia_regions` only

### Available Methods (Cached)

```php
use App\Models\IndonesiaRegion;

// Get all provinces (cached)
IndonesiaRegion::getProvinces()

// Get regencies by province ID (cached)
IndonesiaRegion::getRegenciesByProvince($provinceId)

// Get districts by regency ID (cached)
IndonesiaRegion::getDistrictsByRegency($regencyId)

// Get villages by district ID (cached)
IndonesiaRegion::getVillagesByDistrict($districtId)

// Find by code (cached)
IndonesiaRegion::findByCode('3301')

// Clear all caches
IndonesiaRegion::clearCache()
```

### Query Scopes

```php
IndonesiaRegion::provinces()->active()->get()
IndonesiaRegion::regencies()->active()->get()
IndonesiaRegion::districts()->active()->get()
IndonesiaRegion::villages()->active()->get()
IndonesiaRegion::byParent($parentId)->get()
IndonesiaRegion::search('Cilacap')->get()
```

### Relationships

```php
$region->parent        // Get parent region
$region->children      // Get child regions
$region->full_path     // "Kelurahan, Kecamatan, Kabupaten, Provinsi"
```

### Common Patterns

**Model Relationships:**
```php
use App\Models\IndonesiaRegion;

class Customer extends Model
{
    public function province()
    {
        return $this->belongsTo(IndonesiaRegion::class, 'province_id')
            ->where('level', 'province');
    }

    public function regency()
    {
        return $this->belongsTo(IndonesiaRegion::class, 'regency_id')
            ->where('level', 'regency');
    }

    public function district()
    {
        return $this->belongsTo(IndonesiaRegion::class, 'district_id')
            ->where('level', 'district');
    }

    public function village()
    {
        return $this->belongsTo(IndonesiaRegion::class, 'village_id')
            ->where('level', 'village');
    }
}
```

**Cascading Dropdowns:**
```php
Route::get('/api/regencies/{provinceId}', fn ($provinceId) =>
    IndonesiaRegion::getRegenciesByProvince($provinceId));
Route::get('/api/districts/{regencyId}', fn ($regencyId) =>
    IndonesiaRegion::getDistrictsByRegency($regencyId));
Route::get('/api/villages/{districtId}', fn ($districtId) =>
    IndonesiaRegion::getVillagesByDistrict($districtId));
```

**Performance:**
```php
// ✅ CORRECT - Cached, efficient
$provinces = IndonesiaRegion::getProvinces();

// ✅ CORRECT - Eager load relationships
$customers = Customer::with(['province', 'regency', 'district', 'village'])->get();

// ❌ WRONG - Not cached, inefficient
$provinces = IndonesiaRegion::where('level', 'province')->get();
```

---

## Notification System - OPTIONAL Feature

### ⚠️ Notifications are OPTIONAL, NOT Required

**IMPORTANT**: The notification system is available but **MUST NOT be automatically added** to new features unless explicitly requested by the user.

### When to Use

**✅ DO create notifications when:**
- User explicitly requests: "tambahkan notifikasi untuk X"
- User explicitly requests: "kirim email/WhatsApp ketika Y"
- Business requirement explicitly states notification is needed

**❌ DON'T create notifications when:**
- Creating a new CRUD feature (unless requested)
- Adding a new form or page (unless requested)
- User doesn't mention notifications in their request

### Rules for AI Assistant

- ✅ Create Model, Service, Controller, Policy, Request classes for features
- ❌ **DO NOT** add notification code unless user explicitly asks
- ❌ **DO NOT** suggest notifications unless user mentions them
- When requested, add notification calls in **Service** classes, NOT Controllers

### Notification Location

**Frontend**: `resources/js/services/notifications/`
- `NotificationService.ts` - Main orchestrator
- `channels/` - Email, WhatsApp, In-App channels
- `templates/` - Reusable notification templates

### Channels

- `NotificationChannel.EMAIL` - Email notifications
- `NotificationChannel.WHATSAPP` - WhatsApp messages
- `NotificationChannel.IN_APP` - In-app notifications
- `NotificationChannel.PUSH` - Push notifications

---

## Change Notes & Deployment Documentation

### ⚠️ Always Create Change Notes for Production Deployments

When making changes that require migrations, seeders, or deployment steps, **ALWAYS create a change note** in `changenotes/`.

### When to Create Change Notes

**✅ DO create when:**
- Adding new database migrations
- Creating new seeders (especially MenuAccess seeders)
- Refactoring code structure
- Adding features requiring database changes
- Changing routes, namespaces, or permissions

**❌ DON'T create for:**
- Simple bug fixes (unless they require migrations)
- UI-only changes
- Documentation updates

### File Naming

**Format**: `{number}-{short-description}.md` (3-digit numbers, kebab-case)

- ✅ `001-refactor-management-data-structure.md`
- ✅ `002-add-asset-management-module.md`
- ❌ `1-refactor.md` (missing leading zeros)
- ❌ `002-refactor.md` (too vague)

### Template

```markdown
# Change Note #{number}: {Title}

**Date**: YYYY-MM-DD
**Type**: Feature/Refactoring/Bugfix/Migration
**Impact**: Low/Medium/High
**Breaking Changes**: Yes/No

## Summary
Brief description of what changed

## Changes Made
### Controllers / Models / Migrations / Seeders / Frontend / Routes
- List changes per category

## Migration Steps

### 1. Pull Latest Code
```bash
git pull origin main
```

### 2. Install Dependencies
```bash
composer install --no-dev --optimize-autoloader
npm install && npm run build
```

### 3. Clear Caches
```bash
php artisan optimize:clear
```

### 4. Run Migrations
```bash
php artisan migrate --force
```

### 5. Run Seeders
```bash
php artisan db:seed --class=Database\Seeders\...
```

### 6. Clear Permission Cache
```bash
php artisan permission:cache-reset
```

### 7. Optimize
```bash
php artisan optimize
```

## Rollback Plan
Rollback steps if issues occur

## Testing Checklist
- [ ] Test item 1
- [ ] Test item 2
```

### Rules

- **Always check existing changenotes** to get the next sequential number
- **Be thorough** - include ALL deployment steps
- **Include rollback plan** for production safety
- **List all migrations and seeders** that need to be run

---

## Response Style

- Provide code solutions that fit the existing project patterns.
- When creating new features, always suggest the Service layer implementation first.
- Provide code examples that use existing components and utilities.
- Follow the Model → Controller → Service architecture strictly.
