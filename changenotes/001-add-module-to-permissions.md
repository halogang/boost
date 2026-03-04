# 001 - Add Module Categorization to Permissions

**Date**: 2026-03-04

## Changes

### Migration
- `2026_03_04_100000_add_module_to_permissions_table.php` — adds nullable `module` column to `permissions` table

### Backend
- **`app/Constants/Permissions.php`** — added module constants (`MODULE_DASHBOARD`, `MODULE_USER_MANAGEMENT`, `MODULE_SYSTEM`), `allWithModules()` method, and `moduleMap()` method
- **`app/Services/PermissionService.php`** — updated `getPermissionsPageData()` to group by `module` column; added `syncPermissionModules()` method
- **`database/seeders/Core/RolePermissionSeeder.php`** — now creates permissions with module from `allWithModules()`
- **`database/seeders/Fix/SyncPermissionModulesSeeder.php`** — new seeder to sync module column for existing data

### Frontend
- **`Components/Permissions/PermissionCheckbox.tsx`** — redesigned to compact inline checkbox (no card/border)
- **`Components/Permissions/PermissionGroup.tsx`** — now groups by module name with counter badge
- **`Components/Permissions/RoleCard.tsx`** — compact layout, dark mode support
- **`Pages/Admin/Permissions/Index.tsx`** — updated interfaces for module grouping

## Deployment Steps

```bash
# 1. Run migration
php artisan migrate

# 2. Sync module data for existing permissions
php artisan db:seed --class="Database\Seeders\Fix\SyncPermissionModulesSeeder"
```

## Adding New Permissions with Module

When adding new permissions, add them to `Permissions::allWithModules()`:

```php
// In app/Constants/Permissions.php
public const MODULE_PENJUALAN = 'Penjualan';

public const CREATE_SALES_ORDER = 'create sales order';
public const READ_SALES_ORDER = 'read sales order';

// In allWithModules():
['name' => self::CREATE_SALES_ORDER, 'module' => self::MODULE_PENJUALAN],
['name' => self::READ_SALES_ORDER, 'module' => self::MODULE_PENJUALAN],
```

Then create a `MenuAccess/{Module}/{Module}MenuPermissionSeeder.php` and run the sync seeder.
