<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Account Payment table sesuai standar Odoo (account.payment)
     * Payment History untuk Vendor Bill
     */
    public function up(): void
    {
        Schema::create('account_payment', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Nomor payment (PAY/00001, etc)
            $table->foreignId('move_id')->constrained('account_move')->onDelete('restrict'); // Vendor Bill
            $table->foreignId('partner_id')->constrained('res_partner')->onDelete('restrict'); // Vendor
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // User yang membuat payment
            
            // Payment Type
            $table->enum('payment_type', [
                'inbound',  // Customer Payment (masuk)
                'outbound'  // Vendor Payment (keluar)
            ])->default('outbound');
            
            // Payment Method
            $table->enum('payment_method', [
                'bank',     // Bank Transfer
                'cash',     // Cash
                'giro'      // Giro/Check
            ])->default('bank');
            
            // Amount
            $table->decimal('amount', 15, 2)->default(0.00);
            $table->string('currency_id')->default('IDR');
            
            // Payment Date
            $table->date('payment_date');
            
            // Reference / Bukti Pembayaran
            $table->string('ref')->nullable(); // Nomor bukti pembayaran
            
            // Status
            $table->enum('state', [
                'draft',        // Draft
                'posted',       // Posted
                'sent',         // Sent
                'reconciled',   // Reconciled
                'cancelled'     // Cancelled
            ])->default('posted');
            
            // Journal
            $table->string('journal_id')->nullable(); // Payment journal
            
            // Notes
            $table->text('narration')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('move_id');
            $table->index('partner_id');
            $table->index('payment_date');
            $table->index('state');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_payment');
    }
};
