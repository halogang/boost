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

        // Create all core permissions
        $permissions = Permissions::all();

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin']);
        $ownerRole = Role::firstOrCreate(['name' => 'Owner']);
        $managerRole = Role::firstOrCreate(['name' => 'Manager']);
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);

        // Super Admin: Full access to everything
        $superAdminRole->syncPermissions($permissions);

        // Owner: Read access to all, limited write
        $ownerRole->syncPermissions([
            Permissions::READ_DASHBOARD,
            Permissions::READ_USERS,
            Permissions::READ_ROLES,
            Permissions::READ_SETTINGS,
            Permissions::UPDATE_SETTINGS,
            Permissions::READ_MENUS,
            Permissions::READ_MENU_ROLE_POSITIONS,
            Permissions::READ_PERMISSIONS,
            Permissions::READ_PREFERENCES,
            Permissions::UPDATE_PREFERENCES,
        ]);

        // Manager: Full access to operational, no system config
        $managerRole->syncPermissions([
            Permissions::READ_DASHBOARD,
            Permissions::CREATE_USERS,
            Permissions::READ_USERS,
            Permissions::UPDATE_USERS,
            Permissions::READ_ROLES,
            Permissions::READ_SETTINGS,
            Permissions::UPDATE_SETTINGS,
            Permissions::READ_MENUS,
            Permissions::READ_MENU_ROLE_POSITIONS,
            Permissions::READ_PERMISSIONS,
            Permissions::READ_PREFERENCES,
            Permissions::UPDATE_PREFERENCES,
        ]);

        // Admin: Read/write, no delete, no system config
        $adminRole->syncPermissions([
            Permissions::READ_DASHBOARD,
            Permissions::READ_USERS,
            Permissions::READ_SETTINGS,
            Permissions::READ_PREFERENCES,
            Permissions::UPDATE_PREFERENCES,
        ]);

        $this->command->info('✅ Core roles and permissions seeded!');
    }
}
