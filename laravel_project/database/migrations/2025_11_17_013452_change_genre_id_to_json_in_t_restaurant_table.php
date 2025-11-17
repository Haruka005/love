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
        Schema::table('t_restaurant', function (Blueprint $table) {
            // genre_id を削除して json 型で再作成
            $table->dropColumn('genre_id');
            $table->json('genre_id')->nullable()->after('area_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('t_restaurant', function (Blueprint $table) {
            // json 型を削除して元の bigint 型に戻す
            $table->dropColumn('genre_id');
            $table->unsignedBigInteger('genre_id')->nullable()->after('area_id');
        });
    }
};