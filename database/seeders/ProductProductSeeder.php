<?php

namespace Database\Seeders;

use App\Models\ProductProduct;
use App\Models\Uom;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Data produk pembelian sesuai standar Odoo
     */
    public function run(): void
    {
        // Get UOM references
        $unitUom = Uom::where('name', 'Unit')->first();
        $literUom = Uom::where('name', 'Liter')->first();
        $kgUom = Uom::where('name', 'Kilogram')->first();
        $boxUom = Uom::where('name', 'Box')->first();
        $packUom = Uom::where('name', 'Pack')->first();

        $products = [
            [
                'name' => 'Air Baku',
                'default_code' => 'AIR-BAKU-001',
                'barcode' => null,
                'description' => 'Air baku untuk proses produksi air minum',
                'description_purchase' => 'Air baku untuk proses produksi air minum',
                'description_sale' => null,
                'type' => 'product', // Storable Product - disimpan di tangki/gudang, digunakan untuk manufaktur
                'purchase_method' => 'purchase',
                'purchase_ok' => true, // Bisa dibeli via RFQ/PO
                'sale_ok' => false,
                'active' => true,
                'uom_id' => $literUom?->id,
                'uom_po_id' => $literUom?->id,
                'list_price' => 0.00, // Harga jual (jika dijual)
                'standard_price' => 0.00, // Harga beli standar (akan diisi saat PO)
                'categ_name' => 'Bahan Baku',
                'order' => 1,
            ],
            [
                'name' => 'Galon',
                'default_code' => 'GALON-001',
                'barcode' => null,
                'description' => 'Galon untuk kemasan air minum',
                'description_purchase' => 'Galon kosong untuk kemasan air minum',
                'description_sale' => null,
                'type' => 'product', // Storable Product - bisa diinventori
                'purchase_method' => 'purchase',
                'purchase_ok' => true,
                'sale_ok' => false,
                'active' => true,
                'uom_id' => $unitUom?->id,
                'uom_po_id' => $unitUom?->id,
                'list_price' => 0.00,
                'standard_price' => 0.00,
                'categ_name' => 'Kemasan',
                'order' => 2,
            ],
            [
                'name' => 'Tutup Galon',
                'default_code' => 'TUTUP-GALON-001',
                'barcode' => null,
                'description' => 'Tutup galon untuk kemasan air minum',
                'description_purchase' => 'Tutup galon untuk kemasan',
                'description_sale' => null,
                'type' => 'consu', // Consumable
                'purchase_method' => 'purchase',
                'purchase_ok' => true,
                'sale_ok' => false,
                'active' => true,
                'uom_id' => $unitUom?->id,
                'uom_po_id' => $unitUom?->id,
                'list_price' => 0.00,
                'standard_price' => 0.00,
                'categ_name' => 'Kemasan',
                'order' => 3,
            ],
            [
                'name' => 'Tisu',
                'default_code' => 'TISU-001',
                'barcode' => null,
                'description' => 'Tisu untuk keperluan produksi dan kebersihan',
                'description_purchase' => 'Tisu untuk keperluan kebersihan',
                'description_sale' => null,
                'type' => 'consu', // Consumable - ATK/barang habis pakai
                'purchase_method' => 'purchase',
                'purchase_ok' => true,
                'sale_ok' => false,
                'active' => true,
                'uom_id' => $packUom?->id,
                'uom_po_id' => $packUom?->id,
                'list_price' => 0.00,
                'standard_price' => 0.00,
                'categ_name' => 'Kebersihan',
                'order' => 4,
            ],
            [
                'name' => 'Sabun',
                'default_code' => 'SABUN-001',
                'barcode' => null,
                'description' => 'Sabun untuk keperluan kebersihan dan sanitasi',
                'description_purchase' => 'Sabun untuk kebersihan dan sanitasi',
                'description_sale' => null,
                'type' => 'consu', // Consumable
                'purchase_method' => 'purchase',
                'purchase_ok' => true,
                'sale_ok' => false,
                'active' => true,
                'uom_id' => $unitUom?->id,
                'uom_po_id' => $unitUom?->id,
                'list_price' => 0.00,
                'standard_price' => 0.00,
                'categ_name' => 'Kebersihan',
                'order' => 5,
            ],
            [
                'name' => 'Media Filter',
                'default_code' => 'MEDIA-FILTER-001',
                'barcode' => null,
                'description' => 'Media filter untuk sistem filtrasi air. Perlu diganti secara berkala karena dapat kotor setelah penggunaan lama (seperti saringan yang perlu maintenance).',
                'description_purchase' => 'Media filter untuk sistem filtrasi - perlu diganti berkala karena kotor setelah penggunaan lama',
                'description_sale' => null,
                'type' => 'consu', // Consumable - perlu diganti berkala
                'purchase_method' => 'purchase',
                'purchase_ok' => true,
                'sale_ok' => false,
                'active' => true,
                'uom_id' => $unitUom?->id,
                'uom_po_id' => $unitUom?->id,
                'list_price' => 0.00,
                'standard_price' => 0.00,
                'categ_name' => 'Filter & Maintenance',
                'order' => 6,
            ],
        ];

        foreach ($products as $product) {
            ProductProduct::firstOrCreate(
                ['default_code' => $product['default_code']],
                $product
            );
        }
    }
}

