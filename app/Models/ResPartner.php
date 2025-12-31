<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\AccountMove;

class ResPartner extends Model
{
    use SoftDeletes;

    protected $table = 'res_partner';

    protected $fillable = [
        'name',
        'display_name',
        'is_company',
        'is_supplier',
        'is_customer',
        'supplier_rank',
        'customer_rank',
        'phone',
        'mobile',
        'email',
        'website',
        'street',
        'street2',
        'city',
        'state_id',
        'zip',
        'country_id',
        'property_payment_term_id',
        'currency_id',
        'has_price_list',
        'active',
        'comment',
    ];

    protected $casts = [
        'is_company' => 'boolean',
        'is_supplier' => 'boolean',
        'is_customer' => 'boolean',
        'supplier_rank' => 'integer',
        'customer_rank' => 'integer',
        'has_price_list' => 'boolean',
        'active' => 'boolean',
    ];

    /**
     * Scope: Get only suppliers
     */
    public function scopeSuppliers($query)
    {
        return $query->where('is_supplier', true)
                     ->where('supplier_rank', '>', 0)
                     ->where('active', true);
    }

    /**
     * Scope: Get only active partners
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Relationship: Purchase Orders
     */
    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class, 'partner_id');
    }

    /**
     * Relationship: Vendor Bills
     */
    public function vendorBills()
    {
        return $this->hasMany(AccountMove::class, 'partner_id')
                    ->where('move_type', 'in_invoice');
    }
}

