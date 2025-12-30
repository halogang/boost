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
        $superAdminRole = Role::where('name', 'super admin')->first();
        $ownerRole = Role::where('name', 'owner')->first();
        $branchAdminRole = Role::where('name', 'branch admin')->first();
        $adminProduksiRole = Role::where('name', 'admin produksi')->first();
        $staffProduksiRole = Role::where('name', 'staff produksi')->first();
        $kurirRole = Role::where('name', 'kurir')->first();

        // ===== MAIN MENUS =====
        // Menu utama tanpa parent_id akan tampil sebagai top-level menu
        
        // Dashboard - Visible untuk semua roles
        $dashboard = Menu::create([
            'name' => 'Dashboard',
            'icon' => 'home',
            'route' => 'dashboard',
            'permission' => 'read dashboard',
            'order' => 1,
            'active' => true,
        ]);
        $dashboard->roles()->attach([
            $superAdminRole->id,
            $ownerRole->id,
            $branchAdminRole->id,
            $adminProduksiRole->id,
            $staffProduksiRole->id,
            $kurirRole->id,
        ]);

        // Pembelian (Purchasing) - Supplier management and raw material procurement
        $purchasing = Menu::create([
            'name' => 'Pembelian',
            'icon' => 'shopping-cart',
            'route' => 'purchasing.index',
            'permission' => 'read purchasing',
            'order' => 2,
            'active' => false, // Nonaktifkan sementara - akan dibuat untuk client
        ]);
        $purchasing->roles()->attach([
            $superAdminRole->id,
            $ownerRole->id,
            $branchAdminRole->id,
            $adminProduksiRole->id,
        ]);

        // Inventori (Inventory) - Real-time stock control and warehouse records
        $inventory = Menu::create([
            'name' => 'Inventori',
            'icon' => 'database',
            'route' => 'inventory.index',
            'permission' => 'read inventory',
            'order' => 3,
            'active' => false, // Nonaktifkan sementara - akan dibuat untuk client
        ]);
        $inventory->roles()->attach([
            $superAdminRole->id,
            $ownerRole->id,
            $branchAdminRole->id,
            $adminProduksiRole->id,
            $staffProduksiRole->id,
        ]);

        // Produksi (Manufacturing) - Water production tracking and processing
        $manufacturing = Menu::create([
            'name' => 'Produksi',
            'icon' => 'box',
            'route' => 'manufacturing.index',
            'permission' => 'read manufacturing',
            'order' => 4,
            'active' => false, // Nonaktifkan sementara - akan dibuat untuk client
        ]);
        $manufacturing->roles()->attach([
            $superAdminRole->id,
            $ownerRole->id,
            $branchAdminRole->id,
            $adminProduksiRole->id,
            $staffProduksiRole->id,
        ]);

        // Distribusi (Distribution) - Route scheduling and courier/driver management
        $distribution = Menu::create([
            'name' => 'Distribusi',
            'icon' => 'truck',
            'route' => 'distribution.index',
            'permission' => 'read distribution',
            'order' => 5,
            'active' => false, // Nonaktifkan sementara - akan dibuat untuk client
        ]);
        $distribution->roles()->attach([
            $superAdminRole->id,
            $ownerRole->id,
            $branchAdminRole->id,
            $kurirRole->id,
        ]);

        // Penjualan (Sales) - Order processing by admin or self-ordering by customers
        $sales = Menu::create([
            'name' => 'Penjualan',
            'icon' => 'shopping-bag',
            'route' => 'sales.index',
            'permission' => 'read sales',
            'order' => 6,
            'active' => false, // Nonaktifkan sementara - akan dibuat untuk client
        ]);
        $sales->roles()->attach([
            $superAdminRole->id,
            $ownerRole->id,
            $branchAdminRole->id,
        ]);

        // HR & Kehadiran (HR & Attendance) - Employee data, attendance, and shift records
        $hr = Menu::create([
            'name' => 'HR & Kehadiran',
            'icon' => 'users',
            'route' => 'hr.index',
            'permission' => 'read employees',
            'order' => 7,
            'active' => false, // Nonaktifkan sementara - akan dibuat untuk client
        ]);
        $hr->roles()->attach([
            $superAdminRole->id,
            $ownerRole->id,
            $branchAdminRole->id,
            $adminProduksiRole->id,
        ]);

        // Keuangan (Finance) - Cash flow, income/expense, and profit reporting
        $finance = Menu::create([
            'name' => 'Keuangan',
            'icon' => 'dollar-sign',
            'route' => 'finance.index',
            'permission' => 'read finance',
            'order' => 8,
            'active' => false, // Nonaktifkan sementara - akan dibuat untuk client
        ]);
        $finance->roles()->attach([
            $superAdminRole->id,
            $ownerRole->id,
            $branchAdminRole->id,
            $adminProduksiRole->id,
        ]);

        // CRM - Customer engagement and follow-up management
        $crm = Menu::create([
            'name' => 'CRM',
            'icon' => 'user-circle',
            'route' => 'crm.index',
            'permission' => 'read crm',
            'order' => 9,
            'active' => false, // Nonaktifkan sementara - akan dibuat untuk client
        ]);
        $crm->roles()->attach([
            $superAdminRole->id,
            $ownerRole->id,
            $branchAdminRole->id,
        ]);

        // ===== PARENT MENU: PENGATURAN =====
        // Parent menu (route = null, permission = null)
        // Akan punya children/submenus di bawahnya
        $settings = Menu::create([
            'name' => 'Pengaturan',
            'icon' => 'settings',
            'route' => null, // Tidak ada route karena parent
            'permission' => null, // NULL = semua role bisa lihat parent
            'order' => 10,
            'active' => true,
        ]);
        $settings->roles()->attach([
            $superAdminRole->id,
            $ownerRole->id,
            $branchAdminRole->id,
            $adminProduksiRole->id,
            $staffProduksiRole->id,
            $kurirRole->id,
        ]);

        // ===== SUBMENUS (parent_id = $settings->id) =====
        
        // --- Public Submenus (Semua role bisa akses) ---
        
        // Profil - Public untuk semua user (menggabungkan profil dan keamanan)
        $profile = Menu::create([
            'name' => 'Profil',
            'icon' => 'user',
            'route' => 'settings.profile',
            'permission' => null, // Public
            'parent_id' => $settings->id,
            'order' => 1,
            'active' => true,
        ]);
        $profile->roles()->attach([
            $superAdminRole->id,
            $ownerRole->id,
            $branchAdminRole->id,
            $adminProduksiRole->id,
            $staffProduksiRole->id,
            $kurirRole->id,
        ]);

        $preferences = Menu::create([
            'name' => 'Preferensi',
            'icon' => 'sliders',
            'route' => 'settings.preferences',
            'permission' => 'read preferences',
            'parent_id' => $settings->id,
            'order' => 3,
            'active' => false ,
        ]);
        $preferences->roles()->attach([
            $superAdminRole->id,
            $ownerRole->id,
            $branchAdminRole->id,
            $adminProduksiRole->id,
            $staffProduksiRole->id,
            $kurirRole->id,
        ]);

        // Sistem Settings - SUPER ADMIN ONLY (di menu Pengaturan)
        // Parent menu untuk Role & Permission, Kelola Menu, dan Menu per Role
        $systemSettings = Menu::create([
            'name' => 'Sistem Settings',
            'icon' => 'server',
            'route' => null, // Tidak ada route karena parent
            'permission' => null, // NULL = semua role bisa lihat parent (tapi children akan di-filter)
            'parent_id' => $settings->id,
            'order' => 4,
            'active' => true,
        ]);
        $systemSettings->roles()->attach([$superAdminRole->id]);

        // ===== SUBMENUS OF SISTEM SETTINGS (parent_id = $systemSettings->id) =====
        
        // Role & Permission - SUPER ADMIN ONLY (di Sistem Settings)
        $roles = Menu::create([
            'name' => 'Role & Permission',
            'icon' => 'shield',
            'route' => 'permissions.index',
            'permission' => 'read permissions',
            'parent_id' => $systemSettings->id,
            'order' => 1,
            'active' => true,
        ]);
        $roles->roles()->attach([$superAdminRole->id]);

        // Kelola Menu - SUPER ADMIN ONLY (di Sistem Settings)
        $menuManagement = Menu::create([
            'name' => 'Kelola Menu',
            'icon' => 'list',
            'route' => 'menus.index',
            'permission' => 'read menus',
            'parent_id' => $systemSettings->id,
            'order' => 2,
            'active' => true,
        ]);
        $menuManagement->roles()->attach([$superAdminRole->id]);

        // Menu Role Positions - SUPER ADMIN ONLY (di Sistem Settings)
        $menuRolePositions = Menu::create([
            'name' => 'Menu per Role',
            'icon' => 'users',
            'route' => 'menu-role-positions.index',
            'permission' => 'read menu-role-positions',
            'parent_id' => $systemSettings->id,
            'order' => 3,
            'active' => true,
        ]);
        $menuRolePositions->roles()->attach([$superAdminRole->id]);

        // ===== PARENT MENU: MANAGEMENT DATA =====
        // Parent menu untuk management data (System)
        $managementData = Menu::create([
            'name' => 'Management Data',
            'icon' => 'database',
            'route' => null, // Tidak ada route karena parent
            'permission' => null, // NULL = semua role bisa lihat parent (tapi children akan di-filter)
            'order' => 11,
            'active' => true,
        ]);
        $managementData->roles()->attach([$superAdminRole->id]);

        // ===== SUBMENU: SYSTEM (parent_id = $managementData->id) =====
        // System - Parent menu untuk Users
        $system = Menu::create([
            'name' => 'System',
            'icon' => 'server',
            'route' => null, // Tidak ada route karena parent
            'permission' => null, // NULL = semua role bisa lihat parent (tapi children akan di-filter)
            'parent_id' => $managementData->id,
            'order' => 1,
            'active' => true,
        ]);
        $system->roles()->attach([$superAdminRole->id]);

        // ===== SUBMENUS OF SYSTEM (parent_id = $system->id) =====
        // --- Super Admin Only Submenus (Hanya Super Admin yang bisa akses) ---
        
        // Kelola User - SUPER ADMIN ONLY
        $users = Menu::create([
            'name' => 'Users',
            'icon' => 'users',
            'route' => 'users.index',
            'permission' => 'read users',
            'parent_id' => $system->id,
            'order' => 1,
            'active' => true,
        ]);
        $users->roles()->attach([$superAdminRole->id]);

        // Role & Permission sudah dipindahkan ke Sistem Settings (di menu Pengaturan)

        

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
        $logout->roles()->attach([
            $superAdminRole->id,
            $ownerRole->id,
            $branchAdminRole->id,
            $adminProduksiRole->id,
            $staffProduksiRole->id,
            $kurirRole->id,
        ]);
        
        // DONE! Total: 10 main menus (Dashboard + 8 ERP modules + Settings) + submenus
    }
}