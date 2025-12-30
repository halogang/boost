<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Settings extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'description',
    ];

    /**
     * Get setting value by key
     */
    public static function get(string $key, $default = null)
    {
        try {
            return Cache::remember("setting.{$key}", 3600, function () use ($key, $default) {
                $setting = self::where('key', $key)->first();
                return $setting ? self::castValue($setting->value, $setting->type) : $default;
            });
        } catch (\Exception $e) {
            // Return default if table doesn't exist yet (during migration)
            return $default;
        }
    }

    /**
     * Set setting value by key
     */
    public static function set(string $key, $value, string $type = 'string', ?string $description = null): void
    {
        try {
            $setting = self::updateOrCreate(
                ['key' => $key],
                [
                    'value' => is_array($value) ? json_encode($value) : $value,
                    'type' => $type,
                    'description' => $description,
                ]
            );

            Cache::forget("setting.{$key}");
        } catch (\Exception $e) {
            // Silently fail if table doesn't exist yet (during migration)
        }
    }

    /**
     * Cast value based on type
     */
    protected static function castValue($value, string $type)
    {
        return match ($type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $value,
            'json' => json_decode($value, true),
            default => $value,
        };
    }
}
