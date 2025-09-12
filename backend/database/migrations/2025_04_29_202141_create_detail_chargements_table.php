<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('detail_chargements', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('id_chargement');
        $table->unsignedBigInteger('id_famille');
        $table->integer('quantite');
        $table->timestamps();

        $table->foreign('id_chargement')->references('id')->on('chargements')->onDelete('cascade');
        $table->foreign('id_famille')->references('id_famille')->on('familles');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_chargements');
    }
};
