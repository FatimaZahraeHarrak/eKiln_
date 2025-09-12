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
    Schema::create('wagons', function (Blueprint $table) {
        $table->id('id_wagon');
        $table->string('num_wagon');
        $table->string('type_wagon', 50);
        $table->string('statut')->enum('Statut', ['disponible', 'En maintenance','Non disponible '])->default('disponible');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wagons');
    }
};
