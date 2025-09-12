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
        Schema::table('familles', function (Blueprint $table) {
            $table->decimal('valeur_trieur', 10, 2)->nullable()->after('nom_famille');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('familles', function (Blueprint $table) {
            $table->dropColumn('valeur_trieur');
        });
    }
};
