<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockPicking extends Model
{
    use SoftDeletes;

    protected $table = 'stock_picking';

    protected $fillable = [
        'name',
        'purchase_id',
        'picking_type_code',
        'location_id',
        'location_dest_id',
        'state',
        'scheduled_date',
        'date_done',
        'user_id',
        'note',
    ];

    protected $casts = [
        'scheduled_date' => 'date',
        'date_done' => 'datetime',
    ];

    /**
     * Relationship: Purchase Order
     * PENTING: Tambahkan withTrashed() karena PO mungkin soft deleted
     */
    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class, 'purchase_id')->withTrashed();
    }

    /**
     * Relationship: Stock Moves
     */
    public function moves()
    {
        return $this->hasMany(StockMove::class, 'picking_id');
    }

    /**
     * Relationship: User
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    /**
     * Scope: Get incoming pickings (Receipts)
     */
    public function scopeIncoming($query)
    {
        return $query->where('picking_type_code', 'incoming');
    }

    /**
     * Scope: Filter by state
     */
    public function scopeByState($query, string $state)
    {
        return $query->where('state', $state);
    }

    /**
     * Mark as done (received)
     */
    public function markAsDone()
    {
        $this->update([
            'state' => 'done',
            'date_done' => now(),
        ]);

        // Update purchase order receipt status
        if ($this->purchase_id) {
            $po = PurchaseOrder::withTrashed()->find($this->purchase_id);
            if ($po) {
                // Check if all lines are received
                $allReceived = $po->orderLines()
                    ->where('receipt_status', '!=', 'full')
                    ->doesntExist();

                $po->update([
                    'receipt_status' => $allReceived ? 'full' : 'partial',
                    'state' => $allReceived ? 'done' : 'purchase',
                ]);
            }
        }
    }
}