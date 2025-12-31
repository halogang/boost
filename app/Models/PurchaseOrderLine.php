<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\AccountMoveLine;

class PurchaseOrderLine extends Model
{
    use SoftDeletes;

    protected $table = 'purchase_order_line';

    protected $fillable = [
        'order_id',
        'product_id',
        'name',
        'product_qty',
        'qty_received',
        'qty_invoiced',
        'product_uom_id',
        'price_unit',
        'price_subtotal',
        'price_tax',
        'price_total',
        'tax_id',
        'tax_rate',
        'date_planned',
        'receipt_status',
        'order',
    ];

    protected $casts = [
        'product_qty' => 'decimal:3',
        'qty_received' => 'decimal:3',
        'qty_invoiced' => 'decimal:3',
        'price_unit' => 'decimal:2',
        'price_subtotal' => 'decimal:2',
        'price_tax' => 'decimal:2',
        'price_total' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'date_planned' => 'date',
        'order' => 'integer',
    ];

    /**
     * Relationship: Purchase Order
     */
    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class, 'order_id');
    }

    /**
     * Relationship: Product
     */
    public function product()
    {
        return $this->belongsTo(ProductProduct::class, 'product_id');
    }

    /**
     * Relationship: UOM
     */
    public function uom()
    {
        return $this->belongsTo(Uom::class, 'product_uom_id');
    }

    /**
     * Relationship: Stock Moves
     */
    public function stockMoves()
    {
        return $this->hasMany(StockMove::class, 'purchase_line_id');
    }

    /**
     * Relationship: Account Move Lines (Invoice Lines)
     */
    public function invoiceLines()
    {
        return $this->hasMany(AccountMoveLine::class, 'purchase_line_id');
    }

    /**
     * Calculate totals
     */
    public function calculateTotals()
    {
        $subtotal = $this->product_qty * $this->price_unit;
        $tax = $subtotal * ($this->tax_rate / 100);
        $total = $subtotal + $tax;

        $this->update([
            'price_subtotal' => $subtotal,
            'price_tax' => $tax,
            'price_total' => $total,
        ]);
    }
}

