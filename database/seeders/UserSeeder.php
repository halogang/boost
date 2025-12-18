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
        // Admin User (Full Access)
        $admin = User::create([
            'name' => 'Admin AquaGalon',
            'email' => 'admin@aquagalon.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // Owner User (View-only access)
        $owner = User::create([
            'name' => 'Owner',
            'email' => 'owner@aquagalon.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $owner->assignRole('owner');

        // Staff User (Operations)
        $staff = User::create([
            'name' => 'Staff Member',
            'email' => 'staff@aquagalon.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $staff->assignRole('staff');

        // Courier User (Delivery operations)
        $courier = User::create([
            'name' => 'Kurir',
            'email' => 'courier@aquagalon.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $courier->assignRole('courier');

        // Customer User (Limited access)
        $customer = User::create([
            'name' => 'Customer',
            'email' => 'customer@aquagalon.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $customer->assignRole('customer');

        // Additional test users
        $testAdmin = User::create([
            'name' => 'Test Admin',
            'email' => 'test@admin.com',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);
        $testAdmin->assignRole('admin');
    }
}
