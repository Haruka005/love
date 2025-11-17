<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('t_restaurant', function (Blueprint $table) {
            $table->dropColumn('genre_id');
            $table->json('genre_id')->nullable()->after('area_id');
        });
    }

    public function down(): void
    {
        Schema::table('t_restaurant', function (Blueprint $table) {
            $table->dropColumn('genre_id');
            $table->unsignedBigInteger('genre_id')->nullable()->after('area_id');
        });
    }
};