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
            // Dashboard
            'read dashboard',
            
            // Orders
            'read orders',
            
            // Products
            'read products',
            'create products',
            'update products',
            'delete products',
            
            // Customers
            'read customers',
            'create customers',
            'update customers',
            'delete customers',
            
            // Users
            'read users',
            'create users',
            'update users',
            'delete users',
            
            // Permission
            'read permission',
            'create permission',
            'update permission',
            'delete permission',
            
            // Master Data
            'read master data',
            'create master data',
            'update master data',
            'delete master data',
            
            // Settings
            'read settings',
            'create settings',
            'update settings',
            'delete settings',
            
            // Attendance
            'read attendance',
            'create attendance',
            'update attendance',
            'delete attendance',
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
            'read dashboard',
            'read products',
            'create products',
            'update products',
            'read attendance',
            'create attendance',
            'update attendance',
            'read customers',
            'create customers',
            'update customers',
        ];
        $staffRole->syncPermissions($staffPermissions);
    }
}
