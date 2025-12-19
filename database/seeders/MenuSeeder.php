<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

/**
 * MenuSeeder - Seed default menus dengan role assignment
 * 
 * CARA KERJA:
 * 1. Menu dibuat dengan create() - simpan ke variable untuk attach roles
 * 2. Gunakan roles()->attach() untuk assign role ke menu
 * 3. Jika menu punya parent_id, itu adalah submenu
 * 4. Permission dicek di MenuController->getMenus()
 * 
 * FORMAT:
 * - name: Nama menu yang tampil di sidebar
 * - icon: Icon dari lucide-react (home, users, box, etc)
 * - route: Route name Laravel (products.index, users.index, etc)
 * - permission: Format 'resource.action' (product.view, user.manage)
 * - parent_id: ID menu parent (null = main menu)
 * - order: Urutan tampil (ascending)
 * - active: Boolean untuk show/hide menu
 * 
 * ROLE ASSIGNMENT:
 * - Admin only: ->roles()->attach([$adminRole->id])
 * - Staff only: ->roles()->attach([$staffRole->id])
 * - Both: ->roles()->attach([$adminRole->id, $staffRole->id])
 * 
 * Lihat MENU_MANAGEMENT.md untuk cara menambah menu manual tanpa seeder
 */
class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing menus
        Menu::query()->delete();

        // Get roles dari database
        $adminRole = Role::where('name', 'admin')->first();
        $staffRole = Role::where('name', 'staff')->first();

        // ===== MAIN MENUS =====
        // Menu utama tanpa parent_id akan tampil sebagai top-level menu
        
        // Dashboard - Visible untuk Admin & Staff
        $dashboard = Menu::create([
            'name' => 'Dashboard',
            'icon' => 'home',
            'route' => 'dashboard',
            'permission' => 'read dashboard',
            'order' => 1,
            'active' => true,
        ]);
        $dashboard->roles()->attach([$adminRole->id, $staffRole->id]);

        // Pesanan - Visible untuk Admin & Staff
        $orders = Menu::create([
            'name' => 'Pesanan',
            'icon' => 'shopping-cart',
            'route' => 'orders.index',
            'permission' => 'read orders',
            'order' => 2,
            'active' => false,
        ]);
        $orders->roles()->attach([$adminRole->id, $staffRole->id]);

        // Produk - Visible untuk Admin & Staff
        $products = Menu::create([
            'name' => 'Produk',
            'icon' => 'box',
            'route' => 'products.index',
            'permission' => 'read products',
            'order' => 3,
            'active' => false,
        ]);
        $products->roles()->attach([$adminRole->id, $staffRole->id]);

        $stock = Menu::create([
            'name' => 'Stok',
            'icon' => 'database',
            'route' => 'stock.index',
            'permission' => 'read stock',
            'order' => 4,
            'active' => false,
        ]);
        $stock->roles()->attach([$adminRole->id]);

        $reports = Menu::create([
            'name' => 'Laporan',
            'icon' => 'file-text',
            'route' => 'reports.index',
            'permission' => 'read reports',
            'order' => 5,
            'active' => false,
        ]);
        $reports->roles()->attach([$adminRole->id]);

        $notifications = Menu::create([
            'name' => 'Notifikasi',
            'icon' => 'bell',
            'route' => 'notifications.index',
            'permission' => 'read notifications',
            'order' => 6,
            'active' => true,
        ]);
        $notifications->roles()->attach([$adminRole->id, $staffRole->id]);

        // ===== PARENT MENU: PENGATURAN =====
        // Parent menu (route = null, permission = null)
        // Akan punya children/submenus di bawahnya
        $settings = Menu::create([
            'name' => 'Pengaturan',
            'icon' => 'settings',
            'route' => null, // Tidak ada route karena parent
            'permission' => null, // NULL = semua role bisa lihat parent
            'order' => 7,
            'active' => true,
        ]);
        $settings->roles()->attach([$adminRole->id, $staffRole->id]);

        // ===== SUBMENUS (parent_id = $settings->id) =====
        
        // --- Public Submenus (Semua role bisa akses) ---
        
        // Profil - Public untuk semua user
        $profile = Menu::create([
            'name' => 'Profil',
            'icon' => 'user',
            'route' => 'settings.profile',
            'permission' => null, // Public
            'parent_id' => $settings->id,
            'order' => 1,
            'active' => true,
        ]);
        $profile->roles()->attach([$adminRole->id, $staffRole->id]);

        $security = Menu::create([
            'name' => 'Keamanan',
            'icon' => 'lock',
            'route' => 'settings.security',
            'permission' => null, // Public
            'parent_id' => $settings->id,
            'order' => 2,
            'active' => true,
        ]);
        $security->roles()->attach([$adminRole->id, $staffRole->id]);

        $preferences = Menu::create([
            'name' => 'Preferensi',
            'icon' => 'sliders',
            'route' => 'settings.preferences',
            'permission' => null, // Public
            'parent_id' => $settings->id,
            'order' => 3,
            'active' => false ,
        ]);
        $preferences->roles()->attach([$adminRole->id, $staffRole->id]);

        // --- Admin Only Submenus (Hanya Admin yang bisa akses) ---
        
        // Kelola User - ADMIN ONLY
        $users = Menu::create([
            'name' => 'Kelola User',
            'icon' => 'users',
            'route' => 'users.index',
            'permission' => 'read users',
            'parent_id' => $settings->id,
            'order' => 4,
            'active' => true,
        ]);
        $users->roles()->attach([$adminRole->id]);

        // Role & Permission - ADMIN ONLY
        $roles = Menu::create([
            'name' => 'Role & Permission',
            'icon' => 'shield',
            'route' => 'permissions.index',
            'permission' => 'read permissions',
            'parent_id' => $settings->id,
            'order' => 5,
            'active' => true,
        ]);
        $roles->roles()->attach([$adminRole->id]);

        // Sistem - ADMIN ONLY
        $system = Menu::create([
            'name' => 'Sistem',
            'icon' => 'server',
            'route' => 'system.index',
            'permission' => 'read settings',
            'parent_id' => $settings->id,
            'order' => 6,
            'active' => false,
        ]);
        $system->roles()->attach([$adminRole->id]);

        

        // --- Public Submenu (Logout) ---
        
        // Keluar - Public untuk semua user
        $logout = Menu::create([
            'name' => 'Keluar',
            'icon' => 'log-out',
            'route' => 'logout',
            'permission' => null,
            'parent_id' => $settings->id,
            'order' => 8,
            'active' => true,
        ]);
        $logout->roles()->attach([$adminRole->id, $staffRole->id]);
        
        // DONE! Total: 9 main menus + submenus
    }
}