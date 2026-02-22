<?php

namespace Database\Seeders\Core;

use App\Models\Settings;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        Settings::set('primary_color', '#2563eb', 'string', 'Warna primary untuk aplikasi');

        $this->command->info('✅ Core settings seeded!');
    }
}
