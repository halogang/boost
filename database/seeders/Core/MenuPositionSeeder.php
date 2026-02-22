<?php

namespace Database\Seeders\Core;

use App\Models\Menu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuPositionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('menu_positions')->delete();

        $dashboard = Menu::where('name', 'Dashboard')->first();
        $settings = Menu::where('name', 'Pengaturan')->first();
        $managementData = Menu::where('name', 'Management Data')->first();

        // Desktop sidebar
        $desktopMenus = array_filter([$dashboard, $managementData, $settings]);
        foreach ($desktopMenus as $menu) {
            DB::table('menu_positions')->insert([
                'menu_id' => $menu->id,
                'device' => 'desktop',
                'position' => 'sidebar',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Mobile bottom (max 5)
        $mobileBottomMenus = array_filter([$dashboard, $settings]);
        foreach ($mobileBottomMenus as $menu) {
            DB::table('menu_positions')->insert([
                'menu_id' => $menu->id,
                'device' => 'mobile',
                'position' => 'bottom',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Mobile drawer
        $mobileDrawerMenus = array_filter([$managementData, $settings]);
        foreach ($mobileDrawerMenus as $menu) {
            DB::table('menu_positions')->insert([
                'menu_id' => $menu->id,
                'device' => 'mobile',
                'position' => 'drawer',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('✅ Core menu positions seeded!');
    }
}
