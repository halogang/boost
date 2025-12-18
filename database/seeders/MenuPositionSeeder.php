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

        // Get menu IDs by name (since we removed 'key' field)
        $dashboard = Menu::where('name', 'Dashboard')->first();
        $orders = Menu::where('name', 'Pesanan')->first();
        $products = Menu::where('name', 'Produk')->first();
        $stock = Menu::where('name', 'Stok')->first();
        $reports = Menu::where('name', 'Laporan')->first();
        $notifications = Menu::where('name', 'Notifikasi')->first();
        $settings = Menu::where('name', 'Pengaturan')->first();

        // ===== DESKTOP SIDEBAR =====
        // All main menus visible on desktop sidebar
        $desktopMenus = [
            $dashboard,
            $orders,
            $products,
            $stock,
            $reports,
            $notifications,
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
            $orders,
            $notifications,
            $reports,
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
            $products,
            $stock,
            $reports,
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
