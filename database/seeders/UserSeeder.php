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
        $superAdmin->assignRole('Super Admin');

        // Owner User (View-only access)
        $owner = User::create([
            'name' => 'Owner',
            'email' => 'owner@ajibdarkah.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $owner->assignRole('Owner');

        // Manager User (Branch operations)
        $manager = User::create([
            'name' => 'Manager',
            'email' => 'manager@ajibdarkah.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $manager->assignRole('Manager');

        // Spv User (Supervisor)
        $spv = User::create([
            'name' => 'Spv',
            'email' => 'spv@ajibdarkah.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $spv->assignRole('Spv');

        // Admin User (Production management)
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@ajibdarkah.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('Admin');

        // Staff Pengantaran User (Delivery operations)
        $staffPengantaran = User::create([
            'name' => 'Staff Pengantaran',
            'email' => 'staffpengantaran@ajibdarkah.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $staffPengantaran->assignRole('Staff Pengantaran');

        // Staff Produksi User (Production operations)
        $staffProduksi = User::create([
            'name' => 'Staff Produksi',
            'email' => 'staffproduksi@ajibdarkah.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $staffProduksi->assignRole('Staff Produksi');
    }
}
