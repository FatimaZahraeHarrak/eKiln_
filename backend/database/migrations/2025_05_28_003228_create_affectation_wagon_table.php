// 2025_06_15_000002_create_affectation_wagon_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('affectation_wagon', function (Blueprint $table) {
            $table->foreignId('id_affectation')
                  ->constrained('affectation_trieur', 'id_affectation')
                  ->cascadeOnDelete();

            $table->foreignId('id_wagon')
                  ->constrained('wagons', 'id_wagon')
                  ->cascadeOnDelete();

            $table->primary(['id_affectation', 'id_wagon']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affectation_wagon');
    }
};
