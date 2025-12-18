<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()['cache']->forget('spatie.permission.cache');

        // Create CRUD permissions for each resource
        $permissions = [
            // Master Data
            'create master data',
            'read master data',
            'update master data',
            'delete master data',
            
            // Users
            'create users',
            'read users',
            'update users',
            'delete users',
            
            // Permissions
            'create permissions',
            'read permissions',
            'update permissions',
            'delete permissions',
            
            // Products
            'create products',
            'read products',
            'update products',
            'delete products',
            
            // Attendance
            'create attendance',
            'read attendance',
            'update attendance',
            'delete attendance',
            
            // Settings
            'create settings',
            'read settings',
            'update settings',
            'delete settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $staffRole = Role::firstOrCreate(['name' => 'staff']);

        // Assign all permissions to admin
        $adminRole->syncPermissions(Permission::all());

        // Assign limited CRUD permissions to staff
        $staffPermissions = [
            'read products',
            'create products',
            'update products',
            'read attendance',
            'create attendance',
            'update attendance',
        ];
        $staffRole->syncPermissions($staffPermissions);
    }
}
