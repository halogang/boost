<?php

namespace Database\Seeders\Authorization;

use App\Constants\Permissions;
use App\Models\Menu;
use App\Models\MenuRolePosition;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class ManagerAuthorizationSeeder extends Seeder
{
    /**
     * Assign permissions, menus, and menu positions for Manager role.
     * Manager has full operational access but no system configuration.
     */
    public function run(): void
    {
        $this->command->info('🔧 Setting up Manager Authorization...');

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ===== STEP 1: GET ROLE =====
        $role = Role::where('name', 'Manager')->first();
        if (!$role) {
            $this->command->error('Manager role not found!');
            return;
        }

        // ===== STEP 2: ASSIGN PERMISSIONS =====
        $permissions = [
            Permissions::READ_DASHBOARD,
            Permissions::CREATE_USERS,
            Permissions::READ_USERS,
            Permissions::UPDATE_USERS,
            Permissions::READ_ROLES,
            Permissions::READ_SETTINGS,
            Permissions::UPDATE_SETTINGS,
            Permissions::READ_MENUS,
            Permissions::READ_MENU_ROLE_POSITIONS,
            Permissions::READ_PERMISSIONS,
            Permissions::READ_PREFERENCES,
            Permissions::UPDATE_PREFERENCES,
        ];

        foreach ($permissions as $permissionName) {
            Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'web']);
        }

        $role->syncPermissions($permissions);
        $this->command->info("✅ Assigned {$role->permissions->count()} permissions to Manager");

        // ===== STEP 3: ASSIGN MENUS =====
        // Manager sees all menus except Konfigurasi and its children
        $sistemSettings = Menu::where('name', 'Konfigurasi')->first();
        $excludeIds = collect();
        if ($sistemSettings) {
            $excludeIds = collect([$sistemSettings->id]);
            $excludeIds = $excludeIds->merge(Menu::where('parent_id', $sistemSettings->id)->pluck('id'));
        }

        $menus = Menu::all()->filter(fn($m) => !$excludeIds->contains($m->id));

        foreach ($menus as $menu) {
            $menu->roles()->syncWithoutDetaching([$role->id]);
        }
        $this->command->info("✅ Assigned {$menus->count()} menus to Manager");

        // ===== STEP 4: ASSIGN MENU POSITIONS =====
        // Desktop Sidebar
        $desktopSidebarMenus = Menu::whereNull('parent_id')
            ->whereNotIn('id', $excludeIds->toArray())
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

        // Mobile Drawer
        $mobileDrawerMenus = Menu::whereNull('parent_id')
            ->whereNotIn('name', $mobileBottomNames)
            ->whereNotIn('id', $excludeIds->toArray())
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

        $this->command->info('✅ Manager Authorization setup completed!');
        $this->command->info('');
    }
}
