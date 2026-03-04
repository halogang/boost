<?php

namespace Database\Seeders\Authorization;

use Illuminate\Database\Seeder;

class AllAuthorizationSeeder extends Seeder
{
    /**
     * Run all role authorization seeders.
     * Assigns permissions, menus, and menu positions for every role.
     */
    public function run(): void
    {
        $this->command->info('');
        $this->command->info('========================================');
        $this->command->info('  Running All Authorization Seeders');
        $this->command->info('========================================');
        $this->command->info('');

        $this->call([
            SuperAdminAuthorizationSeeder::class,
            OwnerAuthorizationSeeder::class,
            ManagerAuthorizationSeeder::class,
            AdminAuthorizationSeeder::class,
        ]);

        $this->command->info('========================================');
        $this->command->info('  ✅ All Authorization Seeders Done!');
        $this->command->info('========================================');
        $this->command->info('');
    }
}
