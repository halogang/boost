<?php

namespace Database\Seeders\Core;

use App\Constants\Permissions;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create all core permissions with module categorization
        $permissionsWithModules = Permissions::allWithModules();

        foreach ($permissionsWithModules as $item) {
            $permission = Permission::firstOrCreate(['name' => $item['name']]);
            $permission->update(['module' => $item['module']]);
        }

        // Extract all permission names
        $permissions = array_column($permissionsWithModules, 'name');

        // Create roles
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin']);
        Role::firstOrCreate(['name' => 'Owner']);
        Role::firstOrCreate(['name' => 'Manager']);
        Role::firstOrCreate(['name' => 'Admin']);

        // Super Admin gets all permissions — other roles are handled by Authorization seeders
        $superAdminRole->syncPermissions($permissions);

        $this->command->info('✅ Core roles and permissions seeded!');
    }
}
