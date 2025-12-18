<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $fillable = ['name', 'icon', 'route', 'permission', 'parent_id', 'order', 'active'];

    protected $casts = [
        'active' => 'boolean',
    ];

    // Parent menu (for submenus)
    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    // Child menus (submenus)
    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id')->orderBy('order');
    }

    // Get only main menus (no parent)
    public function scopeMainMenus($query)
    {
        return $query->whereNull('parent_id')->orderBy('order');
    }

    // Get only active menus
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}

