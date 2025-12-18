# Quick Reference & Verification Guide

## Installation Summary (Completed ✓)

```bash
# 1. Install package
composer require spatie/laravel-permission

# 2. Publish assets
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

# 3. Run migrations
php artisan migrate

# 4. Seed roles and permissions
php artisan db:seed
```

---

## Verify Setup

Run these commands to verify everything is working:

```bash
php artisan tinker
```

```php
// 1. Verify permissions table
Spatie\Permission\Models\Permission::count(); // Should show 6

// 2. List all permissions
Spatie\Permission\Models\Permission::pluck('name');
// Output: ['manage master data', 'manage users', 'manage permissions', 'manage products', 'manage attendance', 'manage settings']

// 3. Verify roles table
Spatie\Permission\Models\Role::count(); // Should show 2

// 4. List all roles
Spatie\Permission\Models\Role::pluck('name');
// Output: ['admin', 'staff']

// 5. Check admin role permissions
$adminRole = Spatie\Permission\Models\Role::findByName('admin');
$adminRole->permissions()->pluck('name');
// Output: [all 6 permissions]

// 6. Check staff role permissions
$staffRole = Spatie\Permission\Models\Role::findByName('staff');
$staffRole->permissions()->pluck('name');
// Output: ['manage products', 'manage attendance']

// 7. Verify test user has admin role
$user = App\Models\User::first();
$user->getRoleNames(); // Output: ['admin']
$user->getPermissionNames(); // Output: [all 6 permissions]

// 8. Test role checking
$user->hasRole('admin'); // true
$user->hasRole('staff'); // false
$user->hasPermissionTo('manage users'); // true

// Exit tinker
exit
```

---

## Files Summary

| File | Purpose |
|------|---------|
| [app/Models/User.php](app/Models/User.php) | Added HasRoles trait |
| [database/seeders/RolePermissionSeeder.php](database/seeders/RolePermissionSeeder.php) | Creates all roles and permissions |
| [database/seeders/DatabaseSeeder.php](database/seeders/DatabaseSeeder.php) | Updated to call RolePermissionSeeder |
| [app/Providers/AppServiceProvider.php](app/Providers/AppServiceProvider.php) | Inertia shared props configuration |
| [routes/web.php](routes/web.php) | Admin and staff route groups with middleware |
| [config/permission.php](config/permission.php) | Spatie permission configuration (published) |
| [database/migrations/2025_12_18_*_create_permission_tables.php](database/migrations) | Permission tables migration (published) |

---

## Middleware Reference

### Available Middleware

| Middleware | Usage | Example |
|-----------|-------|---------|
| `role:{role}` | Require specific role | `'role:admin'` |
| `role:{role1}\|{role2}` | Multiple roles (OR) | `'role:admin\|staff'` |
| `permission:{perm}` | Require permission | `'permission:manage users'` |
| `permission:{perm1}\|{perm2}` | Multiple permissions (OR) | `'permission:manage users\|manage products'` |
| `role_or_permission:{role\|perm}` | Role or permission | `'role_or_permission:admin\|manage users'` |

### Example Route Protection

```php
// Only admins
Route::get('/admin', fn() => 'Admin Area')->middleware('role:admin');

// Only users with permission
Route::post('/users', fn() => 'Create User')->middleware('permission:manage users');

// Admin or anyone with permission
Route::get('/reports', fn() => 'Reports')->middleware('role_or_permission:admin|manage reports');

// Multiple middlewares combined
Route::get('/sensitive', fn() => 'Sensitive')
    ->middleware(['auth', 'role:admin', 'permission:manage settings']);
```

---

## Assigning Roles/Permissions

### In Tinker

```php
$user = App\Models\User::find(1);

// Assign single role
$user->assignRole('admin');

// Assign multiple roles
$user->assignRole(['admin', 'staff']);

// Sync roles (replaces existing)
$user->syncRoles('staff');

// Remove role
$user->removeRole('admin');

// Direct permission assignment
$user->givePermissionTo('manage users');

// Sync permissions
$user->syncPermissions(['manage users', 'manage products']);

// Check
$user->hasRole('admin');
$user->hasPermissionTo('manage users');
$user->getRoleNames();
$user->getPermissionNames();
```

### In Controller

```php
namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function promoteToAdmin(User $user)
    {
        $user->assignRole('admin');
        return redirect()->back()->with('success', 'User promoted to admin');
    }

    public function promoteToStaff(User $user)
    {
        $user->syncRoles('staff');
        return redirect()->back()->with('success', 'User role updated to staff');
    }
}
```

---

## React/TypeScript Usage

### In Components

```typescript
import { usePage } from '@inertiajs/react';

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

interface PageProps {
  auth: {
    user: User | null;
  };
}

export default function Dashboard() {
  const { auth } = usePage<PageProps>().props;
  const user = auth.user;

  if (!user) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      
      {user.roles.includes('admin') && (
        <section>
          <h2>Admin Panel</h2>
          <p>You have access to all admin features</p>
        </section>
      )}

      {user.permissions.includes('manage users') && (
        <section>
          <h2>User Management</h2>
          <a href="/admin/users">Manage Users</a>
        </section>
      )}

      <p>Your roles: {user.roles.join(', ')}</p>
      <p>Your permissions: {user.permissions.join(', ')}</p>
    </div>
  );
}
```

### Helper Hook Example

```typescript
// hooks/useAuth.ts
import { usePage } from '@inertiajs/react';

export function useAuth() {
  const { auth } = usePage().props;
  const user = auth.user;

  return {
    user,
    hasRole: (role: string) => user?.roles.includes(role) ?? false,
    hasPermission: (permission: string) => user?.permissions.includes(permission) ?? false,
    hasAnyRole: (roles: string[]) => roles.some(r => user?.roles.includes(r)) ?? false,
    hasAllPermissions: (permissions: string[]) => 
      permissions.every(p => user?.permissions.includes(p)) ?? false,
  };
}

// Usage in component
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedArea() {
  const { user, hasRole, hasPermission } = useAuth();

  if (!hasRole('admin')) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Content</div>;
}
```

---

## Current Test User

After seeding, you have:

| Attribute | Value |
|-----------|-------|
| Name | Test User |
| Email | test@example.com |
| Password | password |
| Role | admin |
| Permissions | All 6 permissions |

---

## Create Additional Users

```bash
php artisan tinker
```

```php
// Create staff user
$staffUser = App\Models\User::create([
    'name' => 'Staff Member',
    'email' => 'staff@example.com',
    'password' => bcrypt('password'),
]);
$staffUser->assignRole('staff');

// Verify
$staffUser->getRoleNames();
$staffUser->getPermissionNames();
```

---

## Troubleshooting

### Cache Issues
If changes don't take effect, clear cache:
```bash
php artisan cache:clear
php artisan config:clear
```

### Permission Denied in Middleware
- Ensure `auth` middleware is applied before role/permission middleware
- Check user has role/permission assigned: `$user->getRoleNames()`

### Inertia Props Not Available in React
- Verify `Inertia::share()` is in AppServiceProvider boot method
- Clear Vue/React cache: `npm run dev` with fresh build

### Database Issues
To reset and reseed:
```bash
php artisan migrate:refresh
php artisan db:seed
```

⚠️ **Warning**: This will DELETE all data. Only use in development.

---

## Performance Optimization

Enable caching for better performance in production:

```php
// config/permission.php
'enable_wildcard_permission' => true,
'cache' => [
    'expiration_time' => \DateInterval::createFromDateString('24 hours'),
    'key' => 'spatie.permission.cache',
    'store' => 'default',
],
```

---

## Security Best Practices

1. ✅ Always use `permission:` middleware for sensitive operations
2. ✅ Never trust `auth.user.roles` from React alone - always verify in backend
3. ✅ Use authorization policies for complex logic
4. ✅ Keep role assignments in seeder/migration for consistency
5. ✅ Audit role changes in production
6. ✅ Use database transactions when bulk assigning roles

---

## Resources

- **Package Docs**: https://spatie.be/docs/laravel-permission
- **Laravel Authorization**: https://laravel.com/docs/11.x/authorization
- **Inertia Docs**: https://inertiajs.com/

---

## Ready for Frontend Development

Once you're ready to build the React UI:

1. Use `auth.user?.roles` for conditional rendering
2. Fetch API endpoints protected by permission middleware
3. Create role-based layouts (AdminLayout, StaffLayout)
4. Add toast notifications for unauthorized access
5. Implement role switcher for testing (dev only)
