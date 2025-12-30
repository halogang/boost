<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Super Admin User (Full Access)
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@ajibdarkah.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $superAdmin->assignRole('super admin');

        // Owner User (View-only access)
        $owner = User::create([
            'name' => 'Owner',
            'email' => 'owner@ajibdarkah.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $owner->assignRole('owner');

        // Branch Admin User (Branch operations)
        $branchAdmin = User::create([
            'name' => 'Branch Admin',
            'email' => 'branchadmin@ajibdarkah.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $branchAdmin->assignRole('branch admin');

        // Admin Produksi User (Production management)
        $adminProduksi = User::create([
            'name' => 'Admin Produksi',
            'email' => 'adminproduksi@ajibdarkah.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $adminProduksi->assignRole('admin produksi');

        // Staff Produksi User (Production operations)
        $staffProduksi = User::create([
            'name' => 'Staff Produksi',
            'email' => 'staffproduksi@ajibdarkah.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $staffProduksi->assignRole('staff produksi');

        // Kurir User (Delivery operations)
        $kurir = User::create([
            'name' => 'Kurir',
            'email' => 'kurir@ajibdarkah.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $kurir->assignRole('kurir');
    }
}
