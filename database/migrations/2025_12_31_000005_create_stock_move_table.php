<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Stock Move table sesuai standar Odoo (stock.move)
     * Detail per produk dalam receipt
     */
    public function up(): void
    {
        Schema::create('stock_move', function (Blueprint $table) {
            $table->id();
            $table->foreignId('picking_id')->nullable()->constrained('stock_picking')->onDelete('cascade'); // Stock Picking
            $table->foreignId('purchase_line_id')->nullable()->constrained('purchase_order_line')->nullOnDelete(); // Purchase Order Line
            $table->foreignId('product_id')->constrained('product_product')->onDelete('restrict'); // Product
            
            // Quantity
            $table->decimal('product_uom_qty', 15, 3)->default(0.000); // Quantity yang direncanakan
            $table->decimal('quantity_done', 15, 3)->default(0.000); // Quantity yang benar-benar diterima
            $table->foreignId('product_uom_id')->nullable()->constrained('uoms')->nullOnDelete(); // UOM
            
            // Location
            $table->string('location_id')->nullable(); // Source
            $table->string('location_dest_id')->nullable(); // Destination
            
            // Status
            $table->enum('state', [
                'draft',
                'waiting',
                'confirmed',
                'assigned',
                'done',
                'cancel'
            ])->default('draft');
            
            // Reference
            $table->string('reference')->nullable(); // Reference dari PO
            
            $table->integer('order')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('picking_id');
            $table->index('product_id');
            $table->index('purchase_line_id');
            $table->index('state');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_move');
    }
};

