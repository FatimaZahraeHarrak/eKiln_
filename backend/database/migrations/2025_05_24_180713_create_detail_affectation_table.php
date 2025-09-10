// 2025_06_15_000001_create_detail_affectation_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('detail_affectation', function (Blueprint $table) {
            $table->id('id_detail_affectation');
            $table->foreignId('id_affectation')->constrained('affectation_trieur', 'id_affectation');
            $table->foreignId('id_user')->constrained('users', 'id_user');
            $table->foreignId('id_famille')->constrained('familles', 'id_famille');
            $table->integer('quantite_tri');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_affectation');
    }
};
