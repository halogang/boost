<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Main Menus (MENU UTAMA)
        Menu::create([
            'name' => 'Dashboard',
            'icon' => 'home',
            'route' => '/admin/dashboard',
            'permission' => 'read dashboard',
            'order' => 1,
            'active' => true,
        ]);

        Menu::create([
            'name' => 'Pesanan',
            'icon' => 'shopping-cart',
            'route' => '/orders',
            'permission' => 'read orders',
            'order' => 2,
            'active' => true,
        ]);

        Menu::create([
            'name' => 'Produk',
            'icon' => 'box',
            'route' => '/products',
            'permission' => 'read products',
            'order' => 3,
            'active' => true,
        ]);

        Menu::create([
            'name' => 'Pelanggan',
            'icon' => 'users',
            'route' => '/customers',
            'permission' => 'read customers',
            'order' => 4,
            'active' => true,
        ]);

        // ADMIN section
        $adminMenu = Menu::create([
            'name' => 'Admin Panel',
            'icon' => 'settings',
            'route' => null, // Parent doesn't have route
            'permission' => null,
            'order' => 5,
            'active' => true,
        ]);

        // Submenus for Admin Panel
        Menu::create([
            'name' => 'Kelola User',
            'icon' => 'users',
            'route' => '/admin/users',
            'permission' => 'read users',
            'parent_id' => $adminMenu->id,
            'order' => 1,
            'active' => true,
        ]);

        Menu::create([
            'name' => 'Permission',
            'icon' => 'lock',
            'route' => '/admin/permission',
            'permission' => 'read permission',
            'parent_id' => $adminMenu->id,
            'order' => 2,
            'active' => true,
        ]);

        Menu::create([
            'name' => 'Master Data',
            'icon' => 'database',
            'route' => '/admin/master-data',
            'permission' => 'read master data',
            'parent_id' => $adminMenu->id,
            'order' => 3,
            'active' => true,
        ]);

        Menu::create([
            'name' => 'Pengaturan',
            'icon' => 'sliders',
            'route' => '/admin/settings',
            'permission' => 'read settings',
            'parent_id' => $adminMenu->id,
            'order' => 4,
            'active' => true,
        ]);
    }
}
