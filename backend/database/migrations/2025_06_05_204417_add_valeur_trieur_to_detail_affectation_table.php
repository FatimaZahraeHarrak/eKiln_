<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('detail_affectation', function (Blueprint $table) {
            $table->integer('valeur_trieur')->nullable()->after('quantite_tri');
        });
    }

    public function down(): void
    {
        Schema::table('detail_affectation', function (Blueprint $table) {
            $table->dropColumn('valeur_trieur');
        });
    }
};
