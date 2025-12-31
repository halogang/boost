<?php

namespace App\Services;

use App\Models\Settings;

class SettingsService
{
    /**
     * Get all system settings
     *
     * @return array
     */
    public function getAllSettings(): array
    {
        return [
            'primary_color' => Settings::get('primary_color', '#2563eb'),
        ];
    }

    /**
     * Get a single setting value
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function getSetting(string $key, $default = null)
    {
        return Settings::get($key, $default);
    }

    /**
     * Update system settings
     *
     * @param array $data
     * @return void
     * @throws \Exception
     */
    public function updateSettings(array $data): void
    {
        try {
            if (isset($data['primary_color'])) {
                Settings::set(
                    'primary_color',
                    $data['primary_color'],
                    'string',
                    'Primary color untuk aplikasi'
                );
            }
        } catch (\Exception $e) {
            throw new \Exception('Gagal memperbarui pengaturan: ' . $e->getMessage());
        }
    }

    /**
     * Set a setting value
     *
     * @param string $key
     * @param mixed $value
     * @param string $type
     * @param string|null $description
     * @return void
     */
    public function setSetting(string $key, $value, string $type = 'string', ?string $description = null): void
    {
        Settings::set($key, $value, $type, $description);
    }
}

