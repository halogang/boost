<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\AccountMove;

class PurchaseOrder extends Model
{
    use SoftDeletes;

    protected $table = 'purchase_order';

    protected $fillable = [
        'name',
        'partner_id',
        'date_order',
        'date_planned',
        'state',
        'order_type',
        'currency_id',
        'payment_term_id',
        'amount_untaxed',
        'amount_tax',
        'amount_total',
        'receipt_status',
        'invoice_status',
        'picking_type_id',
        'location_id',
        'notes',
        'terms',
        'user_id',
        'date_approve',
        'date_confirm',
    ];

    protected $casts = [
        'date_order' => 'date',
        'date_planned' => 'date',
        'amount_untaxed' => 'decimal:2',
        'amount_tax' => 'decimal:2',
        'amount_total' => 'decimal:2',
        'date_approve' => 'datetime',
        'date_confirm' => 'datetime',
    ];

    /**
     * Relationship: Vendor/Supplier
     */
    public function partner()
    {
        return $this->belongsTo(ResPartner::class, 'partner_id');
    }

    /**
     * Relationship: Purchase Order Lines
     */
    public function orderLines()
    {
        return $this->hasMany(PurchaseOrderLine::class, 'order_id');
    }

    /**
     * Relationship: Stock Pickings (Receipts)
     */
    public function pickings()
    {
        return $this->hasMany(StockPicking::class, 'purchase_id');
    }

    /**
     * Relationship: Vendor Bills
     */
    public function vendorBills()
    {
        return $this->hasMany(AccountMove::class, 'purchase_id')
                    ->where('move_type', 'in_invoice');
    }

    /**
     * Relationship: User
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    /**
     * Scope: Get only RFQ (draft state)
     */
    public function scopeRfq($query)
    {
        return $query->where('order_type', 'rfq')
                     ->whereIn('state', ['draft', 'sent', 'to approve']);
    }

    /**
     * Scope: Get only PO (confirmed)
     */
    public function scopePo($query)
    {
        return $query->where('order_type', 'po')
                     ->where('state', 'purchase');
    }

    /**
     * Scope: Filter by state
     */
    public function scopeByState($query, string $state)
    {
        return $query->where('state', $state);
    }

    /**
     * Confirm RFQ to PO
     */
    public function confirm()
    {
        $this->update([
            'order_type' => 'po',
            'state' => 'purchase',
            'date_confirm' => now(),
            'receipt_status' => 'to receive', // Jika ada produk storable
        ]);

        // Jika ada produk storable, buat stock picking otomatis
        $hasStorableProducts = $this->orderLines()
            ->whereHas('product', function ($q) {
                $q->where('type', 'product');
            })
            ->exists();

        if ($hasStorableProducts) {
            // Akan dibuat stock picking otomatis
            // Logic ini bisa dipindah ke service class
        }
    }
}

