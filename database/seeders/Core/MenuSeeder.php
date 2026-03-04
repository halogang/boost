<?php

namespace Database\Seeders\Core;

use App\Constants\Permissions;
use App\Models\Menu;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        Menu::query()->delete();

        $superAdminRole = Role::where('name', 'Super Admin')->first();
        $ownerRole = Role::where('name', 'Owner')->first();
        $managerRole = Role::where('name', 'Manager')->first();
        $adminRole = Role::where('name', 'Admin')->first();

        $allRoleIds = array_filter([
            $superAdminRole?->id,
            $ownerRole?->id,
            $managerRole?->id,
            $adminRole?->id,
        ]);

        // ===== Dashboard =====
        $dashboard = Menu::create([
            'name' => 'Dashboard',
            'icon' => 'home',
            'route' => 'dashboard',
            'permission' => Permissions::READ_DASHBOARD,
            'order' => 1,
            'active' => true,
        ]);
        $dashboard->roles()->attach($allRoleIds);

        // ===== Pengaturan =====
        $settings = Menu::create([
            'name' => 'Pengaturan',
            'icon' => 'settings',
            'route' => null,
            'permission' => null,
            'order' => 90,
            'active' => true,
        ]);
        $settings->roles()->attach($allRoleIds);

        // Submenus of Pengaturan
        $profile = Menu::create([
            'name' => 'Profil',
            'icon' => 'user',
            'route' => 'settings.profile',
            'permission' => null,
            'parent_id' => $settings->id,
            'order' => 1,
            'active' => true,
        ]);
        $profile->roles()->attach($allRoleIds);

        $preferences = Menu::create([
            'name' => 'Preferensi',
            'icon' => 'sliders',
            'route' => 'settings.preferences',
            'permission' => Permissions::READ_PREFERENCES,
            'parent_id' => $settings->id,
            'order' => 2,
            'active' => true,
        ]);
        $preferences->roles()->attach($allRoleIds);

        // Konfigurasi group (Super Admin only)
        $sistemSettings = Menu::create([
            'name' => 'Konfigurasi',
            'icon' => 'server',
            'route' => null,
            'permission' => null,
            'parent_id' => $settings->id,
            'order' => 3,
            'active' => true,
        ]);
        $sistemSettings->roles()->attach([$superAdminRole->id]);

        Menu::create([
            'name' => 'Pengaturan Sistem',
            'icon' => 'settings',
            'route' => 'system.index',
            'permission' => Permissions::READ_SETTINGS,
            'parent_id' => $sistemSettings->id,
            'order' => 1,
            'active' => true,
        ])->roles()->attach([$superAdminRole->id]);

        Menu::create([
            'name' => 'Role & Permission',
            'icon' => 'shield',
            'route' => 'permissions.index',
            'permission' => Permissions::READ_PERMISSIONS,
            'parent_id' => $sistemSettings->id,
            'order' => 2,
            'active' => true,
        ])->roles()->attach([$superAdminRole->id]);

        Menu::create([
            'name' => 'Kelola Menu',
            'icon' => 'list',
            'route' => 'menus.index',
            'permission' => Permissions::READ_MENUS,
            'parent_id' => $sistemSettings->id,
            'order' => 3,
            'active' => true,
        ])->roles()->attach([$superAdminRole->id]);

        Menu::create([
            'name' => 'Menu per Role',
            'icon' => 'users',
            'route' => 'menu-role-positions.index',
            'permission' => Permissions::READ_MENU_ROLE_POSITIONS,
            'parent_id' => $sistemSettings->id,
            'order' => 4,
            'active' => true,
        ])->roles()->attach([$superAdminRole->id]);

        // Keluar
        Menu::create([
            'name' => 'Keluar',
            'icon' => 'log-out',
            'route' => 'logout',
            'permission' => null,
            'parent_id' => $settings->id,
            'order' => 99,
            'active' => true,
        ])->roles()->attach($allRoleIds);

        // ===== Management Data =====
        $managementData = Menu::create([
            'name' => 'Management Data',
            'icon' => 'database',
            'route' => null,
            'permission' => null,
            'order' => 91,
            'active' => true,
        ]);
        $managementData->roles()->attach([$superAdminRole->id]);

        // System submenu under Management Data
        $system = Menu::create([
            'name' => 'System',
            'icon' => 'server',
            'route' => null,
            'permission' => null,
            'parent_id' => $managementData->id,
            'order' => 1,
            'active' => true,
        ]);
        $system->roles()->attach([$superAdminRole->id]);

        Menu::create([
            'name' => 'Users',
            'icon' => 'users',
            'route' => 'users.index',
            'permission' => Permissions::READ_USERS,
            'parent_id' => $system->id,
            'order' => 1,
            'active' => true,
        ])->roles()->attach([$superAdminRole->id]);

        $this->command->info('✅ Core menus seeded!');
    }
}
