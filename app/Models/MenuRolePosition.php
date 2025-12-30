<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Permission\Models\Role;

class MenuRolePosition extends Model
{
    protected $fillable = [
        'menu_id',
        'role_id',
        'device',
        'position',
    ];

    /**
     * Get the menu
     */
    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    /**
     * Get the role
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }
}

