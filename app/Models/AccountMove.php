<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\AccountPayment;

class AccountMove extends Model
{
    use SoftDeletes;

    protected $table = 'account_move';

    protected $fillable = [
        'name',
        'partner_id',
        'purchase_id',
        'move_type',
        'state',
        'payment_state',
        'invoice_date',
        'invoice_date_due',
        'amount_untaxed',
        'amount_tax',
        'amount_total',
        'amount_residual',
        'currency_id',
        'invoice_payment_term_id',
        'journal_id',
        'ref',
        'narration',
        'user_id',
        'invoice_date_sent',
    ];

    protected $casts = [
        'invoice_date' => 'date',
        'invoice_date_due' => 'date',
        'amount_untaxed' => 'decimal:2',
        'amount_tax' => 'decimal:2',
        'amount_total' => 'decimal:2',
        'amount_residual' => 'decimal:2',
        'invoice_date_sent' => 'datetime',
    ];

    /**
     * Relationship: Partner (Vendor)
     */
    public function partner()
    {
        return $this->belongsTo(ResPartner::class, 'partner_id');
    }

    /**
     * Relationship: Purchase Order
     */
    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class, 'purchase_id');
    }

    /**
     * Relationship: Move Lines
     */
    public function moveLines()
    {
        return $this->hasMany(AccountMoveLine::class, 'move_id');
    }

    /**
     * Relationship: Payments
     */
    public function payments()
    {
        return $this->hasMany(AccountPayment::class, 'move_id');
    }

    /**
     * Relationship: User
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    /**
     * Scope: Get vendor bills
     */
    public function scopeVendorBills($query)
    {
        return $query->where('move_type', 'in_invoice');
    }

    /**
     * Scope: Filter by state
     */
    public function scopeByState($query, string $state)
    {
        return $query->where('state', $state);
    }

    /**
     * Scope: Filter by payment state
     */
    public function scopeByPaymentState($query, string $paymentState)
    {
        return $query->where('payment_state', $paymentState);
    }

    /**
     * Post invoice
     */
    public function post()
    {
        $this->update([
            'state' => 'posted',
        ]);
    }

    /**
     * Register payment
     */
    public function registerPayment($amount, $paymentMethod = 'bank', $paymentDate = null, $reference = null, $userId = null)
    {
        $newResidual = $this->amount_residual - $amount;
        
        $this->update([
            'amount_residual' => max(0, $newResidual),
            'payment_state' => $newResidual <= 0 ? 'paid' : 'partial',
        ]);
        
        // Create payment record
        $paymentNumber = $this->generatePaymentNumber();
        
        AccountPayment::create([
            'name' => $paymentNumber,
            'move_id' => $this->id,
            'partner_id' => $this->partner_id,
            'user_id' => $userId ?? auth()->id(),
            'payment_type' => 'outbound', // Vendor payment
            'payment_method' => $paymentMethod,
            'amount' => $amount,
            'currency_id' => $this->currency_id ?? 'IDR',
            'payment_date' => $paymentDate ?? now(),
            'ref' => $reference,
            'state' => 'posted',
            'journal_id' => $this->journal_id,
        ]);
    }
    
    /**
     * Generate payment number
     */
    private function generatePaymentNumber()
    {
        $year = now()->format('Y');
        $lastPayment = AccountPayment::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();
        
        $number = $lastPayment ? (int) substr($lastPayment->name, -5) + 1 : 1;
        
        return 'PAY/' . $year . '/' . str_pad($number, 5, '0', STR_PAD_LEFT);
    }
}

