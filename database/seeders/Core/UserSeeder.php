<?php

namespace Database\Seeders\Core;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $superAdmin->assignRole('Super Admin');

        $owner = User::create([
            'name' => 'Owner',
            'email' => 'owner@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $owner->assignRole('Owner');

        $manager = User::create([
            'name' => 'Manager',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $manager->assignRole('Manager');

        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('Admin');

        $this->command->info('✅ Core users seeded!');
    }
}
