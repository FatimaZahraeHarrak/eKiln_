// 2025_06_15_000000_create_affectation_trieur_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('affectation_trieur', function (Blueprint $table) {
            $table->id('id_affectation');
            $table->dateTime('date_affectation');
            $table->foreignId('id_famille')->constrained('familles', 'id_famille');
            $table->foreignId('id_user_chef')->constrained('users', 'id_user');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affectation_trieur');
    }
};
