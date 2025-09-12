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
    Schema::create('chargements', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('id_user');
        $table->unsignedBigInteger('id_wagon');
        $table->unsignedBigInteger('id_four');
        $table->timestamp('datetime_chargement')->useCurrent();
        $table->timestamp('datetime_sortieEstime')->nullable();
        $table->enum('statut', ['en attente', 'en cuisson', 'prêt à sortir', 'sorti'])->default('en attente');
        $table->timestamps();


        $table->foreign('id_user')->references('id_user')->on('users');
        $table->foreign('id_wagon')->references('id_wagon')->on('wagons');
        $table->foreign('id_four')->references('id_four')->on('fours');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chargements');
    }
};
