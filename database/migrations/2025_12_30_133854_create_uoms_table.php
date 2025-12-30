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
        Schema::create('uoms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category'); // Unit, Weight, Volume, Length, Time, etc
            $table->decimal('ratio', 15, 6)->default(1.0); // Conversion ratio to reference unit
            $table->enum('uom_type', ['reference', 'bigger', 'smaller'])->default('reference');
            $table->decimal('rounding', 10, 3)->default(0.01); // Rounding precision
            $table->boolean('active')->default(true);
            $table->text('description')->nullable();
            $table->integer('order')->default(0); // For ordering
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('category');
            $table->index('active');
            $table->index('uom_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uoms');
    }
};
