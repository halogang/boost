<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Purchase Order table sesuai standar Odoo (purchase.order)
     * Menyimpan RFQ dan PO (berbeda status)
     */
    public function up(): void
    {
        Schema::create('purchase_order', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Nomor PO/RFQ (PO001, RFQ001, etc)
            $table->foreignId('partner_id')->constrained('res_partner')->onDelete('restrict'); // Vendor/Supplier
            $table->date('date_order'); // Tanggal order
            $table->date('date_planned')->nullable(); // Tanggal pengiriman yang direncanakan
            
            // Status sesuai Odoo
            $table->enum('state', [
                'draft',           // RFQ - Draft
                'sent',            // RFQ - Sent to Vendor
                'to approve',      // RFQ - Waiting Approval
                'purchase',        // PO - Confirmed
                'done',            // PO - Received
                'cancel'           // Cancelled
            ])->default('draft');
            
            // Type: RFQ atau PO
            $table->enum('order_type', ['rfq', 'po'])->default('rfq');
            
            // Currency & Payment
            $table->string('currency_id')->default('IDR');
            $table->string('payment_term_id')->nullable(); // Payment term dari vendor
            
            // Amounts
            $table->decimal('amount_untaxed', 15, 2)->default(0.00); // Subtotal tanpa pajak
            $table->decimal('amount_tax', 15, 2)->default(0.00); // Total pajak
            $table->decimal('amount_total', 15, 2)->default(0.00); // Total dengan pajak
            
            // Receipt Status
            $table->enum('receipt_status', [
                'no',              // Belum ada receipt
                'to receive',      // Menunggu receipt
                'partial',         // Partial receipt
                'full'             // Full receipt
            ])->default('no');
            
            // Invoice Status
            $table->enum('invoice_status', [
                'no',              // Belum ada invoice
                'to invoice',      // Menunggu invoice
                'invoiced',        // Sudah di-invoice
                'paid'             // Sudah dibayar
            ])->default('no');
            
            // Warehouse & Location (untuk receipt)
            $table->string('picking_type_id')->nullable(); // Incoming shipment type
            $table->string('location_id')->nullable(); // Destination location
            
            // Notes
            $table->text('notes')->nullable(); // Catatan internal
            $table->text('terms')->nullable(); // Terms & conditions
            
            // User & Dates
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // User yang membuat
            $table->dateTime('date_approve')->nullable(); // Tanggal approve
            $table->dateTime('date_confirm')->nullable(); // Tanggal confirm (RFQ -> PO)
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('name');
            $table->index('partner_id');
            $table->index('state');
            $table->index('order_type');
            $table->index('date_order');
            $table->index('receipt_status');
            $table->index('invoice_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_order');
    }
};

