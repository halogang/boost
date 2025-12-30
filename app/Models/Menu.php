<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Models\Role;

class Menu extends Model
{
    protected $fillable = [
        'name',
        'icon',
        'route',
        'permission',
        'parent_id',
        'order',
        'active'
    ];

    protected $casts = [
        'active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get the parent menu
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    /**
     * Get child menus (submenus)
     * Show all children (active and inactive) - inactive will be styled differently in frontend
     */
    public function children(): HasMany
    {
        return $this->hasMany(Menu::class, 'parent_id')
            ->orderBy('order');
    }

    /**
     * Get menu positions
     */
    public function positions(): HasMany
    {
        return $this->hasMany(MenuPosition::class);
    }

    /**
     * Get roles that can access this menu
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'menu_roles');
    }

    /**
     * Scope: Get only main menus (no parent)
     */
    public function scopeMainMenus($query)
    {
        return $query->whereNull('parent_id')
            ->orderBy('order');
    }

    /**
     * Scope: Get only active menus
     */
    // public function scopeActive($query)
    // {
    //     return $query->where('active', true);
    // }

    /**
     * Scope: Filter by device and position
     */
    public function scopeForPosition($query, string $device, string $position)
    {
        return $query->whereHas('positions', function ($q) use ($device, $position) {
            $q->where('device', $device)
              ->where('position', $position);
        });
    }
}

