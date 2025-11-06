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
        Schema::table('t_restaurants', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
           // $table->decimal('latitude', 10, 7)->nullable()->after('address');
            //$table->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('t_restaurants', function (Blueprint $table) {
            $table->dropColumn(['user_id']);
        });
    }
};