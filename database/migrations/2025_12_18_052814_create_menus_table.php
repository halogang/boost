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
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // "Dashboard", "Pesanan", dll
            $table->string('icon')->nullable(); // SVG class or URL
            $table->string('route')->nullable(); // "/admin/users", "/orders", dll
            $table->string('permission')->nullable(); // "read users", "read orders", dll
            $table->foreignId('parent_id')->nullable()->constrained('menus')->cascadeOnDelete(); // Untuk submenu
            $table->integer('order')->default(0); // Sorting
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
