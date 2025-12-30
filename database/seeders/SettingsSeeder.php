<?php

namespace Database\Seeders;

use App\Models\Settings;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Default primary color (blue)
        Settings::set(
            'primary_color',
            '#2563eb',
            'string',
            'Warna primary untuk aplikasi'
        );
    }
}
