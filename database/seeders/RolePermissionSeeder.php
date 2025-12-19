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
            'read dashboard',

            // Orders / Pesanan
            'create orders',
            'read orders',
            'update orders',
            'delete orders',

            // Products / Produk
            'create products',
            'read products',
            'update products',
            'delete products',

            // Stock / Stok
            'create stock',
            'read stock',
            'update stock',
            'delete stock',

            // Customers / Pelanggan
            'create customers',
            'read customers',
            'update customers',
            'delete customers',

            // Reports / Laporan
            'create reports',
            'read reports',
            'update reports',
            'delete reports',

            // Notifications / Notifikasi
            'read notifications',
            'delete notifications',

            // Users / Pengguna
            'create users',
            'read users',
            'update users',
            'delete users',

            // Roles / Role & Permission
            'create roles',
            'read roles',
            'update roles',
            'delete roles',

            // Settings / Pengaturan
            'read settings',
            'update settings',

            // Audit / Audit Log

            'read permissions'
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

        // Owner: View-only
        $ownerRole->syncPermissions([
            'read dashboard',
            'read orders',
            'read products',
            'read stock',
            'read customers',
            'read reports',
            'read notifications',
            'read settings',
        ]);

        // Staff: Operations (Orders, Products, Stock)
        $staffRole->syncPermissions([
            'create orders',
            'read orders',
            'update orders',
            'create products',
            'read products',
            'update products',
            'delete products',
            'create stock',
            'read stock',
            'update stock',
            'read customers',
            'update customers',
            'read notifications',
            'read settings',
        ]);

        // Courier: Orders and notifications
        $courierRole->syncPermissions([
            'read orders',
            'update orders',
            'read notifications',
            'read settings',
        ]);

        // Customer: Limited view
        $customerRole->syncPermissions([
            'read dashboard',
            'read orders',
            'read notifications',
            'read settings',
        ]);
    }
}
