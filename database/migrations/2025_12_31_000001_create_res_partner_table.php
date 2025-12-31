<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Vendor/Supplier table sesuai standar Odoo (res_partner)
     */
    public function up(): void
    {
        Schema::create('res_partner', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nama vendor
            $table->string('display_name')->nullable(); // Nama tampilan
            $table->boolean('is_company')->default(true); // Apakah perusahaan
            $table->boolean('is_supplier')->default(true); // Apakah supplier
            $table->boolean('is_customer')->default(false); // Apakah customer
            $table->integer('supplier_rank')->default(0); // Ranking supplier (0 = bukan supplier, >0 = supplier)
            $table->integer('customer_rank')->default(0); // Ranking customer
            
            // Kontak
            $table->string('phone')->nullable();
            $table->string('mobile')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            
            // Alamat
            $table->text('street')->nullable(); // Jalan
            $table->string('street2')->nullable(); // Jalan 2
            $table->string('city')->nullable(); // Kota
            $table->string('state_id')->nullable(); // Provinsi
            $table->string('zip')->nullable(); // Kode pos
            $table->string('country_id')->default('ID'); // Negara (default Indonesia)
            
            // Payment & Currency
            $table->string('property_payment_term_id')->nullable(); // Payment term (30 days, 60 days, etc)
            $table->string('currency_id')->default('IDR'); // Currency (IDR, USD, etc)
            
            // Vendor Pricelist (opsional)
            $table->boolean('has_price_list')->default(false); // Punya pricelist khusus
            
            // Status
            $table->boolean('active')->default(true);
            $table->text('comment')->nullable(); // Catatan
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('name');
            $table->index('is_supplier');
            $table->index('supplier_rank');
            $table->index('active');
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('res_partner');
    }
};

