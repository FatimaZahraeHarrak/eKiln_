<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('polyvalences', function (Blueprint $table) {
            $table->id('id_polyvalence');
            $table->foreignId('id_famille')->constrained('familles', 'id_famille');
            $table->foreignId('id_user')->constrained('users', 'id_user');
            $table->unique(['id_famille', 'id_user']); // Évite les doublons
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('polyvalences');
    }
};
