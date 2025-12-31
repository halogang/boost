<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_product', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('default_code')->nullable()->unique(); // Internal Reference / SKU
            $table->string('barcode')->nullable()->unique(); // Barcode
            $table->text('description')->nullable(); // Description
            $table->text('description_purchase')->nullable(); // Purchase Description
            $table->text('description_sale')->nullable(); // Sale Description
            $table->enum('type', ['consu', 'service', 'product'])->default('consu'); // Product Type: consumable (ATK, barang habis pakai), service (jasa), product (storable/inventori)
            $table->enum('purchase_method', ['purchase', 'make_to_order', 'receive'])->default('purchase'); // Purchase Method: purchase (biasa), make_to_order (pesan dulu), receive (terima langsung)
            $table->boolean('purchase_ok')->default(true); // Can be Purchased (untuk RFQ/PO)
            $table->boolean('sale_ok')->default(false); // Can be Sold (untuk penjualan)
            $table->boolean('active')->default(true); // Active
            $table->foreignId('uom_id')->nullable()->constrained('uoms')->nullOnDelete(); // Unit of Measure
            $table->foreignId('uom_po_id')->nullable()->constrained('uoms')->nullOnDelete(); // Purchase Unit of Measure
            $table->decimal('list_price', 15, 2)->default(0.00); // Sales Price (harga jual)
            $table->decimal('standard_price', 15, 2)->default(0.00); // Cost / Purchase Price (harga beli untuk PO)
            $table->integer('categ_id')->nullable(); // Product Category (will be linked later)
            $table->string('categ_name')->nullable(); // Category Name (temporary, for filtering)
            $table->integer('order')->default(0); // For ordering
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('default_code');
            $table->index('barcode');
            $table->index('type');
            $table->index('active');
            $table->index('purchase_ok');
            $table->index('categ_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_product');
    }
};

