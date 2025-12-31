<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductProduct extends Model
{
    use SoftDeletes;

    protected $table = 'product_product';

    protected $fillable = [
        'name',
        'default_code',
        'barcode',
        'description',
        'description_purchase',
        'description_sale',
        'type',
        'purchase_method',
        'purchase_ok',
        'sale_ok',
        'active',
        'uom_id',
        'uom_po_id',
        'list_price',
        'standard_price',
        'categ_id',
        'categ_name',
        'order',
    ];

    protected $casts = [
        'purchase_ok' => 'boolean',
        'sale_ok' => 'boolean',
        'active' => 'boolean',
        'list_price' => 'decimal:2',
        'standard_price' => 'decimal:2',
        'order' => 'integer',
    ];

    /**
     * Relationship: Unit of Measure
     */
    public function uom()
    {
        return $this->belongsTo(Uom::class, 'uom_id');
    }

    /**
     * Relationship: Purchase Unit of Measure
     */
    public function uomPo()
    {
        return $this->belongsTo(Uom::class, 'uom_po_id');
    }

    /**
     * Scope: Get only active products
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Scope: Get only purchasable products
     */
    public function scopePurchasable($query)
    {
        return $query->where('purchase_ok', true);
    }

    /**
     * Scope: Filter by type
     * Types: consu (consumable/ATK), service (jasa), product (storable/inventori)
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope: Get only consumable products
     */
    public function scopeConsumable($query)
    {
        return $query->where('type', 'consu');
    }

    /**
     * Scope: Get only storable products (for inventory)
     */
    public function scopeStorable($query)
    {
        return $query->where('type', 'product');
    }

    /**
     * Scope: Get only service products
     */
    public function scopeService($query)
    {
        return $query->where('type', 'service');
    }

    /**
     * Scope: Filter by category name
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('categ_name', $category);
    }

    /**
     * Scope: Order by order field, then by name
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('name');
    }

    /**
     * Scope: Search by name, default_code, or barcode
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('default_code', 'like', "%{$search}%")
              ->orWhere('barcode', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }
}

