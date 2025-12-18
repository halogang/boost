<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing menus
        Menu::query()->delete();

        // ===== MAIN MENUS =====
        $dashboard = Menu::create([
            'name' => 'Dashboard',
            'icon' => 'home',
            'route' => 'dashboard',
            'permission' => 'dashboard.view',
            'order' => 1,
            'active' => true,
        ]);

        $orders = Menu::create([
            'name' => 'Pesanan',
            'icon' => 'shopping-cart',
            'route' => 'orders.index',
            'permission' => 'order.view',
            'order' => 2,
            'active' => true,
        ]);

        $products = Menu::create([
            'name' => 'Produk',
            'icon' => 'box',
            'route' => 'products.index',
            'permission' => 'product.view',
            'order' => 3,
            'active' => true,
        ]);

        $stock = Menu::create([
            'name' => 'Stok',
            'icon' => 'database',
            'route' => 'stock.index',
            'permission' => 'stock.view',
            'order' => 4,
            'active' => true,
        ]);

        $reports = Menu::create([
            'name' => 'Laporan',
            'icon' => 'file-text',
            'route' => 'reports.index',
            'permission' => 'report.view',
            'order' => 5,
            'active' => true,
        ]);

        $notifications = Menu::create([
            'name' => 'Notifikasi',
            'icon' => 'bell',
            'route' => 'notifications.index',
            'permission' => 'notification.view',
            'order' => 6,
            'active' => true,
        ]);

        // ===== SETTINGS MENU (Always visible) =====
        $settings = Menu::create([
            'name' => 'Pengaturan',
            'icon' => 'settings',
            'route' => null, // Parent menu, no direct route
            'permission' => null, // NULL = visible for all
            'order' => 7,
            'active' => true,
        ]);

        // ===== SETTINGS SUBMENUS =====
        
        // Public Settings (visible for all)
        Menu::create([
            'name' => 'Profil',
            'icon' => 'user',
            'route' => 'settings.profile',
            'permission' => null, // Public
            'parent_id' => $settings->id,
            'order' => 1,
            'active' => true,
        ]);

        Menu::create([
            'name' => 'Keamanan',
            'icon' => 'lock',
            'route' => 'settings.security',
            'permission' => null, // Public
            'parent_id' => $settings->id,
            'order' => 2,
            'active' => true,
        ]);

        Menu::create([
            'name' => 'Preferensi',
            'icon' => 'sliders',
            'route' => 'settings.preferences',
            'permission' => null, // Public
            'parent_id' => $settings->id,
            'order' => 3,
            'active' => true,
        ]);

        // Admin Settings (permission-based)
        Menu::create([
            'name' => 'Kelola User',
            'icon' => 'users',
            'route' => 'users.index',
            'permission' => 'user.manage',
            'parent_id' => $settings->id,
            'order' => 4,
            'active' => true,
        ]);

        Menu::create([
            'name' => 'Role & Permission',
            'icon' => 'shield',
            'route' => 'roles.index',
            'permission' => 'role.manage',
            'parent_id' => $settings->id,
            'order' => 5,
            'active' => true,
        ]);

        Menu::create([
            'name' => 'Sistem',
            'icon' => 'server',
            'route' => 'system.index',
            'permission' => 'system.manage',
            'parent_id' => $settings->id,
            'order' => 6,
            'active' => true,
        ]);

        Menu::create([
            'name' => 'Audit Log',
            'icon' => 'eye',
            'route' => 'audit.index',
            'permission' => 'audit.view',
            'parent_id' => $settings->id,
            'order' => 7,
            'active' => true,
        ]);

        // Logout (always visible)
        Menu::create([
            'name' => 'Keluar',
            'icon' => 'log-out',
            'route' => 'logout',
            'permission' => null, // Public
            'parent_id' => $settings->id,
            'order' => 8,
            'active' => true,
        ]);
    }
}