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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('posts'); //relatie
            $table->foreignId('seller_id')->constrained('users');
            $table->foreignId('buyer_id')->constrained('users');
            $table->string('name');
            $table->text('address');
            $table->timestamps();
            $table->string('buyer_email');
            $table->string('buyer_phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
