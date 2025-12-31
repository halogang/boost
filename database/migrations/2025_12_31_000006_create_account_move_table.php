<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Account Move table sesuai standar Odoo (account.move)
     * Vendor Bill (Invoice Pembelian)
     */
    public function up(): void
    {
        Schema::create('account_move', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Nomor invoice (BILL/00001, etc)
            $table->foreignId('partner_id')->constrained('res_partner')->onDelete('restrict'); // Vendor
            $table->foreignId('purchase_id')->nullable()->constrained('purchase_order')->nullOnDelete(); // Purchase Order
            
            // Type
            $table->enum('move_type', [
                'entry',        // Journal Entry
                'out_invoice',  // Customer Invoice
                'out_refund',   // Customer Credit Note
                'in_invoice',   // Vendor Bill
                'in_refund',    // Vendor Credit Note
                'out_receipt',  // Customer Payment
                'in_receipt'    // Vendor Payment
            ])->default('in_invoice');
            
            // Status
            $table->enum('state', [
                'draft',        // Draft
                'posted',       // Posted
                'cancel'        // Cancelled
            ])->default('draft');
            
            // Payment Status
            $table->enum('payment_state', [
                'not_paid',     // Belum dibayar
                'partial',      // Partial payment
                'paid',         // Paid
                'invoicing_legacy' // Legacy
            ])->default('not_paid');
            
            // Dates
            $table->date('invoice_date'); // Tanggal invoice
            $table->date('invoice_date_due')->nullable(); // Tanggal jatuh tempo
            
            // Amounts
            $table->decimal('amount_untaxed', 15, 2)->default(0.00);
            $table->decimal('amount_tax', 15, 2)->default(0.00);
            $table->decimal('amount_total', 15, 2)->default(0.00);
            $table->decimal('amount_residual', 15, 2)->default(0.00); // Sisa yang belum dibayar
            
            // Currency
            $table->string('currency_id')->default('IDR');
            
            // Payment Term
            $table->string('invoice_payment_term_id')->nullable();
            
            // Journal
            $table->string('journal_id')->nullable(); // Purchase Journal
            
            // Reference
            $table->string('ref')->nullable(); // Reference dari vendor
            $table->text('narration')->nullable(); // Narration
            
            // User
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('invoice_date_sent')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('name');
            $table->index('partner_id');
            $table->index('purchase_id');
            $table->index('move_type');
            $table->index('state');
            $table->index('payment_state');
            $table->index('invoice_date');
            $table->index('invoice_date_due');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_move');
    }
};

