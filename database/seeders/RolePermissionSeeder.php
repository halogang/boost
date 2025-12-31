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

            // Purchasing / Pembelian
            'create purchasing',
            'read purchasing',
            'update purchasing',
            'delete purchasing',
            'create suppliers',
            'read suppliers',
            'update suppliers',
            'delete suppliers',
            
            // UOM (Unit of Measure) / Satuan Ukur
            'create uom',
            'read uom',
            'update uom',
            'delete uom',
            
            // Product (Product Product) / Produk
            'create product',
            'read product',
            'update product',
            'delete product',

            // Inventory / Inventori
            'create inventory',
            'read inventory',
            'update inventory',
            'delete inventory',
            'create stock',
            'read stock',
            'update stock',
            'delete stock',

            // Manufacturing / Produksi
            'create manufacturing',
            'read manufacturing',
            'update manufacturing',
            'delete manufacturing',

            // Distribution / Distribusi
            'create distribution',
            'read distribution',
            'update distribution',
            'delete distribution',
            'read routes',
            'update routes',

            // Sales / Penjualan
            'create orders',
            'read orders',
            'update orders',
            'delete orders',
            'create sales',
            'read sales',
            'update sales',
            'delete sales',

            // HR & Attendance / HR & Kehadiran
            'create employees',
            'read employees',
            'update employees',
            'delete employees',
            'create attendance',
            'read attendance',
            'update attendance',
            'delete attendance',
            'create shifts',
            'read shifts',
            'update shifts',
            'delete shifts',

            // Finance / Keuangan
            'create finance',
            'read finance',
            'update finance',
            'delete finance',
            'read cashflow',
            'read income',
            'read expenses',
            'read profit',

            // CRM
            'create customers',
            'read customers',
            'update customers',
            'delete customers',
            'read crm',
            'update crm',

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

            // Menus / Kelola Menu
            'read menus',
            'create menus',
            'update menus',
            'delete menus',

            // Menu Role Positions / Menu per Role
            'read menu-role-positions',
            'update menu-role-positions',

            // Preferences / Preferensi
            'read preferences',
            'update preferences',

            // Permissions
            'read permissions'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ===== CREATE ROLES =====
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin']);
        $ownerRole = Role::firstOrCreate(['name' => 'Owner']);
        $managerRole = Role::firstOrCreate(['name' => 'Manager']);
        $spvRole = Role::firstOrCreate(['name' => 'Spv']);
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $staffPengantaranRole = Role::firstOrCreate(['name' => 'Staff Pengantaran']);
        $staffProduksiRole = Role::firstOrCreate(['name' => 'Staff Produksi']);

        // ===== ASSIGN PERMISSIONS TO ROLES =====

        // Super Admin: Full access to everything
        $superAdminRole->syncPermissions($permissions);

        // Owner: Full read access to all modules, limited write
        $ownerRole->syncPermissions([
            'read dashboard',
            'read purchasing',
            'read suppliers',
            'read inventory',
            'read stock',
            'read manufacturing',
            'read distribution',
            'read routes',
            'read orders',
            'read sales',
            'read employees',
            'read attendance',
            'read shifts',
            'read finance',
            'read cashflow',
            'read income',
            'read expenses',
            'read profit',
            'read customers',
            'read crm',
            'read reports',
            'read notifications',
            'read settings',
            'update settings',
            'read preferences',
            'update preferences',
            'read uom',
            'read product',
        ]);

        // Manager: Full access to branch operations (except system settings)
        $managerRole->syncPermissions([
            'read dashboard',
            'create purchasing',
            'read purchasing',
            'update purchasing',
            'create suppliers',
            'read suppliers',
            'update suppliers',
            'create inventory',
            'read inventory',
            'update inventory',
            'create stock',
            'read stock',
            'update stock',
            'read manufacturing',
            'create distribution',
            'read distribution',
            'update distribution',
            'read routes',
            'update routes',
            'create orders',
            'read orders',
            'update orders',
            'create sales',
            'read sales',
            'update sales',
            'create employees',
            'read employees',
            'update employees',
            'create attendance',
            'read attendance',
            'update attendance',
            'create shifts',
            'read shifts',
            'update shifts',
            'read finance',
            'read cashflow',
            'read income',
            'read expenses',
            'read profit',
            'create customers',
            'read customers',
            'update customers',
            'read crm',
            'update crm',
            'read reports',
            'create reports',
            'read notifications',
            'read settings',
            'update settings',
            'read preferences',
            'update preferences',
            'create uom',
            'read uom',
            'update uom',
            'create product',
            'read product',
            'update product',
        ]);

        // Spv: Supervisor access with oversight capabilities
        $spvRole->syncPermissions([
            'read dashboard',
            'read purchasing',
            'read suppliers',
            'read inventory',
            'read stock',
            'update stock',
            'read manufacturing',
            'update manufacturing',
            'read distribution',
            'read routes',
            'read orders',
            'update orders',
            'read sales',
            'read employees',
            'read attendance',
            'update attendance',
            'read shifts',
            'read finance',
            'read cashflow',
            'read income',
            'read expenses',
            'read profit',
            'read customers',
            'read crm',
            'read reports',
            'read notifications',
            'read settings',
            'read preferences',
            'read uom',
            'read product',
        ]);

        // Admin: Full access to production and inventory
        $adminRole->syncPermissions([
            'read dashboard',
            'read purchasing',
            'read suppliers',
            'create inventory',
            'read inventory',
            'update inventory',
            'create stock',
            'read stock',
            'update stock',
            'create manufacturing',
            'read manufacturing',
            'update manufacturing',
            'read distribution',
            'read orders',
            'read employees',
            'read attendance',
            'read shifts',
            'read finance',
            'read notifications',
            'read settings',
            'read preferences',
            'create uom',
            'read uom',
            'update uom',
            'read product',
        ]);

        // Staff Pengantaran: Access to distribution and orders
        $staffPengantaranRole->syncPermissions([
            'read dashboard',
            'read distribution',
            'read routes',
            'update routes',
            'read orders',
            'update orders',
            'read customers',
            'read notifications',
            'read settings',
        ]);

        // Staff Produksi: Limited access to production operations
        $staffProduksiRole->syncPermissions([
            'read dashboard',
            'read inventory',
            'read stock',
            'update stock',
            'create manufacturing',
            'read manufacturing',
            'update manufacturing',
            'read orders',
            'read attendance',
            'read notifications',
            'read settings',
            'read preferences',
        ]);
    }
}
