<?php

namespace Database\Seeders;

use App\Models\ResPartner;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResPartnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Data vendor/supplier sesuai standar Odoo
     */
    public function run(): void
    {
        $vendors = [
            [
                'name' => 'Supplier Air Baku',
                'display_name' => 'Supplier Air Baku',
                'is_company' => true,
                'is_supplier' => true,
                'is_customer' => false,
                'supplier_rank' => 1,
                'customer_rank' => 0,
                'phone' => '021-12345678',
                'mobile' => '081234567890',
                'email' => 'supplier@airbaku.com',
                'website' => null,
                'street' => 'Jl. Raya Air Baku No. 123',
                'street2' => null,
                'city' => 'Jakarta',
                'state_id' => 'DKI Jakarta',
                'zip' => '12345',
                'country_id' => 'ID',
                'property_payment_term_id' => '30_days',
                'currency_id' => 'IDR',
                'has_price_list' => false,
                'active' => true,
                'comment' => 'Supplier untuk air baku',
            ],
            [
                'name' => 'Supplier Kemasan',
                'display_name' => 'Supplier Kemasan',
                'is_company' => true,
                'is_supplier' => true,
                'is_customer' => false,
                'supplier_rank' => 1,
                'customer_rank' => 0,
                'phone' => '021-23456789',
                'mobile' => '081234567891',
                'email' => 'supplier@kemasan.com',
                'website' => null,
                'street' => 'Jl. Raya Kemasan No. 456',
                'street2' => null,
                'city' => 'Bandung',
                'state_id' => 'Jawa Barat',
                'zip' => '23456',
                'country_id' => 'ID',
                'property_payment_term_id' => '30_days',
                'currency_id' => 'IDR',
                'has_price_list' => false,
                'active' => true,
                'comment' => 'Supplier untuk galon, tutup galon, dan kemasan lainnya',
            ],
            [
                'name' => 'Supplier Kebersihan',
                'display_name' => 'Supplier Kebersihan',
                'is_company' => true,
                'is_supplier' => true,
                'is_customer' => false,
                'supplier_rank' => 1,
                'customer_rank' => 0,
                'phone' => '021-34567890',
                'mobile' => '081234567892',
                'email' => 'supplier@kebersihan.com',
                'website' => null,
                'street' => 'Jl. Raya Kebersihan No. 789',
                'street2' => null,
                'city' => 'Surabaya',
                'state_id' => 'Jawa Timur',
                'zip' => '34567',
                'country_id' => 'ID',
                'property_payment_term_id' => '30_days',
                'currency_id' => 'IDR',
                'has_price_list' => false,
                'active' => true,
                'comment' => 'Supplier untuk tisu, sabun, dan produk kebersihan',
            ],
            [
                'name' => 'Supplier Filter',
                'display_name' => 'Supplier Filter',
                'is_company' => true,
                'is_supplier' => true,
                'is_customer' => false,
                'supplier_rank' => 1,
                'customer_rank' => 0,
                'phone' => '021-45678901',
                'mobile' => '081234567893',
                'email' => 'supplier@filter.com',
                'website' => null,
                'street' => 'Jl. Raya Filter No. 321',
                'street2' => null,
                'city' => 'Jakarta',
                'state_id' => 'DKI Jakarta',
                'zip' => '45678',
                'country_id' => 'ID',
                'property_payment_term_id' => '30_days',
                'currency_id' => 'IDR',
                'has_price_list' => false,
                'active' => true,
                'comment' => 'Supplier untuk media filter dan spare part filter',
            ],
        ];

        foreach ($vendors as $vendor) {
            ResPartner::firstOrCreate(
                ['name' => $vendor['name']],
                $vendor
            );
        }
    }
}

