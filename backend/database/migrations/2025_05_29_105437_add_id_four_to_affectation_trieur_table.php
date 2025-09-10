// database/migrations/2025_06_15_000003_add_id_four_to_affectation_trieur.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('affectation_trieur', function (Blueprint $table) {
        $table->unsignedBigInteger('id_four')->nullable(); // étape 1 : ajouter la colonne
    });
    }

    public function down(): void
    {
        Schema::table('affectation_trieur', function (Blueprint $table) {
            $table->dropForeign(['id_four']);
            $table->dropColumn('id_four');
        });
    }
};
