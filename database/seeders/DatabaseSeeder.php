<?php

namespace Database\Seeders;

use Database\Seeders\Core\MenuPositionSeeder;
use Database\Seeders\Core\MenuSeeder;
use Database\Seeders\Core\RolePermissionSeeder;
use Database\Seeders\Core\SettingsSeeder;
use Database\Seeders\Core\UserSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Core - Roles and permissions
        $this->call(RolePermissionSeeder::class);

        // 2. Core - Menus
        $this->call(MenuSeeder::class);

        // 3. Core - Menu positions
        $this->call(MenuPositionSeeder::class);

        // 4. Core - Users with roles
        $this->call(UserSeeder::class);

        // 5. Core - Default settings
        $this->call(SettingsSeeder::class);
    }
}
