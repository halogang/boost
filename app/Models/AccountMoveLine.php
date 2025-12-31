<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccountMoveLine extends Model
{
    use SoftDeletes;

    protected $table = 'account_move_line';

    protected $fillable = [
        'move_id',
        'purchase_line_id',
        'product_id',
        'name',
        'quantity',
        'price_unit',
        'price_subtotal',
        'price_total',
        'account_id',
        'tax_id',
        'tax_rate',
        'order',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'price_unit' => 'decimal:2',
        'price_subtotal' => 'decimal:2',
        'price_total' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'order' => 'integer',
    ];

    /**
     * Relationship: Account Move (Vendor Bill)
     */
    public function move()
    {
        return $this->belongsTo(AccountMove::class, 'move_id');
    }

    /**
     * Relationship: Purchase Order Line
     */
    public function purchaseLine()
    {
        return $this->belongsTo(PurchaseOrderLine::class, 'purchase_line_id');
    }

    /**
     * Relationship: Product
     */
    public function product()
    {
        return $this->belongsTo(ProductProduct::class, 'product_id');
    }

    /**
     * Calculate totals
     */
    public function calculateTotals()
    {
        $subtotal = $this->quantity * $this->price_unit;
        $tax = $subtotal * ($this->tax_rate / 100);
        $total = $subtotal + $tax;

        $this->update([
            'price_subtotal' => $subtotal,
            'price_total' => $total,
        ]);
    }
}

