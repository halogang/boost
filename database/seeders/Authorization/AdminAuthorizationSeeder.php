<?php

namespace Database\Seeders\Authorization;

use App\Constants\Permissions;
use App\Models\Menu;
use App\Models\MenuRolePosition;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AdminAuthorizationSeeder extends Seeder
{
    /**
     * Assign permissions, menus, and menu positions for Admin role.
     * Admin has limited access - read only with preferences update.
     */
    public function run(): void
    {
        $this->command->info('🔧 Setting up Admin Authorization...');

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ===== STEP 1: GET ROLE =====
        $role = Role::where('name', 'Admin')->first();
        if (!$role) {
            $this->command->error('Admin role not found!');
            return;
        }

        // ===== STEP 2: ASSIGN PERMISSIONS =====
        $permissions = [
            Permissions::READ_DASHBOARD,
            Permissions::READ_USERS,
            Permissions::READ_SETTINGS,
            Permissions::READ_PREFERENCES,
            Permissions::UPDATE_PREFERENCES,
        ];

        foreach ($permissions as $permissionName) {
            Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'web']);
        }

        $role->syncPermissions($permissions);
        $this->command->info("✅ Assigned {$role->permissions->count()} permissions to Admin");

        // ===== STEP 3: ASSIGN MENUS =====
        // Admin sees Dashboard and Pengaturan only
        $allowedMenuNames = ['Dashboard', 'Pengaturan', 'Profil', 'Preferensi'];
        $menus = Menu::whereIn('name', $allowedMenuNames)->get();

        foreach ($menus as $menu) {
            $menu->roles()->syncWithoutDetaching([$role->id]);
        }
        $this->command->info("✅ Assigned {$menus->count()} menus to Admin");

        // ===== STEP 4: ASSIGN MENU POSITIONS =====
        // Desktop Sidebar - Dashboard & Pengaturan only
        $desktopSidebarMenus = Menu::whereIn('name', ['Dashboard', 'Pengaturan'])
            ->whereNull('parent_id')
            ->get();

        foreach ($desktopSidebarMenus as $menu) {
            MenuRolePosition::firstOrCreate([
                'menu_id'  => $menu->id,
                'role_id'  => $role->id,
                'device'   => 'desktop',
                'position' => 'sidebar',
            ]);
        }
        $this->command->info("✅ Assigned {$desktopSidebarMenus->count()} menus to Desktop Sidebar");

        // Mobile Bottom
        $mobileBottomNames = ['Dashboard', 'Pengaturan'];
        $mobileBottomMenus = Menu::whereIn('name', $mobileBottomNames)->whereNull('parent_id')->get();

        foreach ($mobileBottomMenus as $menu) {
            MenuRolePosition::firstOrCreate([
                'menu_id'  => $menu->id,
                'role_id'  => $role->id,
                'device'   => 'mobile',
                'position' => 'bottom',
            ]);
        }
        $this->command->info("✅ Assigned {$mobileBottomMenus->count()} menus to Mobile Bottom");

        $this->command->info('✅ Admin Authorization setup completed!');
        $this->command->info('');
    }
}
