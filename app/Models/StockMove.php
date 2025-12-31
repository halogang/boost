<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockMove extends Model
{
    use SoftDeletes;

    protected $table = 'stock_move';

    protected $fillable = [
        'picking_id',
        'purchase_line_id',
        'product_id',
        'product_uom_qty',
        'quantity_done',
        'product_uom_id',
        'location_id',
        'location_dest_id',
        'state',
        'reference',
        'order',
    ];

    protected $casts = [
        'product_uom_qty' => 'decimal:3',
        'quantity_done' => 'decimal:3',
        'order' => 'integer',
    ];

    /**
     * Relationship: Stock Picking
     */
    public function picking()
    {
        return $this->belongsTo(StockPicking::class, 'picking_id');
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
     * Relationship: UOM
     */
    public function uom()
    {
        return $this->belongsTo(Uom::class, 'product_uom_id');
    }

    /**
     * Mark as done
     */
    public function markAsDone($quantity = null)
    {
        $qty = $quantity ?? $this->product_uom_qty;
        
        $this->update([
            'quantity_done' => $qty,
            'state' => 'done',
        ]);

        // Update purchase order line - sum all quantity_done from all stock moves for this line
        if ($this->purchase_line_id) {
            $line = PurchaseOrderLine::find($this->purchase_line_id);
            if ($line) {
                // Sum all quantity_done from all stock moves for this purchase line
                $totalQtyReceived = StockMove::where('purchase_line_id', $this->purchase_line_id)
                    ->where('state', 'done')
                    ->sum('quantity_done');
                
                // Ensure we're using fresh data
                $line->refresh();
                
                $line->update([
                    'qty_received' => $totalQtyReceived,
                    'receipt_status' => $totalQtyReceived >= $line->product_qty ? 'full' : 'partial',
                ]);
                
                // Refresh the line to ensure updated data
                $line->refresh();
            }
        }
    }
}

