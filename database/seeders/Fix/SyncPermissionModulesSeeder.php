<?php

namespace Database\Seeders\Fix;

use App\Services\PermissionService;
use Illuminate\Database\Seeder;

class SyncPermissionModulesSeeder extends Seeder
{
    public function run(): void
    {
        $service = app(PermissionService::class);
        $service->syncPermissionModules();

        $this->command->info('✅ Permission modules synced!');
    }
}
