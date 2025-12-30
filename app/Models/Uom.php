<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Uom extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'category',
        'ratio',
        'uom_type',
        'rounding',
        'active',
        'description',
        'order',
    ];

    protected $casts = [
        'ratio' => 'decimal:6',
        'rounding' => 'decimal:3',
        'active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Scope: Get only active UOMs
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Scope: Filter by category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope: Get reference UOMs (ratio = 1.0)
     */
    public function scopeReference($query)
    {
        return $query->where('uom_type', 'reference');
    }

    /**
     * Scope: Order by order field, then by name
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('name');
    }
}
