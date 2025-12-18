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
        Schema::create('menu_positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')->constrained('menus')->cascadeOnDelete();
            $table->enum('device', ['desktop', 'mobile']);
            $table->enum('position', ['sidebar', 'bottom', 'drawer']);
            $table->timestamps();

            // Ensure unique menu per device and position
            $table->unique(['menu_id', 'device', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_positions');
    }
};
