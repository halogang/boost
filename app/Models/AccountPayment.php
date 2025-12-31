<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccountPayment extends Model
{
    use SoftDeletes;

    protected $table = 'account_payment';

    protected $fillable = [
        'name',
        'move_id',
        'partner_id',
        'user_id',
        'payment_type',
        'payment_method',
        'amount',
        'currency_id',
        'payment_date',
        'ref',
        'state',
        'journal_id',
        'narration',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
    ];

    /**
     * Relationship: Account Move (Vendor Bill)
     */
    public function move()
    {
        return $this->belongsTo(AccountMove::class, 'move_id');
    }

    /**
     * Relationship: Partner (Vendor)
     */
    public function partner()
    {
        return $this->belongsTo(ResPartner::class, 'partner_id');
    }

    /**
     * Relationship: User
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    /**
     * Scope: Get vendor payments (outbound)
     */
    public function scopeVendorPayments($query)
    {
        return $query->where('payment_type', 'outbound');
    }

    /**
     * Scope: Filter by state
     */
    public function scopeByState($query, string $state)
    {
        return $query->where('state', $state);
    }
}
