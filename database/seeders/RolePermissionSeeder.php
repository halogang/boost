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
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ===== CREATE PERMISSIONS =====
        $permissions = [
            // Dashboard
            'dashboard.view',

            // Orders
            'order.view',
            'order.update_status',

            // Products
            'product.view',
            'product.create',
            'product.update',
            'product.delete',

            // Stock
            'stock.view',
            'stock.adjust',

            // Reports
            'report.view',

            // Notifications
            'notification.view',

            // Settings - Admin only
            'user.manage',
            'role.manage',
            'system.manage',
            'audit.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ===== CREATE ROLES =====
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $ownerRole = Role::firstOrCreate(['name' => 'owner']);
        $staffRole = Role::firstOrCreate(['name' => 'staff']);
        $courierRole = Role::firstOrCreate(['name' => 'courier']);
        $customerRole = Role::firstOrCreate(['name' => 'customer']);

        // ===== ASSIGN PERMISSIONS TO ROLES =====

        // Admin: Full access
        $adminRole->syncPermissions($permissions);

        // Owner: View-only for most resources
        $ownerRole->syncPermissions([
            'dashboard.view',
            'order.view',
            'product.view',
            'stock.view',
            'report.view',
            'notification.view',
        ]);

        // Staff: Operations
        $staffRole->syncPermissions([
            'order.view',
            'order.update_status',
            'product.view',
            'stock.view',
            'notification.view',
        ]);

        // Courier: Orders and notifications only
        $courierRole->syncPermissions([
            'order.view',
            'order.update_status',
            'notification.view',
        ]);

        // Customer: Limited view
        $customerRole->syncPermissions([
            'dashboard.view',
            'order.view',
            'notification.view',
        ]);
    }
}
