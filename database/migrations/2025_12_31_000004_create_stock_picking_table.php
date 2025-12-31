<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Stock Picking table sesuai standar Odoo (stock.picking)
     * Receipt / Goods Receipt untuk penerimaan barang
     */
    public function up(): void
    {
        Schema::create('stock_picking', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Nomor receipt (WH/IN/00001, etc)
            $table->foreignId('purchase_id')->nullable()->constrained('purchase_order')->nullOnDelete(); // Purchase Order (jika dari PO)
            
            // Type
            $table->enum('picking_type_code', [
                'incoming',    // Receipt (penerimaan)
                'outgoing',    // Delivery (pengiriman)
                'internal'     // Internal transfer
            ])->default('incoming');
            
            // Location
            $table->string('location_id')->nullable(); // Source location
            $table->string('location_dest_id')->nullable(); // Destination location (warehouse)
            
            // Status
            $table->enum('state', [
                'draft',       // Draft
                'waiting',     // Waiting
                'confirmed',   // Confirmed
                'assigned',    // Assigned
                'done',        // Done (received)
                'cancel'       // Cancelled
            ])->default('draft');
            
            // Dates
            $table->date('scheduled_date')->nullable(); // Tanggal yang dijadwalkan
            $table->dateTime('date_done')->nullable(); // Tanggal selesai (received)
            
            // User
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // User yang handle
            
            // Notes
            $table->text('note')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('name');
            $table->index('purchase_id');
            $table->index('picking_type_code');
            $table->index('state');
            $table->index('scheduled_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_picking');
    }
};

