<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuPositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing positions
        DB::table('menu_positions')->delete();

        // Get menu IDs by name (all main menus)
        $dashboard = Menu::where('name', 'Dashboard')->first();
        $purchasing = Menu::where('name', 'Pembelian')->first();
        $inventory = Menu::where('name', 'Inventori')->first();
        $manufacturing = Menu::where('name', 'Produksi')->first();
        $distribution = Menu::where('name', 'Distribusi')->first();
        $sales = Menu::where('name', 'Penjualan')->first();
        $hr = Menu::where('name', 'HR & Kehadiran')->first();
        $finance = Menu::where('name', 'Keuangan')->first();
        $crm = Menu::where('name', 'CRM')->first();
        $settings = Menu::where('name', 'Pengaturan')->first();
        $managementData = Menu::where('name', 'Management Data')->first();

        // ===== DESKTOP SIDEBAR =====
        // All main menus visible on desktop sidebar
        $desktopMenus = [
            $dashboard,
            $purchasing,
            $inventory,
            $manufacturing,
            $distribution,
            $sales,
            $hr,
            $finance,
            $crm,
            $managementData,
            $settings,
        ];

        foreach ($desktopMenus as $menu) {
            if ($menu) {
                DB::table('menu_positions')->insert([
                    'menu_id' => $menu->id,
                    'device' => 'desktop',
                    'position' => 'sidebar',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // ===== MOBILE BOTTOM NAVIGATION (MAX 5 ITEMS) =====
        $mobileBottomMenus = [
            $dashboard,
            $purchasing,
            $sales,
            $hr,
            $settings,
        ];

        foreach ($mobileBottomMenus as $menu) {
            if ($menu) {
                DB::table('menu_positions')->insert([
                    'menu_id' => $menu->id,
                    'device' => 'mobile',
                    'position' => 'bottom',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // ===== MOBILE DRAWER (SECONDARY/OVERFLOW MENUS) =====
        $mobileDrawerMenus = [
            $inventory,
            $manufacturing,
            $distribution,
            $finance,
            $crm,
            $settings,
        ];

        foreach ($mobileDrawerMenus as $menu) {
            if ($menu) {
                DB::table('menu_positions')->insert([
                    'menu_id' => $menu->id,
                    'device' => 'mobile',
                    'position' => 'drawer',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
