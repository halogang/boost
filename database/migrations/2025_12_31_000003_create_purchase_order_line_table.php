<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Purchase Order Line table sesuai standar Odoo (purchase.order.line)
     * Detail produk dalam PO/RFQ
     */
    public function up(): void
    {
        Schema::create('purchase_order_line', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('purchase_order')->onDelete('cascade'); // Purchase Order
            $table->foreignId('product_id')->constrained('product_product')->onDelete('restrict'); // Product
            $table->string('name')->nullable(); // Product description (bisa berbeda dari product name)
            
            // Quantity
            $table->decimal('product_qty', 15, 3)->default(0.000); // Quantity yang dipesan
            $table->decimal('qty_received', 15, 3)->default(0.000); // Quantity yang sudah diterima
            $table->decimal('qty_invoiced', 15, 3)->default(0.000); // Quantity yang sudah di-invoice
            
            // UOM
            $table->foreignId('product_uom_id')->nullable()->constrained('uoms')->nullOnDelete(); // Unit of Measure
            
            // Price
            $table->decimal('price_unit', 15, 2)->default(0.00); // Harga per unit
            $table->decimal('price_subtotal', 15, 2)->default(0.00); // Subtotal (qty * price_unit)
            $table->decimal('price_tax', 15, 2)->default(0.00); // Pajak
            $table->decimal('price_total', 15, 2)->default(0.00); // Total (subtotal + tax)
            
            // Tax
            $table->string('tax_id')->nullable(); // Tax ID (PPN, etc)
            $table->decimal('tax_rate', 5, 2)->default(0.00); // Tax rate (11% = 11.00)
            
            // Date
            $table->date('date_planned')->nullable(); // Tanggal pengiriman untuk line ini
            
            // Status
            $table->enum('receipt_status', [
                'no',
                'to receive',
                'partial',
                'full'
            ])->default('no');
            
            $table->integer('order')->default(0); // Urutan
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('order_id');
            $table->index('product_id');
            $table->index('receipt_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_order_line');
    }
};

