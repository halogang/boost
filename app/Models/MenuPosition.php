<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuPosition extends Model
{
    protected $fillable = [
        'menu_id',
        'device',
        'position',
    ];

    /**
     * Get the menu that owns this position
     */
    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }
}
