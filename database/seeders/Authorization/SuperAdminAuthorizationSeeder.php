<?php

namespace Database\Seeders\Authorization;

use App\Constants\Permissions;
use App\Models\Menu;
use App\Models\MenuRolePosition;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class SuperAdminAuthorizationSeeder extends Seeder
{
    /**
     * Assign permissions, menus, and menu positions for Super Admin role.
     * Super Admin has FULL access to everything including system settings.
     */
    public function run(): void
    {
        $this->command->info('🔧 Setting up Super Admin Authorization...');

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ===== STEP 1: GET ROLE =====
        $role = Role::where('name', 'Super Admin')->first();
        if (!$role) {
            $this->command->error('Super Admin role not found!');
            return;
        }

        // ===== STEP 2: ASSIGN ALL PERMISSIONS =====
        $permissions = Permissions::all();

        foreach ($permissions as $permissionName) {
            Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'web']);
        }

        $role->syncPermissions($permissions);
        $this->command->info("✅ Assigned ALL {$role->permissions->count()} permissions to Super Admin");

        // ===== STEP 3: ASSIGN ALL MENUS =====
        $allMenus = Menu::all();

        foreach ($allMenus as $menu) {
            $menu->roles()->syncWithoutDetaching([$role->id]);
        }
        $this->command->info("✅ Assigned {$allMenus->count()} menus to Super Admin");

        // ===== STEP 4: ASSIGN MENU POSITIONS =====
        // Desktop Sidebar - all parent menus
        $desktopSidebarMenus = Menu::whereNull('parent_id')->get();

        foreach ($desktopSidebarMenus as $menu) {
            MenuRolePosition::firstOrCreate([
                'menu_id'  => $menu->id,
                'role_id'  => $role->id,
                'device'   => 'desktop',
                'position' => 'sidebar',
            ]);
        }
        $this->command->info("✅ Assigned {$desktopSidebarMenus->count()} menus to Desktop Sidebar");

        // Mobile Bottom - important menus (max 5)
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

        // Mobile Drawer - all parent menus except bottom menus
        $mobileDrawerMenus = Menu::whereNull('parent_id')
            ->whereNotIn('name', $mobileBottomNames)
            ->get();

        foreach ($mobileDrawerMenus as $menu) {
            MenuRolePosition::firstOrCreate([
                'menu_id'  => $menu->id,
                'role_id'  => $role->id,
                'device'   => 'mobile',
                'position' => 'drawer',
            ]);
        }
        $this->command->info("✅ Assigned {$mobileDrawerMenus->count()} menus to Mobile Drawer");

        $this->command->info('✅ Super Admin Authorization setup completed!');
        $this->command->info('');
    }
}
