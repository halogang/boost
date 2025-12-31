<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed roles and permissions first
        $this->call(RolePermissionSeeder::class);
        
        // 2. Seed menus
        $this->call(MenuSeeder::class);

        // 3. Seed menu positions
        $this->call(MenuPositionSeeder::class);

        // 4. Seed users with roles
        $this->call(UserSeeder::class);

        // 5. Seed default settings
        $this->call(SettingsSeeder::class);

        // 6. Seed UOM (Unit of Measure)
        $this->call(UomSeeder::class);

        // 7. Seed Product Product (Products)
        $this->call(ProductProductSeeder::class);

        // 8. Seed Res Partner (Vendors/Suppliers)
        $this->call(ResPartnerSeeder::class);
    }
}
