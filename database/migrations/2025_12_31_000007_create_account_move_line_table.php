<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Account Move Line table sesuai standar Odoo (account.move.line)
     * Detail line dalam Vendor Bill
     */
    public function up(): void
    {
        Schema::create('account_move_line', function (Blueprint $table) {
            $table->id();
            $table->foreignId('move_id')->constrained('account_move')->onDelete('cascade'); // Account Move (Vendor Bill)
            $table->foreignId('purchase_line_id')->nullable()->constrained('purchase_order_line')->nullOnDelete(); // Purchase Order Line
            $table->foreignId('product_id')->nullable()->constrained('product_product')->nullOnDelete(); // Product
            
            $table->string('name'); // Description
            $table->decimal('quantity', 15, 3)->default(0.000); // Quantity
            $table->decimal('price_unit', 15, 2)->default(0.00); // Price per unit
            $table->decimal('price_subtotal', 15, 2)->default(0.00); // Subtotal
            $table->decimal('price_total', 15, 2)->default(0.00); // Total dengan tax
            
            // Account
            $table->string('account_id')->nullable(); // Account (expense, etc)
            
            // Tax
            $table->string('tax_id')->nullable();
            $table->decimal('tax_rate', 5, 2)->default(0.00);
            
            $table->integer('order')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('move_id');
            $table->index('product_id');
            $table->index('purchase_line_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_move_line');
    }
};

